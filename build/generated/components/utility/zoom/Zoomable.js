"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var ReactDom = require('react-dom');
var enums = require('../enums');
var responseStore = require('../../../stores/response/responsestore');
var eventManagerBase = require('../../base/eventmanager/eventmanagerbase');
var eventTypes = require('../../base/eventmanager/eventtypes');
var htmlUtils = require('../../../utility/generic/htmlutilities');
var zoomPanelActionCreator = require('../../../actions/zoompanel/zoompanelactioncreator');
var constants = require('../constants');
var responseHelper = require('../responsehelper/responsehelper');
var markingStore = require('../../../stores/marking/markingstore');
var stampActionCreator = require('../../../actions/stamp/stampactioncreator');
var Zoomable = (function (_super) {
    __extends(Zoomable, _super);
    /**
     * @Constructor
     */
    function Zoomable(props, state) {
        var _this = this;
        _super.call(this, props, state);
        // Holds the value which indicate the pinchEnd has been triggered
        this.isPinchEnd = false;
        // Holds the value which indicate whether
        // the zoom is to be prevented
        this.isPreventZoom = true;
        /**
         * trigger on pan move to prevent pan while pinch zoom
         */
        this.onPanMove = function (event) {
            if (_this.isPreventZoom === true) {
                event.preventDefault();
                event.srcEvent.stopPropagation();
                _this.isPreventZoom = false;
            }
        };
        /**
         * Trigger on pinch start.
         */
        this.onPinchStart = function (event) {
            _this.props.onPinchStart(event);
            event.preventDefault();
            event.srcEvent.preventDefault();
            event.srcEvent.stopPropagation();
            _this.isPinchEnd = false;
            _this.isPreventZoom = true;
        };
        /**
         * Trigger on pinch start.
         */
        this.onPinchIn = function (event) {
            event.preventDefault();
            event.srcEvent.preventDefault();
            event.srcEvent.stopPropagation();
            if ((event.deltaX !== _this.deltaX || event.deltaY !== _this.deltaY) && _this.isPinchEnd === false) {
                _this.deltaX = event.deltaX;
                _this.deltaY = event.deltaY;
                _this.triggerZoom(enums.ZoomType.PinchIn, event);
            }
        };
        /*
         * trigger on pinch Out
         */
        this.onPinchOut = function (event) {
            event.preventDefault();
            event.srcEvent.stopPropagation();
            if ((event.deltaX !== _this.deltaX || event.deltaY !== _this.deltaY) && _this.isPinchEnd === false) {
                _this.deltaX = event.deltaX;
                _this.deltaY = event.deltaY;
                _this.triggerZoom(enums.ZoomType.PinchOut, event);
            }
        };
        /*
         * trigger on pinch End
         */
        this.onPinchEnd = function (event) {
            event.preventDefault();
            event.srcEvent.stopPropagation();
            //this.currentScale = (event.scale * this.currentScale);
            _this.isPinchEnd = true;
            _this.isPreventZoom = true;
            _this.props.onPinchEnd(event);
        };
        /*
         * trigger on pinch cancel
         */
        this.onPinchCancel = function (event) {
            _this.onPinchEnd(event);
        };
        /**
         * trigger the zoom
         */
        this.triggerZoom = function (zoomType, event) {
            _this.zoomType = zoomType;
            _this.zoomEvent = event;
            _this.props.onPinchZoom(zoomType, event);
        };
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
    Zoomable.prototype.render = function () {
        var that = this;
        var child;
        var attributes = { zoomType: this.zoomType, zoomEvent: this.zoomEvent };
        if (Array.isArray(this.props.children)) {
            child = this.props.children.map(function (item, i) {
                return React.cloneElement(item, { zoomAttributes: attributes, initiatingZoom: that.initiatingZoom });
            });
        }
        else {
            child = React.cloneElement(this.props.children, { zoomAttributes: attributes, initiatingZoom: that.initiatingZoom });
        }
        return (React.createElement("div", {className: 'marksheet-content-holder', ref: 'contentHolder'}, child));
    };
    /**
     * This function gets invoked when the component is updated
     */
    Zoomable.prototype.componentDidUpdate = function () {
        var that = this;
        // Update the window on message panel appears. We should add a wait time of this because, zoom size animation
        // has a animation delay. unless we provide this delay will result getting a wrong width
        // NOTE: consulted with UI expert to approve this.
        // Added MarksheetAnimationTimeOut for device as well. Fix for defect #65519
        if (this.props.onContainerWidthUpdated && this.zoomType === enums.ZoomType.None) {
            setTimeout(function () {
                if (that.refs.contentHolder) {
                    that.props.onContainerWidthUpdated(that.refs.contentHolder.clientWidth, that.refs.contentHolder.clientHeight);
                }
            }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
        }
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    Zoomable.prototype.componentDidMount = function () {
        this.setUpEvents();
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT, this.onCustomZoomUpdated);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.responseZoomUpdated);
        this.markSheetHolderTransition = document.getElementsByClassName('marksheet-view-holder').item(0);
        if (this.markSheetHolderTransition) {
            this.markSheetHolderTransition.addEventListener('transitionend', this.onAnimationEnd);
            this.markSheetHolderTransition.addEventListener('webkitTransitionEnd', this.onAnimationEnd);
        }
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    Zoomable.prototype.componentWillUnmount = function () {
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT, this.onCustomZoomUpdated);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.responseZoomUpdated);
        this.unRegisterEvents();
        if (this.markSheetHolderTransition) {
            this.markSheetHolderTransition.removeEventListener('transitionend webkitTransitionEnd', this.onAnimationEnd);
            this.markSheetHolderTransition.removeEventListener('webkitTransitionEnd', this.onAnimationEnd);
        }
    };
    /**
     * This will setup events
     */
    Zoomable.prototype.setUpEvents = function () {
        var element = ReactDom.findDOMNode(this);
        if (element && !this.eventHandler.isInitialized) {
            // we don't want hammer in MS Touch devices like surface because it containes pointer events
            var touchActionValue = 'pan-x pan-y';
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
    };
    /**
     * unregister events
     */
    Zoomable.prototype.unRegisterEvents = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    /**
     * Update the zoom based on the zoom type
     * @param {enums.ZoomType} zoomType
     */
    Zoomable.prototype.onCustomZoomUpdated = function (zoomType) {
        this.zoomType = zoomType;
        // Rerender to update the zoom on child
        if (htmlUtils.isTabletOrMobileDevice === true &&
            (responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured ||
                responseHelper.isAtypicalResponse()) && !responseHelper.isEbookMarking) {
            // This is for unstructured custom zoom in devices. Calling the pinchzoom callback on - and + click.
            this.props.onPinchZoom(zoomType, null);
        }
    };
    /**
     * Response zoom has been updated
     * @param {number} zoomValue
     */
    Zoomable.prototype.responseZoomUpdated = function (zoomValue) {
        this.zoomType = enums.ZoomType.None;
    };
    /**
     * Triggers when marksheet transition is over
     * @param {Event} event
     */
    Zoomable.prototype.onAnimationEnd = function (event) {
        var element = event.target || event.srcElement;
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
                var nodes = this.refs.contentHolder.getElementsByClassName('marksheet-wrapper');
                var first = nodes[0];
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
    };
    /**
     * Initiating zoom only when the current zoom is different.
     */
    Zoomable.prototype.initiatingZoom = function () {
        this.props.onZoomingInitiated(this.zoomType);
    };
    return Zoomable;
}(eventManagerBase));
module.exports = Zoomable;
//# sourceMappingURL=Zoomable.js.map