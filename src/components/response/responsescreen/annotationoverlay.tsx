/* tslint:disable */
import React = require('react');
import ReactDom = require('react-dom');
import Immutable = require('immutable');
import ImageStamp = require('../annotations/static/imagestamp');
import TextStamp = require('../annotations/static/textstamp');
import DynamicStampFactory = require('../annotations/dynamic/dynamicstampfactory');
import enums = require('../../utility/enums');
import stampData = require('../../../stores/stamp/typings/stampdata');
import stampStore = require('../../../stores/stamp/stampstore');
import markingStore = require('../../../stores/marking/markingstore');
import responseStore = require('../../../stores/response/responsestore');
import annotation = require('../../../stores/response/typings/annotation');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import annotationHelper = require('../../utility/annotation/annotationhelper');
import responseHelper = require('../../utility/responsehelper/responsehelper');
import onPageCommentHelper = require('../../utility/annotation/onpagecommenthelper');
import toolbarActionCreator = require('../../../actions/toolbar/toolbaractioncreator');
import toolbarStore = require('../../../stores/toolbar/toolbarstore');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import menuItem = require('../../utility/contextmenu/typings/menuitem');
import constants = require('../../utility/constants');
import initCoordinates = require('../annotations/typings/initcoordinates');
import localeStore = require('../../../stores/locale/localestore');
import colouredAnnotationsHelper = require('../../../utility/stamppanel/colouredannotationshelper');
import eventManagerBase = require('../../base/eventmanager/eventmanagerbase');
import deviceHelper = require('../../../utility/touch/devicehelper');
import eventTypes = require('../../base/eventmanager/eventtypes');
import stampActionCreator = require('../../../actions/stamp/stampactioncreator');
import direction = require('../../base/eventmanager/direction');
import marksAndAnnotationsVisibilityHelper = require('../../utility/marking/marksandannotationsvisibilityhelper');
import marksAndAnnotationsVisibilityInfo = require('../../utility/annotation/marksandannotationsvisibilityinfo');
import DynamicMovingElement = require('../annotations/dynamic/dynamicmovingelement');
import exceptionStore = require('../../../stores/exception/exceptionstore');
import messageStore = require('../../../stores/message/messagestore');
import userInfoStore = require('../../../stores/userinfo/userinfostore');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import markingHelper = require('../../../utility/markscheme/markinghelper');
import treeViewDataHelper = require('../../../utility/treeviewhelpers/treeviewdatahelper');
import treeViewItem = require('../../../stores/markschemestructure/typings/treeviewitem');
import pageLinkHelper = require('./linktopage/pagelinkhelper');
import loggingHelper = require('../../utility/marking/markingauditlogginghelper');
import loggerConstants = require('../../utility/loggerhelperconstants');
import ecourseWorkHelper = require('../../utility/ecoursework/ecourseworkhelper');
import OverlayHolder = require('./overlayholder');
import imageZoneStore = require('../../../stores/imagezones/imagezonestore');
import qigStore = require('../../../stores/qigselector/qigstore');
import awardingStore = require('../../../stores/awarding/awardingstore');

interface OverlayProps extends PropsBase, LocaleSelectionBase, PropsAnnotationOverlay {
    imageClusterId: number;
    outputPageNo: number;
    pageNo: number;
    currentImageMaxWidth: number;
    currentOutputImageHeight: number;
    getImageContainerRect?: Function;
    getMarkSheetContainerProperties?: Function;
    imageZones?: ImageZone[];
    imageZone?: ImageZone;
    displayAngle?: number;
    zoomPreference?: enums.ZoomPreference;
    isReadOnly?: boolean;
    isResponseEditable?: boolean;
    enableImageContainerScroll: Function;
    currentImageNaturalWidth: number;
    isAdditionalObject?: boolean;
    isALinkedPage?: boolean;
    structerdPageNo?: number;
    enableCommentsSideView: boolean;
    topAboveCurrentZone?: number;
    renderedOnTime?: number;
    zoneHeight?: number;
    zoneTop?: number;
    zoneLeft?: number;
    skippedZones?: Immutable.List<ImageZone>;
    currentImageZones?: Immutable.List<ImageZone>;
    getImageNaturalDimension?: Function;
    currentImagePageNo?: number;
    doApplyLinkingScenarios?: boolean;
    pagesLinkedByPreviousMarkers?: number[];
    getHeightOfZones?: Function;
    refreshCommnetContainer?: Function;
    isEBookMarking: boolean;
}

interface OverlayState {
    renderedOn?: number;
}

class AnnotationOverlay extends eventManagerBase {
    /**This Flags are used to prevent unnecessary the click event triggered after touch and hold*/
    /** TODO : Investigate better approaches un future*/
    private isTouchHold: boolean;
    private isMarksAndAnnotationsLoaded: boolean;
    private currentlySelectedAnnotation: annotation;
    private isContextMenuVisible: boolean = true;
    private contextMenuItems: Array<menuItem>;
    private contextMenuZindex: number;
    private _onWindowResizeEventHandler: EventListenerObject = null;
    private annotationHolderClass: string = 'annotation-holder';
    private forceAnnotationRerender: boolean = false;
    private deleteAnnotationOnDrop: boolean = false;
    private annotationOverlayWidth: number;
    private initCoordinates: initCoordinates = { x: 0, y: 0 };
    private isDrawMode: boolean = false;
    private isOutside: boolean = false;
    private isAnnotationinGreyArea: boolean = false;
    private _clientToken: string;
    /**To store initial Scroll while clicking and hold */
    private scrollTop: number = 0;
    /**To store top value while moving */
    private finalTop: number = 0;
    /**To store height value while moving */
    private finalHeight: number = 0;
    private currentAnnoationId: any;
    public currentAnnotationElement: any = null;
    private annotationOverlayElement: Element;
    private annotationOverlayElementClientRect: ClientRectDOM;
    private marksheetContainerProperties: HTMLElement;
    private drawSequence = 0;
    private drawDirection: enums.DrawDirection = enums.DrawDirection.Right;
    private currentOverlayId: string;
    private isDrawEnd: boolean = false;
    private isStamping: boolean = false;

    private pannedStampId: number = 0;
    private isDrawLeft: boolean = false;

    // hold the client token of panned stamp
    private clientToken: string = '';
    // hold the panned stamp details
    private pannedStamp: stampData;
    // holds the selected stamp details in stamp panel
    private selectedStamp: stampData;
    // check whether the panned annotation is active or not (faded / previous annotation)
    private isActiveAnnotation: boolean = true;

    // holds the annotations to display in current page
    private annotationsToDisplayInCurrentPage;

    /**If dynamic annotation is moving/resizing then  dynamicAnnotationisMoving value will be true, otherwise false*/
    private dynamicAnnotationisMoving: boolean = false;

    private hlineStrokeWidth: string = '1';
    /**If dynamic annotation border is showing then  isDynamicAnnotationBorderShowing value will be true, otherwise false*/
    private isDynamicAnnotationBorderShowing: boolean = false;

    /* this will set to false when dynamic annotation is moved. this will be used to prevent
     * stamping annotation while clicking annotation overlay */
    private isDynamicAnnotationPanCompleted: boolean = true;

    private doEnablePan: boolean = true;
    private doEnableClick: boolean = true;
    private doEnableDynamicAnnotationDraw: boolean = false;

    private isOnPageCommentAdded: boolean = false;

    private previousDrawDirection: enums.DrawDirection;
    private annotationsToDisplay: Immutable.List<annotation> = undefined;

    // Gets or sets a value indicating the boundary of coordinates of current
    // overlay according to the image.....
    private overlayBoundary: Array<AnnotationBoundary> = [];

    // To ensure that stitched image gap of structured response are not overlapped by the dynamic annotation.
    private annotationNotOverlappingStitchedGap;
    private clientXOld: number;
    private clientYOld: number;
    private lineYPos: number;
    private lineXPos: number;
    private treeViewHelper: treeViewDataHelper;
    private annotationsInSkippedZone: Immutable.List<annotation>;
    private logger: loggingHelper = new loggingHelper();
    private isPinching: boolean = false;
    private isDynamicAnnotationDrawInProgress: boolean = false;
    private isCursorOverAnnotationOverlay: boolean = false;
    private previouslySelectedZone: ImageZone;
    // newly added annotation client token
    private addedAnnotationClientToken: string;
    private refreshCommentContainer: boolean = false;
    private overlayElement: Element = null;
    private tree: treeViewItem;
    private isComponentMounted: boolean = false;

    constructor(props: OverlayProps, state: OverlayState) {
        super(props, state);
        this.state = {
            renderedOn: Date.now()
        };
        this.isTouchHold = false;

        this.contextMenuItems = [];
        this.isContextMenuVisible = false;
        this.annotationNotOverlappingStitchedGap = true;

        this.onDrawStart = this.onDrawStart.bind(this);
        this.onDrawMove = this.onDrawMove.bind(this);
        this.onDrawEnd = this.onDrawEnd.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onResponseImageContextHandler = this.onResponseImageContextHandler.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.mouseOverHandler = this.mouseOverHandler.bind(this);
        this.onTapHandler = this.onTapHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onPanEndListener = this.onPanEndListener.bind(this);
        this.annotationsToDisplay = (this.props.isEBookMarking ?
            annotationHelper.getAnnotationsForThePageInEBookMarking(this.props.pageNo,
                this.props.currentImageMaxWidth, this.props.currentOutputImageHeight,
                this.props.isALinkedPage, responseHelper.isEResponse)
            : annotationHelper.getAnnotationsForThePageInStructuredResponse(this.props.pageNo,
                this.props.currentImageMaxWidth, this.props.currentOutputImageHeight,
                this.props.isAdditionalObject, this.props.isALinkedPage));
        this.forceAnnotationOverlayToReRender = this.forceAnnotationOverlayToReRender.bind(this);
    }

    /**
     * enables or disables image container scroll
     * @param value
     */
    private enableImageContainerScroll = (value: boolean) => {
        if (this.props.enableImageContainerScroll) {
            this.props.enableImageContainerScroll(value);
        }
    };

    /**
     * This method will hook the touch events
     */
    private setUpEvents() {
        var element = this.annotationOverlayElement;
        if (element
            && !this.eventHandler.isInitialized
            && !exceptionStore.instance.isExceptionPanelVisible
            && !this.props.isReadOnly) {
            let touchActionValue: string = deviceHelper.isTouchDevice() ? 'auto' : 'none';
            let threshold = constants.PAN_THRESHOLD;
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_ALL, threshold: threshold });
            this.eventHandler.on(eventTypes.PAN_START, this.onPanStart);
            this.eventHandler.on(eventTypes.PAN_END, this.onPanEnd);

            /* Defect Fix #58155 , handled PAN_CANCEL event for andriod devices
            where the pan to outside application area triggers this event */
            this.eventHandler.on(eventTypes.PAN_CANCEL, this.onPanEnd);

