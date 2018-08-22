import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
import markingStore = require('../../../stores/marking/markingstore');
import responseStore = require('../../../stores/response/responsestore');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
import markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
import deviceHelper = require('../../../utility/touch/devicehelper');
import annotationHelper = require('../annotation/annotationhelper');
import qigStore = require('../../../stores/qigselector/qigstore');
import awardingStore = require('../../../stores/awarding/awardingstore');
import markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
import eventManagerBase = require('../../base/eventmanager/eventmanagerbase');
import eventTypes = require('../../base/eventmanager/eventtypes');
import direction = require('../../base/eventmanager/direction');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import stampActionCreator = require('../../../actions/stamp/stampactioncreator');
import zoompanelActionCreator = require('../../../actions/zoompanel/zoompanelactioncreator');
import zoomHelper = require('../../response/responsescreen/zoomhelper/zoomhelper');
import enums = require('../enums');
import eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
let classNames = require('classnames');
import constants = require('../constants');

/**
 * Panel resize state
 */
interface State {
    renderedOn?: number;
}

/**
 * Properties of Panelresize component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    hasPreviousColumn?: boolean;
    renderedOn?: number;
    resizerType: enums.ResizePanelType;
}

/**
 * Panel resizer component
 */
class PanelResizer extends eventManagerBase {

    /** refs */
    public refs: {
        [key: string]: (Element);
        panelResizer: Element;
    };

