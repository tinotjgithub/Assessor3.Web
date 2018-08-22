import React = require('react');
import ReactDom = require('react-dom');
import Immutable = require('immutable');
import enums = require('../../utility/enums');
import pureRenderComponent = require('../../base/purerendercomponent');
import eventManagerBase = require('../../base/eventmanager/eventmanagerbase');
import deviceHelper = require('../../../utility/touch/devicehelper');
import direction = require('../../base/eventmanager/direction');
import eventTypes = require('../../base/eventmanager/eventtypes');
import constants = require('../../utility/constants');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import overlayHelper = require('../../utility/overlay/overlayhelper');
import Protractor = require('../acetates/protractor');
import responseStore = require('../../../stores/response/responsestore');
import toolbarStore = require('../../../stores/toolbar/toolbarstore');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import Multiline = require('../acetates/multiline');
import qigStore = require('../../../stores/qigselector/qigstore');
import markingStore = require('../../../stores/marking/markingstore');
import Ruler = require('../acetates/ruler');
import acetatesActionCreator = require('../../../actions/acetates/acetatesactioncreator');
import messageStore = require('../../../stores/message/messagestore');
import exceptionStore = require('../../../stores/exception/exceptionstore');
import toolbarActionCreator = require('../../../actions/toolbar/toolbaractioncreator');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import acetateContextMenuData = require('../../utility/contextmenu/acetatecontextmenudata');

/* props for overlay-holder is moved to typings OverlayHolderProps */
/* state for overlay holder */
interface State {
    zoomUpdated?: number;
    renderedOn?: number;
}

/**
 * React component class for overlay holder.
 */
class OverlayHolder extends eventManagerBase {

    private _acetatesList: Immutable.List<Acetate>;
    private acetateContextMenuData: acetateContextMenuData;
    private _overlayHolderElement: Element;
    private _acetateElement: Element;
    private _acetateHitAreaLineElements: NodeListOf<Element>;
    private _acetateHitAreaLineElementClientRectBeforePan: ClientRect;
    private _currentAcetateData: Acetate;
    private _initialAcetateData: Acetate;
    private _clientToken: string;
    private _toolType: enums.ToolType;
    private _annotationOverlay: Element;
    private _deltaXWhenMovedToNextPage: number = 0;
    private _isMousePointerInGreyArea: boolean = false;
    private _addedAcetateClientToken: string;
    private _acetateLabelElement: Element;
    private _initialStitchedImageGapIndex: number = -1;
    private _imageDimension: { imageWidth: number, imageHeight: number };
    private _overlayBoundary: Array<AnnotationBoundary>;
    private _acetatePointIndex: number;
    private _acetateMoveAction: enums.AcetateAction = enums.AcetateAction.move;
    private _doRetainInitialPosition: boolean = false;
    private _rotatedAngle = 0;
    private _index: number;
    private _containerScrollBeforePan = { left: 0, top: 0 };
    private _isInsideStitchedImage: boolean = false;
    private _acetateLineIndex: number = 0;
    private isComponentMounted: boolean = false;

