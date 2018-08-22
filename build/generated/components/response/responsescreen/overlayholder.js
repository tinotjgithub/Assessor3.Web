"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDom = require('react-dom');
var enums = require('../../utility/enums');
var eventManagerBase = require('../../base/eventmanager/eventmanagerbase');
var deviceHelper = require('../../../utility/touch/devicehelper');
var direction = require('../../base/eventmanager/direction');
var eventTypes = require('../../base/eventmanager/eventtypes');
var constants = require('../../utility/constants');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var overlayHelper = require('../../utility/overlay/overlayhelper');
var Protractor = require('../acetates/protractor');
var responseStore = require('../../../stores/response/responsestore');
var toolbarStore = require('../../../stores/toolbar/toolbarstore');
var Multiline = require('../acetates/multiline');
var qigStore = require('../../../stores/qigselector/qigstore');
var markingStore = require('../../../stores/marking/markingstore');
var Ruler = require('../acetates/ruler');
var acetatesActionCreator = require('../../../actions/acetates/acetatesactioncreator');
var messageStore = require('../../../stores/message/messagestore');
var exceptionStore = require('../../../stores/exception/exceptionstore');
var toolbarActionCreator = require('../../../actions/toolbar/toolbaractioncreator');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
/**
 * React component class for overlay holder.
 */