    private startX: number;
    private startY: number;
    private markingPanelWidth: number;
    private resizePanelClassName: string;
    private markingSchemePanelWidth: number = 0;
    private defaultPanelWidth: number;
    private _defaultMarkSchemePanelWidth: string;
    private enhancedOffpageCommentHeight: number = 0;
    private enhancedOffpageCommentHeightOnStart: number;
    private annotationPanelholderOffset: number;
    private heightInPercentage: number;
    private favoriteToolbarPanelOverlapped: boolean = false;
    private markSheetInnerHalfHeight: number;
    private offpageCommentHeightOnStart: number;
    private offpageCommentHeight: number = 0;
    private enhancedOffpageCommentMinimumHeight: number;
    private hasContainerHeightChanged: boolean = false;
    private marksheetInnerHeight: number;
    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
    }

    /**
     * Render method for Panel resizer.
     */
    public render() {
        // Render the panel resize
        return (<div id={this.getResizerID(this.props.resizerType)} className={
            classNames('panel-resizer',
                {
                    'horizontal align-bottom': this.props.resizerType === enums.ResizePanelType.EnhancedOffPageComment
                },
                {
                    'horizontal': this.props.resizerType === enums.ResizePanelType.OffPageComment
                })}
            ref={'panelResizer'}>
            <div className='resizer-icon-holder'>
                <span className='resizer-dot'></span>
                <span className='resizer-dot'></span>
                <span className='resizer-dot'></span>
                <span className='resizer-dot'></span>
                <span className='resizer-dot'></span>
            </div>
        </div>);
    }

    /**
     * Component mounted
     */
    public componentDidMount() {
        this.setUpEvents();
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.onResponseChanged);
        this.getDefaultPanelWidth();

        // Appending the touchmove event handler to the  panelResizer element
        // The passive flag is disabled here if the browser-device combination is Android-Chrome
        // From Chrome 56 onwards, in touch related native events, the preventDefault is by default made as passive
        // Here we are overriding this by disabling the passive flag so that preventDefault shall still work.
        this.appendEventHandler(this.refs.panelResizer,
            'touchmove',
            this.onTouchMoveHandler,
            htmlUtilities.isAndroidChrome());
    }

    /**
     * component DidUpdate
     */
    public componentDidUpdate() {
        this.getDefaultPanelWidth();
    }


    /* touch move event for panelResizer */
    private onTouchMoveHandler = (event: any) => {
        event.preventDefault();
    };

    /**
     * Component unmounted
     */
    public componentWillUnmount() {
        /* Please do not add any store event listeners here. Please add that in ImageContainer and pass as props to avoid possible
        EventEmitter memory leak node.js warning because this component will repeat based on no of pages */
        this.unRegisterEvents();
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.onResponseChanged);

        // Removing the touchmove event handler to the panelResizer element
        // The passive flag is disabled here if the browser-device combination is Android-Chrome
        // From Chrome 56 onwards, in touch related native events, the preventDefault is by default made as passive
        // Here we are overriding this by disabling the passive flag so that preventDefault shall still work.
        this.removeEventHandler(this.refs.panelResizer,
            'touchmove',
            this.onTouchMoveHandler,
            htmlUtilities.isAndroidChrome());
    }

    /**
     *  on response mode changed
     */
    protected onResponseChanged() {
        // reset the new default panel width when response view is changed
        markingActionCreator.updateDefaultPanelWidth();
    }

    /**
     * Get the default mark scheme panel width
     */
    protected getDefaultPanelWidth() {
        if (this.props.resizerType === enums.ResizePanelType.MarkSchemePanel) {
            let defaultPanelWidthFromStore: string = markingStore.instance.getDefaultPanelWidth();
            let previousMarkListWidth: number = markingStore.instance.getPreviousMarkListWidth();
            let previousMarkColumnWidth: number = 0;
            let minimumPanelWidth: number = 0;
            if (!defaultPanelWidthFromStore) {
                [this.defaultPanelWidth, previousMarkColumnWidth, minimumPanelWidth] =
                    markSchemeHelper.getLongestQuestionItemWidth(this.props.hasPreviousColumn);

                if (this.defaultPanelWidth > 0) {
                    markingActionCreator.setDefaultPanelWidth(this.defaultPanelWidth + 'px', previousMarkColumnWidth);
                }

                if (minimumPanelWidth > 0) {
                    markingActionCreator.setMinimumPanelWidth(minimumPanelWidth + 'px');
                }
            } else {
                let previousMarkColumnWidth: number = markSchemeHelper.getPreviousMarksColumnnWidth();
                if (this.defaultPanelWidth > 0 && previousMarkListWidth === 0) {
                    markingActionCreator.updateDefaultPanelWidth(this.defaultPanelWidth + previousMarkColumnWidth + 'px');
                }
            }
        }
    }

    /**
     * Hammer Implementation
     */
    protected setUpEvents() {
        let element: Element = ReactDom.findDOMNode(this);
        let panel = element.parentElement ? element.parentElement.className : '';
        let renderedSize: number;
        if (element.parentElement.id === 'markSchemePanel') {
            let parentElement: Element = ReactDom.findDOMNode(element.parentElement);
            renderedSize = parentElement.getBoundingClientRect().width;
        } else if (element.parentElement.id === 'enhanced-off-page-comments-container' ||
            element.parentElement.id === 'offpage-comment-container') {
            let parentElement: Element = ReactDom.findDOMNode(element.parentElement);
            renderedSize = parentElement.getBoundingClientRect().height;
        }

        if (element && !this.eventHandler.isInitialized) {
            // we don't want hammer in MS Touch devices like surface because it containes pointer events
            let touchActionValue: string = 'pan-y tap';
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_ALL, threshold: 0 });

            this.eventHandler.on(eventTypes.PAN_START, this.onPanStart.bind(this, renderedSize));
            this.eventHandler.on(eventTypes.PAN_END, this.onPanEnd);
            this.eventHandler.on(eventTypes.PAN_CANCEL, this.onPanEnd);
            this.eventHandler.on(eventTypes.PAN_MOVE, this.onPanMove);

            /** To add classname for panelresizer while click on touch in ipad/surface */
            if (deviceHelper.isTouchDevice()) {
                this.eventHandler.get(eventTypes.PRESS, { direction: direction.DirectionOptions.DIRECTION_ALL, threshold: 0 });
                this.eventHandler.on(eventTypes.PRESS, this.onTouchStart);
            }
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
     * onTouchStart
     */
    private onTouchStart() {
        let resizePanelClassName = 'resizing';
        markingActionCreator.updatePanelResizingClassName(this.resizePanelClassName);
    }

    /**
     * Called when panelresizer is started dragging
     * @param panelWidthOrHeight
     * @param evt
     */
    private onPanStart = (panelWidthOrHeight: number, evt: EventCustom) => {
        this.resizePanelClassName = 'resizing';
        /*remove the selection from Document (script image) before dragging the resizer*/
        htmlUtilities.removeSelectionFromDocument();
        if (this.props.resizerType === enums.ResizePanelType.MarkSchemePanel) {
            this.startX = evt.center.x;
            let markingSchemePanelWidth: number = parseFloat(userOptionsHelper.getUserOptionByName(
                userOptionKeys.MARKSCHEME_PANEL_WIDTH, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId));

            this._defaultMarkSchemePanelWidth = markingStore.instance.getDefaultPanelWidth();

            if (markingSchemePanelWidth > 0  && !markerOperationModeFactory.operationMode.isAwardingMode) {
                this.markingPanelWidth = annotationHelper.percentToPixelConversion(markingSchemePanelWidth, window.innerWidth);
            } else {
                // panelWidthOrHeight - panel width
                this.markingPanelWidth = panelWidthOrHeight;
            }
        } else if (this.props.resizerType === enums.ResizePanelType.EnhancedOffPageComment) {
            eCourseworkHelper.pauseVideo();
            this.startY = evt.center.y;
            this.onEnhancedoffpageCommentPanStart(panelWidthOrHeight, evt);
        } else if (this.props.resizerType === enums.ResizePanelType.OffPageComment) {
            this.startY = evt.center.y;
            // Calculating Half of the response script
            this.markSheetInnerHalfHeight = (((window.innerHeight - constants.COMMON_HEADER_HEIGHT) / 100) * 50);
            let offPageCommentHeight: number = parseFloat(userOptionsHelper.getUserOptionByName(
                userOptionKeys.OFFPAGE_COMMENT_PANEL_HEIGHT, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId));
            if (offPageCommentHeight > 0) {
                this.offpageCommentHeightOnStart = offPageCommentHeight;
            } else {
                this.offpageCommentHeightOnStart = panelWidthOrHeight;
            }
            markingActionCreator.updateOffPageCommentPanelHeight(this.offpageCommentHeight, enums.PanActionType.Start);
        }

        // hide open comment box on starting mark scheme panel resize
        stampActionCreator.showOrHideComment(false);
        // Close Bookmark Name Entry Box
        stampActionCreator.showOrHideBookmarkNameBox(false);
    };

    /**
     * Called when panelresizer is dragging towards left/right
     * @param evt
     */
    private onPanMove = (evt: EventCustom) => {
        if (this.props.resizerType === enums.ResizePanelType.MarkSchemePanel) {
            this.updatePanelWidth(enums.ResizePanelType.MarkSchemePanel, enums.PanActionType.Move, evt);
        } else if (this.props.resizerType === enums.ResizePanelType.EnhancedOffPageComment) {
            let newContainerHeight: number = this.enhancedOffpageCommentHeightOnStart - (this.startY - evt.center.y);
            if (newContainerHeight < this.markSheetInnerHalfHeight && newContainerHeight > this.enhancedOffpageCommentMinimumHeight) {
                this.enhancedOffpageCommentHeight = newContainerHeight;
                this.hasContainerHeightChanged = true;
                this.favoriteToolbarPanelOverlapped = this.enhancedOffpageCommentHeight > this.annotationPanelholderOffset;
                this.heightInPercentage =
                    annotationHelper.pixelsToPercentConversion(this.enhancedOffpageCommentHeight, this.marksheetInnerHeight);
                markingActionCreator.updatePanelHeight(this.heightInPercentage.toString(), this.resizePanelClassName,
                    this.favoriteToolbarPanelOverlapped, enums.PanActionType.Move, enums.ResizePanelType.EnhancedOffPageComment);
            }
        } else if (this.props.resizerType === enums.ResizePanelType.OffPageComment) {
            let newContainerHeight = this.offpageCommentHeightOnStart + (this.startY - evt.center.y);
            if (newContainerHeight < this.markSheetInnerHalfHeight && newContainerHeight > constants.OFFPAGE_COMMENT_MIN_HEIGHT) {
                this.offpageCommentHeight = newContainerHeight;
            }
            markingActionCreator.updateOffPageCommentPanelHeight(this.offpageCommentHeight, enums.PanActionType.Move);
        }
    };

    /**
     * Called when panelresizer is stopped dragging
     * @param event
     */
    private onPanEnd = (event: EventCustom) => {
        this.resizePanelClassName = '';
        this.startX = 0;
        this.startY = 0;
        if (this.props.resizerType === enums.ResizePanelType.MarkSchemePanel) {
            let _defaultMarkSchemePanelWidth = markingStore.instance.getDefaultPanelWidth();
            let miniPanelWidth = markingStore.instance.getMinimumPanelWidth();
            if (this.markingSchemePanelWidth > parseFloat(_defaultMarkSchemePanelWidth)) {
                this.markingSchemePanelWidth = parseFloat(_defaultMarkSchemePanelWidth);
            } else if (this.markingSchemePanelWidth < parseFloat(miniPanelWidth)) {
                this.markingSchemePanelWidth = parseFloat(miniPanelWidth);
            }

            //convert pixel to heightInPercentage
            let _markingSchemePanelWidth = annotationHelper.pixelsToPercentConversion(this.markingSchemePanelWidth, window.innerWidth);

            this.updatePanelWidth(enums.ResizePanelType.MarkSchemePanel, enums.PanActionType.End, event);

            //update resizing classname
            markingActionCreator.updatePanelResizingClassName(this.resizePanelClassName);

            if (!markerOperationModeFactory.operationMode.isAwardingMode) {
                // Change and Save the User options.
                userOptionsHelper.save(userOptionKeys.MARKSCHEME_PANEL_WIDTH, _markingSchemePanelWidth.toString(), true, true);
            }
        } else if (this.props.resizerType === enums.ResizePanelType.EnhancedOffPageComment) {
            if (this.hasContainerHeightChanged) {
                markingActionCreator.updatePanelHeight(this.heightInPercentage.toString(), this.resizePanelClassName,
                    this.favoriteToolbarPanelOverlapped, enums.PanActionType.End, enums.ResizePanelType.EnhancedOffPageComment);
                userOptionsHelper.save(userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT, this.heightInPercentage.toString(), true);
            }
            this.hasContainerHeightChanged = false;
        } else if (this.props.resizerType === enums.ResizePanelType.OffPageComment && this.offpageCommentHeight) {
            markingActionCreator.updateOffPageCommentPanelHeight(this.offpageCommentHeight, enums.PanActionType.End);

			userOptionsHelper.save(userOptionKeys.OFFPAGE_COMMENT_PANEL_HEIGHT,
				this.offpageCommentHeight.toString(),
				true, true, false, true,
				qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);

            let zoomUserOption: string = userOptionsHelper.getUserOptionByName
				(userOptionKeys.ZOOM_PREFERENCE, responseStore.instance.markingMethod === enums.MarkingMethod.Structured ?
					markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser :
					qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        }
    };

    /**
     *  to update the panel width
     */
    private updatePanelWidth(panelType: enums.ResizePanelType, panActionType: enums.PanActionType, event: EventCustom) {
        let newMarkingPanelWidth: number = 0;

        newMarkingPanelWidth = this.markingPanelWidth + (this.startX - event.center.x);
        this.markingSchemePanelWidth = newMarkingPanelWidth;
        this.markingSchemePanelWidth = Math.round(this.markingSchemePanelWidth);
        markingActionCreator.updatePanelWidth(this.markingSchemePanelWidth + 'px', this.resizePanelClassName, panelType, panActionType);
    }

    /**
     * Returns Resizer Id.
     */
    private getResizerID = (resizerType: enums.ResizePanelType): string => {
        let id: string;
        switch (resizerType) {
            case enums.ResizePanelType.EnhancedOffPageComment:
                id = 'enhancedOffPageCommentResizer';
                break;
            case enums.ResizePanelType.MarkSchemePanel:
                id = 'markSchemePanelResizer';
                break;
            case enums.ResizePanelType.OffPageComment:
                id = 'offPageCommentResizer';
        }
        return id;
    }

    /**
     * Enhanced offpage comment pan start.
     */
    private onEnhancedoffpageCommentPanStart = (panelWidthOrHeight: number, evt: EventCustom) => {
        // annotationHolderRect + (padding - headerHeight)
        this.annotationPanelholderOffset = htmlUtilities.getBoundingClientRect('annotation-panel-holder').top +
            (10 - constants.COMMON_HEADER_HEIGHT);
        this.marksheetInnerHeight = htmlUtilities.getBoundingClientRect('markSheetContainerInner', true).height;
        // Getting half height of Response screen.
        this.markSheetInnerHalfHeight = ((this.marksheetInnerHeight / 100) * 50);
        let enhancedOffPageCommentHeight: number = parseFloat(userOptionsHelper.getUserOptionByName(
            userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT));
        // Set current container height as initial value
        this.enhancedOffpageCommentHeightOnStart = htmlUtilities.getBoundingClientRect('enhanced-off-page-comments-container', true).height;

        // Mininmum panel height in tabular and detailed views.
        this.enhancedOffpageCommentMinimumHeight =
            evt.target.parentElement.className === 'enhanced offpage-comment-container detail-view ' ?
                constants.ENHANCED_OFFPAGE_COMMENT_DETAIL_VIEW_MIN_HEIGHT : constants.ENHANCED_OFFPAGE_COMMENT_TABULAR_VIEW_MIN_HEIGHT;
    }
}
export = PanelResizer;