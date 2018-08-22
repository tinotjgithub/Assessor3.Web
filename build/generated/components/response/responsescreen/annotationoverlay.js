"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable */
var React = require('react');
var ReactDom = require('react-dom');
var Immutable = require('immutable');
var ImageStamp = require('../annotations/static/imagestamp');
var TextStamp = require('../annotations/static/textstamp');
var DynamicStampFactory = require('../annotations/dynamic/dynamicstampfactory');
var enums = require('../../utility/enums');
var stampStore = require('../../../stores/stamp/stampstore');
var markingStore = require('../../../stores/marking/markingstore');
var responseStore = require('../../../stores/response/responsestore');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var annotationHelper = require('../../utility/annotation/annotationhelper');
var responseHelper = require('../../utility/responsehelper/responsehelper');
var onPageCommentHelper = require('../../utility/annotation/onpagecommenthelper');
var toolbarActionCreator = require('../../../actions/toolbar/toolbaractioncreator');
var toolbarStore = require('../../../stores/toolbar/toolbarstore');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var constants = require('../../utility/constants');
var localeStore = require('../../../stores/locale/localestore');
var colouredAnnotationsHelper = require('../../../utility/stamppanel/colouredannotationshelper');
var eventManagerBase = require('../../base/eventmanager/eventmanagerbase');
var deviceHelper = require('../../../utility/touch/devicehelper');
var eventTypes = require('../../base/eventmanager/eventtypes');
var stampActionCreator = require('../../../actions/stamp/stampactioncreator');
var direction = require('../../base/eventmanager/direction');
var marksAndAnnotationsVisibilityHelper = require('../../utility/marking/marksandannotationsvisibilityhelper');
var DynamicMovingElement = require('../annotations/dynamic/dynamicmovingelement');
var exceptionStore = require('../../../stores/exception/exceptionstore');
var messageStore = require('../../../stores/message/messagestore');
var userInfoStore = require('../../../stores/userinfo/userinfostore');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var markingHelper = require('../../../utility/markscheme/markinghelper');
var treeViewDataHelper = require('../../../utility/treeviewhelpers/treeviewdatahelper');
var pageLinkHelper = require('./linktopage/pagelinkhelper');
var loggingHelper = require('../../utility/marking/markingauditlogginghelper');
var loggerConstants = require('../../utility/loggerhelperconstants');
var ecourseWorkHelper = require('../../utility/ecoursework/ecourseworkhelper');
var OverlayHolder = require('./overlayholder');
var imageZoneStore = require('../../../stores/imagezones/imagezonestore');
var AnnotationOverlay = (function (_super) {
    __extends(AnnotationOverlay, _super);
    function AnnotationOverlay(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isContextMenuVisible = true;
        this._onWindowResizeEventHandler = null;
        this.annotationHolderClass = 'annotation-holder';
        this.forceAnnotationRerender = false;
        this.deleteAnnotationOnDrop = false;
        this.initCoordinates = { x: 0, y: 0 };
        this.isDrawMode = false;
        this.isOutside = false;
        this.isAnnotationinGreyArea = false;
        /**To store initial Scroll while clicking and hold */
        this.scrollTop = 0;
        /**To store top value while moving */
        this.finalTop = 0;
        /**To store height value while moving */
        this.finalHeight = 0;
        this.currentAnnotationElement = null;
        this.drawSequence = 0;
        this.drawDirection = enums.DrawDirection.Right;
        this.isDrawEnd = false;
        this.isStamping = false;
        this.pannedStampId = 0;
        this.isDrawLeft = false;
        // hold the client token of panned stamp
        this.clientToken = '';
        // check whether the panned annotation is active or not (faded / previous annotation)
        this.isActiveAnnotation = true;
        /**If dynamic annotation is moving/resizing then  dynamicAnnotationisMoving value will be true, otherwise false*/
        this.dynamicAnnotationisMoving = false;
        this.hlineStrokeWidth = '1';
        /**If dynamic annotation border is showing then  isDynamicAnnotationBorderShowing value will be true, otherwise false*/
        this.isDynamicAnnotationBorderShowing = false;
        /* this will set to false when dynamic annotation is moved. this will be used to prevent
         * stamping annotation while clicking annotation overlay */
        this.isDynamicAnnotationPanCompleted = true;
        this.doEnablePan = true;
        this.doEnableClick = true;
        this.doEnableDynamicAnnotationDraw = false;
        this.isOnPageCommentAdded = false;
        this.annotationsToDisplay = undefined;
        // Gets or sets a value indicating the boundary of coordinates of current
        // overlay according to the image.....
        this.overlayBoundary = [];
        this.logger = new loggingHelper();
        this.isPinching = false;
        this.isDynamicAnnotationDrawInProgress = false;
        this.isCursorOverAnnotationOverlay = false;
        this.refreshCommentContainer = false;
        this.overlayElement = null;
        this.isComponentMounted = false;
        /**
         * enables or disables image container scroll
         * @param value
         */
        this.enableImageContainerScroll = function (value) {
            if (_this.props.enableImageContainerScroll) {
                _this.props.enableImageContainerScroll(value);
            }
        };
        /** this is to avoid the unwanted input events triggered by hammer*/
        this.stopInputEvents = function (event) {
            _this.eventHandler.stopPropagation(event);
        };
        /* sets annotation event handler enabled or not */
        this.doEnableClickHandler = function (status) {
            _this.doEnableClick = status;
        };
        /* pan move action for annotation overlay */
        this.onPanMove = function (event) {
            if (_this.isPanEnabled && _this.isPinching === false
                && !annotationHelper.isEventCanceled(event)) {
                // call panmove if pan started on a annotation only
                if (_this.isPanEnabledForDynamicAnnotation) {
                    _this.onDrawMove(event);
                }
                else if (_this.isPanEnabledForStaticAnnotation) {
                    _this.onAnnotationPanMove(event);
                }
            }
        };
        /* annotation added action for annotation overlay */
        this.onAnnotationAdded = function (stampId, addAnnotationAction, annotationOverlayId, annotation) {
            _this.addedAnnotationClientToken = annotation.clientToken;
            if (annotationOverlayId === _this.props.id) {
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * This will call on pan start in stamp panel
         * @param event: Custom event type
         */
        this.onPanStart = function (event) {
            _this.currentAnnotationElement = undefined;
            if (_this.isPanEnabled && _this.isPinching === false && !annotationHelper.isEventCanceled(event)) {
                // find the position of pan start for finding stamp element.
                var stampX = event.center.x - event.deltaX;
                var stampY = event.center.y - event.deltaY;
                // find the stamp element
                var element = htmlUtilities.getElementFromPosition(stampX, stampY);
                if (element) {
                    //Resetting the line position of side view comment on comment annotation move
                    _this.lineYPos = 0;
                    _this.lineXPos = 0;
                    // get the stampId and stamp data
                    _this.pannedStampId = element.getAttribute('data-stamp') ? parseInt(element.getAttribute('data-stamp')) : 0;
                    _this.clientToken = element.getAttribute('data-token');
                    // get stamp details
                    _this.pannedStamp = stampStore.instance.getStamp(_this.pannedStampId);
                    // save the selected stamp details for pan move
                    _this.selectedStamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
                    var annotationData = markingStore.instance.findAnnotationData(_this.clientToken);
                    // check whether the annotation is active (faded or previous)
                    _this.isActiveAnnotation = annotationData ?
                        annotationData.markSchemeId === markingStore.instance.currentQuestionItemInfo.uniqueId : false;
                    if (_this.isActiveAnnotation) {
                        _this.isActiveAnnotation = !annotationHelper.isPreviousAnnotation(element);
                    }
                    // Hide context menu on draw start or dragging
                    markingActionCreator.showOrHideRemoveContextMenu(false);
                    if (_this.isPanEnabledForDynamicAnnotation) {
                        _this.onDrawStart(event);
                    }
                    else if (_this.isPanEnabledForStaticAnnotation) {
                        if (!onPageCommentHelper.isCommentsSideViewEnabled) {
                            if (htmlUtilities.isTabletOrMobileDevice) {
                                stampActionCreator.showOrHideComment(false, true);
                            }
                            else {
                                stampActionCreator.showOrHideComment(false);
                            }
                        }
                        _this.onAnnotationPanStart(_this.pannedStampId, _this.clientToken, event);
                        // If dragged inside the script then hide the annotation
                        _this.setState({
                            renderedOn: Date.now()
                        });
                    }
                    if (annotationHelper.isDynamicAnnotation(_this.selectedStamp)
                        && _this.pannedStampId === 0) {
                        _this.doEnableClickHandler(false);
                    }
                }
            }
            else {
                _this.doEnableClickHandler(false);
            }
        };
        /**
         * This method will call on panend event
         */
        this.onPanEnd = function (event) {
            if (_this.isPanEnabled) {
                // Defect 21590: On page comment and similar static Annotations seems to overlap with
                // mouse cursor SVG while stamping- IE only - noticeable on higher zoom level only
                responseActionCreator.setMousePosition(-1, -1);
                // consider the selected stamp scenario for dynamic
                if (_this.isPanEnabledForDynamicAnnotation) {
                    _this.onDrawEnd(event);
                }
                else if (_this.isPanEnabledForStaticAnnotation) {
                    _this.onAnnotationPanEnd(_this.clientToken, _this.pannedStampId, event, 0, 0);
                }
                _this.clearPanData();
            }
            _this.enableImageContainerScroll(true);
            _this.doEnableDynamicAnnotationDraw = false;
            // Defect: #34665
            // if current browser is not chrome then we need to enable the click handler
            // in chrome an automatic click event is firing after the pan, that clickHandler method
            // will call doEnableClickHandler(true) method.
            if (htmlUtilities.getUserDevice().browser !== 'Chrome' || htmlUtilities.isTabletOrMobileDevice) {
                _this.doEnableClickHandler(true);
            }
            _this.doEnableDocumentSelection(true);
        };
        /* pressup event for annotation overlay */
        this.onPressUp = function (event) {
            _this.doEnableDynamicAnnotationDraw = false;
            _this.enableImageContainerScroll(true);
        };
        /**
         * on touch and hold handler
         * @param event
         */
        this.onTouchHold = function (event) {
            event.srcEvent.stopPropagation();
            event.srcEvent.preventDefault();
            _this.enableImageContainerScroll(false);
            _this.doEnableDynamicAnnotationDraw = true;
            // find the position of pan start for finding stamp element.
            var stampX = event.center.x;
            var stampY = event.center.y;
            // find the stamp element
            var element = htmlUtilities.getElementFromPosition(stampX, stampY);
            // get the stampId and stamp data
            var stampId = parseInt(element.getAttribute('data-stamp'));
            var clientToken = element.getAttribute('data-token');
            // get stamp details
            var stampData = undefined;
            if (stampId > 0) {
                stampData = stampStore.instance.getStamp(stampId);
            }
            if (stampData && !annotationHelper.isDynamicAnnotation(stampData.stampType)) {
                if (event.changedPointers && event.changedPointers.length > 0 && !deviceHelper.isMSTouchDevice()) {
                    // find the annotation data based on the client token
                    var annotationData = markingStore.instance.findAnnotationData(clientToken);
                    // Pass the currently clicked annotation along with the X and Y because Remove Context menu
                    // is under marksheet div and we need to show the context menu at this position
                    stampActionCreator.showOrHideComment(false);
                    // Close Bookmark Name Entry Box
                    stampActionCreator.showOrHideBookmarkNameBox(false);
                    _this.showOrHideRemoveContextMenu(true, clientToken, event.changedPointers[event.changedPointers.length - 1].clientX, event.changedPointers[event.changedPointers.length - 1].clientY, _this.getAnnotationOverlayWidth(), annotationData);
                }
            }
        };
        /*
         * Handles Tap event.
         * @param event
         */
        this.onTapHandler = function (event) {
            // context menu not closing while clicking outside at very first time
            if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
                markingActionCreator.showOrHideRemoveContextMenu(false);
            }
            var annotationElement = htmlUtilities.getElementFromPosition(event.changedPointers[0].clientX, event.changedPointers[0].clientY);
            // Element will be null in MAC Safari, if over the stamp panel using trackpad
            if (annotationElement === null) {
                return;
            }
            var rotatedAngle = annotationHelper.getAngleforRotation(Number(annotationElement.getAttribute('data-rotatedangle')));
            if (_this.props.imageZone) {
                if (responseStore.instance.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView
                    && _this.viewWholePageVisibilityCheck(_this.props.imageZone)) {
                    // action to set view whole page button visible.
                    responseActionCreator.viewWholePageLinkAction(true, _this.props.imageZone);
                }
            }
            else if (_this.props.imageZones && _this.props.imageZones.length > 0) {
                if (_this.isStitchedImage &&
                    annotationHelper.isAnnotationInsideStitchedImage(_this.overlayBoundary, rotatedAngle, event.changedPointers[0].clientX, event.changedPointers[0].clientY)) {
                    var currentImageZone = annotationHelper.getImageZone(_this.overlayBoundary, rotatedAngle, event.changedPointers[0].clientX, event.changedPointers[0].clientY, _this.props.imageZones);
                    if (_this.viewWholePageVisibilityCheck(currentImageZone)) {
                        responseActionCreator.viewWholePageLinkAction(true, currentImageZone);
                    }
                }
            }
            var clickedElement = htmlUtilities.getElementFromPosition(event.changedPointers[0].clientX, event.changedPointers[0].clientY);
            if (exceptionStore.instance.isExceptionPanelVisible || messageStore.instance.isMessagePanelVisible) {
                return;
            }
            if (htmlUtilities.isIE || htmlUtilities.isEdge) {
                var annotationElement_1 = htmlUtilities.findAncestor(clickedElement, 'annotation-wrap');
                var isInActiveDynamicAnnotation = false;
                if (annotationElement_1 && typeof annotationElement_1.className === 'string' &&
                    annotationElement_1.className.indexOf('inactive') > -1 &&
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
                        !annotationHelper.checkMouseDrawingOutsideResponseArea(event, 'stamp', _this.annotationOverlayElement, _this.props.displayAngle, stamp.stampId, true))) {
                        _this.addOrUpdateAnnotation(event.changedPointers[0].clientX, event.changedPointers[0].clientY, enums.AddAnnotationAction.Stamping, toolbarStore.instance.selectedStampId);
                    }
                }
            }
        };
        /**
         * Clear/ reset pan data
         */
        this.clearPanData = function () {
            _this.pannedStampId = 0;
            _this.pannedStamp = undefined;
            _this.selectedStamp = undefined;
            _this.clientToken = '';
            _this.isActiveAnnotation = true;
        };
        /* annotation updated event handler */
        this.annotationUpdated = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * selected question item changed
         */
        this.questionItemChanged = function () {
            if (_this.isComponentMounted) {
                // remove dynamic annotation selection on question item change, only if dynamic annotaion selection is enabled.
                if (_this.isDynamicAnnotationBorderShowing) {
                    markingActionCreator.updateAnnotationSelection(false);
                }
                _this.setState({ renderedOn: Date.now() });
            }
        };
        /**
         * load the annotations for the current page
         */
        this.getAnnotationsToDisplayInCurrentPage = function () {
            _this.treeViewHelper = new treeViewDataHelper();
            var currentQuestionItem = markingStore.instance.currentQuestionItemInfo;
            if (currentQuestionItem && (currentQuestionItem.imageClusterId > 0 || _this.props.isEBookMarking === true) && !_this.tree) {
                _this.tree = _this.treeViewHelper.treeViewItem();
            }
            if (_this.props.doApplyLinkingScenarios === true && _this.props.isReadOnly !== true && _this.tree) {
                var multipleMarkSchemes = markingHelper.getMarkschemeParentNodeDetails(_this.tree, markingStore.instance.currentMarkSchemeId, true);
                var outputPageNo = annotationHelper.getOutputPageNo(_this.props.doApplyLinkingScenarios, _this.props.imageZones, _this.props.imageZone, _this.props.outputPageNo);
                _this.annotationsToDisplayInCurrentPage = annotationHelper.getAnnotationsToDisplayInLinkingScenarios(_this.props.isALinkedPage, _this.props.imageClusterId, _this.props.currentImageMaxWidth, _this.props.topAboveCurrentZone, _this.props.zoneHeight, outputPageNo, _this.props.currentImagePageNo, multipleMarkSchemes, pageLinkHelper.doShowPreviousMarkerLinkedPages, responseHelper.getCurrentResponseSeedType(), _this.props.isEBookMarking);
                if (!_this.annotationsInSkippedZone) {
                    _this.annotationsInSkippedZone = _this.getAnnotationsInSkippedZone(_this.props.currentImageZones, _this.props.skippedZones, multipleMarkSchemes);
                }
                if (_this.annotationsInSkippedZone && _this.annotationsInSkippedZone.count() > 0) {
                    _this.annotationsToDisplayInCurrentPage = _this.annotationsToDisplayInCurrentPage.concat(_this.annotationsInSkippedZone);
                    _this.annotationsInSkippedZone = undefined;
                }
            }
            else {
                var markSchemesWithSameImages = void 0;
                if (_this.tree && _this.tree.treeViewItemList) {
                    if (_this.props.isEBookMarking) {
                        markSchemesWithSameImages = markingHelper.getMarkSchemesWithSameQuestionTagId(_this.tree, markingStore.instance.currentQuestionItemQuestionTagId, true);
                    }
                    else {
                        markSchemesWithSameImages = markingHelper.getMarkSchemesWithSameImageClusterId(_this.tree, markingStore.instance.currentQuestionItemImageClusterId, true);
                    }
                }
                _this.annotationsToDisplayInCurrentPage = annotationHelper.getAnnotationsToDisplayInCurrentPage(_this.props.imageClusterId, _this.props.outputPageNo, _this.props.currentImageMaxWidth, _this.props.pageNo, _this.props.isReadOnly, responseHelper.getCurrentResponseSeedType(), responseHelper.isAtypicalResponse(), markSchemesWithSameImages, _this.props.isEBookMarking);
            }
        };
        /**
         * get image zones of the response
         */
        this.getImageZones = function () {
            return _this.props.imageZones ?
                _this.props.imageZones :
                (_this.props.isEBookMarking === true && _this.props.imageZone) ?
                    _this.props.imageZone : null;
        };
        /*
         * Returns the tooltip to be applied for the annotations
         */
        this.getToolTip = function (stampId, markSchemeId) {
            if (_this.props.isReadOnly === true) {
                return '';
            }
            return localeStore.instance.TranslateText('marking.response.stamps.stamp_' + stampId) + '\n' +
                markingStore.instance.toolTip(markSchemeId);
        };
        /*sets the pan enable status for the annotation overlay*/
        this.enableAnnotationOverlayPan = function (value) {
            _this.doEnablePan = value;
        };
        /*
         * Returns true, when view whole page button is suppose to display in script.
         */
        this.viewWholePageVisibilityCheck = function (imageZone) {
            var currentQuestionItemImageClusterId = markingStore.instance.currentQuestionItemInfo.imageClusterId;
            return (!(imageZone.topEdge === 0
                && imageZone.leftEdge === 0
                && imageZone.width === 100
                && imageZone.height === 100)
                && imageZone.isViewWholePageLinkVisible
                && toolbarStore.instance.selectedStampId === 0
                && toolbarStore.instance.panStampId === 0
                && !stampStore.instance.isDynamicAnnotationActive
                && currentQuestionItemImageClusterId !== 0
                && currentQuestionItemImageClusterId !== null
                && currentQuestionItemImageClusterId !== undefined);
        };
        /**
         * This method will get fired when the mouse is moved over the annotation area
         */
        this.mouseOverHandler = function (event) {
            var annotationElement = htmlUtilities.getElementFromPosition(event.clientX, event.clientY);
            // Element will be null in MAC Safari, if over the stamp panel using trackpad
            if (annotationElement === null) {
                return;
            }
            var rotatedAngle = annotationHelper.getAngleforRotation(Number(annotationElement.getAttribute('data-rotatedangle')));
            if (!htmlUtilities.isTabletOrMobileDevice && responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
                _this.annotationOverlayElement = _this.getAnnotationOverlayElement();
                _this.overlayBoundary = annotationHelper.getStitchedImageBoundary(_this.annotationOverlayElement.parentElement, rotatedAngle);
                if (_this.props.imageZone) {
                    if (_this.viewWholePageVisibilityCheck(_this.props.imageZone)) {
                        // action to set view whole page button visible.
                        _this.isCursorOverAnnotationOverlay = true;
                        _this.previouslySelectedZone = _this.props.imageZone;
                        responseActionCreator.viewWholePageLinkAction(true, _this.props.imageZone);
                    }
                }
                else if (_this.props.imageZones && _this.props.imageZones.length > 0) {
                    if (_this.isStitchedImage &&
                        annotationHelper.isAnnotationInsideStitchedImage(_this.overlayBoundary, rotatedAngle, event.clientX, event.clientY)) {
                        var currentImageZone = annotationHelper.getImageZone(_this.overlayBoundary, rotatedAngle, event.clientX, event.clientY, _this.props.imageZones);
                        if (_this.viewWholePageVisibilityCheck(currentImageZone)) {
                            if (!_this.isCursorOverAnnotationOverlay) {
                                _this.isCursorOverAnnotationOverlay = true;
                                _this.previouslySelectedZone = currentImageZone;
                                responseActionCreator.viewWholePageLinkAction(true, currentImageZone);
                            }
                            else if (_this.isCursorOverAnnotationOverlay &&
                                _this.previouslySelectedZone) {
                                _this.previouslySelectedZone = currentImageZone;
                                _this.isCursorOverAnnotationOverlay = true;
                                responseActionCreator.viewWholePageLinkAction(true, currentImageZone);
                            }
                        }
                    }
                }
            }
        };
        /**
         * This method will get fired when the mouse hover the annotation area
         * @param event
         */
        this.onMouseMove = function (event) {
            var annotationElement = htmlUtilities.getElementFromPosition(event.clientX, event.clientY);
            // Element will be null in MAC Safari, if over the stamp panel using trackpad
            if (annotationElement === null) {
                return;
            }
            var angle = Number(annotationElement.getAttribute('data-rotatedangle')) > 0 ? Number(annotationElement.getAttribute('data-rotatedangle')) : _this.props.displayAngle;
            var rotatedAngle = annotationHelper.getAngleforRotation(angle);
            if (!htmlUtilities.isTabletOrMobileDevice &&
                responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
                if (_this.props.imageZones && _this.props.imageZones.length > 0) {
                    _this.annotationOverlayElement = _this.getAnnotationOverlayElement();
                    _this.overlayBoundary = annotationHelper.getStitchedImageBoundary(_this.annotationOverlayElement.parentElement, rotatedAngle);
                    if (_this.isStitchedImage) {
                        var currentImageZone = annotationHelper.getImageZone(_this.overlayBoundary, rotatedAngle, event.clientX, event.clientY, _this.props.imageZones);
                        if (_this.isCursorOverAnnotationOverlay
                            && currentImageZone === undefined) {
                            responseActionCreator.viewWholePageLinkAction(false, undefined);
                            _this.resetViewWholePageButtonDetails();
                        }
                        else if (!_this.isCursorOverAnnotationOverlay
                            && currentImageZone && _this.viewWholePageVisibilityCheck(currentImageZone)) {
                            _this.previouslySelectedZone = currentImageZone;
                            responseActionCreator.viewWholePageLinkAction(true, currentImageZone);
                            _this.isCursorOverAnnotationOverlay = true;
                        }
                        else if (_this.isCursorOverAnnotationOverlay
                            && currentImageZone.uniqueId && _this.previouslySelectedZone
                            && _this.previouslySelectedZone.uniqueId !== currentImageZone.uniqueId) {
                            responseActionCreator.viewWholePageLinkAction(false, _this.previouslySelectedZone);
                            if (_this.viewWholePageVisibilityCheck(currentImageZone)) {
                                _this.isCursorOverAnnotationOverlay = true;
                                _this.previouslySelectedZone = currentImageZone;
                                responseActionCreator.viewWholePageLinkAction(true, currentImageZone);
                            }
                        }
                    }
                }
            }
            var stamp = stampStore.instance.getStamp(toolbarStore.instance.panStampId);
            _this.annotationOverlayElementClientRect = _this.annotationOverlayElement.getBoundingClientRect();
            var left = event.clientX - _this.annotationOverlayElementClientRect.left;
            var top = event.clientY - _this.annotationOverlayElementClientRect.top;
            var isPannedOnDynamicAnnotation = annotationHelper.isDynamicAnnotationElement(annotationElement);
            // Check If pointer is over the image, If so set the cursor style else hide the style.
            var outsideResponseArea = false;
            var inGreyArea = false;
            var insideStitchedGap = true;
            outsideResponseArea = annotationHelper.checkMouseDrawingOutsideResponseArea(event, '', _this.annotationOverlayElement, rotatedAngle);
            if (_this.isStitchedImage && stamp !== undefined) {
                // Update the annotation overlay boundary on each move from one page to another. So we need to
                // update the rotated angle as well.
                _this.overlayBoundary = annotationHelper.getStitchedImageBoundary(_this.annotationOverlayElement.parentElement, rotatedAngle);
                inGreyArea = annotationHelper.checkInGreyArea(event.clientX, event.clientY, rotatedAngle, _this.isDrawLeft, annotationElement, _this.marksheetContainerProperties, 0, false, stamp.stampId, _this.overlayBoundary);
                insideStitchedGap = annotationHelper.isAnnotationInsideStitchedImage(_this.overlayBoundary, rotatedAngle, event.clientX, event.clientY);
            }
            if (isPannedOnDynamicAnnotation) {
                _this.resetCursorPosition(false, event.clientX, event.clientY);
            }
            else if (!(outsideResponseArea || inGreyArea || !insideStitchedGap) &&
                ((!annotationHelper.isDynamicAnnotationElement(annotationElement) && !_this.dynamicAnnotationisMoving)
                    || annotationHelper.isPreviousAnnotation(annotationElement))) {
                _this.resetCursorPosition(false, event.clientX, event.clientY);
            }
            else {
                _this.resetCursorPosition(true, event.clientX, event.clientY);
                if (stamp !== undefined) {
                    markingActionCreator.onAnnotationDraw(false);
                }
            }
            if (toolbarStore.instance.selectedStampId <= 0) {
                markingActionCreator.onAnnotationDraw(true);
            }
        };
        /* mouse down event for annotation overlay */
        this.onMouseDown = function (event) {
            _this.doEnableDocumentSelection(false);
        };
        /**
         * This method will get fired when the mouse releases
         * @param event
         */
        this.onMouseUp = function (event) {
            if (!_this.isDrawMode) {
                _this.isAnnotationinGreyArea = annotationHelper.checkMouseDrawingOutsideResponseArea(event, 'stamp', _this.annotationOverlayElement, _this.props.displayAngle, toolbarStore.instance.panStampId > 0 ?
                    toolbarStore.instance.panStampId : toolbarStore.instance.selectedStampId, true);
                _this.isStamping = true;
            }
            _this.doEnableDocumentSelection(true);
        };
        /*
        * Handles pan start event.
        * @param event
        */
        this.onDrawStart = function (event) {
            if (!_this.isDynamicAnnotationDrawInProgress) {
                _this.isDynamicAnnotationDrawInProgress = true;
                _this.isDrawEnd = false;
                _this.isStamping = false;
                _this.isAnnotationinGreyArea = false;
                _this.drawSequence = _this.drawSequence + 1;
                _this._clientToken = undefined;
                var stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
                var overlayElement = htmlUtilities.getElementFromPosition(event.changedPointers[0].clientX, event.changedPointers[0].clientY);
                if (overlayElement) {
                    var annotationHolder = htmlUtilities.findAncestor(overlayElement, 'annotation-holder');
                    if (annotationHolder) {
                        _this.currentOverlayId = annotationHolder.id;
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
                        _this.initCoordinates.x = event.changedPointers[0].clientX;
                        _this.initCoordinates.y = event.changedPointers[0].clientY;
                        // While starting drawing HorizontalLine or HWavyLine prevent from drawing at the
                        // edges of the response. Because it adds a value of 20px at the end od saving annotation.
                        // This will result to display the annoation on another zone.
                        if (_this.props.imageZones && _this.props.imageZones.length > 0
                            && (stamp.stampId === enums.DynamicAnnotation.HorizontalLine
                                || stamp.stampId === enums.DynamicAnnotation.HWavyLine)) {
                            var rotatedAngle = _this.props.displayAngle;
                            rotatedAngle = annotationHelper.getAngleforRotation(rotatedAngle);
                            // Map the element rect to get the left and top to calculate stitched gap area.
                            var elemRect = _this.getDrawingElementRect(_this.initCoordinates.x, _this.initCoordinates.y, 0, 0, rotatedAngle);
                            var annotationOverlayRect = overlayElement.getBoundingClientRect();
                            // Setting this variable to block the drawing and delete the annotation if it covers through the stitched image gap.
                            _this.annotationNotOverlappingStitchedGap = annotationHelper.validateAnnotaionBoundaryOnStitchedImageGap(elemRect, annotationOverlayRect, _this.overlayBoundary, rotatedAngle, _this.getBoundaryThreshold(_this.overlayBoundary, rotatedAngle));
                        }
                        if (_this.annotationNotOverlappingStitchedGap &&
                            !toolbarStore.instance.isBookMarkSelected &&
                            !toolbarStore.instance.isBookmarkTextboxOpen) {
                            _this.addOrUpdateAnnotation(event.changedPointers[0].clientX, event.changedPointers[0].clientY, enums.AddAnnotationAction.Pan, toolbarStore.instance.selectedStampId);
                        }
                        _this.isDrawMode = true;
                    }
                    markingActionCreator.onAnnotationDraw(true);
                    _this.scrollTop = _this.marksheetContainerProperties.scrollTop;
                }
            }
        };
        /**
         * This method will get fired when the mouse moves over the annotation area
         */
        this.onDrawMove = function (evt) {
            _this.isDrawEnd = false;
            _this.isStamping = false;
            var rotatedAngle = _this.props.displayAngle;
            rotatedAngle = annotationHelper.getAngleforRotation(rotatedAngle);
            if (rotatedAngle === enums.RotateAngle.Rotate_270) {
                _this.isDrawLeft = evt.deltaY < 0 ? true : false;
            }
            else if (rotatedAngle === enums.RotateAngle.Rotate_90) {
                _this.isDrawLeft = evt.deltaX < 0 ? true : false;
            }
            else if (rotatedAngle === enums.RotateAngle.Rotate_180) {
                _this.isDrawLeft = evt.deltaX < 0 || evt.deltaY < 0 ? true : false;
            }
            if (rotatedAngle === enums.RotateAngle.Rotate_270) {
                _this.drawDirection = evt.deltaY < 0 ? enums.DrawDirection.Right : enums.DrawDirection.Left;
            }
            else if (rotatedAngle === enums.RotateAngle.Rotate_90) {
                _this.drawDirection = evt.deltaX < 0 ? enums.DrawDirection.Left : enums.DrawDirection.Right;
            }
            else if (rotatedAngle === enums.RotateAngle.Rotate_180) {
                if (evt.deltaX < 0 && evt.deltaY < 0) {
                    _this.drawDirection = enums.DrawDirection.Top;
                }
                else if (evt.deltaX < 0 && evt.deltaY > 0) {
                    _this.drawDirection = enums.DrawDirection.Left;
                }
                else if (evt.deltaX > 0 && evt.deltaY < 0) {
                    _this.drawDirection = enums.DrawDirection.Right;
                }
                else if (evt.deltaX > 0 && evt.deltaY > 0) {
                    _this.drawDirection = enums.DrawDirection.Bottom;
                }
            }
            // rerender the annotation overlay when the draw direction is changed.
            if (_this.previousDrawDirection !== _this.drawDirection) {
                _this.previousDrawDirection = _this.drawDirection;
                _this.setState({
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
            }
            else {
                if (_this.isDrawMode && annotationHelper.isDynamicStampType(stamp.stampType)) {
                    _this.drawSequence = _this.drawSequence + 1;
                    var drawAnnotation = false;
                    var element = _this.annotationOverlayElement;
                    _this.annotationOverlayElementClientRect = element.getBoundingClientRect();
                    var event = evt.changedPointers[0];
                    var outsideResponseArea = false;
                    var inGreyArea = false;
                    outsideResponseArea = annotationHelper.checkMouseDrawingOutsideResponseArea(evt, '', _this.annotationOverlayElement, _this.props.displayAngle);
                    // Recalcuating the overlay boundary before drawing to ensure this has been updated to handle
                    // when the response screen has been scrolled and boundary has been updated.
                    _this.overlayBoundary = annotationHelper.getStitchedImageBoundary(element.parentElement, rotatedAngle);
                    if (_this.props.id.indexOf('annotationOverlaystitched') === 0) {
                        inGreyArea = annotationHelper.checkInGreyArea(event.clientX, event.clientY, rotatedAngle, _this.isDrawLeft, _this.annotationOverlayElement, _this.marksheetContainerProperties, 0, false, stamp.stampId, _this.overlayBoundary);
                    }
                    markingActionCreator.onAnnotationDraw(!(outsideResponseArea || inGreyArea));
                    var left = (event.clientX - _this.annotationOverlayElementClientRect.left);
                    var top = (event.clientY - _this.annotationOverlayElementClientRect.top);
                    left = event.clientX > _this.initCoordinates.x ? _this.initCoordinates.x : event.clientX;
                    var width = Math.abs(evt.deltaX);
                    var height = Math.abs(evt.deltaY);
                    // Update the scroll value for drawing annotion while scrolling.
                    var scrollVal = _this.updateScroll(evt, height, top);
                    _this.finalHeight = scrollVal.height;
                    _this.finalTop = scrollVal.top;
                    var elementclientRect = {
                        left: left,
                        top: _this.finalTop,
                        width: width,
                        height: _this.finalHeight,
                        right: 0,
                        bottom: 0
                    };
                    var enableDraw = true;
                    var isValid = true;
                    var clientRectInsideAnnotationHolder = true;
                    // Resetting always to ensure that it keeps default value on each drag.
                    // this.annotationNotOverlappingStitchedGap = true;
                    if (_this.props.imageZones && _this.props.imageZones.length > 0) {
                        var rotatedClientRect = void 0;
                        var holderWidth = void 0, holderHeight = void 0;
                        var annotationHolderRect = _this.annotationOverlayElementClientRect;
                        if (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90
                            || rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270) {
                            holderWidth = annotationHolderRect.height;
                            holderHeight = annotationHolderRect.width;
                        }
                        else {
                            holderWidth = annotationHolderRect.width;
                            holderHeight = annotationHolderRect.height;
                        }
                        rotatedClientRect = annotationHelper.getRotatedClientRect(elementclientRect, element, _this.marksheetContainerProperties, stamp.stampId, rotatedAngle);
                        if (rotatedClientRect.top + rotatedClientRect.height >= holderHeight || rotatedClientRect.left <= 0 ||
                            rotatedClientRect.top <= 0) {
                            clientRectInsideAnnotationHolder = false;
                        }
                        enableDraw = !annotationHelper.validateAnnotationBoundary(rotatedClientRect, element, _this.marksheetContainerProperties, 0);
                        // Map the element rect to get the left and top to calculate stitched gap area.
                        var elemRect = _this.getDrawingElementRect(left, _this.finalTop, width, _this.finalHeight, rotatedAngle);
                        //While starting drawing HorizontalLine or HWavyLine prevent from drawing at the
                        // edges of the response. Because it adds a value of 20px at the end od saving annotation.
                        // This will result to display the annoation on another zone.
                        var boundaryThreshold = (stamp.stampId === enums.DynamicAnnotation.HorizontalLine ||
                            stamp.stampId === enums.DynamicAnnotation.HWavyLine) ?
                            _this.getBoundaryThreshold(_this.overlayBoundary, rotatedAngle) : 0;
                        // calculating rotated annotation rect for validating.
                        var annotationBoundaryCoordinates = annotationHelper.getAnnotationRectOnDrawing(elemRect, _this.annotationOverlayElementClientRect, rotatedAngle);
                        // Setting this variable to block the drawing and delete the annotation if it covers through the stitched image gap.
                        _this.annotationNotOverlappingStitchedGap = annotationHelper.validateAnnotaionBoundaryOnStitchedImageGap(annotationBoundaryCoordinates, _this.annotationOverlayElementClientRect, _this.overlayBoundary, rotatedAngle, boundaryThreshold, enums.AddAnnotationAction.Pan);
                    }
                    if (annotationHelper.checkEventFiring() &&
                        enableDraw &&
                        clientRectInsideAnnotationHolder && _this.annotationNotOverlappingStitchedGap) {
                        // Validating whether it overlaps while drawing. This will ensure on stitched image
                        // this will not allow the user to draw Hline/HWline on the edge of the preceding images after
                        // stitched image gap.
                        var validateOnMove = (toolbarStore.instance.selectedStampId === enums.DynamicAnnotation.HorizontalLine ||
                            toolbarStore.instance.selectedStampId === enums.DynamicAnnotation.HWavyLine);
                        _this.addOrUpdateAnnotation(left, scrollVal.top, enums.AddAnnotationAction.Pan, toolbarStore.instance.selectedStampId, _this._clientToken, width, scrollVal.height, false, false);
                    }
                    else {
                        _this.resetCursorPosition(true);
                    }
                }
                else {
                    _this.resetCursorPosition(true);
                }
            }
        };
        /*
        * Handle scroll while drawing Highlighter.
        * @param event
        * @param height
        * @param top
        */
        this.updateScroll = function (event, height, top) {
            var marksheetElement = _this.marksheetContainerProperties;
            var marksheetElementRect = marksheetElement.getBoundingClientRect();
            /** Scroll update value on each move/resize*/
            var scrollVal = 0, scrollAdjustDevices = 0;
            /** Additional buffer for scroll only in devices*/
            if (htmlUtilities.isTabletOrMobileDevice) {
                scrollAdjustDevices = 100;
            }
            else {
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
            var scrollPosition = (marksheetElement.scrollTop - _this.scrollTop) > 0;
            /** Absolute value of scroll difference*/
            scrollVal = Math.abs(marksheetElement.scrollTop - _this.scrollTop);
            top = event.center.y > _this.initCoordinates.y ? _this.initCoordinates.y : event.center.y;
            if (!scrollPosition) {
                /* To determine if there is a scroll difference between initial click and move */
                if (_this.scrollTop !== marksheetElement.scrollTop) {
                    if ((_this.initCoordinates.y + scrollVal) < event.center.y) {
                        top = _this.initCoordinates.y + scrollVal;
                        height = event.deltaY - scrollVal;
                    }
                    else {
                        height = Math.abs(event.deltaY - scrollVal);
                        top = event.center.y;
                    }
                }
            }
            else {
                /* To determine if there is a scroll difference between initial click and move */
                if (_this.scrollTop !== marksheetElement.scrollTop) {
                    if ((_this.initCoordinates.y) < event.center.y + scrollVal) {
                        height = event.deltaY + scrollVal;
                        top = Math.round(_this.initCoordinates.y - scrollVal);
                    }
                    else {
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
        this.onDrawEnd = function (event) {
            _this.isDrawEnd = true;
            var stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
            if (stamp.stampId === enums.DynamicAnnotation.OnPageComment) {
                // this will hide the comment box
                stampActionCreator.showOrHideComment(false);
            }
            if (_this.isDrawMode && _this.currentAnnotationElement && stamp !== undefined
                && annotationHelper.isDynamicStampType(stamp.stampType)) {
                var rotatedAngle = annotationHelper.getAngleforRotation(_this.props.displayAngle);
                var element = _this.annotationOverlayElement;
                var drawnInGrayArea = false;
                var annotationCurrentClientRect = _this.currentAnnotationElement.getBoundingClientRect();
                var _a = annotationHelper.getAnnotationDefaultValue(stamp.stampId, undefined, undefined, null, rotatedAngle), defaultWidth = _a[0], defaultHeight = _a[1];
                var width = annotationCurrentClientRect.width < defaultWidth ?
                    defaultWidth : annotationCurrentClientRect.width;
                var height = annotationCurrentClientRect.height < defaultHeight ?
                    defaultHeight : annotationCurrentClientRect.height;
                if (annotationCurrentClientRect.width < defaultWidth && annotationCurrentClientRect.height < defaultHeight) {
                    _b = annotationHelper.getAnnotationDefaultValue(stamp.stampId, undefined, undefined, element, rotatedAngle, true), width = _b[0], height = _b[1];
                }
                else {
                    if (annotationCurrentClientRect.width < defaultWidth) {
                        _c = annotationHelper.getAnnotationDefaultValue(stamp.stampId, undefined, undefined, element, rotatedAngle, true), width = _c[0], height = _c[1];
                        height = annotationCurrentClientRect.height;
                    }
                    if (annotationCurrentClientRect.height < defaultHeight) {
                        _d = annotationHelper.getAnnotationDefaultValue(stamp.stampId, undefined, undefined, element, rotatedAngle, true), width = _d[0], height = _d[1];
                        width = annotationCurrentClientRect.width;
                    }
                }
                if (_this.props.id.indexOf('annotationOverlaystitched') === 0 && annotationHelper.isDynamicStampType(stamp.stampType)
                    && (annotationCurrentClientRect.width < width || annotationCurrentClientRect.height < height)) {
                    if (annotationHelper.checkInGreyArea(annotationCurrentClientRect.left, annotationCurrentClientRect.top, rotatedAngle, _this.isDrawLeft, _this.annotationOverlayElement, _this.marksheetContainerProperties, 0, true, stamp.stampId, _this.overlayBoundary)) {
                        _this.resetCursorPosition(true);
                        _this.removeAnnotation(_this._clientToken);
                    }
                }
                var annotationClientRect = {
                    left: annotationCurrentClientRect.left,
                    top: annotationCurrentClientRect.top,
                    width: width,
                    height: height,
                    right: 0,
                    bottom: 0
                };
                var clientRectInsideAnnotationHolder = true;
                var rotatedClientRect = void 0;
                var holderWidth = void 0, holderHeight = void 0;
                _this.annotationOverlayElementClientRect = _this.annotationOverlayElement.getBoundingClientRect();
                var annotationHolderRect = _this.annotationOverlayElementClientRect;
                if (rotatedAngle === enums.RotateAngle.Rotate_90
                    || rotatedAngle === enums.RotateAngle.Rotate_270) {
                    holderWidth = annotationHolderRect.height;
                    holderHeight = annotationHolderRect.width;
                }
                else {
                    holderWidth = annotationHolderRect.width;
                    holderHeight = annotationHolderRect.height;
                }
                rotatedClientRect = annotationHelper.getRotatedClientRect(annotationClientRect, _this.annotationOverlayElement, _this.marksheetContainerProperties, stamp.stampId, rotatedAngle, enums.AddAction.DrawEnd);
                if (rotatedClientRect.top + rotatedClientRect.height >= holderHeight || rotatedClientRect.left <= 0 ||
                    rotatedClientRect.top <= 0 || rotatedClientRect.left + rotatedClientRect.width >= holderWidth) {
                    clientRectInsideAnnotationHolder = false;
                }
                if (_this.props.imageZones && _this.props.imageZones.length > 0) {
                    drawnInGrayArea = annotationHelper.validateAnnotationBoundary(rotatedClientRect, element, _this.marksheetContainerProperties, rotatedAngle);
                }
                // fix for 38709 and 36504
                annotationClientRect = _this.getTopAndLeftAdjustmentBasedOnRotatedAngle(rotatedAngle, stamp.stampId, annotationClientRect);
                if (annotationHelper.checkEventFiring()) {
                    _this.addOrUpdateAnnotation(annotationClientRect.left, annotationClientRect.top, enums.AddAnnotationAction.Pan, toolbarStore.instance.selectedStampId, _this._clientToken, width, height, false, false);
                    //check whether newly created annotation has gone outside. If so remove it.
                    if (annotationHelper.checkMouseDrawingOutsideResponseArea(event, '', _this.annotationOverlayElement, _this.props.displayAngle, stamp.stampId)
                        || _this.isOutside || drawnInGrayArea || !clientRectInsideAnnotationHolder ||
                        !_this.annotationNotOverlappingStitchedGap) {
                        _this.resetCursorPosition(true);
                        _this.removeAnnotation(_this._clientToken);
                    }
                    var defaultWidth_1 = 0, defaultHeight_1 = 0, annotationWidthInPercent = 0, annotationHeightInPercent = 0;
                    _e = annotationHelper.getAnnotationDimensionsInPercent(stamp.stampId, width, height, _this.annotationOverlayElementClientRect, _this.props.currentImageMaxWidth, _this.props.currentOutputImageHeight, rotatedAngle), defaultWidth_1 = _e[0], defaultHeight_1 = _e[1], annotationWidthInPercent = _e[2], annotationHeightInPercent = _e[3];
                    if (_this.props.id.indexOf('annotationOverlaystitched') === 0 && annotationHelper.isDynamicStampType(stamp.stampType)
                        && (defaultWidth_1 === annotationWidthInPercent || defaultHeight_1 === annotationHeightInPercent)) {
                        if (annotationHelper.checkInGreyArea(annotationClientRect.left, annotationClientRect.top, rotatedAngle, _this.isDrawLeft, _this.annotationOverlayElement, _this.marksheetContainerProperties, 0, true, stamp.stampId, _this.overlayBoundary)) {
                            _this.resetCursorPosition(true);
                            _this.removeAnnotation(_this._clientToken);
                        }
                    }
                }
                // Check highlighter is in next response while drawing.
                var overlayId = htmlUtilities.getElementFromPosition(event.changedPointers[0].clientX, event.changedPointers[0].clientY);
                overlayId = htmlUtilities.findAncestor(overlayId, 'annotation-holder');
                if (overlayId !== null && overlayId !== undefined && _this.currentOverlayId !== overlayId.id) {
                    _this.resetCursorPosition(true);
                    _this.removeAnnotation(_this._clientToken);
                }
                // Refreshing the old move values
                _this.annotationNotOverlappingStitchedGap = true;
            }
            markingActionCreator.onAnnotationDraw(true);
            _this.initCoordinates.x = 0;
            _this.initCoordinates.y = 0;
            _this.isDrawMode = false;
            _this.drawSequence = 0;
            // this.isDynamicAnnotationBorderShowing = false;
            _this.isDynamicAnnotationDrawInProgress = false;
            var _b, _c, _d, _e;
        };
        /**
        * Get the Annotation Overlay Element
        */
        this.getAnnotationOverlayElement = function () {
            var element = ReactDom.findDOMNode(_this);
            if (element) {
                element = element.firstElementChild;
            }
            return element;
        };
        /*
         * Handles pan end event
         */
        this.onPanEndListener = function (elementId, xPos, yPos, panSource, stampId, draggedAnnotationClientToken, isAnnotationOverlapped, isAnnotationPlacedInGreyArea) {
            // Checking if the pan end happened on top of a previous annotation, if so the
            // current annotation shouldn't be blocked from getting panned
            var annotationOverlayId = _this.getAnnotationOverlayId();
            var element = htmlUtilities.getElementFromPosition(xPos, yPos);
            if (annotationHelper.isPreviousAnnotation(element)) {
                while (element.id !== _this.getAnnotationOverlayId()
                    && element.parentElement != null
                    && element.parentElement !== undefined) {
                    element = element.parentElement;
                }
            }
            if (annotationOverlayId === elementId || annotationOverlayId === element.id) {
                var stamp = stampStore.instance.getStamp(stampId);
                switch (panSource) {
                    case enums.PanSource.StampPanel:
                        if (!_this.isDrawMode) {
                            if (annotationHelper.isDynamicStampType(stamp.stampType)) {
                                var event_1 = {
                                    'clientX': xPos,
                                    'clientY': yPos
                                };
                                var isAnnotationinGreyArea = annotationHelper.checkMouseDrawingOutsideResponseArea(event_1, 'stamp', _this.annotationOverlayElement, _this.props.displayAngle, stampId) ?
                                    true : false;
                                if (!isAnnotationinGreyArea) {
                                    _this.addOrUpdateAnnotation(xPos, yPos, enums.AddAnnotationAction.Stamping, stampId);
                                }
                            }
                            else {
                                _this.addOrUpdateAnnotation(xPos, yPos, enums.AddAnnotationAction.Stamping, stampId);
                            }
                        }
                        break;
                    case enums.PanSource.AnnotationOverlay:
                        if ((isAnnotationPlacedInGreyArea && _this.props.id.indexOf('annotationOverlaystitched') === 0) ||
                            isAnnotationOverlapped) {
                            _this.forceAnnotationOverlayToReRender();
                            return;
                        }
                        _this.addOrUpdateAnnotation(xPos, yPos, enums.AddAnnotationAction.Pan, stampId, draggedAnnotationClientToken);
                        break;
                }
            }
            else {
                _this.forceAnnotationOverlayToReRender();
            }
            // reset the data holded for pan event
            _this.clearPanData();
        };
        /**
         * This method will get fired when the mouse leaves the annotation area
         */
        this.onMouseLeave = function (event) {
            var element = event.toElement || event.relatedTarget;
            var selectedStamp = toolbarStore.instance.selectedStampId;
            if (element.classList && !annotationHelper.isAcetate(element)) {
                if (!element.classList.contains('expand-zone')) {
                    if (onPageCommentHelper.isCommentsSideViewEnabled) {
                        _this.resetCursorPosition(true);
                        _this.resetViewWholePageButtonDetails();
                    }
                    else {
                        if (htmlUtilities.findAncestor(element, 'comment-container') === element) {
                            _this.resetCursorPosition(true);
                            _this.resetViewWholePageButtonDetails();
                        }
                    }
                }
            }
            else if (selectedStamp > 0 && annotationHelper.isAcetate(element)) {
                _this.resetCursorPosition(true);
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
        this.addOrUpdateAnnotation = function (clientX, clientY, action, stampId, clientToken, width, height, isDrawEnd, validateDynamicBoundary) {
            if (isDrawEnd === void 0) { isDrawEnd = false; }
            if (validateDynamicBoundary === void 0) { validateDynamicBoundary = true; }
            // Set the clientToken for drawing.
            if (clientToken) {
                _this._clientToken = clientToken;
            }
            var actualX = clientX;
            var actualY = clientY;
            var stamp = stampStore.instance.getStamp(stampId, markingStore.instance.selectedQIGMarkSchemeGroupId);
            var rotatedAngle = _this.props.displayAngle;
            rotatedAngle = annotationHelper.getAngleforRotation(rotatedAngle);
            // Find the dom element 'annotation-holder'
            var element = _this.annotationOverlayElement;
            // Recalcuating the overlay boundary before saving to ensure this has been updated to handle
            // when the response screen has been scrolled and boundary has been updated.
            var annotationOverlayElement = element.parentElement;
            _this.overlayBoundary = annotationHelper.getStitchedImageBoundary(annotationOverlayElement, rotatedAngle);
            //Prevent static annotation over another
            var isAnnotationOverlaps = annotationHelper.isAnnotationPlacedOnTopOfAnother(stamp.stampType, element, clientX, clientY, _this.annotationHolderClass, rotatedAngle, _this.overlayBoundary);
            // On page comment behaves like normal annotation ie. shouldn't overlap with another
            if (!annotationHelper.isDynamicAnnotation(stamp) && isAnnotationOverlaps) {
                _this.forceAnnotationOverlayToReRender();
                return false;
            }
            //To check whether stamping is in grey area
            if (_this.isStitchedImage) {
                if (annotationHelper.checkInGreyArea(clientX, clientY, rotatedAngle, _this.isDrawLeft, element, _this.marksheetContainerProperties, 0, action === enums.AddAnnotationAction.Stamping ? true : false, stamp.stampId, _this.overlayBoundary)) {
                    return false;
                }
                // Modify the clientX and clientY based on the stitched information. This is to allign the annotation
                // to corerct position in WA and AI.
                if (_this.overlayBoundary && _this.overlayBoundary.length > 0) {
                    var seperatorDistance = 0;
                    for (var i = 1; i < _this.overlayBoundary.length; i++) {
                        switch (rotatedAngle) {
                            case enums.RotateAngle.Rotate_0:
                            case enums.RotateAngle.Rotate_360:
                                seperatorDistance += (_this.overlayBoundary[i].start - _this.overlayBoundary[i - 1].end);
                                if (clientY > _this.overlayBoundary[i].start && clientY < _this.overlayBoundary[i].end) {
                                    clientY -= seperatorDistance;
                                }
                                break;
                            case enums.RotateAngle.Rotate_180:
                                seperatorDistance += (_this.overlayBoundary[i - 1].start - _this.overlayBoundary[i].end);
                                if (clientY > _this.overlayBoundary[i].start && clientY < _this.overlayBoundary[i].end) {
                                    clientY += seperatorDistance;
                                }
                                break;
                            case enums.RotateAngle.Rotate_90:
                                seperatorDistance += (_this.overlayBoundary[i - 1].start - _this.overlayBoundary[i].end);
                                if (clientX < _this.overlayBoundary[i].end && clientX > _this.overlayBoundary[i].start) {
                                    clientX += seperatorDistance;
                                }
                                break;
                            case enums.RotateAngle.Rotate_270:
                                seperatorDistance += (_this.overlayBoundary[i - 1].end - _this.overlayBoundary[i].start);
                                if (clientX < _this.overlayBoundary[i].end && clientX > _this.overlayBoundary[i].start) {
                                    clientX += seperatorDistance;
                                }
                                break;
                        }
                    }
                }
            }
            var dynamicAnnotationLeft = 0, dynamicAnnotationWidth = 0;
            var onPageCommentWidth = 0;
            _this.annotationOverlayElementClientRect = element.getBoundingClientRect();
            var left = clientX - _this.annotationOverlayElementClientRect.left;
            var top = clientY - _this.annotationOverlayElementClientRect.top;
            var topAboveCurrentZone = _this.props.topAboveCurrentZone ? _this.props.topAboveCurrentZone : 0;
            // Since we heve the different types of stamps, those have different size, adjust some pixel to maintain the correct position.
            var pixelsToAdjustLeft = 0;
            var pixelsToAdjustTop = 0;
            // To prevent dropping the annotation to grey area
            if (annotationHelper.isDynamicAnnotation(stamp) && _this.isAnnotationinGreyArea) {
                return false;
            }
            if (action === enums.AddAnnotationAction.Stamping) {
                _this.drawDirection = annotationHelper.getDrawDirection(rotatedAngle);
                _this.isDrawLeft = false;
            }
            _a = annotationHelper.getAnnotationDefaultValue(stamp.stampId, width, height, element, rotatedAngle, action === enums.AddAnnotationAction.Stamping ? true : false), width = _a[0], height = _a[1];
            var annotationHolderElement = _this.annotationOverlayElementClientRect;
            var currentElement = {
                width: 0,
                height: 0,
                left: 0,
                top: 0,
                bottom: 0,
                right: 0
            };
            if (_this.currentAnnotationElement && action === enums.AddAnnotationAction.Pan) {
                currentElement = _this.currentAnnotationElement.getBoundingClientRect();
            }
            _b = annotationHelper.getAnnotationCoordinatesOnRotate(annotationHolderElement, currentElement, left, top, rotatedAngle), left = _b[0], top = _b[1];
            // Calculate the left and top position based on the actual width and top
            //left = (left / element.clientHeight) * this.props.currentOutputImageHeight + pixelsToAdjustLeft;
            //top = (top / element.clientWidth) * this.props.currentImageMaxWidth + pixelsToAdjustTop;
            // Calculate annotation coordinates on rotate for ebookmarking components
            if (_this.props.isEBookMarking) {
                // For linked page, we dont have to add zone top to the calculated annotation top.
                // so pass zone top as 0.
                if (_this.props.isALinkedPage) {
                    _c = annotationHelper.getEbookmarkingAnnotationCoordinateOnRotate(left, top, rotatedAngle, _this.props.currentImageMaxWidth, 0, _this.props.currentOutputImageHeight, element), left = _c[0], top = _c[1];
                }
                else {
                    var imageDimension = _this.props.getImageNaturalDimension(_this.props.imageZone.pageNo);
                    _d = annotationHelper.getEbookmarkingAnnotationCoordinateOnRotate(left, top, rotatedAngle, imageDimension.naturalWidth, _this.props.zoneTop, _this.props.currentOutputImageHeight, element), left = _d[0], top = _d[1];
                }
            }
            else {
                // Components other than EBM.
                left = (left / element.clientWidth) * _this.props.currentImageMaxWidth + pixelsToAdjustLeft;
                top = (top / element.clientHeight) * _this.props.currentOutputImageHeight;
            }
            var annotationWidth = (width / element.clientWidth) * _this.props.currentImageMaxWidth;
            var annotationHeight = (height / element.clientHeight) * _this.props.currentOutputImageHeight;
            // If the stamp is text/image, default width and height needs to be set always irrespective of current zoom percentage.
            if (annotationHelper.isImageAnnotation(stamp) || annotationHelper.isTextAnnotation(stamp)) {
                annotationWidth = constants.DEFAULT_STATIC_ANNOTATION_WIDTH;
                annotationHeight = constants.DEFAULT_STATIC_ANNOTATION_HEIGHT;
            }
            // position calculation for OnPageComment
            var commentposwidth = 0;
            var commentposheight = 0;
            var updatedcomment = '';
            if (stamp.stampId === enums.DynamicAnnotation.OnPageComment) {
                var comment = markingStore.instance.getAnnotation(clientToken);
                var pos = null;
                pos = onPageCommentHelper.UpdateOnPageCommentPosition(_this.props.currentOutputImageHeight, _this.props.currentImageMaxWidth, comment ? comment.comment : undefined, top, left);
                // updating the position values after calculation
                commentposwidth = pos.width;
                commentposheight = pos.height;
                // for zones which are splitted and are not linked
                if (_this.props.doApplyLinkingScenarios && !_this.props.isALinkedPage) {
                    if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
                        commentposwidth += topAboveCurrentZone;
                    }
                    else {
                        commentposheight += topAboveCurrentZone;
                    }
                }
                left = pos.left;
                top = pos.top;
                if (comment) {
                    // update the comment text if the comment annotation exists (after typing and saved)
                    updatedcomment = comment.comment;
                    // add the annotation to the list which can be used to calculate the side view
                    onPageCommentHelper.updateSideViewItem(_this._clientToken, updatedcomment);
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
                    var zoneTop = _this.props.isEBookMarking === true &&
                        responseStore.instance.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView ?
                        _this.props.zoneTop : 0;
                    var isFullyInResponseArea = annotationHelper.checkStampingInResponseArea(left, top, annotationWidth, annotationHeight, zoneTop, _this.props.currentImageMaxWidth, _this.props.currentOutputImageHeight, _this.props.displayAngle);
                    if (!isFullyInResponseArea) {
                        return false;
                    }
                }
                var cursorwidth = 0;
                var cursorheight = 0;
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
                if (_this.props.id.indexOf('annotationOverlaystitched') === 0 && _this.isStitchedImage && validateDynamicBoundary) {
                    var annotationOverlayRect = element.getBoundingClientRect();
                    var annotationBoundaryCoordinates = {
                        left: actualX,
                        top: actualY,
                        width: width,
                        height: height,
                        bottom: 0,
                        right: 0
                    };
                    // handling annotation top in Dynamic annotation drawing scenarios
                    if (action === enums.AddAnnotationAction.Pan) {
                        annotationBoundaryCoordinates = annotationHelper.getAnnotationRectOnDrawing(annotationBoundaryCoordinates, annotationOverlayRect, rotatedAngle);
                    }
                    //While placing HorizontalLine or HWavyLine prevent from placing at the
                    // edges of the response. Because it adds a value of 20px at the end of saving annotation.
                    // This will result to display the annoation on another zone.
                    var boundaryThreshold = (stamp.stampId === enums.DynamicAnnotation.HorizontalLine ||
                        stamp.stampId === enums.DynamicAnnotation.HWavyLine ||
                        stamp.stampId === enums.DynamicAnnotation.VWavyLine) ?
                        _this.getBoundaryThreshold(_this.overlayBoundary, rotatedAngle) : 0;
                    // If dynamic annotation is dragged and dropped from the stamp panel should check
                    // whether it overlaps the stitched image gap.
                    _this.annotationNotOverlappingStitchedGap = annotationHelper.validateAnnotaionBoundaryOnStitchedImageGap(annotationBoundaryCoordinates, annotationOverlayRect, _this.overlayBoundary, rotatedAngle, boundaryThreshold, action);
                    if (!_this.annotationNotOverlappingStitchedGap) {
                        return false;
                    }
                }
            }
            var favouriteStampsCollection = stampStore.instance.getFavoriteStamps();
            var isStampFromFavourite = favouriteStampsCollection.filter(function (x) { return x.stampId === stampId; }).count() > 0;
            var isDrawEndOfStampFromStampPanel = _this.isDrawEnd && !isStampFromFavourite;
            var outputPageNo = (_this.props.isALinkedPage && _this.props.isEBookMarking !== true)
                ? 0 : annotationHelper.getOutputPageNo(_this.props.doApplyLinkingScenarios, _this.props.imageZones, _this.props.imageZone, _this.props.outputPageNo);
            var pageNo = (_this.props.isEBookMarking === true) ? _this.props.structerdPageNo :
                (_this.props.isALinkedPage ? _this.props.currentImagePageNo : _this.props.pageNo);
            var imageClusterId = _this.props.imageZone || _this.props.imageZones ?
                markingStore.instance.currentQuestionItemImageClusterId : 0;
            // for zones which are splitted and are not linked
            if (_this.props.doApplyLinkingScenarios && !_this.props.isALinkedPage) {
                top += topAboveCurrentZone;
            }
            if (clientToken !== undefined) {
                markingActionCreator.updateAnnotation(left, top, imageClusterId, outputPageNo, pageNo, clientToken, stamp.stampId === enums.DynamicAnnotation.OnPageComment ? commentposwidth : annotationWidth, stamp.stampId === enums.DynamicAnnotation.OnPageComment ? commentposheight : annotationHeight, stamp.stampId === enums.DynamicAnnotation.OnPageComment ? updatedcomment : '', true, isDrawEndOfStampFromStampPanel, false, stampId);
                // Log the annotation modified actions.
                _this.logger.logAnnotationModifiedAction('DisplayId -' + responseStore.instance.selectedDisplayId + '-' + loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED, 'DisplayId-' + responseStore.instance.selectedDisplayId + '-' + loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED, {
                    'clientToken': clientToken, 'stampId': stampId, 'left': left, 'top': top, 'imageClusterId': imageClusterId,
                    'outputPageNo': outputPageNo, 'pageNo': pageNo, 'isDrawEndOfStampFromStampPanel': isDrawEndOfStampFromStampPanel
                }, markingStore.instance.currentMarkGroupId, markingStore.instance.currentMarkSchemeId);
                /**
                 * Add link annotation if the marker is placing annotation on a page which is linked by previous marker.
                 * Link annotation should be inserted only for static annotations while updating.
                 * Dynamic movement is handled in dynamic stamp base
                 */
                if (!annotationHelper.isDynamicAnnotation(stamp)) {
                    _this.addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo);
                }
            }
            else {
                var newlyAddedAnnotation = annotationHelper.
                    getAnnotationToAdd(stampId, pageNo, imageClusterId, outputPageNo, left, top, action, stamp.stampId === enums.DynamicAnnotation.OnPageComment ? commentposwidth : annotationWidth, stamp.stampId === enums.DynamicAnnotation.OnPageComment ? commentposheight : annotationHeight, markingStore.instance.currentQuestionItemInfo.uniqueId, rotatedAngle, stamp.numericValue);
                if (newlyAddedAnnotation) {
                    var stampName = enums.DynamicAnnotation[stamp.stampId];
                    var cssProps = colouredAnnotationsHelper.
                        createAnnotationStyle(newlyAddedAnnotation, enums.DynamicAnnotation[stampName]);
                    var rgba = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
                    newlyAddedAnnotation.red = parseInt(rgba[0]);
                    newlyAddedAnnotation.green = parseInt(rgba[1]);
                    newlyAddedAnnotation.blue = parseInt(rgba[2]);
                    //Set the client token for drawing
                    _this._clientToken = newlyAddedAnnotation.clientToken;
                    _this.currentAnnoationId = newlyAddedAnnotation.annotationId;
                    var isOnPageComment = annotationHelper.isOnPageComment(stampId);
                    if (!isStampFromFavourite && isOnPageComment) {
                        _this.isOnPageCommentAdded = true;
                    }
                    // mark by annotation cc check
                    if (responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus)) {
                        // The isDirty flag for the annotation will be set while updating the mark entry in the markingstore
                        newlyAddedAnnotation.isDirty = false;
                        markingActionCreator.addMarkByAnnotationAction(newlyAddedAnnotation, action, _this.props.id);
                    }
                    else {
                        markingActionCreator.addNewlyAddedAnnotation(newlyAddedAnnotation, action, _this.props.id);
                    }
                    // Log the annotation modified actions.
                    _this.logger.logAnnotationModifiedAction('DisplayId-' + responseStore.instance.selectedDisplayId + '-' + loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED, loggerConstants.MARKENTRY_REASON_ANNOTATION_ADD, newlyAddedAnnotation, markingStore.instance.currentMarkGroupId, markingStore.instance.currentMarkSchemeId);
                }
                // Add link annotation if the marker is placing annotation on a page which is linked by previous marker.
                _this.addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo);
            }
            return true;
            var _a, _b, _c, _d;
        };
        /**
         * do stamps annotation when valid mark is applied aganist question.
         * @param newAnnotation
         * @param annotationAction
         */
        this.stampAnnotation = function (newAnnotation, annotationAction, overlayId) {
            if (_this.props.id === overlayId) {
                markingActionCreator.addNewlyAddedAnnotation(newAnnotation, annotationAction, overlayId);
            }
        };
        /**
         * On mouse right click on response image prevent default browser context menu
         * @param event
         */
        this.onResponseImageContextHandler = function (event) {
            event.preventDefault();
        };
        /**
         * Called when annotation is started dragging inside a response container
         * @param stampId
         * @param clientToken
         * @param event
         */
        this.onAnnotationPanStart = function (stampId, clientToken, event) {
            event.preventDefault();
            _this.enableImageContainerScroll(false);
            // Setting the stamp Id currently under PAN operation
            _this.pannedStampId = stampId;
            toolbarActionCreator.PanStamp(stampId, clientToken);
        };
        /**
         * Called when annotation is dragged inside a response container
         * @param event
         */
        this.onAnnotationPanMove = function (event) {
            event.preventDefault();
            _this.isDrawMode = false;
            var isResponseModeClosed = annotationHelper.isResponseReadOnly();
            if (!isResponseModeClosed) {
                event.srcEvent.preventDefault();
                var actualX = event.changedPointers[0].clientX;
                var actualY = event.changedPointers[0].clientY;
                // Getting the element at the current cursor position
                var element = htmlUtilities.getElementFromPosition(actualX, actualY);
                var isPannedOnDynamicAnnotation = annotationHelper.isDynamicAnnotationElement(element);
                var isPannedOnAcetate = !isPannedOnDynamicAnnotation ? annotationHelper.isAcetate(element) : false;
                var isAnnotationOverlaps = false;
                var isMouseOutsideGreyArea = true;
                // If an element exists and if an annotation is paned
                if (element != null && element !== undefined && _this.pannedStampId > 0) {
                    if (element.id.indexOf('annotationoverlay') >= 0) {
                        var elementClientRect = element.getBoundingClientRect();
                        // If the stamp is on the annotation overlay, check two things:
                        // (i)  If the annotation overlaps another
                        // (ii) If the mouse cursor is currently inside an image zone or not
                        var left = actualX - elementClientRect.left;
                        var top = actualY - elementClientRect.top;
                        var selectedStamp = _this.pannedStamp;
                        var rotatedAngle = annotationHelper.getAngleforRotation(Number(element.getAttribute('data-rotatedangle')));
                        _this.overlayBoundary = annotationHelper.getStitchedImageBoundary(element.parentElement, rotatedAngle);
                        // While dragging If the annotation boundary in the cursor is overlapping with another display strike through cursor
                        isAnnotationOverlaps = annotationHelper.isAnnotationPlacedOnTopOfAnother(selectedStamp.stampType, element, actualX, actualY, _this.annotationHolderClass, rotatedAngle, _this.overlayBoundary);
                        // If the mouse position is currently outside the grey area
                        isMouseOutsideGreyArea = annotationHelper.checkMouseOutsideGreyArea(element.nextSibling, left, top, 0, 0, _this.props.displayAngle);
                        var inGreyArea = false;
                        if (_this.isStitchedImage) {
                            var insideStitchedGap = annotationHelper.isAnnotationInsideStitchedImage(_this.overlayBoundary, rotatedAngle, actualX, actualY);
                            inGreyArea = annotationHelper.checkInGreyArea(actualX, actualY, rotatedAngle, _this.isDrawLeft, element, _this.marksheetContainerProperties, 0, true, null, _this.overlayBoundary);
                            // If gray area inside single output page the show the icon.
                            if (!insideStitchedGap) {
                                _this.resetCursorPosition(true, actualX, actualY);
                                _this.triggerDelete(true, actualX, actualY);
                                _this.triggerSideViewEvent(element, event, _this.clientToken, actualX, actualY, elementClientRect, true);
                                return;
                            }
                        }
                        _this.triggerSideViewEvent(element, event, _this.clientToken, actualX, actualY, elementClientRect, (isAnnotationOverlaps || inGreyArea));
                        markingActionCreator.onAnnotationDraw(!(isAnnotationOverlaps || inGreyArea));
                        if (isAnnotationOverlaps || inGreyArea || htmlUtilities.isTabletOrMobileDevice) {
                            _this.resetCursorPosition((isAnnotationOverlaps || inGreyArea), actualX, actualY);
                        }
                        if (_this.deleteAnnotationOnDrop) {
                            _this.triggerDelete(false, actualX, actualY);
                        }
                    }
                    else if (element.id.indexOf('onscriptannotation') >= 0 || annotationHelper.isDynamicAnnotationElement(element)
                        || annotationHelper.isAcetate(element)) {
                        var _isPrevAnnotation = annotationHelper.isPreviousAnnotation(element);
                        var _isReset = (!_isPrevAnnotation && !isPannedOnDynamicAnnotation && !isPannedOnAcetate);
                        // if hovering over a dynamic annotation taking the parent elemen to get annotationholder
                        // if hovered over an acetate , find parent element with overlay-holder
                        var _element = (isPannedOnDynamicAnnotation || _isPrevAnnotation) ?
                            htmlUtilities.findAncestor(element, 'annotation-holder') :
                            (isPannedOnAcetate ? htmlUtilities.findAncestor(element, 'overlay-holder') : element);
                        // CLinet rect not needed if the cusror is resetting ( to hide the line while cursor is hidden/nodrop/bin)
                        var _elementRect = (_isReset === true || _element === undefined) ? undefined : _element.getBoundingClientRect();
                        _this.resetCursorPosition(_isReset, actualX, actualY);
                        _this.triggerSideViewEvent(_element, event, _this.clientToken, actualX, actualY, _elementRect, _isReset);
                        _this.triggerDelete(false, actualX, actualY);
                    }
                    else {
                        _this.resetCursorPosition(!annotationHelper.isPreviousAnnotation(element), actualX, actualY);
                        _this.triggerSideViewEvent(element, event, _this.clientToken, actualX, actualY, elementClientRect, true);
                        _this.triggerDelete(true, actualX, actualY);
                    }
                }
                else {
                    _this.resetCursorPosition(true, actualX, actualY);
                    _this.triggerSideViewEvent(element, event, _this.clientToken, actualX, actualY, elementClientRect, true);
                    _this.triggerDelete(true, actualX, actualY);
                }
            }
        };
        /**
         * Called when annotation is dropped
         * @param annotationClientToken
         * @param stampId
         * @param event
         * @param boundX
         * @param boundY
         */
        this.onAnnotationPanEnd = function (annotationClientToken, stampId, event, boundX, boundY) {
            event.preventDefault();
            var actualX = event.changedPointers[0].clientX;
            var actualY = event.changedPointers[0].clientY;
            var isAnnotationOverlaps = false;
            var inGreyArea = false;
            var element = htmlUtilities.getElementFromPosition(actualX, actualY);
            var isPannedOnDynamicAnnotation = annotationHelper.isDynamicAnnotationElement(element);
            var isPannedOnAcetate = annotationHelper.isAcetate(element);
            _this.lineYPos = 0;
            _this.lineXPos = 0;
            // find the annotation holder of the current element
            if (isPannedOnDynamicAnnotation || isPannedOnAcetate) {
                element = annotationHelper.findAnnotationHolderOfAnElement(element);
            }
            var angleOfRotation = element ? Number(element.getAttribute('data-rotatedangle')) : _this.props.displayAngle;
            var rotatedAngle = annotationHelper.getAngleforRotation(angleOfRotation);
            var selectedStamp = stampStore.instance.getStamp(toolbarStore.instance.panStampId);
            // If an element exists and if an annotation is paned
            if (element != null && element !== undefined && toolbarStore.instance.panStampId > 0) {
                if (selectedStamp !== undefined && !annotationHelper.isDynamicAnnotation(selectedStamp)) {
                    isAnnotationOverlaps = annotationHelper.isAnnotationPlacedOnTopOfAnother(selectedStamp.stampType, element, actualX, actualY, _this.annotationHolderClass, rotatedAngle, _this.overlayBoundary);
                }
            }
            if (_this.isStitchedImage && element != null && element !== undefined) {
                inGreyArea = annotationHelper.checkInGreyArea(actualX, actualY, rotatedAngle, rotatedAngle === enums.RotateAngle.Rotate_180 || rotatedAngle === enums.RotateAngle.Rotate_270 ? true : _this.isDrawLeft, element, _this.marksheetContainerProperties, 0, true, 0, _this.overlayBoundary);
            }
            markingActionCreator.panEndAction(stampId, actualX, actualY, element == null ? '' : element.id, enums.PanSource.AnnotationOverlay, isAnnotationOverlaps, inGreyArea);
            toolbarActionCreator.PanStampToDeleteArea(false, actualX, actualY);
            markingActionCreator.onAnnotationDraw(true);
            if (onPageCommentHelper.isCommentsSideViewEnabled && stampId === enums.DynamicAnnotation.OnPageComment) {
                onPageCommentHelper.commentMoveInSideView = true;
                if (_this.clientToken !== stampStore.instance.SelectedSideViewCommentToken) {
                    stampActionCreator.showOrHideComment(false);
                }
            }
            if (_this.deleteAnnotationOnDrop) {
                _this.deleteAnnotationOnDrop = false;
                _this.removeAnnotation(annotationClientToken);
                _this.doEnableClickHandler(true);
            }
            else {
                _this.doEnableClickHandler(false);
            }
        };
        /**
         * Rerender component forcefully
         */
        this.forceAnnotationOverlayToReRender = function () {
            _this.forceAnnotationRerender = true;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * set current annotation element
         */
        this.setCurrentAnnotationElement = function (element) {
            _this.currentAnnotationElement = element;
        };
        /**
         * set dynamicAnnotationisMoving value from dynamicstampbase
         */
        this.setDynamicAnnotationisMoving = function (value) {
            _this.dynamicAnnotationisMoving = value;
            _this.isDynamicAnnotationPanCompleted = value;
            if (_this.isStamping) {
                _this.isStamping = false;
            }
        };
        /**
         * set setDynamicAnnotationBorder value from dynamicstampbase
         */
        this.setDynamicAnnotationBorder = function (value) {
            _this.isDynamicAnnotationBorderShowing = value;
        };
        /**
         * update the stroke-width on window resize
         */
        this.updateStrokeWidthOnWindowResize = function () {
            _this.updateStrokeWidth(constants.MARKSHEETS_ANIMATION_TIMEOUT);
        };
        /**
         * update the stroke-width on FitHeight/width or Rotate
         */
        this.updateStrokeWidthOnZoom = function () {
            _this.updateStrokeWidth();
        };
        /**
         * update the stroke-width relative to the annotation-holder width
         */
        this.updateStrokeWidth = function (animationDelay) {
            if (animationDelay === void 0) { animationDelay = 0; }
            var overlayElement = _this.annotationOverlayElement;
            var that = _this;
            setTimeout(function () {
                that.hlineStrokeWidth = annotationHelper.getStrokeWidth(overlayElement, that.props.displayAngle);
                if (_this.doAddStrokeWidthStyle) {
                    that.forceAnnotationOverlayToReRender();
                }
            }, animationDelay);
        };
        /* Handler for pinch start event */
        this.onPinchStart = function (event) {
            _this.isPinching = true;
        };
        /* Handler for pinch end event */
        this.onPinchEnd = function (event) {
            _this.isPinching = false;
        };
        /**
         * This method will call when a stamp selected in fav/ main toolbar
         * @private
         * @memberof AnnotationOverlay
         */
        this.onStampSelectedInToolbar = function () {
            // Fix for issue: If we select an existing highlighter on the script,
            // resize it and then click on an annotation type (e.g. tick) in the toolbar, the highlighter becomes un-selected as expected.
            // However, if We then try to stamp a tick on top of the highlighter it doesn’t work on first tap; you have to tap again to place it.
            if (!_this.isDynamicAnnotationPanCompleted) {
                _this.isDynamicAnnotationPanCompleted = true;
            }
        };
        /**
         * This method will call on remove annotation
         * @private
         * @memberof AnnotationOverlay
         */
        this.onRemoveAnnotation = function () {
            // In devices if we delete an annotation by dragging to outside then we need to reset isDynamicAnnotationBorderShowing flag.
            // otherwise we can't place to new annotation because of this.
            if (deviceHelper.isTouchDevice && _this.isDynamicAnnotationBorderShowing) {
                _this.isDynamicAnnotationBorderShowing = false;
            }
        };
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
            annotationHelper.getAnnotationsForThePageInEBookMarking(this.props.pageNo, this.props.currentImageMaxWidth, this.props.currentOutputImageHeight, this.props.isALinkedPage, responseHelper.isEResponse)
            : annotationHelper.getAnnotationsForThePageInStructuredResponse(this.props.pageNo, this.props.currentImageMaxWidth, this.props.currentOutputImageHeight, this.props.isAdditionalObject, this.props.isALinkedPage));
        this.forceAnnotationOverlayToReRender = this.forceAnnotationOverlayToReRender.bind(this);
    }
    /**
     * This method will hook the touch events
     */
    AnnotationOverlay.prototype.setUpEvents = function () {
        var element = this.annotationOverlayElement;
        if (element
            && !this.eventHandler.isInitialized
            && !exceptionStore.instance.isExceptionPanelVisible
            && !this.props.isReadOnly) {
            var touchActionValue = deviceHelper.isTouchDevice() ? 'auto' : 'none';
            var threshold = constants.PAN_THRESHOLD;
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
            }
            else {
                /* Implemented as part of defect fix #54482 */
                this.eventHandler.get(eventTypes.PRESS, { time: constants.PRESS_TIME_DELAY });
                this.eventHandler.on(eventTypes.PRESS_UP, this.onTapHandler);
            }
        }
    };
    /**
     * unregister events
     */
    AnnotationOverlay.prototype.unRegisterEvents = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    Object.defineProperty(AnnotationOverlay.prototype, "isClickHandlerEnabled", {
        /* return true if click handler is enabled */
        get: function () {
            return this.doEnableClick &&
                !(
                // if zoom option is opened or if exception panel is opened, then no need to add new annotation while click on overlay
                exceptionStore.instance.isExceptionPanelVisible
                    || messageStore.instance.isMessagePanelVisible
                    || this.getUIDropDownVisibility
                    || responseStore.instance.selectedResponseMode === enums.ResponseMode.closed
                    || markerOperationModeFactory.operationMode.isTeamManagementMode);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnnotationOverlay.prototype, "isPanEnabledForDynamicAnnotation", {
        /* checks if the pan action for dynamic annotation can be preformed */
        get: function () {
            return this.selectedStamp && annotationHelper.isDynamicAnnotation(this.selectedStamp) &&
                !toolbarStore.instance.isBookMarkSelected &&
                !toolbarStore.instance.isBookmarkTextboxOpen &&
                !markingStore.instance.contextMenuDisplayStatus &&
                this.pannedStampId === 0 && (htmlUtilities.isTabletOrMobileDevice ? this.doEnableDynamicAnnotationDraw : true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnnotationOverlay.prototype, "isPanEnabledForStaticAnnotation", {
        /* checks if the pan action for static annotation can be preformed */
        get: function () {
            return this.isActiveAnnotation && this.pannedStamp && this.pannedStampId > 0 &&
                !annotationHelper.isDynamicAnnotation(this.pannedStamp);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnnotationOverlay.prototype, "isPanEnabled", {
        /* checks if pan action can be preformed or not */
        get: function () {
            return !annotationHelper.isResponseReadOnly() && this.doEnablePan
                && !this.isZoomOptionOpen && !responseStore.instance.isPinchZooming
                && !this.isMarkByOptionOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnnotationOverlay.prototype, "isZoomOptionOpen", {
        /* set if the zoom option is open or closed */
        get: function () {
            return responseStore.instance.isZoomOptionOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnnotationOverlay.prototype, "isMarkByOptionOpen", {
        /* set if the mark by option is open or closed */
        get: function () {
            return responseStore.instance.isMarkByOptionOpen;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get annotation overlay width
     */
    AnnotationOverlay.prototype.getAnnotationOverlayWidth = function () {
        var element = this.annotationOverlayElement;
        // Get parent element i.e. annotation overlay right edge boundary
        if (element !== undefined) {
            return this.annotationOverlayElementClientRect.right;
        }
        return 0;
    };
    Object.defineProperty(AnnotationOverlay.prototype, "getUIDropDownVisibility", {
        /*
         * sets when dropdowns visible in the screen.
         */
        get: function () {
            return (userInfoStore.instance.isUserInfoPanelOpen
                || this.isZoomOptionOpen
                || this.isMarkByOptionOpen
                || markingStore.instance.isMarkSchemeHeaderDropDownOpen
                || exceptionStore.instance.isExceptionSidePanelOpen
                || messageStore.instance.isMessageSidePanelOpen
                || toolbarStore.instance.isBookMarkPanelOpen
                || toolbarStore.instance.isBookmarkTextboxOpen);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Show or hide remove context menu
     * @param isVisible
     * @param currentlySelectedAnnotationToken
     * @param clientX
     * @param clientY
     * @param annotationOverlayWidth
     */
    AnnotationOverlay.prototype.showOrHideRemoveContextMenu = function (isVisible, currentlySelectedAnnotationToken, clientX, clientY, annotationOverlayWidth, annotationData) {
        var isActive = annotationData ?
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
            var annotationContextMenuData = annotationHelper.getContextMenuData(currentlySelectedAnnotationToken, annotationOverlayWidth, annotationData);
            // show context menu only if the annotation is for current marking
            if (!annotationData.isPrevious) {
                markingActionCreator.showOrHideRemoveContextMenu(isVisible, clientX, clientY, annotationContextMenuData);
            }
        }
    };
    AnnotationOverlay.prototype.componentDidUpdate = function () {
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
            var overlayDetail = {
                outputPageNo: this.props.outputPageNo ? this.props.outputPageNo : 0,
                pageNo: (this.props.isEBookMarking === true) ? this.props.structerdPageNo : (this.props.pageNo ? this.props.pageNo : 0),
                imageClusterId: this.props.imageClusterId ? this.props.imageClusterId : 0,
                width: this.props.currentImageMaxWidth,
                height: this.props.currentOutputImageHeight,
                structeredPageNo: this.props.structerdPageNo ? this.props.structerdPageNo : this.props.pageNo,
                overlayElement: this.annotationOverlayElement
            };
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
    };
    AnnotationOverlay.prototype.componentWillUpdate = function () {
        // we need to calculate the zindex here as the image width and height will get be changing in case of linking
        annotationHelper.setZIndexForStaticAnnotations(this.props.currentImageMaxWidth, this.props.currentOutputImageHeight);
        // added as part of Defect #30180.
        // defect was due to zero stroke width.
        if (this.hlineStrokeWidth === constants.ZERO_STROKE_WIDTH) {
            this.hlineStrokeWidth = annotationHelper.getStrokeWidth(this.annotationOverlayElement, this.props.displayAngle);
        }
    };
    AnnotationOverlay.prototype.componentDidMount = function () {
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
            var overlayDetail = {
                outputPageNo: this.props.outputPageNo ? this.props.outputPageNo : 0,
                pageNo: (this.props.isEBookMarking === true) ? this.props.structerdPageNo : (this.props.pageNo ? this.props.pageNo : 0),
                imageClusterId: this.props.imageClusterId ? this.props.imageClusterId : 0,
                width: this.props.currentImageMaxWidth,
                height: this.props.currentOutputImageHeight,
                structeredPageNo: this.props.structerdPageNo,
                overlayElement: this.annotationOverlayElement
            };
            onPageCommentHelper.addOutputPageAttributesForSideView(overlayDetail, this.props.isEBookMarking);
            this.annotationOverlayElementClientRect = this.annotationOverlayElement.getBoundingClientRect();
            // if (this.props.id.indexOf('annotationOverlaystitched') === 0) {
            // Calculating the image boundary. This will re-calculate on browser resize automatically.
            this.overlayBoundary = annotationHelper.getStitchedImageBoundary(this.annotationOverlayElement.parentElement, this.props.displayAngle);
        }
        /* Please do not add any store event listeners here. Please add that in ImageContainer and pass as props to avoid possible
        EventEmitter memory leak node.js warning because this component will repeat based on no of pages */
        this.setUpEvents();
        window.addEventListener('resize', this.updateStrokeWidthOnWindowResize);
        this.hlineStrokeWidth = annotationHelper.getStrokeWidth(this.annotationOverlayElement, this.props.displayAngle);
        if (this.props.isReadOnly) {
            this.forceAnnotationOverlayToReRender();
        }
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT, this.updateStrokeWidthOnWindowResize);
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
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_COMPLETED, this.updateStrokeWidthOnZoom);
    };
    AnnotationOverlay.prototype.componentWillUnmount = function () {
        this.isComponentMounted = false;
        /* Please do not add any store event listeners here. Please add that in ImageContainer and pass as props to avoid possible
        EventEmitter memory leak node.js warning because this component will repeat based on no of pages */
        this.unRegisterEvents();
        window.removeEventListener('resize', this.updateStrokeWidthOnWindowResize);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT, this.updateStrokeWidthOnWindowResize);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_END, this.onPanEndListener);
        markingStore.instance.removeListener(markingStore.MarkingStore.VALID_ANNOTATION_MARK, this.stampAnnotation);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.questionItemChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.annotationUpdated);
        stampStore.instance.removeListener(stampStore.StampStore.UPDATE_COMMENT_LIST_IN_SIDE_VIEW_EVENT, this.forceAnnotationOverlayToReRender);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.updateStrokeWidthOnZoom);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelectedInToolbar);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.onRemoveAnnotation);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_COMPLETED, this.updateStrokeWidthOnZoom);
    };
    AnnotationOverlay.prototype.componentWillReceiveProps = function (nextProps) {
        // if events are not hooked then hook touch events - sometimes in ComponentDidMount elements is not
        // getting to hook the events in this scenario we have to hook that again - seems it like a bug
        // related to React - needs to investiagate further
        // this will hook touch events if it's not hooked yet
        this.setUpEvents();
    };
    /**
     * Render method of the DisplayAnnotations
     * Get the Annotations based on the zone and check the annotaion should be displayed for the current page based on the height.
     */
    AnnotationOverlay.prototype.render = function () {
        var _this = this;
        // If data not exists wait for the data.
        if (!this.isMarksAndAnnotationsLoaded) {
            // Check data is exists or not
            this.isMarksAndAnnotationsLoaded = markingStore.instance.isMarksLoaded(markingStore.instance.currentMarkGroupId);
            var isQuestionUnselected = markingStore.instance.currentQuestionItemInfo === undefined &&
                responseStore.instance.selectedResponseViewMode === enums.ResponseViewMode.zoneView;
            // If mark are not loaded or Selection is not fired return the component
            if (isQuestionUnselected) {
                return null;
            }
        }
        // If Annotations displaying Unstructed/ structredZoned view get it from collection other wise get it from calculated collection
        if (this.props.imageClusterId > 0
            || (this.props.isEBookMarking === true && responseStore.instance.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView)
            || (!this.props.isEBookMarking === true && responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured)
            || responseHelper.isAtypicalResponse()
            || (this.props.isALinkedPage === true && this.props.imageClusterId === 0 && !this.props.isReadOnly)) {
            this.getAnnotationsToDisplayInCurrentPage();
        }
        else if (responseStore.instance.selectedResponseViewMode === enums.ResponseViewMode.fullResponseView) {
            this.annotationsToDisplayInCurrentPage = this.annotationsToDisplay = this.retrieveAnnotationsToDisplayInCurrentPage();
        }
        else {
            this.annotationsToDisplayInCurrentPage = this.annotationsToDisplay;
        }
        var uniqueId = markingStore.instance.currentQuestionItemInfo ? markingStore.instance.currentQuestionItemInfo.uniqueId : 0;
        var toRender = null;
        var responseMode = markingStore.instance.currentResponseMode;
        var isActive = true, isFade = false;
        var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        if (this.annotationsToDisplayInCurrentPage && this.annotationsToDisplayInCurrentPage.count() > 0) {
            // current marks
            var isAnnotationPartOfVisibleMarkGroup_1 = marksAndAnnotationsVisibilityHelper.isAnnotationVisible(markingStore.instance.currentMarkGroupId, marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId);
            var isVisible_1 = isAnnotationPartOfVisibleMarkGroup_1;
            var angle_1 = annotationHelper.getAngleforRotation(this.props.displayAngle);
            var annotationOverlayParentElement_1 = this.annotationOverlayElement ?
                this.annotationOverlayElement.parentElement : undefined;
            this.overlayBoundary = annotationHelper.getStitchedImageBoundary(annotationOverlayParentElement_1, angle_1);
            var maxZIndex_1 = annotationHelper.maxZIndex();
            toRender = this.annotationsToDisplayInCurrentPage.map(function (annotation, index) {
                if (annotation.isPrevious) {
                    isVisible_1 = marksAndAnnotationsVisibilityHelper.isAnnotationVisible(markingStore.instance.currentMarkGroupId, marksAndAnnotationVisibilityDetails, responseStore.instance.isWholeResponse ?
                        annotation.markGroupIdofWholeResponse : annotation.markGroupId);
                }
                else {
                    isVisible_1 = isAnnotationPartOfVisibleMarkGroup_1;
                }
                if (_this.props.isReadOnly) {
                    // isReadOnly will be set to true only for FR view (fullresponseimageviewer.tsx)
                    isVisible_1 = true;
                }
                var uniqueAnnotationId = _this.props.pageNo + '-' + _this.props.outputPageNo + '-' + index;
                var stamp = stampStore.instance.getStamp(annotation.stamp);
                var zoneTop = _this.props.isReadOnly ? 0 : _this.props.zoneTop;
                var zoneLeft = _this.props.isReadOnly ? 0 : _this.props.zoneLeft;
                var zoneHeight = _this.props.isReadOnly ? 0 : _this.props.zoneHeight;
                var topAboveCurrentZone = _this.props.topAboveCurrentZone ? _this.props.topAboveCurrentZone : 0;
                // Set the style in % to support resize.
                // For Supporting Web Assessor, recalculate the left/ top position.Annottaion size is 32 in WA
                var annotationWrapStyle = _this.getAnnotationWrapStyle(annotation, stamp);
                var annotationTop = 0;
                // If on page comment treat it as static annotation.
                if (stamp.stampId === enums.DynamicAnnotation.OnPageComment && annotation.width) {
                    // As we have to place the annotation in anchor position, we need to take the width and height
                    // to calculate the position. If dragging the annotation will result the widht and height to NaN
                    annotationTop = (Math.abs(annotation.height - topAboveCurrentZone - _this.annotationSizeFraction) / _this.props.currentOutputImageHeight) * 100;
                }
                else {
                    annotationTop = ((annotation.topEdge - topAboveCurrentZone - ((stamp.stampType === enums.StampType.text) ? _this.textAnnotationHeightAdjustment : _this.annotationSizeFraction)) / _this.props.currentOutputImageHeight) * 100;
                }
                var stitchedImageAttribute = _this.props.currentOutputImageHeight;
                if ((_this.overlayBoundary && _this.overlayBoundary.length > 0) && annotationOverlayParentElement_1) {
                    var totalImageHeight = 0, stitchedImageIndex = 0;
                    for (var i = 0; i < _this.overlayBoundary.length;) {
                        totalImageHeight += _this.overlayBoundary[i].imageHeight;
                        var currentPagePercentage = (totalImageHeight / _this.annotationOverlayElement.clientHeight) * 100;
                        if (annotationTop < currentPagePercentage) {
                            i = _this.overlayBoundary.length;
                        }
                        else {
                            i++;
                            stitchedImageIndex++;
                        }
                    }
                    var stitchedImageSeperator = annotationHelper.calculateStitchedImageGapOffset(angle_1, stitchedImageIndex, _this.overlayBoundary, annotationOverlayParentElement_1);
                    // When saving annotations of stitched image we are removing the stitched gap. But
                    // while displaying in A3 we need to add the gap again.
                    annotationWrapStyle.top = (annotationTop + stitchedImageSeperator) + '%';
                }
                if (annotationHelper.isDynamicAnnotation(stamp)) {
                    annotationWrapStyle.zIndex = annotation.isPrevious ? annotation.zOrder :
                        (Math.round((_this.props.currentImageMaxWidth * _this.props.currentOutputImageHeight) -
                            (annotation.width * annotation.height)));
                }
                else {
                    // Fix for defect 58048 and 58438. Increased in z-index for onpage comments. To select the comments from previous marks
                    if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                        annotationWrapStyle.zIndex = annotation.isPrevious ? maxZIndex_1 : maxZIndex_1 + 1;
                    }
                    else {
                        annotationWrapStyle.zIndex = annotation.isPrevious ? annotation.zOrder : maxZIndex_1;
                    }
                }
                // Make dynamic annotation Active/Fade according to closed/FRV.
                if (annotationHelper.isDynamicStampType(stamp.stampType)) {
                    if (_this.props.isReadOnly) {
                        isActive = false;
                        isFade = false;
                    }
                    else if (responseMode === enums.ResponseMode.closed || !_this.props.isResponseEditable) {
                        isActive = false;
                        isFade = annotation.markSchemeId === uniqueId ? false : true;
                    }
                    else {
                        isActive = annotation.markSchemeId === uniqueId ? true : false;
                        isFade = annotation.markSchemeId === uniqueId ? false : true;
                    }
                }
                // We need to check whether a stamp is visible or not, based on this we will hide or show the stamps
                // in annotation overlay.If pan is started then we will hide the stamp and on pan end we will show that again
                if (_this.pannedStampId === stamp.stampId &&
                    annotation.clientToken === _this.clientToken) {
                    isVisible_1 = false;
                    if (!_this.refreshCommentContainer && stamp.stampId === enums.DynamicAnnotation.OnPageComment) {
                        _this.refreshCommentContainer = true;
                    }
                }
                var isResponseModeClosed = annotationHelper.isResponseReadOnly();
                var annotationToolTip = _this.getToolTip(stamp.stampId, annotation.markSchemeId);
                if (stamp != null && stamp !== undefined) {
                    switch (stamp.stampType) {
                        case enums.StampType.image:
                            return (React.createElement(ImageStamp, {id: stamp.name + '-icon', uniqueId: stamp.stampId + '-' + uniqueAnnotationId + '-onscriptannotation', toolTip: annotationToolTip, wrapperStyle: annotationWrapStyle, isDisplayingInScript: true, isActive: annotation.markSchemeId === uniqueId, key: stamp.name + annotation.clientToken + '-icon', stampData: stamp, clientToken: annotation.clientToken, selectedLanguage: _this.props.selectedLanguage, forceRerender: _this.forceAnnotationRerender, annotationData: annotation, isInFullResponseView: _this.props.isReadOnly === true ? _this.props.isReadOnly : false, isVisible: isVisible_1, isResponseEditable: _this.props.isResponseEditable}));
                        case enums.StampType.text:
                            return (React.createElement(TextStamp, {id: stamp.name + '-icon', uniqueId: stamp.stampId + '-' + uniqueAnnotationId + '-onscriptannotation', toolTip: annotationToolTip, wrapperStyle: annotationWrapStyle, isDisplayingInScript: true, isActive: annotation.markSchemeId === uniqueId, key: stamp.name + annotation.clientToken + '-icon', stampData: stamp, clientToken: annotation.clientToken, selectedLanguage: _this.props.selectedLanguage, forceRerender: _this.forceAnnotationRerender, annotationData: annotation, isInFullResponseView: _this.props.isReadOnly === true ? _this.props.isReadOnly : false, isVisible: isVisible_1, isResponseEditable: _this.props.isResponseEditable}));
                        case enums.StampType.dynamic:
                            // If on page comment treat it as static annotation.
                            if (stamp.stampId === enums.DynamicAnnotation.OnPageComment) {
                                // add the annotation to the list which can be used to calculate the side view
                                // zoneLeft and skippedZoneLeft for the scenarios of linked page
                                var zoneLeft_1 = _this.props.zoneLeft ? _this.props.zoneLeft : 0;
                                if (annotation.skippedZoneLeft !== undefined) {
                                    zoneLeft_1 = annotation.skippedZoneLeft;
                                }
                                var annotationLeftPx = (annotation.width - _this.annotationSizeFraction + zoneLeft_1) / _this.props.currentImageMaxWidth;
                                if (annotation.markingOperation !== enums.MarkingOperation.deleted) {
                                    var commentItem = {
                                        clientToken: annotation.clientToken,
                                        imageClusterId: responseHelper.isAtypicalResponse() ? 0 : annotation.imageClusterId,
                                        outputPageNo: _this.props.outputPageNo ? _this.props.outputPageNo : 0,
                                        pageNo: (_this.props.isEBookMarking === true) ? _this.props.structerdPageNo : (_this.props.pageNo ? _this.props.pageNo : 0),
                                        annotationTopPx: parseFloat(annotationWrapStyle.top) / 100,
                                        annotationHeight: _this.annotationSize,
                                        annotationWidth: _this.annotationSize,
                                        responseWidth: _this.props.currentImageMaxWidth,
                                        annotationLeftPx: annotationLeftPx,
                                        comment: annotation.comment,
                                        markSchemeId: annotation.markSchemeId,
                                        annotation: annotation,
                                        isVisible: isVisible_1,
                                        isDefinitive: annotation.definitiveMark
                                    };
                                    var isRenderCommet = false;
                                    if (_this.isStitchedImage &&
                                        onPageCommentHelper.isCommentsSideViewEnabled &&
                                        !markingStore.instance.isRotating) {
                                        var comment = onPageCommentHelper.getCommentSideViewItem(annotation.clientToken);
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
                                return (React.createElement(ImageStamp, {id: stamp.name + '-icon', uniqueId: stamp.stampId + '-' + uniqueAnnotationId + '-onscriptannotation', toolTip: annotationToolTip, wrapperStyle: annotationWrapStyle, isDisplayingInScript: true, isActive: annotation.markSchemeId === uniqueId, key: stamp.name + annotation.clientToken + '-icon', stampData: stamp, clientToken: annotation.clientToken, selectedLanguage: _this.props.selectedLanguage, forceRerender: _this.forceAnnotationRerender, annotationData: annotation, isInFullResponseView: _this.props.isReadOnly === true ? _this.props.isReadOnly : false, isVisible: isVisible_1, isResponseEditable: _this.props.isResponseEditable}));
                            }
                            return (React.createElement(DynamicStampFactory, {id: stamp.name + '-icon', key: stamp.name + annotation.clientToken + '-icon', toolTip: annotationToolTip, selectedLanguage: _this.props.selectedLanguage, imageWidth: _this.props.currentImageMaxWidth, imageHeight: _this.props.currentOutputImageHeight, annotationData: annotation, stampData: stamp, clientToken: annotation.clientToken, getImageContainerRect: _this.props.getImageContainerRect ? _this.props.getImageContainerRect : null, getAnnotationOverlayElement: _this.getAnnotationOverlayElement, getMarkSheetContainerProperties: _this.props.getMarkSheetContainerProperties, imageZones: _this.getImageZones(), isActive: isActive, isFade: isFade, isDrawMode: _this.isDrawMode, setCurrentAnnotationElement: _this.setCurrentAnnotationElement, imageClusterId: _this.props.imageClusterId, outputPageNo: _this.props.outputPageNo, pageNo: _this.props.pageNo, setDynamicAnnotationisMoving: _this.setDynamicAnnotationisMoving, setDynamicAnnotationBorder: _this.setDynamicAnnotationBorder, displayAngle: _this.props.displayAngle, drawDirection: _this.drawDirection, isDrawEnd: _this.isDrawEnd, isStamping: _this.isStamping, isVisible: isVisible_1, isResponseEditable: _this.props.isResponseEditable, isInFullResponseView: _this.props.isReadOnly === true ? _this.props.isReadOnly : false, enableAnnotationOverlayPan: _this.enableAnnotationOverlayPan, enableImageContainerScroll: _this.enableImageContainerScroll, overlayBoundary: _this.overlayBoundary, doEnableClickHandler: _this.doEnableClickHandler, zoneHeight: zoneHeight, zoneTop: zoneTop, zoneLeft: zoneLeft, topAboveCurrentZone: topAboveCurrentZone, doApplyLinkingScenarios: _this.props.doApplyLinkingScenarios, isInLinkedPage: _this.props.isALinkedPage, imageZone: _this.props.imageZone, currentImagePageNo: _this.props.currentImagePageNo, pagesLinkedByPreviousMarkers: _this.props.pagesLinkedByPreviousMarkers, isAnnotationAdded: annotation.clientToken === _this.addedAnnotationClientToken, isEBookMarking: _this.props.isEBookMarking}));
                    }
                }
                return null;
            });
        }
        this.forceAnnotationRerender = false;
        var svgHeight = Number(this.hlineStrokeWidth) + constants.SVG_HEIGHT - 1;
        if (svgHeight <= constants.SVG_HEIGHT) {
            svgHeight = constants.SVG_HEIGHT + 1;
        }
        var paddingTop;
        if (this.props.isReadOnly) {
            paddingTop = this.props.currentOutputImageHeight / (this.props.currentImageMaxWidth);
        }
        var styleAnnotationHolder = {
            paddingTop: 'calc(' + paddingTop * 100 + '% -  30px )'
        };
        var rotatedAngle = this.props.displayAngle;
        rotatedAngle = annotationHelper.getAngleforRotation(rotatedAngle);
        //Render annotations to the holder.
        return (React.createElement("div", {className: "annotation-overlay", ref: function (reference) {
            _this.overlayElement = reference;
        }, id: 'Overlay_' + this.getAnnotationOverlayId()}, React.createElement("div", {className: this.annotationHolderClass, id: this.getAnnotationOverlayId(), onClick: !this.props.isReadOnly ? this.onClickHandler : null, onMouseMove: !this.props.isReadOnly ? this.onMouseMove : null, onMouseLeave: !this.props.isReadOnly ? this.onMouseLeave : null, onContextMenu: !this.props.isReadOnly ? this.onResponseImageContextHandler : null, onMouseUp: !this.props.isReadOnly ? this.onMouseUp : null, onMouseDown: !this.props.isReadOnly ? this.onMouseDown : null, onMouseOver: this.mouseOverHandler, "data-rotatedangle": rotatedAngle, "data-imagewidth": this.props.currentImageMaxWidth, "data-imageheight": this.props.currentOutputImageHeight, style: styleAnnotationHolder, "data-pageno": this.props.pageNo, "data-topabovecurrentzone": this.props.topAboveCurrentZone, "data-isalinkedpage": this.props.isALinkedPage ? this.props.isALinkedPage : false, "data-zonetop": this.props.zoneTop, "data-currentimagepageno": this.props.currentImagePageNo}, React.createElement("style", null, " ", this.annotationOverlayStrokeWidth + '#' +
            this.getAnnotationOverlayId() + ' .line.annotation-wrap:not(.wavy) svg{height:' + svgHeight + 'px;}' +
            '#' + this.getAnnotationOverlayId() + ' .annotation-wrap.static' + '{width: ' + this.annotationSize + '%}'), React.createElement(DynamicMovingElement, {annotationOverlayId: this.getAnnotationOverlayId()}), toRender), this.props.isEBookMarking === true && this.props.isReadOnly ?
            this.setUnknownContentHighlighter(this.props.pageNo, this.props.currentImageMaxWidth, this.props.currentOutputImageHeight) : null, this.renderAcetates()));
    };
    /**
     * Retrieve the set of annotations to display in Current Page.
     */
    AnnotationOverlay.prototype.retrieveAnnotationsToDisplayInCurrentPage = function () {
        if (this.props.isEBookMarking) {
            return annotationHelper.getAnnotationsForThePageInEBookMarking(this.props.pageNo, this.props.currentImageMaxWidth, this.props.currentOutputImageHeight, this.props.isALinkedPage, responseHelper.isEResponse);
        }
        else {
            return annotationHelper.getAnnotationsForThePageInStructuredResponse(this.props.pageNo, this.props.currentImageMaxWidth, this.props.currentOutputImageHeight, this.props.isAdditionalObject, this.props.isALinkedPage);
        }
    };
    /**
     * resets the view whole page button details.
     */
    AnnotationOverlay.prototype.resetViewWholePageButtonDetails = function () {
        if (this.isCursorOverAnnotationOverlay) {
            this.previouslySelectedZone = undefined;
            this.isCursorOverAnnotationOverlay = false;
            // action to set view whole page button inVisible.
            responseActionCreator.viewWholePageLinkAction(false, this.props.imageZone);
        }
    };
    /*
     * Handles the click event for the annotation handler.
     */
    AnnotationOverlay.prototype.onClickHandler = function (event) {
        // close the context menu if anything is open while clicking in the annotation overlay
        markingActionCreator.showOrHideRemoveContextMenu(false);
        var stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
        var isSelectedStampDynamicAnnotation = annotationHelper.isDynamicAnnotation(stamp);
        var isCommentBoxOpen = stampStore.instance.SelectedOnPageCommentClientToken !== undefined ||
            stampStore.instance.SelectedSideViewCommentToken !== undefined;
        // fix for #68482 - event.button will be 1 for mouse middle button 
        // and we dont need to place annotation for middle button click
        if (this.pannedStampId === 0 && this.isClickHandlerEnabled && event.button !== 1) {
            var clickedElement = htmlUtilities.getElementFromPosition(event.clientX, event.clientY);
            // Element will be null in MAC Safari, if over the stamp panel using trackpad
            if (clickedElement === null) {
                return;
            }
            var isPannedOnDynamicAnnotation = annotationHelper.isDynamicAnnotationElement(clickedElement);
            var isPreviousAnnotation = annotationHelper.isPreviousAnnotation(clickedElement);
            var annotationElement = htmlUtilities.findAncestor(clickedElement, 'annotation-wrap');
            var isActiveAnnotation = true;
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
                    && !toolbarStore.instance.isBookmarkTextboxOpen) {
                    if (stamp.stampId === enums.DynamicAnnotation.OnPageComment) {
                        // closing exiting comment box instead of adding annotation (if it is open)
                        if (isCommentBoxOpen && !onPageCommentHelper.commentMoveInSideView) {
                            stampActionCreator.showOrHideComment(false);
                            markingActionCreator.setMarkEntrySelected();
                            return;
                        }
                    }
                    this.addOrUpdateAnnotation(event.clientX, event.clientY, enums.AddAnnotationAction.Stamping, toolbarStore.instance.selectedStampId);
                    // Defect 21590: On page comment and similar static Annotations seems to overlap with
                    // mouse cursor SVG while stamping- IE only - noticeable on higher zoom level only
                    responseActionCreator.setMousePosition(-1, -1);
                }
            }
            else {
                if (this.isStamping && !this.isDynamicAnnotationBorderShowing && !htmlUtilities.isIE && !htmlUtilities.isEdge) {
                    markingActionCreator.showOrHideRemoveContextMenu(false);
                    var stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
                    if (annotationHelper.checkEventFiring() && isSelectedStampDynamicAnnotation &&
                        !toolbarStore.instance.isBookMarkSelected && !toolbarStore.instance.isBookmarkTextboxOpen &&
                        !annotationHelper.checkMouseDrawingOutsideResponseArea(event, 'stamp', this.annotationOverlayElement, this.props.displayAngle, stamp.stampId, true)) {
                        // Preventing stamping annotaion when the user supposed to resize/move existing dynamic
                        // annotation.
                        if (annotationHelper.isLineAnnotation(stamp.stampId) && htmlUtilities.isTabletOrMobileDevice) {
                            var isLineAnnotationsOverlapping = annotationHelper.isLineAnnotationsOverlapping(event.clientX, event.clientY, this.props.displayAngle, stamp.stampId);
                            if (isLineAnnotationsOverlapping) {
                                return;
                            }
                        }
                        this.addOrUpdateAnnotation(event.clientX, event.clientY, enums.AddAnnotationAction.Stamping, toolbarStore.instance.selectedStampId);
                    }
                }
            }
        }
        else {
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
    };
    /**
     * enables or disable document selection
     * @param doSelect
     */
    AnnotationOverlay.prototype.doEnableDocumentSelection = function (doSelect) {
        document.onselectstart = function () {
            return doSelect;
        };
    };
    /**
     * return top and left adjustment based on rotated angle
     * @param rotatedAngle
     * @param stampId
     * @param annotationClientRect
     */
    AnnotationOverlay.prototype.getTopAndLeftAdjustmentBasedOnRotatedAngle = function (rotatedAngle, stampId, annotationClientRect) {
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
    };
    /**
     * Get the Annotation Overlay Id
     */
    AnnotationOverlay.prototype.getAnnotationOverlayId = function () {
        var pageNo = this.props.pageNo ? this.props.pageNo : 0;
        var imageClusterId = this.props.imageClusterId ? this.props.imageClusterId : 0;
        var outputPageNo = this.props.outputPageNo ? this.props.outputPageNo : 0;
        var pageNoWhenLinkingScenariosAreEnabled = 0;
        var outputPageNoWhenLinkingScenariosAreEnabled = 0;
        var id = 'annotationoverlay';
        if (this.props.doApplyLinkingScenarios === true) {
            pageNoWhenLinkingScenariosAreEnabled = this.props.isALinkedPage ? this.props.currentImagePageNo : this.props.pageNo;
            outputPageNoWhenLinkingScenariosAreEnabled = this.props.isALinkedPage ? 0 : annotationHelper.getOutputPageNo(this.props.doApplyLinkingScenarios, this.props.imageZones, this.props.imageZone, this.props.outputPageNo);
            id += '_' + pageNoWhenLinkingScenariosAreEnabled.toString()
                + '_' + imageClusterId.toString()
                + '_' + outputPageNoWhenLinkingScenariosAreEnabled.toString()
                + '_' + pageNo.toString()
                + '_' + outputPageNo.toString();
        }
        else {
            id += '_' + pageNo.toString()
                + '_' + imageClusterId.toString()
                + '_' + outputPageNo.toString();
        }
        return id;
    };
    /*
     * Check whether the annotation action is valid and action is allowed.
     */
    AnnotationOverlay.prototype.isAnnotationInCorrectPosition = function (left, top, element, selectedStamp, clientX, clientY) {
        // Block the stamping if no stamps are selected or it is in boundary.
        if (selectedStamp === undefined || !annotationHelper.checkMouseInCorrectPosition(element.nextSibling, left, top, 0, 0, this.props.pageNo, this.props.displayAngle)) {
            return false;
        }
        // Get the width of the cursor based on the image width (4 percentage if image - 4 px)
        var cursorWidth = element.clientWidth * (4 / 100) - 4;
        // If the stamp is text type height is 67 % of the width.
        var cursorHeight = cursorWidth * ((selectedStamp.stampType === enums.StampType.text ? 67 : 100) / 100);
        // Check the annotation is overlaps with another, If so block the stamping.
        if (annotationHelper.isAnnotationPlacedOnTopOfAnother(selectedStamp.stampType, element, clientX, clientY, this.annotationHolderClass)) {
            return false;
        }
        return true;
    };
    /*
     * Returns a stampid according to the action.
     */
    AnnotationOverlay.prototype.getStampIdToAdd = function (action) {
        switch (action) {
            case enums.AddAnnotationAction.Stamping:
                return toolbarStore.instance.selectedStampId;
            case enums.AddAnnotationAction.Pan:
                return toolbarStore.instance.panStampId;
            default:
                return 0;
        }
    };
    /**
     * Method which resets the correct cursor position
     * @param resetCursor
     * @param xPos
     * @param yPos
     */
    AnnotationOverlay.prototype.resetCursorPosition = function (resetCursor, xPos, yPos) {
        responseActionCreator.setMousePosition(resetCursor ? -1 : xPos, resetCursor ? -1 : yPos);
    };
    /**
     * This will trigger delete when annotations are dragged out of response
     * @param canDelete
     * @param xPos
     * @param yPos
     */
    AnnotationOverlay.prototype.triggerDelete = function (canDelete, xPos, yPos) {
        this.deleteAnnotationOnDrop = canDelete;
        toolbarActionCreator.PanStampToDeleteArea(canDelete, xPos, yPos);
    };
    /**
     * Remove annotation
     * @param annotationClientToken
     */
    AnnotationOverlay.prototype.removeAnnotation = function (annotationClientToken) {
        var annotationClientTokenToBeDeleted = [];
        annotationClientTokenToBeDeleted.push(annotationClientToken);
        markingActionCreator.removeAnnotation(annotationClientTokenToBeDeleted);
    };
    Object.defineProperty(AnnotationOverlay.prototype, "isStitchedImage", {
        // Gets or sets a value indicating whether current annotation holder
        // contains any stitched images.
        get: function () {
            return this.overlayBoundary.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnnotationOverlay.prototype, "annotationSize", {
        /**
         * Returning annotation size according to the page size and current scale factor.
         * @returns
         */
        get: function () {
            // Dynamically calculating the annotation size factor based on the natural image width and
            // selected max width. Incase of stitched image, the natural image width will be the one
            // which is selected for max width. This will give a proper value for determine the size of the annotation
            // based on image zoom/streach size
            return (this.props.currentImageNaturalWidth / this.props.currentImageMaxWidth) * 4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnnotationOverlay.prototype, "annotationSizeFraction", {
        /**
        * Returning annotation size according to the page size and current scale factor.
        * @returns
        */
        get: function () {
            // Dynamically calculating the annotation size factor based on the natural image width and
            // selected max width. Incase of stitched image, the natural image width will be the one
            // which is selected for max width. This will give a proper value for determine the size of the annotation
            // based on image zoom/streach size
            var fraction = (this.props.currentImageNaturalWidth / this.props.currentImageMaxWidth) * 4;
            return ((this.props.currentImageMaxWidth / 100) * fraction) / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnnotationOverlay.prototype, "textAnnotationHeightAdjustment", {
        /**
        * Returning the text annotation height, according to the page size and current scale factor.
        * @returns
        */
        get: function () {
            var fraction = (this.props.currentImageNaturalWidth / this.props.currentImageMaxWidth) * 4;
            var annotationPaddingAndBorder = 4;
            var textAnnotationHeightFraction = 0.68;
            var normalAnnotationWidth = ((this.props.currentImageMaxWidth / 100) * fraction);
            return ((normalAnnotationWidth + annotationPaddingAndBorder) * textAnnotationHeightFraction) / 2;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *  to trigger the event to re render the sideview comment line.
     * @param element
     * @param actualX
     * @param actualY
     * @param clientToken
     * @param elementClientRect
     */
    AnnotationOverlay.prototype.triggerSideViewEvent = function (element, event, clientToken, actualX, actualY, elementClientRect, inGreyArea) {
        // if the moved annotation is on page comment trigger the side view re render to move the line
        if (this.pannedStampId === enums.DynamicAnnotation.OnPageComment) {
            // for first time setting up the actual x and y as line position , then onwards adding the delta.
            if (this.lineYPos === 0 && this.lineXPos === 0) {
                if (elementClientRect) {
                    this.lineYPos = actualY - elementClientRect.top;
                    this.lineXPos = actualX - elementClientRect.left;
                }
            }
            else {
                this.lineYPos = this.lineYPos + (actualY - this.clientYOld);
                this.lineXPos = this.lineXPos + (actualX - this.clientXOld);
            }
            this.clientXOld = actualX;
            this.clientYOld = actualY;
            stampActionCreator.renderSideViewComments(this.lineXPos, this.lineYPos, clientToken, true, inGreyArea);
        }
    };
    /**
     * Get the current margin top between the stitched image gap.
     * @param {type} overlayBounday
     * @param {type} rotatedAngle
     * @returns Stitched image gap in pixel
     */
    AnnotationOverlay.prototype.getBoundaryThreshold = function (overlayBounday, rotatedAngle) {
        var boundaryThreshold = 0;
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
    };
    /**
     *  Get the current drwaing element rectangle with the values
     * @param {number} left
     * @param {number} top
     * @param {number} width
     * @param {number} height
     * @param {number} rotatedAngle
     * @returns Mock element rect
     */
    AnnotationOverlay.prototype.getDrawingElementRect = function (left, top, width, height, rotatedAngle) {
        var elemRect = {
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
    };
    /**
     * return annotations in the skipped zone
     * @param currentZones
     * @param skippedZones
     * @param multipleMarkSchemes
     */
    AnnotationOverlay.prototype.getAnnotationsInSkippedZone = function (currentZones, skippedZones, multipleMarkSchemes) {
        var _this = this;
        var annotationsToDisplayInCurrentPage;
        if (skippedZones && skippedZones.count() > 0) {
            var currentAnnotations_1 = annotationHelper.getCurrentMarkGroupAnnotation();
            if (annotationHelper.doShowPreviousAnnotations && pageLinkHelper.doShowPreviousMarkerLinkedPages) {
                var previousRemarkAnnotations = annotationHelper.getCurrentMarkGroupPreviousRemarkAnnotations(responseHelper.getCurrentResponseSeedType());
                if (currentAnnotations_1) {
                    previousRemarkAnnotations.map(function (annotation) {
                        annotation.isPrevious = true;
                    });
                    currentAnnotations_1 = currentAnnotations_1.concat(previousRemarkAnnotations);
                }
            }
            // iterate and find the top height of the zones above the skipped zone
            skippedZones.map(function (skippedZone) {
                var zonesAboveSkippedZone = currentZones.filter(function (item) { return item.sequence < skippedZone.sequence
                    && item.outputPageNo === skippedZone.outputPageNo; }).toList();
                var skippedImageNaturalDimension = _this.props.getImageNaturalDimension(skippedZone.pageNo);
                if (skippedImageNaturalDimension) {
                    var skippedZoneTop_1 = annotationHelper.findPercentage(skippedImageNaturalDimension.naturalHeight, skippedZone.topEdge);
                    var skippedZoneLeft_1 = annotationHelper.findPercentage(skippedImageNaturalDimension.naturalWidth, skippedZone.leftEdge);
                    var skippedZoneHeight_1 = annotationHelper.findPercentage(skippedImageNaturalDimension.naturalHeight, skippedZone.height);
                    if (_this.props.getHeightOfZones && zonesAboveSkippedZone.count() >= 0) {
                        // find the height of zones above the skipped zone
                        var heightOfZonesAboveSkippedZone_1 = _this.props.getHeightOfZones(zonesAboveSkippedZone);
                        multipleMarkSchemes.treeViewItemList.map(function (item) {
                            // iterate through the annotation and find if the annotation is place in skipped zone
                            currentAnnotations_1.map(function (annotation) {
                                if (annotation.topEdge >= heightOfZonesAboveSkippedZone_1 &&
                                    annotation.topEdge <= heightOfZonesAboveSkippedZone_1 + skippedZoneHeight_1 &&
                                    annotation.outputPageNo === skippedZone.outputPageNo &&
                                    annotation.markSchemeId === item.uniqueId &&
                                    annotation.markingOperation !== enums.MarkingOperation.deleted) {
                                    if (!annotationsToDisplayInCurrentPage) {
                                        annotationsToDisplayInCurrentPage = Immutable.List();
                                    }
                                    // update the annotation topAboveZone and skippedZoneTop
                                    annotation.isInSkippedZone = true;
                                    annotation.topAboveZone = heightOfZonesAboveSkippedZone_1;
                                    annotation.skippedZoneTop = skippedZoneTop_1;
                                    annotation.skippedZoneLeft = skippedZoneLeft_1;
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
    };
    /**
     * return wrap style for a annotation
     * @param annotation
     * @param stamp
     */
    AnnotationOverlay.prototype.getAnnotationWrapStyle = function (annotation, stamp) {
        var annotationWrapStyle = {};
        var zoneTop = this.props.isReadOnly ? 0 : this.props.zoneTop;
        var zoneLeft = this.props.isReadOnly ? 0 : this.props.zoneLeft;
        var zoneHeight = this.props.isReadOnly ? 0 : this.props.zoneHeight;
        var topAboveCurrentZone = this.props.topAboveCurrentZone ? this.props.topAboveCurrentZone : 0;
        var topAdjustment = 0;
        var leftAdjustment = 0;
        if (this.props.doApplyLinkingScenarios && annotation.pageNo === 0) {
            if (this.props.isALinkedPage) {
                if (annotation.isInSkippedZone && annotation.isInSkippedZone === true) {
                    if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                        topAdjustment = annotation.height - annotation.topAboveZone + annotation.skippedZoneTop;
                        leftAdjustment = annotation.width + annotation.skippedZoneLeft;
                    }
                    else {
                        topAdjustment = annotation.topEdge - annotation.topAboveZone + annotation.skippedZoneTop;
                        leftAdjustment = annotation.leftEdge + annotation.skippedZoneLeft;
                    }
                }
                else if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                    topAdjustment = annotation.height - topAboveCurrentZone + zoneTop;
                    leftAdjustment = annotation.width + zoneLeft;
                }
                else {
                    topAdjustment = annotation.topEdge - topAboveCurrentZone + zoneTop;
                    leftAdjustment = annotation.leftEdge + zoneLeft;
                }
            }
            else {
                if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                    topAdjustment = Math.abs(annotation.height - topAboveCurrentZone);
                    leftAdjustment = annotation.width;
                }
                else {
                    topAdjustment = annotation.topEdge - topAboveCurrentZone;
                    leftAdjustment = annotation.leftEdge;
                }
            }
        }
        else {
            if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                topAdjustment = annotation.height;
                leftAdjustment = annotation.width;
            }
            else {
                topAdjustment = annotation.topEdge;
                leftAdjustment = annotation.leftEdge;
            }
        }
        // set annotation wrap style.
        return this.setAnnotationWrapStyle(topAdjustment, leftAdjustment, annotationWrapStyle, zoneTop, zoneHeight, stamp.stampType);
    };
    /**
     * Set annotation wrap style based on component type.
     * @param topAdjustment
     * @param leftAdjustment
     * @param annotationWrapStyle
     * @param zoneTop
     * @param zoneHeight
     * @param stampType
     */
    AnnotationOverlay.prototype.setAnnotationWrapStyle = function (topAdjustment, leftAdjustment, annotationWrapStyle, zoneTop, zoneHeight, stampType) {
        if (this.props.isEBookMarking === true) {
            // calculate annotation top relative to natural height if full response view
            // else calculate relative to zone height.
            if (responseStore.instance.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView && !this.props.isALinkedPage) {
                annotationWrapStyle.top = (topAdjustment - zoneTop - ((stampType === enums.StampType.text) ?
                    this.textAnnotationHeightAdjustment : this.annotationSizeFraction)) * 100 / zoneHeight + '%';
            }
            else {
                annotationWrapStyle.top = (topAdjustment - ((stampType === enums.StampType.text) ?
                    this.textAnnotationHeightAdjustment : this.annotationSizeFraction)) * 100 / this.props.currentOutputImageHeight + '%';
            }
        }
        else {
            // calculate zone relative to current output image height
            annotationWrapStyle.top = (((topAdjustment - ((stampType === enums.StampType.text) ?
                this.textAnnotationHeightAdjustment : this.annotationSizeFraction)) / this.props.currentOutputImageHeight) * 100) + '%';
        }
        annotationWrapStyle.left = (((leftAdjustment - this.annotationSizeFraction) / this.props.currentImageMaxWidth) * 100) + '%';
        return annotationWrapStyle;
    };
    /**
     * add a link annotation if the page is linked by previous marker and current marker is
     * adding a annotation for the first time
     */
    AnnotationOverlay.prototype.addLinkAnnotationIfPageIsLinkedByPreviousMarker = function (pageNo) {
        if (this.props.isALinkedPage && pageLinkHelper.doShowPreviousMarkerLinkedPages &&
            this.props.pagesLinkedByPreviousMarkers && this.props.pagesLinkedByPreviousMarkers.length > 0) {
            // if its a multiple markscheme then we need to add the link against the first question item
            this.treeViewHelper = new treeViewDataHelper();
            var tree = this.treeViewHelper.treeViewItem();
            var multipleMarkSchemes = markingHelper.getMarkschemeParentNodeDetails(tree, markingStore.instance.currentMarkSchemeId, true);
            pageLinkHelper.addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo, this.props.isALinkedPage, this.props.pagesLinkedByPreviousMarkers, multipleMarkSchemes);
        }
    };
    /**
     * render acetates
     */
    AnnotationOverlay.prototype.renderAcetates = function () {
        if (this.doRenderOverlays) {
            var pageNo = this.props.pageNo > 0 ? this.props.pageNo : this.props.structerdPageNo;
            var imageDimension = this.props.getImageNaturalDimension(pageNo);
            if (imageDimension) {
                var imageProps = {
                    naturalHeight: imageDimension.naturalHeight,
                    naturalWidth: imageDimension.naturalWidth,
                    pageNo: pageNo,
                    outputPageNo: annotationHelper.getOutputPageNo(this.props.doApplyLinkingScenarios, this.props.imageZones, this.props.imageZone, this.props.outputPageNo),
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
                var linkingScenarioProps = {
                    topAboveCurrentZone: this.props.topAboveCurrentZone,
                    zoneTop: this.props.zoneTop,
                    zoneLeft: this.props.zoneLeft,
                    zoneHeight: this.props.zoneHeight,
                    skippedZones: this.props.skippedZones
                };
                return React.createElement(OverlayHolder, {id: 'OverlayHolder', key: 'OverlayHolder', imageProps: imageProps, getAnnotationOverlayElement: this.overlayElement, linkingScenarioProps: linkingScenarioProps, doApplyLinkingScenarios: this.props.doApplyLinkingScenarios, getMarkSheetContainerProperties: this.props.getMarkSheetContainerProperties, enableImageContainerScroll: this.props.enableImageContainerScroll});
            }
        }
        return null;
    };
    Object.defineProperty(AnnotationOverlay.prototype, "doRenderOverlays", {
        /* return true if we need to render the overlays (acetates) */
        get: function () {
            return !this.props.isReadOnly && !ecourseWorkHelper.isECourseworkComponent && responseHelper.isOverlayAnnotationsVisible;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To set the highlighter in FRV on unmanaged unknown contents.
     */
    AnnotationOverlay.prototype.setUnknownContentHighlighter = function (pageNumber, pageWidth, pageHeight) {
        var styles = {};
        /* Gets the unknown content zone in a page */
        var unknownZoneList = imageZoneStore.instance.currentCandidateScriptImageZone.
            filter(function (x) { return x.pageNo === pageNumber && x.docStorePageQuestionTagTypeId === 4; });
        if (unknownZoneList.count() > 0) {
            // The counter is for creating the id of the unzone-content-holder element
            var counter_1 = 0;
            var unknownZones = unknownZoneList.map(function (imageZone) {
                styles = {
                    paddingTop: ((pageHeight / pageWidth) * imageZone.height).toString() + '%',
                    top: imageZone.topEdge.toString() + '%'
                };
                counter_1++;
                return (React.createElement("div", {className: 'unzone-content-holder', id: 'unzone_content_holder_' + pageNumber + '_' + counter_1, style: styles, key: 'unzone_content_holder_' + pageNumber + '_' + counter_1}));
            });
            return (React.createElement("div", {className: 'unzone-content-wrapper', id: 'unzone_content_wrapper_' + pageNumber}, unknownZones));
        }
    };
    Object.defineProperty(AnnotationOverlay.prototype, "doAddStrokeWidthStyle", {
        /* return true if we need to add stroke width in annotation overlay */
        get: function () {
            var isAtypical = responseHelper.isAtypicalResponse();
            var angle = annotationHelper.getAngleforRotation(this.props.displayAngle);
            return (responseStore.instance.markingMethod === enums.MarkingMethod.Structured && !isAtypical) ||
                (this.props.isEBookMarking === true && !isAtypical) ||
                angle === enums.RotateAngle.Rotate_90 || angle === enums.RotateAngle.Rotate_270;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnnotationOverlay.prototype, "annotationOverlayStrokeWidth", {
        /**
         * return annotation overlay stroke width
         */
        get: function () {
            if (this.doAddStrokeWidthStyle) {
                return '#' + this.getAnnotationOverlayId() + '{stroke-width:' + this.hlineStrokeWidth + ';}';
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    return AnnotationOverlay;
}(eventManagerBase));
module.exports = AnnotationOverlay;
/* tslint:enable */ 
//# sourceMappingURL=annotationoverlay.js.map