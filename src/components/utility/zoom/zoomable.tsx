/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
import enums = require('../enums');
import zoomAttribute = require('./typings/zoomattributes');
import responseStore = require('../../../stores/response/responsestore');
import eventManagerBase = require('../../base/eventmanager/eventmanagerbase');
import eventTypes = require('../../base/eventmanager/eventtypes');
import htmlUtils = require('../../../utility/generic/htmlutilities');
import zoomPanelActionCreator = require('../../../actions/zoompanel/zoompanelactioncreator');
import userOptionHelper = require('../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import constants = require('../constants');
import timerHelper = require('../../../utility/generic/timerhelper');
import responseHelper = require('../responsehelper/responsehelper');
import markingStore = require('../../../stores/marking/markingstore');
import stampActionCreator = require('../../../actions/stamp/stampactioncreator');

interface State {
    renderedOn?: number;
}

class Zoomable extends eventManagerBase {

    // Holds the current zoomtype
    private zoomType: enums.ZoomType;

    // Holds the event that triggered while zooming.
    private zoomEvent: any;

    // Holds the positions while pinching
    private deltaX: number;
    private deltaY: number;

    // Holds the value which indicate the pinchEnd has been triggered
    private isPinchEnd: boolean = false;

    // Holds the value which indicate whether
    // the zoom is to be prevented
    private isPreventZoom: boolean = true;

	private markSheetHolderTransition: any;

    /** refs */
    public refs: {
        [key: string]: (Element);
        contentHolder: (HTMLDivElement);
    };

    /**
     * @Constructor
     */
    constructor(props: any, state: State) {
        super(props, state);

        this.state = {
            renderedOn: Date.now()
        };

        this.zoomEvent = undefined;
        this.zoomType = enums.ZoomType.None;
        this.onCustomZoomUpdated = this.onCustomZoomUpdated.bind(this);
        this.responseZoomUpdated = this.responseZoomUpdated.bind(this);
        this.onPinchIn = this.onPinchIn.bind(this);
        this.onPinchOut = this.onPinchOut.bind(this);
        this.onPinchEnd = this.onPinchEnd.bind(this);
        this.onPinchCancel = this.onPinchCancel.bind(this);
        this.onPanMove = this.onPanMove.bind(this);
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
		this.initiatingZoom = this.initiatingZoom.bind(this);
    }

    /**
     * render method
     * 
     * @returns {JSX.Element} 
     * @memberof Zoomable
     */
	public render(): JSX.Element {
        let that = this;
        let child;
        let attributes: zoomAttribute = { zoomType: this.zoomType, zoomEvent: this.zoomEvent };
        if (Array.isArray(this.props.children)) {
            child = this.props.children.map(function (item: any, i: number) {
                return React.cloneElement(item, { zoomAttributes: attributes, initiatingZoom: that.initiatingZoom });
            });

        } else {
            child = React.cloneElement(this.props.children as React.ReactElement<any>,
                { zoomAttributes: attributes, initiatingZoom: that.initiatingZoom });
        }

        return (
            <div className='marksheet-content-holder' ref='contentHolder'>
                {child}
            </div>
        );
    }

    /**
     * This function gets invoked when the component is updated
     */
    public componentDidUpdate() {
        let that = this;

        // Update the window on message panel appears. We should add a wait time of this because, zoom size animation
        // has a animation delay. unless we provide this delay will result getting a wrong width
        // NOTE: consulted with UI expert to approve this.
		// Added MarksheetAnimationTimeOut for device as well. Fix for defect #65519
        if (this.props.onContainerWidthUpdated && this.zoomType === enums.ZoomType.None) {
            setTimeout(() => {
                if (that.refs.contentHolder) {
                    that.props.onContainerWidthUpdated(that.refs.contentHolder.clientWidth, that.refs.contentHolder.clientHeight);
                }
			}, constants.MARKSHEETS_ANIMATION_TIMEOUT);
        }
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        this.setUpEvents();
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT, this.onCustomZoomUpdated);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.responseZoomUpdated);
        this.markSheetHolderTransition = document.getElementsByClassName('marksheet-view-holder').item(0);
        if (this.markSheetHolderTransition) {
            this.markSheetHolderTransition.addEventListener('transitionend', this.onAnimationEnd);
            this.markSheetHolderTransition.addEventListener('webkitTransitionEnd', this.onAnimationEnd);
		}
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT, this.onCustomZoomUpdated);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.responseZoomUpdated);
        this.unRegisterEvents();

        if (this.markSheetHolderTransition) {
            this.markSheetHolderTransition.removeEventListener('transitionend webkitTransitionEnd', this.onAnimationEnd);
            this.markSheetHolderTransition.removeEventListener('webkitTransitionEnd', this.onAnimationEnd);
		}
    }

    /**
     * This will setup events
     */
    private setUpEvents() {
        let element: Element = ReactDom.findDOMNode(this);

        if (element && !this.eventHandler.isInitialized) {
            // we don't want hammer in MS Touch devices like surface because it containes pointer events
            let touchActionValue: string = 'pan-x pan-y';
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.PINCH, { enable: true });
            this.eventHandler.get(eventTypes.PINCH, { threshold: 0, pointers: 2 });
            this.eventHandler.on(eventTypes.PINCH_START, this.onPinchStart);
            this.eventHandler.on(eventTypes.PINCH_IN, this.onPinchIn);
            this.eventHandler.on(eventTypes.PINCH_OUT, this.onPinchOut);
            this.eventHandler.on(eventTypes.PINCH_END, this.onPinchEnd);
            this.eventHandler.on(eventTypes.PINCH_CANCEL, this.onPinchCancel);
            this.eventHandler.get(eventTypes.PAN, { threshold: 1 });
            this.eventHandler.on(eventTypes.PAN, this.onPanMove);
        }
    }

    /**
     * unregister events
     */
    private unRegisterEvents() {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    }

    /**
     * trigger on pan move to prevent pan while pinch zoom
     */
    private onPanMove = (event: EventCustom) => {
        if (this.isPreventZoom === true) {
            event.preventDefault();
            event.srcEvent.stopPropagation();
            this.isPreventZoom = false;
        }
    };

    /**
     * Trigger on pinch start.
     */
    private onPinchStart = (event: EventCustom) => {
        this.props.onPinchStart(event);
        event.preventDefault();
        event.srcEvent.preventDefault();
        event.srcEvent.stopPropagation();
        this.isPinchEnd = false;
        this.isPreventZoom = true;
    };

    /**
     * Trigger on pinch start.
     */
    private onPinchIn = (event: EventCustom) => {
        event.preventDefault();
        event.srcEvent.preventDefault();
        event.srcEvent.stopPropagation();
        if ((event.deltaX !== this.deltaX || event.deltaY !== this.deltaY) && this.isPinchEnd === false) {

            this.deltaX = event.deltaX;
            this.deltaY = event.deltaY;

            this.triggerZoom(enums.ZoomType.PinchIn, event);
        }
    };

    /*
     * trigger on pinch Out
     */
    private onPinchOut = (event: EventCustom) => {
        event.preventDefault();
        event.srcEvent.stopPropagation();

        if ((event.deltaX !== this.deltaX || event.deltaY !== this.deltaY) && this.isPinchEnd === false) {

            this.deltaX = event.deltaX;
            this.deltaY = event.deltaY;

            this.triggerZoom(enums.ZoomType.PinchOut, event);
        }
    };

    /*
     * trigger on pinch End
     */
    private onPinchEnd = (event: EventCustom) => {
        event.preventDefault();
        event.srcEvent.stopPropagation();
        //this.currentScale = (event.scale * this.currentScale);
        this.isPinchEnd = true;
        this.isPreventZoom = true;
        this.props.onPinchEnd(event);
    };
    /*
     * trigger on pinch cancel
     */
    private onPinchCancel = (event: EventCustom) => {
        this.onPinchEnd(event);
    };

    /**
     * trigger the zoom
     */
    private triggerZoom = (zoomType: enums.ZoomType, event: EventCustom) => {
        this.zoomType = zoomType;
        this.zoomEvent = event;
        this.props.onPinchZoom(zoomType, event);
    };

    /**
     * Update the zoom based on the zoom type
     * @param {enums.ZoomType} zoomType
     */
    private onCustomZoomUpdated(zoomType: enums.ZoomType): void {

        this.zoomType = zoomType;

        // Rerender to update the zoom on child
        if (htmlUtils.isTabletOrMobileDevice === true &&
            (responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured ||
                responseHelper.isAtypicalResponse()
            ) && !responseHelper.isEbookMarking) {
            // This is for unstructured custom zoom in devices. Calling the pinchzoom callback on - and + click.
            this.props.onPinchZoom(zoomType, null);
        }
    }

    /**
     * Response zoom has been updated
     * @param {number} zoomValue
     */
    private responseZoomUpdated(zoomValue: number): void {

        this.zoomType = enums.ZoomType.None;
	}

    /**
     * Triggers when marksheet transition is over
     * @param {Event} event
     */
	private onAnimationEnd(event: any) {
		let element: any = event.target || event.srcElement;

        if (this.zoomType === enums.ZoomType.CustomZoomIn || this.zoomType === enums.ZoomType.CustomZoomOut ||
            (this.props.zoomPreference !== enums.ZoomPreference.FitHeight
                && this.props.zoomPreference !== enums.ZoomPreference.FitWidth)) {

            if (!$('.marksheet-zoom-holder').hasClass('custom-zoom')) {
                $('.marksheet-zoom-holder').removeClass('custom-zoom').addClass('custom-zoom');
            }
        }

        if ((element.className === 'marksheet-view-holder' && this.props.onTransitionEnd && event.propertyName === 'left')) {
            this.props.onTransitionEnd(this.props.zoomPreference === enums.ZoomPreference.FitHeight);
		}

		if (element.className && typeof element.className === 'string' &&
			element.className.indexOf('marksheet-wrapper') > -1) {
			// transitionEnd is triggered for each marksheet-wrapper. 
			// Avoid multiple comment container render
            if (this.refs && this.refs.contentHolder) {
                let nodes = this.refs.contentHolder.getElementsByClassName('marksheet-wrapper');
                let first = nodes[0];
                if (element === first) {
                    //re render the side view for comments
                    stampActionCreator.renderSideViewComments();
                }
            }
		}

        // fire a rotation completed event after transition end of marksheet-wrapper when the rotation is happening
        // in safari, we cannot relay on marksheet-container's transition end so we introduce a markingStore.instance.isRotating
        // and will set at the begin of rotation and relay on marksheet-wrapper's transition end
        if (element.className && typeof element.className === 'string' &&
            element.className.indexOf('marksheet-wrapper') > -1 && markingStore.instance.isRotating) {
            zoomPanelActionCreator.rotationCompletedAction();
        }
    }

    /**
     * Initiating zoom only when the current zoom is different.
     */
    private initiatingZoom(): void {
        this.props.onZoomingInitiated(this.zoomType);
    }
}

export = Zoomable;