            this.eventHandler.on(eventTypes.PAN, this.onPanMove);
            this.eventHandler.on(eventTypes.PINCH_START, this.onPinchStart);
            this.eventHandler.on(eventTypes.PINCH_END, this.onPinchEnd);
            this.eventHandler.on(eventTypes.PINCH_CANCEL, this.onPinchEnd);
            this.eventHandler.on(eventTypes.TAP, this.onTapHandler);
            if (deviceHelper.isTouchDevice()) {
                /** this is to avoid the unwanted input events */
                /** Commenting this as it is blocking the pinch zoom functionality. Will revisit */
                //this.eventHandler.on(eventTypes.INPUT, this.stopInputEvents);
                this.eventHandler.get(eventTypes.PRESS, { time: constants.PRESS_TIME_DELAY });
                this.eventHandler.on(eventTypes.PRESS, this.onTouchHold);
                this.eventHandler.on(eventTypes.PRESS_UP, this.onPressUp);
            } else {
                /* Implemented as part of defect fix #54482 */
                this.eventHandler.get(eventTypes.PRESS, { time: constants.PRESS_TIME_DELAY });
                this.eventHandler.on(eventTypes.PRESS_UP, this.onTapHandler);
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

    /** this is to avoid the unwanted input events triggered by hammer*/
    private stopInputEvents = (event: EventCustom) => {
        this.eventHandler.stopPropagation(event);
    };

    /* sets annotation event handler enabled or not */
    private doEnableClickHandler = (status: boolean) => {
        this.doEnableClick = status;
    }

    /* return true if click handler is enabled */
    private get isClickHandlerEnabled(): boolean {
        return this.doEnableClick &&
            !(
                // if zoom option is opened or if exception panel is opened, then no need to add new annotation while click on overlay
                exceptionStore.instance.isExceptionPanelVisible
                || messageStore.instance.isMessagePanelVisible
                || this.getUIDropDownVisibility
                || responseStore.instance.selectedResponseMode === enums.ResponseMode.closed
                || markerOperationModeFactory.operationMode.isTeamManagementMode
            );
    }

    /* checks if the pan action for dynamic annotation can be preformed */
    private get isPanEnabledForDynamicAnnotation(): boolean {
        return this.selectedStamp && annotationHelper.isDynamicAnnotation(this.selectedStamp) &&
            !toolbarStore.instance.isBookMarkSelected &&
            !toolbarStore.instance.isBookmarkTextboxOpen &&
            !markingStore.instance.contextMenuDisplayStatus &&
            this.pannedStampId === 0 && (htmlUtilities.isTabletOrMobileDevice ? this.doEnableDynamicAnnotationDraw : true);
    }

    /* checks if the pan action for static annotation can be preformed */
    private get isPanEnabledForStaticAnnotation(): boolean {
        return this.isActiveAnnotation && this.pannedStamp && this.pannedStampId > 0 &&
            !annotationHelper.isDynamicAnnotation(this.pannedStamp);
    }

    /* checks if pan action can be preformed or not */
    private get isPanEnabled(): boolean {
        return !annotationHelper.isResponseReadOnly() && this.doEnablePan
            && !this.isZoomOptionOpen && !responseStore.instance.isPinchZooming
            && !this.isMarkByOptionOpen;
    }

    /* set if the zoom option is open or closed */
    private get isZoomOptionOpen(): boolean {
        return responseStore.instance.isZoomOptionOpen;
    }

    /* set if the mark by option is open or closed */
    private get isMarkByOptionOpen(): boolean {
        return responseStore.instance.isMarkByOptionOpen;
    }

    /* pan move action for annotation overlay */
    private onPanMove = (event: EventCustom) => {
        if (this.isPanEnabled && this.isPinching === false
            && !annotationHelper.isEventCanceled(event)) {
            // call panmove if pan started on a annotation only
            if (this.isPanEnabledForDynamicAnnotation) {
                this.onDrawMove(event);
            } else if (this.isPanEnabledForStaticAnnotation) {
                this.onAnnotationPanMove(event);
            }
        }
    };

    /* annotation added action for annotation overlay */
    public onAnnotationAdded = (stampId: number,
        addAnnotationAction: enums.AddAnnotationAction,
        annotationOverlayId: string,
        annotation: annotation): void => {
        this.addedAnnotationClientToken = annotation.clientToken;
        if (annotationOverlayId === this.props.id) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * This will call on pan start in stamp panel
     * @param event: Custom event type
     */
    private onPanStart = (event: EventCustom) => {
        this.currentAnnotationElement = undefined;

        if (this.isPanEnabled && this.isPinching === false && !annotationHelper.isEventCanceled(event)) {
            // find the position of pan start for finding stamp element.
            let stampX: number = event.center.x - event.deltaX;
            let stampY: number = event.center.y - event.deltaY;

            // find the stamp element
            let element: any = htmlUtilities.getElementFromPosition(stampX, stampY);
            if (element) {

                //Resetting the line position of side view comment on comment annotation move
                this.lineYPos = 0;
                this.lineXPos = 0;

                // get the stampId and stamp data
                this.pannedStampId = element.getAttribute('data-stamp') ? parseInt(element.getAttribute('data-stamp')) : 0;
                this.clientToken = element.getAttribute('data-token');
                // get stamp details
                this.pannedStamp = stampStore.instance.getStamp(this.pannedStampId);
                // save the selected stamp details for pan move
                this.selectedStamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
                let annotationData: annotation = markingStore.instance.findAnnotationData(this.clientToken);
                // check whether the annotation is active (faded or previous)
                this.isActiveAnnotation = annotationData ?
                    annotationData.markSchemeId === markingStore.instance.currentQuestionItemInfo.uniqueId : false;
                if (this.isActiveAnnotation) {
                    this.isActiveAnnotation = !annotationHelper.isPreviousAnnotation(element);
                }
                // Hide context menu on draw start or dragging
                markingActionCreator.showOrHideRemoveContextMenu(false);
                if (this.isPanEnabledForDynamicAnnotation) {
                    this.onDrawStart(event);
                } else if (this.isPanEnabledForStaticAnnotation) {
                    if (!onPageCommentHelper.isCommentsSideViewEnabled) {
                        if (htmlUtilities.isTabletOrMobileDevice) {
                            stampActionCreator.showOrHideComment(false, true);
                        } else {
                            stampActionCreator.showOrHideComment(false);
                        }
                    }

                    this.onAnnotationPanStart(this.pannedStampId, this.clientToken, event);

                    // If dragged inside the script then hide the annotation
                    this.setState({
                        renderedOn: Date.now()
                    });
                }

                if (annotationHelper.isDynamicAnnotation(this.selectedStamp)
                    && this.pannedStampId === 0) {
                    this.doEnableClickHandler(false);
                }
            }
        } else {
            this.doEnableClickHandler(false);
        }
    };

    /**
     * This method will call on panend event
     */
    private onPanEnd = (event: EventCustom) => {
        if (this.isPanEnabled) {
            // Defect 21590: On page comment and similar static Annotations seems to overlap with
            // mouse cursor SVG while stamping- IE only - noticeable on higher zoom level only
            responseActionCreator.setMousePosition(-1, -1);

            // consider the selected stamp scenario for dynamic
            if (this.isPanEnabledForDynamicAnnotation) {
                this.onDrawEnd(event);
            } else if (this.isPanEnabledForStaticAnnotation) {
                this.onAnnotationPanEnd(this.clientToken, this.pannedStampId, event, 0, 0);
            }

            this.clearPanData();
        }

        this.enableImageContainerScroll(true);
        this.doEnableDynamicAnnotationDraw = false;

        // Defect: #34665
        // if current browser is not chrome then we need to enable the click handler
        // in chrome an automatic click event is firing after the pan, that clickHandler method
        // will call doEnableClickHandler(true) method.
        if (htmlUtilities.getUserDevice().browser !== 'Chrome' || htmlUtilities.isTabletOrMobileDevice) {
            this.doEnableClickHandler(true);
        }
        this.doEnableDocumentSelection(true);
    };

    /* pressup event for annotation overlay */
    protected onPressUp = (event: EventCustom) => {
        this.doEnableDynamicAnnotationDraw = false;
        this.enableImageContainerScroll(true);
    };

    /**
     * on touch and hold handler
     * @param event
     */
    protected onTouchHold = (event: EventCustom) => {

        event.srcEvent.stopPropagation();
        event.srcEvent.preventDefault();
        this.enableImageContainerScroll(false);
        this.doEnableDynamicAnnotationDraw = true;
        // find the position of pan start for finding stamp element.
        let stampX: number = event.center.x;
        let stampY: number = event.center.y;

        // find the stamp element
        let element: any = htmlUtilities.getElementFromPosition(stampX, stampY);
        // get the stampId and stamp data
        let stampId: number = parseInt(element.getAttribute('data-stamp'));
        let clientToken: string = element.getAttribute('data-token');
        // get stamp details
        let stampData: stampData = undefined;
        if (stampId > 0) {
            stampData = stampStore.instance.getStamp(stampId);
        }
        if (stampData && !annotationHelper.isDynamicAnnotation(stampData.stampType)) {
            if (event.changedPointers && event.changedPointers.length > 0 && !deviceHelper.isMSTouchDevice()) {
                // find the annotation data based on the client token
                let annotationData: annotation = markingStore.instance.findAnnotationData(clientToken);

                // Pass the currently clicked annotation along with the X and Y because Remove Context menu
                // is under marksheet div and we need to show the context menu at this position
                stampActionCreator.showOrHideComment(false);
                // Close Bookmark Name Entry Box
                stampActionCreator.showOrHideBookmarkNameBox(false);
                this.showOrHideRemoveContextMenu(true,
                    clientToken,
                    event.changedPointers[event.changedPointers.length - 1].clientX,
                    event.changedPointers[event.changedPointers.length - 1].clientY,
                    this.getAnnotationOverlayWidth(),
                    annotationData);
            }
        }
    };

    /*
     * Handles Tap event.
     * @param event
     */
    onTapHandler = (event: EventCustom) => {

        // context menu not closing while clicking outside at very first time
        if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
            markingActionCreator.showOrHideRemoveContextMenu(false);
        }
        let annotationElement: Element = htmlUtilities.getElementFromPosition(event.changedPointers[0].clientX,
            event.changedPointers[0].clientY);

        // Element will be null in MAC Safari, if over the stamp panel using trackpad
        if (annotationElement === null) {
            return;
        }

        let rotatedAngle = annotationHelper.getAngleforRotation(Number(annotationElement.getAttribute('data-rotatedangle')));
        if (this.props.imageZone) {
            if (responseStore.instance.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView
                && this.viewWholePageVisibilityCheck(this.props.imageZone)) {
                // action to set view whole page button visible.
                responseActionCreator.viewWholePageLinkAction(true, this.props.imageZone);
            }
        } else if (this.props.imageZones && this.props.imageZones.length > 0) {
            if (this.isStitchedImage &&
                annotationHelper.isAnnotationInsideStitchedImage(this.overlayBoundary,
                    rotatedAngle,
                    event.changedPointers[0].clientX,
                    event.changedPointers[0].clientY)) {
                let currentImageZone: ImageZone = annotationHelper.getImageZone(this.overlayBoundary,
                    rotatedAngle,
                    event.changedPointers[0].clientX,
                    event.changedPointers[0].clientY,
                    this.props.imageZones);
                if (this.viewWholePageVisibilityCheck(currentImageZone)) {
                    responseActionCreator.viewWholePageLinkAction(true, currentImageZone);
                }
            }
        }

        let clickedElement = htmlUtilities.getElementFromPosition(event.changedPointers[0].clientX, event.changedPointers[0].clientY);

        if (exceptionStore.instance.isExceptionPanelVisible || messageStore.instance.isMessagePanelVisible) {
            return;
        }

        if (htmlUtilities.isIE || htmlUtilities.isEdge) {
            let annotationElement = htmlUtilities.findAncestor(clickedElement, 'annotation-wrap');
            let isInActiveDynamicAnnotation = false;
            if (annotationElement && typeof annotationElement.className === 'string' &&
                annotationElement.className.indexOf('inactive') > -1 &&
                annotationHelper.isDynamicAnnotationElement(clickedElement)) {
                isInActiveDynamicAnnotation = true;
            }
            markingActionCreator.showOrHideRemoveContextMenu(false);
            var stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
            if (annotationHelper.checkEventFiring()) {
                if ((annotationHelper.isDynamicAnnotation(stamp) &&
                    !toolbarStore.instance.isBookMarkSelected &&
                    !toolbarStore.instance.isBookmarkTextboxOpen &&
                    ((!annotationHelper.isDynamicAnnotationElement(clickedElement) || isInActiveDynamicAnnotation)
                        && parseInt(clickedElement.getAttribute('data-stamp')) !== enums.DynamicAnnotation.OnPageComment
                        || annotationHelper.isPreviousAnnotation(clickedElement)) &&
                    !annotationHelper.checkMouseDrawingOutsideResponseArea(event, 'stamp',
                        this.annotationOverlayElement, this.props.displayAngle, stamp.stampId, true))) {
                    this.addOrUpdateAnnotation(
                        event.changedPointers[0].clientX,
                        event.changedPointers[0].clientY,
                        enums.AddAnnotationAction.Stamping,
                        toolbarStore.instance.selectedStampId
                    );
                }
            }
        }
    };

    /**
     * Get annotation overlay width
     */
    private getAnnotationOverlayWidth(): number {
        let element: Element = this.annotationOverlayElement;

        // Get parent element i.e. annotation overlay right edge boundary
        if (element !== undefined) {
            return this.annotationOverlayElementClientRect.right;
        }
        return 0;
    }

    /*
     * sets when dropdowns visible in the screen.
     */
    private get getUIDropDownVisibility() {
        return (userInfoStore.instance.isUserInfoPanelOpen
            || this.isZoomOptionOpen
            || this.isMarkByOptionOpen
            || markingStore.instance.isMarkSchemeHeaderDropDownOpen
            || exceptionStore.instance.isExceptionSidePanelOpen
            || messageStore.instance.isMessageSidePanelOpen
            || toolbarStore.instance.isBookMarkPanelOpen
            || toolbarStore.instance.isBookmarkTextboxOpen);
    }

    /**
     * Show or hide remove context menu
     * @param isVisible
     * @param currentlySelectedAnnotationToken
     * @param clientX
     * @param clientY
     * @param annotationOverlayWidth
     */
    private showOrHideRemoveContextMenu(isVisible: boolean,
        currentlySelectedAnnotationToken: string,
        clientX: number,
        clientY: number,
        annotationOverlayWidth: number,
        annotationData: annotation) {


        let isActive: boolean = annotationData ?
            annotationData.markSchemeId === markingStore.instance.currentQuestionItemInfo.uniqueId : false;

        /*
         * When we navigate away from response and there are marks to save to db, response screen would be shown untill
         * save marks completed. But Marking progress will be immediately set to false. Then annotation overlay will be hidden.
         * in order to avoid that we need to check where we are navigating as well.navigateTo will only be set when navigating
         * from open or ingarce response
         */
        if ((currentlySelectedAnnotationToken !== undefined || currentlySelectedAnnotationToken !== '')
            && isActive
            && (this.props.isResponseEditable)) {
            let annotationContextMenuData = annotationHelper.getContextMenuData(currentlySelectedAnnotationToken, annotationOverlayWidth, annotationData);
            // show context menu only if the annotation is for current marking
            if (!annotationData.isPrevious) {
                markingActionCreator.showOrHideRemoveContextMenu(isVisible, clientX, clientY, annotationContextMenuData);
            }
        }
    }

    /**
     * Clear/ reset pan data
     */
    private clearPanData = () => {
        this.pannedStampId = 0;
        this.pannedStamp = undefined;
        this.selectedStamp = undefined;
        this.clientToken = '';
        this.isActiveAnnotation = true;
    };

    componentDidUpdate() {
        if (this.props.getMarkSheetContainerProperties) {
            var markSheetContainer = this.props.getMarkSheetContainerProperties();
            if (markSheetContainer) {
                this.marksheetContainerProperties = markSheetContainer.element;
            }
        }

        this.annotationOverlayElement = this.getAnnotationOverlayElement();
        if (this.annotationOverlayElement) {
            this.annotationOverlayElementClientRect = this.annotationOverlayElement.getBoundingClientRect();

            // Add overlay details to the list for displaying On page comment side view
            let overlayDetail: OutputPage = {
                outputPageNo: this.props.outputPageNo ? this.props.outputPageNo : 0,
                pageNo: (this.props.isEBookMarking === true) ? this.props.structerdPageNo : (this.props.pageNo ? this.props.pageNo : 0),
                imageClusterId: this.props.imageClusterId ? this.props.imageClusterId : 0,
                width: this.props.currentImageMaxWidth,
                height: this.props.currentOutputImageHeight,
                structeredPageNo: this.props.structerdPageNo ? this.props.structerdPageNo : this.props.pageNo,
                overlayElement: this.annotationOverlayElement
            }
            onPageCommentHelper.addOutputPageAttributesForSideView(overlayDetail, this.props.isEBookMarking);
            //if (this.props.id.indexOf('annotationOverlaystitched') === 0) {
            // Calculating the image boundary. This will re-calculate on browser resize automatically.
            this.overlayBoundary = annotationHelper.getStitchedImageBoundary(this.annotationOverlayElement.parentElement, this.props.displayAngle);
            //}
            // while moving a annotation in the annotation overlay, annotation will be set to hide. we will set visible
            // true only in pan end. we need to render the comment container after pan end (this.pannedStampId === 0) to
            // get updated visible property from the onpagecomment helper.
            if (this.props.refreshCommnetContainer && this.pannedStampId === 0 && this.refreshCommentContainer === true) {
                this.refreshCommentContainer = false;
                this.props.refreshCommnetContainer();
            }
        }
    }

    componentWillUpdate() {
        // we need to calculate the zindex here as the image width and height will get be changing in case of linking
        annotationHelper.setZIndexForStaticAnnotations(this.props.currentImageMaxWidth, this.props.currentOutputImageHeight);
        // added as part of Defect #30180.
        // defect was due to zero stroke width.
        if (this.hlineStrokeWidth === constants.ZERO_STROKE_WIDTH) {
            this.hlineStrokeWidth = annotationHelper.getStrokeWidth(this.annotationOverlayElement,
                this.props.displayAngle);
        }
    }

    componentDidMount() {
        this.isComponentMounted = true;
        if (this.props.getMarkSheetContainerProperties) {
            var markSheetContainer = this.props.getMarkSheetContainerProperties();
            if (markSheetContainer) {
                this.marksheetContainerProperties = markSheetContainer.element;
            }
        }

        this.annotationOverlayElement = this.getAnnotationOverlayElement();
        if (this.annotationOverlayElement) {

            // Add overlay details to the list for displaying On page comment side view
            let overlayDetail: OutputPage = {
                outputPageNo: this.props.outputPageNo ? this.props.outputPageNo : 0,
                pageNo: (this.props.isEBookMarking === true) ? this.props.structerdPageNo : (this.props.pageNo ? this.props.pageNo : 0),
                imageClusterId: this.props.imageClusterId ? this.props.imageClusterId : 0,
                width: this.props.currentImageMaxWidth,
                height: this.props.currentOutputImageHeight,
                structeredPageNo: this.props.structerdPageNo,
                overlayElement: this.annotationOverlayElement
            }
            onPageCommentHelper.addOutputPageAttributesForSideView(overlayDetail, this.props.isEBookMarking);

            this.annotationOverlayElementClientRect = this.annotationOverlayElement.getBoundingClientRect();

            // if (this.props.id.indexOf('annotationOverlaystitched') === 0) {
            // Calculating the image boundary. This will re-calculate on browser resize automatically.
            this.overlayBoundary = annotationHelper.getStitchedImageBoundary(this.annotationOverlayElement.parentElement, this.props.displayAngle);
            //}
        }
        /* Please do not add any store event listeners here. Please add that in ImageContainer and pass as props to avoid possible
        EventEmitter memory leak node.js warning because this component will repeat based on no of pages */
        this.setUpEvents();
        window.addEventListener('resize', this.updateStrokeWidthOnWindowResize);
        this.hlineStrokeWidth = annotationHelper.getStrokeWidth(this.annotationOverlayElement,
            this.props.displayAngle);
        if (this.props.isReadOnly) {
            this.forceAnnotationOverlayToReRender();
        }
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT,
            this.updateStrokeWidthOnWindowResize);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        toolbarStore.instance.setMaxListeners(0);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.PAN_END, this.onPanEndListener);
        markingStore.instance.addListener(markingStore.MarkingStore.VALID_ANNOTATION_MARK, this.stampAnnotation);
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.questionItemChanged);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.annotationUpdated);
        stampStore.instance.addListener(stampStore.StampStore.UPDATE_COMMENT_LIST_IN_SIDE_VIEW_EVENT, this.forceAnnotationOverlayToReRender);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.updateStrokeWidthOnZoom);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelectedInToolbar);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.onRemoveAnnotation);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_COMPLETED,
            this.updateStrokeWidthOnZoom);
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
        /* Please do not add any store event listeners here. Please add that in ImageContainer and pass as props to avoid possible
        EventEmitter memory leak node.js warning because this component will repeat based on no of pages */
        this.unRegisterEvents();
        window.removeEventListener('resize', this.updateStrokeWidthOnWindowResize);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT,
            this.updateStrokeWidthOnWindowResize);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_END, this.onPanEndListener);
        markingStore.instance.removeListener(markingStore.MarkingStore.VALID_ANNOTATION_MARK, this.stampAnnotation);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.questionItemChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.annotationUpdated);
        stampStore.instance.removeListener(stampStore.StampStore.UPDATE_COMMENT_LIST_IN_SIDE_VIEW_EVENT, this.forceAnnotationOverlayToReRender);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.updateStrokeWidthOnZoom);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelectedInToolbar);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.onRemoveAnnotation);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_COMPLETED,
            this.updateStrokeWidthOnZoom);
    }

    componentWillReceiveProps(nextProps: OverlayProps) {
        // if events are not hooked then hook touch events - sometimes in ComponentDidMount elements is not
        // getting to hook the events in this scenario we have to hook that again - seems it like a bug
        // related to React - needs to investiagate further

        // this will hook touch events if it's not hooked yet
        this.setUpEvents();
    }

    /* annotation updated event handler */
    private annotationUpdated = () => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * selected question item changed
     */
    private questionItemChanged = (): void => {
        if (this.isComponentMounted) {
            // remove dynamic annotation selection on question item change, only if dynamic annotaion selection is enabled.
            if (this.isDynamicAnnotationBorderShowing) {
                markingActionCreator.updateAnnotationSelection(false);
            }

            this.setState({ renderedOn: Date.now() });
        }
    };

    /**
     * load the annotations for the current page
     */
    private getAnnotationsToDisplayInCurrentPage = () => {
        this.treeViewHelper = new treeViewDataHelper();
        let currentQuestionItem = markingStore.instance.currentQuestionItemInfo;
        if (currentQuestionItem && (currentQuestionItem.imageClusterId > 0 || this.props.isEBookMarking === true) && !this.tree) {
            this.tree = this.treeViewHelper.treeViewItem();
        }
        if (this.props.doApplyLinkingScenarios === true && this.props.isReadOnly !== true && this.tree) {
            let multipleMarkSchemes = markingHelper.getMarkschemeParentNodeDetails(
                this.tree, markingStore.instance.currentMarkSchemeId, true);
            let outputPageNo = annotationHelper.getOutputPageNo(this.props.doApplyLinkingScenarios,
                this.props.imageZones, this.props.imageZone, this.props.outputPageNo);
            this.annotationsToDisplayInCurrentPage = annotationHelper.getAnnotationsToDisplayInLinkingScenarios(
                this.props.isALinkedPage,
                this.props.imageClusterId,
                this.props.currentImageMaxWidth,
                this.props.topAboveCurrentZone,
                this.props.zoneHeight,
                outputPageNo,
                this.props.currentImagePageNo,
                multipleMarkSchemes,
                pageLinkHelper.doShowPreviousMarkerLinkedPages,
                responseHelper.getCurrentResponseSeedType(),
                this.props.isEBookMarking);
            if (!this.annotationsInSkippedZone) {
                this.annotationsInSkippedZone = this.getAnnotationsInSkippedZone(this.props.currentImageZones,
                    this.props.skippedZones, multipleMarkSchemes);
            }
            if (this.annotationsInSkippedZone && this.annotationsInSkippedZone.count() > 0) {
                this.annotationsToDisplayInCurrentPage = this.annotationsToDisplayInCurrentPage.concat(this.annotationsInSkippedZone);
                this.annotationsInSkippedZone = undefined;
            }
        } else {
            let markSchemesWithSameImages: any;
            if (this.tree && this.tree.treeViewItemList) {
                if (this.props.isEBookMarking) {
                    markSchemesWithSameImages = markingHelper.getMarkSchemesWithSameQuestionTagId(this.tree,
                        markingStore.instance.currentQuestionItemQuestionTagId, true);
                } else {
                    markSchemesWithSameImages = markingHelper.getMarkSchemesWithSameImageClusterId(this.tree,
                        markingStore.instance.currentQuestionItemImageClusterId, true);
                }
            }
            this.annotationsToDisplayInCurrentPage = annotationHelper.getAnnotationsToDisplayInCurrentPage
                (this.props.imageClusterId,
                this.props.outputPageNo,
                this.props.currentImageMaxWidth,
                this.props.pageNo,
                this.props.isReadOnly,
                responseHelper.getCurrentResponseSeedType(),
                responseHelper.isAtypicalResponse(),
                markSchemesWithSameImages,
                this.props.isEBookMarking);
        }
    };

    /**
     * Render method of the DisplayAnnotations
     * Get the Annotations based on the zone and check the annotaion should be displayed for the current page based on the height.
     */
    render() {
        // If data not exists wait for the data.
        if (!this.isMarksAndAnnotationsLoaded) {
            // Check data is exists or not
            this.isMarksAndAnnotationsLoaded = markingStore.instance.isMarksLoaded
                (markingStore.instance.currentMarkGroupId);

            let isQuestionUnselected: boolean
                = markingStore.instance.currentQuestionItemInfo === undefined &&
                responseStore.instance.selectedResponseViewMode === enums.ResponseViewMode.zoneView;

            // If mark are not loaded or Selection is not fired return the component
            if (isQuestionUnselected) {
                return null;
            }
        }

        // If Annotations displaying Unstructed/ structredZoned view get it from collection other wise get it from calculated collection
        if (this.props.imageClusterId > 0
            || (this.props.isEBookMarking === true && responseStore.instance.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView)
			|| (!this.props.isEBookMarking === true &&
				(markerOperationModeFactory.operationMode.isAwardingMode ?
				awardingStore.instance.selectedCandidateData.markingMethodID : responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured))
            || responseHelper.isAtypicalResponse()
            || (this.props.isALinkedPage === true && this.props.imageClusterId === 0 && !this.props.isReadOnly)) {
            this.getAnnotationsToDisplayInCurrentPage();
        }
        // for structured response in frv, when we flag as seen the collection will not updated and the seen annotation will not display, so refresh the collection
        else if (responseStore.instance.selectedResponseViewMode === enums.ResponseViewMode.fullResponseView) {
            this.annotationsToDisplayInCurrentPage = this.retrieveAnnotationsToDisplayInCurrentPage();
        } else {
            this.annotationsToDisplayInCurrentPage = this.annotationsToDisplay;
        }

        let uniqueId = markingStore.instance.currentQuestionItemInfo ? markingStore.instance.currentQuestionItemInfo.uniqueId : 0;
        var toRender = null;
        var responseMode: enums.ResponseMode = markingStore.instance.currentResponseMode;
        let isActive = true, isFade = false;
        let marksAndAnnotationVisibilityDetails:
            Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>> =
            markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        if (this.annotationsToDisplayInCurrentPage && this.annotationsToDisplayInCurrentPage.count() > 0) {
            let canRenderPreviousMarksInStandardisationSetup = markerOperationModeFactory.operationMode.canRenderPreviousMarksInStandardisationSetup;
            // current marks
            let isAnnotationPartOfVisibleMarkGroup =
                marksAndAnnotationsVisibilityHelper.isAnnotationVisible(
                    markingStore.instance.currentMarkGroupId,
                    marksAndAnnotationVisibilityDetails,
					markingStore.instance.currentMarkGroupId,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
					canRenderPreviousMarksInStandardisationSetup);
            let isVisible: boolean = isAnnotationPartOfVisibleMarkGroup;
            let angle = annotationHelper.getAngleforRotation(this.props.displayAngle);
            let annotationOverlayParentElement: Element = this.annotationOverlayElement ?
                this.annotationOverlayElement.parentElement : undefined;
            this.overlayBoundary = annotationHelper.getStitchedImageBoundary(annotationOverlayParentElement, angle);
            let maxZIndex = annotationHelper.maxZIndex();

            toRender = this.annotationsToDisplayInCurrentPage.map((annotation: annotation, index: number) => {
                if (annotation.isPrevious) {
                    isVisible = marksAndAnnotationsVisibilityHelper.isAnnotationVisible(
                        markingStore.instance.currentMarkGroupId,
                        marksAndAnnotationVisibilityDetails,
                        responseStore.instance.isWholeResponse ?
                            annotation.markGroupIdofWholeResponse : annotation.markGroupId,
                            annotation.examinerRoleId,
                            canRenderPreviousMarksInStandardisationSetup);
                } else {
                    isVisible = isAnnotationPartOfVisibleMarkGroup;
                }

                if (this.props.isReadOnly) {
                    // isReadOnly will be set to true only for FR view (fullresponseimageviewer.tsx)
                    isVisible = true;
                }

                let uniqueAnnotationId: string = this.props.pageNo + '-' + this.props.outputPageNo + '-' + index;
                let stamp: stampData = stampStore.instance.getStamp(annotation.stamp);
                let zoneTop = this.props.isReadOnly ? 0 : this.props.zoneTop;
                let zoneLeft = this.props.isReadOnly ? 0 : this.props.zoneLeft;
                let zoneHeight = this.props.isReadOnly ? 0 : this.props.zoneHeight;
                let topAboveCurrentZone = this.props.topAboveCurrentZone ? this.props.topAboveCurrentZone : 0;

                // Set the style in % to support resize.
                // For Supporting Web Assessor, recalculate the left/ top position.Annottaion size is 32 in WA
                let annotationWrapStyle = this.getAnnotationWrapStyle(annotation, stamp);

                let annotationTop = 0;

                // If on page comment treat it as static annotation.
                if (stamp.stampId === enums.DynamicAnnotation.OnPageComment && annotation.width) {
                    // As we have to place the annotation in anchor position, we need to take the width and height
                    // to calculate the position. If dragging the annotation will result the widht and height to NaN
                    annotationTop = (Math.abs(annotation.height - topAboveCurrentZone - this.annotationSizeFraction) / this.props.currentOutputImageHeight) * 100;
                } else {
                    annotationTop = ((annotation.topEdge - topAboveCurrentZone - ((stamp.stampType === enums.StampType.text) ? this.textAnnotationHeightAdjustment : this.annotationSizeFraction)) / this.props.currentOutputImageHeight) * 100;
                }

                var stitchedImageAttribute = this.props.currentOutputImageHeight;

                if ((this.overlayBoundary && this.overlayBoundary.length > 0) && annotationOverlayParentElement) {
                    var totalImageHeight: number = 0, stitchedImageIndex: number = 0;

                    for (var i = 0; i < this.overlayBoundary.length;) {

                        totalImageHeight += this.overlayBoundary[i].imageHeight;
                        var currentPagePercentage = (totalImageHeight / this.annotationOverlayElement.clientHeight) * 100;
                        if (annotationTop < currentPagePercentage) {
                            i = this.overlayBoundary.length;
                        } else {
                            i++;
                            stitchedImageIndex++;
                        }
                    }

                    let stitchedImageSeperator = annotationHelper.calculateStitchedImageGapOffset(angle,
                        stitchedImageIndex, this.overlayBoundary, annotationOverlayParentElement);

                    // When saving annotations of stitched image we are removing the stitched gap. But
                    // while displaying in A3 we need to add the gap again.
                    annotationWrapStyle.top = (annotationTop + stitchedImageSeperator) + '%';
                }

                if (annotationHelper.isDynamicAnnotation(stamp)) {
                    annotationWrapStyle.zIndex = annotation.isPrevious ? annotation.zOrder :
                        (Math.round((this.props.currentImageMaxWidth * this.props.currentOutputImageHeight) -
                            (annotation.width * annotation.height)));
                } else {
                    // Fix for defect 58048 and 58438. Increased in z-index for onpage comments. To select the comments from previous marks
                    if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                        annotationWrapStyle.zIndex = annotation.isPrevious ? maxZIndex : maxZIndex + 1;
                    } else {
                        annotationWrapStyle.zIndex = annotation.isPrevious ? annotation.zOrder : maxZIndex;
                    }
                }

                // Make dynamic annotation Active/Fade according to closed/FRV.
                if (annotationHelper.isDynamicStampType(stamp.stampType)) {
                    if (this.props.isReadOnly) {
                        isActive = false;
                        isFade = false;
                    } else if (responseMode === enums.ResponseMode.closed || !this.props.isResponseEditable) {
                        isActive = false;
                        isFade = annotation.markSchemeId === uniqueId ? false : true;
                    } else {
                        isActive = annotation.markSchemeId === uniqueId ? true : false;
                        isFade = annotation.markSchemeId === uniqueId ? false : true;
                    }
                }

                // We need to check whether a stamp is visible or not, based on this we will hide or show the stamps
                // in annotation overlay.If pan is started then we will hide the stamp and on pan end we will show that again
                if (this.pannedStampId === stamp.stampId &&
                    annotation.clientToken === this.clientToken) {
                    isVisible = false;
                    if (!this.refreshCommentContainer && stamp.stampId === enums.DynamicAnnotation.OnPageComment) {
                        this.refreshCommentContainer = true;
                    }
                }

                var isResponseModeClosed: boolean = annotationHelper.isResponseReadOnly();
                let annotationToolTip: string = this.getToolTip(stamp.stampId, annotation.markSchemeId);

                if (stamp != null && stamp !== undefined) {
                    switch (stamp.stampType) {
                        case enums.StampType.image:
                            return (
                                <ImageStamp id={stamp.name + '-icon'}
                                    uniqueId={stamp.stampId + '-' + uniqueAnnotationId + '-onscriptannotation'}
                                    toolTip={annotationToolTip}
                                    wrapperStyle={annotationWrapStyle} isDisplayingInScript={true}
                                    isActive={annotation.markSchemeId === uniqueId}
                                    key={stamp.name + annotation.clientToken + '-icon'}
                                    stampData={stamp}
                                    clientToken={annotation.clientToken}
                                    selectedLanguage={this.props.selectedLanguage}
                                    forceRerender={this.forceAnnotationRerender}
                                    annotationData={annotation}
                                    isInFullResponseView={this.props.isReadOnly === true ? this.props.isReadOnly : false}
                                    isVisible={isVisible}
                                    isResponseEditable={this.props.isResponseEditable} />
                            );
                        case enums.StampType.text:
                            return (
                                <TextStamp id={stamp.name + '-icon'}
                                    uniqueId={stamp.stampId + '-' + uniqueAnnotationId + '-onscriptannotation'}
                                    toolTip={annotationToolTip}
                                    wrapperStyle={annotationWrapStyle} isDisplayingInScript={true}
                                    isActive={annotation.markSchemeId === uniqueId}
                                    key={stamp.name + annotation.clientToken + '-icon'}
                                    stampData={stamp}
                                    clientToken={annotation.clientToken}
                                    selectedLanguage={this.props.selectedLanguage}
                                    forceRerender={this.forceAnnotationRerender}
                                    annotationData={annotation}
                                    isInFullResponseView={this.props.isReadOnly === true ? this.props.isReadOnly : false}
                                    isVisible={isVisible}
                                    isResponseEditable={this.props.isResponseEditable} />
                            );
                        case enums.StampType.dynamic:
                            // If on page comment treat it as static annotation.
                            if (stamp.stampId === enums.DynamicAnnotation.OnPageComment) {
                                // add the annotation to the list which can be used to calculate the side view
                                // zoneLeft and skippedZoneLeft for the scenarios of linked page
                                let zoneLeft = this.props.zoneLeft ? this.props.zoneLeft : 0;
                                if (annotation.skippedZoneLeft !== undefined) {
                                    zoneLeft = annotation.skippedZoneLeft;
                                }
                                let annotationLeftPx = (annotation.width - this.annotationSizeFraction + zoneLeft) / this.props.currentImageMaxWidth;
                                if (annotation.markingOperation !== enums.MarkingOperation.deleted) {
                                    let commentItem: OnPageCommentSideViewItem = {
                                        clientToken: annotation.clientToken,
                                        imageClusterId: responseHelper.isAtypicalResponse() ? 0 : annotation.imageClusterId,
                                        outputPageNo: this.props.outputPageNo ? this.props.outputPageNo : 0,
                                        pageNo: (this.props.isEBookMarking === true) ? this.props.structerdPageNo : (this.props.pageNo ? this.props.pageNo : 0),
                                        annotationTopPx: parseFloat(annotationWrapStyle.top) / 100,
                                        annotationHeight: this.annotationSize,
                                        annotationWidth: this.annotationSize,
                                        responseWidth: this.props.currentImageMaxWidth,
                                        annotationLeftPx: annotationLeftPx,
                                        comment: annotation.comment,
                                        markSchemeId: annotation.markSchemeId,
                                        annotation: annotation,
                                        isVisible: isVisible,
                                        isDefinitive: annotation.definitiveMark
                                    }

                                    let isRenderCommet: boolean = false;
                                    if (this.isStitchedImage &&
                                        onPageCommentHelper.isCommentsSideViewEnabled &&
                                        !markingStore.instance.isRotating) {
                                        let comment = onPageCommentHelper.getCommentSideViewItem(annotation.clientToken);
                                        if (comment && comment.annotationTopPx !== commentItem.annotationTopPx) {
                                            isRenderCommet = true;
                                        }
                                    }
                                    onPageCommentHelper.addPageCommentsInResponseToSideViewList(commentItem);

                                    // on rotating a stitched image, the annotationTopPx is recalculated correctly but don't render the comment with updated value
                                    // render respective side view comment if annotationTopPx is recalculated, to avoid line alignment issue in stitched images
                                    if (isRenderCommet) {
                                        stampActionCreator.renderSideViewComments(undefined, undefined, commentItem.clientToken);
                                    }
                                }

                                return (
                                    <ImageStamp id={stamp.name + '-icon'}
                                        uniqueId={stamp.stampId + '-' + uniqueAnnotationId + '-onscriptannotation'}
                                        toolTip={annotationToolTip}
                                        wrapperStyle={annotationWrapStyle} isDisplayingInScript={true}
                                        isActive={annotation.markSchemeId === uniqueId}
                                        key={stamp.name + annotation.clientToken + '-icon'}
                                        stampData={stamp}
                                        clientToken={annotation.clientToken}
                                        selectedLanguage={this.props.selectedLanguage}
                                        forceRerender={this.forceAnnotationRerender}
                                        annotationData={annotation}
                                        isInFullResponseView={this.props.isReadOnly === true ? this.props.isReadOnly : false}
                                        isVisible={isVisible}
                                        isResponseEditable={this.props.isResponseEditable} />
                                );
                            }

                            return (
                                <DynamicStampFactory id={stamp.name + '-icon'}
                                    key={stamp.name + annotation.clientToken + '-icon'}
                                    toolTip={annotationToolTip}
                                    selectedLanguage={this.props.selectedLanguage}
                                    imageWidth={this.props.currentImageMaxWidth}
                                    imageHeight={this.props.currentOutputImageHeight}
                                    annotationData={annotation}
                                    stampData={stamp}
                                    clientToken={annotation.clientToken}
                                    getImageContainerRect={this.props.getImageContainerRect ? this.props.getImageContainerRect : null}
                                    getAnnotationOverlayElement={this.getAnnotationOverlayElement}
                                    getMarkSheetContainerProperties={this.props.getMarkSheetContainerProperties}
                                    imageZones={this.getImageZones()}
                                    isActive={isActive}
                                    isFade={isFade}
                                    isDrawMode={this.isDrawMode}
                                    setCurrentAnnotationElement={this.setCurrentAnnotationElement}
                                    imageClusterId={this.props.imageClusterId}
                                    outputPageNo={this.props.outputPageNo}
                                    pageNo={this.props.pageNo}
                                    setDynamicAnnotationisMoving={this.setDynamicAnnotationisMoving}
                                    setDynamicAnnotationBorder={this.setDynamicAnnotationBorder}
                                    displayAngle={this.props.displayAngle}
                                    drawDirection={this.drawDirection}
                                    isDrawEnd={this.isDrawEnd}
                                    isStamping={this.isStamping}
                                    isVisible={isVisible}
                                    isResponseEditable={this.props.isResponseEditable}
                                    isInFullResponseView={this.props.isReadOnly === true ? this.props.isReadOnly : false}
                                    enableAnnotationOverlayPan={this.enableAnnotationOverlayPan}
                                    enableImageContainerScroll={this.enableImageContainerScroll}
                                    overlayBoundary={this.overlayBoundary}
                                    doEnableClickHandler={this.doEnableClickHandler}
                                    zoneHeight={zoneHeight}
                                    zoneTop={zoneTop}
                                    zoneLeft={zoneLeft}
                                    topAboveCurrentZone={topAboveCurrentZone}
                                    doApplyLinkingScenarios={this.props.doApplyLinkingScenarios}
                                    isInLinkedPage={this.props.isALinkedPage}
                                    imageZone={this.props.imageZone}
                                    currentImagePageNo={this.props.currentImagePageNo}
                                    pagesLinkedByPreviousMarkers={this.props.pagesLinkedByPreviousMarkers}
                                    isAnnotationAdded={annotation.clientToken === this.addedAnnotationClientToken}
                                    isEBookMarking={this.props.isEBookMarking} />
                            );
                    }
                }

                return null;
            });
        }
        this.forceAnnotationRerender = false;
        let svgHeight = Number(this.hlineStrokeWidth) + constants.SVG_HEIGHT - 1;
        if (svgHeight <= constants.SVG_HEIGHT) {
            svgHeight = constants.SVG_HEIGHT + 1;
        }
        let paddingTop: number;
        if (this.props.isReadOnly) {
            paddingTop = this.props.currentOutputImageHeight / (this.props.currentImageMaxWidth);
        }
        var styleAnnotationHolder: React.CSSProperties = {
            paddingTop: 'calc(' + paddingTop * 100 + '% -  30px )'
        };

        let rotatedAngle = this.props.displayAngle;
        rotatedAngle = annotationHelper.getAngleforRotation(rotatedAngle);

        //Render annotations to the holder.
        return (
            <div className="annotation-overlay" ref={(reference) => {
                this.overlayElement = reference;
            }} id={'Overlay_' + this.getAnnotationOverlayId()}>
                <div className={this.annotationHolderClass}
                    id={this.getAnnotationOverlayId()}
                    onClick={!this.props.isReadOnly ? this.onClickHandler : null}
                    onMouseMove={!this.props.isReadOnly ? this.onMouseMove : null}
                    onMouseLeave={!this.props.isReadOnly ? this.onMouseLeave : null}
                    onContextMenu={!this.props.isReadOnly ? this.onResponseImageContextHandler : null}
                    onMouseUp={!this.props.isReadOnly ? this.onMouseUp : null}
                    onMouseDown={!this.props.isReadOnly ? this.onMouseDown : null}
                    onMouseOver={this.mouseOverHandler}
                    data-rotatedangle={rotatedAngle}
                    data-imagewidth={this.props.currentImageMaxWidth}
                    data-imageheight={this.props.currentOutputImageHeight}
                    style={styleAnnotationHolder}
                    data-pageno={this.props.pageNo}
                    data-topabovecurrentzone={this.props.topAboveCurrentZone}
                    data-isalinkedpage={this.props.isALinkedPage ? this.props.isALinkedPage : false}
                    data-zonetop={this.props.zoneTop}
                    data-currentimagepageno={this.props.currentImagePageNo}>
                    <style> {this.annotationOverlayStrokeWidth + '#' +
                        this.getAnnotationOverlayId() + ' .line.annotation-wrap:not(.wavy) svg{height:' + svgHeight + 'px;}' +
                        '#' + this.getAnnotationOverlayId() + ' .annotation-wrap.static' + '{width: ' + this.annotationSize + '%}'}
                    </style>
                    <DynamicMovingElement annotationOverlayId={this.getAnnotationOverlayId()} />
                    {toRender}
                </div>
                {this.props.isEBookMarking === true && this.props.isReadOnly ?
                    this.setUnknownContentHighlighter(this.props.pageNo, this.props.currentImageMaxWidth, this.props.currentOutputImageHeight) : null}
                {this.renderAcetates()}
            </div>
        );
    }

    /**
     * get image zones of the response
     */
    private getImageZones = () => {
        return this.props.imageZones ?
            this.props.imageZones :
            (this.props.isEBookMarking === true && this.props.imageZone) ?
                this.props.imageZone : null
    };

    /**
     * Retrieve the set of annotations to display in Current Page.
     */
    private retrieveAnnotationsToDisplayInCurrentPage(): Immutable.List<annotation> {
        if (this.props.isEBookMarking) {
            return annotationHelper.getAnnotationsForThePageInEBookMarking(this.props.pageNo,
                this.props.currentImageMaxWidth, this.props.currentOutputImageHeight,
                this.props.isALinkedPage, responseHelper.isEResponse);
        } else {
            return annotationHelper.getAnnotationsForThePageInStructuredResponse(this.props.pageNo,
                this.props.currentImageMaxWidth, this.props.currentOutputImageHeight,
                this.props.isAdditionalObject, this.props.isALinkedPage);
        }
    }

    /*
     * Returns the tooltip to be applied for the annotations
     */
    private getToolTip = (stampId: number, markSchemeId: number): string => {
        if (this.props.isReadOnly === true) {
            return '';
        }

        return localeStore.instance.TranslateText('marking.response.stamps.stamp_' + stampId) + '\n' +
            markingStore.instance.toolTip(markSchemeId);
    };

    /*sets the pan enable status for the annotation overlay*/
    public enableAnnotationOverlayPan = (value: boolean): void => {
        this.doEnablePan = value;
    };

    /*
     * Returns true, when view whole page button is suppose to display in script.
     */
    private viewWholePageVisibilityCheck = (imageZone: ImageZone): boolean => {
        let currentQuestionItemImageClusterId = markingStore.instance.currentQuestionItemInfo.imageClusterId;
        return (!(imageZone.topEdge === 0
            && imageZone.leftEdge === 0
            && imageZone.width === 100
            && imageZone.height === 100)
            && imageZone.isViewWholePageLinkVisible
            && toolbarStore.instance.selectedStampId === 0
            && toolbarStore.instance.panStampId === 0
            && !stampStore.instance.isDynamicAnnotationActive
            // for markschemes with no image cluster(no image) we dont need to show view whole page button
            && currentQuestionItemImageClusterId !== 0
            && currentQuestionItemImageClusterId !== null
            && currentQuestionItemImageClusterId !== undefined);
    }

    /**
     * This method will get fired when the mouse is moved over the annotation area
     */
    mouseOverHandler = (event: any) => {
        var annotationElement: Element = htmlUtilities.getElementFromPosition(event.clientX, event.clientY);

        // Element will be null in MAC Safari, if over the stamp panel using trackpad
        if (annotationElement === null) {
            return;
        }

        let rotatedAngle = annotationHelper.getAngleforRotation(Number(annotationElement.getAttribute('data-rotatedangle')));
        if (!htmlUtilities.isTabletOrMobileDevice && responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
            this.annotationOverlayElement = this.getAnnotationOverlayElement();
            this.overlayBoundary = annotationHelper.getStitchedImageBoundary(this.annotationOverlayElement.parentElement, rotatedAngle);
            if (this.props.imageZone) {
                if (this.viewWholePageVisibilityCheck(this.props.imageZone)) {
                    // action to set view whole page button visible.
                    this.isCursorOverAnnotationOverlay = true;
                    this.previouslySelectedZone = this.props.imageZone;
                    responseActionCreator.viewWholePageLinkAction(true, this.props.imageZone);
                }
            } else if (this.props.imageZones && this.props.imageZones.length > 0) {
                if (this.isStitchedImage &&
                    annotationHelper.isAnnotationInsideStitchedImage(this.overlayBoundary,
                        rotatedAngle,
                        event.clientX,
                        event.clientY)) {
                    let currentImageZone: ImageZone = annotationHelper.getImageZone(this.overlayBoundary,
                        rotatedAngle,
                        event.clientX,
                        event.clientY,
                        this.props.imageZones);
                    if (this.viewWholePageVisibilityCheck(currentImageZone)) {
                        if (!this.isCursorOverAnnotationOverlay) {
                            this.isCursorOverAnnotationOverlay = true;
                            this.previouslySelectedZone = currentImageZone;
                            responseActionCreator.viewWholePageLinkAction(true, currentImageZone);
                        } else if (this.isCursorOverAnnotationOverlay &&
                            this.previouslySelectedZone) {
                            this.previouslySelectedZone = currentImageZone;
                            this.isCursorOverAnnotationOverlay = true;
                            responseActionCreator.viewWholePageLinkAction(true, currentImageZone);
                        }
                    }
                }
            }
        }
    };

    /**
     * resets the view whole page button details.
     */
    private resetViewWholePageButtonDetails() {
        if (this.isCursorOverAnnotationOverlay) {
            this.previouslySelectedZone = undefined;
            this.isCursorOverAnnotationOverlay = false;
            // action to set view whole page button inVisible.
            responseActionCreator.viewWholePageLinkAction(false, this.props.imageZone);
        }
    }

    /*
     * Handles the click event for the annotation handler.
     */
    private onClickHandler(event: any) {
        // close the context menu if anything is open while clicking in the annotation overlay
        markingActionCreator.showOrHideRemoveContextMenu(false);

        var stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
        let isSelectedStampDynamicAnnotation = annotationHelper.isDynamicAnnotation(stamp);
        let isCommentBoxOpen = stampStore.instance.SelectedOnPageCommentClientToken !== undefined ||
            stampStore.instance.SelectedSideViewCommentToken !== undefined;
        // fix for #68482 - event.button will be 1 for mouse middle button
        // and we dont need to place annotation for middle button click
        if (this.pannedStampId === 0 && this.isClickHandlerEnabled && event.button !== 1) {
            let clickedElement = htmlUtilities.getElementFromPosition(event.clientX, event.clientY);

            // Element will be null in MAC Safari, if over the stamp panel using trackpad
            if (clickedElement === null) {
                return;
            }

            var isPannedOnDynamicAnnotation = annotationHelper.isDynamicAnnotationElement(clickedElement);
            let isPreviousAnnotation = annotationHelper.isPreviousAnnotation(clickedElement);
            let annotationElement = htmlUtilities.findAncestor(clickedElement, 'annotation-wrap');
            let isActiveAnnotation = true;
            // check if annotation is active or not
            if (annotationElement && typeof annotationElement.className === 'string' &&
                annotationElement.className.indexOf('inactive') > -1) {
                isActiveAnnotation = false;
            }
            // we dont need to allow click if clicking on a dynamic annotation and the selected stamp is dynamic
            if (isSelectedStampDynamicAnnotation && isPannedOnDynamicAnnotation && !isPreviousAnnotation && isActiveAnnotation) {
                this.enableAnnotationOverlayPan(true);
                return;
            }

            if (isPannedOnDynamicAnnotation && this.isDynamicAnnotationPanCompleted) {
                // find the annotation holder of the current element
                clickedElement = annotationHelper.findAnnotationHolderOfAnElement(clickedElement);
            }

            if (stamp !== undefined && !isSelectedStampDynamicAnnotation &&
                (!annotationHelper.isDynamicAnnotationElement(clickedElement) || isPreviousAnnotation)) {
                // This check is to prevent the click event from firing in IE when PanEnd is fired
                if (toolbarStore.instance.panStampId === 0
                    && toolbarStore.instance.selectedStampId !== 0
                    && !toolbarStore.instance.isBookMarkSelected
                    && !toolbarStore.instance.isBookmarkTextboxOpen
                ) {
                    if (stamp.stampId === enums.DynamicAnnotation.OnPageComment) {

                        // closing exiting comment box instead of adding annotation (if it is open)
                        if (isCommentBoxOpen && !onPageCommentHelper.commentMoveInSideView) {
                            stampActionCreator.showOrHideComment(false);
                            markingActionCreator.setMarkEntrySelected();
                            return;
                        }
                    }

                    this.addOrUpdateAnnotation(
                        event.clientX,
                        event.clientY,
                        enums.AddAnnotationAction.Stamping,
                        toolbarStore.instance.selectedStampId
                    );

                    // Defect 21590: On page comment and similar static Annotations seems to overlap with
                    // mouse cursor SVG while stamping- IE only - noticeable on higher zoom level only
                    responseActionCreator.setMousePosition(-1, -1);
                }
            } else {
                if (this.isStamping && !this.isDynamicAnnotationBorderShowing && !htmlUtilities.isIE && !htmlUtilities.isEdge) {
                    markingActionCreator.showOrHideRemoveContextMenu(false);
                    var stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
                    if (annotationHelper.checkEventFiring() && isSelectedStampDynamicAnnotation &&
                        !toolbarStore.instance.isBookMarkSelected && !toolbarStore.instance.isBookmarkTextboxOpen &&
                        !annotationHelper.checkMouseDrawingOutsideResponseArea(event, 'stamp',
                            this.annotationOverlayElement, this.props.displayAngle, stamp.stampId, true)) {
                        // Preventing stamping annotaion when the user supposed to resize/move existing dynamic
                        // annotation.
                        if (annotationHelper.isLineAnnotation(stamp.stampId) && htmlUtilities.isTabletOrMobileDevice) {
                            let isLineAnnotationsOverlapping = annotationHelper.isLineAnnotationsOverlapping(event.clientX, event.clientY,
                                this.props.displayAngle, stamp.stampId);
                            if (isLineAnnotationsOverlapping) {
                                return;
                            }
                        }

                        this.addOrUpdateAnnotation(
                            event.clientX,
                            event.clientY,
                            enums.AddAnnotationAction.Stamping,
                            toolbarStore.instance.selectedStampId
                        );
                    }
                }
            }
        } else {
            this.doEnableClickHandler(true);
        }

        // if click on overlay when onpagecomment is deselcted from panel
        // or trying to add another annotation when an onpage comment box is open, then hide it
        if ((stamp === undefined && this.isOnPageCommentAdded) ||
            (stamp !== undefined && stamp.stampId !== enums.DynamicAnnotation.OnPageComment)
            && isCommentBoxOpen) {
            stampActionCreator.showOrHideComment(false);
            return;
        }

        if (this.isDynamicAnnotationBorderShowing && this.pannedStampId == 0 &&
            !isPannedOnDynamicAnnotation) {
            // remove dynamic annotation selection
            markingActionCreator.updateAnnotationSelection(false);
        }

        this.enableAnnotationOverlayPan(true);
        this.isDynamicAnnotationPanCompleted = true;
        this.isDynamicAnnotationDrawInProgress = false;
    }

    /**
     * This method will get fired when the mouse hover the annotation area
     * @param event
     */
    onMouseMove = (event: any) => {
        var annotationElement: Element = htmlUtilities.getElementFromPosition(event.clientX, event.clientY);

        // Element will be null in MAC Safari, if over the stamp panel using trackpad
        if (annotationElement === null) {
            return;
        }

        let angle = Number(annotationElement.getAttribute('data-rotatedangle')) > 0 ? Number(annotationElement.getAttribute('data-rotatedangle')) : this.props.displayAngle
        let rotatedAngle = annotationHelper.getAngleforRotation(angle);
        if (!htmlUtilities.isTabletOrMobileDevice &&
            responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
            if (this.props.imageZones && this.props.imageZones.length > 0) {
                this.annotationOverlayElement = this.getAnnotationOverlayElement();
                this.overlayBoundary = annotationHelper.getStitchedImageBoundary(this.annotationOverlayElement.parentElement, rotatedAngle);
                if (this.isStitchedImage) {
                    let currentImageZone: ImageZone = annotationHelper.getImageZone(this.overlayBoundary,
                        rotatedAngle,
                        event.clientX,
                        event.clientY,
                        this.props.imageZones);
                    if (this.isCursorOverAnnotationOverlay
                        && currentImageZone === undefined) {
                        responseActionCreator.viewWholePageLinkAction(false, undefined);
                        this.resetViewWholePageButtonDetails();
                    } else if (!this.isCursorOverAnnotationOverlay
                        && currentImageZone && this.viewWholePageVisibilityCheck(currentImageZone)) {
                        this.previouslySelectedZone = currentImageZone;
                        responseActionCreator.viewWholePageLinkAction(true, currentImageZone);
                        this.isCursorOverAnnotationOverlay = true;
                    } else if (this.isCursorOverAnnotationOverlay
                        && currentImageZone.uniqueId && this.previouslySelectedZone
                        && this.previouslySelectedZone.uniqueId !== currentImageZone.uniqueId) {
                        responseActionCreator.viewWholePageLinkAction(false, this.previouslySelectedZone);
                        if (this.viewWholePageVisibilityCheck(currentImageZone)) {
                            this.isCursorOverAnnotationOverlay = true;
                            this.previouslySelectedZone = currentImageZone;
                            responseActionCreator.viewWholePageLinkAction(true, currentImageZone);
                        }
                    }

                }
            }
        }

        var stamp = stampStore.instance.getStamp(toolbarStore.instance.panStampId);
        this.annotationOverlayElementClientRect = this.annotationOverlayElement.getBoundingClientRect();

        var left = event.clientX - this.annotationOverlayElementClientRect.left;
        var top = event.clientY - this.annotationOverlayElementClientRect.top;
        var isPannedOnDynamicAnnotation = annotationHelper.isDynamicAnnotationElement(annotationElement);

        // Check If pointer is over the image, If so set the cursor style else hide the style.
        let outsideResponseArea: boolean = false;
        let inGreyArea: boolean = false;
        let insideStitchedGap: boolean = true;
        outsideResponseArea = annotationHelper.checkMouseDrawingOutsideResponseArea(event, '',
            this.annotationOverlayElement, rotatedAngle);
        if (this.isStitchedImage && stamp !== undefined) {
            // Update the annotation overlay boundary on each move from one page to another. So we need to
            // update the rotated angle as well.
            this.overlayBoundary = annotationHelper.getStitchedImageBoundary(this.annotationOverlayElement.parentElement, rotatedAngle);
            inGreyArea = annotationHelper.checkInGreyArea(event.clientX, event.clientY, rotatedAngle,
                this.isDrawLeft, annotationElement,
                this.marksheetContainerProperties, 0, false, stamp.stampId, this.overlayBoundary);

            insideStitchedGap = annotationHelper.isAnnotationInsideStitchedImage(this.overlayBoundary, rotatedAngle, event.clientX, event.clientY);
        }

        if (isPannedOnDynamicAnnotation) {
            this.resetCursorPosition(false, event.clientX, event.clientY);
        } else if (!(outsideResponseArea || inGreyArea || !insideStitchedGap) &&
            (
                (!annotationHelper.isDynamicAnnotationElement(annotationElement) && !this.dynamicAnnotationisMoving)
                || annotationHelper.isPreviousAnnotation(annotationElement)
            )
        ) {
            this.resetCursorPosition(false, event.clientX, event.clientY);
        } else {
            this.resetCursorPosition(true, event.clientX, event.clientY);
            if (stamp !== undefined) {
                markingActionCreator.onAnnotationDraw(false);
            }
        }

        if (toolbarStore.instance.selectedStampId <= 0) {
            markingActionCreator.onAnnotationDraw(true);
        }
    };

    /**
     * enables or disable document selection
     * @param doSelect
     */
    private doEnableDocumentSelection(doSelect: boolean) {
        document.onselectstart = function () {
            return doSelect;
        };
    }

    /* mouse down event for annotation overlay */
    onMouseDown = (event: any) => {
        this.doEnableDocumentSelection(false);
    };

    /**
     * This method will get fired when the mouse releases
     * @param event
     */
    onMouseUp = (event: any) => {
        if (!this.isDrawMode) {
            this.isAnnotationinGreyArea = annotationHelper.checkMouseDrawingOutsideResponseArea(event, 'stamp',
                this.annotationOverlayElement, this.props.displayAngle, toolbarStore.instance.panStampId > 0 ?
                    toolbarStore.instance.panStampId : toolbarStore.instance.selectedStampId, true);
            this.isStamping = true;
        }
        this.doEnableDocumentSelection(true);
    };

    /*
    * Handles pan start event.
    * @param event
    */
    onDrawStart = (event: EventCustom) => {
        if (!this.isDynamicAnnotationDrawInProgress) {
            this.isDynamicAnnotationDrawInProgress = true;
            this.isDrawEnd = false;
            this.isStamping = false;
            this.isAnnotationinGreyArea = false;
            this.drawSequence = this.drawSequence + 1;
            this._clientToken = undefined;
            var stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
            var overlayElement = htmlUtilities.getElementFromPosition(event.changedPointers[0].clientX,
                event.changedPointers[0].clientY);

            if (overlayElement) {
                let annotationHolder = htmlUtilities.findAncestor(overlayElement, 'annotation-holder');
                if (annotationHolder) {
                    this.currentOverlayId = annotationHolder.id;
                }
            }

            if (stamp.stampId === enums.DynamicAnnotation.OnPageComment) {
                // this will hide the comment box
                stampActionCreator.showOrHideComment(false);
            }

            if (stamp !== undefined && annotationHelper.isDynamicStampType(stamp.stampType)) {
                event.srcEvent.stopPropagation();
                event.srcEvent.preventDefault();

                if (annotationHelper.checkEventFiring()) {
                    this.initCoordinates.x = event.changedPointers[0].clientX;
                    this.initCoordinates.y = event.changedPointers[0].clientY;

                    // While starting drawing HorizontalLine or HWavyLine prevent from drawing at the
                    // edges of the response. Because it adds a value of 20px at the end od saving annotation.
                    // This will result to display the annoation on another zone.
                    if (this.props.imageZones && this.props.imageZones.length > 0
                        && (stamp.stampId === enums.DynamicAnnotation.HorizontalLine
                            || stamp.stampId === enums.DynamicAnnotation.HWavyLine)) {
                        let rotatedAngle = this.props.displayAngle;
                        rotatedAngle = annotationHelper.getAngleforRotation(rotatedAngle);

                        // Map the element rect to get the left and top to calculate stitched gap area.
                        var elemRect: ClientRectDOM = this.getDrawingElementRect(this.initCoordinates.x,
                            this.initCoordinates.y, 0, 0, rotatedAngle);
                        let annotationOverlayRect: ClientRectDOM = overlayElement.getBoundingClientRect();
                        // Setting this variable to block the drawing and delete the annotation if it covers through the stitched image gap.
                        this.annotationNotOverlappingStitchedGap = annotationHelper.validateAnnotaionBoundaryOnStitchedImageGap(
                            elemRect,
                            annotationOverlayRect,
                            this.overlayBoundary,
                            rotatedAngle,
                            this.getBoundaryThreshold(this.overlayBoundary, rotatedAngle));
                    }

                    if (this.annotationNotOverlappingStitchedGap &&
                        !toolbarStore.instance.isBookMarkSelected &&
                        !toolbarStore.instance.isBookmarkTextboxOpen
                    ) {
                        this.addOrUpdateAnnotation(
                            event.changedPointers[0].clientX,
                            event.changedPointers[0].clientY,
                            enums.AddAnnotationAction.Pan,
                            toolbarStore.instance.selectedStampId
                        );
                    }
                    this.isDrawMode = true;
                }
                markingActionCreator.onAnnotationDraw(true);
                this.scrollTop = this.marksheetContainerProperties.scrollTop;
            }
        }
    };

    /**
     * This method will get fired when the mouse moves over the annotation area
     */
    onDrawMove = (evt: EventCustom) => {
        this.isDrawEnd = false;
        this.isStamping = false;
        let rotatedAngle = this.props.displayAngle;
        rotatedAngle = annotationHelper.getAngleforRotation(rotatedAngle);
        if (rotatedAngle === enums.RotateAngle.Rotate_270) {
            this.isDrawLeft = evt.deltaY < 0 ? true : false;
        } else if (rotatedAngle === enums.RotateAngle.Rotate_90) {
            this.isDrawLeft = evt.deltaX < 0 ? true : false;
        } else if (rotatedAngle === enums.RotateAngle.Rotate_180) {
            this.isDrawLeft = evt.deltaX < 0 || evt.deltaY < 0 ? true : false;
        }

        if (rotatedAngle === enums.RotateAngle.Rotate_270) {
            this.drawDirection = evt.deltaY < 0 ? enums.DrawDirection.Right : enums.DrawDirection.Left;
        } else if (rotatedAngle === enums.RotateAngle.Rotate_90) {
            this.drawDirection = evt.deltaX < 0 ? enums.DrawDirection.Left : enums.DrawDirection.Right;
        } else if (rotatedAngle === enums.RotateAngle.Rotate_180) {
            if (evt.deltaX < 0 && evt.deltaY < 0) {
                this.drawDirection = enums.DrawDirection.Top;
            } else if (evt.deltaX < 0 && evt.deltaY > 0) {
                this.drawDirection = enums.DrawDirection.Left;
            } else if (evt.deltaX > 0 && evt.deltaY < 0) {
                this.drawDirection = enums.DrawDirection.Right;
            } else if (evt.deltaX > 0 && evt.deltaY > 0) {
                this.drawDirection = enums.DrawDirection.Bottom;
            }
        }

        // rerender the annotation overlay when the draw direction is changed.
        if (this.previousDrawDirection !== this.drawDirection) {
            this.previousDrawDirection = this.drawDirection;
            this.setState({
                renderedOn: Date.now()
            });
        }

        var stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
        var panStamp = stampStore.instance.getStamp(toolbarStore.instance.panStampId);
        if (stamp !== undefined && stamp.stampId === enums.DynamicAnnotation.OnPageComment) {
            // this will hide the comment box
            stampActionCreator.showOrHideComment(false);
        }
        if (panStamp !== undefined && !annotationHelper.isDynamicStampType(panStamp.stampType)) {
            return;
        } else {
            if (this.isDrawMode && annotationHelper.isDynamicStampType(stamp.stampType)) {
                this.drawSequence = this.drawSequence + 1;
                let drawAnnotation = false;

                let element: Element = this.annotationOverlayElement;
                this.annotationOverlayElementClientRect = element.getBoundingClientRect();
                var event = evt.changedPointers[0];

                let outsideResponseArea: boolean = false;
                let inGreyArea: boolean = false;

                outsideResponseArea = annotationHelper.checkMouseDrawingOutsideResponseArea(evt, '',
                    this.annotationOverlayElement, this.props.displayAngle);

                // Recalcuating the overlay boundary before drawing to ensure this has been updated to handle
                // when the response screen has been scrolled and boundary has been updated.
                this.overlayBoundary = annotationHelper.getStitchedImageBoundary(element.parentElement, rotatedAngle);

                if (this.props.id.indexOf('annotationOverlaystitched') === 0) {
                    inGreyArea = annotationHelper.checkInGreyArea(event.clientX, event.clientY, rotatedAngle,
                        this.isDrawLeft, this.annotationOverlayElement,
                        this.marksheetContainerProperties, 0, false, stamp.stampId, this.overlayBoundary);
                }

                markingActionCreator.onAnnotationDraw(!(outsideResponseArea || inGreyArea));

                var left = (event.clientX - this.annotationOverlayElementClientRect.left);
                var top = (event.clientY - this.annotationOverlayElementClientRect.top);
                left = event.clientX > this.initCoordinates.x ? this.initCoordinates.x : event.clientX;
                var width = Math.abs(evt.deltaX);
                var height = Math.abs(evt.deltaY);

                // Update the scroll value for drawing annotion while scrolling.
                let scrollVal = this.updateScroll(evt, height, top);
                this.finalHeight = scrollVal.height;
                this.finalTop = scrollVal.top;

                var elementclientRect: ClientRectDOM = {
                    left: left,
                    top: this.finalTop,
                    width: width,
                    height: this.finalHeight,
                    right: 0,
                    bottom: 0
                };

                let enableDraw = true;
                var isValid = true;
                let clientRectInsideAnnotationHolder = true;

                // Resetting always to ensure that it keeps default value on each drag.
                // this.annotationNotOverlappingStitchedGap = true;

                if (this.props.imageZones && this.props.imageZones.length > 0) {
                    let rotatedClientRect: ClientRectDOM;
                    let holderWidth, holderHeight;
                    let annotationHolderRect: ClientRectDOM = this.annotationOverlayElementClientRect;
                    if (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90
                        || rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270) {
                        holderWidth = annotationHolderRect.height;
                        holderHeight = annotationHolderRect.width;
                    } else {
                        holderWidth = annotationHolderRect.width;
                        holderHeight = annotationHolderRect.height;
                    }

                    rotatedClientRect = annotationHelper.getRotatedClientRect(elementclientRect, element,
                        this.marksheetContainerProperties, stamp.stampId, rotatedAngle);

                    if (rotatedClientRect.top + rotatedClientRect.height >= holderHeight || rotatedClientRect.left <= 0 ||
                        rotatedClientRect.top <= 0) {
                        clientRectInsideAnnotationHolder = false;
                    }

                    enableDraw = !annotationHelper.validateAnnotationBoundary(rotatedClientRect, element,
                        this.marksheetContainerProperties, 0);

                    // Map the element rect to get the left and top to calculate stitched gap area.
                    var elemRect: ClientRectDOM = this.getDrawingElementRect(left,
                        this.finalTop, width, this.finalHeight, rotatedAngle);

                    //While starting drawing HorizontalLine or HWavyLine prevent from drawing at the
                    // edges of the response. Because it adds a value of 20px at the end od saving annotation.
                    // This will result to display the annoation on another zone.
                    let boundaryThreshold: number =
                        (stamp.stampId === enums.DynamicAnnotation.HorizontalLine ||
                            stamp.stampId === enums.DynamicAnnotation.HWavyLine) ?
                            this.getBoundaryThreshold(this.overlayBoundary, rotatedAngle) : 0;

                    // calculating rotated annotation rect for validating.
                    let annotationBoundaryCoordinates = annotationHelper.getAnnotationRectOnDrawing(elemRect,
                        this.annotationOverlayElementClientRect,
                        rotatedAngle)

                    // Setting this variable to block the drawing and delete the annotation if it covers through the stitched image gap.
                    this.annotationNotOverlappingStitchedGap = annotationHelper.validateAnnotaionBoundaryOnStitchedImageGap(
                        annotationBoundaryCoordinates,
                        this.annotationOverlayElementClientRect,
                        this.overlayBoundary,
                        rotatedAngle,
                        boundaryThreshold,
                        enums.AddAnnotationAction.Pan);
                }

                if (annotationHelper.checkEventFiring() &&
                    enableDraw &&
                    clientRectInsideAnnotationHolder && this.annotationNotOverlappingStitchedGap) {

                    // Validating whether it overlaps while drawing. This will ensure on stitched image
                    // this will not allow the user to draw Hline/HWline on the edge of the preceding images after
                    // stitched image gap.
                    let validateOnMove: boolean =
                        (toolbarStore.instance.selectedStampId === enums.DynamicAnnotation.HorizontalLine ||
                            toolbarStore.instance.selectedStampId === enums.DynamicAnnotation.HWavyLine);
                    this.addOrUpdateAnnotation(
                        left,
                        scrollVal.top,
                        enums.AddAnnotationAction.Pan,
                        toolbarStore.instance.selectedStampId,
                        this._clientToken,
                        width,
                        scrollVal.height,
                        false,
                        false
                    );
                } else {
                    this.resetCursorPosition(true);
                }
            } else {
                this.resetCursorPosition(true);
            }
        }
    };

    /*
    * Handle scroll while drawing Highlighter.
    * @param event
    * @param height
    * @param top
    */
    updateScroll = (event: EventCustom, height: number, top: number) => {
        let marksheetElement: HTMLElement = this.marksheetContainerProperties;
        let marksheetElementRect: ClientRectDOM = marksheetElement.getBoundingClientRect();
        /** Scroll update value on each move/resize*/
        let scrollVal: number = 0, scrollAdjustDevices = 0;

        /** Additional buffer for scroll only in devices*/
        if (htmlUtilities.isTabletOrMobileDevice) {
            scrollAdjustDevices = 100;
        } else {
            scrollAdjustDevices = 0;
        }

        /** Increment scroll if the mouse pointer is at bottom*/
        if ((event.changedPointers[0].clientY + scrollAdjustDevices) > (marksheetElementRect.top +
            marksheetElementRect.height)) {
            marksheetElement.scrollTop = marksheetElement.scrollTop + constants.SCROLL_SPEED;
        }
        /** Decrement scroll if the mouse pointer is at top*/
        if (event.changedPointers[0].clientY - scrollAdjustDevices < marksheetElementRect.top) {
            marksheetElement.scrollTop = marksheetElement.scrollTop - constants.SCROLL_SPEED;
        }

        /** To determine if mouse move to top or bottom*/
        let scrollPosition: boolean = (marksheetElement.scrollTop - this.scrollTop) > 0;

        /** Absolute value of scroll difference*/
        scrollVal = Math.abs(marksheetElement.scrollTop - this.scrollTop);
        top = event.center.y > this.initCoordinates.y ? this.initCoordinates.y : event.center.y;

        if (!scrollPosition) {
            /* To determine if there is a scroll difference between initial click and move */
            if (this.scrollTop !== marksheetElement.scrollTop) {
                if ((this.initCoordinates.y + scrollVal) < event.center.y) {
                    top = this.initCoordinates.y + scrollVal;
                    height = event.deltaY - scrollVal;
                } else {
                    height = Math.abs(event.deltaY - scrollVal);
                    top = event.center.y;
                }
            }
        } else {
            /* To determine if there is a scroll difference between initial click and move */
            if (this.scrollTop !== marksheetElement.scrollTop) {
                if ((this.initCoordinates.y) < event.center.y + scrollVal) {
                    height = event.deltaY + scrollVal;
                    top = Math.round(this.initCoordinates.y - scrollVal);
                } else {
                    height = Math.abs(event.deltaY + scrollVal);
                }
            }
        }

        /* Returns new height and top based on the scroll update */
        return { 'height': height, 'top': top };
    };

    /*
    * Handles pan end event.
    * @param event
    */

    onDrawEnd = (event: EventCustom) => {
        this.isDrawEnd = true;

        var stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
        if (stamp.stampId === enums.DynamicAnnotation.OnPageComment) {
            // this will hide the comment box
            stampActionCreator.showOrHideComment(false);
        }
        if (this.isDrawMode && this.currentAnnotationElement && stamp !== undefined
            && annotationHelper.isDynamicStampType(stamp.stampType)) {
            let rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);

            let element: Element = this.annotationOverlayElement;
            let drawnInGrayArea = false;
            let annotationCurrentClientRect = this.currentAnnotationElement.getBoundingClientRect();

            let [defaultWidth, defaultHeight] = annotationHelper.getAnnotationDefaultValue(stamp.stampId, undefined,
                undefined, null, rotatedAngle);

            let width = annotationCurrentClientRect.width < defaultWidth ?
                defaultWidth : annotationCurrentClientRect.width;
            let height = annotationCurrentClientRect.height < defaultHeight ?
                defaultHeight : annotationCurrentClientRect.height;

            if (annotationCurrentClientRect.width < defaultWidth && annotationCurrentClientRect.height < defaultHeight) {
                [width, height] = annotationHelper.getAnnotationDefaultValue(stamp.stampId, undefined,
                    undefined, element, rotatedAngle, true);
            } else {
                if (annotationCurrentClientRect.width < defaultWidth) {
                    [width, height] = annotationHelper.getAnnotationDefaultValue(stamp.stampId, undefined,
                        undefined, element, rotatedAngle, true);
                    height = annotationCurrentClientRect.height;
                }
                if (annotationCurrentClientRect.height < defaultHeight) {
                    [width, height] = annotationHelper.getAnnotationDefaultValue(stamp.stampId, undefined,
                        undefined, element, rotatedAngle, true);
                    width = annotationCurrentClientRect.width;
                }
            }

            if (this.props.id.indexOf('annotationOverlaystitched') === 0 && annotationHelper.isDynamicStampType(stamp.stampType)
                && (annotationCurrentClientRect.width < width || annotationCurrentClientRect.height < height)) {
                if (annotationHelper.checkInGreyArea(annotationCurrentClientRect.left, annotationCurrentClientRect.top,
                    rotatedAngle, this.isDrawLeft,
                    this.annotationOverlayElement, this.marksheetContainerProperties, 0, true,
                    stamp.stampId, this.overlayBoundary)) {
                    this.resetCursorPosition(true);
                    this.removeAnnotation(this._clientToken);
                }
            }

            let annotationClientRect: ClientRectDOM = {
                left: annotationCurrentClientRect.left,
                top: annotationCurrentClientRect.top,
                width: width,
                height: height,
                right: 0,
                bottom: 0
            };

            let clientRectInsideAnnotationHolder = true;
            let rotatedClientRect: ClientRectDOM;
            let holderWidth, holderHeight;
            this.annotationOverlayElementClientRect = this.annotationOverlayElement.getBoundingClientRect();
            let annotationHolderRect: ClientRectDOM = this.annotationOverlayElementClientRect;

            if (rotatedAngle === enums.RotateAngle.Rotate_90
                || rotatedAngle === enums.RotateAngle.Rotate_270) {
                holderWidth = annotationHolderRect.height;
                holderHeight = annotationHolderRect.width;
            } else {
                holderWidth = annotationHolderRect.width;
                holderHeight = annotationHolderRect.height;
            }
            rotatedClientRect = annotationHelper.getRotatedClientRect(annotationClientRect, this.annotationOverlayElement,
                this.marksheetContainerProperties, stamp.stampId, rotatedAngle, enums.AddAction.DrawEnd);
            if (rotatedClientRect.top + rotatedClientRect.height >= holderHeight || rotatedClientRect.left <= 0 ||
                rotatedClientRect.top <= 0 || rotatedClientRect.left + rotatedClientRect.width >= holderWidth) {
                clientRectInsideAnnotationHolder = false;
            }
            if (this.props.imageZones && this.props.imageZones.length > 0) {
                drawnInGrayArea = annotationHelper.validateAnnotationBoundary(rotatedClientRect, element,
                    this.marksheetContainerProperties, rotatedAngle);
            }

            // fix for 38709 and 36504
            annotationClientRect = this.getTopAndLeftAdjustmentBasedOnRotatedAngle(rotatedAngle,
                stamp.stampId, annotationClientRect);

            if (annotationHelper.checkEventFiring()) {
                this.addOrUpdateAnnotation(
                    annotationClientRect.left,
                    annotationClientRect.top,
                    enums.AddAnnotationAction.Pan,
                    toolbarStore.instance.selectedStampId,
                    this._clientToken,
                    width,
                    height,
                    false,
                    false
                );

                //check whether newly created annotation has gone outside. If so remove it.
                if (annotationHelper.checkMouseDrawingOutsideResponseArea(event, '',
                    this.annotationOverlayElement, this.props.displayAngle, stamp.stampId)
                    || this.isOutside || drawnInGrayArea || !clientRectInsideAnnotationHolder ||
                    !this.annotationNotOverlappingStitchedGap) {
                    this.resetCursorPosition(true);
                    this.removeAnnotation(this._clientToken);
                }

                let defaultWidth = 0, defaultHeight = 0, annotationWidthInPercent = 0, annotationHeightInPercent = 0;
                [defaultWidth, defaultHeight,
                    annotationWidthInPercent, annotationHeightInPercent] = annotationHelper.getAnnotationDimensionsInPercent(stamp.stampId,
                        width, height, this.annotationOverlayElementClientRect,
                        this.props.currentImageMaxWidth, this.props.currentOutputImageHeight, rotatedAngle
                    );

                if (this.props.id.indexOf('annotationOverlaystitched') === 0 && annotationHelper.isDynamicStampType(stamp.stampType)
                    && (defaultWidth === annotationWidthInPercent || defaultHeight === annotationHeightInPercent)) {
                    if (annotationHelper.checkInGreyArea(annotationClientRect.left, annotationClientRect.top,
                        rotatedAngle, this.isDrawLeft,
                        this.annotationOverlayElement, this.marksheetContainerProperties, 0, true,
                        stamp.stampId, this.overlayBoundary)) {
                        this.resetCursorPosition(true);
                        this.removeAnnotation(this._clientToken);
                    }
                }
            }

            // Check highlighter is in next response while drawing.
            let overlayId = htmlUtilities.getElementFromPosition(event.changedPointers[0].clientX,
                event.changedPointers[0].clientY);
            overlayId = htmlUtilities.findAncestor(overlayId, 'annotation-holder');
            if (overlayId !== null && overlayId !== undefined && this.currentOverlayId !== overlayId.id) {
                this.resetCursorPosition(true);
                this.removeAnnotation(this._clientToken);
            }

            // Refreshing the old move values
            this.annotationNotOverlappingStitchedGap = true;
        }


        markingActionCreator.onAnnotationDraw(true);
        this.initCoordinates.x = 0;
        this.initCoordinates.y = 0;
        this.isDrawMode = false;
        this.drawSequence = 0;
        // this.isDynamicAnnotationBorderShowing = false;
        this.isDynamicAnnotationDrawInProgress = false;
    };

    /**
     * return top and left adjustment based on rotated angle
     * @param rotatedAngle
     * @param stampId
     * @param annotationClientRect
     */
    getTopAndLeftAdjustmentBasedOnRotatedAngle(rotatedAngle: enums.RotateAngle, stampId: number,
        annotationClientRect: ClientRectDOM): ClientRectDOM {
        switch (stampId) {
            case enums.DynamicAnnotation.HorizontalLine:
                switch (rotatedAngle) {
                    case enums.RotateAngle.Rotate_0:
                        annotationClientRect.left = annotationClientRect.left + constants.DEFAULT_ANNOTATION_BORDER_SIZE;
                        annotationClientRect.top = annotationClientRect.top + constants.DEFAULT_HLINE_HEIGHT / 4;
                        break;
                    case enums.RotateAngle.Rotate_90:
                        annotationClientRect.left = annotationClientRect.left - constants.DEFAULT_HLINE_HEIGHT / 4;
                        annotationClientRect.top = annotationClientRect.top - constants.DEFAULT_ANNOTATION_BORDER_SIZE;
                        break;
                    case enums.RotateAngle.Rotate_180:
                        annotationClientRect.left = annotationClientRect.left - constants.DEFAULT_ANNOTATION_BORDER_SIZE;
                        annotationClientRect.top = annotationClientRect.top - constants.DEFAULT_HLINE_HEIGHT / 4;
                        break;
                    case enums.RotateAngle.Rotate_270:
                        annotationClientRect.left = annotationClientRect.left + constants.DEFAULT_HLINE_HEIGHT / 4;
                        annotationClientRect.top = annotationClientRect.top + constants.DEFAULT_ANNOTATION_BORDER_SIZE;
                        break;
                }
                break;
        }

        return annotationClientRect;
    }

    /**
    * Get the Annotation Overlay Element
    */
    getAnnotationOverlayElement = (): Element => {
        let element: Element = ReactDom.findDOMNode(this);
        if (element) {
            element = element.firstElementChild;
        }
        return element;
    };

    /**
     * Get the Annotation Overlay Id
     */
    private getAnnotationOverlayId(): string {
        let pageNo = this.props.pageNo ? this.props.pageNo : 0;
        let imageClusterId = this.props.imageClusterId ? this.props.imageClusterId : 0;
        let outputPageNo = this.props.outputPageNo ? this.props.outputPageNo : 0;
        let pageNoWhenLinkingScenariosAreEnabled = 0;
        let outputPageNoWhenLinkingScenariosAreEnabled = 0;
        let id = 'annotationoverlay';

        if (this.props.doApplyLinkingScenarios === true) {
            pageNoWhenLinkingScenariosAreEnabled = this.props.isALinkedPage ? this.props.currentImagePageNo : this.props.pageNo;
            outputPageNoWhenLinkingScenariosAreEnabled = this.props.isALinkedPage ? 0 : annotationHelper.getOutputPageNo(
                this.props.doApplyLinkingScenarios, this.props.imageZones, this.props.imageZone, this.props.outputPageNo);
            id += '_' + pageNoWhenLinkingScenariosAreEnabled.toString()
                + '_' + imageClusterId.toString()
                + '_' + outputPageNoWhenLinkingScenariosAreEnabled.toString()
                + '_' + pageNo.toString()
                + '_' + outputPageNo.toString();
        } else {
            id += '_' + pageNo.toString()
                + '_' + imageClusterId.toString()
                + '_' + outputPageNo.toString();
        }

        return id;
    }

    /*
     * Handles pan end event
     */
    private onPanEndListener = (
        elementId: string,
        xPos: number,
        yPos: number,
        panSource: enums.PanSource,
        stampId: number,
        draggedAnnotationClientToken: string,
        isAnnotationOverlapped: boolean,
        isAnnotationPlacedInGreyArea: boolean): void => {

        // Checking if the pan end happened on top of a previous annotation, if so the
        // current annotation shouldn't be blocked from getting panned
        var annotationOverlayId: string = this.getAnnotationOverlayId();
        var element = htmlUtilities.getElementFromPosition(xPos, yPos);
        if (annotationHelper.isPreviousAnnotation(element)) {
            while (element.id !== this.getAnnotationOverlayId()
                && element.parentElement != null
                && element.parentElement !== undefined) {
                element = element.parentElement;
            }
        }

        if (annotationOverlayId === elementId || annotationOverlayId === element.id) {
            var stamp = stampStore.instance.getStamp(stampId);
            switch (panSource) {
                case enums.PanSource.StampPanel:
                    if (!this.isDrawMode) {
                        if (annotationHelper.isDynamicStampType(stamp.stampType)) {
                            let event: any = {
                                'clientX': xPos,
                                'clientY': yPos
                            };
                            let isAnnotationinGreyArea = annotationHelper.checkMouseDrawingOutsideResponseArea(
                                event, 'stamp', this.annotationOverlayElement, this.props.displayAngle, stampId) ?
                                true : false;
                            if (!isAnnotationinGreyArea) {
                                this.addOrUpdateAnnotation(xPos, yPos, enums.AddAnnotationAction.Stamping, stampId);
                            }
                        } else {
                            this.addOrUpdateAnnotation(xPos, yPos, enums.AddAnnotationAction.Stamping, stampId);
                        }
                    }
                    break;
                case enums.PanSource.AnnotationOverlay:
                    if ((isAnnotationPlacedInGreyArea && this.props.id.indexOf('annotationOverlaystitched') === 0) ||
                        isAnnotationOverlapped) {
                        this.forceAnnotationOverlayToReRender();
                        return;
                    }

                    this.addOrUpdateAnnotation(xPos,
                        yPos,
                        enums.AddAnnotationAction.Pan,
                        stampId,
                        draggedAnnotationClientToken);
                    break;
            }
        } else {
            this.forceAnnotationOverlayToReRender();
        }

        // reset the data holded for pan event
        this.clearPanData();
    };

    /**
     * This method will get fired when the mouse leaves the annotation area
     */
    onMouseLeave = (event: any) => {
        let element: Element = event.toElement || event.relatedTarget;
        let selectedStamp = toolbarStore.instance.selectedStampId;
        if (element.classList && !annotationHelper.isAcetate(element)) {
            if (!element.classList.contains('expand-zone')) {
                if (onPageCommentHelper.isCommentsSideViewEnabled) {
                    this.resetCursorPosition(true);
                    this.resetViewWholePageButtonDetails();
                } else {
                    if (htmlUtilities.findAncestor(element, 'comment-container') === element) {
                        this.resetCursorPosition(true);
                        this.resetViewWholePageButtonDetails();
                    }
                }
            }
        } else if (selectedStamp > 0 && annotationHelper.isAcetate(element)) {
            this.resetCursorPosition(true);
        }
    };

    /**
     * This method will add annotation to the overlay handler.
     * @param clientX
     * @param clientY
     * @param action
     * @param stampId
     * @param clientToken
     * @param width
     * @param height
     */
    private addOrUpdateAnnotation = (

        clientX: number,
        clientY: number,
        action: enums.AddAnnotationAction,
        stampId: number,
        clientToken?: string,
        width?: number,
        height?: number,
        isDrawEnd: boolean = false,
        validateDynamicBoundary: boolean = true): boolean => {

        // Set the clientToken for drawing.
        if (clientToken) {
            this._clientToken = clientToken;
        }

        let actualX = clientX;
        let actualY = clientY;
        var stamp = stampStore.instance.getStamp(stampId, markingStore.instance.selectedQIGMarkSchemeGroupId);
        let rotatedAngle = this.props.displayAngle;

        rotatedAngle = annotationHelper.getAngleforRotation(rotatedAngle);

        // Find the dom element 'annotation-holder'
        let element: Element = this.annotationOverlayElement;

        // Recalcuating the overlay boundary before saving to ensure this has been updated to handle
        // when the response screen has been scrolled and boundary has been updated.
        let annotationOverlayElement: Element = element.parentElement;
        this.overlayBoundary = annotationHelper.getStitchedImageBoundary(annotationOverlayElement, rotatedAngle);

        //Prevent static annotation over another
        let isAnnotationOverlaps = annotationHelper.isAnnotationPlacedOnTopOfAnother(stamp.stampType,
            element, clientX, clientY, this.annotationHolderClass, rotatedAngle, this.overlayBoundary);

        // On page comment behaves like normal annotation ie. shouldn't overlap with another
        if (!annotationHelper.isDynamicAnnotation(stamp) && isAnnotationOverlaps) {
            this.forceAnnotationOverlayToReRender();
            return false;
        }

        //To check whether stamping is in grey area
        if (this.isStitchedImage) {
            if (annotationHelper.checkInGreyArea(clientX, clientY, rotatedAngle,
                this.isDrawLeft,
                element, this.marksheetContainerProperties, 0,
                action === enums.AddAnnotationAction.Stamping ? true : false, stamp.stampId, this.overlayBoundary)) {
                return false;
            }

            // Modify the clientX and clientY based on the stitched information. This is to allign the annotation
            // to corerct position in WA and AI.
            if (this.overlayBoundary && this.overlayBoundary.length > 0) {

                var seperatorDistance = 0;
                for (var i = 1; i < this.overlayBoundary.length; i++) {

                    switch (rotatedAngle) {
                        case enums.RotateAngle.Rotate_0:
                        case enums.RotateAngle.Rotate_360:
                            seperatorDistance += (this.overlayBoundary[i].start - this.overlayBoundary[i - 1].end);
                            if (clientY > this.overlayBoundary[i].start && clientY < this.overlayBoundary[i].end) {
                                clientY -= seperatorDistance;
                            }
                            break;
                        case enums.RotateAngle.Rotate_180:
                            seperatorDistance += (this.overlayBoundary[i - 1].start - this.overlayBoundary[i].end);
                            if (clientY > this.overlayBoundary[i].start && clientY < this.overlayBoundary[i].end) {
                                clientY += seperatorDistance;
                            }
                            break;
                        case enums.RotateAngle.Rotate_90:
                            seperatorDistance += (this.overlayBoundary[i - 1].start - this.overlayBoundary[i].end);
                            if (clientX < this.overlayBoundary[i].end && clientX > this.overlayBoundary[i].start) {
                                clientX += seperatorDistance;
                            }
                            break;
                        case enums.RotateAngle.Rotate_270:
                            seperatorDistance += (this.overlayBoundary[i - 1].end - this.overlayBoundary[i].start);
                            if (clientX < this.overlayBoundary[i].end && clientX > this.overlayBoundary[i].start) {
                                clientX += seperatorDistance;
                            }
                            break;
                    }
                }
            }
        }
        var dynamicAnnotationLeft = 0, dynamicAnnotationWidth = 0;
        var onPageCommentWidth = 0;

        this.annotationOverlayElementClientRect = element.getBoundingClientRect();
        var left = clientX - this.annotationOverlayElementClientRect.left;
        var top = clientY - this.annotationOverlayElementClientRect.top;

        let topAboveCurrentZone = this.props.topAboveCurrentZone ? this.props.topAboveCurrentZone : 0;
        // Since we heve the different types of stamps, those have different size, adjust some pixel to maintain the correct position.
        var pixelsToAdjustLeft = 0;
        var pixelsToAdjustTop = 0;

        // To prevent dropping the annotation to grey area
        if (annotationHelper.isDynamicAnnotation(stamp) && this.isAnnotationinGreyArea) {
            return false;
        }

        if (action === enums.AddAnnotationAction.Stamping) {
            this.drawDirection = annotationHelper.getDrawDirection(rotatedAngle);
            this.isDrawLeft = false;
        }

        [width, height] = annotationHelper.getAnnotationDefaultValue(stamp.stampId, width, height, element, rotatedAngle,
            action === enums.AddAnnotationAction.Stamping ? true : false);

        let annotationHolderElement: ClientRectDOM = this.annotationOverlayElementClientRect;
        let currentElement: ClientRectDOM = {
            width: 0,
            height: 0,
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };

        if (this.currentAnnotationElement && action === enums.AddAnnotationAction.Pan) {
            currentElement = this.currentAnnotationElement.getBoundingClientRect();
        }

        [left, top] = annotationHelper.getAnnotationCoordinatesOnRotate(annotationHolderElement,
            currentElement, left, top, rotatedAngle);

        // Calculate the left and top position based on the actual width and top
        //left = (left / element.clientHeight) * this.props.currentOutputImageHeight + pixelsToAdjustLeft;
        //top = (top / element.clientWidth) * this.props.currentImageMaxWidth + pixelsToAdjustTop;

        // Calculate annotation coordinates on rotate for ebookmarking components
        if (this.props.isEBookMarking) {
            // For linked page, we dont have to add zone top to the calculated annotation top.
            // so pass zone top as 0.
            if (this.props.isALinkedPage) {
                [left, top] = annotationHelper.getEbookmarkingAnnotationCoordinateOnRotate(left, top, rotatedAngle, this.props.currentImageMaxWidth,
                    0, this.props.currentOutputImageHeight, element);
            } else {
                let imageDimension = this.props.getImageNaturalDimension(this.props.imageZone.pageNo);
                [left, top] = annotationHelper.getEbookmarkingAnnotationCoordinateOnRotate(left, top, rotatedAngle, imageDimension.naturalWidth,
                    this.props.zoneTop, this.props.currentOutputImageHeight, element);
            }
        } else {
            // Components other than EBM.
            left = (left / element.clientWidth) * this.props.currentImageMaxWidth + pixelsToAdjustLeft;
            top = (top / element.clientHeight) * this.props.currentOutputImageHeight;
        }

        let annotationWidth = (width / element.clientWidth) * this.props.currentImageMaxWidth;
        let annotationHeight = (height / element.clientHeight) * this.props.currentOutputImageHeight;

        // If the stamp is text/image, default width and height needs to be set always irrespective of current zoom percentage.
        if (annotationHelper.isImageAnnotation(stamp) || annotationHelper.isTextAnnotation(stamp)) {
            annotationWidth = constants.DEFAULT_STATIC_ANNOTATION_WIDTH;
            annotationHeight = constants.DEFAULT_STATIC_ANNOTATION_HEIGHT;
        }

        // position calculation for OnPageComment
        let commentposwidth = 0;
        let commentposheight = 0;
        let updatedcomment = '';
        if (stamp.stampId === enums.DynamicAnnotation.OnPageComment) {
            let comment = markingStore.instance.getAnnotation(clientToken);
            let pos: any = null;
            pos = onPageCommentHelper.UpdateOnPageCommentPosition(
                this.props.currentOutputImageHeight,
                this.props.currentImageMaxWidth,
                comment ? comment.comment : undefined,
                top,
                left);

            // updating the position values after calculation
            commentposwidth = pos.width;
            commentposheight = pos.height;
            // for zones which are splitted and are not linked
            if (this.props.doApplyLinkingScenarios && !this.props.isALinkedPage) {
                if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
                    commentposwidth += topAboveCurrentZone;
                } else {
                    commentposheight += topAboveCurrentZone;
                }
            }
            left = pos.left;
            top = pos.top;

            if (comment) {
                // update the comment text if the comment annotation exists (after typing and saved)
                updatedcomment = comment.comment;

                // add the annotation to the list which can be used to calculate the side view
                onPageCommentHelper.updateSideViewItem(this._clientToken, updatedcomment);
            }
        }

        //In 90/ 270 deg, height will become width & vice-versa and also left become top & vice-versa
        if ((rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90
            || rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270)) {
            dynamicAnnotationLeft = left;
            left = top;
            top = dynamicAnnotationLeft;

            dynamicAnnotationWidth = annotationWidth;
            annotationWidth = annotationHeight;
            annotationHeight = dynamicAnnotationWidth;

            // in case of rotation Onpagecomment positions needs to be re-assign
            onPageCommentWidth = commentposwidth;
            commentposwidth = commentposheight;
            commentposheight = onPageCommentWidth;
        }

        if (action === enums.AddAnnotationAction.Stamping) {
            // for dynamic annotations check if the stamping is fully in response area
            if (annotationHelper.isDynamicAnnotation(stamp)) {
                let zoneTop: number = this.props.isEBookMarking === true &&
                    responseStore.instance.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView ?
                    this.props.zoneTop : 0;
                let isFullyInResponseArea: boolean = annotationHelper.checkStampingInResponseArea(left, top,
                    annotationWidth, annotationHeight, zoneTop,
                    this.props.currentImageMaxWidth, this.props.currentOutputImageHeight,
                    this.props.displayAngle);
                if (!isFullyInResponseArea) {
                    return false;
                }
            }

            let cursorwidth = 0;
            let cursorheight = 0;
            if (!annotationHelper.isDynamicStampType(stamp.stampType)) {
                // Get the width of the cursor based on the image width (4 percentage if image - 4 px)
                cursorwidth = (element) ? element.clientWidth * (4 / 100) - 4 : 4;
                // If the stamp is text type height is 67 % of the width.
                cursorheight = cursorwidth * ((stamp.stampType === enums.StampType.text ? 67 : 100) / 100);
            }

            clientX = clientX - (cursorwidth / 2);
            clientY = clientY - (cursorheight / 2);
        }

        if (annotationHelper.isDynamicAnnotation(stamp)) {
            // If stitched image check whether the dynamic annotation dragged and created
            // overlaps the stitched image gap?
            if (this.props.id.indexOf('annotationOverlaystitched') === 0 && this.isStitchedImage && validateDynamicBoundary) {

                let annotationOverlayRect = element.getBoundingClientRect();
                let annotationBoundaryCoordinates: ClientRectDOM = {
                    left: actualX,
                    top: actualY,
                    width: width,
                    height: height,
                    bottom: 0,
                    right: 0
                };

                // handling annotation top in Dynamic annotation drawing scenarios
                if (action === enums.AddAnnotationAction.Pan) {
                    annotationBoundaryCoordinates = annotationHelper.getAnnotationRectOnDrawing(annotationBoundaryCoordinates,
                        annotationOverlayRect,
                        rotatedAngle)
                }


                //While placing HorizontalLine or HWavyLine prevent from placing at the
                // edges of the response. Because it adds a value of 20px at the end of saving annotation.
                // This will result to display the annoation on another zone.
                let boundaryThreshold: number =
                    (stamp.stampId === enums.DynamicAnnotation.HorizontalLine ||
                        stamp.stampId === enums.DynamicAnnotation.HWavyLine ||
                        stamp.stampId === enums.DynamicAnnotation.VWavyLine) ?
                        this.getBoundaryThreshold(this.overlayBoundary, rotatedAngle) : 0;


                // If dynamic annotation is dragged and dropped from the stamp panel should check
                // whether it overlaps the stitched image gap.
                this.annotationNotOverlappingStitchedGap = annotationHelper.validateAnnotaionBoundaryOnStitchedImageGap(annotationBoundaryCoordinates,
                    annotationOverlayRect,
                    this.overlayBoundary,
                    rotatedAngle,
                    boundaryThreshold,
                    action)
                if (!this.annotationNotOverlappingStitchedGap) {
                    return false;
                }
            }
        }

        var favouriteStampsCollection = stampStore.instance.getFavoriteStamps();
        var isStampFromFavourite = favouriteStampsCollection.filter((x: stampData) => x.stampId === stampId).count() > 0;
        var isDrawEndOfStampFromStampPanel = this.isDrawEnd && !isStampFromFavourite;
        let outputPageNo = (this.props.isALinkedPage && this.props.isEBookMarking !== true)
            ? 0 : annotationHelper.getOutputPageNo(this.props.doApplyLinkingScenarios,
                this.props.imageZones, this.props.imageZone, this.props.outputPageNo);
        let pageNo = (this.props.isEBookMarking === true) ? this.props.structerdPageNo :
            (this.props.isALinkedPage ? this.props.currentImagePageNo : this.props.pageNo);
        let imageClusterId = this.props.imageZone || this.props.imageZones ?
            markingStore.instance.currentQuestionItemImageClusterId : 0;
        // for zones which are splitted and are not linked
        if (this.props.doApplyLinkingScenarios && !this.props.isALinkedPage) {
            top += topAboveCurrentZone;
        }
        if (clientToken !== undefined) {
            markingActionCreator.updateAnnotation(left,
                top,
                imageClusterId,
                outputPageNo,
                pageNo,
                clientToken,
                stamp.stampId === enums.DynamicAnnotation.OnPageComment ? commentposwidth : annotationWidth,
                stamp.stampId === enums.DynamicAnnotation.OnPageComment ? commentposheight : annotationHeight,
                stamp.stampId === enums.DynamicAnnotation.OnPageComment ? updatedcomment : '',
                true,
                isDrawEndOfStampFromStampPanel,
                false,
                stampId);
            // Log the annotation modified actions.
            this.logger.logAnnotationModifiedAction(
                'DisplayId -' + responseStore.instance.selectedDisplayId + '-' + loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED,
                'DisplayId-' + responseStore.instance.selectedDisplayId + '-' + loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED,
                {
                    'clientToken': clientToken, 'stampId': stampId, 'left': left, 'top': top, 'imageClusterId': imageClusterId,
                    'outputPageNo': outputPageNo, 'pageNo': pageNo, 'isDrawEndOfStampFromStampPanel': isDrawEndOfStampFromStampPanel
                },
                markingStore.instance.currentMarkGroupId,
                markingStore.instance.currentMarkSchemeId);
            /**
             * Add link annotation if the marker is placing annotation on a page which is linked by previous marker.
             * Link annotation should be inserted only for static annotations while updating.
             * Dynamic movement is handled in dynamic stamp base
             */
            if (!annotationHelper.isDynamicAnnotation(stamp)) {
                this.addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo);
            }
        } else {
            var newlyAddedAnnotation: annotation = annotationHelper.
                getAnnotationToAdd(stampId,
                    pageNo,
                    imageClusterId,
                    outputPageNo,
                    left,
                    top,
                    action,
                    stamp.stampId === enums.DynamicAnnotation.OnPageComment ? commentposwidth : annotationWidth,
                    stamp.stampId === enums.DynamicAnnotation.OnPageComment ? commentposheight : annotationHeight,
                    markingStore.instance.currentQuestionItemInfo.uniqueId,
                    rotatedAngle,
                    stamp.numericValue);
            if (newlyAddedAnnotation) {
                var stampName: string = enums.DynamicAnnotation[stamp.stampId];
                var cssProps: React.CSSProperties = colouredAnnotationsHelper.
                    createAnnotationStyle(newlyAddedAnnotation, enums.DynamicAnnotation[stampName]);
                var rgba = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
                newlyAddedAnnotation.red = parseInt(rgba[0]);
                newlyAddedAnnotation.green = parseInt(rgba[1]);
                newlyAddedAnnotation.blue = parseInt(rgba[2]);

                //Set the client token for drawing
                this._clientToken = newlyAddedAnnotation.clientToken;
                this.currentAnnoationId = newlyAddedAnnotation.annotationId;

                var isOnPageComment: boolean = annotationHelper.isOnPageComment(stampId);
                if (!isStampFromFavourite && isOnPageComment) {
                    this.isOnPageCommentAdded = true;
                }

                // mark by annotation cc check
                if (responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus)) {
                    // The isDirty flag for the annotation will be set while updating the mark entry in the markingstore
                    newlyAddedAnnotation.isDirty = false;
                    markingActionCreator.addMarkByAnnotationAction(newlyAddedAnnotation, action, this.props.id);
                } else {
                    markingActionCreator.addNewlyAddedAnnotation(newlyAddedAnnotation, action, this.props.id);
                }

                // Log the annotation modified actions.
                this.logger.logAnnotationModifiedAction(
                    'DisplayId-' + responseStore.instance.selectedDisplayId + '-' + loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED,
                    loggerConstants.MARKENTRY_REASON_ANNOTATION_ADD,
                    newlyAddedAnnotation,
                    markingStore.instance.currentMarkGroupId,
                    markingStore.instance.currentMarkSchemeId);
            }

            // Add link annotation if the marker is placing annotation on a page which is linked by previous marker.
            this.addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo);
        }

        return true;
    };

    /**
     * do stamps annotation when valid mark is applied aganist question.
     * @param newAnnotation
     * @param annotationAction
     */
    private stampAnnotation = (newAnnotation: annotation, annotationAction: enums.AddAnnotationAction, overlayId: string): void => {
        if (this.props.id === overlayId) {
            markingActionCreator.addNewlyAddedAnnotation(newAnnotation, annotationAction, overlayId);
        }
    }

    /*
     * Check whether the annotation action is valid and action is allowed.
     */
    private isAnnotationInCorrectPosition(left: number, top: number, element: Element, selectedStamp: stampData,
        clientX: number, clientY: number): boolean {

        // Block the stamping if no stamps are selected or it is in boundary.
        if (selectedStamp === undefined || !annotationHelper.checkMouseInCorrectPosition(
            element.nextSibling, left, top, 0, 0,
            this.props.pageNo, this.props.displayAngle)) {
            return false;
        }

        // Get the width of the cursor based on the image width (4 percentage if image - 4 px)
        var cursorWidth = element.clientWidth * (4 / 100) - 4;

        // If the stamp is text type height is 67 % of the width.
        var cursorHeight = cursorWidth * ((selectedStamp.stampType === enums.StampType.text ? 67 : 100) / 100);

        // Check the annotation is overlaps with another, If so block the stamping.
        if (annotationHelper.isAnnotationPlacedOnTopOfAnother(
            selectedStamp.stampType,
            element,
            clientX,
            clientY,
            this.annotationHolderClass)) {
            return false;
        }

        return true;
    }

    /**
     * On mouse right click on response image prevent default browser context menu
     * @param event
     */
    private onResponseImageContextHandler = (event: any) => {
        event.preventDefault();
    };

    /*
     * Returns a stampid according to the action.
     */
    private getStampIdToAdd(action: enums.AddAnnotationAction) {
        switch (action) {
            case enums.AddAnnotationAction.Stamping:
                return toolbarStore.instance.selectedStampId;
            case enums.AddAnnotationAction.Pan:
                return toolbarStore.instance.panStampId;
            default:
                return 0;
        }
    }

    /**
     * Called when annotation is started dragging inside a response container
     * @param stampId
     * @param clientToken
     * @param event
     */
    private onAnnotationPanStart = (stampId: number, clientToken: string, event: any): void => {
        event.preventDefault();
        this.enableImageContainerScroll(false);
        // Setting the stamp Id currently under PAN operation
        this.pannedStampId = stampId;
        toolbarActionCreator.PanStamp(stampId, clientToken);
    };

    /**
     * Called when annotation is dragged inside a response container
     * @param event
     */
    private onAnnotationPanMove = (event: any): void => {
        event.preventDefault();
        this.isDrawMode = false;

        var isResponseModeClosed: boolean = annotationHelper.isResponseReadOnly();
        if (!isResponseModeClosed) {
            event.srcEvent.preventDefault();

            var actualX = event.changedPointers[0].clientX;
            var actualY = event.changedPointers[0].clientY;

            // Getting the element at the current cursor position
            var element: Element = htmlUtilities.getElementFromPosition(actualX, actualY);
            var isPannedOnDynamicAnnotation = annotationHelper.isDynamicAnnotationElement(element);
            let isPannedOnAcetate: boolean = !isPannedOnDynamicAnnotation ? annotationHelper.isAcetate(element) : false;

            var isAnnotationOverlaps: boolean = false;
            var isMouseOutsideGreyArea: boolean = true;
            // If an element exists and if an annotation is paned
            if (element != null && element !== undefined && this.pannedStampId > 0) {
                if (element.id.indexOf('annotationoverlay') >= 0) {
                    var elementClientRect: ClientRectDOM = element.getBoundingClientRect();
                    // If the stamp is on the annotation overlay, check two things:
                    // (i)  If the annotation overlaps another
                    // (ii) If the mouse cursor is currently inside an image zone or not
                    var left = actualX - elementClientRect.left;
                    var top = actualY - elementClientRect.top;
                    var selectedStamp = this.pannedStamp;
                    let rotatedAngle = annotationHelper.getAngleforRotation(Number(element.getAttribute('data-rotatedangle')));

                    this.overlayBoundary = annotationHelper.getStitchedImageBoundary(element.parentElement, rotatedAngle);

                    // While dragging If the annotation boundary in the cursor is overlapping with another display strike through cursor
                    isAnnotationOverlaps = annotationHelper.isAnnotationPlacedOnTopOfAnother(selectedStamp.stampType,
                        element, actualX, actualY, this.annotationHolderClass, rotatedAngle, this.overlayBoundary);

                    // If the mouse position is currently outside the grey area
                    isMouseOutsideGreyArea = annotationHelper.checkMouseOutsideGreyArea(element.nextSibling,
                        left, top, 0, 0, this.props.displayAngle);

                    let inGreyArea: boolean = false;
                    if (this.isStitchedImage) {
                        let insideStitchedGap = annotationHelper.isAnnotationInsideStitchedImage(this.overlayBoundary, rotatedAngle, actualX, actualY);
                        inGreyArea = annotationHelper.checkInGreyArea(actualX, actualY, rotatedAngle,
                            this.isDrawLeft, element,
                            this.marksheetContainerProperties, 0, true, null, this.overlayBoundary);

                        // If gray area inside single output page the show the icon.
                        if (!insideStitchedGap) {
                            this.resetCursorPosition(true, actualX, actualY);
                            this.triggerDelete(true, actualX, actualY);
                            this.triggerSideViewEvent(element, event, this.clientToken, actualX, actualY, elementClientRect, true);
                            return;
                        }
                    }

                    this.triggerSideViewEvent(element, event, this.clientToken, actualX, actualY, elementClientRect,
                        (isAnnotationOverlaps || inGreyArea));

                    markingActionCreator.onAnnotationDraw(!(isAnnotationOverlaps || inGreyArea));
                    if (isAnnotationOverlaps || inGreyArea || htmlUtilities.isTabletOrMobileDevice) {
                        this.resetCursorPosition((isAnnotationOverlaps || inGreyArea), actualX, actualY);
                    }

                    if (this.deleteAnnotationOnDrop) {
                        this.triggerDelete(false, actualX, actualY);
                    }
                } else if (element.id.indexOf('onscriptannotation') >= 0 || annotationHelper.isDynamicAnnotationElement(element)
                    || annotationHelper.isAcetate(element)) {

                    let _isPrevAnnotation = annotationHelper.isPreviousAnnotation(element);
                    let _isReset: boolean = (!_isPrevAnnotation && !isPannedOnDynamicAnnotation && !isPannedOnAcetate);

                    // if hovering over a dynamic annotation taking the parent elemen to get annotationholder
                    // if hovered over an acetate , find parent element with overlay-holder
                    let _element = (isPannedOnDynamicAnnotation || _isPrevAnnotation) ?
                        htmlUtilities.findAncestor(element, 'annotation-holder') :
                        (isPannedOnAcetate ? htmlUtilities.findAncestor(element, 'overlay-holder') : element);

                    // CLinet rect not needed if the cusror is resetting ( to hide the line while cursor is hidden/nodrop/bin)
                    let _elementRect =
                        (_isReset === true || _element === undefined) ? undefined : _element.getBoundingClientRect();

                    this.resetCursorPosition(_isReset, actualX, actualY);
                    this.triggerSideViewEvent(_element, event, this.clientToken, actualX, actualY, _elementRect, _isReset);
                    this.triggerDelete(false, actualX, actualY);
                } else {
                    this.resetCursorPosition(!annotationHelper.isPreviousAnnotation(element), actualX, actualY);
                    this.triggerSideViewEvent(element, event, this.clientToken, actualX, actualY, elementClientRect, true);
                    this.triggerDelete(true, actualX, actualY);
                }
            } else {
                this.resetCursorPosition(true, actualX, actualY);
                this.triggerSideViewEvent(element, event, this.clientToken, actualX, actualY, elementClientRect, true);
                this.triggerDelete(true, actualX, actualY);
            }
        }
    };

    /**
     * Method which resets the correct cursor position
     * @param resetCursor
     * @param xPos
     * @param yPos
     */
    private resetCursorPosition(resetCursor: boolean, xPos?: number, yPos?: number) {
        responseActionCreator.setMousePosition(resetCursor ? -1 : xPos, resetCursor ? -1 : yPos);
    }

    /**
     * This will trigger delete when annotations are dragged out of response
     * @param canDelete
     * @param xPos
     * @param yPos
     */

    private triggerDelete(canDelete: boolean, xPos: number, yPos: number) {
        this.deleteAnnotationOnDrop = canDelete;
        toolbarActionCreator.PanStampToDeleteArea(canDelete, xPos, yPos);
    }

    /**
     * Called when annotation is dropped
     * @param annotationClientToken
     * @param stampId
     * @param event
     * @param boundX
     * @param boundY
     */
    private onAnnotationPanEnd = (annotationClientToken: string, stampId: number, event: any,
        boundX: number, boundY: number): void => {
        event.preventDefault();
        var actualX = event.changedPointers[0].clientX;
        var actualY = event.changedPointers[0].clientY;
        var isAnnotationOverlaps: boolean = false;
        var inGreyArea: boolean = false;

        var element: Element = htmlUtilities.getElementFromPosition(actualX, actualY);
        var isPannedOnDynamicAnnotation = annotationHelper.isDynamicAnnotationElement(element);
        let isPannedOnAcetate = annotationHelper.isAcetate(element);
        this.lineYPos = 0;
        this.lineXPos = 0;
        // find the annotation holder of the current element
        if (isPannedOnDynamicAnnotation || isPannedOnAcetate) {
            element = annotationHelper.findAnnotationHolderOfAnElement(element);
        }

        let angleOfRotation: number = element ? Number(element.getAttribute('data-rotatedangle')) : this.props.displayAngle;
        var rotatedAngle = annotationHelper.getAngleforRotation(angleOfRotation);
        var selectedStamp = stampStore.instance.getStamp(toolbarStore.instance.panStampId);

        // If an element exists and if an annotation is paned
        if (element != null && element !== undefined && toolbarStore.instance.panStampId > 0) {
            if (selectedStamp !== undefined && !annotationHelper.isDynamicAnnotation(selectedStamp)) {
                isAnnotationOverlaps = annotationHelper.isAnnotationPlacedOnTopOfAnother(selectedStamp.stampType,
                    element, actualX, actualY, this.annotationHolderClass, rotatedAngle, this.overlayBoundary);
            }
        }

        if (this.isStitchedImage && element != null && element !== undefined) {
            inGreyArea = annotationHelper.checkInGreyArea(actualX, actualY, rotatedAngle,
                rotatedAngle === enums.RotateAngle.Rotate_180 || rotatedAngle === enums.RotateAngle.Rotate_270 ? true : this.isDrawLeft,
                element,
                this.marksheetContainerProperties, 0, true, 0, this.overlayBoundary);
        }
        markingActionCreator.panEndAction(
            stampId,
            actualX,
            actualY,
            element == null ? '' : element.id,
            enums.PanSource.AnnotationOverlay,
            isAnnotationOverlaps,
            inGreyArea
        );

        toolbarActionCreator.PanStampToDeleteArea(false, actualX, actualY);

        markingActionCreator.onAnnotationDraw(true);

        if (onPageCommentHelper.isCommentsSideViewEnabled && stampId === enums.DynamicAnnotation.OnPageComment) {
            onPageCommentHelper.commentMoveInSideView = true;
            if (this.clientToken !== stampStore.instance.SelectedSideViewCommentToken) {
                stampActionCreator.showOrHideComment(false);
            }
        }

        if (this.deleteAnnotationOnDrop) {
            this.deleteAnnotationOnDrop = false;
            this.removeAnnotation(annotationClientToken);
            this.doEnableClickHandler(true);
        } else {
            this.doEnableClickHandler(false);
        }
    };

    /**
     * Remove annotation
     * @param annotationClientToken
     */
    private removeAnnotation(annotationClientToken: string) {

        let annotationClientTokenToBeDeleted: Array<string> = [];
        let isMarkByAnnotation: boolean;
        isMarkByAnnotation = responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus);
        annotationClientTokenToBeDeleted.push(annotationClientToken);
        markingActionCreator.removeAnnotation(annotationClientTokenToBeDeleted, isMarkByAnnotation, false);
    }

    /**
     * Rerender component forcefully
     */
    private forceAnnotationOverlayToReRender = () => {
        this.forceAnnotationRerender = true;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * set current annotation element
     */
    public setCurrentAnnotationElement = (element: HTMLElement) => {
        this.currentAnnotationElement = element;
    };

    /**
     * set dynamicAnnotationisMoving value from dynamicstampbase
     */
    public setDynamicAnnotationisMoving = (value: boolean): void => {
        this.dynamicAnnotationisMoving = value;
        this.isDynamicAnnotationPanCompleted = value;
        if (this.isStamping) {
            this.isStamping = false;
        }
    };

    /**
     * set setDynamicAnnotationBorder value from dynamicstampbase
     */
    public setDynamicAnnotationBorder = (value: boolean): void => {
        this.isDynamicAnnotationBorderShowing = value;
    };

    /**
     * update the stroke-width on window resize
     */
    private updateStrokeWidthOnWindowResize = (): void => {
        this.updateStrokeWidth(constants.MARKSHEETS_ANIMATION_TIMEOUT);
    };
    /**
     * update the stroke-width on FitHeight/width or Rotate
     */
    private updateStrokeWidthOnZoom = (): void => {
        this.updateStrokeWidth();
    };

    /**
     * update the stroke-width relative to the annotation-holder width
     */
    private updateStrokeWidth = (animationDelay: number = 0): void => {
        let overlayElement = this.annotationOverlayElement;
        var that = this;
        setTimeout(() => {
            that.hlineStrokeWidth = annotationHelper.getStrokeWidth(
                overlayElement, that.props.displayAngle);
            if (this.doAddStrokeWidthStyle) {
                that.forceAnnotationOverlayToReRender();
            }
        }, animationDelay);
    };

    // Gets or sets a value indicating whether current annotation holder
    // contains any stitched images.
    private get isStitchedImage(): boolean {
        return this.overlayBoundary.length > 0;
    }

    /**
     * Returning annotation size according to the page size and current scale factor.
     * @returns
     */
    private get annotationSize(): number {

        // Dynamically calculating the annotation size factor based on the natural image width and
        // selected max width. Incase of stitched image, the natural image width will be the one
        // which is selected for max width. This will give a proper value for determine the size of the annotation
        // based on image zoom/streach size
        return (this.props.currentImageNaturalWidth / this.props.currentImageMaxWidth) * 4;
    }

    /**
    * Returning annotation size according to the page size and current scale factor.
    * @returns
    */
    private get annotationSizeFraction(): number {

        // Dynamically calculating the annotation size factor based on the natural image width and
        // selected max width. Incase of stitched image, the natural image width will be the one
        // which is selected for max width. This will give a proper value for determine the size of the annotation
        // based on image zoom/streach size
        let fraction = (this.props.currentImageNaturalWidth / this.props.currentImageMaxWidth) * 4;
        return ((this.props.currentImageMaxWidth / 100) * fraction) / 2;
    }

    /**
    * Returning the text annotation height, according to the page size and current scale factor.
    * @returns
    */
    private get textAnnotationHeightAdjustment(): number {

        let fraction = (this.props.currentImageNaturalWidth / this.props.currentImageMaxWidth) * 4;
        let annotationPaddingAndBorder = 4;
        let textAnnotationHeightFraction = 0.68;
        let normalAnnotationWidth = ((this.props.currentImageMaxWidth / 100) * fraction);
        return ((normalAnnotationWidth + annotationPaddingAndBorder) * textAnnotationHeightFraction) / 2;
    }

    /**
     *  to trigger the event to re render the sideview comment line.
     * @param element
     * @param actualX
     * @param actualY
     * @param clientToken
     * @param elementClientRect
     */
    private triggerSideViewEvent(element: Element, event: any, clientToken: string, actualX: number,
        actualY: number, elementClientRect: ClientRectDOM, inGreyArea: boolean) {

        // if the moved annotation is on page comment trigger the side view re render to move the line
        if (this.pannedStampId === enums.DynamicAnnotation.OnPageComment) {

            // for first time setting up the actual x and y as line position , then onwards adding the delta.
            if (this.lineYPos === 0 && this.lineXPos === 0) {
                if (elementClientRect) {
                    this.lineYPos = actualY - elementClientRect.top;
                    this.lineXPos = actualX - elementClientRect.left;
                }
            } else {
                this.lineYPos = this.lineYPos + (actualY - this.clientYOld);
                this.lineXPos = this.lineXPos + (actualX - this.clientXOld);
            }

            this.clientXOld = actualX;
            this.clientYOld = actualY;

            stampActionCreator.renderSideViewComments(this.lineXPos, this.lineYPos, clientToken, true, inGreyArea);
        }
    }

    /**
     * Get the current margin top between the stitched image gap.
     * @param {type} overlayBounday
     * @param {type} rotatedAngle
     * @returns Stitched image gap in pixel
     */
    private getBoundaryThreshold(overlayBounday: Array<AnnotationBoundary>, rotatedAngle: number): number {
        let boundaryThreshold: number = 0;
        if (overlayBounday && overlayBounday.length > 0) {

            // Apply the rotation values.
            switch (rotatedAngle) {
                case enums.RotateAngle.Rotate_0:
                case enums.RotateAngle.Rotate_360:
                    boundaryThreshold = overlayBounday[1].start - overlayBounday[0].end;
                    break;
                case enums.RotateAngle.Rotate_90:
                    boundaryThreshold = overlayBounday[0].start - overlayBounday[1].end;
                    break;
                case enums.RotateAngle.Rotate_180:
                    boundaryThreshold = overlayBounday[0].start - overlayBounday[1].end;
                    break;
                case enums.RotateAngle.Rotate_270:
                    boundaryThreshold = overlayBounday[1].start - overlayBounday[0].end;
                    break;
            }
            return boundaryThreshold;
        }
    }

    /**
     *  Get the current drwaing element rectangle with the values
     * @param {number} left
     * @param {number} top
     * @param {number} width
     * @param {number} height
     * @param {number} rotatedAngle
     * @returns Mock element rect
     */
    private getDrawingElementRect(left: number, top: number, width: number, height: number, rotatedAngle: number): ClientRectDOM {

        var elemRect: ClientRectDOM = {
            left: left,
            top: top,
            width: width,
            height: height,
            right: 0,
            bottom: 0
        };

        rotatedAngle = annotationHelper.getAngleforRotation(rotatedAngle);
        switch (rotatedAngle) {

            // In case of rotated pages we are calculating horizontal distance rather than vertical
            // incase of 90 and 270.
            case enums.RotateAngle.Rotate_90:
            case enums.RotateAngle.Rotate_270:
                elemRect.top = left;
                elemRect.height = width;
                elemRect.width = height;
                break;
        }
        return elemRect;
    }

    /**
     * return annotations in the skipped zone
     * @param currentZones
     * @param skippedZones
     * @param multipleMarkSchemes
     */
    private getAnnotationsInSkippedZone(currentZones: Immutable.List<ImageZone>, skippedZones: Immutable.List<ImageZone>,
        multipleMarkSchemes: treeViewItem) {
        let annotationsToDisplayInCurrentPage: Immutable.List<annotation>;
        if (skippedZones && skippedZones.count() > 0) {
            let currentAnnotations = annotationHelper.getCurrentMarkGroupAnnotation();
            if (annotationHelper.doShowPreviousAnnotations && pageLinkHelper.doShowPreviousMarkerLinkedPages) {
                let previousRemarkAnnotations = annotationHelper.getCurrentMarkGroupPreviousRemarkAnnotations(
                    responseHelper.getCurrentResponseSeedType());
                if (currentAnnotations) {
                    previousRemarkAnnotations.map((annotation: annotation) => {
                        annotation.isPrevious = true;
                    });
                    currentAnnotations = currentAnnotations.concat(previousRemarkAnnotations);
                }
            }
            // iterate and find the top height of the zones above the skipped zone
            skippedZones.map((skippedZone: ImageZone) => {
                let zonesAboveSkippedZone = currentZones.filter(item => item.sequence < skippedZone.sequence
                    && item.outputPageNo === skippedZone.outputPageNo).toList();
                let skippedImageNaturalDimension = this.props.getImageNaturalDimension(skippedZone.pageNo);
                if (skippedImageNaturalDimension) {
                    let skippedZoneTop = annotationHelper.findPercentage(skippedImageNaturalDimension.naturalHeight, skippedZone.topEdge);
                    let skippedZoneLeft = annotationHelper.findPercentage(skippedImageNaturalDimension.naturalWidth, skippedZone.leftEdge);
                    let skippedZoneHeight = annotationHelper.findPercentage(skippedImageNaturalDimension.naturalHeight, skippedZone.height);
                    if (this.props.getHeightOfZones && zonesAboveSkippedZone.count() >= 0) {
                        // find the height of zones above the skipped zone
                        let heightOfZonesAboveSkippedZone = this.props.getHeightOfZones(zonesAboveSkippedZone);
                        multipleMarkSchemes.treeViewItemList.map((item: treeViewItem) => {
                            // iterate through the annotation and find if the annotation is place in skipped zone
                            currentAnnotations.map((annotation: annotation) => {
                                if (annotation.topEdge >= heightOfZonesAboveSkippedZone &&
                                    annotation.topEdge <= heightOfZonesAboveSkippedZone + skippedZoneHeight &&
                                    annotation.outputPageNo === skippedZone.outputPageNo &&
                                    annotation.markSchemeId === item.uniqueId &&
                                    annotation.markingOperation !== enums.MarkingOperation.deleted) {
                                    if (!annotationsToDisplayInCurrentPage) {
                                        annotationsToDisplayInCurrentPage = Immutable.List<annotation>();
                                    }
                                    // update the annotation topAboveZone and skippedZoneTop
                                    annotation.isInSkippedZone = true;
                                    annotation.topAboveZone = heightOfZonesAboveSkippedZone;
                                    annotation.skippedZoneTop = skippedZoneTop;
                                    annotation.skippedZoneLeft = skippedZoneLeft;
                                    annotationsToDisplayInCurrentPage = annotationsToDisplayInCurrentPage.push(annotation);
                                }
                            });
                        });
                    }
                }
            });
        }
        // return undefined if no annotations is found in the skipped zone.by doing this it wont initialize the global varialbe in the
        // annotation overlay, which is determining if we need to call this function or not
        return annotationsToDisplayInCurrentPage ? annotationsToDisplayInCurrentPage : undefined;
    }

    /**
     * return wrap style for a annotation
     * @param annotation
     * @param stamp
     */
    private getAnnotationWrapStyle(annotation: annotation, stamp: stampData): React.CSSProperties {
        let annotationWrapStyle: React.CSSProperties = {};
        let zoneTop = this.props.isReadOnly ? 0 : this.props.zoneTop;
        let zoneLeft = this.props.isReadOnly ? 0 : this.props.zoneLeft;
        let zoneHeight = this.props.isReadOnly ? 0 : this.props.zoneHeight;
        let topAboveCurrentZone = this.props.topAboveCurrentZone ? this.props.topAboveCurrentZone : 0;
        let topAdjustment = 0;
        let leftAdjustment = 0;

        if (this.props.doApplyLinkingScenarios && annotation.pageNo === 0) {
            if (this.props.isALinkedPage) {
                if (annotation.isInSkippedZone && annotation.isInSkippedZone === true) {
                    if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                        topAdjustment = annotation.height - annotation.topAboveZone + annotation.skippedZoneTop;
                        leftAdjustment = annotation.width + annotation.skippedZoneLeft;
                    } else {
                        topAdjustment = annotation.topEdge - annotation.topAboveZone + annotation.skippedZoneTop;
                        leftAdjustment = annotation.leftEdge + annotation.skippedZoneLeft;
                    }
                } else if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                    topAdjustment = annotation.height - topAboveCurrentZone + zoneTop;
                    leftAdjustment = annotation.width + zoneLeft;
                } else {
                    topAdjustment = annotation.topEdge - topAboveCurrentZone + zoneTop;
                    leftAdjustment = annotation.leftEdge + zoneLeft;
                }
            } else {
                if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                    topAdjustment = Math.abs(annotation.height - topAboveCurrentZone);
                    leftAdjustment = annotation.width;
                } else {
                    topAdjustment = annotation.topEdge - topAboveCurrentZone;
                    leftAdjustment = annotation.leftEdge;
                }
            }
        } else {
            if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                topAdjustment = annotation.height;
                leftAdjustment = annotation.width;
            } else {
                topAdjustment = annotation.topEdge;
                leftAdjustment = annotation.leftEdge;
            }
        }

        // set annotation wrap style.
        return this.setAnnotationWrapStyle(topAdjustment, leftAdjustment, annotationWrapStyle, zoneTop,
            zoneHeight, stamp.stampType);

    }

    /**
     * Set annotation wrap style based on component type.
     * @param topAdjustment
     * @param leftAdjustment
     * @param annotationWrapStyle
     * @param zoneTop
     * @param zoneHeight
     * @param stampType
     */
    private setAnnotationWrapStyle(topAdjustment: number, leftAdjustment: number, annotationWrapStyle: React.CSSProperties,
        zoneTop: any, zoneHeight: any, stampType: any): React.CSSProperties {
        if (this.props.isEBookMarking === true) {
            // calculate annotation top relative to natural height if full response view
            // else calculate relative to zone height.
            if (responseStore.instance.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView && !this.props.isALinkedPage) {
                annotationWrapStyle.top = (topAdjustment - zoneTop - ((stampType === enums.StampType.text) ?
                    this.textAnnotationHeightAdjustment : this.annotationSizeFraction)) * 100 / zoneHeight + '%';
            } else {
                annotationWrapStyle.top = (topAdjustment - ((stampType === enums.StampType.text) ?
                    this.textAnnotationHeightAdjustment : this.annotationSizeFraction)) * 100 / this.props.currentOutputImageHeight + '%';
            }
        } else {
            // calculate zone relative to current output image height
            annotationWrapStyle.top = (((topAdjustment - ((stampType === enums.StampType.text) ?
                this.textAnnotationHeightAdjustment : this.annotationSizeFraction)) / this.props.currentOutputImageHeight) * 100) + '%';
        }
        annotationWrapStyle.left = (((leftAdjustment - this.annotationSizeFraction) / this.props.currentImageMaxWidth) * 100) + '%';

        return annotationWrapStyle;
    }

    /**
     * add a link annotation if the page is linked by previous marker and current marker is
     * adding a annotation for the first time
     */
    private addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo: number) {
        if (this.props.isALinkedPage && pageLinkHelper.doShowPreviousMarkerLinkedPages &&
            this.props.pagesLinkedByPreviousMarkers && this.props.pagesLinkedByPreviousMarkers.length > 0) {
            // if its a multiple markscheme then we need to add the link against the first question item
            this.treeViewHelper = new treeViewDataHelper();
            let tree = this.treeViewHelper.treeViewItem();
            let multipleMarkSchemes = markingHelper.getMarkschemeParentNodeDetails(
                tree, markingStore.instance.currentMarkSchemeId, true);
            pageLinkHelper.addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo, this.props.isALinkedPage,
                this.props.pagesLinkedByPreviousMarkers, multipleMarkSchemes);
        }
    }

    /* Handler for pinch start event */
    private onPinchStart = (event: EventCustom) => {
        this.isPinching = true;
    };

    /* Handler for pinch end event */
    private onPinchEnd = (event: EventCustom) => {
        this.isPinching = false;
    };

    /**
     * render acetates
     */
    private renderAcetates(): JSX.Element {
        if (this.doRenderOverlays) {
            let pageNo = this.props.pageNo > 0 ? this.props.pageNo : this.props.structerdPageNo;
            let imageDimension = this.props.getImageNaturalDimension(pageNo);
            if (imageDimension) {
                let imageProps = {
                    naturalHeight: imageDimension.naturalHeight,
                    naturalWidth: imageDimension.naturalWidth,
                    pageNo: pageNo,
                    outputPageNo: annotationHelper.getOutputPageNo(this.props.doApplyLinkingScenarios,
                        this.props.imageZones,
                        this.props.imageZone,
                        this.props.outputPageNo),
                    outputPageHeight: this.props.currentOutputImageHeight,
                    outputPageWidth: this.props.currentImageMaxWidth,
                    currentImageZone: this.props.imageZone,
                    isALinkedPage: this.props.isALinkedPage,
                    stitchedImageZones: this.props.imageZones,
                    getHeightOfZones: this.props.getHeightOfZones,
                    getImageNaturalDimension: this.props.getImageNaturalDimension,
                    isStitchedImage: this.isStitchedImage,
                    linkedOutputPageNo: this.props.outputPageNo,
                    currentImageZones: this.props.currentImageZones
                };
                let linkingScenarioProps = {
                    topAboveCurrentZone: this.props.topAboveCurrentZone,
                    zoneTop: this.props.zoneTop,
                    zoneLeft: this.props.zoneLeft,
                    zoneHeight: this.props.zoneHeight,
                    skippedZones: this.props.skippedZones
                };
                return <OverlayHolder id='OverlayHolder' key='OverlayHolder'
                    imageProps={imageProps}
                    getAnnotationOverlayElement={this.overlayElement}
                    linkingScenarioProps={linkingScenarioProps}
                    doApplyLinkingScenarios={this.props.doApplyLinkingScenarios}
                    getMarkSheetContainerProperties={this.props.getMarkSheetContainerProperties}
                    enableImageContainerScroll={this.props.enableImageContainerScroll} />
            }
        }

        return null;
    }

    /* return true if we need to render the overlays (acetates) */
    private get doRenderOverlays() {
        return !this.props.isReadOnly && !ecourseWorkHelper.isECourseworkComponent && responseHelper.isOverlayAnnotationsVisible;
    }

    /**
     * This method will call when a stamp selected in fav/ main toolbar
     * @private
     * @memberof AnnotationOverlay
     */
    private onStampSelectedInToolbar = () => {
        // Fix for issue: If we select an existing highlighter on the script,
        // resize it and then click on an annotation type (e.g. tick) in the toolbar, the highlighter becomes un-selected as expected.
        // However, if We then try to stamp a tick on top of the highlighter it doesn’t work on first tap; you have to tap again to place it.
        if (!this.isDynamicAnnotationPanCompleted) {
            this.isDynamicAnnotationPanCompleted = true;
        }
    }

    /**
     * This method will call on remove annotation
     * @private
     * @memberof AnnotationOverlay
     */
    private onRemoveAnnotation = () => {
        // In devices if we delete an annotation by dragging to outside then we need to reset isDynamicAnnotationBorderShowing flag.
        // otherwise we can't place to new annotation because of this.
        if (deviceHelper.isTouchDevice && this.isDynamicAnnotationBorderShowing) {
            this.isDynamicAnnotationBorderShowing = false;
        }
    }

    /**
     * To set the highlighter in FRV on unmanaged unknown contents.
     */
    private setUnknownContentHighlighter(pageNumber: number, pageWidth: number, pageHeight: number): JSX.Element {
        let styles: React.CSSProperties = {};

        if (imageZoneStore.instance.currentCandidateScriptImageZone && imageZoneStore.instance.currentCandidateScriptImageZone.count() > 0) {

            /* Gets the unknown content zone in a page */
            let unknownZoneList = imageZoneStore.instance.currentCandidateScriptImageZone.
                filter((x: ImageZone) => x.pageNo === pageNumber && x.docStorePageQuestionTagTypeId === 4);
            if (unknownZoneList.count() > 0) {

                // The counter is for creating the id of the unzone-content-holder element
                let counter = 0;
                let unknownZones = unknownZoneList.map((imageZone: ImageZone) => {
                    styles = {
                        paddingTop: ((pageHeight / pageWidth) * imageZone.height).toString() + '%',
                        top: imageZone.topEdge.toString() + '%'
                    }
                    counter++;
                    return (<div className='unzone-content-holder'
                        id={'unzone_content_holder_' + pageNumber + '_' + counter}
                        style={styles}
                        key={'unzone_content_holder_' + pageNumber + '_' + counter}></div>)
                });

                return (<div className='unzone-content-wrapper' id={'unzone_content_wrapper_' + pageNumber}>
                    {unknownZones}
                </div>);
            }
        }
    }

    /* return true if we need to add stroke width in annotation overlay */
    private get doAddStrokeWidthStyle(): boolean {
        let isAtypical = responseHelper.isAtypicalResponse();
        let angle = annotationHelper.getAngleforRotation(this.props.displayAngle);
        return (responseStore.instance.markingMethod === enums.MarkingMethod.Structured && !isAtypical) ||
            (this.props.isEBookMarking === true && !isAtypical) ||
            angle === enums.RotateAngle.Rotate_90 || angle === enums.RotateAngle.Rotate_270;
    }

    /**
     * return annotation overlay stroke width
     */
    private get annotationOverlayStrokeWidth() {
        if (this.doAddStrokeWidthStyle) {
            return '#' + this.getAnnotationOverlayId() + '{stroke-width:' + this.hlineStrokeWidth + ';}';
        }
        return '';
    }
}


export = AnnotationOverlay;


/* tslint:enable */