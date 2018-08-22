"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDom = require('react-dom');
var StampBase = require('../stampbase');
var enums = require('../../../utility/enums');
var deviceHelper = require('../../../../utility/touch/devicehelper');
var annotationHelper = require('../../../utility/annotation/annotationhelper');
var markingActionCreator = require('../../../../actions/marking/markingactioncreator');
var toolbarActionCreator = require('../../../../actions/toolbar/toolbaractioncreator');
var responseActionCreator = require('../../../../actions/response/responseactioncreator');
var stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
var stampStore = require('../../../../stores/stamp/stampstore');
var toolbarStore = require('../../../../stores/toolbar/toolbarstore');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var eventTypes = require('../../../base/eventmanager/eventtypes');
var directions = require('../../../base/eventmanager/direction');
var constants = require('../../../utility/constants');
var responseStore = require('../../../../stores/response/responsestore');
var markingStore = require('../../../../stores/marking/markingstore');
var colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
var markingHelper = require('../../../../utility/markscheme/markinghelper');
var treeViewDataHelper = require('../../../../utility/treeviewhelpers/treeviewdatahelper');
var pageLinkHelper = require('../../responsescreen/linktopage/pagelinkhelper');
var keyDownHelper = require('../../../../utility/generic/keydownhelper');
var that;
/**
 * React component class for Dynamic Stamp
 */