var OverlayHolder = (function (_super) {
    __extends(OverlayHolder, _super);
    /**
     * constructor for overlay holder
     * @param props
     * @param state
     */
    function OverlayHolder(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._deltaXWhenMovedToNextPage = 0;
        this._isMousePointerInGreyArea = false;
        this._initialStitchedImageGapIndex = -1;
        this._acetateMoveAction = enums.AcetateAction.move;
        this._doRetainInitialPosition = false;
        this._rotatedAngle = 0;
        this._containerScrollBeforePan = { left: 0, top: 0 };
        this._isInsideStitchedImage = false;
        this._acetateLineIndex = 0;
        this.isComponentMounted = false;
        /**
         * add Multiline Style
         * @param clientToken
         * @param x1
         * @param y1
         * @param acetateContextMenuData
         * @param multilineItems
         */
        this.addMultilineItems = function (clientToken, x1, y1, acetateContextMenuDetail, multilineItems) {
            if (_this._acetatesList && acetateContextMenuDetail.multilinearguments.overlayHolderId === _this.getOverlayHolderId()) {
                _this.acetateContextMenuData = acetateContextMenuDetail;
                switch ((multilineItems)) {
                    case enums.MultiLineItems.point:
                        _this.addPoint(clientToken, x1, y1, acetateContextMenuDetail);
                        break;
                    case enums.MultiLineItems.line:
                        _this.addLine(clientToken, x1, y1);
                        break;
                }
            }
        };
        /**
         * update Multiline Style
         * @param clientToken
         * @param x1
         * @param y1
         * @param acetateContextMenuData
         * @param multilineItems
         */
        this.updateMultilineStyle = function (clientToken, x1, y1, acetateContextMenuData, multilineItems) {
            if (_this._acetatesList && acetateContextMenuData.multilinearguments.overlayHolderId === _this.getOverlayHolderId()) {
                acetatesActionCreator.addOrUpdateAcetate(null, enums.MarkingOperation.none, clientToken, acetateContextMenuData);
            }
        };
        /**
         * add point to existing Multiline
         * @param clientToken
         * @param xPos
         * @param yPos
         * @param acetateContextMenuDetail
         */
        this.addPoint = function (clientToken, x, y, acetateContextMenuDetail) {
            var acetate = _this._acetatesList.filter(function (item) { return item.clientToken === clientToken; }).get(0);
            var dx = 0;
            var dy = 0;
            // find current annotation overlay
            var currentAnnotationHolderElement = htmlUtilities.findAncestor(htmlUtilities.getElementFromPosition(x, y), 'annotation-overlay');
            var currentOverlayHolderClientRect = currentAnnotationHolderElement.getBoundingClientRect();
            // Finding the delta values w.r.t rotated angle
            var event = {
                clientX: x,
                clientY: y
            };
            _a = _this.getMultilineCoordinates(event), dx = _a[0], dy = _a[1];
            var newPointLocation = _this.calculatePoint(clientToken, dx, dy, acetateContextMenuDetail);
            _this.acetateContextMenuData.multilinearguments.Xcordinate = newPointLocation.x;
            _this.acetateContextMenuData.multilinearguments.Ycordinate = newPointLocation.y;
            _this.acetateContextMenuData.multilinearguments.MultilineItem = enums.MultiLineItems.point;
            _this.acetateContextMenuData.multilinearguments.PointIndex = newPointLocation.pointIndex;
            acetatesActionCreator.addOrUpdateAcetate(null, enums.MarkingOperation.none, clientToken, _this.acetateContextMenuData);
            var _a;
        };
        /**
         * add line to existing Multiline
         * @param clientToken
         * @param xPos
         * @param yPos
         */
        this.addLine = function (clientToken, x1, y1) {
            var overlayX = 0;
            var overlayY = 0;
            var event = {
                clientX: x1,
                clientY: y1
            };
            _a = _this.getMultilineCoordinates(event), overlayX = _a[0], overlayY = _a[1];
            // invalid zone
            if (overlayX === 0 || overlayY === 0) {
                return;
            }
            _this.acetateContextMenuData.multilinearguments.Xcordinate = overlayX;
            _this.acetateContextMenuData.multilinearguments.Ycordinate = overlayY;
            _this.acetateContextMenuData.multilinearguments.MultilineItem = enums.MultiLineItems.line;
            var imageCentreCoordinates = {
                x: overlayX,
                y: overlayY,
            };
            var defaultAcetatePoints = Array();
            defaultAcetatePoints =
                overlayHelper.getAcetatePoints(enums.ToolType.multiline, imageCentreCoordinates, null, null, true);
            _this.acetateContextMenuData.multilinearguments.DefaultAcetatePoints = defaultAcetatePoints;
            acetatesActionCreator.addOrUpdateAcetate(null, enums.MarkingOperation.none, clientToken, _this.acetateContextMenuData);
            var _a;
        };
        /* pressup event for overlay holder */
        this.onPressUp = function (event) {
            _this.enableImageContainerScroll(true);
        };
        /**
         * on touch and hold handler
         * @param event
         */
        this.onTouchHold = function (event) {
            event.srcEvent.stopPropagation();
            event.srcEvent.preventDefault();
            if (event.changedPointers && event.changedPointers.length > 0) {
                var actualX = event.changedPointers[event.changedPointers.length - 1].clientX;
                var actualY = event.changedPointers[event.changedPointers.length - 1].clientY;
                var overlayX = 0;
                var overlayY = 0;
                // find element in mouse point
                var element = htmlUtilities.getElementFromPosition(actualX, actualY);
                // find acetate from element in x, y
                _this._acetateElement = htmlUtilities.findAncestor(element, 'overlay-wrap');
                _this.enableImageContainerScroll(false);
                // find client token
                _this._clientToken = _this._acetateElement.getAttribute('data-client-token');
                _this._toolType = _this.getToolType(_this._acetateElement.getAttribute('data-tool-type'));
                var acetateContextMenuData_1 = overlayHelper.getAcetateContextMenuData(_this._clientToken, _this._toolType);
                switch (_this._toolType) {
                    case enums.ToolType.multiline:
                        var evt = event.changedPointers[event.changedPointers.length - 1];
                        var _index = _this.getLineIndex(evt);
                        if (!_index) {
                            return;
                        }
                        acetateContextMenuData_1.multilinearguments.LineIndex = _index;
                        break;
                }
                // Pass the currently clicked annotation along with the X and Y because Remove Context menu
                // is under marksheet div and we need to show the context menu at this position
                _this.showOrHideRemoveContextMenu(true, actualX, actualY, acetateContextMenuData_1);
            }
        };
        this.getIndexOfClosestPoint = function (xCoordinate, yCoordinate, pointCollection) {
            var differenceinDistance = 0;
            var mindistance = 0;
            var pointIndex = 0;
            var xdistance = 0;
            var ydistance = 0;
            for (var i = 0; i < pointCollection.length; i++) {
                // calculate the x distance for each point in point collection to the clicked xcordinate
                xdistance = xCoordinate - pointCollection[i].x;
                // calculate the y distance for each point in point collection to the clicked ycordinate
                ydistance = yCoordinate - pointCollection[i].y;
                //applying pythagoras theorem to find the minimum distance to clicked point
                differenceinDistance = Math.sqrt((xdistance * xdistance) + (ydistance * ydistance));
                if (i === 0) {
                    //set the minimum distance as the distance to first point initially
                    mindistance = differenceinDistance;
                    pointIndex = i;
                }
                if (mindistance > differenceinDistance) {
                    //If new difference in distance is less than mindistance reset mindistance to new differenceinDistance
                    mindistance = differenceinDistance;
                    pointIndex = i;
                }
            }
            return pointIndex;
        };
        /**
         * return overlay holder element
         */
        this.getOverlayHolderElement = function () {
            return ReactDom.findDOMNode(_this);
        };
        /**
         * This will call on panstart event overlay holder
         * @param event: Custom event type
         */
        this.onPanStart = function (event) {
            event.preventDefault();
            if (_this.doEnablePanStart) {
                var actualX = event.changedPointers[0].clientX;
                var actualY = event.changedPointers[0].clientY;
                _this._rotatedAngle = overlayHelper.getRotatedAngle(_this.props.imageProps.pageNo, _this.props.imageProps.linkedOutputPageNo);
                // find element in mouse point
                var element = htmlUtilities.getElementFromPosition(actualX, actualY);
                var imageContainerElement = _this.props.getMarkSheetContainerProperties().element;
                _this._containerScrollBeforePan.left = imageContainerElement.scrollLeft;
                _this._containerScrollBeforePan.top = imageContainerElement.scrollTop;
                // find acetate from element in x, y
                _this._acetateElement = htmlUtilities.findAncestor(element, 'overlay-wrap');
                // if any one of the below condition is true, it means that the element is not an acetate.
                var inValidElement = ((!_this._acetateElement) || (!_this._acetateElement.classList) ||
                    !(_this._acetateElement.classList.contains('overlay-wrap')));
                if (inValidElement) {
                    return;
                }
                _this._toolType = _this.getToolType(_this._acetateElement.getAttribute('data-tool-type'));
                _this._acetateHitAreaLineElements = _this.getAcetateHitAreaLineElements(_this._toolType);
                _this.enableImageContainerScroll(false);
                _this._clientToken = _this._acetateElement.getAttribute('data-client-token');
                // get current acetate data using client token from acetate element
                _this._initialAcetateData = _this._acetatesList.filter(function (item) { return item.clientToken === _this._clientToken; }).get(0);
                _this._acetateLabelElement = _this._acetateElement.getElementsByClassName('overlay-text')[0];
                // Hide context menu while dragging
                markingActionCreator.showOrHideRemoveContextMenu(false);
                // JSON.stringify() added to remove reference for items in the store.
                if (_this._initialAcetateData) {
                    _this._currentAcetateData = JSON.parse(JSON.stringify(_this._initialAcetateData));
                }
                /* Disable the single point movement on shared multi-line overlay,
                   but we can able to move other overlays such ruler, protractor and multi line */
                _this._acetatePointIndex = _this._acetateElement.classList.contains('shared-overlay') ? -1 :
                    _this.getAcetatePointIndex(actualX, actualY);
                if (_this._acetatePointIndex > -1) {
                    _this._acetateMoveAction = enums.AcetateAction.resize;
                }
                else {
                    _this._acetateMoveAction = enums.AcetateAction.move;
                }
                if (_this.isStitchedImage) {
                    var annotationOverlayParentElement = _this.props.getAnnotationOverlayElement ?
                        _this.props.getAnnotationOverlayElement : undefined;
                    _this._overlayBoundary =
                        overlayHelper.getStitchedImageBoundary(annotationOverlayParentElement, _this._rotatedAngle);
                    var mousePointerCoordinate = (_this._rotatedAngle / 90) % 2 === 1 ? actualX : actualY;
                    _this._initialStitchedImageGapIndex = overlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate(mousePointerCoordinate, _this._overlayBoundary);
                }
                // find annotation overlay for the current acetate
                _this._annotationOverlay = htmlUtilities.findAncestor(_this._acetateElement, 'annotation-overlay');
                // get client rect of acetate before pan move action
                _this._acetateHitAreaLineElementClientRectBeforePan = _this._acetateHitAreaLineElements.length > 0 ?
                    _this._acetateHitAreaLineElements[0].getBoundingClientRect() : null;
                acetatesActionCreator.acetateMoving(_this._clientToken, true);
            }
        };
        /**
         * This will call on panmove event overlay holder
         * @param event: Custom event type
         */
        this.onPanMove = function (event) {
            event.preventDefault();
            var actualX = event.changedPointers[0].clientX;
            var actualY = event.changedPointers[0].clientY;
            if (!_this.doEnablePan) {
                return;
            }
            var currentAnnotationHolderElement = _this.getAnnotationOverlayInCurrentPoint(event);
            var annotationOverlayElement = _this.props.getAnnotationOverlayElement ?
                _this.props.getAnnotationOverlayElement : undefined;
            // check stitched image gap for structured responses
            var isMouseInStitchedGap = _this.isStitchedImage ?
                overlayHelper.isInStitchedGap(actualX, actualY, _this._rotatedAngle, annotationOverlayElement, _this._overlayBoundary) : false;
            if (_this.isValidMove(event) && _this._annotationOverlay.id === currentAnnotationHolderElement.id && !isMouseInStitchedGap) {
                if (_this._isMousePointerInGreyArea && _this._isInsideStitchedImage) {
                    // if moving from deleted area, then reset the mouse pointer
                    toolbarActionCreator.PanStampToDeleteArea(false, actualX, actualY);
                    // show the hidden acetate
                    _this._isMousePointerInGreyArea = false;
                }
                var currentOverlayHolderClientRect = currentAnnotationHolderElement.getBoundingClientRect();
                var dx = 0;
                var dy = 0;
                // Finding the delta values w.r.t rotated angle
                _a = overlayHelper.getMousePointerClientXY(actualX, actualY, _this._rotatedAngle, currentOverlayHolderClientRect, currentAnnotationHolderElement, _this._imageDimension), dx = _a[0], dy = _a[1];
                if (_this._acetateMoveAction === enums.AcetateAction.move) {
                    var deltaX = 0;
                    var deltaY = 0;
                    // Finding the delta values w.r.t rotated angle
                    _b = _this.getDeltaXY(event.deltaX, event.deltaY, _this._rotatedAngle), deltaX = _b[0], deltaY = _b[1];
                    // for stitched image adjust the stitched gap from dy
                    if (_this.isStitchedImage) {
                        // adjust the stitchedImageGapOffset from current mouse point coordinates
                        var mousePointerCoordinate = (_this._rotatedAngle / 90) % 2 === 1 ? actualX : actualY;
                        var currentStitchedGapIndex = overlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate(mousePointerCoordinate, _this._overlayBoundary);
                        dy = _this.yCoordinateAfterStitchedGapAdjustment(dy, dy, currentStitchedGapIndex, _this._rotatedAngle);
                    }
                    // check if dx and dy are with in stitched image
                    _this._isInsideStitchedImage = _this.isStitchedImage ? overlayHelper.isOutsideStitchedImage(overlayHelper.findPercentage(dy, _this._imageDimension.imageHeight), actualX, actualY, _this._rotatedAngle, annotationOverlayElement) : true;
                    if (!_this._isInsideStitchedImage && _this.doDeleteAcetate) {
                        _this._isMousePointerInGreyArea = true;
                        // show the bin icon when move out of the script or ut of stitche image
                        // and hide the moving acetate
                        toolbarActionCreator.PanStampToDeleteArea(true, actualX, actualY);
                        _this.setAcetateTransform(_this._toolType, _this._clientToken, deltaX, deltaY, false);
                    }
                    else {
                        _this.setAcetateTransform(_this._toolType, _this._clientToken, deltaX, deltaY);
                    }
                }
                else if (_this._acetateMoveAction === enums.AcetateAction.resize) {
                    // find updated x,y position for the point and send action to rerender the acetate
                    var points = _this._currentAcetateData.acetateData.acetateLines[_this._acetateLineIndex].points;
                    var pointToChange = points[_this._acetatePointIndex];
                    if (pointToChange) {
                        // for stitched image adjust the stitched gap from dy to avoid the gap value in db,
                        // this will adjust on render
                        if (_this.isStitchedImage) {
                            // adjust the stitchedImageGapOffset from y coordinates
                            dy = _this.yCoordinateAfterStitchedGapAdjustment(dy, dy, _this._initialStitchedImageGapIndex, _this._rotatedAngle);
                        }
                        // check if dx and dy are with in stitched image
                        _this._isInsideStitchedImage = _this.isStitchedImage ? overlayHelper.isOutsideStitchedImage(overlayHelper.findPercentage(dy, _this._imageDimension.imageHeight), actualX, actualY, _this._rotatedAngle, annotationOverlayElement) : true;
                        var currentStitchedImageGapIndex = _this.isStitchedImage ? overlayHelper.getStitchedImageGapIndex(overlayHelper.findPercentage(dy, _this._imageDimension.imageHeight), _this._rotatedAngle, annotationOverlayElement, _this._overlayBoundary) : -1;
                        if (currentStitchedImageGapIndex !== _this._initialStitchedImageGapIndex || !_this._isInsideStitchedImage) {
                            acetatesActionCreator.acetateInGreyArea(true, _this._clientToken);
                            _this._doRetainInitialPosition = true;
                        }
                        else {
                            // we dont update the store values while resize in panmove, so we currently have the values w.r.t 
                            // output page before linking. so if zone is linked, then we need to calculate the x,y values w.r.t output
                            // page which is not linked. these values updated to the store once a sucessfull move or resize is done.
                            var _c = _this.getZoneDimensionsBasedOnLinkingScenario(_this.props.linkingScenarioProps, _this._currentAcetateData), zoneLeft = _c[0], zoneTop = _c[1], topAboveCurrentZone = _c[2];
                            // If the current page is not a linked page then, while resizing no further adjustment is needed.
                            // So inorder to negate the adjustment made in y coordinate while rendering, topAboveCurrentZone is subtracted.
                            if (_this.props.doApplyLinkingScenarios && !_this.props.imageProps.isALinkedPage) {
                                pointToChange.x = dx;
                                pointToChange.y = dy + _this.props.linkingScenarioProps.topAboveCurrentZone;
                            }
                            else {
                                pointToChange.x = dx - zoneLeft;
                                pointToChange.y = (dy + topAboveCurrentZone) - zoneTop;
                            }
                            _this._doRetainInitialPosition = false;
                            _this._isMousePointerInGreyArea = false;
                            acetatesActionCreator.acetateInGreyArea(false, _this._clientToken);
                            acetatesActionCreator.acetatePositionUpdateAction(_this._currentAcetateData, enums.AcetateAction.resize);
                        }
                    }
                }
            }
            else {
                _this._isMousePointerInGreyArea = true;
                if (_this._acetateMoveAction === enums.AcetateAction.move) {
                    if (_this._currentAcetateData.shared && _this.isPE) {
                        var deltaX = 0;
                        var deltaY = 0;
                        // Finding the delta values w.r.t rotated angle
                        _d = _this.getDeltaXY(event.deltaX, event.deltaY, _this._rotatedAngle), deltaX = _d[0], deltaY = _d[1];
                        _this.setAcetateTransform(_this._toolType, _this._clientToken, deltaX, deltaY);
                    }
                    else {
                        // show the bin icon when move out of the script
                        toolbarActionCreator.PanStampToDeleteArea(true, actualX, actualY);
                        // hide acetate only when moving and mouse moved to grey area
                        _this.setAcetateTransform(_this._toolType, _this._clientToken, event.deltaX, event.deltaY, false);
                    }
                }
                else if (_this._acetateMoveAction === enums.AcetateAction.resize) {
                    acetatesActionCreator.acetateInGreyArea(true, _this._clientToken);
                }
            }
            var _a, _b, _d;
        };
        /**
         * This will call on panend event overlay holder
         * @param event: Custom event type
         */
        this.onPanEnd = function (event) {
            var actualX = event.changedPointers[0].clientX;
            var actualY = event.changedPointers[0].clientY;
            var dx = 0;
            var dy = 0;
            acetatesActionCreator.acetateMoving(_this._clientToken, false);
            if (_this._isMousePointerInGreyArea || _this._doRetainInitialPosition) {
                if (_this._acetateMoveAction === enums.AcetateAction.move && _this.doDeleteAcetate) {
                    // if the acetate is ouside the response screen then remove
                    acetatesActionCreator.removeAcetate(_this._clientToken, _this._toolType);
                }
                else if (_this._acetateMoveAction === enums.AcetateAction.resize) {
                    // if the acetate is ouside the response screen then update the position with original point
                    acetatesActionCreator.acetatePositionUpdateAction(_this._initialAcetateData, enums.AcetateAction.none);
                }
            }
            else if (_this.doEnablePan) {
                // clientrect of first line after move
                var acetateHitAreaLineElementClientRectAfterPan = _this._acetateHitAreaLineElements.length > 0 ?
                    _this._acetateHitAreaLineElements[0].getBoundingClientRect() : null;
                var currentAnnotationHolderElement = _this.getAnnotationOverlayInCurrentPoint(event);
                var holderClientRect = currentAnnotationHolderElement.getBoundingClientRect();
                if (_this.validateAcetatePosition(_this._acetateHitAreaLineElements, currentAnnotationHolderElement, _this._overlayBoundary, actualX, actualY)) {
                    for (var lineIndex = 0; lineIndex < _this._currentAcetateData.acetateData.acetateLines.length; lineIndex++) {
                        var acetateLine = _this._currentAcetateData.acetateData.acetateLines[lineIndex];
                        var containerScroll = _this.getMarkSheetContainerScrollDelta();
                        // Update the mouse pointer with the scroll offset as well.
                        actualX += containerScroll.deltaX;
                        actualY += containerScroll.deltaY;
                        if (_this._acetateMoveAction === enums.AcetateAction.move) {
                            for (var pointIndex = 1; pointIndex <= acetateLine.points.length; pointIndex++) {
                                var point = acetateLine.points[pointIndex - 1];
                                // Calculating the x,y w.r.t the current annotation holder,
                                // based on the before and after client rect values of first line element
                                // and find the actual delta to be applied to find the new points
                                var lineRectLeftAfterPan = acetateHitAreaLineElementClientRectAfterPan.left - holderClientRect.left;
                                var lineRectLeftBeforePan = _this._acetateHitAreaLineElementClientRectBeforePan.left - holderClientRect.left;
                                var lineRectTopAfterPan = acetateHitAreaLineElementClientRectAfterPan.top - holderClientRect.top;
                                var lineRectTopBeforePan = _this._acetateHitAreaLineElementClientRectBeforePan.top - holderClientRect.top;
                                var x = (((lineRectLeftAfterPan - lineRectLeftBeforePan) + containerScroll.deltaX) /
                                    currentAnnotationHolderElement.clientWidth) * _this._imageDimension.imageWidth;
                                var y = (((lineRectTopAfterPan - lineRectTopBeforePan) + containerScroll.deltaY) /
                                    currentAnnotationHolderElement.clientHeight) * _this._imageDimension.imageHeight;
                                // Finding the delta values w.r.t rotated angle
                                _a = overlayHelper.getMousePointerDeltaXY(x, y, _this._rotatedAngle), dx = _a[0], dy = _a[1];
                                var pointY = point.y + dy;
                                // if the page is linked then we need to calculate x,y values against the linked page.
                                // in store we currently have the values against the output page which is not linked. so for 
                                // calculating delta values against the linked page we need to consider the zones height above 
                                // the current zone and the current zone left.
                                var _b = _this.getZoneDimensionsBasedOnLinkingScenario(_this.props.linkingScenarioProps, _this._currentAcetateData), zoneLeft = _b[0], zoneTop = _b[1], topAboveCurrentZone = _b[2];
                                point.x = point.x + zoneLeft;
                                point.y = point.y + zoneTop - topAboveCurrentZone;
                                // for stitched image adjust the stitched gap from y coordinate to avoid the gap value in db,
                                // this will adjust on render
                                if (_this.isStitchedImage) {
                                    point.y = _this.adjustYCoordinate(actualX, actualY, pointY, dy, _this._rotatedAngle);
                                }
                                else {
                                    point.y = point.y + dy;
                                }
                                point.x = point.x + dx;
                            }
                        }
                        else if (_this._acetateMoveAction === enums.AcetateAction.resize) {
                            if (_this.isStructured) {
                                // normally in resize we only need to update the point which is moved. but when a zone is linked 
                                // and an acetate is moved for the first time, all the points need to be updated as these points are
                                // calculated w.r.t to output page which is not linked.
                                for (var lineIndex_1 = 0; lineIndex_1 < _this._currentAcetateData.acetateData.acetateLines.length; lineIndex_1++) {
                                    var acetateLine_1 = _this._currentAcetateData.acetateData.acetateLines[lineIndex_1];
                                    for (var pointIndex = 1; pointIndex <= acetateLine_1.points.length; pointIndex++) {
                                        var point = acetateLine_1.points[pointIndex - 1];
                                        var _c = _this.getZoneDimensionsBasedOnLinkingScenario(_this.props.linkingScenarioProps, _this._currentAcetateData), zoneLeft = _c[0], zoneTop = _c[1], topAboveCurrentZone = _c[2];
                                        point.x = point.x + zoneLeft;
                                        point.y = point.y + zoneTop - topAboveCurrentZone;
                                    }
                                }
                            }
                        }
                    }
                    /*Updating output page number to zero and whole page number to page number
                    in case of movement in linked page */
                    if (_this.props.imageProps.isALinkedPage) {
                        if (_this.props.doApplyLinkingScenarios) {
                            _this._currentAcetateData.acetateData.outputPageNumber = 0;
                            _this._currentAcetateData.acetateData.wholePageNumber = _this.props.imageProps.pageNo;
                        }
                    }
                    // update acetate data to store
                    acetatesActionCreator.addOrUpdateAcetate(_this._currentAcetateData, enums.MarkingOperation.updated);
                }
                else {
                    if (_this._acetateMoveAction === enums.AcetateAction.resize) {
                        acetatesActionCreator.acetatePositionUpdateAction(_this._initialAcetateData, enums.AcetateAction.none);
                    }
                }
            }
            // hide bin icon
            toolbarActionCreator.PanStampToDeleteArea(false, actualX, actualY);
            acetatesActionCreator.acetateInGreyArea(false, _this._clientToken);
            _this.enableImageContainerScroll(true);
            _this.clearPanData();
            var _a;
        };
        /**
         * call when toggle button to share multiline changes
         */
        this.shareAcetate = function () {
            _this._acetatesList = _this.getAcetateListCollection();
            _this.reRender();
        };
        /**
         * enables or disables image container scroll
         * @param value
         */
        this.enableImageContainerScroll = function (value) {
            if (_this.props.enableImageContainerScroll) {
                _this.props.enableImageContainerScroll(value);
            }
        };
        /**
         * On adding or updating acetates.
         */
        this.onAddingOrUpdatingAcetates = function (_clientToken, _addedOrUpdatedAcetate) {
            _this._acetatesList = _this.getAcetateListCollection();
            _this._addedAcetateClientToken = _clientToken;
            _this.reRender();
        };
        /**
         * On Removing acetates.
         * Render the overlay holder once the acetate removed action updated in the collection.
         */
        this.onRemoveAcetates = function () {
            _this._acetatesList = _this.getAcetateListCollection();
            _this.reRender();
        };
        /* fired on question item changed event */
        this.onQuestionItemChanged = function () {
            if (_this.isComponentMounted) {
                _this.reRender();
            }
        };
        /* rerender overlay holder */
        this.reRender = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * On zoom updated
         */
        this.onZoomUpdated = function () {
            // avoid rerending if the image is rotating
            if (!markingStore.instance.isRotating) {
                _this.setState({
                    zoomUpdated: Date.now()
                });
            }
        };
        /**
         * fires on acetate selection from stamp panel
         */
        this.onAcetateSelection = function () {
            // For structured get the output page no and for unstructured get the page no.
            var pageNo = _this.isStructured ? _this.props.imageProps.outputPageNo : _this.props.imageProps.pageNo;
            _this._rotatedAngle = overlayHelper.getRotatedAngle(_this.props.imageProps.pageNo, _this.props.imageProps.linkedOutputPageNo);
            if (!_this.isStructured) {
                // Check if the view-mode is Booklet
                var visiblePageNo = responseStore.instance.pageNoIndicatorData.mostVisiblePageNo[0];
                if (toolbarStore.instance.selectedAcetate !== undefined && pageNo === visiblePageNo) {
                    // Adding acetate.
                    overlayHelper.addAcetate(toolbarStore.instance.selectedAcetate, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId, markingStore.instance.currentQuestionItemInfo.answerItemId, _this.props, 'img_' + visiblePageNo);
                }
            }
        };
        /**
         * Showing context menu when we right click on any overlay which is selected.
         */
        this.onContextMenu = function (event) {
            if (!htmlUtilities.isTabletOrMobileDevice) {
                var actualX = event.clientX;
                var actualY = event.clientY;
                var overlayX = 0;
                var overlayY = 0;
                event.preventDefault();
                event.stopPropagation();
                // find element in mouse point
                var element = htmlUtilities.getElementFromPosition(actualX, actualY);
                // find acetate from element in x, y
                _this._acetateElement = htmlUtilities.findAncestor(element, 'overlay-wrap');
                _this._clientToken = _this._acetateElement.getAttribute('data-client-token');
                if (!_this._clientToken) {
                    return;
                }
                _this._toolType = _this.getToolType(_this._acetateElement.getAttribute('data-tool-type'));
                _this.enableImageContainerScroll(false);
                var acetateContextMenuData_2 = overlayHelper.getAcetateContextMenuData(_this._clientToken, _this._toolType);
                switch (_this._toolType) {
                    case enums.ToolType.multiline:
                        var _index = _this.getLineIndex(event);
                        if (!_index) {
                            return;
                        }
                        acetateContextMenuData_2.multilinearguments.LineIndex = _index;
                        break;
                }
                _this.showOrHideRemoveContextMenu(true, event.clientX, event.clientY, acetateContextMenuData_2);
            }
        };
        this.state = {
            zoomUpdated: 0,
            renderedOn: 0
        };
        this._acetatesList = this.getAcetateListCollection();
        this._addedAcetateClientToken = null;
        this.onAddingOrUpdatingAcetates = this.onAddingOrUpdatingAcetates.bind(this);
        this.onAcetateSelection = this.onAcetateSelection.bind(this);
        this.structuredFracsDataLoadedForAcetates = this.structuredFracsDataLoadedForAcetates.bind(this);
        this.onQuestionItemChanged = this.onQuestionItemChanged.bind(this);
        this.getOverlayHolderElement = this.getOverlayHolderElement.bind(this);
        this.onTouchHold = this.onTouchHold.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.addPoint = this.addPoint.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }
    /**
     * component did mount of overlay holder
     */
    OverlayHolder.prototype.componentDidMount = function () {
        this.isComponentMounted = true;
        this._overlayHolderElement = ReactDom.findDOMNode(this);
        this._imageDimension = overlayHelper.getImageDimension(this.props.imageProps);
        this.setUpHammer();
        qigStore.instance.addListener(qigStore.QigStore.ACETATES_ADDED_OR_UPDATED_EVENT, this.onAddingOrUpdatingAcetates);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.ACETATE_SELECTED_EVENT, this.onAcetateSelection);
        responseStore.instance.addListener(responseStore.ResponseStore.FRACS_DATA_SET_FOR_ACETATES_EVENT, this.structuredFracsDataLoadedForAcetates);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.onZoomUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onQuestionItemChanged);
        qigStore.instance.addListener(qigStore.QigStore.ACETATES_REMOVED_EVENT, this.onRemoveAcetates);
        qigStore.instance.addListener(qigStore.QigStore.ACETATES_SHARED_EVENT, this.shareAcetate);
        qigStore.instance.addListener(qigStore.QigStore.ADD_POINT_TO_MULTILINE_EVENT, this.addMultilineItems);
        qigStore.instance.addListener(qigStore.QigStore.MULTILINE_STYLE_UPDATE_EVENT, this.updateMultilineStyle);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.onZoomUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.ROTATION_COMPLETED_EVENT, this.onZoomUpdated);
    };
    /**
     * component will unmount of overlay holder
     */
    OverlayHolder.prototype.componentWillUnmount = function () {
        this.isComponentMounted = false;
        this.destroyHammer();
        qigStore.instance.removeListener(qigStore.QigStore.ACETATES_ADDED_OR_UPDATED_EVENT, this.onAddingOrUpdatingAcetates);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.ACETATE_SELECTED_EVENT, this.onAcetateSelection);
        responseStore.instance.removeListener(responseStore.ResponseStore.FRACS_DATA_SET_FOR_ACETATES_EVENT, this.structuredFracsDataLoadedForAcetates);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.onZoomUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onQuestionItemChanged);
        qigStore.instance.removeListener(qigStore.QigStore.ACETATES_REMOVED_EVENT, this.onRemoveAcetates);
        qigStore.instance.removeListener(qigStore.QigStore.ACETATES_SHARED_EVENT, this.shareAcetate);
        qigStore.instance.removeListener(qigStore.QigStore.ADD_POINT_TO_MULTILINE_EVENT, this.addMultilineItems);
        qigStore.instance.removeListener(qigStore.QigStore.MULTILINE_STYLE_UPDATE_EVENT, this.updateMultilineStyle);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.onZoomUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.ROTATION_COMPLETED_EVENT, this.onZoomUpdated);
    };
    /**
     * Method to calculate new point
     * @param clientToken
     * @param pointX
     * @param pointY
     */
    OverlayHolder.prototype.calculatePoint = function (clientToken, pointX, pointY, acetateContextMenuDetail) {
        var acetate = this._acetatesList.filter(function (item) { return item.clientToken === clientToken; }).get(0);
        var distanceP1AnP2 = undefined;
        var index = 0;
        var lineIndex = acetateContextMenuDetail.multilinearguments.LineIndex;
        for (var i = 0; i < acetate.acetateData.acetateLines[lineIndex].points.length - 1; i++) {
            var p1 = acetate.acetateData.acetateLines[lineIndex].points[i];
            var p2 = acetate.acetateData.acetateLines[lineIndex].points[i + 1];
            /* steps to find the shortest distance */
            /* Shortest distance can be found if we know the perpendicular point to that line segment.
               But for the line segment means a line whose two points are already define i.e within a particular region,
               the point should make a perpendicular line intersecting between that line segment.
               If not then the line heading left and making perpendicular then
               the shortest distance would be calculated between the point and
               the left most point of that line or vice-versa for right most point.
               Consider the below equation to calculate shortest distance

               Let the point be A. Then the line be l, and whose segment whose first(B) and end point(B+C) is known,
               and C defines the direction of line,then that line segment can be defined as:
               l(t) = B + tC, where t varies from 0 to 1. and t can be calculated as t=(C*(A-B)/(C*C)).
               If t is between 0 and 1 i.e 0<t
               If t<=0 than, that means that perpendicular line from point to a line,
               will intersect before first point of that line segment, and so for shortest distance,
               we will calculate the distance from that point to the first point of the line segment.
               Similarly, vice versa would be applied if t>=1,
               and we will calculate the distance between the point and the end point of that segment.
               */
            var diffX = p2.x - p1.x;
            var diffY = p2.y - p1.y;
            if ((diffX === 0) && (diffY === 0)) {
                diffX = pointX - p1.x;
                diffY = pointY - p1.y;
                distanceP1AnP2 = Math.sqrt(diffX * diffX + diffY * diffY);
            }
            var t = ((pointX - p1.x) * diffX + (pointY - p1.y) * diffY) / (diffX * diffX + diffY * diffY);
            if (t < 0) {
                //point is nearest to the first point i.e x1 and y1
                diffX = pointX - p1.x;
                diffY = pointY - p1.y;
            }
            else if (t > 1) {
                //point is nearest to the end point i.e x2 and y2
                diffX = pointX - p2.x;
                diffY = pointY - p2.y;
            }
            else {
                //if perpendicular line intersect the line segment.
                diffX = pointX - (p1.x + t * diffX);
                diffY = pointY - (p1.y + t * diffY);
            }
            //returning shortest distance
            var _dist = Math.sqrt(diffX * diffX + diffY * diffY);
            if (!distanceP1AnP2 || distanceP1AnP2 >= _dist) {
                distanceP1AnP2 = _dist;
                index = i;
            }
        }
        //distance between new point on line and new point
        var a = acetate.acetateData.acetateLines[lineIndex].points[index].x - pointX;
        var b = acetate.acetateData.acetateLines[lineIndex].points[index].y - pointY;
        var distance = Math.sqrt(a * a + b * b);
        var newDist = Math.sqrt(distance * distance - distanceP1AnP2 * distanceP1AnP2);
        // a. calculate the vector
        var vectorX = acetate.acetateData.acetateLines[lineIndex].points[index + 1].x -
            acetate.acetateData.acetateLines[lineIndex].points[index].x;
        var vectorY = acetate.acetateData.acetateLines[lineIndex].points[index + 1].y -
            acetate.acetateData.acetateLines[lineIndex].points[index].y;
        var factor = newDist / Math.sqrt(vectorX * vectorX + vectorY * vectorY);
        // c. factor the lengths
        vectorX *= factor;
        vectorY *= factor;
        // d. calculate new vector,
        var newX = acetate.acetateData.acetateLines[lineIndex].points[index].x + vectorX;
        var newY = acetate.acetateData.acetateLines[lineIndex].points[index].y + vectorY;
        /* Check whether the point already exist on line*/
        if ((this.isPointExistOnMultiline(newX, newY, acetate, lineIndex)) ||
            ((newX > acetate.acetateData.acetateLines[lineIndex].points[index + 1].x) ||
                (newY > acetate.acetateData.acetateLines[lineIndex].points[index + 1].y))) {
            /*Find another point on line*/
            var newPointWithIndex = this.findNextPoint(newX, newY, acetate, index, lineIndex);
            newX = newPointWithIndex.x;
            newY = newPointWithIndex.y;
            index = newPointWithIndex.index;
        }
        return {
            pointIndex: index + 1,
            x: newX,
            y: newY
        };
    };
    /**
     * Method to find the another point on the line.
     * @param pX
     * @param pY
     * @param acetate
     * @param index
     */
    OverlayHolder.prototype.findNextPoint = function (pX, pY, acetate, index, lineIndex) {
        for (var i = index; i < acetate.acetateData.acetateLines[lineIndex].points.length - 1; i++) {
            var p1 = acetate.acetateData.acetateLines[lineIndex].points[i];
            var p2 = acetate.acetateData.acetateLines[lineIndex].points[i + 1];
            var newX = (p1.x + p2.x) / 2;
            var newY = (p1.y + p2.y) / 2;
            if (!this.isPointExistOnMultiline(newX, newY, acetate, lineIndex)) {
                return {
                    x: newX,
                    y: newY,
                    index: i
                };
            }
        }
        for (var i = index; i >= 0; i--) {
            var p1 = acetate.acetateData.acetateLines[lineIndex].points[i];
            var p2 = acetate.acetateData.acetateLines[lineIndex].points[i - 1];
            var newX = (p1.x + p2.x) / 2;
            var newY = (p1.y + p2.y) / 2;
            if (!this.isPointExistOnMultiline(newX, newY, acetate, lineIndex)) {
                return {
                    x: newX,
                    y: newY,
                    index: i - 1
                };
            }
        }
    };
    /**
     * Method to check the new point exist in the line
     * @param x
     * @param y
     * @param acetate
     */
    OverlayHolder.prototype.isPointExistOnMultiline = function (x, y, acetate, lineIndex) {
        for (var i = 0; i < acetate.acetateData.acetateLines[lineIndex].points.length; i++) {
            var point = acetate.acetateData.acetateLines[lineIndex].points[i];
            if ((x > (point.x - constants.MULTI_LINE_ADD_OFFSET_X)) &&
                (x < (point.x + constants.MULTI_LINE_ADD_OFFSET_X)) &&
                (y > (point.y - constants.MULTI_LINE_ADD_OFFSET_X)) &&
                (y < (point.y + constants.MULTI_LINE_ADD_OFFSET_X))) {
                return true;
            }
        }
        return false;
    };
    /**
     * hammer event setup
     */
    OverlayHolder.prototype.setUpHammer = function () {
        if (!this.eventHandler.isInitialized) {
            var touchActionValue = deviceHelper.isTouchDevice() ? 'auto' : 'none';
            this.eventHandler.initEvents(this._overlayHolderElement, touchActionValue, true);
            // setting threshold as 0 because if threshold value is greater than 0 pan start will only get fired 
            // after moving that constant value. so this is causing issues while finding correct element in x, y position
            // in touch device (samsung) pan start will trigger on touchhold,so context menu won't get visible
            // adding threshold value only for touchdevices
            var threshold = deviceHelper.isTouchDevice() ? constants.PAN_THRESHOLD : 0;
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_ALL, threshold: threshold });
            this.eventHandler.on(eventTypes.PAN_START, this.onPanStart.bind(this));
            this.eventHandler.on(eventTypes.PAN_END, this.onPanEnd.bind(this));
            this.eventHandler.on(eventTypes.PAN_CANCEL, this.onPanEnd);
            this.eventHandler.on(eventTypes.PAN, this.onPanMove.bind(this));
            if (deviceHelper.isTouchDevice()) {
                this.eventHandler.get(eventTypes.PRESS, { time: constants.PRESS_TIME_DELAY });
                this.eventHandler.on(eventTypes.PRESS, this.onTouchHold);
                this.eventHandler.on(eventTypes.PRESS_UP, this.onPressUp);
            }
        }
    };
    /**
     * Show or hide remove context menu for acetate
     * @param isVisible
     * @param clientX
     * @param clientY
     * @param acetateContextMenuData
     */
    OverlayHolder.prototype.showOrHideRemoveContextMenu = function (isVisible, clientX, clientY, acetateContextMenuData) {
        //check if exception/Meassge panel is opened/ maximized
        if (this.isMessageOrExceptionPanelVisible) {
            return;
        }
        var overlayX = 0;
        var overlayY = 0;
        var coordinates = {
            clientX: clientX,
            clientY: clientY
        };
        acetateContextMenuData.multilinearguments.overlayHolderId = this.getOverlayHolderId();
        var acetate = this._acetatesList.filter(function (item) { return item.clientToken ===
            acetateContextMenuData.clientToken; }).get(0);
        if (acetate) {
            acetateContextMenuData.multilinearguments.isShared = acetate.shared;
            acetateContextMenuData.multilinearguments.noOfPoints = acetate.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].points.length;
            acetateContextMenuData.multilinearguments.noOfLines = acetate.acetateData.acetateLines.length;
            acetateContextMenuData.multilinearguments.LineColor =
                acetate.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].colour;
            acetateContextMenuData.multilinearguments.LineType =
                acetate.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].lineType;
            var pointCollection = acetate.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].points;
            _a = this.getMultilineCoordinates(coordinates), overlayX = _a[0], overlayY = _a[1];
            acetateContextMenuData.multilinearguments.PointIndex = this.getIndexOfClosestPoint(overlayX, overlayY, pointCollection);
            markingActionCreator.showOrHideRemoveContextMenu(isVisible, clientX, clientY, acetateContextMenuData);
        }
        var _a;
    };
    /**
     * destroy hammer events
     */
    OverlayHolder.prototype.destroyHammer = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    /**
     * Render method
     */
    OverlayHolder.prototype.render = function () {
        return React.createElement("div", {onContextMenu: this.onContextMenu, onClick: this.onClickHandler, className: 'overlay-holder', id: this.getOverlayHolderId()}, this.strokeWidthStyle, this.renderAcetates());
    };
    /**
     * trigger while clicking on overlay holder
     */
    OverlayHolder.prototype.onClickHandler = function (event) {
        // this event will trigger in Ipad touchHold, hiding the contextmenu
        // logic which is written in responsecontainer ll get executed, so to avoid this issue we are
        // preventing its propagation
        event.preventDefault();
        event.stopPropagation();
    };
    /**
     * render acetates
     */
    OverlayHolder.prototype.renderAcetates = function () {
        var _this = this;
        // defensive fix for defect : 65503 - unexpected error
        var itemId = markingStore.instance.currentQuestionItemInfo ?
            markingStore.instance.currentQuestionItemInfo.answerItemId : 0;
        var acetatesAgainstCurrentQuestion = overlayHelper.getAcetesForCurrentPageOrZone(this._acetatesList, itemId, this.props.doApplyLinkingScenarios, this.props.imageProps, this.props.linkingScenarioProps);
        var acetatesAgainstSkippedZones = overlayHelper.getAcetatesForSkippedZones(this._acetatesList, itemId, this.props.imageProps, this.props.linkingScenarioProps);
        if (acetatesAgainstCurrentQuestion) {
            acetatesAgainstCurrentQuestion = acetatesAgainstCurrentQuestion.concat(acetatesAgainstSkippedZones);
        }
        else {
            acetatesAgainstCurrentQuestion = acetatesAgainstSkippedZones;
        }
        if (acetatesAgainstCurrentQuestion) {
            var annotationOverlayParentElement = this.props.getAnnotationOverlayElement ?
                this.props.getAnnotationOverlayElement : undefined;
            this._overlayBoundary =
                overlayHelper.getStitchedImageBoundary(annotationOverlayParentElement, this._rotatedAngle);
            var acetatesToRender = acetatesAgainstCurrentQuestion.map(function (acetate, index) {
                switch (acetate.acetateData.toolType) {
                    case enums.ToolType.ruler:
                        return (React.createElement(Ruler, {key: 'ruler_' + index, id: 'ruler_' + index, acetateDetails: acetate, imageProps: _this.props.imageProps, getAnnotationOverlayElement: _this.props.getAnnotationOverlayElement, linkingScenarioProps: _this.props.linkingScenarioProps, doApplyLinkingScenarios: _this.props.doApplyLinkingScenarios, doUpdate: _this._addedAcetateClientToken === acetate.clientToken, zoomUpdated: _this.state.zoomUpdated, isStitchedImage: _this.isStitchedImage}));
                    case enums.ToolType.multiline:
                        return (React.createElement(Multiline, {key: 'multiline_' + index, id: 'multiline_' + index, acetateDetails: acetate, imageProps: _this.props.imageProps, getAnnotationOverlayElement: _this.props.getAnnotationOverlayElement, linkingScenarioProps: _this.props.linkingScenarioProps, doApplyLinkingScenarios: _this.props.doApplyLinkingScenarios}));
                    case enums.ToolType.protractor:
                        return React.createElement(Protractor, {key: 'protractor' + index, id: 'protractor' + index, acetateDetails: acetate, imageProps: _this.props.imageProps, getAnnotationOverlayElement: _this.props.getAnnotationOverlayElement, linkingScenarioProps: _this.props.linkingScenarioProps, doApplyLinkingScenarios: _this.props.doApplyLinkingScenarios, zoomUpdated: _this.state.zoomUpdated, getoverlayHolderElement: _this.getOverlayHolderElement});
                }
            });
            return acetatesToRender;
        }
        return null;
    };
    /**
     * return overlay holder element id
     */
    OverlayHolder.prototype.getOverlayHolderId = function () {
        var pageNo = this.props.imageProps.pageNo ? this.props.imageProps.pageNo : 0;
        var outputPageNo = this.props.imageProps.outputPageNo ? this.props.imageProps.outputPageNo : 0;
        return 'overlayholder_' + pageNo.toString() + '_' + outputPageNo.toString();
    };
    Object.defineProperty(OverlayHolder.prototype, "isPE", {
        /**
         * Method to check the current login examiner is PE.
         */
        get: function () {
            if (qigStore.instance.getSelectedQIGForTheLoggedInUser &&
                qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverlayHolder.prototype, "doDeleteAcetate", {
        /**
         * Method to check whether the current acetate need to be removed.
         */
        get: function () {
            if (!this._currentAcetateData.shared || (!this.isPE && this._currentAcetateData.shared)) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * do adjustment for stitched image gap i ycoordinates
     * @param y
     * @param dy
     */
    OverlayHolder.prototype.adjustYCoordinate = function (clientX, clientY, pointY, dy, rotatedAngle) {
        var mousePointerCoordinate = (rotatedAngle / 90) % 2 === 1 ? clientX : clientY;
        var currentStitchedGapIndex = overlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate(mousePointerCoordinate, this._overlayBoundary);
        var stitchedImageGapIndex = Math.abs(currentStitchedGapIndex - this._initialStitchedImageGapIndex);
        return this.yCoordinateAfterStitchedGapAdjustment(pointY, dy, stitchedImageGapIndex, rotatedAngle);
    };
    /**
     * clear pan data
     */
    OverlayHolder.prototype.clearPanData = function () {
        this.setAcetateTransform(this._toolType, this._clientToken, 0, 0);
        this._acetateElement = undefined;
        this._clientToken = undefined;
        this._toolType = undefined;
        this._currentAcetateData = undefined;
        this._overlayBoundary = [];
        this._doRetainInitialPosition = false;
        this._isMousePointerInGreyArea = false;
        this._acetateMoveAction = enums.AcetateAction.none;
        this._acetatePointIndex = -1;
        this._initialStitchedImageGapIndex = -1;
        this._rotatedAngle = 0;
        this._containerScrollBeforePan = { left: 0, top: 0 };
        this._acetateHitAreaLineElements = undefined;
        this._acetateLineIndex = 0;
    };
    /**
     * find the annottaion overlay from current mouse point
     * @param event
     */
    OverlayHolder.prototype.getAnnotationOverlayInCurrentPoint = function (event) {
        var actualX = event.changedPointers[0].clientX;
        var actualY = event.changedPointers[0].clientY;
        // find element in mouse point
        var element = htmlUtilities.getElementFromPosition(actualX, actualY);
        // find current annotation overlay
        var currentAnnotationOverlay = htmlUtilities.findAncestor(element, 'annotation-overlay');
        return currentAnnotationOverlay;
    };
    /**
     * find tool type
     * @param dataToolType
     */
    OverlayHolder.prototype.getToolType = function (dataToolType) {
        var toolType;
        switch (dataToolType) {
            case 'ruler':
                toolType = enums.ToolType.ruler;
                break;
            case 'multiline':
                toolType = enums.ToolType.multiline;
                break;
            case 'protractor':
                toolType = enums.ToolType.protractor;
                break;
        }
        return toolType;
    };
    /**
     * Find page number from holder element
     * @param holderElement
     */
    OverlayHolder.prototype.pageNoFromElement = function (holderElement) {
        if (!holderElement) {
            return 0;
        }
        var arrayOfAnnotationHolderProperties = holderElement.id.split('_');
        var pageNo = Number(arrayOfAnnotationHolderProperties[2]);
        return pageNo;
    };
    /**
     * set transform style for acetate
     * @param toolType
     * @param clientToken
     * @param x
     * @param y
     * @param doVisible
     */
    OverlayHolder.prototype.setAcetateTransform = function (toolType, clientToken, x, y, doVisible) {
        if (doVisible === void 0) { doVisible = true; }
        $('#' + this.getAcetateId(toolType, clientToken)).css({
            'transform': 'translate(' + x + 'px, ' + y + 'px)', 'visibility': (doVisible ? 'visible' : 'hidden')
        });
    };
    /**
     * return client rect for acetate point
     * @param acetateElement
     * @param index
     */
    OverlayHolder.prototype.getAcetatePointClientRect = function (acetateElement, index) {
        var point = acetateElement.getElementsByClassName('p' + index)[0];
        if (point) {
            return point.getBoundingClientRect();
        }
        else {
            return null;
        }
    };
    /**
     * gets the point elemetn from current mouse point
     */
    OverlayHolder.prototype.getAcetatePointIndex = function (x, y) {
        // find element from x, y
        var element = htmlUtilities.getElementFromPosition(x, y);
        // find current annotation overlay
        var acetatePoint = overlayHelper.findAncestor(element, 'overlay-plus-svg');
        var acetatePointClass = (acetatePoint && acetatePoint.className && typeof (acetatePoint.className) === 'string') ?
            acetatePoint.className : acetatePoint.className.baseVal;
        if (acetatePointClass && acetatePointClass.indexOf('overlay-plus-svg') === 0) {
            // acetate point svg class will be 'overlay-plus-svg p1'. so we split the class with space 
            // and remove p from the item in the second position of the split array
            var split = acetatePointClass.split(' ');
            if (split.length > 0) {
                if (this._toolType === enums.ToolType.multiline) {
                    /* Split line and point index for resizing single point on a multi-line overlay
                       For example acetate point shown as 'p_1_0', where 1 indicate line index and 0 indicate point index.
                       So split the acetate point string to get the line and point index.*/
                    var index = split[1].split('_');
                    this._acetateLineIndex = parseInt(index[1]);
                    return parseInt(index[2]);
                }
                else {
                    // substracting 1 as the point index will be one less in the object array
                    return parseInt(split[1].replace('p', '')) - 1;
                }
            }
        }
        return -1;
    };
    /**
     * check whether the mouse pointer is otside of the script image or not
     * @param event
     */
    OverlayHolder.prototype.checkMouseDrawingOutsideResponseArea = function (event) {
        // Getting the element at the current cursor position
        var currentElement = this.getAnnotationOverlayInCurrentPoint(event);
        var elementClass = (currentElement && currentElement.className && typeof (currentElement.className) === 'string') ?
            currentElement.className : null;
        if (elementClass && elementClass.indexOf('annotation-overlay') === 0) {
            return false;
        }
        return true;
    };
    /**
     * returns the acetate in valid position or not
     * @param currentOverlayElement
     * @param annotationHolderElement
     * @param overlayBoundary
     */
    OverlayHolder.prototype.validateAcetatePosition = function (overlayElement, annotationHolderElement, overlayBoundary, actualX, actualY) {
        var annotationHolderClientRect = annotationHolderElement.getBoundingClientRect();
        var isInsideResponse = false;
        var isInsideStichedImage = false;
        for (var index = 0; index < overlayElement.length; index++) {
            var overlayElementClientRect = overlayElement[index].getBoundingClientRect();
            isInsideResponse =
                // is the svg hit area element is inside the overlay
                overlayHelper.isAcetateInsideHolder(overlayElementClientRect, annotationHolderClientRect);
            // check for structured response
            isInsideStichedImage = this.isStitchedImage ?
                // is the svg hit area element is inside the zone
                overlayHelper.isInsideStichedImage(overlayElementClientRect, annotationHolderClientRect, this._rotatedAngle, overlayBoundary)
                : true;
            if (!isInsideResponse || !isInsideStichedImage) {
                // any of the svg hit area element is outside, then no need to check the remaining  svg hit area elements.
                break;
            }
        }
        return isInsideResponse && isInsideStichedImage;
    };
    /**
     * Validate action for move
     * @param event: Custom event type
     */
    OverlayHolder.prototype.isValidMove = function (event) {
        return !this.checkMouseDrawingOutsideResponseArea(event);
    };
    Object.defineProperty(OverlayHolder.prototype, "doEnablePan", {
        /**
         * gets whether the the pan is possible on current move or not
         */
        get: function () {
            // enable move only for ruler
            return this._acetateHitAreaLineElements &&
                // For multiline there is no label, that's why check for tooltype is needed.
                (this._acetateLabelElement || this._toolType === enums.ToolType.multiline) &&
                this.doEnablePanStart;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * return id name for acetate
     * @param toolType
     * @param clientTocken
     */
    OverlayHolder.prototype.getAcetateId = function (toolType, clientTocken) {
        var id;
        switch (toolType) {
            case enums.ToolType.ruler:
                id = 'ruler_' + clientTocken;
                break;
            case enums.ToolType.multiline:
                id = 'multiline_' + clientTocken;
                break;
            case enums.ToolType.protractor:
                id = 'protractor_' + clientTocken;
                break;
        }
        return id;
    };
    /**
     * Handle the action event after setting fracs data for structured response.
     * Adding acetates for structured response.
     */
    OverlayHolder.prototype.structuredFracsDataLoadedForAcetates = function () {
        var pageNo = this.props.doApplyLinkingScenarios ? this.props.imageProps.linkedOutputPageNo :
            this.props.imageProps.outputPageNo;
        var currentlyVisibleFracsData = responseStore.instance.getCurrentVisibleFracsData;
        var visiblePageNo = currentlyVisibleFracsData.outputPage;
        // If there is an acetate selected and the visible page is same as that of the page in which current overlayholder exists,
        // then add an acetate.
        if (toolbarStore.instance.selectedAcetate !== undefined && pageNo === visiblePageNo) {
            var overlayBoundary = void 0;
            var overlayBoundaryInPixel = void 0;
            // overlay boundary calculation is only for stitched images
            if (this.isStitchedImage) {
                var annotationOverlayHolderClientRect = this.props.getAnnotationOverlayElement.getBoundingClientRect();
                overlayBoundary =
                    overlayHelper.getZonesClientRectBasedOnRotatedAngle(this._rotatedAngle, 'outputPageNo_' + visiblePageNo, annotationOverlayHolderClientRect);
                overlayBoundaryInPixel = overlayHelper.getOverlayBoundaryInPixel(overlayBoundary, this._rotatedAngle, annotationOverlayHolderClientRect, this.props.getAnnotationOverlayElement, this._imageDimension);
            }
            overlayHelper.addAcetate(toolbarStore.instance.selectedAcetate, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId, markingStore.instance.currentQuestionItemInfo.answerItemId, this.props, 'outputPageNo_' + visiblePageNo, overlayBoundaryInPixel, this._imageDimension);
        }
    };
    /**
     * to get Multiline Coordinates
     * @param event
     */
    OverlayHolder.prototype.getMultilineCoordinates = function (event) {
        // to add space between existing and newly added line...adding offset
        var actualX = event.clientX + constants.MULTI_LINE_ADD_OFFSET_X;
        var actualY = event.clientY;
        var overlayX = 0;
        var overlayY = 0;
        var currentAnnotationHolderElement = this.getAnnotationOverlayFromClientXY(event.clientX, event.clientY);
        var accetateDimension = overlayHelper.getAcetateDefaultDimension(enums.ToolType.multiline, true);
        this._rotatedAngle = overlayHelper.getRotatedAngle(this.props.imageProps.pageNo, this.props.imageProps.linkedOutputPageNo);
        var overlayBoundary = overlayHelper.getStitchedImageBoundary(currentAnnotationHolderElement, this._rotatedAngle);
        var mousePointerCoordinate = (this._rotatedAngle / 90) % 2 === 1 ? event.clientX : event.clientY;
        var stitchedImageGapIndex = overlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate(mousePointerCoordinate, overlayBoundary);
        var doZonesCalculation = overlayBoundary && overlayBoundary.length > 0;
        if (doZonesCalculation) {
            var seperatorDistance = 0;
            for (var i = 1; i < overlayBoundary.length; i++) {
                switch (this._rotatedAngle) {
                    case enums.RotateAngle.Rotate_0:
                    case enums.RotateAngle.Rotate_360:
                        seperatorDistance += (overlayBoundary[i].start - overlayBoundary[i - 1].end);
                        if (actualY > overlayBoundary[i].start && actualY < overlayBoundary[i].end) {
                            actualY -= seperatorDistance;
                        }
                        break;
                    case enums.RotateAngle.Rotate_180:
                        seperatorDistance += (overlayBoundary[i - 1].start - overlayBoundary[i].end);
                        if (actualY > overlayBoundary[i].start && actualY < overlayBoundary[i].end) {
                            actualY += seperatorDistance;
                        }
                        break;
                    case enums.RotateAngle.Rotate_90:
                        seperatorDistance += (overlayBoundary[i - 1].start - overlayBoundary[i].end);
                        if (actualX < overlayBoundary[i].end && actualX > overlayBoundary[i].start) {
                            actualX += seperatorDistance;
                        }
                        break;
                    case enums.RotateAngle.Rotate_270:
                        seperatorDistance += (overlayBoundary[i - 1].end - overlayBoundary[i].start);
                        if (actualX < overlayBoundary[i].end && actualX > overlayBoundary[i].start) {
                            actualX += seperatorDistance;
                        }
                        break;
                }
            }
        }
        var currentOverlayHolderClientRect = currentAnnotationHolderElement.getBoundingClientRect();
        _a = overlayHelper.getMousePointerClientXY(actualX, actualY, this._rotatedAngle, currentOverlayHolderClientRect, currentAnnotationHolderElement, this._imageDimension), overlayX = _a[0], overlayY = _a[1];
        if (doZonesCalculation) {
            _b = this.getMultilineCoordinatesForStructured(overlayX, overlayY, stitchedImageGapIndex, accetateDimension), overlayX = _b[0], overlayY = _b[1];
        }
        else {
            _c = this.getMultilineCoordinatesForUnStructured(overlayX, overlayY, this._imageDimension, accetateDimension), overlayX = _c[0], overlayY = _c[1];
        }
        return [overlayX, overlayY];
        var _a, _b, _c;
    };
    /**
     * To get AnnotationOverlay From ClientXY
     * @param actualX
     * @param actualY
     */
    OverlayHolder.prototype.getAnnotationOverlayFromClientXY = function (actualX, actualY) {
        // find element in mouse point
        var element = htmlUtilities.getElementFromPosition(actualX, actualY);
        // find current annotation overlay
        var currentAnnotationOverlay = htmlUtilities.findAncestor(element, 'annotation-overlay');
        return currentAnnotationOverlay;
    };
    /**
     * To get Multiline Coordinates For Structured
     * @param x
     * @param y
     * @param stitchedIndex
     * @param accetateDimension
     */
    OverlayHolder.prototype.getMultilineCoordinatesForStructured = function (x, y, stitchedIndex, accetateDimension) {
        var _zoneNatural = {
            imageHeight: 0,
            imageWidth: 0
        };
        var overlayX = x;
        var overlayY = y;
        var totalZoneNaturalHeight = 0;
        for (var i = 0; i <= stitchedIndex; i++) {
            var zoneNatural = {
                imageHeight: overlayHelper.getStitchedImageDimension(this.props.imageProps.stitchedImageZones, this.props.imageProps.getImageNaturalDimension, i).height,
                imageWidth: overlayHelper.getStitchedImageDimension(this.props.imageProps.stitchedImageZones, this.props.imageProps.getImageNaturalDimension, i).width
            };
            if (i === stitchedIndex) {
                _zoneNatural = zoneNatural;
            }
            totalZoneNaturalHeight = totalZoneNaturalHeight + zoneNatural.imageHeight;
        }
        // invalid zone
        if ((accetateDimension.height > _zoneNatural.imageHeight) || (accetateDimension.width > _zoneNatural.imageWidth)) {
            return [0, 0];
        }
        if ((x + accetateDimension.width) > _zoneNatural.imageWidth) {
            overlayX = x - accetateDimension.width;
        }
        if ((y + accetateDimension.height) > totalZoneNaturalHeight) {
            if ((y + accetateDimension.height) > _zoneNatural.imageHeight) {
                overlayY = totalZoneNaturalHeight - accetateDimension.height - constants.MULTI_LINE_ADD_OFFSET_X;
            }
            else {
                overlayY = y - accetateDimension.height;
            }
        }
        return [overlayX, overlayY];
    };
    /**
     * To get Multiline Coordinates For UnStructured
     * @param x
     * @param y
     * @param imageDimension
     * @param accetateDimension
     */
    OverlayHolder.prototype.getMultilineCoordinatesForUnStructured = function (x, y, imageDimension, accetateDimension) {
        var overlayX = x;
        var overlayY = y;
        if ((x + accetateDimension.width) > imageDimension.imageWidth) {
            overlayX = x - accetateDimension.width;
        }
        if ((y + accetateDimension.height) > imageDimension.imageHeight) {
            overlayY = y - accetateDimension.height;
        }
        return [overlayX, overlayY];
    };
    /**
     * To get line index of multiline by spliting ID
     * @param event
     */
    OverlayHolder.prototype.getLineIndex = function (event) {
        var element = htmlUtilities.getElementFromPosition(event.clientX, event.clientY);
        var _index = [];
        if (element.id.indexOf('multiLinePathArea') !== -1) {
            _index = element.id.split('_');
        }
        else if (element.id === '') {
            var elementToFindIndex = element.parentElement || element.parentNode;
            _index = elementToFindIndex && elementToFindIndex.id.split('_');
        }
        return _index ? _index[1] : undefined;
    };
    /**
     * Once any acetate removed from marking screen then no need to show that overlay on marking screen.
     * Iterating the collection for excluding the deleted one.
     */
    OverlayHolder.prototype.getAcetateListCollection = function () {
        if (qigStore.instance.acetatesList && qigStore.instance.acetatesList.size > 0) {
            var item = qigStore.instance.acetatesList.filter(function (item) { return item.markingOperation !== enums.MarkingOperation.deleted; });
            return item;
        }
    };
    /**
     * Get acetate overlay width
     */
    OverlayHolder.prototype.getAcetateOverlayWidth = function () {
        // Get parent element i.e. annotation overlay right edge boundary
        if (this.props.getAnnotationOverlayElement !== undefined) {
            return this.props.getAnnotationOverlayElement.getBoundingClientRect().right;
        }
        return 0;
    };
    /**
     * Get acetate hit area line elements.
     */
    OverlayHolder.prototype.getAcetateHitAreaLineElements = function (toolType) {
        var _elements;
        switch (toolType) {
            case enums.ToolType.ruler:
                _elements = this._acetateElement.getElementsByClassName('overlay-element ruler-line');
                break;
            case enums.ToolType.protractor:
                _elements = this._acetateElement.getElementsByClassName('overlay-element protractor-line');
                break;
            case enums.ToolType.multiline:
                _elements = this._acetateElement.getElementsByClassName('overlay-element multi-line');
                break;
        }
        return _elements;
    };
    Object.defineProperty(OverlayHolder.prototype, "isMessageOrExceptionPanelVisible", {
        /**
         * Checking whether the message or exception panel is opened or not.
         */
        get: function () {
            return (exceptionStore.instance.isExceptionPanelVisible || messageStore.instance.isMessagePanelVisible);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverlayHolder.prototype, "isStitchedImage", {
        /**
         * return true if the current overlay has stitched image gaps
         */
        get: function () {
            return this.props.imageProps.isStitchedImage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverlayHolder.prototype, "strokeWidth", {
        /**
         * gets the stroke width for overlay-hit-area-line element based on zoom percentage
         */
        get: function () {
            // standard stroke width for overlay-hit-area-line element is 42px for touch devices,
            // adjust that with current zoom percentage
            return 42 * 100 / responseStore.instance.currentZoomPercentage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverlayHolder.prototype, "strokeWidthStyle", {
        /**
         * gets the strokewidth style
         */
        get: function () {
            return deviceHelper.isTouchDevice() ? (React.createElement("style", null, " ", '#' + this.getOverlayHolderId() +
                ' .overlay-hit-area-line{stroke-width:' + this.strokeWidth + 'px;}')) : null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * return scroll delta of marksheet container
     */
    OverlayHolder.prototype.getMarkSheetContainerScrollDelta = function () {
        var scroll = { deltaX: 0, deltaY: 0 };
        var markSheetContainer = overlayHelper.getMarkSheetContainer();
        scroll.deltaX = markSheetContainer.scrollLeft - this._containerScrollBeforePan.left;
        scroll.deltaY = markSheetContainer.scrollTop - this._containerScrollBeforePan.top;
        return scroll;
    };
    /**
     * return deltaX and deltaY based on rotated angle
     * @param x
     * @param y
     * @param rotatedAngle
     */
    OverlayHolder.prototype.getDeltaXY = function (x, y, rotatedAngle) {
        var markSheetScroll = this.getMarkSheetContainerScrollDelta();
        var _a = overlayHelper.getMousePointerDeltaXY(x, y, rotatedAngle), deltaX = _a[0], deltaY = _a[1];
        deltaX += markSheetScroll.deltaX;
        deltaY += markSheetScroll.deltaY;
        return [deltaX, deltaY];
    };
    /**
     * adjust the ycoordinate with stitche image gap
     * @param pointY
     * @param dy
     * @param stitchedImageGapIndex
     * @param rotatedAngle
     */
    OverlayHolder.prototype.yCoordinateAfterStitchedGapAdjustment = function (pointY, dy, stitchedImageGapIndex, rotatedAngle) {
        // adjust the stitchedImageGapOffset from y coordinates in percent
        var pointYInPercent = overlayHelper.findPercentage(pointY, this._imageDimension.imageHeight);
        var stitchedImageGapOffset = overlayHelper.findStitchedImageGapOffset(pointYInPercent, rotatedAngle, this.props.getAnnotationOverlayElement, stitchedImageGapIndex);
        if (dy >= 0) {
            //if moving down then deduct the stitchedImageGapOffset, it will add on render
            pointYInPercent -= stitchedImageGapOffset;
        }
        else {
            //if moving up then add the stitchedImageGapOffset
            pointYInPercent += stitchedImageGapOffset;
        }
        return overlayHelper.convertPercentageToPixel(pointYInPercent, this._imageDimension.imageHeight);
    };
    Object.defineProperty(OverlayHolder.prototype, "isStructured", {
        /* Returns true if the response is structured.*/
        get: function () {
            return this.props.imageProps.outputPageNo > 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the zone left, top and top above current zone.
     * @param linkingScenarioProps
     * @param currentAcetateData
     */
    OverlayHolder.prototype.getZoneDimensionsBasedOnLinkingScenario = function (linkingScenarioProps, currentAcetateData) {
        var _a = [0, 0, 0], zoneLeft = _a[0], zoneTop = _a[1], topAboveCurrentZone = _a[2];
        if (this.props.doApplyLinkingScenarios && this.props.imageProps.isALinkedPage
            && currentAcetateData.acetateData.wholePageNumber === 0) {
            zoneLeft = currentAcetateData.imageLinkingData ?
                currentAcetateData.imageLinkingData.skippedZoneLeft : linkingScenarioProps.zoneLeft;
            zoneTop = currentAcetateData.imageLinkingData ?
                currentAcetateData.imageLinkingData.skippedZoneTop : linkingScenarioProps.zoneTop;
            topAboveCurrentZone = currentAcetateData.imageLinkingData ?
                currentAcetateData.imageLinkingData.topAboveZone : linkingScenarioProps.topAboveCurrentZone;
        }
        return [zoneLeft, zoneTop, topAboveCurrentZone];
    };
    Object.defineProperty(OverlayHolder.prototype, "doEnablePanStart", {
        /**
         * Checks whether the or not to enable pan start.
         */
        get: function () {
            return !messageStore.instance.isMessagePanelVisible &&
                !exceptionStore.instance.isExceptionPanelVisible &&
                !responseStore.instance.isPinchZooming;
        },
        enumerable: true,
        configurable: true
    });
    return OverlayHolder;
}(eventManagerBase));
module.exports = OverlayHolder;
//# sourceMappingURL=overlayholder.js.map