    /**
     * constructor for overlay holder
     * @param props
     * @param state
     */
    constructor(props: OverlayHolderProps, state: any) {
        super(props, state);
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
    public componentDidMount() {
        this.isComponentMounted = true;
        this._overlayHolderElement = ReactDom.findDOMNode(this);
        this._imageDimension = overlayHelper.getImageDimension(this.props.imageProps);
        this.setUpHammer();
        qigStore.instance.addListener(qigStore.QigStore.ACETATES_ADDED_OR_UPDATED_EVENT, this.onAddingOrUpdatingAcetates);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.ACETATE_SELECTED_EVENT, this.onAcetateSelection);
        responseStore.instance.addListener(responseStore.ResponseStore.FRACS_DATA_SET_FOR_ACETATES_EVENT,
            this.structuredFracsDataLoadedForAcetates);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.onZoomUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onQuestionItemChanged);
        qigStore.instance.addListener(qigStore.QigStore.ACETATES_REMOVED_EVENT, this.onRemoveAcetates);
        qigStore.instance.addListener(qigStore.QigStore.ACETATES_SHARED_EVENT, this.shareAcetate);
        qigStore.instance.addListener(qigStore.QigStore.ADD_POINT_TO_MULTILINE_EVENT, this.addMultilineItems);
        qigStore.instance.addListener(qigStore.QigStore.MULTILINE_STYLE_UPDATE_EVENT, this.updateMultilineStyle);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.onZoomUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.ROTATION_COMPLETED_EVENT, this.onZoomUpdated);
    }

    /**
     * component will unmount of overlay holder
     */
    public componentWillUnmount() {
        this.isComponentMounted = false;
        this.destroyHammer();
        qigStore.instance.removeListener(qigStore.QigStore.ACETATES_ADDED_OR_UPDATED_EVENT, this.onAddingOrUpdatingAcetates);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.ACETATE_SELECTED_EVENT, this.onAcetateSelection);
        responseStore.instance.removeListener(responseStore.ResponseStore.FRACS_DATA_SET_FOR_ACETATES_EVENT,
            this.structuredFracsDataLoadedForAcetates);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.onZoomUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onQuestionItemChanged);
        qigStore.instance.removeListener(qigStore.QigStore.ACETATES_REMOVED_EVENT, this.onRemoveAcetates);
        qigStore.instance.removeListener(qigStore.QigStore.ACETATES_SHARED_EVENT, this.shareAcetate);
        qigStore.instance.removeListener(qigStore.QigStore.ADD_POINT_TO_MULTILINE_EVENT, this.addMultilineItems);
        qigStore.instance.removeListener(qigStore.QigStore.MULTILINE_STYLE_UPDATE_EVENT, this.updateMultilineStyle);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.onZoomUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.ROTATION_COMPLETED_EVENT, this.onZoomUpdated);
    }

    /**
     * add Multiline Style
     * @param clientToken
     * @param x1
     * @param y1
     * @param acetateContextMenuData
     * @param multilineItems
     */
    private addMultilineItems = (clientToken: string,
        x1: number,
        y1: number,
        acetateContextMenuDetail: acetateContextMenuData,
        multilineItems: enums.MultiLineItems): void => {
        if (this._acetatesList && acetateContextMenuDetail.multilinearguments.overlayHolderId === this.getOverlayHolderId()) {
            this.acetateContextMenuData = acetateContextMenuDetail;
            switch ((multilineItems)) {
                case enums.MultiLineItems.point:
                    this.addPoint(clientToken, x1, y1, acetateContextMenuDetail);
                    break;
                case enums.MultiLineItems.line:
                    this.addLine(clientToken, x1, y1);
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
    private updateMultilineStyle = (clientToken: string,
        x1: number,
        y1: number,
        acetateContextMenuData: acetateContextMenuData,
        multilineItems: enums.MultiLineItems): void => {
        if (this._acetatesList && acetateContextMenuData.multilinearguments.overlayHolderId === this.getOverlayHolderId()) {
            acetatesActionCreator.addOrUpdateAcetate(null,
                enums.MarkingOperation.none,
                clientToken,
                acetateContextMenuData);
        }
    };

    /**
     * add point to existing Multiline
     * @param clientToken
     * @param xPos
     * @param yPos
     * @param acetateContextMenuDetail
     */
    private addPoint = (
        clientToken: string,
        x: number,
        y: number,
        acetateContextMenuDetail: acetateContextMenuData): void => {
        let acetate: Acetate = this._acetatesList.filter(item => item.clientToken === clientToken).get(0);
        let dx = 0;
        let dy = 0;
        // find current annotation overlay
        let currentAnnotationHolderElement: Element =
            htmlUtilities.findAncestor(htmlUtilities.getElementFromPosition(x, y), 'annotation-overlay');
        let currentOverlayHolderClientRect = currentAnnotationHolderElement.getBoundingClientRect();
        // Finding the delta values w.r.t rotated angle
        let event = {
            clientX: x,
            clientY: y
        };
        [dx, dy] = this.getMultilineCoordinates(event);

        let newPointLocation = this.calculatePoint(clientToken, dx, dy, acetateContextMenuDetail);

        this.acetateContextMenuData.multilinearguments.Xcordinate = newPointLocation.x;
        this.acetateContextMenuData.multilinearguments.Ycordinate = newPointLocation.y;
        this.acetateContextMenuData.multilinearguments.MultilineItem = enums.MultiLineItems.point;
        this.acetateContextMenuData.multilinearguments.PointIndex = newPointLocation.pointIndex;

        acetatesActionCreator.addOrUpdateAcetate(null,
            enums.MarkingOperation.none,
            clientToken,
            this.acetateContextMenuData);
    }

    /**
     * add line to existing Multiline
     * @param clientToken
     * @param xPos
     * @param yPos
     */
    private addLine = (clientToken: string, x1: number, y1: number): void => {
        let overlayX = 0;
        let overlayY = 0;
        let event = {
            clientX: x1,
            clientY: y1
        };

        [overlayX, overlayY] = this.getMultilineCoordinates(event);

        // invalid zone
        if (overlayX === 0 || overlayY === 0) {
            return;
        }
        this.acetateContextMenuData.multilinearguments.Xcordinate = overlayX;
        this.acetateContextMenuData.multilinearguments.Ycordinate = overlayY;
        this.acetateContextMenuData.multilinearguments.MultilineItem = enums.MultiLineItems.line;

        let imageCentreCoordinates = {
            x: overlayX,
            y: overlayY,
        };
        let defaultAcetatePoints: Array<AcetatePoint> = Array<AcetatePoint>();
        defaultAcetatePoints =
            overlayHelper.getAcetatePoints(enums.ToolType.multiline, imageCentreCoordinates, null, null, true);
        this.acetateContextMenuData.multilinearguments.DefaultAcetatePoints = defaultAcetatePoints;
        acetatesActionCreator.addOrUpdateAcetate(null,
            enums.MarkingOperation.none,
            clientToken,
            this.acetateContextMenuData);
    }

    /**
     * Method to calculate new point
     * @param clientToken
     * @param pointX
     * @param pointY
     */
    private calculatePoint(clientToken: string, pointX: number, pointY: number, acetateContextMenuDetail: acetateContextMenuData): any {
        let acetate: Acetate = this._acetatesList.filter(item => item.clientToken === clientToken).get(0);
        let distanceP1AnP2 = undefined;
        let index = 0;
        let lineIndex: number = acetateContextMenuDetail.multilinearguments.LineIndex;
        for (let i = 0; i < acetate.acetateData.acetateLines[lineIndex].points.length - 1; i++) {
            let p1 = acetate.acetateData.acetateLines[lineIndex].points[i];
            let p2 = acetate.acetateData.acetateLines[lineIndex].points[i + 1];

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
            let diffX = p2.x - p1.x;
            let diffY = p2.y - p1.y;
            if ((diffX === 0) && (diffY === 0)) {
                diffX = pointX - p1.x;
                diffY = pointY - p1.y;
                distanceP1AnP2 = Math.sqrt(diffX * diffX + diffY * diffY);
            }

            let t = ((pointX - p1.x) * diffX + (pointY - p1.y) * diffY) / (diffX * diffX + diffY * diffY);

            if (t < 0) {
                //point is nearest to the first point i.e x1 and y1
                diffX = pointX - p1.x;
                diffY = pointY - p1.y;
            } else if (t > 1) {
                //point is nearest to the end point i.e x2 and y2
                diffX = pointX - p2.x;
                diffY = pointY - p2.y;
            } else {
                //if perpendicular line intersect the line segment.
                diffX = pointX - (p1.x + t * diffX);
                diffY = pointY - (p1.y + t * diffY);
            }

            //returning shortest distance
            let _dist = Math.sqrt(diffX * diffX + diffY * diffY);
            if (!distanceP1AnP2 || distanceP1AnP2 >= _dist) {
                distanceP1AnP2 = _dist;
                index = i;
            }
        }

        //distance between new point on line and new point
        let a = acetate.acetateData.acetateLines[lineIndex].points[index].x - pointX;
        let b = acetate.acetateData.acetateLines[lineIndex].points[index].y - pointY;
        let distance = Math.sqrt(a * a + b * b);

        let newDist = Math.sqrt(distance * distance - distanceP1AnP2 * distanceP1AnP2);

        // a. calculate the vector
        let vectorX = acetate.acetateData.acetateLines[lineIndex].points[index + 1].x -
            acetate.acetateData.acetateLines[lineIndex].points[index].x;
        let vectorY = acetate.acetateData.acetateLines[lineIndex].points[index + 1].y -
            acetate.acetateData.acetateLines[lineIndex].points[index].y;

        let factor = newDist / Math.sqrt(vectorX * vectorX + vectorY * vectorY);

        // c. factor the lengths
        vectorX *= factor;
        vectorY *= factor;
        // d. calculate new vector,
        let newX = acetate.acetateData.acetateLines[lineIndex].points[index].x + vectorX;
        let newY = acetate.acetateData.acetateLines[lineIndex].points[index].y + vectorY;

        /* Check whether the point already exist on line*/
        if ((this.isPointExistOnMultiline(newX, newY, acetate, lineIndex)) ||
            ((newX > acetate.acetateData.acetateLines[lineIndex].points[index + 1].x) ||
                (newY > acetate.acetateData.acetateLines[lineIndex].points[index + 1].y))) {
            /*Find another point on line*/
            let newPointWithIndex = this.findNextPoint(newX, newY, acetate, index, lineIndex);
            newX = newPointWithIndex.x;
            newY = newPointWithIndex.y;
            index = newPointWithIndex.index;
        }

        return {
            pointIndex: index + 1,
            x: newX,
            y: newY
        };
    }

    /**
     * Method to find the another point on the line.
     * @param pX
     * @param pY
     * @param acetate
     * @param index
     */
    private findNextPoint(pX: number, pY: number, acetate: Acetate, index: number, lineIndex: number): any {
        for (let i = index; i < acetate.acetateData.acetateLines[lineIndex].points.length - 1; i++) {
            let p1 = acetate.acetateData.acetateLines[lineIndex].points[i];
            let p2 = acetate.acetateData.acetateLines[lineIndex].points[i + 1];

            let newX = (p1.x + p2.x) / 2;
            let newY = (p1.y + p2.y) / 2;
            if (!this.isPointExistOnMultiline(newX, newY, acetate, lineIndex)) {
                return {
                    x: newX,
                    y: newY,
                    index: i
                };
            }
        }

        for (let i = index; i >= 0; i--) {
            let p1 = acetate.acetateData.acetateLines[lineIndex].points[i];
            let p2 = acetate.acetateData.acetateLines[lineIndex].points[i - 1];

            let newX = (p1.x + p2.x) / 2;
            let newY = (p1.y + p2.y) / 2;
            if (!this.isPointExistOnMultiline(newX, newY, acetate, lineIndex)) {
                return {
                    x: newX,
                    y: newY,
                    index: i - 1
                };
            }
        }
    }

    /**
     * Method to check the new point exist in the line
     * @param x
     * @param y
     * @param acetate
     */
    private isPointExistOnMultiline(x: number, y: number, acetate: Acetate, lineIndex: number): boolean {
        for (let i = 0; i < acetate.acetateData.acetateLines[lineIndex].points.length; i++) {
            let point = acetate.acetateData.acetateLines[lineIndex].points[i];
            if ((x > (point.x - constants.MULTI_LINE_ADD_OFFSET_X)) &&
                (x < (point.x + constants.MULTI_LINE_ADD_OFFSET_X)) &&
                (y > (point.y - constants.MULTI_LINE_ADD_OFFSET_X)) &&
                (y < (point.y + constants.MULTI_LINE_ADD_OFFSET_X))) {
                return true;
            }
        }
        return false;
    }

    /**
     * hammer event setup
     */
    private setUpHammer() {
        if (!this.eventHandler.isInitialized) {
            let touchActionValue: string = deviceHelper.isTouchDevice() ? 'auto' : 'none';
            this.eventHandler.initEvents(this._overlayHolderElement, touchActionValue, true);
            // setting threshold as 0 because if threshold value is greater than 0 pan start will only get fired 
            // after moving that constant value. so this is causing issues while finding correct element in x, y position

            // in touch device (samsung) pan start will trigger on touchhold,so context menu won't get visible
            // adding threshold value only for touchdevices
            let threshold = deviceHelper.isTouchDevice() ? constants.PAN_THRESHOLD : 0;
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
    }

    /* pressup event for overlay holder */
    private onPressUp = (event: EventCustom) => {
        this.enableImageContainerScroll(true);
    };

    /**
     * on touch and hold handler
     * @param event
     */
    private onTouchHold = (event: any) => {
        event.srcEvent.stopPropagation();
        event.srcEvent.preventDefault();
        if (event.changedPointers && event.changedPointers.length > 0) {
            let actualX = event.changedPointers[event.changedPointers.length - 1].clientX;
            let actualY = event.changedPointers[event.changedPointers.length - 1].clientY;
            let overlayX = 0;
            let overlayY = 0;

            // find element in mouse point
            let element = htmlUtilities.getElementFromPosition(actualX, actualY);
            // find acetate from element in x, y
            this._acetateElement = htmlUtilities.findAncestor(element, 'overlay-wrap');
            this.enableImageContainerScroll(false);
            // find client token
            this._clientToken = this._acetateElement.getAttribute('data-client-token');
            this._toolType = this.getToolType(this._acetateElement.getAttribute('data-tool-type'));
            let acetateContextMenuData = overlayHelper.getAcetateContextMenuData(this._clientToken, this._toolType);
            switch (this._toolType) {
                case enums.ToolType.multiline:
                    let evt = event.changedPointers[event.changedPointers.length - 1];
                    let _index = this.getLineIndex(evt);
                    if (!_index) {
                        return;
                    }
                    acetateContextMenuData.multilinearguments.LineIndex = _index;
                    break;
            }

            // Pass the currently clicked annotation along with the X and Y because Remove Context menu
            // is under marksheet div and we need to show the context menu at this position
            this.showOrHideRemoveContextMenu(true, actualX, actualY, acetateContextMenuData);
        }
    };
    /**
     * Show or hide remove context menu for acetate 
     * @param isVisible
     * @param clientX
     * @param clientY
     * @param acetateContextMenuData
     */
    private showOrHideRemoveContextMenu(isVisible: boolean, clientX: number, clientY: number,
        acetateContextMenuData: acetateContextMenuData) {
        //check if exception/Meassge panel is opened/ maximized
        if (this.isMessageOrExceptionPanelVisible) {
            return;
        }
        let overlayX = 0;
        let overlayY = 0;
        let coordinates = {
            clientX: clientX,
            clientY: clientY
        };
        acetateContextMenuData.multilinearguments.overlayHolderId = this.getOverlayHolderId();

        let acetate: Acetate = this._acetatesList.filter(item => item.clientToken ===
            acetateContextMenuData.clientToken).get(0);
        if (acetate) {
            acetateContextMenuData.multilinearguments.isShared = acetate.shared;
            acetateContextMenuData.multilinearguments.noOfPoints = acetate.acetateData.acetateLines[
                acetateContextMenuData.multilinearguments.LineIndex].points.length;
            acetateContextMenuData.multilinearguments.noOfLines = acetate.acetateData.acetateLines.length;
            acetateContextMenuData.multilinearguments.LineColor =
                acetate.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].colour;
            acetateContextMenuData.multilinearguments.LineType =
                acetate.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].lineType;

            let pointCollection = acetate.acetateData.acetateLines[
                acetateContextMenuData.multilinearguments.LineIndex].points;
            [overlayX, overlayY] = this.getMultilineCoordinates(coordinates);

            acetateContextMenuData.multilinearguments.PointIndex = this.getIndexOfClosestPoint(overlayX, overlayY, pointCollection);

            markingActionCreator.showOrHideRemoveContextMenu(isVisible, clientX, clientY, acetateContextMenuData);
        }

    }

    private getIndexOfClosestPoint = (xCoordinate: number,
        yCoordinate: number,
        pointCollection: any): number => {
        let differenceinDistance = 0;
        let mindistance = 0;
        let pointIndex = 0;
        let xdistance = 0;
        let ydistance = 0;
        for (let i = 0; i < pointCollection.length; i++) {
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
    }

    /**
     * destroy hammer events
     */
    private destroyHammer() {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    }

    /**
     * Render method
     */
    public render() {
        return <div onContextMenu={this.onContextMenu} onClick={this.onClickHandler} className='overlay-holder'
            id={this.getOverlayHolderId()} >
            {this.strokeWidthStyle}
            {this.renderAcetates()}
        </div>;
    }

    /**
     * trigger while clicking on overlay holder
     */
    private onClickHandler(event: any) {
        // this event will trigger in Ipad touchHold, hiding the contextmenu
        // logic which is written in responsecontainer ll get executed, so to avoid this issue we are
        // preventing its propagation
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * render acetates
     */
    private renderAcetates() {

        // defensive fix for defect : 65503 - unexpected error
        let itemId = markingStore.instance.currentQuestionItemInfo ?
            markingStore.instance.currentQuestionItemInfo.answerItemId : 0;
        let acetatesAgainstCurrentQuestion = overlayHelper.getAcetesForCurrentPageOrZone(this._acetatesList, itemId,
            this.props.doApplyLinkingScenarios, this.props.imageProps, this.props.linkingScenarioProps);
        let acetatesAgainstSkippedZones = overlayHelper.getAcetatesForSkippedZones(this._acetatesList, itemId,
            this.props.imageProps, this.props.linkingScenarioProps);
        if (acetatesAgainstCurrentQuestion) {
            acetatesAgainstCurrentQuestion = acetatesAgainstCurrentQuestion.concat(acetatesAgainstSkippedZones);
        } else {
            acetatesAgainstCurrentQuestion = acetatesAgainstSkippedZones;
        }
        if (acetatesAgainstCurrentQuestion) {
            let annotationOverlayParentElement = this.props.getAnnotationOverlayElement ?
                this.props.getAnnotationOverlayElement : undefined;
            this._overlayBoundary =
                overlayHelper.getStitchedImageBoundary(annotationOverlayParentElement, this._rotatedAngle);
            let acetatesToRender = acetatesAgainstCurrentQuestion.map((acetate: Acetate, index: number) => {
                switch (acetate.acetateData.toolType) {
                    case enums.ToolType.ruler:
                        return (<Ruler key={'ruler_' + index} id={'ruler_' + index}
                            acetateDetails={acetate}
                            imageProps={this.props.imageProps}
                            getAnnotationOverlayElement={this.props.getAnnotationOverlayElement}
                            linkingScenarioProps={this.props.linkingScenarioProps}
                            doApplyLinkingScenarios={this.props.doApplyLinkingScenarios}
                            doUpdate={this._addedAcetateClientToken === acetate.clientToken}
                            zoomUpdated={this.state.zoomUpdated}
                            isStitchedImage={this.isStitchedImage} />);
                    case enums.ToolType.multiline:
                        return (<Multiline key={'multiline_' + index} id={'multiline_' + index}
                            acetateDetails={acetate}
                            imageProps={this.props.imageProps}
                            getAnnotationOverlayElement={this.props.getAnnotationOverlayElement}
                            linkingScenarioProps={this.props.linkingScenarioProps}
                            doApplyLinkingScenarios={this.props.doApplyLinkingScenarios} />);
                    case enums.ToolType.protractor:
                        return <Protractor key={'protractor' + index} id={'protractor' + index}
                            acetateDetails={acetate}
                            imageProps={this.props.imageProps}
                            getAnnotationOverlayElement={this.props.getAnnotationOverlayElement}
                            linkingScenarioProps={this.props.linkingScenarioProps}
                            doApplyLinkingScenarios={this.props.doApplyLinkingScenarios}
                            zoomUpdated={this.state.zoomUpdated}
                            getoverlayHolderElement={this.getOverlayHolderElement} />;
                }
            });
            return acetatesToRender;
        }

        return null;
    }

    /**
     * return overlay holder element
     */
    private getOverlayHolderElement = () => {
        return ReactDom.findDOMNode(this);
    }

    /**
     * return overlay holder element id
     */
    private getOverlayHolderId(): string {
        let pageNo = this.props.imageProps.pageNo ? this.props.imageProps.pageNo : 0;
        let outputPageNo = this.props.imageProps.outputPageNo ? this.props.imageProps.outputPageNo : 0;
        return 'overlayholder_' + pageNo.toString() + '_' + outputPageNo.toString();
    }

    /**
     * This will call on panstart event overlay holder
     * @param event: Custom event type
     */
    private onPanStart = (event: EventCustom) => {
        event.preventDefault();

        if (this.doEnablePanStart) {
            let actualX = event.changedPointers[0].clientX;
            let actualY = event.changedPointers[0].clientY;
            this._rotatedAngle = overlayHelper.getRotatedAngle(this.props.imageProps.pageNo, this.props.imageProps.linkedOutputPageNo);
            // find element in mouse point
            let element = htmlUtilities.getElementFromPosition(actualX, actualY);
            let imageContainerElement = this.props.getMarkSheetContainerProperties().element;

            this._containerScrollBeforePan.left = imageContainerElement.scrollLeft;
            this._containerScrollBeforePan.top = imageContainerElement.scrollTop;
            // find acetate from element in x, y
            this._acetateElement = htmlUtilities.findAncestor(element, 'overlay-wrap');

            // if any one of the below condition is true, it means that the element is not an acetate.
            let inValidElement = ((!this._acetateElement) || (!this._acetateElement.classList) ||
                !(this._acetateElement.classList.contains('overlay-wrap')));
            if (inValidElement) {
                return;
            }

            this._toolType = this.getToolType(this._acetateElement.getAttribute('data-tool-type'));
            this._acetateHitAreaLineElements = this.getAcetateHitAreaLineElements(this._toolType);

            this.enableImageContainerScroll(false);
            this._clientToken = this._acetateElement.getAttribute('data-client-token');
            // get current acetate data using client token from acetate element
            this._initialAcetateData = this._acetatesList.filter(item => item.clientToken === this._clientToken).get(0);
            this._acetateLabelElement = this._acetateElement.getElementsByClassName('overlay-text')[0];
            // Hide context menu while dragging
            markingActionCreator.showOrHideRemoveContextMenu(false);

            // JSON.stringify() added to remove reference for items in the store.
            if (this._initialAcetateData) {
                this._currentAcetateData = JSON.parse(JSON.stringify(this._initialAcetateData));
            }

            /* Disable the single point movement on shared multi-line overlay,
               but we can able to move other overlays such ruler, protractor and multi line */
            this._acetatePointIndex = this._acetateElement.classList.contains('shared-overlay') ? -1 :
                this.getAcetatePointIndex(actualX, actualY);
            if (this._acetatePointIndex > -1) {
                this._acetateMoveAction = enums.AcetateAction.resize;
            } else {
                this._acetateMoveAction = enums.AcetateAction.move;
            }

            if (this.isStitchedImage) {
                let annotationOverlayParentElement = this.props.getAnnotationOverlayElement ?
                    this.props.getAnnotationOverlayElement : undefined;
                this._overlayBoundary =
                    overlayHelper.getStitchedImageBoundary(annotationOverlayParentElement, this._rotatedAngle);
                let mousePointerCoordinate = (this._rotatedAngle / 90) % 2 === 1 ? actualX : actualY;
                this._initialStitchedImageGapIndex = overlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate(
                    mousePointerCoordinate,
                    this._overlayBoundary);
            }

            // find annotation overlay for the current acetate
            this._annotationOverlay = htmlUtilities.findAncestor(this._acetateElement, 'annotation-overlay');
            // get client rect of acetate before pan move action
            this._acetateHitAreaLineElementClientRectBeforePan = this._acetateHitAreaLineElements.length > 0 ?
                this._acetateHitAreaLineElements[0].getBoundingClientRect() : null;

            acetatesActionCreator.acetateMoving(this._clientToken, true);
        }
    }

    /**
     * This will call on panmove event overlay holder
     * @param event: Custom event type
     */
    private onPanMove = (event: EventCustom) => {
        event.preventDefault();
        let actualX = event.changedPointers[0].clientX;
        let actualY = event.changedPointers[0].clientY;

        if (!this.doEnablePan) {
            return;
        }

        let currentAnnotationHolderElement = this.getAnnotationOverlayInCurrentPoint(event);
        let annotationOverlayElement = this.props.getAnnotationOverlayElement ?
            this.props.getAnnotationOverlayElement : undefined;
        // check stitched image gap for structured responses
        let isMouseInStitchedGap = this.isStitchedImage ?
            overlayHelper.isInStitchedGap(actualX, actualY, this._rotatedAngle,
                annotationOverlayElement, this._overlayBoundary) : false;
        if (this.isValidMove(event) && this._annotationOverlay.id === currentAnnotationHolderElement.id && !isMouseInStitchedGap) {
            if (this._isMousePointerInGreyArea && this._isInsideStitchedImage) {
                // if moving from deleted area, then reset the mouse pointer
                toolbarActionCreator.PanStampToDeleteArea(false, actualX, actualY);
                // show the hidden acetate
                this._isMousePointerInGreyArea = false;
            }

            let currentOverlayHolderClientRect = currentAnnotationHolderElement.getBoundingClientRect();
            let dx = 0;
            let dy = 0;
            // Finding the delta values w.r.t rotated angle
            [dx, dy] = overlayHelper.getMousePointerClientXY(actualX, actualY, this._rotatedAngle, currentOverlayHolderClientRect,
                currentAnnotationHolderElement, this._imageDimension);
            if (this._acetateMoveAction === enums.AcetateAction.move) {
                let deltaX = 0;
                let deltaY = 0;
                // Finding the delta values w.r.t rotated angle
                [deltaX, deltaY] = this.getDeltaXY(event.deltaX, event.deltaY, this._rotatedAngle);

                // for stitched image adjust the stitched gap from dy
                if (this.isStitchedImage) {
                    // adjust the stitchedImageGapOffset from current mouse point coordinates
                    let mousePointerCoordinate = (this._rotatedAngle / 90) % 2 === 1 ? actualX : actualY;
                    let currentStitchedGapIndex = overlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate(
                        mousePointerCoordinate,
                        this._overlayBoundary);
                    dy = this.yCoordinateAfterStitchedGapAdjustment(dy, dy, currentStitchedGapIndex, this._rotatedAngle);
                }

                // check if dx and dy are with in stitched image
                this._isInsideStitchedImage = this.isStitchedImage ? overlayHelper.isOutsideStitchedImage(
                    overlayHelper.findPercentage(dy, this._imageDimension.imageHeight),
                    actualX, actualY, this._rotatedAngle, annotationOverlayElement) : true;
                if (!this._isInsideStitchedImage && this.doDeleteAcetate) {
                    this._isMousePointerInGreyArea = true;
                    // show the bin icon when move out of the script or ut of stitche image
                    // and hide the moving acetate
                    toolbarActionCreator.PanStampToDeleteArea(true, actualX, actualY);
                    this.setAcetateTransform(this._toolType, this._clientToken, deltaX, deltaY, false);
                } else {
                    this.setAcetateTransform(this._toolType, this._clientToken, deltaX, deltaY);
                }
            } else if (this._acetateMoveAction === enums.AcetateAction.resize) {
                // find updated x,y position for the point and send action to rerender the acetate
                let points = this._currentAcetateData.acetateData.acetateLines[this._acetateLineIndex].points;
                let pointToChange = points[this._acetatePointIndex];
                if (pointToChange) {

                    // for stitched image adjust the stitched gap from dy to avoid the gap value in db,
                    // this will adjust on render
                    if (this.isStitchedImage) {
                        // adjust the stitchedImageGapOffset from y coordinates
                        dy = this.yCoordinateAfterStitchedGapAdjustment(dy, dy, this._initialStitchedImageGapIndex, this._rotatedAngle);
                    }

                    // check if dx and dy are with in stitched image
                    this._isInsideStitchedImage = this.isStitchedImage ? overlayHelper.isOutsideStitchedImage(
                        overlayHelper.findPercentage(dy, this._imageDimension.imageHeight),
                        actualX, actualY, this._rotatedAngle, annotationOverlayElement) : true;
                    let currentStitchedImageGapIndex = this.isStitchedImage ? overlayHelper.getStitchedImageGapIndex(
                        overlayHelper.findPercentage(dy, this._imageDimension.imageHeight),
                        this._rotatedAngle, annotationOverlayElement,
                        this._overlayBoundary) : -1;
                    if (currentStitchedImageGapIndex !== this._initialStitchedImageGapIndex || !this._isInsideStitchedImage) {
                        acetatesActionCreator.acetateInGreyArea(true, this._clientToken);
                        this._doRetainInitialPosition = true;
                    } else {
                        // we dont update the store values while resize in panmove, so we currently have the values w.r.t 
                        // output page before linking. so if zone is linked, then we need to calculate the x,y values w.r.t output
                        // page which is not linked. these values updated to the store once a sucessfull move or resize is done.
                        let [zoneLeft, zoneTop, topAboveCurrentZone] = this.getZoneDimensionsBasedOnLinkingScenario(
                            this.props.linkingScenarioProps, this._currentAcetateData);
                        // If the current page is not a linked page then, while resizing no further adjustment is needed.
                        // So inorder to negate the adjustment made in y coordinate while rendering, topAboveCurrentZone is subtracted.
                        if (this.props.doApplyLinkingScenarios && !this.props.imageProps.isALinkedPage) {
                            pointToChange.x = dx;
                            pointToChange.y = dy + this.props.linkingScenarioProps.topAboveCurrentZone;
                        } else {
                            pointToChange.x = dx - zoneLeft;
                            pointToChange.y = (dy + topAboveCurrentZone) - zoneTop;
                        }
                        this._doRetainInitialPosition = false;
                        this._isMousePointerInGreyArea = false;
                        acetatesActionCreator.acetateInGreyArea(false, this._clientToken);
                        acetatesActionCreator.acetatePositionUpdateAction(this._currentAcetateData, enums.AcetateAction.resize);
                    }
                }
            }
        } else {
            this._isMousePointerInGreyArea = true;
            if (this._acetateMoveAction === enums.AcetateAction.move) {
                if (this._currentAcetateData.shared && this.isPE) {
                    let deltaX = 0;
                    let deltaY = 0;
                    // Finding the delta values w.r.t rotated angle
                    [deltaX, deltaY] = this.getDeltaXY(event.deltaX, event.deltaY, this._rotatedAngle);
                    this.setAcetateTransform(this._toolType, this._clientToken, deltaX, deltaY);
                } else {
                    // show the bin icon when move out of the script
                    toolbarActionCreator.PanStampToDeleteArea(true, actualX, actualY);
                    // hide acetate only when moving and mouse moved to grey area
                    this.setAcetateTransform(this._toolType, this._clientToken, event.deltaX, event.deltaY, false);
                }
            } else if (this._acetateMoveAction === enums.AcetateAction.resize) {
                acetatesActionCreator.acetateInGreyArea(true, this._clientToken);
            }
        }
    }

    /**
     * This will call on panend event overlay holder
     * @param event: Custom event type
     */
    private onPanEnd = (event: EventCustom) => {
        let actualX = event.changedPointers[0].clientX;
        let actualY = event.changedPointers[0].clientY;
        let dx = 0;
        let dy = 0;
        acetatesActionCreator.acetateMoving(this._clientToken, false);
        if (this._isMousePointerInGreyArea || this._doRetainInitialPosition) {
            if (this._acetateMoveAction === enums.AcetateAction.move && this.doDeleteAcetate) {
                // if the acetate is ouside the response screen then remove
                acetatesActionCreator.removeAcetate(this._clientToken, this._toolType);
            } else if (this._acetateMoveAction === enums.AcetateAction.resize) {
                // if the acetate is ouside the response screen then update the position with original point
                acetatesActionCreator.acetatePositionUpdateAction(this._initialAcetateData, enums.AcetateAction.none);
            }
        } else if (this.doEnablePan) {
            // clientrect of first line after move
            let acetateHitAreaLineElementClientRectAfterPan = this._acetateHitAreaLineElements.length > 0 ?
                this._acetateHitAreaLineElements[0].getBoundingClientRect() : null;
            let currentAnnotationHolderElement = this.getAnnotationOverlayInCurrentPoint(event);
            let holderClientRect = currentAnnotationHolderElement.getBoundingClientRect();
            if (this.validateAcetatePosition(this._acetateHitAreaLineElements,
                currentAnnotationHolderElement,
                this._overlayBoundary,
                actualX, actualY)) {
                for (let lineIndex = 0; lineIndex < this._currentAcetateData.acetateData.acetateLines.length; lineIndex++) {
                    let acetateLine: AcetateLine = this._currentAcetateData.acetateData.acetateLines[lineIndex];
                    let containerScroll = this.getMarkSheetContainerScrollDelta();
                    // Update the mouse pointer with the scroll offset as well.
                    actualX += containerScroll.deltaX;
                    actualY += containerScroll.deltaY;
                    if (this._acetateMoveAction === enums.AcetateAction.move) {
                        for (let pointIndex = 1; pointIndex <= acetateLine.points.length; pointIndex++) {
                            let point = acetateLine.points[pointIndex - 1];
                            // Calculating the x,y w.r.t the current annotation holder,
                            // based on the before and after client rect values of first line element
                            // and find the actual delta to be applied to find the new points
                            let lineRectLeftAfterPan = acetateHitAreaLineElementClientRectAfterPan.left - holderClientRect.left;
                            let lineRectLeftBeforePan = this._acetateHitAreaLineElementClientRectBeforePan.left - holderClientRect.left;
                            let lineRectTopAfterPan = acetateHitAreaLineElementClientRectAfterPan.top - holderClientRect.top;
                            let lineRectTopBeforePan = this._acetateHitAreaLineElementClientRectBeforePan.top - holderClientRect.top;
                            let x = (((lineRectLeftAfterPan - lineRectLeftBeforePan) + containerScroll.deltaX) /
                                currentAnnotationHolderElement.clientWidth) * this._imageDimension.imageWidth;
                            let y = (((lineRectTopAfterPan - lineRectTopBeforePan) + containerScroll.deltaY) /
                                currentAnnotationHolderElement.clientHeight) * this._imageDimension.imageHeight;
                            // Finding the delta values w.r.t rotated angle
                            [dx, dy] = overlayHelper.getMousePointerDeltaXY(x, y, this._rotatedAngle);
                            let pointY = point.y + dy;
                            // if the page is linked then we need to calculate x,y values against the linked page.
                            // in store we currently have the values against the output page which is not linked. so for 
                            // calculating delta values against the linked page we need to consider the zones height above 
                            // the current zone and the current zone left.
                            let [zoneLeft, zoneTop, topAboveCurrentZone] = this.getZoneDimensionsBasedOnLinkingScenario(
                                this.props.linkingScenarioProps, this._currentAcetateData);
                            point.x = point.x + zoneLeft;
                            point.y = point.y + zoneTop - topAboveCurrentZone;
                            // for stitched image adjust the stitched gap from y coordinate to avoid the gap value in db,
                            // this will adjust on render
                            if (this.isStitchedImage) {
                                point.y = this.adjustYCoordinate(actualX, actualY, pointY, dy, this._rotatedAngle);
                            } else {
                                point.y = point.y + dy;
                            }
                            point.x = point.x + dx;
                        }
                    } else if (this._acetateMoveAction === enums.AcetateAction.resize) {
                        if (this.isStructured) {
                            // normally in resize we only need to update the point which is moved. but when a zone is linked 
                            // and an acetate is moved for the first time, all the points need to be updated as these points are
                            // calculated w.r.t to output page which is not linked.
                            for (let lineIndex = 0; lineIndex < this._currentAcetateData.acetateData.acetateLines.length; lineIndex++) {
                                let acetateLine: AcetateLine = this._currentAcetateData.acetateData.acetateLines[lineIndex];
                                for (let pointIndex = 1; pointIndex <= acetateLine.points.length; pointIndex++) {
                                    let point = acetateLine.points[pointIndex - 1];
                                    let [zoneLeft, zoneTop, topAboveCurrentZone] = this.getZoneDimensionsBasedOnLinkingScenario(
                                        this.props.linkingScenarioProps, this._currentAcetateData);
                                    point.x = point.x + zoneLeft;
                                    point.y = point.y + zoneTop - topAboveCurrentZone;
                                }
                            }
                        }
                    }
                }
                /*Updating output page number to zero and whole page number to page number 
                in case of movement in linked page */
                if (this.props.imageProps.isALinkedPage) {
                    if (this.props.doApplyLinkingScenarios) {
                        this._currentAcetateData.acetateData.outputPageNumber = 0;
                        this._currentAcetateData.acetateData.wholePageNumber = this.props.imageProps.pageNo;
                    }
                }
                // update acetate data to store
                acetatesActionCreator.addOrUpdateAcetate(this._currentAcetateData, enums.MarkingOperation.updated);
            } else {
                if (this._acetateMoveAction === enums.AcetateAction.resize) {
                    acetatesActionCreator.acetatePositionUpdateAction(this._initialAcetateData, enums.AcetateAction.none);
                }
            }

        }
        // hide bin icon
        toolbarActionCreator.PanStampToDeleteArea(false, actualX, actualY);
        acetatesActionCreator.acetateInGreyArea(false, this._clientToken);
        this.enableImageContainerScroll(true);
        this.clearPanData();
    }

    /**
     * Method to check the current login examiner is PE.
     */
    private get isPE(): boolean {
        if (qigStore.instance.getSelectedQIGForTheLoggedInUser &&
            qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer) {
            return true;
        }
        return false;
    }

    /**
     * Method to check whether the current acetate need to be removed.
     */
    private get doDeleteAcetate(): boolean {
        if (!this._currentAcetateData.shared || (!this.isPE && this._currentAcetateData.shared)) {
            return true;
        }
        return false;
    }

    /**
     * do adjustment for stitched image gap i ycoordinates
     * @param y
     * @param dy
     */
    private adjustYCoordinate(clientX: number, clientY: number, pointY: number, dy: number, rotatedAngle: number) {
        let mousePointerCoordinate = (rotatedAngle / 90) % 2 === 1 ? clientX : clientY;
        let currentStitchedGapIndex = overlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate(
            mousePointerCoordinate,
            this._overlayBoundary);
        let stitchedImageGapIndex = Math.abs(currentStitchedGapIndex - this._initialStitchedImageGapIndex);
        return this.yCoordinateAfterStitchedGapAdjustment(pointY, dy, stitchedImageGapIndex, rotatedAngle);
    }

    /**
     * clear pan data
     */
    private clearPanData() {
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
    }

    /**
     * call when toggle button to share multiline changes
     */
    private shareAcetate = (): void => {
        this._acetatesList = this.getAcetateListCollection();
        this.reRender();
    };

    /**
     * find the annottaion overlay from current mouse point
     * @param event
     */
    private getAnnotationOverlayInCurrentPoint(event: EventCustom): Element {
        let actualX = event.changedPointers[0].clientX;
        let actualY = event.changedPointers[0].clientY;
        // find element in mouse point
        let element = htmlUtilities.getElementFromPosition(actualX, actualY);
        // find current annotation overlay
        let currentAnnotationOverlay: Element = htmlUtilities.findAncestor(element, 'annotation-overlay');
        return currentAnnotationOverlay;
    }

    /**
     * find tool type
     * @param dataToolType
     */
    private getToolType(dataToolType: string): enums.ToolType {
        let toolType: enums.ToolType;
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
    }

    /**
     * Find page number from holder element
     * @param holderElement
     */
    private pageNoFromElement(holderElement: Element): number {
        if (!holderElement) {
            return 0;
        }
        let arrayOfAnnotationHolderProperties: string[] = holderElement.id.split('_');
        let pageNo = Number(arrayOfAnnotationHolderProperties[2]);
        return pageNo;
    }

    /**
     * set transform style for acetate
     * @param toolType
     * @param clientToken
     * @param x
     * @param y
     * @param doVisible
     */
    private setAcetateTransform(toolType: enums.ToolType, clientToken: string, x: number, y: number, doVisible: boolean = true) {
        $('#' + this.getAcetateId(toolType, clientToken)).css({
            'transform': 'translate(' + x + 'px, ' + y + 'px)', 'visibility': (doVisible ? 'visible' : 'hidden')
        });
    }

    /**
     * return client rect for acetate point
     * @param acetateElement
     * @param index
     */
    private getAcetatePointClientRect(acetateElement: Element, index: number): ClientRect {
        let point = acetateElement.getElementsByClassName('p' + index)[0];
        if (point) {
            return point.getBoundingClientRect();
        } else {
            return null;
        }
    }

    /**
     * gets the point elemetn from current mouse point
     */
    private getAcetatePointIndex(x: number, y: number): number {
        // find element from x, y
        let element = htmlUtilities.getElementFromPosition(x, y);
        // find current annotation overlay
        let acetatePoint: any = overlayHelper.findAncestor(element, 'overlay-plus-svg');
        let acetatePointClass = (acetatePoint && acetatePoint.className && typeof (acetatePoint.className) === 'string') ?
            acetatePoint.className : acetatePoint.className.baseVal;
        if (acetatePointClass && acetatePointClass.indexOf('overlay-plus-svg') === 0) {
            // acetate point svg class will be 'overlay-plus-svg p1'. so we split the class with space 
            // and remove p from the item in the second position of the split array
            let split = acetatePointClass.split(' ');
            if (split.length > 0) {
                if (this._toolType === enums.ToolType.multiline) {
                    /* Split line and point index for resizing single point on a multi-line overlay
                       For example acetate point shown as 'p_1_0', where 1 indicate line index and 0 indicate point index.
                       So split the acetate point string to get the line and point index.*/
                    let index = split[1].split('_');
                    this._acetateLineIndex = parseInt(index[1]);
                    return parseInt(index[2]);
                } else {
                    // substracting 1 as the point index will be one less in the object array
                    return parseInt(split[1].replace('p', '')) - 1;
                }
            }
        }
        return -1;
    }

    /**
     * check whether the mouse pointer is otside of the script image or not
     * @param event
     */
    private checkMouseDrawingOutsideResponseArea(event: EventCustom) {
        // Getting the element at the current cursor position
        let currentElement: Element = this.getAnnotationOverlayInCurrentPoint(event);
        let elementClass = (currentElement && currentElement.className && typeof (currentElement.className) === 'string') ?
            currentElement.className : null;
        if (elementClass && elementClass.indexOf('annotation-overlay') === 0) {
            return false;
        }
        return true;
    }

    /**
     * returns the acetate in valid position or not
     * @param currentOverlayElement
     * @param annotationHolderElement
     * @param overlayBoundary
     */
    private validateAcetatePosition(overlayElement: NodeListOf<Element>, annotationHolderElement: Element,
        overlayBoundary: Array<AnnotationBoundary>, actualX: number, actualY: number) {
        let annotationHolderClientRect = annotationHolderElement.getBoundingClientRect();
        let isInsideResponse = false;
        let isInsideStichedImage = false;
        for (let index = 0; index < overlayElement.length; index++) {
            let overlayElementClientRect = overlayElement[index].getBoundingClientRect();

            isInsideResponse =
                // is the svg hit area element is inside the overlay
                overlayHelper.isAcetateInsideHolder(overlayElementClientRect,
                    annotationHolderClientRect);

            // check for structured response
            isInsideStichedImage = this.isStitchedImage ?
                // is the svg hit area element is inside the zone
                overlayHelper.isInsideStichedImage(overlayElementClientRect,
                    annotationHolderClientRect, this._rotatedAngle, overlayBoundary)
                : true;
            if (!isInsideResponse || !isInsideStichedImage) {
                // any of the svg hit area element is outside, then no need to check the remaining  svg hit area elements.
                break;
            }
        }
        return isInsideResponse && isInsideStichedImage;
    }

    /**
     * Validate action for move
     * @param event: Custom event type
     */
    private isValidMove(event: EventCustom) {
        return !this.checkMouseDrawingOutsideResponseArea(event);
    }

    /**
     * gets whether the the pan is possible on current move or not
     */
    private get doEnablePan(): boolean {
        // enable move only for ruler
        return this._acetateHitAreaLineElements &&
            // For multiline there is no label, that's why check for tooltype is needed.
            (this._acetateLabelElement || this._toolType === enums.ToolType.multiline) &&
            this.doEnablePanStart;
    }

    /**
     * return id name for acetate
     * @param toolType
     * @param clientTocken
     */
    private getAcetateId(toolType: enums.ToolType, clientTocken: string): string {
        let id;
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
     * On adding or updating acetates.
     */
    private onAddingOrUpdatingAcetates = (_clientToken: any, _addedOrUpdatedAcetate: Acetate): void => {
        this._acetatesList = this.getAcetateListCollection();
        this._addedAcetateClientToken = _clientToken;
        this.reRender();
    }

    /**
     * On Removing acetates.
     * Render the overlay holder once the acetate removed action updated in the collection.
     */
    private onRemoveAcetates = (): void => {
        this._acetatesList = this.getAcetateListCollection();
        this.reRender();
    }

    /* fired on question item changed event */
    private onQuestionItemChanged = (): void => {
        if (this.isComponentMounted) {
            this.reRender();
        }
    }

    /* rerender overlay holder */
    private reRender = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * On zoom updated
     */
    private onZoomUpdated = () => {
        // avoid rerending if the image is rotating
        if (!markingStore.instance.isRotating) {
            this.setState({
                zoomUpdated: Date.now()
            });
        }
    }

    /**
     * fires on acetate selection from stamp panel
     */
    private onAcetateSelection = (): void => {
        // For structured get the output page no and for unstructured get the page no.
        let pageNo = this.isStructured ? this.props.imageProps.outputPageNo : this.props.imageProps.pageNo;
        this._rotatedAngle = overlayHelper.getRotatedAngle(this.props.imageProps.pageNo, this.props.imageProps.linkedOutputPageNo);
        if (!this.isStructured) {
            // Check if the view-mode is Booklet
            let visiblePageNo = responseStore.instance.pageNoIndicatorData.mostVisiblePageNo[0];
            if (toolbarStore.instance.selectedAcetate !== undefined && pageNo === visiblePageNo) {
                // Adding acetate.
                overlayHelper.addAcetate(toolbarStore.instance.selectedAcetate,
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId,
                    markingStore.instance.currentQuestionItemInfo.answerItemId,
                    this.props,
                    'img_' + visiblePageNo);
            }
        }
    }

    /**
     * Handle the action event after setting fracs data for structured response.
     * Adding acetates for structured response.
     */
    private structuredFracsDataLoadedForAcetates() {
        let pageNo = this.props.doApplyLinkingScenarios ? this.props.imageProps.linkedOutputPageNo :
            this.props.imageProps.outputPageNo;
        let currentlyVisibleFracsData: FracsData = responseStore.instance.getCurrentVisibleFracsData;
        let visiblePageNo = currentlyVisibleFracsData.outputPage;
        // If there is an acetate selected and the visible page is same as that of the page in which current overlayholder exists,
        // then add an acetate.
        if (toolbarStore.instance.selectedAcetate !== undefined && pageNo === visiblePageNo) {
            let overlayBoundary: Array<AnnotationBoundary>;
            let overlayBoundaryInPixel: Array<AnnotationBoundary>;
            // overlay boundary calculation is only for stitched images
            if (this.isStitchedImage) {
                let annotationOverlayHolderClientRect = this.props.getAnnotationOverlayElement.getBoundingClientRect();
                overlayBoundary =
                    overlayHelper.getZonesClientRectBasedOnRotatedAngle(this._rotatedAngle, 'outputPageNo_' + visiblePageNo,
                        annotationOverlayHolderClientRect);
                overlayBoundaryInPixel = overlayHelper.getOverlayBoundaryInPixel(overlayBoundary, this._rotatedAngle,
                    annotationOverlayHolderClientRect, this.props.getAnnotationOverlayElement, this._imageDimension);
            }

            overlayHelper.addAcetate(toolbarStore.instance.selectedAcetate,
                qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId,
                markingStore.instance.currentQuestionItemInfo.answerItemId,
                this.props,
                'outputPageNo_' + visiblePageNo,
                overlayBoundaryInPixel,
                this._imageDimension);
        }
    }

    /**
     * Showing context menu when we right click on any overlay which is selected.
     */
    private onContextMenu = (event: any) => {
        if (!htmlUtilities.isTabletOrMobileDevice) {
            let actualX = event.clientX;
            let actualY = event.clientY;
            let overlayX = 0;
            let overlayY = 0;
            event.preventDefault();
            event.stopPropagation();

            // find element in mouse point
            let element = htmlUtilities.getElementFromPosition(actualX, actualY);
            // find acetate from element in x, y
            this._acetateElement = htmlUtilities.findAncestor(element, 'overlay-wrap');
            this._clientToken = this._acetateElement.getAttribute('data-client-token');
            if (!this._clientToken) {
                return;
            }

            this._toolType = this.getToolType(this._acetateElement.getAttribute('data-tool-type'));
            this.enableImageContainerScroll(false);
            let acetateContextMenuData = overlayHelper.getAcetateContextMenuData(this._clientToken, this._toolType);
            switch (this._toolType) {
                case enums.ToolType.multiline:
                    let _index = this.getLineIndex(event);
                    if (!_index) {
                        return;
                    }
                    acetateContextMenuData.multilinearguments.LineIndex = _index;
                    break;
            }
            this.showOrHideRemoveContextMenu(true, event.clientX, event.clientY, acetateContextMenuData);
        }
    };

    /**
     * to get Multiline Coordinates
     * @param event
     */

    private getMultilineCoordinates(event: any): [number, number] {

        // to add space between existing and newly added line...adding offset
        let actualX = event.clientX + constants.MULTI_LINE_ADD_OFFSET_X;
        let actualY = event.clientY;
        let overlayX = 0;
        let overlayY = 0;
        let currentAnnotationHolderElement = this.getAnnotationOverlayFromClientXY(event.clientX, event.clientY);
        let accetateDimension = overlayHelper.getAcetateDefaultDimension(enums.ToolType.multiline, true);
        this._rotatedAngle = overlayHelper.getRotatedAngle(this.props.imageProps.pageNo, this.props.imageProps.linkedOutputPageNo);
        let overlayBoundary =
            overlayHelper.getStitchedImageBoundary(currentAnnotationHolderElement, this._rotatedAngle);

        let mousePointerCoordinate = (this._rotatedAngle / 90) % 2 === 1 ? event.clientX : event.clientY;
        let stitchedImageGapIndex = overlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate(
            mousePointerCoordinate,
            overlayBoundary);
        let doZonesCalculation: boolean = overlayBoundary && overlayBoundary.length > 0;
        if (doZonesCalculation) {

            var seperatorDistance = 0;
            for (let i = 1; i < overlayBoundary.length; i++) {

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

        let currentOverlayHolderClientRect = currentAnnotationHolderElement.getBoundingClientRect();
        [overlayX, overlayY] = overlayHelper.getMousePointerClientXY(actualX, actualY, this._rotatedAngle, currentOverlayHolderClientRect,
            currentAnnotationHolderElement, this._imageDimension);

        if (doZonesCalculation) {
            [overlayX, overlayY] = this.getMultilineCoordinatesForStructured(overlayX, overlayY, stitchedImageGapIndex, accetateDimension);
        } else {
            [overlayX, overlayY] = this.getMultilineCoordinatesForUnStructured(overlayX, overlayY, this._imageDimension, accetateDimension);
        }

        return [overlayX, overlayY];
    }

    /**
     * To get AnnotationOverlay From ClientXY
     * @param actualX
     * @param actualY
     */
    private getAnnotationOverlayFromClientXY(actualX: number, actualY: number): Element {
        // find element in mouse point
        let element = htmlUtilities.getElementFromPosition(actualX, actualY);
        // find current annotation overlay
        let currentAnnotationOverlay: Element = htmlUtilities.findAncestor(element, 'annotation-overlay');
        return currentAnnotationOverlay;
    }

    /**
     * To get Multiline Coordinates For Structured
     * @param x
     * @param y
     * @param stitchedIndex
     * @param accetateDimension
     */
    private getMultilineCoordinatesForStructured(x: number, y: number, stitchedIndex: number, accetateDimension: any): [number, number] {
        let _zoneNatural = {
            imageHeight: 0,
            imageWidth: 0
        };
        let overlayX = x;
        let overlayY = y;
        let totalZoneNaturalHeight: number = 0;

        for (let i = 0; i <= stitchedIndex; i++) {
            let zoneNatural = {
                imageHeight: overlayHelper.getStitchedImageDimension(
                    this.props.imageProps.stitchedImageZones, this.props.imageProps.getImageNaturalDimension, i).height,
                imageWidth: overlayHelper.getStitchedImageDimension(
                    this.props.imageProps.stitchedImageZones, this.props.imageProps.getImageNaturalDimension, i).width
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
            } else {
                overlayY = y - accetateDimension.height;
            }
        }
        return [overlayX, overlayY];
    }

    /**
     * To get Multiline Coordinates For UnStructured
     * @param x
     * @param y
     * @param imageDimension
     * @param accetateDimension
     */
    private getMultilineCoordinatesForUnStructured(x: number, y: number, imageDimension: any, accetateDimension: any): [number, number] {
        let overlayX = x;
        let overlayY = y;

        if ((x + accetateDimension.width) > imageDimension.imageWidth) {
            overlayX = x - accetateDimension.width;
        }

        if ((y + accetateDimension.height) > imageDimension.imageHeight) {
            overlayY = y - accetateDimension.height;
        }
        return [overlayX, overlayY];
    }

    /**
     * To get line index of multiline by spliting ID
     * @param event
     */
    private getLineIndex(event: any): number {

        let element = htmlUtilities.getElementFromPosition(event.clientX, event.clientY);
        let _index = [];
        if (element.id.indexOf('multiLinePathArea') !== -1) {
            _index = element.id.split('_');
        } else if (element.id === '') {
            let elementToFindIndex: any = element.parentElement || element.parentNode;
            _index = elementToFindIndex && elementToFindIndex.id.split('_');
        }
        return _index ? _index[1] : undefined;
    }

    /**
     * Once any acetate removed from marking screen then no need to show that overlay on marking screen.
     * Iterating the collection for excluding the deleted one.
     */
    private getAcetateListCollection(): any {
        if (qigStore.instance.acetatesList && qigStore.instance.acetatesList.size > 0) {
            let item = qigStore.instance.acetatesList.filter(item => item.markingOperation !== enums.MarkingOperation.deleted);
            return item;
        }
    }

    /**
     * Get acetate overlay width
     */
    private getAcetateOverlayWidth(): number {
        // Get parent element i.e. annotation overlay right edge boundary
        if (this.props.getAnnotationOverlayElement !== undefined) {
            return this.props.getAnnotationOverlayElement.getBoundingClientRect().right;
        }
        return 0;
    }

    /**
     * Get acetate hit area line elements.
     */
    private getAcetateHitAreaLineElements(toolType: number) {
        let _elements: NodeListOf<Element>;
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
    }

    /**
     * Checking whether the message or exception panel is opened or not.
     */
    private get isMessageOrExceptionPanelVisible(): boolean {
        return (exceptionStore.instance.isExceptionPanelVisible || messageStore.instance.isMessagePanelVisible);
    }

    /**
     * return true if the current overlay has stitched image gaps
     */
    private get isStitchedImage(): boolean {
        return this.props.imageProps.isStitchedImage;
    }

    /**
     * gets the stroke width for overlay-hit-area-line element based on zoom percentage
     */
    private get strokeWidth(): number {
        // standard stroke width for overlay-hit-area-line element is 42px for touch devices,
        // adjust that with current zoom percentage
        return 42 * 100 / responseStore.instance.currentZoomPercentage;
    }

    /**
     * gets the strokewidth style
     */
    private get strokeWidthStyle() {
        return deviceHelper.isTouchDevice() ? (<style> {'#' + this.getOverlayHolderId() +
            ' .overlay-hit-area-line{stroke-width:' + this.strokeWidth + 'px;}'}
        </style>) : null;
    }

    /**
     * return scroll delta of marksheet container
     */
    private getMarkSheetContainerScrollDelta() {
        let scroll = { deltaX: 0, deltaY: 0 };
        let markSheetContainer = overlayHelper.getMarkSheetContainer();
        scroll.deltaX = markSheetContainer.scrollLeft - this._containerScrollBeforePan.left;
        scroll.deltaY = markSheetContainer.scrollTop - this._containerScrollBeforePan.top;
        return scroll;
    }

    /**
     * return deltaX and deltaY based on rotated angle
     * @param x
     * @param y
     * @param rotatedAngle
     */
    private getDeltaXY(x: number, y: number, rotatedAngle: number) {
        let markSheetScroll = this.getMarkSheetContainerScrollDelta();
        let [deltaX, deltaY] = overlayHelper.getMousePointerDeltaXY(x, y, rotatedAngle);
        deltaX += markSheetScroll.deltaX;
        deltaY += markSheetScroll.deltaY;
        return [deltaX, deltaY];
    }

    /**
     * adjust the ycoordinate with stitche image gap
     * @param pointY
     * @param dy
     * @param stitchedImageGapIndex
     * @param rotatedAngle
     */
    private yCoordinateAfterStitchedGapAdjustment(pointY: number, dy: number, stitchedImageGapIndex: number, rotatedAngle: number) {
        // adjust the stitchedImageGapOffset from y coordinates in percent
        let pointYInPercent = overlayHelper.findPercentage(pointY, this._imageDimension.imageHeight);
        let stitchedImageGapOffset = overlayHelper.findStitchedImageGapOffset(pointYInPercent,
            rotatedAngle,
            this.props.getAnnotationOverlayElement,
            stitchedImageGapIndex);
        if (dy >= 0) {
            //if moving down then deduct the stitchedImageGapOffset, it will add on render
            pointYInPercent -= stitchedImageGapOffset;
        } else {
            //if moving up then add the stitchedImageGapOffset
            pointYInPercent += stitchedImageGapOffset;
        }
        return overlayHelper.convertPercentageToPixel(pointYInPercent, this._imageDimension.imageHeight);
    }

    /* Returns true if the response is structured.*/
    private get isStructured(): boolean {
        return this.props.imageProps.outputPageNo > 0;
    }

    /**
     * Returns the zone left, top and top above current zone.
     * @param linkingScenarioProps
     * @param currentAcetateData
     */
    private getZoneDimensionsBasedOnLinkingScenario(linkingScenarioProps: any, currentAcetateData: Acetate): any {
        let [zoneLeft, zoneTop, topAboveCurrentZone] = [0, 0, 0];
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
    }

    /**
     * Checks whether the or not to enable pan start.
     */
    private get doEnablePanStart(): boolean {
        return !messageStore.instance.isMessagePanelVisible &&
            !exceptionStore.instance.isExceptionPanelVisible &&
            !responseStore.instance.isPinchZooming;
    }
}

export = OverlayHolder;