var DynamicStampBase = (function (_super) {
    __extends(DynamicStampBase, _super);
    /**
     * @constructor
     */
    function DynamicStampBase(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /** To set initial clientRect of annotation on mouse down */
        this.annotationRect = { left: 0, bottom: 0, height: 0, right: 0, top: 0, width: 0 };
        /*get cordinates on mouse down*/
        this.mouseDownCoordinates = {
            pointerDifferenceFromAnnotationX: 0,
            pointerDifferenceFromAnnotationY: 0
        };
        // Resize variables
        this.selectedBorder = enums.AnnotationBorderType.Default;
        /* default size of the dynamic annotation in pixel */
        this.resizeMinVal = { width: 0, height: 0 };
        this.isTouchDevice = deviceHelper.isTouchDevice();
        this.annotationOutsideResponse = false;
        this.isDrawMode = false;
        /** To Verify whether retain is required while Move/Resize */
        this.retainPosition = false;
        /* To save coordinates while drawing annotation */
        this.topVals = [];
        this.leftVals = [];
        this.isAnnotationModified = false;
        /* To check whether pointer is in gray area */
        this.pointerInGrayArea = false;
        /* To check element is moved to another page */
        this.hasMovedToNextPage = false;
        this.isInStampPanel = false;
        /** To load empty div element for rerendering */
        this.loadEmpty = false;
        // Indicates whether the response annotation is overlapped stitched image gap.
        this.isAnnotationOverlapsStitchedGap = false;
        this.overlayBoundary = [];
        // Indicating whether the annotation is moving/dragging.
        this.isAnnotationMoving = false;
        // Indicating whether the annotation is inside the stitched response image gap.
        // This will be set only for stitched images, structured response.
        this.isAnnotationInsideStitchedImageGap = false;
        /**
         * Validate the action for Move or Resizing.
         */
        this.validateAction = function (event) {
            var e = event.changedPointers[0];
            var holderElement = null;
            var currentAnnotationElement = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
            _this.loadEmpty = false;
            if (!_this.hasMovedToNextPage) {
                currentAnnotationElement = _this.getCurrentElementBoundRect();
                _this._currentAnnotationElement = currentAnnotationElement;
            }
            else {
                currentAnnotationElement = _this._currentAnnotationElement;
            }
            var markSheetElement = _this.markSheetElement;
            if (markSheetElement) {
                var scrollTop = markSheetElement.scrollTop;
                var scrollLeft = markSheetElement.scrollLeft;
                var annotationOverlayElement = _this.annotationOverlayElement;
                var holderRect = annotationOverlayElement.getBoundingClientRect();
                var annotationHolderRect = {
                    width: holderRect.width,
                    height: holderRect.height,
                    left: holderRect.left,
                    top: holderRect.top,
                    bottom: 0, right: 0
                };
                var clientRect = {
                    width: _this.state.width,
                    height: _this.state.height,
                    left: _this.state.left,
                    top: _this.state.top,
                    bottom: 0, right: 0
                };
                /** Get real angle while rotating response */
                var rotatedAngle = 0;
                /* To get current annotation holder element based on the mouse position */
                if (_this.selectedBorder === enums.AnnotationBorderType.Default) {
                    holderElement = htmlUtilities.findCurrentHolder(_this.annotationOverlayElement, event.center.x, event.center.y);
                    if (_this.annotationOverlayElement.id !== holderElement.id) {
                        _this.hasMovedToNextPage = true;
                        rotatedAngle = annotationHelper.getAngleforRotation(Number(holderElement.getAttribute('data-rotatedangle')));
                    }
                    else {
                        _this.hasMovedToNextPage = false;
                        rotatedAngle = annotationHelper.getAngleforRotation(_this.props.displayAngle);
                    }
                }
                else {
                    rotatedAngle = annotationHelper.getAngleforRotation(_this.props.displayAngle);
                }
                var pointerOutsideAnnotationHolder = _this.isPointerInsideElement(e, _this.hasMovedToNextPage ?
                    holderElement.getBoundingClientRect() : holderRect);
                var pointerInGrayArea = { 'inGrayArea': false, 'isInsideStitchedPage': true };
                var selectedOverlay = !_this.hasMovedToNextPage ? _this.annotationOverlayElement.parentElement : holderElement.parentElement;
                pointerInGrayArea = _this.isPointerInGrayArea(e, selectedOverlay, rotatedAngle);
                var deltaVal = 0;
                var dX = 0;
                var dY = 0;
                var left = 0;
                var top_1 = 0;
                var width = 0;
                var height = 0;
                var blnIsoddAngle = void 0;
                _this.isAnnotationModified = true;
                if (_this.selectedBorder !== enums.AnnotationBorderType.Default) {
                    /** To check whether the rotatedAngle is 90 deg or 270 deg */
                    blnIsoddAngle = annotationHelper.IsOddangle(rotatedAngle);
                    var rotateCoords = annotationHelper.setRotationCoordinates(event, rotatedAngle, annotationHolderRect);
                    deltaVal = 0;
                    dX = rotateCoords.deltaX;
                    dY = rotateCoords.deltaY;
                    left = 0;
                    top_1 = 0;
                    annotationHolderRect = rotateCoords.holderRect;
                    /** Change scroll during resizing */
                    _this.scrollUpdate(event, clientRect, pointerOutsideAnnotationHolder);
                    /** To set width/height while move/resize */
                    width = _this.initialCoordinates.width +
                        annotationHelper.pixelsToPercentConversion(dX, annotationHolderRect.width);
                    height = _this.initialCoordinates.height +
                        annotationHelper.pixelsToPercentConversion(dY, annotationHolderRect.height);
                }
                else {
                    annotationHolderRect = holderRect;
                }
                switch (_this.selectedBorder) {
                    case enums.AnnotationBorderType.BottomEdge:
                        if (height > _this.initialCoordinates.height) {
                            clientRect.height = _this.initialCoordinates.height -
                                annotationHelper.pixelsToPercentConversion(Math.abs(dY), annotationHolderRect.height);
                        }
                        else {
                            clientRect.height = _this.initialCoordinates.height +
                                annotationHelper.pixelsToPercentConversion(Math.abs(dY), annotationHolderRect.height);
                        }
                        clientRect.height = _this.setClientRectOnScroll(event, clientRect, annotationHolderRect).height;
                        break;
                    case enums.AnnotationBorderType.LeftEdge:
                        if (blnIsoddAngle) {
                            width = _this.initialCoordinates.width + _this.setClientRectOnScroll(event, clientRect, annotationHolderRect).width +
                                annotationHelper.pixelsToPercentConversion(dX, annotationHolderRect.width);
                        }
                        if (Math.round(width) > 0) {
                            deltaVal = _this.initialCoordinates.width - width;
                            clientRect.left = _this.initialCoordinates.x + deltaVal;
                            clientRect.width = width;
                        }
                        break;
                    case enums.AnnotationBorderType.TopEdge:
                        if (!blnIsoddAngle) {
                            height = _this.initialCoordinates.height + _this.setClientRectOnScroll(event, clientRect, annotationHolderRect).height +
                                annotationHelper.pixelsToPercentConversion(dY, annotationHolderRect.height);
                        }
                        if (Math.round(height) > 0) {
                            deltaVal = _this.initialCoordinates.height - height;
                            clientRect.top = _this.initialCoordinates.y + deltaVal;
                            clientRect.height = height;
                        }
                        break;
                    case enums.AnnotationBorderType.RightEdge:
                        if (width > _this.initialCoordinates.width) {
                            clientRect.width = _this.initialCoordinates.width -
                                annotationHelper.pixelsToPercentConversion(Math.abs(dX), annotationHolderRect.width);
                        }
                        else {
                            clientRect.width = _this.initialCoordinates.width +
                                annotationHelper.pixelsToPercentConversion(Math.abs(dX), annotationHolderRect.width);
                        }
                        clientRect.width = _this.setClientRectOnScroll(event, clientRect, annotationHolderRect).width;
                        break;
                    case enums.AnnotationBorderType.TopLeft:
                        if (blnIsoddAngle) {
                            width = width + _this.setClientRectOnScroll(event, clientRect, annotationHolderRect).width;
                        }
                        else {
                            height = _this.initialCoordinates.height + _this.setClientRectOnScroll(event, clientRect, annotationHolderRect).height +
                                annotationHelper.pixelsToPercentConversion(dY, annotationHolderRect.height);
                        }
                        if (Math.round(height) > 0) {
                            deltaVal = _this.initialCoordinates.height - height;
                            clientRect.top = _this.initialCoordinates.y + deltaVal;
                            clientRect.height = height;
                        }
                        if (Math.round(width) > 0) {
                            deltaVal = _this.initialCoordinates.width - width;
                            clientRect.left = _this.initialCoordinates.x + deltaVal;
                            clientRect.width = width;
                        }
                        break;
                    case enums.AnnotationBorderType.TopRight:
                        if (!blnIsoddAngle) {
                            height = _this.initialCoordinates.height + _this.setClientRectOnScroll(event, clientRect, annotationHolderRect).height +
                                annotationHelper.pixelsToPercentConversion(dY, annotationHolderRect.height);
                        }
                        if (Math.round(height) > 0) {
                            deltaVal = _this.initialCoordinates.height - height;
                            clientRect.top = _this.initialCoordinates.y + deltaVal;
                            clientRect.height = height;
                        }
                        if (width > _this.initialCoordinates.width) {
                            clientRect.width = _this.initialCoordinates.width -
                                annotationHelper.pixelsToPercentConversion(Math.abs(dX), annotationHolderRect.width);
                        }
                        else {
                            clientRect.width = _this.initialCoordinates.width +
                                annotationHelper.pixelsToPercentConversion(Math.abs(dX), annotationHolderRect.width);
                        }
                        if (blnIsoddAngle) {
                            clientRect.width = _this.setClientRectOnScroll(event, clientRect, annotationHolderRect).width;
                        }
                        break;
                    case enums.AnnotationBorderType.BottomLeft:
                        if (blnIsoddAngle) {
                            width = width + _this.setClientRectOnScroll(event, clientRect, annotationHolderRect).width;
                        }
                        if (height > _this.initialCoordinates.height) {
                            clientRect.height = _this.initialCoordinates.height -
                                annotationHelper.pixelsToPercentConversion(Math.abs(dY), annotationHolderRect.height);
                        }
                        else {
                            clientRect.height = _this.initialCoordinates.height +
                                annotationHelper.pixelsToPercentConversion(Math.abs(dY), annotationHolderRect.height);
                        }
                        deltaVal = _this.initialCoordinates.width - width;
                        if (Math.round(width) > 0) {
                            clientRect.left = _this.initialCoordinates.x + deltaVal;
                            clientRect.width = width;
                        }
                        if (!blnIsoddAngle) {
                            clientRect.height = _this.setClientRectOnScroll(event, clientRect, annotationHolderRect).height;
                        }
                        break;
                    case enums.AnnotationBorderType.BottomRight:
                        if (height > _this.initialCoordinates.height) {
                            clientRect.height = _this.initialCoordinates.height -
                                annotationHelper.pixelsToPercentConversion(Math.abs(dY), annotationHolderRect.height);
                        }
                        else {
                            clientRect.height = _this.initialCoordinates.height +
                                annotationHelper.pixelsToPercentConversion(Math.abs(dY), annotationHolderRect.height);
                        }
                        if (width > _this.initialCoordinates.width) {
                            clientRect.width = _this.initialCoordinates.width -
                                annotationHelper.pixelsToPercentConversion(Math.abs(dX), annotationHolderRect.width);
                        }
                        else {
                            clientRect.width = _this.initialCoordinates.width +
                                annotationHelper.pixelsToPercentConversion(Math.abs(dX), annotationHolderRect.width);
                        }
                        if (blnIsoddAngle) {
                            clientRect.width = _this.setClientRectOnScroll(event, clientRect, annotationHolderRect).width;
                        }
                        else {
                            clientRect.height = _this.setClientRectOnScroll(event, clientRect, annotationHolderRect).height;
                        }
                        break;
                    case enums.AnnotationBorderType.Default:
                        clientRect.left = (e.clientX + scrollLeft) - _this.mouseDownCoordinates.pointerDifferenceFromAnnotationX;
                        clientRect.top = (e.clientY - _this.mouseDownCoordinates.pointerDifferenceFromAnnotationY) + scrollTop;
                        /* If pointer is in Stamp panel*/
                        _this.isInStampPanel = _this.isPointerInStampPanel(e);
                        _this.annotationOutsideResponse = true;
                        var isPointerInCommentHolder = _this.isPointerInCommentHolder(e);
                        if (!pointerInGrayArea.isInsideStitchedPage || isPointerInCommentHolder) {
                            /** If pointer is in stitched image gap */
                            toolbarActionCreator.PanStampToDeleteArea(true, e.clientX, e.clientY);
                        }
                        else if (pointerInGrayArea.inGrayArea && !pointerOutsideAnnotationHolder) {
                            /** If pointer is in gray area and not outside the response */
                            toolbarActionCreator.PanStampToDeleteArea(false, e.clientX, e.clientY);
                        }
                        else if (pointerOutsideAnnotationHolder || _this.isInStampPanel) {
                            /** If pointer is outside the response */
                            toolbarActionCreator.PanStampToDeleteArea(true, e.clientX, e.clientY);
                        }
                        else {
                            /** If pointer is inside the response and not in gray area */
                            _this.annotationOutsideResponse = false;
                            _this.isAnnotationOverlapsStitchedGap = false;
                            _this.isAnnotationInsideStitchedImageGap = false;
                            toolbarActionCreator.PanStampToDeleteArea(false, e.clientX, e.clientY);
                        }
                        // If annotation back on the same origine image after navigate to next page
                        // hide the element.
                        if (!_this.hasMovedToNextPage) {
                            _this.hideMovingElementOnOtherPage();
                        }
                        if (_this.hasMovedToNextPage) {
                            // Get annotation properties according to the current annotation holder.
                            // Need to resize the annotation height and width based on the current holde width and stroke width.
                            // such a scenario like moved an annotation from one page to another page, and comes back to
                            // same page may show an incorrect annotation size.
                            var annotationProperties = _this.getAnnotationProperties(holderElement, _this.props.annotationData.width, _this.props.annotationData.height);
                            //let rotatedAngleOftheNextpage = Number(holderElement.getAttribute('data-rotatedangle'));
                            var holderRectOftheNextPage = holderElement.getBoundingClientRect();
                            var top_2 = e.clientY - holderRectOftheNextPage.top;
                            var left_1 = e.clientX - holderRectOftheNextPage.left;
                            var clientRect_1 = {
                                left: 0,
                                top: 0,
                                width: annotationProperties.width,
                                height: annotationProperties.height,
                                right: 0,
                                bottom: 0
                            };
                            _this.annotationOutsideResponse = true;
                            _a = _this.getClientRectOnNextPage(left_1, top_2, rotatedAngle, _this.props.displayAngle, currentAnnotationElement), clientRect_1.left = _a[0], clientRect_1.top = _a[1];
                            if (_this.props.annotationData.stamp === enums.DynamicAnnotation.HorizontalLine) {
                                clientRect_1.left = Math.round(clientRect_1.left);
                                clientRect_1.top = Math.round(clientRect_1.top);
                            }
                            _b = annotationHelper.retainAnnotationOnRotate(rotatedAngle, clientRect_1, holderRectOftheNextPage, currentAnnotationElement), clientRect_1.left = _b[0], clientRect_1.top = _b[1];
                            /** Check if the annotation is outside the response  */
                            _this.retainPosition = _this.checkElementOutsideResponse(holderElement.getBoundingClientRect(), clientRect_1, rotatedAngle);
                            if (_this.isStitchedImage) {
                                // Check whether the current hovering element is stitched image or not.
                                var currentHolderElement = htmlUtilities.findCurrentHolder(holderElement, e.clientX, e.clientY);
                                var currentHolderElementRect = currentHolderElement.getBoundingClientRect();
                                var clientRectInPixels = _this.getClientRectInPixels(clientRect_1, holderRectOftheNextPage, rotatedAngle);
                                // For adding overlayHolderRect for validateAnnotaionBoundaryOnStitchedImageGap method
                                var annotationRect = {
                                    top: (clientRectInPixels.top + currentHolderElementRect.top),
                                    left: (clientRectInPixels.left + currentHolderElementRect.left),
                                    width: clientRectInPixels.width,
                                    height: clientRectInPixels.height,
                                    right: clientRectInPixels.right,
                                    bottom: clientRectInPixels.bottom
                                };
                                // As for a stitched stuctured image we need to consider that, annotation is dragged across the gap
                                // and placed. Then we need to reset the annotation to the previous position.
                                var isInsideImage = annotationHelper.validateAnnotaionBoundaryOnStitchedImageGap(annotationRect, currentHolderElementRect, _this.overlayBoundary, rotatedAngle);
                                /** To check whether Annotation is inside the gray area or not */
                                var inGrayArea = annotationHelper.validateAnnotationBoundary(clientRectInPixels, holderElement, markSheetElement, rotatedAngle);
                                // Checks whether the annotation width/height values are positive,
                                // beacuse when its resized backwards then the annotation width/height will be negative,
                                // that will break gray area functionality
                                var clientRectIsProper = _this.checkdimensionforAnnotation(clientRectInPixels);
                                // to show strike icon while mouse cursor is in gray area
                                if (inGrayArea && _this.selectedBorder !== enums.AnnotationBorderType.Default) {
                                    return;
                                }
                                else if (inGrayArea && _this.selectedBorder === enums.AnnotationBorderType.Default) {
                                    _this.retainPosition = inGrayArea && !pointerOutsideAnnotationHolder;
                                    _this.setClientRect(clientRect_1);
                                }
                                else if (!isInsideImage) {
                                    // If whole mouse icon is moved to stitched gap we dont need to reset the postion
                                    // and delete the annotation.
                                    _this.retainPosition = pointerInGrayArea.isInsideStitchedPage;
                                    // If annotation is moving set the retain position after mouse leave should
                                    // retain original position.
                                    if (_this.selectedBorder === enums.AnnotationBorderType.Default) {
                                        // As for a stitched stuctured image we need to consider that, annotation is dragged across the gap
                                        // and placed. Then we need to reset the annotation to the previous position.
                                        _this.setClientRect(clientRect_1);
                                        _this.isAnnotationInsideStitchedImageGap = !pointerInGrayArea.isInsideStitchedPage;
                                    }
                                    else {
                                        // If the marker is resizing the dynamic annotation, limit the user from resizing
                                        // at the edge of the stitched image gap.
                                        _this.isAnnotationOverlapsStitchedGap = true;
                                    }
                                }
                                else {
                                    if (clientRectIsProper) {
                                        _this.setClientRect(clientRect_1);
                                    }
                                }
                            }
                            var movingElementProperties = {
                                event: e,
                                innerHTML: _this.elementHTML,
                                holderElement: holderElement,
                                stamp: _this.props.annotationData.stamp,
                                clientRect: {
                                    left: clientRect_1.left,
                                    top: clientRect_1.top,
                                    width: annotationProperties.width,
                                    height: annotationProperties.height,
                                    right: 0,
                                    bottom: 0
                                },
                                // If annotaion has moved to stitched image gap of structured response
                                // then we dont need to show this moving element as we will show the
                                // delete icon. This will only applicable for structred response.
                                visible: pointerInGrayArea.isInsideStitchedPage
                            };
                            _this.clientRectOnNextPage = movingElementProperties.clientRect;
                            _this.nextHolderElement = holderElement;
                            _this.annotationOutsideResponse = true;
                            // Updating the annotation position when its moved/moving to/in next page
                            markingActionCreator.dynamicAnnotationMoveAction(movingElementProperties);
                        }
                        if (_this.props.annotationData.stamp === enums.DynamicAnnotation.HorizontalLine) {
                            clientRect.left = Math.round(clientRect.left);
                            clientRect.top = Math.round(clientRect.top);
                        }
                        _c = annotationHelper.retainAnnotationOnRotate(rotatedAngle, clientRect, holderRect, currentAnnotationElement), clientRect.left = _c[0], clientRect.top = _c[1];
                        break;
                    default:
                        break;
                }
                if (!_this.hasMovedToNextPage) {
                    if (_this.selectedBorder === enums.AnnotationBorderType.Default) {
                        // Get annotation properties according to the current annotation holder.
                        var annotationProperties = _this.getAnnotationProperties(_this.annotationOverlayElement, _this.props.annotationData.width, _this.props.annotationData.height);
                        // Need to resize the annotation height and width based on the current holde width and stroke width.
                        // such a scenario like moved an annotation from one page to another page, and comes back to
                        // same page may show an incorrect annotation size.
                        clientRect.width = annotationProperties.width;
                        clientRect.height = annotationProperties.height;
                    }
                    var clientRectInPixels = _this.getClientRectInPixels(clientRect, annotationHolderRect, rotatedAngle);
                    var clientRectInsideAnnotationHolder = _this.annotationInsideHolder(clientRectInPixels, annotationHolderRect, rotatedAngle);
                    /** Checks if annotation is outside response and pointer is inside the annotation holder */
                    var annotationInResponseBoundary = !clientRectInsideAnnotationHolder && !pointerOutsideAnnotationHolder;
                    _this.retainPosition = annotationInResponseBoundary || (pointerInGrayArea.inGrayArea &&
                        !pointerOutsideAnnotationHolder);
                    if (_this.selectedBorder === enums.AnnotationBorderType.Default) {
                        clientRectInsideAnnotationHolder = true;
                    }
                    /** For stiched image response */
                    if ((_this.isStitchedImage || _this.props.imageZones.length > 0) && clientRectInsideAnnotationHolder) {
                        /** To check whether Annotation is inside the gray area or not */
                        var inGrayArea = annotationHelper.validateAnnotationBoundary(clientRectInPixels, annotationOverlayElement, markSheetElement, rotatedAngle);
                        // Check whether the current hovering element is stitched image or not.
                        var currentHolderElement_1 = htmlUtilities.findCurrentHolder(_this.annotationOverlayElement, e.clientX, e.clientY);
                        var currentHolderElementRect = currentHolderElement_1.getBoundingClientRect();
                        // For adding overlayHolderRect for validateAnnotaionBoundaryOnStitchedImageGap method
                        var annotationRect = {
                            top: (clientRectInPixels.top + currentHolderElementRect.top),
                            left: (clientRectInPixels.left + currentHolderElementRect.left),
                            width: clientRectInPixels.width,
                            height: clientRectInPixels.height,
                            right: clientRectInPixels.right,
                            bottom: clientRectInPixels.bottom
                        };
                        // As for a stitched stuctured image we need to consider that, annotation is dragged across the gap
                        // and placed. Then we need to reset the annotation to the previous position.
                        var isInsideImage_1 = annotationHelper.validateAnnotaionBoundaryOnStitchedImageGap(annotationRect, currentHolderElementRect, _this.overlayBoundary, rotatedAngle, 0, enums.AddAnnotationAction.Pan);
                        /** Checks whether the annotation width/height values are positive,
                         * beacuse when its resized backwards then the annotation width/height will be negative,
                         * that will break gray area functionality
                         */
                        var clientRectIsProper = _this.checkdimensionforAnnotation(clientRectInPixels);
                        /** to show strike icon while mouse cursor is in gray area */
                        if (inGrayArea && _this.selectedBorder !== enums.AnnotationBorderType.Default) {
                            return;
                        }
                        else if (inGrayArea && _this.selectedBorder === enums.AnnotationBorderType.Default) {
                            _this.retainPosition = inGrayArea && !pointerOutsideAnnotationHolder;
                            _this.setClientRect(clientRect);
                            _this.scrollUpdate(event, clientRect, pointerOutsideAnnotationHolder);
                        }
                        else if (!isInsideImage_1) {
                            // If whole mouse icon is moved to stitched gap we dont need to reset the postion
                            // and delete the annotation.
                            _this.retainPosition = pointerInGrayArea.isInsideStitchedPage;
                            // If annotation is moving set the retain position after mouse leave should
                            // retain original position.
                            if (_this.selectedBorder === enums.AnnotationBorderType.Default) {
                                // As for a stitched stuctured image we need to consider that, annotation is dragged across the gap
                                // and placed. Then we need to reset the annotation to the previous position.
                                _this.setClientRect(clientRect);
                                _this.scrollUpdate(event, clientRect, pointerOutsideAnnotationHolder);
                            }
                            else {
                                // If the marker is resizing the dynamic annotation, limit the user from resizing
                                // at the edge of the stitched image gap.
                                _this.isAnnotationOverlapsStitchedGap = true;
                            }
                        }
                        else {
                            if (clientRectIsProper) {
                                _this.setClientRect(clientRect);
                                _this.scrollUpdate(event, clientRect, pointerOutsideAnnotationHolder);
                            }
                        }
                    }
                    else {
                        if (clientRectInsideAnnotationHolder || _this.selectedBorder === enums.AnnotationBorderType.Default) {
                            _this.setClientRect(clientRect);
                            if (_this.selectedBorder === enums.AnnotationBorderType.Default) {
                                _this.scrollUpdate(event, clientRect, pointerOutsideAnnotationHolder);
                            }
                            else {
                                /** To show strike icon while mouse cursor is in gray area */
                                markingActionCreator.onAnnotationDraw(!pointerOutsideAnnotationHolder);
                            }
                        }
                        else {
                            markingActionCreator.onAnnotationDraw(!pointerOutsideAnnotationHolder);
                        }
                    }
                }
                else {
                    if (!_this.retainPosition && htmlUtilities.isIE) {
                        _this.loadEmpty = true;
                    }
                    if (pointerInGrayArea.isInsideStitchedPage) {
                        _this.setState({
                            renderedOn: Date.now()
                        });
                    }
                }
            }
            var _a, _b, _c;
        };
        /**
         * This methods returns the left/top value on the annotation when moved to next/previous pages
         * @param left
         * @param top
         * @param rotatedAngleOftheNextpage - variable stores the rotation angle of the page where the annotation is moved to.
         * @param rotatedAngle - variable stores the rotation angle of the page where the annotation is moved from.
         * @param currentAnnotationElement
         */
        /** While moving from one page to another we have to set the client rect of the
         * annotation according to the angle of page from where it is moved to and moved from.
         */
        this.getClientRectOnNextPage = function (left, top, rotatedAngleOftheNextpage, rotatedAngle, currentAnnotationElement) {
            var currentAnnotationWidth;
            var currentAnnotationHeight;
            currentAnnotationWidth = currentAnnotationElement.width;
            currentAnnotationHeight = currentAnnotationElement.height;
            var clientRect = {
                left: 0,
                top: 0
            };
            switch (rotatedAngleOftheNextpage) {
                case enums.RotateAngle.Rotate_90:
                    if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
                        clientRect.left = left - (currentAnnotationWidth / 2);
                        clientRect.top = top - (currentAnnotationHeight / 2);
                    }
                    else {
                        clientRect.left = left - currentAnnotationWidth + (currentAnnotationHeight / 2);
                        clientRect.top = top - (currentAnnotationWidth / 2);
                    }
                    break;
                case enums.RotateAngle.Rotate_270:
                    if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
                        clientRect.left = left - (currentAnnotationWidth / 2);
                        clientRect.top = top - (currentAnnotationHeight / 2);
                    }
                    else {
                        clientRect.top = top - currentAnnotationHeight + (currentAnnotationWidth / 2);
                        clientRect.left = left - (currentAnnotationHeight / 2);
                    }
                    break;
                case enums.RotateAngle.Rotate_180:
                    if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
                        var diff = currentAnnotationWidth > currentAnnotationHeight ? (currentAnnotationWidth / 2) :
                            (currentAnnotationHeight * -1);
                        clientRect.left = left - currentAnnotationWidth + (currentAnnotationHeight / 2);
                        clientRect.top = top - (currentAnnotationWidth / 2) + (currentAnnotationHeight / 2) + diff;
                    }
                    else {
                        clientRect.left = left - (currentAnnotationWidth / 2);
                        clientRect.top = top - (currentAnnotationHeight / 2);
                    }
                    break;
                default:
                    if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
                        currentAnnotationWidth = currentAnnotationElement.height;
                        currentAnnotationHeight = currentAnnotationElement.width;
                    }
                    clientRect.left = left - (currentAnnotationWidth / 2);
                    clientRect.top = top - (currentAnnotationHeight / 2);
                    break;
            }
            return [clientRect.left, clientRect.top];
        };
        /**
         * Get the clientRect in pixels.
         * @param {ClientRectDOM} clientRect
         * @param {ClientRectDOM} annotationHolderRect
         * @param {Number} rotatedAngle
         * @returns
         */
        this.getClientRectInPixels = function (clientRect, annotationHolderRect, rotatedAngle) {
            var rotatedHolderRect = _this.getRotatedAnnotationHolderRect(rotatedAngle, annotationHolderRect);
            var clientRectInPixels = {
                left: annotationHelper.percentToPixelConversion(clientRect.left, rotatedHolderRect.holderWidth),
                top: annotationHelper.percentToPixelConversion(clientRect.top, rotatedHolderRect.holderHeight),
                width: annotationHelper.percentToPixelConversion(clientRect.width, rotatedHolderRect.holderWidth),
                height: annotationHelper.percentToPixelConversion(clientRect.height, rotatedHolderRect.holderHeight),
                right: 0,
                bottom: 0
            };
            return clientRectInPixels;
        };
        /**
         * Check whether annotation is inside annotation holder.
         * @param {ClientRectDOM} clientRectInPixels
         * @param {ClientRectDOM} annotationHolderRect
         * @param {Number} rotatedAngle
         * @returns
         */
        this.annotationInsideHolder = function (clientRectInPixels, annotationHolderRect, rotatedAngle) {
            var clientRectInsideAnnotationHolder = true;
            clientRectInPixels = _this.updateAttributesForAnnotation(clientRectInPixels, rotatedAngle);
            var rotatedHolderRect = _this.getRotatedAnnotationHolderRect(rotatedAngle, annotationHolderRect);
            if ((clientRectInPixels.left <= 0 || clientRectInPixels.left + clientRectInPixels.width >= rotatedHolderRect.holderWidth ||
                clientRectInPixels.top <= 0 || clientRectInPixels.top + clientRectInPixels.height >=
                Math.round(rotatedHolderRect.holderHeight - 1))) {
                clientRectInsideAnnotationHolder = false;
            }
            return clientRectInsideAnnotationHolder;
        };
        /**
         * Checks whether the clientRect values are proper
         * @param clientRect
         */
        this.checkdimensionforAnnotation = function (clientRect) {
            if ((_this.props.annotationData.stamp === enums.DynamicAnnotation.HorizontalLine) ||
                (_this.props.annotationData.stamp === enums.DynamicAnnotation.HWavyLine) ||
                (_this.props.annotationData.stamp === enums.DynamicAnnotation.VWavyLine)) {
                return clientRect.width > 0 || clientRect.height > 0;
            }
            else {
                return clientRect.width > 0 && clientRect.height > 0;
            }
        };
        /**
         * Get annotation holder width/height after rotation, for 90 & 270 degree height/width get swapped
         * @param rotatedAngle
         * @param annotationHolderRect
         */
        this.getRotatedAnnotationHolderRect = function (rotatedAngle, annotationHolderRect) {
            var holderWidth;
            var holderHeight;
            if (_this.selectedBorder === enums.AnnotationBorderType.Default &&
                (rotatedAngle === enums.RotateAngle.Rotate_90 ||
                    rotatedAngle === enums.RotateAngle.Rotate_270)) {
                holderWidth = annotationHolderRect.height;
                holderHeight = annotationHolderRect.width;
            }
            else {
                holderWidth = annotationHolderRect.width;
                holderHeight = annotationHolderRect.height;
            }
            return { 'holderWidth': holderWidth, 'holderHeight': holderHeight };
        };
        /**
         * Modify height/width according to the rotate angles while Scrolling
         */
        this.setClientRectOnScroll = function (event, clientRect, annotationHolderRect) {
            var e = event.changedPointers[0];
            var marksheetElement = _this.props.getMarkSheetContainerProperties().element;
            var rotatedAngle = annotationHelper.getAngleforRotation(_this.props.displayAngle);
            /** scrollTop adjust value on moving/resizing */
            var scrollSpeed = 30;
            /** To store each scroll movement */
            var scroll = 0;
            /* Scroll update value on each move/resize */
            var scrollPosition = event.velocityY >= 0 ? scrollSpeed : -scrollSpeed;
            switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
                case enums.RotateAngle.Rotate_0:
                    switch (_this.selectedBorder) {
                        case enums.AnnotationBorderType.TopEdge:
                        case enums.AnnotationBorderType.TopLeft:
                        case enums.AnnotationBorderType.TopRight:
                            scroll = (_this.markSheetScroll - marksheetElement.scrollTop);
                            clientRect.height = annotationHelper.pixelsToPercentConversion(scroll, annotationHolderRect.height);
                            break;
                        case enums.AnnotationBorderType.BottomEdge:
                        case enums.AnnotationBorderType.BottomLeft:
                        case enums.AnnotationBorderType.BottomRight:
                            scroll = (marksheetElement.scrollTop - _this.markSheetScroll);
                            clientRect.height = clientRect.height + annotationHelper.pixelsToPercentConversion(scroll, annotationHolderRect.height);
                            break;
                    }
                    break;
                case enums.RotateAngle.Rotate_180:
                    switch (_this.selectedBorder) {
                        case enums.AnnotationBorderType.TopEdge:
                        case enums.AnnotationBorderType.TopLeft:
                        case enums.AnnotationBorderType.TopRight:
                            scroll = -(_this.markSheetScroll - marksheetElement.scrollTop);
                            clientRect.height = annotationHelper.pixelsToPercentConversion(scroll, annotationHolderRect.height);
                            break;
                        case enums.AnnotationBorderType.BottomEdge:
                        case enums.AnnotationBorderType.BottomLeft:
                        case enums.AnnotationBorderType.BottomRight:
                            scroll = -(marksheetElement.scrollTop - _this.markSheetScroll);
                            clientRect.height = clientRect.height + annotationHelper.pixelsToPercentConversion(scroll, annotationHolderRect.height);
                            break;
                    }
                    break;
                case enums.RotateAngle.Rotate_90:
                    switch (_this.selectedBorder) {
                        case enums.AnnotationBorderType.RightEdge:
                        case enums.AnnotationBorderType.BottomRight:
                        case enums.AnnotationBorderType.TopRight:
                            scroll = -(marksheetElement.scrollTop - _this.markSheetScroll);
                            clientRect.width = (clientRect.width - annotationHelper.pixelsToPercentConversion(scroll, annotationHolderRect.width));
                            break;
                        case enums.AnnotationBorderType.LeftEdge:
                        case enums.AnnotationBorderType.BottomLeft:
                        case enums.AnnotationBorderType.TopLeft:
                            scroll = (_this.markSheetScroll - marksheetElement.scrollTop);
                            clientRect.width = annotationHelper.pixelsToPercentConversion(scroll, annotationHolderRect.width);
                            break;
                        default:
                            break;
                    }
                    break;
                case enums.RotateAngle.Rotate_270:
                    switch (_this.selectedBorder) {
                        case enums.AnnotationBorderType.RightEdge:
                        case enums.AnnotationBorderType.BottomRight:
                        case enums.AnnotationBorderType.TopRight:
                            scroll = (marksheetElement.scrollTop - _this.markSheetScroll);
                            clientRect.width = (clientRect.width - annotationHelper.pixelsToPercentConversion(scroll, annotationHolderRect.width));
                            break;
                        case enums.AnnotationBorderType.LeftEdge:
                        case enums.AnnotationBorderType.BottomLeft:
                        case enums.AnnotationBorderType.TopLeft:
                            scroll = -(_this.markSheetScroll - marksheetElement.scrollTop);
                            clientRect.width = annotationHelper.pixelsToPercentConversion(scroll, annotationHolderRect.width);
                            break;
                        default:
                            break;
                    }
            }
            return clientRect;
        };
        /**
         * update Marksheet scroll value while rotating during Moving/Resizing
         */
        this.scrollUpdate = function (event, clientRect, pointerOutsideAnnotationHolder) {
            if (pointerOutsideAnnotationHolder) {
                return;
            }
            var e = event.changedPointers[0];
            var marksheetElement = _this.markSheetElement;
            var marksheetElementRect = marksheetElement.getBoundingClientRect();
            var annotationHolderRect = _this.getAnnotationHolderElementProperties();
            var rotatedAngle = annotationHelper.getAngleforRotation(_this.props.displayAngle);
            /** scrollTop adjust value on moving/resizing */
            var scrollSpeed = 30;
            /* Scroll update value on each move/resize*/
            var scrollPosition = event.velocityY >= 0 ? scrollSpeed : -scrollSpeed;
            switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
                case enums.RotateAngle.Rotate_0:
                    switch (_this.selectedBorder) {
                        case enums.AnnotationBorderType.TopEdge:
                        case enums.AnnotationBorderType.TopLeft:
                        case enums.AnnotationBorderType.TopRight:
                            if (Math.round(_this.getCurrentElementBoundRect().top) <= marksheetElementRect.top && scrollPosition < 0
                                || Math.round(_this.getCurrentElementBoundRect().top) >= marksheetElementRect.bottom && scrollPosition > 0) {
                                marksheetElement.scrollTop = marksheetElement.scrollTop + scrollPosition;
                            }
                            break;
                        case enums.AnnotationBorderType.BottomEdge:
                        case enums.AnnotationBorderType.BottomLeft:
                        case enums.AnnotationBorderType.BottomRight:
                            if (Math.round(_this.getCurrentElementBoundRect().bottom) >= marksheetElementRect.bottom && scrollPosition > 0
                                || Math.round(_this.getCurrentElementBoundRect().bottom) <= marksheetElementRect.top && scrollPosition < 0) {
                                marksheetElement.scrollTop = marksheetElement.scrollTop + scrollPosition;
                            }
                            break;
                    }
                    break;
                case enums.RotateAngle.Rotate_180:
                    switch (_this.selectedBorder) {
                        case enums.AnnotationBorderType.TopEdge:
                        case enums.AnnotationBorderType.TopLeft:
                        case enums.AnnotationBorderType.TopRight:
                            if (Math.round(_this.getCurrentElementBoundRect().bottom) <= marksheetElementRect.top && scrollPosition < 0
                                || Math.round(_this.getCurrentElementBoundRect().bottom) >= marksheetElementRect.bottom && scrollPosition > 0) {
                                marksheetElement.scrollTop = marksheetElement.scrollTop + scrollPosition;
                            }
                            break;
                        case enums.AnnotationBorderType.BottomEdge:
                        case enums.AnnotationBorderType.BottomLeft:
                        case enums.AnnotationBorderType.BottomRight:
                            if (Math.round(_this.getCurrentElementBoundRect().top) <= marksheetElementRect.top && scrollPosition < 0
                                || Math.round(_this.getCurrentElementBoundRect().top) >= marksheetElementRect.bottom && scrollPosition > 0) {
                                marksheetElement.scrollTop = marksheetElement.scrollTop + scrollPosition;
                            }
                            break;
                    }
                    break;
                case enums.RotateAngle.Rotate_90:
                    switch (_this.selectedBorder) {
                        case enums.AnnotationBorderType.LeftEdge:
                        case enums.AnnotationBorderType.TopLeft:
                        case enums.AnnotationBorderType.BottomLeft:
                            if (Math.round(_this.getCurrentElementBoundRect().top) <= marksheetElementRect.top && scrollPosition < 0
                                || Math.round(_this.getCurrentElementBoundRect().top) >= marksheetElementRect.bottom && scrollPosition > 0) {
                                marksheetElement.scrollTop = marksheetElement.scrollTop + scrollPosition;
                            }
                            break;
                        case enums.AnnotationBorderType.RightEdge:
                        case enums.AnnotationBorderType.TopRight:
                        case enums.AnnotationBorderType.BottomRight:
                            if (Math.round(_this.getCurrentElementBoundRect().bottom) >= marksheetElementRect.bottom && scrollPosition > 0
                                || Math.round(_this.getCurrentElementBoundRect().bottom) <= marksheetElementRect.top && scrollPosition < 0) {
                                marksheetElement.scrollTop = (marksheetElement.scrollTop + scrollPosition);
                            }
                            break;
                    }
                    break;
                case enums.RotateAngle.Rotate_270:
                    switch (_this.selectedBorder) {
                        case enums.AnnotationBorderType.LeftEdge:
                        case enums.AnnotationBorderType.TopLeft:
                        case enums.AnnotationBorderType.BottomLeft:
                            if (Math.round(_this.getCurrentElementBoundRect().bottom) >= marksheetElementRect.bottom && scrollPosition > 0
                                || Math.round(_this.getCurrentElementBoundRect().bottom) <= marksheetElementRect.top && scrollPosition < 0) {
                                marksheetElement.scrollTop = marksheetElement.scrollTop + scrollPosition;
                            }
                            break;
                        case enums.AnnotationBorderType.RightEdge:
                        case enums.AnnotationBorderType.TopRight:
                        case enums.AnnotationBorderType.BottomRight:
                            if (Math.round(_this.getCurrentElementBoundRect().top) <= marksheetElementRect.top && scrollPosition < 0
                                || Math.round(_this.getCurrentElementBoundRect().top) >= marksheetElementRect.bottom && scrollPosition > 0) {
                                marksheetElement.scrollTop = (marksheetElement.scrollTop + scrollPosition);
                            }
                            break;
                    }
                    break;
            }
            /** Scroll update while Move functionality */
            if (_this.selectedBorder === enums.AnnotationBorderType.Default) {
                while ((Math.round(_this.getCurrentElementBoundRect().bottom) >= marksheetElementRect.bottom &&
                    scrollPosition > 0) || (Math.round(_this.getCurrentElementBoundRect().top) <= marksheetElementRect.top &&
                    scrollPosition < 0)) {
                    if (!_this.checkScroll(marksheetElement, scrollPosition, true)) {
                        break;
                    }
                }
                while ((Math.round(_this.getCurrentElementBoundRect().right) >= marksheetElementRect.right &&
                    scrollPosition > 0) || (Math.round(_this.getCurrentElementBoundRect().left) <= marksheetElementRect.left &&
                    scrollPosition < 0)) {
                    if (!_this.checkScroll(marksheetElement, scrollPosition, false)) {
                        break;
                    }
                }
            }
        };
        /**
         * Incrementing scroll value based on the given input.
         * @param marksheetElements
         * @param scrollVal
         */
        this.checkScroll = function (marksheetElement, scrollVal, isScrollTop) {
            /** Decides whether scrollTop/scrollLeft needs to be adjusted */
            if (isScrollTop) {
                marksheetElement.scrollTop = marksheetElement.scrollTop + scrollVal;
                if (Math.round(marksheetElement.scrollTop) === (Math.round(_this.props.getMarkSheetContainerProperties().
                    element.scrollTop))) {
                    return false;
                }
            }
            else {
                marksheetElement.scrollLeft = marksheetElement.scrollLeft + scrollVal;
                if (Math.round(marksheetElement.scrollLeft) === (Math.round(_this.props.getMarkSheetContainerProperties().
                    element.scrollLeft))) {
                    return false;
                }
            }
        };
        /**
         * This function gets the Annotation overlay cleint rect properties
         */
        this.getAnnotationHolderElementProperties = function () {
            if (_this.props.getAnnotationOverlayElement && _this.props.getAnnotationOverlayElement() !== undefined) {
                return _this.props.getAnnotationOverlayElement().getBoundingClientRect();
            }
            else {
                return ReactDom.findDOMNode(_this).parentElement.getBoundingClientRect();
            }
        };
        /**
         * This method will find the difference from the annoation left/top position to the mouse/touch clicked position.
         */
        this.elementSelected = function (e) {
            _this.setInitialCoordinates();
            var annotationHolderRect = _this.getAnnotationHolderElementProperties();
            var annotationHolderInitialTop = annotationHolderRect.top +
                _this.props.getMarkSheetContainerProperties().element.scrollTop;
            var annotationHolderLeft = annotationHolderRect.left +
                _this.props.getMarkSheetContainerProperties().element.scrollLeft;
            /* Below variable stores the difference from the annoation left position to the mouse/touch clicked position */
            _this.mouseDownCoordinates.pointerDifferenceFromAnnotationX = (e.pageX +
                _this.props.getMarkSheetContainerProperties().element.scrollLeft) -
                ((_this.getCurrentElementBoundRect().left +
                    _this.props.getMarkSheetContainerProperties().element.scrollLeft - annotationHolderLeft));
            /* Below variable stores the difference from the annoation top position to the mouse/touch clicked position */
            _this.mouseDownCoordinates.pointerDifferenceFromAnnotationY = e.pageY -
                (_this.getCurrentElementBoundRect().top - annotationHolderInitialTop);
            /** To enable the border on moving the annotation */
            _this.switchBorder(true);
            /* To set the innerHTML of the current element */
            _this.elementHTML = ReactDom.findDOMNode(_this).innerHTML;
        };
        /**
         * This method will retain initial dimensions if the annotation is resized beyond
         * the boundaries of response or is moved to the gray area.
         */
        this.retainInitialDimension = function (e) {
            var isMouseLeavedAnnotation = true;
            var minWidth = 0;
            var minHeight = 0;
            if (_this.selectedBorder !== enums.AnnotationBorderType.Default) {
                var currentRect = _this.getCurrentElementBoundRect();
                isMouseLeavedAnnotation = _this.isPointerInsideResponse(e, currentRect, _this.getAnnotationHolderElementProperties());
                // Minimum Resize value for dynamic annotation is 3%. Below this minimum level annotation can't resize.
                _this.resizeMinVal.width = 0.03 * _this.getAnnotationHolderElementProperties().width;
                _this.resizeMinVal.height = 0.03 * _this.getAnnotationHolderElementProperties().width;
                var blnIsRetain = annotationHelper.getDimensionsToRetain(currentRect, _this.resizeMinVal, _this.initialCoordinates, _this.props.displayAngle, _this.props.annotationData.stamp);
                // added checking to ensure annotation resizing has crossed the stitched image gap.
                // as the annotation is in same image mouse will not show as it leaved the page.
                if (blnIsRetain || isMouseLeavedAnnotation || _this.isAnnotationOverlapsStitchedGap) {
                    _this.setState({
                        width: _this.initialCoordinates.width,
                        height: _this.initialCoordinates.height,
                        top: _this.initialCoordinates.y,
                        left: _this.initialCoordinates.x
                    });
                }
            }
            else {
                if (_this.retainPosition) {
                    _this.annotationOutsideResponse = false;
                    _this.setState({
                        width: _this.initialCoordinates.width,
                        height: _this.initialCoordinates.height,
                        top: _this.initialCoordinates.y,
                        left: _this.initialCoordinates.x
                    });
                    _this.hasMovedToNextPage = false;
                    _this.hideMovingElementOnOtherPage();
                }
            }
            _this.retainPosition = false;
            _this.isAnnotationOverlapsStitchedGap = false;
        };
        /**
         * This method hide the current moving element while moving to other page
         */
        this.hideMovingElementOnOtherPage = function () {
            var movingElementProperties = {
                event: null,
                innerHTML: null,
                holderElement: null,
                clientRect: null,
                visible: false,
                stamp: null
            };
            markingActionCreator.dynamicAnnotationMoveAction(movingElementProperties);
        };
        /**
         * This method will find whether the mouse/touch pointer is outside Response.
         * @param e
         * @param currentRect
         */
        this.isPointerInsideResponse = function (e, currentRect, containerRect) {
            var pointerInGrayArea = _this.isPointerInGrayArea(e, _this.annotationOverlayElement, _this.props.displayAngle);
            return (_this.isPointerInsideElement(e, containerRect) ||
                pointerInGrayArea.inGrayArea);
        };
        /**
         * This method will find whether the mouse/touch pointer is outside the particular element.
         * @param e
         * @param element
         */
        this.isPointerInsideElement = function (e, elementRect) {
            return (elementRect.top > e.clientY ||
                elementRect.bottom < e.clientY ||
                elementRect.left > e.clientX ||
                elementRect.right < e.clientX);
        };
        /* This method will check whether the pointer is in gray area region
         * @param e
         */
        this.isPointerInGrayArea = function (e, annotationOverlayElement, rotatedAngle) {
            var inGrayArea = false;
            var isInsideStitchedPage = true;
            // Check whether the current hovering element is stitched image or not.
            var isStitchedImage = false;
            // Double checking to ensure that the current mouse pointer is inside the annotation overlay.
            if (annotationOverlayElement && annotationOverlayElement.id.indexOf('annotationoverlay') >= 0) {
                var prevImageZone = annotationOverlayElement.previousSibling;
                if (prevImageZone != null && prevImageZone.attributes.getNamedItem('class') !== null &&
                    prevImageZone.attributes.getNamedItem('class').nodeValue !== null &&
                    prevImageZone.attributes.getNamedItem('class').nodeValue.indexOf('marksheet-img stitched') > -1) {
                    isStitchedImage = true;
                }
                // Update the overlay boundary with the hovering annoation holder to get the stitched image info.
                _this.resetOverlayStitchedBoundary(annotationOverlayElement, rotatedAngle);
            }
            if (isStitchedImage) {
                var propsForGrayAreaCheck = annotationHelper.setElementPropertiesForGrayAreaCheck(e.clientX, e.clientY, annotationOverlayElement, _this.props.getMarkSheetContainerProperties().element, rotatedAngle);
                // This check will be applicable only for stitched images as there is a new gap introduced
                // b/w stitched zones.
                isInsideStitchedPage = annotationHelper.isAnnotationInsideStitchedImage(_this.overlayBoundary, rotatedAngle, e.clientX, e.clientY);
                inGrayArea = !(annotationHelper.checkGreyAreaAfterRotation(propsForGrayAreaCheck.element, propsForGrayAreaCheck.left, propsForGrayAreaCheck.top, 0, 0, propsForGrayAreaCheck.angle, propsForGrayAreaCheck.scrollTop));
            }
            (!isInsideStitchedPage || inGrayArea) === true ?
                markingActionCreator.onAnnotationDraw(false) : markingActionCreator.onAnnotationDraw(true);
            return { 'inGrayArea': inGrayArea, 'isInsideStitchedPage': isInsideStitchedPage };
        };
        /**
         * This method will set the initial coordinates while performing move/resize
         */
        this.setInitialCoordinates = function () {
            var annotationrect = _this.getCurrentElementBoundRect();
            _this.annotationRect = {
                width: annotationrect.width, height: annotationrect.height, top: annotationrect.top,
                left: annotationrect.left, bottom: 0, right: 0
            };
            _this.initialCoordinates = {
                width: _this.state.width, height: _this.state.height,
                x: _this.state.left, y: _this.state.top
            };
        };
        /**
         * This method will return an zIndex value for the annotation
         */
        this.getZindexValue = function () {
            return Math.round((_this.props.imageWidth * _this.props.imageHeight) -
                (_this.props.annotationData.width * _this.props.annotationData.height));
        };
        /**
         * This method will get fired when the mouse over the annotation area
         */
        this.onMouseOver = function (e) {
            // Mouse over event is firing in mobile devices
            if (!_this.isTouchDevice) {
                if (!_this.isPreviousAnnotation) {
                    responseActionCreator.setMousePosition(-1, -1);
                }
                _this.switchBorder(true);
            }
        };
        /**
         * This method will get fired when the mouse leave the annotation area
         */
        this.onMouseLeave = function (e) {
            // Mouse Leave and Mouse enter events are firing in mobile devices
            if (!_this.isTouchDevice) {
                _this.switchBorder(false);
            }
        };
        /**
         * This method will get fired when the mouse click happens
         */
        this.onClick = function (e) {
            // allow stamping static annotation over dynamic if a annotation is selected from toolbar
            e.stopPropagation();
            e.preventDefault();
        };
        /**
         * Show the Resize Border over Annotation.
         * @param drawMode
         */
        this.showBorder = function (drawMode) {
            var border = [];
            /** On drawing an annotation, then pointerevents for the reszier will be disabled.
             * Because while drawing over other annotations the resizer will get displayed, this will cause the cursor issue
             */
            var stylePointer = {
                pointerEvents: drawMode ? 'none' : ''
            };
            border.push(_this.getBorderAnnotation().map(function (item) {
                return (React.createElement("span", {id: _this.props.id + '_' + item.className, className: item.className, onMouseOver: !_this.props.isActive ? null : _this.onResizeMouseOver.bind(_this, item.borderType), onMouseLeave: !_this.props.isActive ? null : _this.onResizeMouseLeave.bind(_this, item.borderType), ref: item.className, style: stylePointer, key: _this.props.id + '_' + item.borderType.toString()}));
            }));
            return border;
        };
        /**
         * Creating the Border for Resize.
         */
        this.getBorderAnnotation = function () {
            var resizeProperties;
            switch (_this.props.annotationData.stamp) {
                case enums.DynamicAnnotation.Ellipse:
                case enums.DynamicAnnotation.Highlighter:
                    resizeProperties = [
                        { className: 'resize-tl', borderType: enums.AnnotationBorderType.TopLeft },
                        { className: 'resize-t', borderType: enums.AnnotationBorderType.TopEdge },
                        { className: 'resize-tr', borderType: enums.AnnotationBorderType.TopRight },
                        { className: 'resize-r', borderType: enums.AnnotationBorderType.RightEdge },
                        { className: 'resize-br', borderType: enums.AnnotationBorderType.BottomRight },
                        { className: 'resize-b', borderType: enums.AnnotationBorderType.BottomEdge },
                        { className: 'resize-bl', borderType: enums.AnnotationBorderType.BottomLeft },
                        { className: 'resize-l', borderType: enums.AnnotationBorderType.LeftEdge }];
                    break;
                case enums.DynamicAnnotation.HorizontalLine:
                case enums.DynamicAnnotation.HWavyLine:
                    resizeProperties = [
                        { className: 'resize-r', borderType: enums.AnnotationBorderType.RightEdge },
                        { className: 'resize-l', borderType: enums.AnnotationBorderType.LeftEdge }];
                    break;
                case enums.DynamicAnnotation.VWavyLine:
                    resizeProperties = [
                        { className: 'resize-t', borderType: enums.AnnotationBorderType.TopEdge },
                        { className: 'resize-b', borderType: enums.AnnotationBorderType.BottomRight }];
                    break;
                default:
                    break;
            }
            return resizeProperties;
        };
        /**
         * Switch the Border of the Annotations
         */
        this.switchBorder = function (isShowBorder) {
            // check if the annotation is previous or not
            if (!_this.isPreviousAnnotation) {
                _this.setState({
                    isShowBorder: isShowBorder
                });
                _this.props.setDynamicAnnotationBorder(isShowBorder);
            }
        };
        /**
         * Get the annotation color
         */
        this.getAnnotationColor = function () {
            return _this.props.annotationData.red + ',' + _this.props.annotationData.green + ',' +
                _this.props.annotationData.blue;
        };
        /**
         * Annotation panstart event method
         */
        this.annotationPanStart = function (event) {
            _this.props.enableImageContainerScroll(false);
            /** Pan Start event is fired only for annotations that are active only  */
            if (_this.isAnnotationPannable && !annotationHelper.isEventCanceled(event)) {
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Annotation);
                stampActionCreator.setDynamicAnnotationMoveInScript(true);
                _this.annotationOverlayElement = _this.props.getAnnotationOverlayElement();
                _this.markSheetElement = _this.props.getMarkSheetContainerProperties().element;
                var isCommentBoxOpen = stampStore.instance.SelectedOnPageCommentClientToken !== undefined;
                // closing exiting comment box if it is open
                if (isCommentBoxOpen) {
                    stampActionCreator.showOrHideComment(false);
                }
                /* In Touch devices we will set the selected border in pan start otherwise we will
                   set that in Press */
                if (_this.isTouchDevice) {
                    var x = event.center.x - event.deltaX;
                    var y = event.center.y - event.deltaY;
                    var element = htmlUtilities.getElementFromPosition(x, y);
                    _this.selectedBorder = _this.getAnnotationBorderType(element.className);
                }
                if (_this.selectedBorder !== enums.AnnotationBorderType.Default) {
                    _this.annotationRect = _this.getCurrentElementBoundRect();
                    _this.setInitialCoordinates();
                    _this.markSheetScroll = _this.props.getMarkSheetContainerProperties().element.scrollTop;
                }
                else {
                    _this.elementSelected(event.changedPointers[0]);
                    /*remove the selection from Document before dragging the element*/
                    htmlUtilities.removeSelectionFromDocument();
                }
                _this.switchBorder(true);
            }
        };
        /** Disabling the select start */
        this.disableSelectStart = function () {
            return false;
        };
        /**
         * Annotation panmove event method
         */
        this.annotationPanMove = function (event) {
            if (_this.isAnnotationPannable && !annotationHelper.isResponseReadOnly()
                && !annotationHelper.isEventCanceled(event)) {
                // This is to ensure that for stitched image gap validating we need to apply
                // the hovering element on runtime.
                _this.isAnnotationMoving = true;
                _this.validateAction(event);
                _this.props.setDynamicAnnotationisMoving(true);
                document.addEventListener('onselectstart', _this.disableSelectStart, false);
            }
            stampActionCreator.setDynamicAnnotationMoveInScript(true);
            markingActionCreator.showOrHideRemoveContextMenu(false);
        };
        /**
         * Annotation panend event method
         */
        this.annotationPanEnd = function (event) {
            if (_this.isAnnotationPannable && !annotationHelper.isEventCanceled(event)) {
                var touchCoordinates = event.changedPointers[0];
                var annotationOutsideResponse = false;
                /** Fired if the annotation is placed outside the response */
                if (_this.annotationOutsideResponse && !_this.retainPosition) {
                    if (_this.hasMovedToNextPage) {
                        _this.hasMovedToNextPage = false;
                        _this.hideMovingElementOnOtherPage();
                        _this.annotationOutsideResponse = false;
                        _this.updateMoveAnnotation(_this.nextHolderElement);
                        _this.props.doEnableClickHandler(true);
                    }
                    else {
                        _this.annotationOutsideResponse = false;
                        _this.retainPosition = false;
                        annotationOutsideResponse = true;
                    }
                }
                else {
                    if (_this.selectedBorder !== enums.AnnotationBorderType.Default) {
                        /**
                         * Z-index of the annotation is updated while performing resize so as to persist
                         * selection while overlapping with larger annotation
                         */
                        _this.setState({ zIndex: _this.getZindexValue() });
                    }
                    /** disable border selection */
                    if (!_this.isTouchDevice) {
                        // As per the dynamic annotation changes in devices, we don't need to
                        // remove the selection from annotations.
                        _this.switchBorder(false);
                    }
                    _this.retainInitialDimension(touchCoordinates);
                    _this.selectedBorder = enums.AnnotationBorderType.Default;
                    /** To maintain uniformity in thickness the attributes of the Hline are rounded to whole numbers */
                    if (_this.props.annotationData.stamp === enums.DynamicAnnotation.HorizontalLine ||
                        _this.props.annotationData.stamp === enums.DynamicAnnotation.VWavyLine ||
                        _this.props.annotationData.stamp === enums.DynamicAnnotation.HWavyLine) {
                        // this settimeout causes issues when response is unmounted. this check is to handle this error
                        var annotationHolderRect = _this.getAnnotationHolderElementProperties();
                        _this.updateAnnotationThicknessOnResize(annotationHolderRect);
                    }
                    if (!_this.hasMovedToNextPage) {
                        _this.saveAnnotation();
                    }
                }
                /** Delete annotation if its dragged in to stamp pannel */
                if (_this.isInStampPanel || annotationOutsideResponse || _this.isAnnotationInsideStitchedImageGap) {
                    _this.removeAnnotation();
                    _this.props.doEnableClickHandler(true);
                }
                _this.isAnnotationInsideStitchedImageGap = false;
                _this.isAnnotationOverlapsStitchedGap = false;
                _this.isAnnotationMoving = false;
                _this.props.setDynamicAnnotationisMoving(false);
                /** Delete the annotation when moved beyond the response */
                toolbarActionCreator.PanStampToDeleteArea(false, touchCoordinates.clientX, touchCoordinates.clientY);
            }
            _this.props.enableImageContainerScroll(true);
            _this.props.enableAnnotationOverlayPan(true);
            if (_this.hasMovedToNextPage) {
                _this.switchBorder(true);
            }
            stampActionCreator.setDynamicAnnotationMoveInScript(false);
            if (!_this.isTouchDevice) {
                // As per the dynamic annotation changes in devices, we don't need to
                // remove the selection from annotations.
                _this.props.setDynamicAnnotationBorder(false);
            }
            markingActionCreator.onAnnotationDraw(true);
            document.removeEventListener('onselectstart', _this.disableSelectStart, false);
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Annotation);
        };
        /**
         * input event for annotation
         */
        this.annotationInput = function (event) {
            // allow stamping static annotation over dynamic if a annotation is selected from toolbar
            if (!_this.isStampSelected || markingStore.instance.contextMenuDisplayStatus) {
                _this.props.enableAnnotationOverlayPan(true);
                event.srcEvent.stopPropagation();
                event.srcEvent.preventDefault();
            }
            else {
                _this.props.enableAnnotationOverlayPan(false);
            }
        };
        /**
         * Annotation press event method
         */
        this.annotationPress = function (event) {
            /* In Touch devices we will set the selected border in pan start otherwise we will
               set that in Press */
            if (!_this.isTouchDevice) {
                var x = event.center.x - event.deltaX;
                var y = event.center.y - event.deltaY;
                var element = htmlUtilities.getElementFromPosition(x, y);
                _this.selectedBorder = _this.getAnnotationBorderType(element.className);
            }
            if (_this.isTouchDevice) {
                _this.onTouchHold(event);
            }
        };
        /**
         * Switch the Border of the Annotations while tapping on devices
         */
        this.onTouchStart = function (e) {
            var stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
            if (stamp) {
                _this.deSelectPreviousStamp(e, true);
                // hide border if border is showing
                if (_this.state.isShowBorder) {
                    _this.switchBorder(false);
                }
                that = _this;
            }
            else if (_this.props.isActive) {
                if (that) {
                    if (that.state.isShowBorder) {
                        that.setState({
                            isShowBorder: false
                        });
                    }
                }
                that = _this;
                _this.switchBorder(true);
                // Added as part of defect fix 29238 Focus of the annotation is moved but the previous 'remove annotation' is still shown
                markingActionCreator.showOrHideRemoveContextMenu(false);
                // allow stamping static annotation over dynamic if a annotation is selected from toolbar
                if (!_this.isPreviousAnnotation && !_this.isStampSelected) {
                    e.preventDefault();
                }
            }
        };
        /**
         * Switch the Border of the Annotations while tapping on devices
         */
        this.onTapHandler = function (e) {
            if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
                var currentImageZone = (_this.props.imageZone) ? _this.props.imageZone :
                    ((_this.props.imageZones && _this.props.imageZones.length > 0) ? annotationHelper.getImageZone(_this.overlayBoundary, annotationHelper.getAngleforRotation(_this.props.displayAngle), e.changedPointers[0].clientX, e.changedPointers[0].clientY, _this.props.imageZones) : 0);
                // this.overlayBoundary become undefind on double tab so added an undefined check
                // before finding the view whole response visiblity check.
                if (currentImageZone && _this.viewWholePageVisibilityCheck(currentImageZone)) {
                    responseActionCreator.viewWholePageLinkAction(true, currentImageZone);
                }
            }
        };
        /*
         * Returns true, when view whole page button is suppose to display in script.
         */
        this.viewWholePageVisibilityCheck = function (imageZone) {
            return (!(imageZone.topEdge === 0
                && imageZone.leftEdge === 0
                && imageZone.width === 100
                && imageZone.height === 100)
                && imageZone.isViewWholePageLinkVisible
                && toolbarStore.instance.selectedStampId === 0
                && toolbarStore.instance.panStampId === 0
                && !stampStore.instance.isDynamicAnnotationActive);
        };
        /**
         * For HLine, left/top values should be in rounded pixels to fix the thickness issue
         */
        this.updateAnnotationThicknessOnResize = function (annotationHolderRect) {
            var rotatedAngle = annotationHelper.getAngleforRotation(_this.props.displayAngle);
            var holderWidth = annotationHolderRect.width;
            var holderHeight = annotationHolderRect.height;
            if (rotatedAngle === enums.RotateAngle.Rotate_90 ||
                rotatedAngle === enums.RotateAngle.Rotate_270) {
                holderWidth = annotationHolderRect.height;
                holderHeight = annotationHolderRect.width;
            }
            _this.setState({
                left: annotationHelper.getRoundedValueAnnotationThickness(_this.state.left, holderWidth),
                top: annotationHelper.getRoundedValueAnnotationThickness(_this.state.top, holderHeight)
            });
        };
        /**
         * check annotation thickness
         */
        this.checkThickness = function () {
            //if (this.isRenderedFully) {
            _this.checkThicknessOnResize();
            //}
        };
        /**
         * removes the selected annotation.
         */
        this.removeAnnotation = function () {
            _this.isInStampPanel = false;
            var annotationClientTokenToBeDeleted = [];
            annotationClientTokenToBeDeleted.push(_this.props.annotationData.clientToken);
            markingActionCreator.removeAnnotation(annotationClientTokenToBeDeleted);
        };
        /**
         * After DOM update set the annotation thickness
         */
        this.checkThicknessOnResize = function () {
            // this settimeout causes issues when response is unmounted. this check is to handle this error
            var annotationHolderRect = _this.getAnnotationHolderElementProperties();
            /** If the function is triggered on the normal basis, the thickness seems
             * to differ in uniformity, hence a timeout is applied for persisting the thickness
             */
            setTimeout(function () {
                _this.updateAnnotationThicknessOnResize(annotationHolderRect);
            }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
        };
        /**
         * initiateRender
         */
        this.initiateRender = function () {
            _this.loadEmpty = true;
            /** To resolve rerendering issue, at first the line element
             * is replaced by empty div and rerendered again with a timeout
             */
            _this.setState({ renderedOn: Date.now() });
            _this.loadEmpty = false;
            setTimeout(function () {
                _this.setState({ renderedOn: Date.now() });
            }, 500);
        };
        /* checks whether the pointer is in comment holder
         * @param e
         */
        this.isPointerInCommentHolder = function (e) {
            var currentPointerElement = htmlUtilities.getElementFromPosition(e.clientX, e.clientY);
            if (currentPointerElement != null && currentPointerElement.attributes.getNamedItem('class') !== null &&
                currentPointerElement.attributes.getNamedItem('class').nodeValue !== null) {
                var nodeValue = currentPointerElement.attributes.getNamedItem('class').nodeValue;
                var arrayOfClasses = ['comments-bg', 'comment-box', 'commentbox-inner', 'comment-box-header',
                    'comment-heading', 'comment-icon-holder', 'offpage-comment-icon', 'comment-box-content',
                    'comment-input', 'comment-textbox', 'commentbox-fader'];
                if (arrayOfClasses.indexOf(nodeValue) > -1) {
                    return true;
                }
            }
            return false;
        };
        /**
         * This method will set selection border while stamping an dynamic annotation
         * in devices - that will hold the previously selected dynamic stamp
         * @protected
         * @memberof DynamicStampBase
         */
        this.setBorderOnStamping = function () {
            if (_this.isTouchDevice) {
                if (_this.props.isActive && _this.props.isAnnotationAdded) {
                    _this.deSelectPreviousStamp();
                    that = _this;
                    _this.switchBorder(true);
                }
            }
        };
        /**
         * This will remove/ add selection
         * @protected
         * @memberof DynamicStampBase
         */
        this.addOrRemoveSelectionBorder = function (isSelected) {
            if (_this.state.isShowBorder && !isSelected) {
                _this.switchBorder(isSelected);
            }
        };
        /**
         * We've to remove the dynamic annotation selection if any stamp is selected in fav bar.
         * @private
         * @memberof Ellipse
         */
        this.onStampSelected = function () {
            if (_this.state.isShowBorder) {
                _this.addOrRemoveSelectionBorder(false);
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * This will update the dynamic stamp selection.
         * @protected
         * @memberof DynamicStampBase
         */
        this.updateSelection = function (isSelected) {
            _this.addOrRemoveSelectionBorder(isSelected);
        };
        /**
         * This will deselect the previously selected stamp.
         * @private
         * @memberof DynamicStampBase
         */
        this.deSelectPreviousStamp = function (e, preventEvent) {
            if (preventEvent === void 0) { preventEvent = false; }
            if (that) {
                if (that.state.isShowBorder) {
                    that.setState({
                        isShowBorder: false
                    });
                    that.props.setDynamicAnnotationBorder(false);
                    if (e && preventEvent) {
                        // prevent for adding selected stamp - we just need to unselect
                        // the existing annotation. on next click we will add the stamp
                        e.preventDefault();
                    }
                }
            }
        };
        this.onTouchStart = this.onTouchStart.bind(this);
        this.resetOverlayStitchedBoundary();
        this.checkThicknessOnAnimationCompleted = this.checkThicknessOnAnimationCompleted.bind(this);
    }
    /**
     * This method will fire on Resize Mouse Over.
     */
    DynamicStampBase.prototype.onResizeMouseOver = function (borderType, e) {
        e.preventDefault();
        e.stopPropagation();
        // Mouse over event is firing in mobile devices
        if (!this.isTouchDevice) {
            this.switchBorder(true);
        }
    };
    /**
     * This method will fire on Resize Mouse Leave.
     */
    DynamicStampBase.prototype.onResizeMouseLeave = function (borderType, e) {
        e.preventDefault();
        e.stopPropagation();
        // Mouse leave event is firing in mobile devices
        if (!this.isTouchDevice) {
            this.switchBorder(false);
            if (this.selectedBorder !== enums.AnnotationBorderType.Default) {
                this.switchBorder(true);
            }
        }
    };
    /**
     * To check whether the pointer is on stamp panel
     */
    DynamicStampBase.prototype.isPointerInStampPanel = function (e) {
        var element = htmlUtilities.getElementFromPosition(e.clientX, e.clientY);
        if (element && element.id) {
            var iterationCount = 0;
            while (element && element.id !== 'stampPanel' && iterationCount < 8) {
                iterationCount++;
                element = element.parentNode;
            }
            if (element && element.id === 'stampPanel') {
                return true;
            }
        }
    };
    /**
     * Checks if the element is outside the response
     * @param {ClientRectDOM} holderElement
     * @param {any} clientRect
     * @param {number} rotatedAngle
     * @returns
     */
    DynamicStampBase.prototype.checkElementOutsideResponse = function (holderElement, clientRect, rotatedAngle) {
        var top = clientRect.top;
        var left = clientRect.left;
        var holderRectWidth = holderElement.width;
        var holderRectHeight = holderElement.height;
        if (rotatedAngle === enums.RotateAngle.Rotate_270 || rotatedAngle === enums.RotateAngle.Rotate_90) {
            holderRectWidth = holderElement.height;
            holderRectHeight = holderElement.width;
        }
        return ((annotationHelper.percentToPixelConversion(top, holderRectHeight) +
            annotationHelper.percentToPixelConversion(clientRect.height, holderRectHeight) > holderRectHeight) ||
            top < 0 ||
            left < 0 ||
            (annotationHelper.percentToPixelConversion(left, holderRectWidth) +
                annotationHelper.percentToPixelConversion(clientRect.width, holderRectWidth)) >
                holderRectWidth);
    };
    /**
     * Updating Annotation position while moving
     * @param {HTMLElement} holderElement
     */
    DynamicStampBase.prototype.updateMoveAnnotation = function (holderElement) {
        if (holderElement) {
            var annotationHolderRect = holderElement.getBoundingClientRect();
            var rotatedAngle = Number(holderElement.getAttribute('data-rotatedangle'));
            var topAboveCurrentZone = Number(holderElement.getAttribute('data-topabovecurrentzone'));
            var isALinkedPage = JSON.parse(holderElement.getAttribute('data-isalinkedpage'));
            var scriptImage = {
                imageWidth: Number(holderElement.getAttribute('data-imagewidth')),
                imageHeight: Number(holderElement.getAttribute('data-imageheight'))
            };
            var zoneTop = isALinkedPage || !this.props.isEBookMarking ? 0 : Number(holderElement.getAttribute('data-zonetop'));
            // Defect 36333 fix - no need to adjust the clientRectOnNextPage value (top-height) from getAnnotationDimensions()
            // when we move a dynamic annotation to a page in rotation angle 90/180,
            // so we are adding the value from here and negate it from getAnnotationDimensions()
            this.adjustAnnotationPositionOnRotation(rotatedAngle);
            var top_3 = this.adjustAnnotationPoistionOnStitchedGap(this.clientRectOnNextPage.top, rotatedAngle, holderElement, true);
            var annotationLeftinPx = (this.clientRectOnNextPage.left / 100) * scriptImage.imageWidth;
            // for ebookmarking components, we should add zonetop along with annotation top if its a zoned page
            //Zone Top will be 0 if page is linked one
            var annotationTopinPx = (zoneTop + (top_3 / 100) * scriptImage.imageHeight);
            var annotationWidthinPx = (this.clientRectOnNextPage.width / 100) * scriptImage.imageWidth;
            var annotationHeightinPx = (this.clientRectOnNextPage.height / 100) * scriptImage.imageHeight;
            // This is causing issue while placing annotation on different images
            // and after discussed with TA commenting this code for the time being.
            /*if (rotatedAngle === enums.RotateAngle.Rotate_90) {
                annotationTopinPx = annotationTopinPx + annotationHeightinPx;
            } else if (rotatedAngle === enums.RotateAngle.Rotate_180) {
                annotationLeftinPx = annotationLeftinPx + annotationWidthinPx;
            }*/
            var arrayOfAnnotationHolderProperties = holderElement.id.split('_');
            var outputPageNo = Number(arrayOfAnnotationHolderProperties[3]);
            var pageNo = this.props.isEBookMarking ? Number(holderElement.getAttribute('data-currentimagepageno')) :
                Number(arrayOfAnnotationHolderProperties[1]);
            var imageClusterId = Number(arrayOfAnnotationHolderProperties[2]);
            if (this.props.doApplyLinkingScenarios === true && pageNo === 0) {
                // annotation in stitched image. we need to add the height of zones above the currect zone
                // when in linking scenarios are enabled
                annotationTopinPx += topAboveCurrentZone;
            }
            if (this.props.clientToken !== undefined) {
                markingActionCreator.updateAnnotation(annotationLeftinPx, annotationTopinPx, imageClusterId, outputPageNo, pageNo, this.props.clientToken, annotationWidthinPx, annotationHeightinPx);
                this.addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo, isALinkedPage);
            }
        }
    };
    /**
     * find adjusted clientRectOnNextPage values
     * @param rotatedAngle
     */
    DynamicStampBase.prototype.adjustAnnotationPositionOnRotation = function (rotatedAngle) {
        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_90:
                this.clientRectOnNextPage.top = this.clientRectOnNextPage.top + this.clientRectOnNextPage.height;
                break;
            case enums.RotateAngle.Rotate_180:
                this.clientRectOnNextPage.left = this.clientRectOnNextPage.left + this.clientRectOnNextPage.width;
                break;
        }
    };
    /**
     * Updating height attribute for HWavyLine and HorizontalLine.
     * @param {ClientRectDOM} clientRectInPixels
     * @param {Number} rotatedAngle
     * @returns
     */
    DynamicStampBase.prototype.updateAttributesForAnnotation = function (clientRectInPixels, rotatedAngle) {
        switch (this.props.annotationData.stamp) {
            case enums.DynamicAnnotation.HorizontalLine:
            case enums.DynamicAnnotation.HWavyLine:
                switch (rotatedAngle) {
                    case enums.RotateAngle.Rotate_0:
                    case enums.RotateAngle.Rotate_180:
                        clientRectInPixels.height = this._currentAnnotationElement.height;
                        break;
                    case enums.RotateAngle.Rotate_270:
                    case enums.RotateAngle.Rotate_90:
                        clientRectInPixels.height = this._currentAnnotationElement.width;
                        break;
                }
                break;
            case enums.DynamicAnnotation.VWavyLine:
                switch (rotatedAngle) {
                    case enums.RotateAngle.Rotate_0:
                    case enums.RotateAngle.Rotate_180:
                        clientRectInPixels.width = this._currentAnnotationElement.width;
                        break;
                    case enums.RotateAngle.Rotate_270:
                    case enums.RotateAngle.Rotate_90:
                        clientRectInPixels.width = this._currentAnnotationElement.height;
                        break;
                }
                break;
        }
        return clientRectInPixels;
    };
    /**
     * Validate the coordinates on move.
     * @param coordinate
     * @param annotationHolderDimension
     * @param annotationDimension
     */
    DynamicStampBase.prototype.validateCoordinatePosition = function (coordinate, annotationHolderDimension, annotationDimension) {
        var updatedCoordinate;
        if (coordinate >= 0 && coordinate <= (annotationHolderDimension - annotationDimension)) {
            updatedCoordinate = false;
        }
        else {
            updatedCoordinate = true;
        }
        return updatedCoordinate;
    };
    /**
     * Setting the updated clientRect values to the state.
     * @param clientRect
     * @param rotatedAngle
     */
    DynamicStampBase.prototype.setClientRect = function (clientRect) {
        this.isAnnotationModified = true;
        this.setState({
            width: clientRect.width,
            height: clientRect.height,
            top: clientRect.top,
            left: clientRect.left
        });
        /** Clearing previously set values */
        this.topVals = [];
        this.leftVals = [];
    };
    /**
     * return annotation top and left values
     */
    DynamicStampBase.prototype.getAnnotationTopLeft = function () {
        var annotationTop = 0;
        var annotationLeft = 0;
        if (this.props.isInFullResponseView || this.props.annotationData.pageNo > 0) {
            annotationTop = this.props.annotationData.topEdge;
            annotationLeft = this.props.annotationData.leftEdge;
        }
        else {
            if (this.props.doApplyLinkingScenarios) {
                if (this.props.isInLinkedPage) {
                    if (this.props.annotationData.isInSkippedZone &&
                        this.props.annotationData.isInSkippedZone === true) {
                        annotationLeft = this.props.annotationData.leftEdge + this.props.annotationData.skippedZoneLeft;
                        annotationTop = this.props.annotationData.topEdge - this.props.annotationData.topAboveZone
                            + this.props.annotationData.skippedZoneTop;
                    }
                    else {
                        annotationLeft = this.props.annotationData.leftEdge + this.props.zoneLeft;
                        annotationTop = this.props.annotationData.topEdge - this.props.topAboveCurrentZone
                            + this.props.zoneTop;
                    }
                }
                else {
                    annotationLeft = this.props.annotationData.leftEdge;
                    annotationTop = this.props.annotationData.topEdge - this.props.topAboveCurrentZone;
                }
            }
            else {
                annotationTop = this.props.annotationData.topEdge;
                annotationLeft = this.props.annotationData.leftEdge;
            }
        }
        return [annotationTop, annotationLeft];
    };
    /**
     * Set the Initial Dimenstions while drawing annotation.
     */
    DynamicStampBase.prototype.setInitialDimensions = function (clientToken, isDrawEnd, isStamping, isFirstRender) {
        /** As this function is for displaying the dynamic annotations while adding, no need to use the logic for move/ resize.
         * Since this condition have to use with all other dynamic annotations, moved as a common condition inside the function.
         */
        if (!this.isAnnotationModified) {
            var annotationHolderRect = this.getAnnotationHolderElementProperties();
            var dimensions = { left: 0, bottom: 0, height: 0, right: 0, top: 0, width: 0 };
            var width = annotationHelper.percentToPixelConversion(this.annotationRect.width, annotationHolderRect.width);
            var height = annotationHelper.percentToPixelConversion(this.annotationRect.height, annotationHolderRect.height);
            // Calculate annotation top,left, width
            this.calculateAnnotationDimensions();
            var rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);
            this.annotationRect.top = this.adjustAnnotationPoistionOnStitchedGap(this.annotationRect.top, rotatedAngle, this.props.getAnnotationOverlayElement());
            // Get the annotation initial dimensions.
            if (isFirstRender) {
                dimensions = this.getAnnotationDimensions(isFirstRender);
            }
            else {
                dimensions = this.getAnnotationDimensions();
            }
            if ((this.props.annotationData.stamp === enums.DynamicAnnotation.HorizontalLine) ||
                (this.props.annotationData.stamp === enums.DynamicAnnotation.HWavyLine) ||
                (this.props.annotationData.stamp === enums.DynamicAnnotation.VWavyLine)) {
                var isHorizontal = true;
                if (this.props.annotationData.stamp === enums.DynamicAnnotation.VWavyLine) {
                    isHorizontal = !isHorizontal;
                }
                // Get the Hline dimensions.
                dimensions = annotationHelper.getLineDimensions(dimensions, clientToken, this.props.displayAngle, this.leftVals[0], this.topVals[0], this.props.annotationData.width, this.props.annotationData.height, isHorizontal);
                var holderWidth = annotationHolderRect.width;
                var holderHeight = annotationHolderRect.height;
                if (rotatedAngle === enums.RotateAngle.Rotate_90 ||
                    rotatedAngle === enums.RotateAngle.Rotate_270) {
                    holderWidth = annotationHolderRect.height;
                    holderHeight = annotationHolderRect.width;
                }
                dimensions.left = annotationHelper.getRoundedValueAnnotationThickness(dimensions.left, holderWidth);
                dimensions.top = annotationHelper.getRoundedValueAnnotationThickness(dimensions.top, holderHeight);
            }
            var defaultWidth = 0;
            var defaultHeight = 0;
            if (this.props.getAnnotationOverlayElement) {
                // Get default annotation values in percentage.
                var _a = annotationHelper.getAnnotationDefaultValue(this.props.annotationData.stamp, undefined, undefined, this.props.getAnnotationOverlayElement(), rotatedAngle, isStamping), defaultWidth_1 = _a[0], defaultHeight_1 = _a[1];
            }
            if (this.props.isInFullResponseView || this.props.doApplyLinkingScenarios === true ||
                Math.round(dimensions.top) >= (isStamping ? 1 : 0) && Math.round(dimensions.left) >= (isStamping ? 1 : 0) &&
                    Math.round(dimensions.width + dimensions.left) <= (isStamping ? 99 : 100) &&
                    Math.round(dimensions.height + dimensions.top) <= (isStamping ? 99 : 100)) {
                // Update the Annotation UI.
                // for inactive or faded use its own zOrder, otherwise find new zOrder
                var zindex = !this.props.isActive || this.props.isFade ? 0 : this.getZindexValue();
                this.setState({
                    left: dimensions.left,
                    top: dimensions.top,
                    width: dimensions.width,
                    height: dimensions.height,
                    zIndex: zindex
                });
            }
            else {
                var annotationWidth = 0;
                if (rotatedAngle === enums.RotateAngle.Rotate_90 ||
                    rotatedAngle === enums.RotateAngle.Rotate_270) {
                    annotationWidth = defaultWidth;
                    defaultWidth = defaultHeight;
                    defaultHeight = annotationWidth;
                }
                var widthinPixels = annotationHelper.percentToPixelConversion(dimensions.width, this.getAnnotationHolderElementProperties().width);
                var heightinPixels = annotationHelper.percentToPixelConversion(dimensions.height, this.getAnnotationHolderElementProperties().height);
                // if a newly added annnotation (stamping / drawing) is outside the response area, then remove it from collection
                if (this.props.isStamping || isDrawEnd) {
                    var annotationClientTokenToBeDeleted = [];
                    if (clientToken) {
                        annotationClientTokenToBeDeleted.push(clientToken);
                        markingActionCreator.removeAnnotation(annotationClientTokenToBeDeleted);
                    }
                }
            }
        }
    };
    /**
     * Method to calculate the top, left and height calculation
     * While adding/Updating annotation
     */
    DynamicStampBase.prototype.calculateAnnotationDimensions = function () {
        var topAdjustment = 0;
        var _a = this.getAnnotationTopLeft(), annotationTop = _a[0], annotationLeft = _a[1];
        // top and height calculation is different for EBookMarking and other type components.
        if (this.props.isEBookMarking) {
            // Take image natural height to display stamps if full response view/Linked Page.
            if (this.props.isInFullResponseView || this.props.isInLinkedPage) {
                this.annotationRect.top = annotationHelper.calculatePercentage(annotationTop, this.props.imageHeight);
                this.annotationRect.height = annotationHelper.calculatePercentage(this.props.annotationData.height, this.props.imageHeight);
            }
            else {
                // adjust stamp relative to zone.
                topAdjustment = annotationTop - this.props.zoneTop;
                this.annotationRect.top = annotationHelper.calculatePercentage(topAdjustment, this.props.zoneHeight);
                this.annotationRect.height = annotationHelper.calculatePercentage(this.props.annotationData.height, this.props.zoneHeight);
            }
        }
        else {
            // For structured and other components
            this.annotationRect.top = annotationHelper.calculatePercentage(annotationTop, this.props.imageHeight);
            this.annotationRect.height = annotationHelper.calculatePercentage(this.props.annotationData.height, this.props.imageHeight);
        }
        this.annotationRect.left = annotationHelper.calculatePercentage(annotationLeft, this.props.imageWidth);
        this.annotationRect.width = annotationHelper.calculatePercentage(this.props.annotationData.width, this.props.imageWidth);
    };
    /**
     * Get the default values for dynamic annotation in Percentage..
     */
    DynamicStampBase.prototype.getDefaultValuesInPercentage = function () {
        var defaultWidth = 0;
        var defaultHeight = 0;
        var rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);
        var _a = annotationHelper.getAnnotationDefaultValue(this.props.annotationData.stamp, undefined, undefined, null, rotatedAngle), width = _a[0], height = _a[1];
        defaultWidth = annotationHelper.calculatePercentage((width
            / this.getAnnotationHolderElementProperties().width) *
            this.props.imageWidth, this.props.imageWidth);
        defaultHeight = annotationHelper.calculatePercentage((height
            / this.getAnnotationHolderElementProperties().height) *
            this.props.imageHeight, this.props.imageHeight);
        return [defaultWidth, defaultHeight];
    };
    /**
     * Get the annotation dimension while displaying the dynamic annotation.
     */
    DynamicStampBase.prototype.getAnnotationDimensions = function (isFirstRender) {
        var dimensions = { left: 0, bottom: 0, height: 0, right: 0, top: 0, width: 0 };
        var rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);
        this.topVals.push(this.annotationRect.top);
        this.leftVals.push(this.annotationRect.left);
        var drawDirection = this.props.drawDirection;
        if (isFirstRender) {
            drawDirection = enums.DrawDirection.Right;
        }
        if (this.props.displayAngle) {
            switch (rotatedAngle) {
                case enums.RotateAngle.Rotate_0:
                    dimensions.left = Math.round(this.annotationRect.left * 1000) / 1000;
                    dimensions.top = Math.round(this.annotationRect.top * 1000) / 1000;
                    break;
                case enums.RotateAngle.Rotate_90:
                    dimensions.left = Math.round(this.annotationRect.left * 1000) / 1000;
                    /** Fix for Defect 57326:
                     * added checks for isFirstRender and isStamping since topVals doesn't need to be calculated
                     * after first render and for stamping annotation
                     */
                    dimensions.top = ((drawDirection !== undefined && drawDirection === enums.DrawDirection.Right)
                        && (!isFirstRender || this.props.isStamping) &&
                        (this.topVals[0] > this.annotationRect.height)) ?
                        (this.topVals[0] - this.annotationRect.height) : this.topVals[0];
                    break;
                case enums.RotateAngle.Rotate_180:
                    switch (drawDirection) {
                        case enums.DrawDirection.Top:
                            dimensions.left = (this.leftVals[0]);
                            dimensions.top = (this.topVals[0]);
                            break;
                        case enums.DrawDirection.Right:
                            /** Fix for Defect 57326:
                             * added checks for isFirstRender and isStamping since leftVals doesn't need to be calculated
                             * after first render and for stamping annotation
                             */
                            dimensions.left = (!isFirstRender || this.props.isStamping) && (this.leftVals[0] > this.annotationRect.width) ?
                                (this.leftVals[0] - this.annotationRect.width) : this.leftVals[0];
                            dimensions.top = (this.topVals[0]);
                            break;
                        case enums.DrawDirection.Left:
                            dimensions.left = (this.leftVals[0]);
                            dimensions.top = (this.topVals[0] - this.annotationRect.height);
                            break;
                        case enums.DrawDirection.Bottom:
                            dimensions.left = (this.leftVals[0] - this.annotationRect.width);
                            dimensions.top = (this.topVals[0] - this.annotationRect.height);
                            break;
                    }
                    break;
                case enums.RotateAngle.Rotate_270:
                    dimensions.left = ((drawDirection !== undefined && drawDirection === enums.DrawDirection.Left) &&
                        (this.leftVals[0] > this.annotationRect.width)) ?
                        (this.leftVals[0] - this.annotationRect.width) : this.leftVals[0];
                    dimensions.top = Math.round(this.annotationRect.top * 1000) / 1000;
                    break;
            }
        }
        else {
            dimensions.left = Math.round(this.annotationRect.left * 1000) / 1000;
            dimensions.top = Math.round(this.annotationRect.top * 1000) / 1000;
        }
        dimensions.width = Math.round(this.annotationRect.width * 1000) / 1000;
        dimensions.height = Math.round(this.annotationRect.height * 1000) / 1000;
        return dimensions;
    };
    /**
     * getAnnotationClassName function is to get the classname for annotation.
     * @param isFade
     * @param isShowBorder
     */
    DynamicStampBase.prototype.getAnnotationClassName = function (isFade, isShowBorder) {
        var className = 'annotation-wrap dynamic';
        if (isShowBorder) {
            className += ' hover';
        }
        if (isFade) {
            className += ' inactive';
        }
        switch (this.props.annotationData.stamp) {
            case enums.DynamicAnnotation.HorizontalLine:
                className += ' horizontal line';
                break;
            case enums.DynamicAnnotation.Ellipse:
                className += ' ellipse';
                break;
            case enums.DynamicAnnotation.HWavyLine:
                className += ' horizontal wavy line';
                break;
            case enums.DynamicAnnotation.VWavyLine:
                className += ' vertical wavy line';
                break;
        }
        if (this.isPreviousAnnotation) {
            className += ' previous';
        }
        return className;
    };
    /**
     * save the annotation on move/resize
     */
    DynamicStampBase.prototype.saveAnnotation = function () {
        var rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);
        var top = this.adjustAnnotationPoistionOnStitchedGap(this.state.top, rotatedAngle, this.props.getAnnotationOverlayElement(), true);
        //Zone Top will be 0 if page is linked one
        var zoneTop = this.props.isInLinkedPage || !this.props.isEBookMarking ? 0 : this.props.zoneTop;
        var annotationLeftinPx = (this.state.left / 100) * this.props.imageWidth;
        // for ebookmarking components, we should add zonetop along with annotation top if its a zoned page
        var annotationTopinPx = (zoneTop + (top / 100) * this.props.imageHeight);
        var annotationWidthinPx = (this.state.width / 100) * this.props.imageWidth;
        var annotationHeightinPx = (this.state.height / 100) * this.props.imageHeight;
        if (this.props.clientToken !== undefined) {
            var outputPageNo = annotationHelper.getOutputPageNo(this.props.doApplyLinkingScenarios, this.props.imageZones, this.props.imageZone, this.props.outputPageNo);
            var pageNo = this.props.isInLinkedPage || this.props.isEBookMarking ?
                this.props.currentImagePageNo : this.props.pageNo;
            if (this.props.doApplyLinkingScenarios === true && pageNo === 0) {
                // annotation in stitched image. we need to add the height of zones above the currect zone
                // when in linking scenarios are enabled
                var topAboveCurrentZone = this.props.topAboveCurrentZone ? this.props.topAboveCurrentZone : 0;
                annotationTopinPx += topAboveCurrentZone;
            }
            markingActionCreator.updateAnnotation(annotationLeftinPx, annotationTopinPx, this.props.imageClusterId, outputPageNo, pageNo, this.props.clientToken, annotationWidthinPx, annotationHeightinPx);
        }
    };
    /**
     * This function returns the annotationRect Client rect
     */
    DynamicStampBase.prototype.getCurrentElementBoundRect = function () {
        var clientRect = {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            width: 0,
            height: 0
        };
        if (this) {
            clientRect = ReactDom.findDOMNode(this).getBoundingClientRect();
        }
        return clientRect;
    };
    /**
     * returns the dynamic annotation border type
     */
    DynamicStampBase.prototype.getAnnotationBorderType = function (className) {
        var borderType;
        switch (className) {
            case 'resize-tl':
                borderType = enums.AnnotationBorderType.TopLeft;
                break;
            case 'resize-t':
                borderType = enums.AnnotationBorderType.TopEdge;
                break;
            case 'resize-tr':
                borderType = enums.AnnotationBorderType.TopRight;
                break;
            case 'resize-r':
                borderType = enums.AnnotationBorderType.RightEdge;
                break;
            case 'resize-br':
                borderType = enums.AnnotationBorderType.BottomRight;
                break;
            case 'resize-b':
                borderType = enums.AnnotationBorderType.BottomEdge;
                break;
            case 'resize-bl':
                borderType = enums.AnnotationBorderType.BottomLeft;
                break;
            case 'resize-l':
                borderType = enums.AnnotationBorderType.LeftEdge;
                break;
            default:
                borderType = enums.AnnotationBorderType.Default;
                break;
        }
        return borderType;
    };
    Object.defineProperty(DynamicStampBase.prototype, "isAnnotationPannable", {
        /**
         * check if the annotation is able to pan
         */
        get: function () {
            return this.props.isActive && !responseStore.instance.isPinchZooming;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Hammer Implementation
     */
    DynamicStampBase.prototype.setUpHammer = function () {
        /* for current annotations only we need to attach hammer */
        if (!this.isPreviousAnnotation && this.props.isActive && !this.eventHandler.isInitialized) {
            /** To perform move functionality the parent span is attached with the hammer events */
            this.annotationElement = ReactDom.findDOMNode(this);
            var touchActionValue = deviceHelper.isTouchDevice() && !deviceHelper.isMSTouchDevice() ? 'auto' : 'none';
            var threshold = constants.PAN_THRESHOLD;
            var pressTime = 0;
            var pressTimeForDevices = 250;
            this.eventHandler.initEvents(this.annotationElement, touchActionValue, true);
            this.eventHandler.on(eventTypes.INPUT, this.annotationInput);
            this.eventHandler.get(eventTypes.PAN, { direction: directions.DirectionOptions.DIRECTION_ALL, threshold: threshold });
            this.eventHandler.on(eventTypes.PAN_START, this.annotationPanStart);
            this.eventHandler.on(eventTypes.PAN, this.annotationPanMove);
            this.eventHandler.on(eventTypes.PAN_END, this.annotationPanEnd);
            this.eventHandler.on(eventTypes.PAN_CANCEL, this.annotationPanEnd);
            this.eventHandler.get(eventTypes.PRESS, { time: htmlUtilities.isTabletOrMobileDevice ? pressTimeForDevices : pressTime });
            this.eventHandler.on(eventTypes.PRESS, this.annotationPress);
            if (htmlUtilities.isTabletOrMobileDevice) {
                this.eventHandler.on(eventTypes.TAP, this.onTapHandler);
            }
            if (this.isTouchDevice) {
                this.topVals.length = 0;
            }
            /** To show border for annotation while click on touch in ipad/surface */
            this.annotationElement.addEventListener('touchstart', this.onTouchStart);
        }
    };
    /**
     * Destroy Hammer
     */
    DynamicStampBase.prototype.destroyHammer = function () {
        if (this.annotationElement) {
            /** To show border for annotation while click on touch in ipad/surface */
            this.annotationElement.removeEventListener('touchstart', this.onTouchStart);
        }
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    Object.defineProperty(DynamicStampBase.prototype, "previousRemarkZIndex", {
        /**
         * return the zindex value for an annotatin
         */
        get: function () {
            return this.props.annotationData.zOrder;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * check annotation thickness
     */
    DynamicStampBase.prototype.checkThicknessOnAnimationCompleted = function () {
        var annotationHolderRect = this.getAnnotationHolderElementProperties();
        /** If the function is triggered on the normal basis, the thickness seems
         * to differ in uniformity, hence a timeout is applied for persisting the thickness
         */
        this.updateAnnotationThicknessOnResize(annotationHolderRect);
    };
    /**
     * Reset the overlay boundary on each action to get the updated image size.
     * @param {HTMLElement} element?
     * * @param {Number} rotated angle?
     */
    DynamicStampBase.prototype.resetOverlayStitchedBoundary = function (element, angle) {
        var rotatedAngle = annotationHelper.getAngleforRotation(element === undefined ?
            this.props.displayAngle :
            angle);
        // If annotation is moving then we need to get the boundary on runtime to get the actual hovering element.
        // eg: In strucured response if we have a single and stitched image if we are hovering dynamic annotation from
        // single image to stitched image gap or viceversa.
        // we are checking whether the element is not undefine to make sure component did udpate will not update the boundary
        // while moving the annotation.
        if (this.isAnnotationMoving) {
            if (element !== undefined) {
                this.overlayBoundary = annotationHelper.getStitchedImageBoundary(element, rotatedAngle);
            }
        }
        else {
            var annotationOverlayParentElement = this.props.getAnnotationOverlayElement() ?
                this.props.getAnnotationOverlayElement().parentElement : undefined;
            this.overlayBoundary = annotationHelper.getStitchedImageBoundary(annotationOverlayParentElement, rotatedAngle);
        }
    };
    Object.defineProperty(DynamicStampBase.prototype, "isStitchedImage", {
        // Gets or sets a value indicating whether current annotation holder
        // contains any stitched images.
        get: function () {
            return this.overlayBoundary.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adjust the stitched image gap with respect to the image position for structred response.
     * @param {number} annotationTop
     * @param {number} rotatedAngle
     * @param {number} holderElement
     * @param {number} isSaving
     * @returns The adjusted annotation top.
     */
    DynamicStampBase.prototype.adjustAnnotationPoistionOnStitchedGap = function (annotationTop, rotatedAngle, holderElement, isSaving) {
        if (isSaving === void 0) { isSaving = false; }
        if (holderElement) {
            this.resetOverlayStitchedBoundary(holderElement, rotatedAngle);
        }
        if (this.overlayBoundary && this.overlayBoundary.length > 0) {
            var totalImageHeight = 0;
            var stitchedImageIndex = 0;
            var stitchedImageSeperator = 0;
            for (var i = 0; i < this.overlayBoundary.length;) {
                totalImageHeight += this.overlayBoundary[i].imageHeight;
                // If the looping last image consider we are at 100%. This will help
                // to calculate annotations placed at the edge.
                var currentPagePercentage = (i < this.overlayBoundary.length - 1) ? (totalImageHeight / holderElement.clientHeight) * 100 : 100;
                if (annotationTop < currentPagePercentage) {
                    i = this.overlayBoundary.length;
                }
                else {
                    i++;
                    stitchedImageIndex++;
                }
            }
            if (stitchedImageIndex > 0) {
                switch (rotatedAngle) {
                    case enums.RotateAngle.Rotate_360:
                    case enums.RotateAngle.Rotate_0:
                        stitchedImageSeperator = this.overlayBoundary[stitchedImageIndex].start
                            - this.overlayBoundary[stitchedImageIndex - 1].end;
                        break;
                    case enums.RotateAngle.Rotate_90:
                        stitchedImageSeperator = this.overlayBoundary[stitchedImageIndex - 1].start
                            - this.overlayBoundary[stitchedImageIndex].end;
                        break;
                    case enums.RotateAngle.Rotate_270:
                        stitchedImageSeperator = this.overlayBoundary[stitchedImageIndex].start
                            - this.overlayBoundary[stitchedImageIndex - 1].end;
                        break;
                    case enums.RotateAngle.Rotate_180:
                        stitchedImageSeperator = this.overlayBoundary[stitchedImageIndex - 1].start
                            - this.overlayBoundary[stitchedImageIndex].end;
                        break;
                }
                stitchedImageSeperator = (stitchedImageSeperator / holderElement.clientHeight) * 100;
                stitchedImageSeperator = stitchedImageSeperator * stitchedImageIndex;
            }
            // While saving after resizing or move we need to trim the stitched image gap before going to db.
            annotationTop = !isSaving ? annotationTop + stitchedImageSeperator : annotationTop - stitchedImageSeperator;
        }
        return annotationTop;
    };
    /**
     * get hit area for line annotations
     */
    DynamicStampBase.prototype.getLineAnnotationHitArea = function () {
        if (!this.isPreviousAnnotation) {
            return (React.createElement("span", {className: 'hit-area', key: this.props.id + '_hitarea'}));
        }
    };
    Object.defineProperty(DynamicStampBase.prototype, "getStyleSpanPointerEvents", {
        /**
         *  get style pointer events
         */
        get: function () {
            /* Removed unwanted conditions as part of defect fix : #38721 */
            if (this.props.isInFullResponseView) {
                return 'none';
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * returns rgb color for active and inactive annotation
     * @param isFade
     * @param annotationType
     */
    DynamicStampBase.prototype.getAnnotationColorInRGB = function (isFade, annotationType) {
        var rgbaColor = colouredAnnotationsHelper.createAnnotationStyle(this.props.annotationData, annotationType).fill;
        // for inactive annotations
        if (isFade) {
            rgbaColor = colouredAnnotationsHelper.getTintedRgbColor(rgbaColor);
        }
        return rgbaColor;
    };
    /**
     * add a link annotation if the page is linked by previous marker and
     * current marker is adding or updating a annotation
     * @param pageNo
     * @param isInLinkedPage
     */
    DynamicStampBase.prototype.addLinkAnnotationIfPageIsLinkedByPreviousMarker = function (pageNo, isInLinkedPage) {
        var treeViewHelper = new treeViewDataHelper();
        var tree = treeViewHelper.treeViewItem();
        var multipleMarkSchemes = markingHelper.getMarkschemeParentNodeDetails(tree, markingStore.instance.currentMarkSchemeId, true);
        pageLinkHelper.addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo, isInLinkedPage, this.props.pagesLinkedByPreviousMarkers, multipleMarkSchemes);
    };
    /**
     * Gets annotation properties of width and height based on the given
     * holder width and image properties.
     * @param holderElement
     * @param width
     * @param height
     */
    DynamicStampBase.prototype.getAnnotationProperties = function (holderElement, width, height) {
        var annotationProperties = { 'width': 0, 'height': 0 };
        var imageHeight = Number(holderElement.getAttribute('data-imageheight'));
        var imageWidth = Number(holderElement.getAttribute('data-imagewidth'));
        annotationProperties.height = annotationHelper.calculatePercentage(height, imageHeight);
        annotationProperties.width = annotationHelper.calculatePercentage(width, imageWidth);
        return annotationProperties;
    };
    Object.defineProperty(DynamicStampBase.prototype, "getDynamicPatternId", {
        /**
         * Gets a value indicating dynamic annotation pattern identifier while moving the HWavy/VWavy line.
         * This will help to avoid conflicting b/w dulicate id's for multiple svgs.
         */
        get: function () {
            return this.isAnnotationMoving ? this.props.id + '_moving' : this.props.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicStampBase.prototype, "zIndex", {
        /* return z-index for dynamic stamp */
        get: function () {
            if (this.isPreviousAnnotation) {
                return this.previousRemarkZIndex;
            }
            else {
                return !this.props.isActive || this.props.isFade ?
                    annotationHelper.getCurrentResponseZIndex() : this.getZindexValue();
            }
        },
        enumerable: true,
        configurable: true
    });
    return DynamicStampBase;
}(StampBase));
module.exports = DynamicStampBase;
//# sourceMappingURL=dynamicstampbase.js.map