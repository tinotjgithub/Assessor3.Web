import React = require('react');
import ReactDom = require('react-dom');
import annotation = require('../../../../stores/response/typings/annotation');
import StampBase = require('../stampbase');
import enums = require('../../../utility/enums');
import Highlighter = require('./highlighter');
import moveCoordinates = require('../typings/movecoordinates');
import mousedownCoordinates = require('../typings/mousedowncoordinates');
import initCoordinates = require('../typings/initcoordinates');
import resizer = require('../typings/resizer');
import deviceHelper = require('../../../../utility/touch/devicehelper');
import annotationHelper = require('../../../utility/annotation/annotationhelper');
import markingActionCreator = require('../../../../actions/marking/markingactioncreator');
import toolbarActionCreator = require('../../../../actions/toolbar/toolbaractioncreator');
import responseActionCreator = require('../../../../actions/response/responseactioncreator');
import stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
import stampStore = require('../../../../stores/stamp/stampstore');
import toolbarStore = require('../../../../stores/toolbar/toolbarstore');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import eventTypes = require('../../../base/eventmanager/eventtypes');
import directions = require('../../../base/eventmanager/direction');
import constants = require('../../../utility/constants');
import dynamicElementProperties = require('../typings/dynamicelementproperties');
import responseStore = require('../../../../stores/response/responsestore');
import markingStore = require('../../../../stores/marking/markingstore');
import colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import markingHelper = require('../../../../utility/markscheme/markinghelper');
import treeViewDataHelper = require('../../../../utility/treeviewhelpers/treeviewdatahelper');
import pageLinkHelper = require('../../responsescreen/linktopage/pagelinkhelper');
import keyDownHelper = require('../../../../utility/generic/keydownhelper');
import responseHelper = require('../../../utility/responsehelper/responsehelper');
let that: DynamicStampBase;

/**
 * React component class for Dynamic Stamp
 */
class DynamicStampBase extends StampBase {
    /** To set initial clientRect of annotation on mouse down */
    private annotationRect: ClientRectDOM = { left: 0, bottom: 0, height: 0, right: 0, top: 0, width: 0 };
    /*get cordinates on mouse down*/
    private mouseDownCoordinates: mousedownCoordinates = {
        pointerDifferenceFromAnnotationX: 0,
        pointerDifferenceFromAnnotationY: 0
    };
    private initialCoordinates: initCoordinates;
    // Resize variables
    private selectedBorder: enums.AnnotationBorderType = enums.AnnotationBorderType.Default;

    /* default size of the dynamic annotation in pixel */
    protected resizeMinVal = { width: 0, height: 0 };
    protected isTouchDevice: boolean = deviceHelper.isTouchDevice();
    protected annotationOutsideResponse: boolean = false;
    protected isDrawMode: boolean = false;
    /** To Verify whether retain is required while Move/Resize */
    private retainPosition: boolean = false;

    /* To save coordinates while drawing annotation */
    private topVals: Array<number> = [];
    private leftVals: Array<number> = [];
    private isAnnotationModified: boolean = false;

    /* To check whether pointer is in gray area */
    private pointerInGrayArea: boolean = false;

    /* To store initial marksheet scroll value */
    private markSheetScroll: number;

    /* To store Annotationoverlay and markSheetElement */
    private annotationOverlayElement: HTMLElement;
    private markSheetElement: HTMLElement;
    private annotationElement: Element;
    /* To check element is moved to another page */
    private hasMovedToNextPage: boolean = false;
    private _currentAnnotationElement: ClientRectDOM;
    private nextHolderElement: HTMLElement;
    private clientRectOnNextPage: ClientRectDOM;
    private elementHTML: string;
    private isInStampPanel: boolean = false;

    /** To load empty div element for rerendering */
    protected loadEmpty: boolean = false;

    // Indicates whether the response annotation is overlapped stitched image gap.
    protected isAnnotationOverlapsStitchedGap: boolean = false;

    private overlayBoundary: Array<AnnotationBoundary> = [];

    // Indicating whether the annotation is moving/dragging.
    private isAnnotationMoving: boolean = false;

    // Indicating whether the annotation is inside the stitched response image gap.
    // This will be set only for stitched images, structured response.
    private isAnnotationInsideStitchedImageGap: boolean = false;

    /**
     * @constructor
     */
    constructor(props: any, state: any) {
        super(props, state);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.resetOverlayStitchedBoundary();
        this.checkThicknessOnAnimationCompleted = this.checkThicknessOnAnimationCompleted.bind(this);
    }

    /**
     * This method will fire on Resize Mouse Over.
     */
    private onResizeMouseOver(borderType: enums.AnnotationBorderType, e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        // Mouse over event is firing in mobile devices
        if (!this.isTouchDevice) {
            this.switchBorder(true);
        }
    }

    /**
     * This method will fire on Resize Mouse Leave.
     */
    private onResizeMouseLeave(borderType: enums.AnnotationBorderType, e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        // Mouse leave event is firing in mobile devices
        if (!this.isTouchDevice) {
            this.switchBorder(false);
            if (this.selectedBorder !== enums.AnnotationBorderType.Default) {
                this.switchBorder(true);
            }
        }
    }

    /**
     * Validate the action for Move or Resizing.
     */
    private validateAction = (event: EventCustom) => {

        let e: any = event.changedPointers[0];
        let holderElement: HTMLElement = null;
        let currentAnnotationElement: ClientRectDOM = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
        this.loadEmpty = false;
        if (!this.hasMovedToNextPage) {
            currentAnnotationElement = this.getCurrentElementBoundRect();
            this._currentAnnotationElement = currentAnnotationElement;
        } else {
            currentAnnotationElement = this._currentAnnotationElement;
        }
        let markSheetElement = this.markSheetElement;

        if (markSheetElement) {
            let scrollTop: number = markSheetElement.scrollTop;
            let scrollLeft: number = markSheetElement.scrollLeft;
            let annotationOverlayElement = this.annotationOverlayElement;
            let holderRect = annotationOverlayElement.getBoundingClientRect();

            let annotationHolderRect: ClientRectDOM = {
                width: holderRect.width,
                height: holderRect.height,
                left: holderRect.left,
                top: holderRect.top,
                bottom: 0, right: 0
            };
            let clientRect: ClientRectDOM = {
                width: this.state.width,
                height: this.state.height,
                left: this.state.left,
                top: this.state.top,
                bottom: 0, right: 0
            };

            /** Get real angle while rotating response */
            let rotatedAngle = 0;

            /* To get current annotation holder element based on the mouse position */
            if (this.selectedBorder === enums.AnnotationBorderType.Default) {
                holderElement = htmlUtilities.findCurrentHolder(this.annotationOverlayElement, event.center.x, event.center.y);

                if (this.annotationOverlayElement.id !== holderElement.id) {
                    this.hasMovedToNextPage = true;
                    rotatedAngle = annotationHelper.getAngleforRotation(Number(holderElement.getAttribute('data-rotatedangle')));

                } else {
                    this.hasMovedToNextPage = false;
                    rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);
                }
            } else {
                rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);
            }

            let pointerOutsideAnnotationHolder = this.isPointerInsideElement(e, this.hasMovedToNextPage ?
                holderElement.getBoundingClientRect() : holderRect);
            var pointerInGrayArea = { 'inGrayArea': false, 'isInsideStitchedPage': true };
            var selectedOverlay = !this.hasMovedToNextPage ? this.annotationOverlayElement.parentElement : holderElement.parentElement;
            pointerInGrayArea = this.isPointerInGrayArea(e, selectedOverlay, rotatedAngle);

            let deltaVal = 0;
            let dX = 0;
            let dY = 0;
            let left = 0;
            let top = 0;
            let width = 0;
            let height = 0;
            let blnIsoddAngle;
            this.isAnnotationModified = true;

            if (this.selectedBorder !== enums.AnnotationBorderType.Default) {
                /** To check whether the rotatedAngle is 90 deg or 270 deg */
                blnIsoddAngle = annotationHelper.IsOddangle(rotatedAngle);
                let rotateCoords = annotationHelper.setRotationCoordinates(event, rotatedAngle, annotationHolderRect);
                deltaVal = 0; dX = rotateCoords.deltaX; dY = rotateCoords.deltaY; left = 0; top = 0;
                annotationHolderRect = rotateCoords.holderRect;
                /** Change scroll during resizing */
                this.scrollUpdate(event, clientRect, pointerOutsideAnnotationHolder);
                /** To set width/height while move/resize */
                width = this.initialCoordinates.width +
                    annotationHelper.pixelsToPercentConversion(dX, annotationHolderRect.width);
                height = this.initialCoordinates.height +
                    annotationHelper.pixelsToPercentConversion(dY, annotationHolderRect.height);

            } else {
                annotationHolderRect = holderRect;
            }

            switch (this.selectedBorder) {
                case enums.AnnotationBorderType.BottomEdge:
                    if (height > this.initialCoordinates.height) {
                        clientRect.height = this.initialCoordinates.height -
                            annotationHelper.pixelsToPercentConversion(Math.abs(dY), annotationHolderRect.height);
                    } else {
                        clientRect.height = this.initialCoordinates.height +
                            annotationHelper.pixelsToPercentConversion(Math.abs(dY), annotationHolderRect.height);
                    }
                    clientRect.height = this.setClientRectOnScroll(event, clientRect, annotationHolderRect).height;
                    break;
                case enums.AnnotationBorderType.LeftEdge:
                    if (blnIsoddAngle) {
                        width = this.initialCoordinates.width + this.setClientRectOnScroll(event, clientRect, annotationHolderRect).width +
                            annotationHelper.pixelsToPercentConversion(dX, annotationHolderRect.width);
                    }
                    if (Math.round(width) > 0) {
                        deltaVal = this.initialCoordinates.width - width;
                        clientRect.left = this.initialCoordinates.x + deltaVal;
                        clientRect.width = width;
                    }
                    break;
                case enums.AnnotationBorderType.TopEdge:
                    if (!blnIsoddAngle) {
                        height = this.initialCoordinates.height + this.setClientRectOnScroll(event, clientRect,
                            annotationHolderRect).height +
                            annotationHelper.pixelsToPercentConversion(dY, annotationHolderRect.height);
                    }
                    if (Math.round(height) > 0) {
                        deltaVal = this.initialCoordinates.height - height;
                        clientRect.top = this.initialCoordinates.y + deltaVal;
                        clientRect.height = height;
                    }
                    break;
                case enums.AnnotationBorderType.RightEdge:
                    if (width > this.initialCoordinates.width) {
                        clientRect.width = this.initialCoordinates.width -
                            annotationHelper.pixelsToPercentConversion(Math.abs(dX), annotationHolderRect.width);
                    } else {
                        clientRect.width = this.initialCoordinates.width +
                            annotationHelper.pixelsToPercentConversion(Math.abs(dX), annotationHolderRect.width);
                    }
                    clientRect.width = this.setClientRectOnScroll(event, clientRect, annotationHolderRect).width;
                    break;
                case enums.AnnotationBorderType.TopLeft:
                    if (blnIsoddAngle) {
                        width = width + this.setClientRectOnScroll(event, clientRect, annotationHolderRect).width;
                    } else {
                        height = this.initialCoordinates.height + this.setClientRectOnScroll(event, clientRect,
                            annotationHolderRect).height +
                            annotationHelper.pixelsToPercentConversion(dY, annotationHolderRect.height);
                    }

                    if (Math.round(height) > 0) {
                        deltaVal = this.initialCoordinates.height - height;
                        clientRect.top = this.initialCoordinates.y + deltaVal;
                        clientRect.height = height;
                    }
                    if (Math.round(width) > 0) {
                        deltaVal = this.initialCoordinates.width - width;
                        clientRect.left = this.initialCoordinates.x + deltaVal;
                        clientRect.width = width;
                    }
                    break;
                case enums.AnnotationBorderType.TopRight:
                    if (!blnIsoddAngle) {
                        height = this.initialCoordinates.height + this.setClientRectOnScroll(event, clientRect,
                            annotationHolderRect).height +
                            annotationHelper.pixelsToPercentConversion(dY, annotationHolderRect.height);
                    }
                    if (Math.round(height) > 0) {
                        deltaVal = this.initialCoordinates.height - height;
                        clientRect.top = this.initialCoordinates.y + deltaVal;
                        clientRect.height = height;
                    }
                    if (width > this.initialCoordinates.width) {
                        clientRect.width = this.initialCoordinates.width -
                            annotationHelper.pixelsToPercentConversion(Math.abs(dX), annotationHolderRect.width);
                    } else {
                        clientRect.width = this.initialCoordinates.width +
                            annotationHelper.pixelsToPercentConversion(Math.abs(dX), annotationHolderRect.width);
                    }
                    if (blnIsoddAngle) {
                        clientRect.width = this.setClientRectOnScroll(event, clientRect, annotationHolderRect).width;
                    }
                    break;
                case enums.AnnotationBorderType.BottomLeft:
                    if (blnIsoddAngle) {
                        width = width + this.setClientRectOnScroll(event, clientRect, annotationHolderRect).width;
                    }
                    if (height > this.initialCoordinates.height) {
                        clientRect.height = this.initialCoordinates.height -
                            annotationHelper.pixelsToPercentConversion(Math.abs(dY), annotationHolderRect.height);
                    } else {
                        clientRect.height = this.initialCoordinates.height +
                            annotationHelper.pixelsToPercentConversion(Math.abs(dY), annotationHolderRect.height);
                    }
                    deltaVal = this.initialCoordinates.width - width;
                    if (Math.round(width) > 0) {
                        clientRect.left = this.initialCoordinates.x + deltaVal;
                        clientRect.width = width;
                    }
                    if (!blnIsoddAngle) {
                        clientRect.height = this.setClientRectOnScroll(event, clientRect, annotationHolderRect).height;
                    }
                    break;
                case enums.AnnotationBorderType.BottomRight:
                    if (height > this.initialCoordinates.height) {
                        clientRect.height = this.initialCoordinates.height -
                            annotationHelper.pixelsToPercentConversion(Math.abs(dY), annotationHolderRect.height);
                    } else {
                        clientRect.height = this.initialCoordinates.height +
                            annotationHelper.pixelsToPercentConversion(Math.abs(dY), annotationHolderRect.height);
                    }
                    if (width > this.initialCoordinates.width) {
                        clientRect.width = this.initialCoordinates.width -
                            annotationHelper.pixelsToPercentConversion(Math.abs(dX), annotationHolderRect.width);
                    } else {
                        clientRect.width = this.initialCoordinates.width +
                            annotationHelper.pixelsToPercentConversion(Math.abs(dX), annotationHolderRect.width);
                    }
                    if (blnIsoddAngle) {
                        clientRect.width = this.setClientRectOnScroll(event, clientRect, annotationHolderRect).width;
                    } else {
                        clientRect.height = this.setClientRectOnScroll(event, clientRect, annotationHolderRect).height;
                    }
                    break;
                case enums.AnnotationBorderType.Default:

                    clientRect.left = (e.clientX + scrollLeft) - this.mouseDownCoordinates.pointerDifferenceFromAnnotationX;
                    clientRect.top = (e.clientY - this.mouseDownCoordinates.pointerDifferenceFromAnnotationY) + scrollTop;

                    /* If pointer is in Stamp panel*/
                    this.isInStampPanel = this.isPointerInStampPanel(e);
                    this.annotationOutsideResponse = true;
                    let isPointerInCommentHolder = this.isPointerInCommentHolder(e);
                    if (!pointerInGrayArea.isInsideStitchedPage || isPointerInCommentHolder) {
                        /** If pointer is in stitched image gap */
                        toolbarActionCreator.PanStampToDeleteArea(true, e.clientX, e.clientY);

                    } else if (pointerInGrayArea.inGrayArea && !pointerOutsideAnnotationHolder) {
                        /** If pointer is in gray area and not outside the response */
                        toolbarActionCreator.PanStampToDeleteArea(false, e.clientX, e.clientY);
                    } else if (pointerOutsideAnnotationHolder || this.isInStampPanel) {
                        /** If pointer is outside the response */
                        toolbarActionCreator.PanStampToDeleteArea(true, e.clientX, e.clientY);
                    } else {
                        /** If pointer is inside the response and not in gray area */
                        this.annotationOutsideResponse = false;
                        this.isAnnotationOverlapsStitchedGap = false;
                        this.isAnnotationInsideStitchedImageGap = false;
                        toolbarActionCreator.PanStampToDeleteArea(false, e.clientX, e.clientY);
                    }

                    // If annotation back on the same origine image after navigate to next page
                    // hide the element.
                    if (!this.hasMovedToNextPage) {
                        this.hideMovingElementOnOtherPage();
                    }

                    if (this.hasMovedToNextPage) {

                        // Get annotation properties according to the current annotation holder.
                        // Need to resize the annotation height and width based on the current holde width and stroke width.
                        // such a scenario like moved an annotation from one page to another page, and comes back to
                        // same page may show an incorrect annotation size.
                        let annotationProperties: any = this.getAnnotationProperties(holderElement,
                            this.props.annotationData.width,
                            this.props.annotationData.height);

                        //let rotatedAngleOftheNextpage = Number(holderElement.getAttribute('data-rotatedangle'));
                        let holderRectOftheNextPage = holderElement.getBoundingClientRect();
                        let top = e.clientY - holderRectOftheNextPage.top;
                        let left = e.clientX - holderRectOftheNextPage.left;

                        let clientRect: ClientRectDOM = {
                            left: 0,
                            top: 0,
                            width: annotationProperties.width,
                            height: annotationProperties.height,
                            right: 0,
                            bottom: 0
                        };
                        this.annotationOutsideResponse = true;

                        [clientRect.left, clientRect.top] = this.getClientRectOnNextPage(left, top,
                            rotatedAngle, this.props.displayAngle, currentAnnotationElement);

                        if (this.props.annotationData.stamp === enums.DynamicAnnotation.HorizontalLine) {
                            clientRect.left = Math.round(clientRect.left);
                            clientRect.top = Math.round(clientRect.top);
                        }


                        [clientRect.left, clientRect.top] = annotationHelper.retainAnnotationOnRotate(
                            rotatedAngle, clientRect,
                            holderRectOftheNextPage,
                            currentAnnotationElement);

                        /** Check if the annotation is outside the response  */
                        this.retainPosition = this.checkElementOutsideResponse(holderElement.getBoundingClientRect(),
                            clientRect, rotatedAngle);

                        if (this.isStitchedImage) {

                            // Check whether the current hovering element is stitched image or not.
                            var currentHolderElement: Element = htmlUtilities.findCurrentHolder(holderElement, e.clientX, e.clientY);
                            let currentHolderElementRect: ClientRectDOM = currentHolderElement.getBoundingClientRect();
                            let clientRectInPixels: ClientRectDOM = this.getClientRectInPixels(clientRect, holderRectOftheNextPage,
                                rotatedAngle);

                            // For adding overlayHolderRect for validateAnnotaionBoundaryOnStitchedImageGap method
                            let annotationRect: ClientRectDOM = {
                                top: (clientRectInPixels.top + currentHolderElementRect.top),
                                left: (clientRectInPixels.left + currentHolderElementRect.left),
                                width: clientRectInPixels.width,
                                height: clientRectInPixels.height,
                                right: clientRectInPixels.right,
                                bottom: clientRectInPixels.bottom
                            };
                            // As for a stitched stuctured image we need to consider that, annotation is dragged across the gap
                            // and placed. Then we need to reset the annotation to the previous position.
                            var isInsideImage = annotationHelper.validateAnnotaionBoundaryOnStitchedImageGap(
                                annotationRect,
                                currentHolderElementRect,
                                this.overlayBoundary,
                                rotatedAngle);
                            /** To check whether Annotation is inside the gray area or not */
                            let inGrayArea = annotationHelper.validateAnnotationBoundary(clientRectInPixels,
                                holderElement, markSheetElement,
                                rotatedAngle);

                            // Checks whether the annotation width/height values are positive,
                            // beacuse when its resized backwards then the annotation width/height will be negative,
                            // that will break gray area functionality
                            let clientRectIsProper = this.checkdimensionforAnnotation(clientRectInPixels);

                            // to show strike icon while mouse cursor is in gray area
                            if (inGrayArea && this.selectedBorder !== enums.AnnotationBorderType.Default) {
                                return;
                            } else if (inGrayArea && this.selectedBorder === enums.AnnotationBorderType.Default) {
                                this.retainPosition = inGrayArea && !pointerOutsideAnnotationHolder;
                                this.setClientRect(clientRect);
                            } else if (!isInsideImage) {

                                // If whole mouse icon is moved to stitched gap we dont need to reset the postion
                                // and delete the annotation.
                                this.retainPosition = pointerInGrayArea.isInsideStitchedPage;

                                // If annotation is moving set the retain position after mouse leave should
                                // retain original position.
                                if (this.selectedBorder === enums.AnnotationBorderType.Default) {

                                    // As for a stitched stuctured image we need to consider that, annotation is dragged across the gap
                                    // and placed. Then we need to reset the annotation to the previous position.
                                    this.setClientRect(clientRect);
                                    this.isAnnotationInsideStitchedImageGap = !pointerInGrayArea.isInsideStitchedPage;
                                } else {
                                    // If the marker is resizing the dynamic annotation, limit the user from resizing
                                    // at the edge of the stitched image gap.
                                    this.isAnnotationOverlapsStitchedGap = true;
                                }
                            } else {
                                if (clientRectIsProper) {
                                    this.setClientRect(clientRect);
                                }
                            }
                        }
                        let movingElementProperties: dynamicElementProperties = {
                            event: e,
                            innerHTML: this.elementHTML,
                            holderElement: holderElement,
                            stamp: this.props.annotationData.stamp,
                            clientRect: {
                                left: clientRect.left,
                                top: clientRect.top,
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
                        this.clientRectOnNextPage = movingElementProperties.clientRect;
                        this.nextHolderElement = holderElement;
                        this.annotationOutsideResponse = true;
                        // Updating the annotation position when its moved/moving to/in next page
                        markingActionCreator.dynamicAnnotationMoveAction(movingElementProperties);
                    }
                    if (this.props.annotationData.stamp === enums.DynamicAnnotation.HorizontalLine) {
                        clientRect.left = Math.round(clientRect.left);
                        clientRect.top = Math.round(clientRect.top);
                    }
                    [clientRect.left, clientRect.top] = annotationHelper.retainAnnotationOnRotate(rotatedAngle, clientRect,
                        holderRect,
                        currentAnnotationElement);
                    break;
                default:
                    break;
            }
            if (!this.hasMovedToNextPage) {
                if (this.selectedBorder === enums.AnnotationBorderType.Default) {

                    // Get annotation properties according to the current annotation holder.
                    let annotationProperties: any = this.getAnnotationProperties(this.annotationOverlayElement,
                        this.props.annotationData.width,
                        this.props.annotationData.height);

                    // Need to resize the annotation height and width based on the current holde width and stroke width.
                    // such a scenario like moved an annotation from one page to another page, and comes back to
                    // same page may show an incorrect annotation size.
                    clientRect.width = annotationProperties.width;
                    clientRect.height = annotationProperties.height;
                }

                let clientRectInPixels: ClientRectDOM = this.getClientRectInPixels(clientRect, annotationHolderRect,
                    rotatedAngle);
                let clientRectInsideAnnotationHolder = this.annotationInsideHolder(clientRectInPixels,
                    annotationHolderRect, rotatedAngle);
                /** Checks if annotation is outside response and pointer is inside the annotation holder */
                let annotationInResponseBoundary = !clientRectInsideAnnotationHolder && !pointerOutsideAnnotationHolder;
                this.retainPosition = annotationInResponseBoundary || (pointerInGrayArea.inGrayArea &&
                    !pointerOutsideAnnotationHolder);
                if (this.selectedBorder === enums.AnnotationBorderType.Default) {
                    clientRectInsideAnnotationHolder = true;
                }
                /** For stiched image response */
                if ((this.isStitchedImage || this.props.imageZones.length > 0) && clientRectInsideAnnotationHolder) {
                    /** To check whether Annotation is inside the gray area or not */
                    let inGrayArea = annotationHelper.validateAnnotationBoundary(clientRectInPixels,
                        annotationOverlayElement, markSheetElement,
                        rotatedAngle);

                    // Check whether the current hovering element is stitched image or not.
                    let currentHolderElement: Element = htmlUtilities.findCurrentHolder(this.annotationOverlayElement,
                        e.clientX, e.clientY);
                    let currentHolderElementRect: ClientRectDOM = currentHolderElement.getBoundingClientRect();

                    // For adding overlayHolderRect for validateAnnotaionBoundaryOnStitchedImageGap method
                    let annotationRect: ClientRectDOM = {
                        top: (clientRectInPixels.top + currentHolderElementRect.top),
                        left: (clientRectInPixels.left + currentHolderElementRect.left),
                        width: clientRectInPixels.width,
                        height: clientRectInPixels.height,
                        right: clientRectInPixels.right,
                        bottom: clientRectInPixels.bottom
                    };

                    // As for a stitched stuctured image we need to consider that, annotation is dragged across the gap
                    // and placed. Then we need to reset the annotation to the previous position.
                    let isInsideImage = annotationHelper.validateAnnotaionBoundaryOnStitchedImageGap(
                        annotationRect,
                        currentHolderElementRect,
                        this.overlayBoundary,
                        rotatedAngle,
                        0,
                        enums.AddAnnotationAction.Pan);
                    /** Checks whether the annotation width/height values are positive,
                     * beacuse when its resized backwards then the annotation width/height will be negative,
                     * that will break gray area functionality
                     */
                    let clientRectIsProper = this.checkdimensionforAnnotation(clientRectInPixels);

                    /** to show strike icon while mouse cursor is in gray area */
                    if (inGrayArea && this.selectedBorder !== enums.AnnotationBorderType.Default) {
                        return;
                    } else if (inGrayArea && this.selectedBorder === enums.AnnotationBorderType.Default) {
                        this.retainPosition = inGrayArea && !pointerOutsideAnnotationHolder;
                        this.setClientRect(clientRect);
                        this.scrollUpdate(event, clientRect, pointerOutsideAnnotationHolder);
                    } else if (!isInsideImage) {

                        // If whole mouse icon is moved to stitched gap we dont need to reset the postion
                        // and delete the annotation.
                        this.retainPosition = pointerInGrayArea.isInsideStitchedPage;

                        // If annotation is moving set the retain position after mouse leave should
                        // retain original position.
                        if (this.selectedBorder === enums.AnnotationBorderType.Default) {

                            // As for a stitched stuctured image we need to consider that, annotation is dragged across the gap
                            // and placed. Then we need to reset the annotation to the previous position.
                            this.setClientRect(clientRect);
                            this.scrollUpdate(event, clientRect, pointerOutsideAnnotationHolder);
                        } else {
                            // If the marker is resizing the dynamic annotation, limit the user from resizing
                            // at the edge of the stitched image gap.
                            this.isAnnotationOverlapsStitchedGap = true;
                        }
                    } else {
                        if (clientRectIsProper) {
                            this.setClientRect(clientRect);
                            this.scrollUpdate(event, clientRect, pointerOutsideAnnotationHolder);
                        }
                    }
                } else {
                    if (clientRectInsideAnnotationHolder || this.selectedBorder === enums.AnnotationBorderType.Default) {
                        this.setClientRect(clientRect);
                        if (this.selectedBorder === enums.AnnotationBorderType.Default) {
                            this.scrollUpdate(event, clientRect, pointerOutsideAnnotationHolder);
                        } else {
                            /** To show strike icon while mouse cursor is in gray area */
                            markingActionCreator.onAnnotationDraw(!pointerOutsideAnnotationHolder);
                        }
                    } else {
                        markingActionCreator.onAnnotationDraw(!pointerOutsideAnnotationHolder);
                        /** To show strike icon while mouse cursor is in gray area */
                    }
                }
            } else {
                if (!this.retainPosition && htmlUtilities.isIE) {
                    this.loadEmpty = true;
                }
                if (pointerInGrayArea.isInsideStitchedPage) {
                    this.setState({
                        renderedOn: Date.now()
                    });
                }
            }
        }
    };

    /**
     * To check whether the pointer is on stamp panel
     */
    private isPointerInStampPanel(e: any): boolean {
        let element = htmlUtilities.getElementFromPosition(e.clientX, e.clientY);
        if (element && element.id) {
            let iterationCount = 0;
            while (element && element.id !== 'stampPanel' && iterationCount < 8) {
                iterationCount++;
                element = element.parentNode as Element;
            }

            if (element && element.id === 'stampPanel') {
                return true;
            }
        }
    }

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
    private getClientRectOnNextPage = (left: number, top: number, rotatedAngleOftheNextpage: number,
        rotatedAngle: number, currentAnnotationElement: ClientRectDOM) => {
        let currentAnnotationWidth;
        let currentAnnotationHeight;
        currentAnnotationWidth = currentAnnotationElement.width;
        currentAnnotationHeight = currentAnnotationElement.height;
        let clientRect = {
            left: 0,
            top: 0
        };

        switch (rotatedAngleOftheNextpage) {
            case enums.RotateAngle.Rotate_90:
                if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
                    clientRect.left = left - (currentAnnotationWidth / 2);
                    clientRect.top = top - (currentAnnotationHeight / 2);
                } else {
                    clientRect.left = left - currentAnnotationWidth + (currentAnnotationHeight / 2);
                    clientRect.top = top - (currentAnnotationWidth / 2);
                }
                break;
            case enums.RotateAngle.Rotate_270:
                if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
                    clientRect.left = left - (currentAnnotationWidth / 2);
                    clientRect.top = top - (currentAnnotationHeight / 2);
                } else {
                    clientRect.top = top - currentAnnotationHeight + (currentAnnotationWidth / 2);
                    clientRect.left = left - (currentAnnotationHeight / 2);
                }
                break;
            case enums.RotateAngle.Rotate_180:
                if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
                    let diff = currentAnnotationWidth > currentAnnotationHeight ? (currentAnnotationWidth / 2) :
                        (currentAnnotationHeight * -1);
                    clientRect.left = left - currentAnnotationWidth + (currentAnnotationHeight / 2);
                    clientRect.top = top - (currentAnnotationWidth / 2) + (currentAnnotationHeight / 2) + diff;
                } else {
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
     * Checks if the element is outside the response
     * @param {ClientRectDOM} holderElement
     * @param {any} clientRect
     * @param {number} rotatedAngle
     * @returns
     */
    private checkElementOutsideResponse(holderElement: ClientRectDOM, clientRect: any, rotatedAngle: number): boolean {
        let top = clientRect.top;
        let left = clientRect.left;
        let holderRectWidth = holderElement.width;
        let holderRectHeight = holderElement.height;

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
            holderRectWidth
        );
    }

    /**
     * Updating Annotation position while moving
     * @param {HTMLElement} holderElement
     */
    private updateMoveAnnotation(holderElement: HTMLElement) {
        if (holderElement) {
            let annotationHolderRect = holderElement.getBoundingClientRect();
            let rotatedAngle = Number(holderElement.getAttribute('data-rotatedangle'));
            let topAboveCurrentZone = Number(holderElement.getAttribute('data-topabovecurrentzone'));
            let isALinkedPage = JSON.parse(holderElement.getAttribute('data-isalinkedpage'));
            let scriptImage = {
                imageWidth: Number(holderElement.getAttribute('data-imagewidth')),
                imageHeight: Number(holderElement.getAttribute('data-imageheight'))
            };
            let zoneTop = isALinkedPage || !this.props.isEBookMarking ? 0 : Number(holderElement.getAttribute('data-zonetop'));

            // Defect 36333 fix - no need to adjust the clientRectOnNextPage value (top-height) from getAnnotationDimensions()
            // when we move a dynamic annotation to a page in rotation angle 90/180,
            // so we are adding the value from here and negate it from getAnnotationDimensions()
            this.adjustAnnotationPositionOnRotation(rotatedAngle);

            let top = this.adjustAnnotationPoistionOnStitchedGap(this.clientRectOnNextPage.top,
                rotatedAngle, holderElement, true);

            let annotationLeftinPx = (this.clientRectOnNextPage.left / 100) * scriptImage.imageWidth;
            // for ebookmarking components, we should add zonetop along with annotation top if its a zoned page
            //Zone Top will be 0 if page is linked one
            let annotationTopinPx = (zoneTop + (top / 100) * scriptImage.imageHeight);
            let annotationWidthinPx = (this.clientRectOnNextPage.width / 100) * scriptImage.imageWidth;
            let annotationHeightinPx = (this.clientRectOnNextPage.height / 100) * scriptImage.imageHeight;

            // This is causing issue while placing annotation on different images
            // and after discussed with TA commenting this code for the time being.
            /*if (rotatedAngle === enums.RotateAngle.Rotate_90) {
                annotationTopinPx = annotationTopinPx + annotationHeightinPx;
            } else if (rotatedAngle === enums.RotateAngle.Rotate_180) {
                annotationLeftinPx = annotationLeftinPx + annotationWidthinPx;
            }*/

            let arrayOfAnnotationHolderProperties: string[] = holderElement.id.split('_');
            let outputPageNo = Number(arrayOfAnnotationHolderProperties[3]);
            let pageNo = this.props.isEBookMarking ? Number(holderElement.getAttribute('data-currentimagepageno')) :
                Number(arrayOfAnnotationHolderProperties[1]);
            let imageClusterId = Number(arrayOfAnnotationHolderProperties[2]);
            if (this.props.doApplyLinkingScenarios === true && pageNo === 0) {
                // annotation in stitched image. we need to add the height of zones above the currect zone
                // when in linking scenarios are enabled
                annotationTopinPx += topAboveCurrentZone;
            }
            if (this.props.clientToken !== undefined) {
                markingActionCreator.updateAnnotation(annotationLeftinPx,
                    annotationTopinPx,
                    imageClusterId,
                    outputPageNo,
                    pageNo,
                    this.props.clientToken,
                    annotationWidthinPx,
                    annotationHeightinPx);
                this.addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo, isALinkedPage);
            }
        }

    }

    /**
     * find adjusted clientRectOnNextPage values
     * @param rotatedAngle
     */
    private adjustAnnotationPositionOnRotation(rotatedAngle: number) {
        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_90:
                this.clientRectOnNextPage.top = this.clientRectOnNextPage.top + this.clientRectOnNextPage.height;
                break;
            case enums.RotateAngle.Rotate_180:
                this.clientRectOnNextPage.left = this.clientRectOnNextPage.left + this.clientRectOnNextPage.width;
                break;
        }
    }

    /**
     * Get the clientRect in pixels.
     * @param {ClientRectDOM} clientRect
     * @param {ClientRectDOM} annotationHolderRect
     * @param {Number} rotatedAngle
     * @returns
     */
    private getClientRectInPixels = (clientRect: ClientRectDOM, annotationHolderRect: ClientRectDOM, rotatedAngle: Number):
        ClientRectDOM => {
        let rotatedHolderRect = this.getRotatedAnnotationHolderRect(rotatedAngle, annotationHolderRect);
        let clientRectInPixels: ClientRectDOM = {
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
    private annotationInsideHolder = (clientRectInPixels: ClientRectDOM, annotationHolderRect: ClientRectDOM,
        rotatedAngle: Number): Boolean => {
        let clientRectInsideAnnotationHolder = true;
        clientRectInPixels = this.updateAttributesForAnnotation(clientRectInPixels, rotatedAngle);
        let rotatedHolderRect = this.getRotatedAnnotationHolderRect(rotatedAngle, annotationHolderRect);
        if ((clientRectInPixels.left <= 0 || clientRectInPixels.left + clientRectInPixels.width >= rotatedHolderRect.holderWidth ||
            clientRectInPixels.top <= 0 || clientRectInPixels.top + clientRectInPixels.height >=
            Math.round(rotatedHolderRect.holderHeight - 1))) {
            clientRectInsideAnnotationHolder = false;
        }
        return clientRectInsideAnnotationHolder;
    };

    /**
     * Updating height attribute for HWavyLine and HorizontalLine.
     * @param {ClientRectDOM} clientRectInPixels
     * @param {Number} rotatedAngle
     * @returns
     */
    private updateAttributesForAnnotation(clientRectInPixels: ClientRectDOM, rotatedAngle: Number): ClientRectDOM {
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
    }

    /**
     * Checks whether the clientRect values are proper
     * @param clientRect
     */
    private checkdimensionforAnnotation = (clientRect: ClientRectDOM) => {
        if ((this.props.annotationData.stamp === enums.DynamicAnnotation.HorizontalLine) ||
            (this.props.annotationData.stamp === enums.DynamicAnnotation.HWavyLine) ||
            (this.props.annotationData.stamp === enums.DynamicAnnotation.VWavyLine)) {
            return clientRect.width > 0 || clientRect.height > 0;
        } else {
            return clientRect.width > 0 && clientRect.height > 0;
        }
    };

    /**
     * Get annotation holder width/height after rotation, for 90 & 270 degree height/width get swapped
     * @param rotatedAngle
     * @param annotationHolderRect
     */
    private getRotatedAnnotationHolderRect = (rotatedAngle: Number, annotationHolderRect: ClientRectDOM) => {
        let holderWidth;
        let holderHeight;
        if (this.selectedBorder === enums.AnnotationBorderType.Default &&
            (rotatedAngle === enums.RotateAngle.Rotate_90 ||
                rotatedAngle === enums.RotateAngle.Rotate_270)) {
            holderWidth = annotationHolderRect.height;
            holderHeight = annotationHolderRect.width;
        } else {
            holderWidth = annotationHolderRect.width;
            holderHeight = annotationHolderRect.height;
        }
        return { 'holderWidth': holderWidth, 'holderHeight': holderHeight };
    };

    /**
     * Modify height/width according to the rotate angles while Scrolling
     */
    private setClientRectOnScroll = (event: EventCustom, clientRect: ClientRectDOM, annotationHolderRect: ClientRectDOM) => {
        let e = event.changedPointers[0];
        let marksheetElement: HTMLElement = this.props.getMarkSheetContainerProperties().element;
        let rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);
        /** scrollTop adjust value on moving/resizing */
        const scrollSpeed: number = 30;
        /** To store each scroll movement */
        let scroll = 0;
        /* Scroll update value on each move/resize */
        let scrollPosition: number = event.velocityY >= 0 ? scrollSpeed : -scrollSpeed;
        switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
            case enums.RotateAngle.Rotate_0:
                switch (this.selectedBorder) {
                    case enums.AnnotationBorderType.TopEdge:
                    case enums.AnnotationBorderType.TopLeft:
                    case enums.AnnotationBorderType.TopRight:
                        scroll = (this.markSheetScroll - marksheetElement.scrollTop);
                        clientRect.height = annotationHelper.pixelsToPercentConversion(scroll,
                            annotationHolderRect.height);
                        break;
                    case enums.AnnotationBorderType.BottomEdge:
                    case enums.AnnotationBorderType.BottomLeft:
                    case enums.AnnotationBorderType.BottomRight:
                        scroll = (marksheetElement.scrollTop - this.markSheetScroll);
                        clientRect.height = clientRect.height + annotationHelper.pixelsToPercentConversion(scroll,
                            annotationHolderRect.height);
                        break;
                }
                break;
            case enums.RotateAngle.Rotate_180:
                switch (this.selectedBorder) {
                    case enums.AnnotationBorderType.TopEdge:
                    case enums.AnnotationBorderType.TopLeft:
                    case enums.AnnotationBorderType.TopRight:
                        scroll = -(this.markSheetScroll - marksheetElement.scrollTop);
                        clientRect.height = annotationHelper.pixelsToPercentConversion(scroll,
                            annotationHolderRect.height);
                        break;
                    case enums.AnnotationBorderType.BottomEdge:
                    case enums.AnnotationBorderType.BottomLeft:
                    case enums.AnnotationBorderType.BottomRight:
                        scroll = -(marksheetElement.scrollTop - this.markSheetScroll);
                        clientRect.height = clientRect.height + annotationHelper.pixelsToPercentConversion(scroll,
                            annotationHolderRect.height);
                        break;
                }
                break;
            case enums.RotateAngle.Rotate_90:
                switch (this.selectedBorder) {
                    case enums.AnnotationBorderType.RightEdge:
                    case enums.AnnotationBorderType.BottomRight:
                    case enums.AnnotationBorderType.TopRight:
                        scroll = -(marksheetElement.scrollTop - this.markSheetScroll);
                        clientRect.width = (clientRect.width - annotationHelper.pixelsToPercentConversion(scroll,
                            annotationHolderRect.width));
                        break;
                    case enums.AnnotationBorderType.LeftEdge:
                    case enums.AnnotationBorderType.BottomLeft:
                    case enums.AnnotationBorderType.TopLeft:
                        scroll = (this.markSheetScroll - marksheetElement.scrollTop);
                        clientRect.width = annotationHelper.pixelsToPercentConversion(scroll,
                            annotationHolderRect.width);
                        break;
                    default:
                        break;
                }
                break;
            case enums.RotateAngle.Rotate_270:
                switch (this.selectedBorder) {
                    case enums.AnnotationBorderType.RightEdge:
                    case enums.AnnotationBorderType.BottomRight:
                    case enums.AnnotationBorderType.TopRight:
                        scroll = (marksheetElement.scrollTop - this.markSheetScroll);
                        clientRect.width = (clientRect.width - annotationHelper.pixelsToPercentConversion(scroll,
                            annotationHolderRect.width));
                        break;
                    case enums.AnnotationBorderType.LeftEdge:
                    case enums.AnnotationBorderType.BottomLeft:
                    case enums.AnnotationBorderType.TopLeft:
                        scroll = -(this.markSheetScroll - marksheetElement.scrollTop);
                        clientRect.width = annotationHelper.pixelsToPercentConversion(scroll,
                            annotationHolderRect.width);
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
    private scrollUpdate = (event: EventCustom, clientRect: ClientRectDOM, pointerOutsideAnnotationHolder: boolean) => {
        if (pointerOutsideAnnotationHolder) {
            return;
        }
        let e = event.changedPointers[0];
        let marksheetElement: HTMLElement = this.markSheetElement;
        let marksheetElementRect: ClientRectDOM = marksheetElement.getBoundingClientRect();
        let annotationHolderRect = this.getAnnotationHolderElementProperties();
        let rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);
        /** scrollTop adjust value on moving/resizing */
        const scrollSpeed: number = 30;
        /* Scroll update value on each move/resize*/
        let scrollPosition: number = event.velocityY >= 0 ? scrollSpeed : -scrollSpeed;
        switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
            case enums.RotateAngle.Rotate_0:
                switch (this.selectedBorder) {
                    case enums.AnnotationBorderType.TopEdge:
                    case enums.AnnotationBorderType.TopLeft:
                    case enums.AnnotationBorderType.TopRight:
                        if (Math.round(this.getCurrentElementBoundRect().top) <= marksheetElementRect.top && scrollPosition < 0
                            || Math.round(this.getCurrentElementBoundRect().top) >= marksheetElementRect.bottom && scrollPosition > 0
                        ) {
                            marksheetElement.scrollTop = marksheetElement.scrollTop + scrollPosition;
                        }
                        break;
                    case enums.AnnotationBorderType.BottomEdge:
                    case enums.AnnotationBorderType.BottomLeft:
                    case enums.AnnotationBorderType.BottomRight:
                        if (Math.round(this.getCurrentElementBoundRect().bottom) >= marksheetElementRect.bottom && scrollPosition > 0
                            || Math.round(this.getCurrentElementBoundRect().bottom) <= marksheetElementRect.top && scrollPosition < 0
                        ) {
                            marksheetElement.scrollTop = marksheetElement.scrollTop + scrollPosition;
                        }
                        break;
                }
                break;
            case enums.RotateAngle.Rotate_180:
                switch (this.selectedBorder) {
                    case enums.AnnotationBorderType.TopEdge:
                    case enums.AnnotationBorderType.TopLeft:
                    case enums.AnnotationBorderType.TopRight:
                        if (Math.round(this.getCurrentElementBoundRect().bottom) <= marksheetElementRect.top && scrollPosition < 0
                            || Math.round(this.getCurrentElementBoundRect().bottom) >= marksheetElementRect.bottom && scrollPosition > 0
                        ) {
                            marksheetElement.scrollTop = marksheetElement.scrollTop + scrollPosition;
                        }
                        break;
                    case enums.AnnotationBorderType.BottomEdge:
                    case enums.AnnotationBorderType.BottomLeft:
                    case enums.AnnotationBorderType.BottomRight:
                        if (Math.round(this.getCurrentElementBoundRect().top) <= marksheetElementRect.top && scrollPosition < 0
                            || Math.round(this.getCurrentElementBoundRect().top) >= marksheetElementRect.bottom && scrollPosition > 0
                        ) {
                            marksheetElement.scrollTop = marksheetElement.scrollTop + scrollPosition;
                        }
                        break;
                }
                break;
            case enums.RotateAngle.Rotate_90:
                switch (this.selectedBorder) {
                    case enums.AnnotationBorderType.LeftEdge:
                    case enums.AnnotationBorderType.TopLeft:
                    case enums.AnnotationBorderType.BottomLeft:
                        if (Math.round(this.getCurrentElementBoundRect().top) <= marksheetElementRect.top && scrollPosition < 0
                            || Math.round(this.getCurrentElementBoundRect().top) >= marksheetElementRect.bottom && scrollPosition > 0
                        ) {
                            marksheetElement.scrollTop = marksheetElement.scrollTop + scrollPosition;
                        }
                        break;
                    case enums.AnnotationBorderType.RightEdge:
                    case enums.AnnotationBorderType.TopRight:
                    case enums.AnnotationBorderType.BottomRight:
                        if (Math.round(this.getCurrentElementBoundRect().bottom) >= marksheetElementRect.bottom && scrollPosition > 0
                            || Math.round(this.getCurrentElementBoundRect().bottom) <= marksheetElementRect.top && scrollPosition < 0
                        ) {
                            marksheetElement.scrollTop = (marksheetElement.scrollTop + scrollPosition);
                        }
                        break;
                }
                break;
            case enums.RotateAngle.Rotate_270:
                switch (this.selectedBorder) {
                    case enums.AnnotationBorderType.LeftEdge:
                    case enums.AnnotationBorderType.TopLeft:
                    case enums.AnnotationBorderType.BottomLeft:
                        if (Math.round(this.getCurrentElementBoundRect().bottom) >= marksheetElementRect.bottom && scrollPosition > 0
                            || Math.round(this.getCurrentElementBoundRect().bottom) <= marksheetElementRect.top && scrollPosition < 0
                        ) {
                            marksheetElement.scrollTop = marksheetElement.scrollTop + scrollPosition;
                        }
                        break;
                    case enums.AnnotationBorderType.RightEdge:
                    case enums.AnnotationBorderType.TopRight:
                    case enums.AnnotationBorderType.BottomRight:
                        if (Math.round(this.getCurrentElementBoundRect().top) <= marksheetElementRect.top && scrollPosition < 0
                            || Math.round(this.getCurrentElementBoundRect().top) >= marksheetElementRect.bottom && scrollPosition > 0
                        ) {
                            marksheetElement.scrollTop = (marksheetElement.scrollTop + scrollPosition);
                        }
                        break;
                }
                break;
        }

        /** Scroll update while Move functionality */
        if (this.selectedBorder === enums.AnnotationBorderType.Default) {
            while ((Math.round(this.getCurrentElementBoundRect().bottom) >= marksheetElementRect.bottom &&
                scrollPosition > 0) || (Math.round(this.getCurrentElementBoundRect().top) <= marksheetElementRect.top &&
                    scrollPosition < 0)) {
                if (!this.checkScroll(marksheetElement, scrollPosition, true)) {
                    break;
                }
            }
            while ((Math.round(this.getCurrentElementBoundRect().right) >= marksheetElementRect.right &&
                scrollPosition > 0) || (Math.round(this.getCurrentElementBoundRect().left) <= marksheetElementRect.left &&
                    scrollPosition < 0)) {
                if (!this.checkScroll(marksheetElement, scrollPosition, false)) {
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
    private checkScroll = (marksheetElement: HTMLElement, scrollVal: number, isScrollTop: boolean) => {
        /** Decides whether scrollTop/scrollLeft needs to be adjusted */
        if (isScrollTop) {
            marksheetElement.scrollTop = marksheetElement.scrollTop + scrollVal;
            if (Math.round(marksheetElement.scrollTop) === (Math.round(this.props.getMarkSheetContainerProperties().
                element.scrollTop))) {
                return false;
            }
        } else {
            marksheetElement.scrollLeft = marksheetElement.scrollLeft + scrollVal;
            if (Math.round(marksheetElement.scrollLeft) === (Math.round(this.props.getMarkSheetContainerProperties().
                element.scrollLeft))) {
                return false;
            }
        }

    };


    /**
     * Validate the coordinates on move.
     * @param coordinate
     * @param annotationHolderDimension
     * @param annotationDimension
     */
    private validateCoordinatePosition(coordinate: number, annotationHolderDimension: number, annotationDimension: number): boolean {
        let updatedCoordinate: boolean;
        if (coordinate >= 0 && coordinate <= (annotationHolderDimension - annotationDimension)) {
            updatedCoordinate = false;
        } else {
            updatedCoordinate = true;
        }
        return updatedCoordinate;
    }

    /**
     * Setting the updated clientRect values to the state.
     * @param clientRect
     * @param rotatedAngle
     */
    private setClientRect(clientRect: ClientRectDOM): void {
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
    }

    /**
     * return annotation top and left values
     */
    private getAnnotationTopLeft() {
        let annotationTop = 0;
        let annotationLeft = 0;
        if (this.props.isInFullResponseView || this.props.annotationData.pageNo > 0) {
            annotationTop = this.props.annotationData.topEdge;
            annotationLeft = this.props.annotationData.leftEdge;
        } else {
            if (this.props.doApplyLinkingScenarios) {
                if (this.props.isInLinkedPage) {
                    if (this.props.annotationData.isInSkippedZone &&
                        this.props.annotationData.isInSkippedZone === true) {
                        annotationLeft = this.props.annotationData.leftEdge + this.props.annotationData.skippedZoneLeft;
                        annotationTop = this.props.annotationData.topEdge - this.props.annotationData.topAboveZone
                            + this.props.annotationData.skippedZoneTop;
                    } else {
                        annotationLeft = this.props.annotationData.leftEdge + this.props.zoneLeft;
                        annotationTop = this.props.annotationData.topEdge - this.props.topAboveCurrentZone
                            + this.props.zoneTop;
                    }
                } else {
                    annotationLeft = this.props.annotationData.leftEdge;
                    annotationTop = this.props.annotationData.topEdge - this.props.topAboveCurrentZone;
                }
            } else {
                annotationTop = this.props.annotationData.topEdge;
                annotationLeft = this.props.annotationData.leftEdge;
            }
        }

        return [annotationTop, annotationLeft];
    }

    /**
     * Set the Initial Dimenstions while drawing annotation.
     */
    public setInitialDimensions(clientToken?: string, isDrawEnd?: boolean, isStamping?: boolean, isFirstRender?: boolean) {
        /** As this function is for displaying the dynamic annotations while adding, no need to use the logic for move/ resize.
         * Since this condition have to use with all other dynamic annotations, moved as a common condition inside the function.
         */


        if (!this.isAnnotationModified) {
            let annotationHolderRect = this.getAnnotationHolderElementProperties();
            let dimensions: ClientRectDOM = { left: 0, bottom: 0, height: 0, right: 0, top: 0, width: 0 };
            let width = annotationHelper.percentToPixelConversion(this.annotationRect.width, annotationHolderRect.width);
            let height = annotationHelper.percentToPixelConversion(this.annotationRect.height, annotationHolderRect.height);

            // Calculate annotation top,left, width
            this.calculateAnnotationDimensions();

            let rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);

            this.annotationRect.top = this.adjustAnnotationPoistionOnStitchedGap(
                this.annotationRect.top, rotatedAngle,
                this.props.getAnnotationOverlayElement());

            // Get the annotation initial dimensions.
            if (isFirstRender) {
                dimensions = this.getAnnotationDimensions(isFirstRender);
            } else {
                dimensions = this.getAnnotationDimensions();
            }
            if ((this.props.annotationData.stamp === enums.DynamicAnnotation.HorizontalLine) ||
                (this.props.annotationData.stamp === enums.DynamicAnnotation.HWavyLine) ||
                (this.props.annotationData.stamp === enums.DynamicAnnotation.VWavyLine)) {
                let isHorizontal: boolean = true;
                if (this.props.annotationData.stamp === enums.DynamicAnnotation.VWavyLine) {
                    isHorizontal = !isHorizontal;
                }
                // Get the Hline dimensions.
                dimensions = annotationHelper.getLineDimensions(dimensions, clientToken, this.props.displayAngle,
                    this.leftVals[0], this.topVals[0], this.props.annotationData.width, this.props.annotationData.height, isHorizontal);
                let holderWidth = annotationHolderRect.width;
                let holderHeight = annotationHolderRect.height;
                if (rotatedAngle === enums.RotateAngle.Rotate_90 ||
                    rotatedAngle === enums.RotateAngle.Rotate_270) {
                    holderWidth = annotationHolderRect.height;
                    holderHeight = annotationHolderRect.width;
                }
                dimensions.left = annotationHelper.getRoundedValueAnnotationThickness(dimensions.left, holderWidth);
                dimensions.top = annotationHelper.getRoundedValueAnnotationThickness(dimensions.top, holderHeight);
            }

            let defaultWidth = 0;
            let defaultHeight = 0;
            if (this.props.getAnnotationOverlayElement) {
                // Get default annotation values in percentage.
                let [defaultWidth, defaultHeight] = annotationHelper.getAnnotationDefaultValue(this.props.annotationData.stamp, undefined,
                    undefined, this.props.getAnnotationOverlayElement(), rotatedAngle, isStamping);
            }

            if (this.props.isInFullResponseView || this.props.doApplyLinkingScenarios === true ||
                Math.round(dimensions.top) >= (isStamping ? 1 : 0) && Math.round(dimensions.left) >= (isStamping ? 1 : 0) &&
                Math.round(dimensions.width + dimensions.left) <= (isStamping ? 99 : 100) &&
                Math.round(dimensions.height + dimensions.top) <= (isStamping ? 99 : 100)) {
                // Update the Annotation UI.
                // for inactive or faded use its own zOrder, otherwise find new zOrder
                let zindex = !this.props.isActive || this.props.isFade ? 0 : this.getZindexValue();
                this.setState({
                    left: dimensions.left,
                    top: dimensions.top,
                    width: dimensions.width,
                    height: dimensions.height,
                    zIndex: zindex
                });
            } else {
                let annotationWidth = 0;
                if (rotatedAngle === enums.RotateAngle.Rotate_90 ||
                    rotatedAngle === enums.RotateAngle.Rotate_270) {
                    annotationWidth = defaultWidth;
                    defaultWidth = defaultHeight;
                    defaultHeight = annotationWidth;
                }
                let widthinPixels = annotationHelper.percentToPixelConversion(dimensions.width,
                    this.getAnnotationHolderElementProperties().width);
                let heightinPixels = annotationHelper.percentToPixelConversion(dimensions.height,
                    this.getAnnotationHolderElementProperties().height);
                // if a newly added annnotation (stamping / drawing) is outside the response area, then remove it from collection
                if (this.props.isStamping || isDrawEnd) {
                    let annotationClientTokenToBeDeleted: Array<string> = [];
                    if (clientToken) {
                        let isMarkByAnnotation: boolean;
                        isMarkByAnnotation = responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus);
                        annotationClientTokenToBeDeleted.push(clientToken);
                        markingActionCreator.removeAnnotation(annotationClientTokenToBeDeleted, isMarkByAnnotation);
                    }
                }
            }
        }
    }

    /**
     * Method to calculate the top, left and height calculation
     * While adding/Updating annotation
     */
    private calculateAnnotationDimensions() {
        let topAdjustment = 0;

        let [annotationTop, annotationLeft] = this.getAnnotationTopLeft();

        // top and height calculation is different for EBookMarking and other type components.
        if (this.props.isEBookMarking) {
            // Take image natural height to display stamps if full response view/Linked Page.
            if (this.props.isInFullResponseView || this.props.isInLinkedPage) {
                this.annotationRect.top = annotationHelper.calculatePercentage(annotationTop, this.props.imageHeight);
                this.annotationRect.height = annotationHelper.calculatePercentage(this.props.annotationData.height,
                    this.props.imageHeight);
            } else {
                // adjust stamp relative to zone.
                topAdjustment = annotationTop - this.props.zoneTop;
                this.annotationRect.top = annotationHelper.calculatePercentage(topAdjustment, this.props.zoneHeight);
                this.annotationRect.height = annotationHelper.calculatePercentage(this.props.annotationData.height,
                    this.props.zoneHeight);
            }

        } else {
            // For structured and other components
            this.annotationRect.top = annotationHelper.calculatePercentage(annotationTop, this.props.imageHeight);
            this.annotationRect.height = annotationHelper.calculatePercentage(this.props.annotationData.height,
                this.props.imageHeight);
        }

        this.annotationRect.left = annotationHelper.calculatePercentage(annotationLeft, this.props.imageWidth);
        this.annotationRect.width = annotationHelper.calculatePercentage(this.props.annotationData.width, this.props.imageWidth);
    }

    /**
     * Get the default values for dynamic annotation in Percentage..
     */
    private getDefaultValuesInPercentage() {
        let defaultWidth = 0;
        let defaultHeight = 0;
        let rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);
        let [width, height] = annotationHelper.getAnnotationDefaultValue(this.props.annotationData.stamp, undefined,
            undefined, null, rotatedAngle);

        defaultWidth = annotationHelper.calculatePercentage((width
            / this.getAnnotationHolderElementProperties().width) *
            this.props.imageWidth, this.props.imageWidth);
        defaultHeight = annotationHelper.calculatePercentage((height
            / this.getAnnotationHolderElementProperties().height) *
            this.props.imageHeight, this.props.imageHeight);

        return [defaultWidth, defaultHeight];
    }

    /**
     * Get the annotation dimension while displaying the dynamic annotation.
     */
    private getAnnotationDimensions(isFirstRender?: boolean) {
        let dimensions: ClientRectDOM = { left: 0, bottom: 0, height: 0, right: 0, top: 0, width: 0 };
        let rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);

        this.topVals.push(this.annotationRect.top);
        this.leftVals.push(this.annotationRect.left);
        let drawDirection = this.props.drawDirection;
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
        } else {
            dimensions.left = Math.round(this.annotationRect.left * 1000) / 1000;
            dimensions.top = Math.round(this.annotationRect.top * 1000) / 1000;
        }

        dimensions.width = Math.round(this.annotationRect.width * 1000) / 1000;
        dimensions.height = Math.round(this.annotationRect.height * 1000) / 1000;
        return dimensions;
    }

    /**
     * getAnnotationClassName function is to get the classname for annotation.
     * @param isFade
     * @param isShowBorder
     */
    public getAnnotationClassName(isFade: boolean, isShowBorder: boolean): string {
        let className: string = 'annotation-wrap dynamic';
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
    }

    /**
     * save the annotation on move/resize
     */
    private saveAnnotation() {
        let rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);
        let top = this.adjustAnnotationPoistionOnStitchedGap(
            this.state.top, rotatedAngle,
            this.props.getAnnotationOverlayElement(),
            true);

        //Zone Top will be 0 if page is linked one
        let zoneTop = this.props.isInLinkedPage || !this.props.isEBookMarking ? 0 : this.props.zoneTop;

        let annotationLeftinPx = (this.state.left / 100) * this.props.imageWidth;
        // for ebookmarking components, we should add zonetop along with annotation top if its a zoned page
        let annotationTopinPx = (zoneTop + (top / 100) * this.props.imageHeight);
        let annotationWidthinPx = (this.state.width / 100) * this.props.imageWidth;
        let annotationHeightinPx = (this.state.height / 100) * this.props.imageHeight;

        if (this.props.clientToken !== undefined) {
            let outputPageNo = annotationHelper.getOutputPageNo(this.props.doApplyLinkingScenarios,
                this.props.imageZones, this.props.imageZone, this.props.outputPageNo);
            let pageNo = this.props.isInLinkedPage || this.props.isEBookMarking ?
                this.props.currentImagePageNo : this.props.pageNo;
            if (this.props.doApplyLinkingScenarios === true && pageNo === 0) {
                // annotation in stitched image. we need to add the height of zones above the currect zone
                // when in linking scenarios are enabled
                let topAboveCurrentZone = this.props.topAboveCurrentZone ? this.props.topAboveCurrentZone : 0;
                annotationTopinPx += topAboveCurrentZone;
            }
            markingActionCreator.updateAnnotation(annotationLeftinPx,
                annotationTopinPx,
                this.props.imageClusterId,
                outputPageNo,
                pageNo,
                this.props.clientToken,
                annotationWidthinPx,
                annotationHeightinPx);
        }
    }

    /**
     * This function gets the Annotation overlay cleint rect properties
     */
    private getAnnotationHolderElementProperties = (): ClientRectDOM => {
        if (this.props.getAnnotationOverlayElement && this.props.getAnnotationOverlayElement() !== undefined) {
            return this.props.getAnnotationOverlayElement().getBoundingClientRect();
        } else {
            return ReactDom.findDOMNode(this).parentElement.getBoundingClientRect();
        }
    };

    /**
     * This function returns the annotationRect Client rect
     */
    private getCurrentElementBoundRect(): ClientRectDOM {
        let clientRect: ClientRectDOM = {
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
    }

    /**
     * This method will find the difference from the annoation left/top position to the mouse/touch clicked position.
     */
    private elementSelected = (e: React.MouseEvent<MouseEvent> | Touch) => {
        this.setInitialCoordinates();
        let annotationHolderRect = this.getAnnotationHolderElementProperties();
        let annotationHolderInitialTop = annotationHolderRect.top +
            this.props.getMarkSheetContainerProperties().element.scrollTop;
        let annotationHolderLeft = annotationHolderRect.left +
            this.props.getMarkSheetContainerProperties().element.scrollLeft;
        /* Below variable stores the difference from the annoation left position to the mouse/touch clicked position */
        this.mouseDownCoordinates.pointerDifferenceFromAnnotationX = (e.pageX +
            this.props.getMarkSheetContainerProperties().element.scrollLeft) -
            ((this.getCurrentElementBoundRect().left +
                this.props.getMarkSheetContainerProperties().element.scrollLeft - annotationHolderLeft));
        /* Below variable stores the difference from the annoation top position to the mouse/touch clicked position */
        this.mouseDownCoordinates.pointerDifferenceFromAnnotationY = e.pageY -
            (this.getCurrentElementBoundRect().top - annotationHolderInitialTop);
        /** To enable the border on moving the annotation */
        this.switchBorder(true);
        /* To set the innerHTML of the current element */
        this.elementHTML = ReactDom.findDOMNode(this).innerHTML;
    };

    /**
     * This method will retain initial dimensions if the annotation is resized beyond
     * the boundaries of response or is moved to the gray area.
     */
    private retainInitialDimension = (e?: Touch | MouseEvent) => {
        let isMouseLeavedAnnotation: boolean = true;
        let minWidth: number = 0;
        let minHeight: number = 0;
        if (this.selectedBorder !== enums.AnnotationBorderType.Default) {
            let currentRect: ClientRectDOM = this.getCurrentElementBoundRect();
            isMouseLeavedAnnotation = this.isPointerInsideResponse(e, currentRect, this.getAnnotationHolderElementProperties());
            // Minimum Resize value for dynamic annotation is 3%. Below this minimum level annotation can't resize.
            this.resizeMinVal.width = 0.03 * this.getAnnotationHolderElementProperties().width;
            this.resizeMinVal.height = 0.03 * this.getAnnotationHolderElementProperties().width;
            let blnIsRetain = annotationHelper.getDimensionsToRetain(currentRect, this.resizeMinVal, this.initialCoordinates,
                this.props.displayAngle, this.props.annotationData.stamp);

            // added checking to ensure annotation resizing has crossed the stitched image gap.
            // as the annotation is in same image mouse will not show as it leaved the page.
            if (blnIsRetain || isMouseLeavedAnnotation || this.isAnnotationOverlapsStitchedGap) {
                this.setState({
                    width: this.initialCoordinates.width,
                    height: this.initialCoordinates.height,
                    top: this.initialCoordinates.y,
                    left: this.initialCoordinates.x
                });
            }
        } else {
            if (this.retainPosition) {
                this.annotationOutsideResponse = false;
                this.setState({
                    width: this.initialCoordinates.width,
                    height: this.initialCoordinates.height,
                    top: this.initialCoordinates.y,
                    left: this.initialCoordinates.x
                });
                this.hasMovedToNextPage = false;
                this.hideMovingElementOnOtherPage();

            }
        }
        this.retainPosition = false;
        this.isAnnotationOverlapsStitchedGap = false;
    };

    /**
     * This method hide the current moving element while moving to other page
     */
    private hideMovingElementOnOtherPage = () => {
        let movingElementProperties: dynamicElementProperties = {
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
    private isPointerInsideResponse = (e: MouseEvent | Touch, currentRect: ClientRectDOM, containerRect: ClientRectDOM): any => {
        let pointerInGrayArea = this.isPointerInGrayArea(e, this.annotationOverlayElement, this.props.displayAngle);
        return (
            this.isPointerInsideElement(e, containerRect) ||
            pointerInGrayArea.inGrayArea
        );
    };

    /**
     * This method will find whether the mouse/touch pointer is outside the particular element.
     * @param e
     * @param element
     */
    private isPointerInsideElement = (e: MouseEvent | Touch, elementRect: ClientRectDOM) => {
        return (
            elementRect.top > e.clientY ||
            elementRect.bottom < e.clientY ||
            elementRect.left > e.clientX ||
            elementRect.right < e.clientX
        );
    };

    /* This method will check whether the pointer is in gray area region
     * @param e
     */
    private isPointerInGrayArea = (e: MouseEvent | Touch,
        annotationOverlayElement: Element,
        rotatedAngle: number): any => {

        let inGrayArea = false;
        var isInsideStitchedPage = true;

        // Check whether the current hovering element is stitched image or not.
        var isStitchedImage: boolean = false;

        // Double checking to ensure that the current mouse pointer is inside the annotation overlay.
        if (annotationOverlayElement && annotationOverlayElement.id.indexOf('annotationoverlay') >= 0) {

            let prevImageZone = annotationOverlayElement.previousSibling;
            if (prevImageZone != null && prevImageZone.attributes.getNamedItem('class') !== null &&
                prevImageZone.attributes.getNamedItem('class').nodeValue !== null &&
                prevImageZone.attributes.getNamedItem('class').nodeValue.indexOf('marksheet-img stitched') > -1) {
                isStitchedImage = true;
            }

            // Update the overlay boundary with the hovering annoation holder to get the stitched image info.
            this.resetOverlayStitchedBoundary(annotationOverlayElement, rotatedAngle);
        }
        if (isStitchedImage) {
            let propsForGrayAreaCheck = annotationHelper.setElementPropertiesForGrayAreaCheck(
                e.clientX, e.clientY,
                annotationOverlayElement,
                this.props.getMarkSheetContainerProperties().element,
                rotatedAngle);

            // This check will be applicable only for stitched images as there is a new gap introduced
            // b/w stitched zones.
            isInsideStitchedPage = annotationHelper.isAnnotationInsideStitchedImage
                (this.overlayBoundary, rotatedAngle,
                e.clientX, e.clientY);

            inGrayArea = !(annotationHelper.checkGreyAreaAfterRotation(
                propsForGrayAreaCheck.element,
                propsForGrayAreaCheck.left,
                propsForGrayAreaCheck.top, 0, 0,
                propsForGrayAreaCheck.angle,
                propsForGrayAreaCheck.scrollTop));
        }

        (!isInsideStitchedPage || inGrayArea) === true ?
            markingActionCreator.onAnnotationDraw(false) : markingActionCreator.onAnnotationDraw(true);

        return { 'inGrayArea': inGrayArea, 'isInsideStitchedPage': isInsideStitchedPage };
    };


    /**
     * This method will set the initial coordinates while performing move/resize
     */
    private setInitialCoordinates = () => {
        let annotationrect = this.getCurrentElementBoundRect();
        this.annotationRect = {
            width: annotationrect.width, height: annotationrect.height, top: annotationrect.top,
            left: annotationrect.left, bottom: 0, right: 0
        };
        this.initialCoordinates = {
            width: this.state.width, height: this.state.height,
            x: this.state.left, y: this.state.top
        };
    };

    /**
     * This method will return an zIndex value for the annotation
     */
    private getZindexValue = () => {
        return Math.round((this.props.imageWidth * this.props.imageHeight) -
            (this.props.annotationData.width * this.props.annotationData.height));
    };

    /**
     * This method will get fired when the mouse over the annotation area
     */
    public onMouseOver = (e: any) => {
        // Mouse over event is firing in mobile devices
        if (!this.isTouchDevice) {
            if (!this.isPreviousAnnotation) {
                responseActionCreator.setMousePosition(-1, -1);
            }
            this.switchBorder(true);
        }
    };

    /**
     * This method will get fired when the mouse leave the annotation area
     */
    public onMouseLeave = (e: any) => {
        // Mouse Leave and Mouse enter events are firing in mobile devices
        if (!this.isTouchDevice) {
            this.switchBorder(false);
        }
    };


    /**
     * This method will get fired when the mouse click happens
     */
    public onClick = (e: any) => {
        // allow stamping static annotation over dynamic if a annotation is selected from toolbar
        e.stopPropagation();
        e.preventDefault();
    };

    /**
     * Show the Resize Border over Annotation.
     * @param drawMode
     */
    public showBorder = (drawMode?: boolean) => {
        let border = [];
        /** On drawing an annotation, then pointerevents for the reszier will be disabled.
         * Because while drawing over other annotations the resizer will get displayed, this will cause the cursor issue
         */
        let stylePointer: React.CSSProperties = {
            pointerEvents: drawMode ? 'none' : ''
        };
        border.push(this.getBorderAnnotation().map((item: resizer) => {
            return (
                <span id={this.props.id + '_' + item.className} className={item.className}
                    onMouseOver={!this.props.isActive ? null : this.onResizeMouseOver.bind(this, item.borderType)}
                    onMouseLeave={!this.props.isActive ? null : this.onResizeMouseLeave.bind(this, item.borderType)}
                    ref={item.className} style={stylePointer} key={this.props.id + '_' + item.borderType.toString()}>
                </span>
            );
        }));
        return border;
    };

    /**
     * Creating the Border for Resize.
     */
    private getBorderAnnotation = (): resizer[] => {
        let resizeProperties: resizer[];
        switch (this.props.annotationData.stamp) {
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
    private switchBorder = (isShowBorder: boolean) => {
        // check if the annotation is previous or not
        if (!this.isPreviousAnnotation) {
            this.setState({
                isShowBorder: isShowBorder
            });
            this.props.setDynamicAnnotationBorder(isShowBorder);
        }
    };

    /**
     * Get the annotation color
     */
    public getAnnotationColor = () => {
        return this.props.annotationData.red + ',' + this.props.annotationData.green + ',' +
            this.props.annotationData.blue;
    };

    /**
     * Annotation panstart event method
     */
    private annotationPanStart = (event: EventCustom) => {
        this.props.enableImageContainerScroll(false);
        /** Pan Start event is fired only for annotations that are active only  */
        if (this.isAnnotationPannable && !annotationHelper.isEventCanceled(event)) {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Annotation);
            stampActionCreator.setDynamicAnnotationMoveInScript(true);
            this.annotationOverlayElement = this.props.getAnnotationOverlayElement();
            this.markSheetElement = this.props.getMarkSheetContainerProperties().element;

            let isCommentBoxOpen = stampStore.instance.SelectedOnPageCommentClientToken !== undefined;
            // closing exiting comment box if it is open
            if (isCommentBoxOpen) {
                stampActionCreator.showOrHideComment(false);
            }

            /* In Touch devices we will set the selected border in pan start otherwise we will
               set that in Press */
            if (this.isTouchDevice) {
                let x = event.center.x - event.deltaX;
                let y = event.center.y - event.deltaY;
                let element: Element = htmlUtilities.getElementFromPosition(x, y);
                this.selectedBorder = this.getAnnotationBorderType(element.className);
            }
            if (this.selectedBorder !== enums.AnnotationBorderType.Default) {
                this.annotationRect = this.getCurrentElementBoundRect();
                this.setInitialCoordinates();
                this.markSheetScroll = this.props.getMarkSheetContainerProperties().element.scrollTop;
            } else {
                this.elementSelected(event.changedPointers[0]);
                /*remove the selection from Document before dragging the element*/
                htmlUtilities.removeSelectionFromDocument();
            }
            this.switchBorder(true);
        }
    };

    /**
     * returns the dynamic annotation border type
     */
    private getAnnotationBorderType(className: string): enums.AnnotationBorderType {
        let borderType: enums.AnnotationBorderType;
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
    }

    /**
     * check if the annotation is able to pan
     */
    private get isAnnotationPannable(): boolean {
        return this.props.isActive && !responseStore.instance.isPinchZooming;
    }

    /** Disabling the select start */
    private disableSelectStart = () => {
        return false;
    };

    /**
     * Annotation panmove event method
     */
    private annotationPanMove = (event: EventCustom) => {
        if (this.isAnnotationPannable && !annotationHelper.isResponseReadOnly()
            && !annotationHelper.isEventCanceled(event)) {
            // This is to ensure that for stitched image gap validating we need to apply
            // the hovering element on runtime.
            this.isAnnotationMoving = true;
            this.validateAction(event);
            this.props.setDynamicAnnotationisMoving(true);
            document.addEventListener('onselectstart', this.disableSelectStart, false);
        }
        stampActionCreator.setDynamicAnnotationMoveInScript(true);
        markingActionCreator.showOrHideRemoveContextMenu(false);
    };

    /**
     * Annotation panend event method
     */
    private annotationPanEnd = (event: EventCustom) => {
        if (this.isAnnotationPannable && !annotationHelper.isEventCanceled(event)) {
            let touchCoordinates: any = event.changedPointers[0];
            let annotationOutsideResponse = false;
            /** Fired if the annotation is placed outside the response */
            if (this.annotationOutsideResponse && !this.retainPosition) {
                if (this.hasMovedToNextPage) {
                    this.hasMovedToNextPage = false;
                    this.hideMovingElementOnOtherPage();
                    this.annotationOutsideResponse = false;
                    this.updateMoveAnnotation(this.nextHolderElement);
                    this.props.doEnableClickHandler(true);
                } else {
                    this.annotationOutsideResponse = false;
                    this.retainPosition = false;
                    annotationOutsideResponse = true;
                }
            } else {
                if (this.selectedBorder !== enums.AnnotationBorderType.Default) {
                    /**
                     * Z-index of the annotation is updated while performing resize so as to persist
                     * selection while overlapping with larger annotation
                     */
                    this.setState({ zIndex: this.getZindexValue() });
                }
                /** disable border selection */
                if (!this.isTouchDevice) {
                    // As per the dynamic annotation changes in devices, we don't need to
                    // remove the selection from annotations.
                    this.switchBorder(false);
                }
                this.retainInitialDimension(touchCoordinates);
                this.selectedBorder = enums.AnnotationBorderType.Default;

                /** To maintain uniformity in thickness the attributes of the Hline are rounded to whole numbers */
                if (this.props.annotationData.stamp === enums.DynamicAnnotation.HorizontalLine ||
                    this.props.annotationData.stamp === enums.DynamicAnnotation.VWavyLine ||
                    this.props.annotationData.stamp === enums.DynamicAnnotation.HWavyLine) {
                    // this settimeout causes issues when response is unmounted. this check is to handle this error
                    let annotationHolderRect: ClientRectDOM = this.getAnnotationHolderElementProperties();
                    this.updateAnnotationThicknessOnResize(annotationHolderRect);
                }

                if (!this.hasMovedToNextPage) {
                    this.saveAnnotation();
                }
            }
            /** Delete annotation if its dragged in to stamp pannel */
            if (this.isInStampPanel || annotationOutsideResponse || this.isAnnotationInsideStitchedImageGap) {
                this.removeAnnotation();
                this.props.doEnableClickHandler(true);
            }

            this.isAnnotationInsideStitchedImageGap = false;
            this.isAnnotationOverlapsStitchedGap = false;
            this.isAnnotationMoving = false;
            this.props.setDynamicAnnotationisMoving(false);

            /** Delete the annotation when moved beyond the response */
            toolbarActionCreator.PanStampToDeleteArea(false, touchCoordinates.clientX, touchCoordinates.clientY);
        }

        this.props.enableImageContainerScroll(true);
        this.props.enableAnnotationOverlayPan(true);
        if (this.hasMovedToNextPage) {
            this.switchBorder(true);
        }
        stampActionCreator.setDynamicAnnotationMoveInScript(false);
        if (!this.isTouchDevice) {
            // As per the dynamic annotation changes in devices, we don't need to
            // remove the selection from annotations.
            this.props.setDynamicAnnotationBorder(false);
        }
        markingActionCreator.onAnnotationDraw(true);
        document.removeEventListener('onselectstart', this.disableSelectStart, false);
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Annotation);
    };

    /**
     * input event for annotation
     */
    private annotationInput = (event: EventCustom) => {
        // allow stamping static annotation over dynamic if a annotation is selected from toolbar
        if (!this.isStampSelected || markingStore.instance.contextMenuDisplayStatus) {
            this.props.enableAnnotationOverlayPan(true);
            event.srcEvent.stopPropagation();
            event.srcEvent.preventDefault();
        } else {
            this.props.enableAnnotationOverlayPan(false);
        }
    };

    /**
     * Annotation press event method
     */
    private annotationPress = (event: any) => {
        /* In Touch devices we will set the selected border in pan start otherwise we will
           set that in Press */
        if (!this.isTouchDevice) {
            let x = event.center.x - event.deltaX;
            let y = event.center.y - event.deltaY;
            let element: Element = htmlUtilities.getElementFromPosition(x, y);
            this.selectedBorder = this.getAnnotationBorderType(element.className);
        }

        if (this.isTouchDevice) {
            this.onTouchHold(event);
        }
    };

    /**
     * Hammer Implementation
     */
    protected setUpHammer() {
        /* for current annotations only we need to attach hammer */
        if (!this.isPreviousAnnotation && this.props.isActive && !this.eventHandler.isInitialized) {
            /** To perform move functionality the parent span is attached with the hammer events */
            this.annotationElement = ReactDom.findDOMNode(this);
            let touchActionValue: string = deviceHelper.isTouchDevice() && !deviceHelper.isMSTouchDevice() ? 'auto' : 'none';
            let threshold = constants.PAN_THRESHOLD;
            const pressTime: number = 0;
            const pressTimeForDevices = 250;

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
    }

    /**
     * Destroy Hammer
     */
    protected destroyHammer() {

        if (this.annotationElement) {
            /** To show border for annotation while click on touch in ipad/surface */
            this.annotationElement.removeEventListener('touchstart', this.onTouchStart);
        }

        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    }

    /**
     * Switch the Border of the Annotations while tapping on devices
     */
    private onTouchStart = (e: TouchEvent) => {
        let stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
        if (stamp) {
            this.deSelectPreviousStamp(e, true);
            // hide border if border is showing
            if (this.state.isShowBorder) {
                this.switchBorder(false);
            }
            that = this;
        } else if (this.props.isActive) {
            if (that) {
                if (that.state.isShowBorder) {
                    that.setState({
                        isShowBorder: false
                    });
                }
            }
            that = this;
            this.switchBorder(true);
            // Added as part of defect fix 29238 Focus of the annotation is moved but the previous 'remove annotation' is still shown
            markingActionCreator.showOrHideRemoveContextMenu(false);
            // allow stamping static annotation over dynamic if a annotation is selected from toolbar
            if (!this.isPreviousAnnotation && !this.isStampSelected) {
                e.preventDefault();
            }
        }
    };

    /**
     * Switch the Border of the Annotations while tapping on devices
     */
    private onTapHandler = (e: TouchEvent) => {
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
            let currentImageZone: ImageZone = (this.props.imageZone) ? this.props.imageZone :
                ((this.props.imageZones && this.props.imageZones.length > 0) ? annotationHelper.getImageZone(this.overlayBoundary,
                    annotationHelper.getAngleforRotation(this.props.displayAngle),
                    e.changedPointers[0].clientX,
                    e.changedPointers[0].clientY,
                    this.props.imageZones) : 0);
            // this.overlayBoundary become undefind on double tab so added an undefined check
            // before finding the view whole response visiblity check.
            if (currentImageZone && this.viewWholePageVisibilityCheck(currentImageZone)) {
                responseActionCreator.viewWholePageLinkAction(true, currentImageZone);
            }
        }
    };

    /*
     * Returns true, when view whole page button is suppose to display in script.
     */
    private viewWholePageVisibilityCheck = (imageZone: ImageZone): boolean => {
        return (!(imageZone.topEdge === 0
            && imageZone.leftEdge === 0
            && imageZone.width === 100
            && imageZone.height === 100)
            && imageZone.isViewWholePageLinkVisible
            && toolbarStore.instance.selectedStampId === 0
            && toolbarStore.instance.panStampId === 0
            && !stampStore.instance.isDynamicAnnotationActive);
    }

    /**
     * return the zindex value for an annotatin
     */
    protected get previousRemarkZIndex(): number {
        return this.props.annotationData.zOrder;
    }

    /**
     * For HLine, left/top values should be in rounded pixels to fix the thickness issue
     */
    protected updateAnnotationThicknessOnResize = (annotationHolderRect: ClientRectDOM): void => {
        let rotatedAngle = annotationHelper.getAngleforRotation(this.props.displayAngle);
        let holderWidth = annotationHolderRect.width;
        let holderHeight = annotationHolderRect.height;

        if (rotatedAngle === enums.RotateAngle.Rotate_90 ||
            rotatedAngle === enums.RotateAngle.Rotate_270) {
            holderWidth = annotationHolderRect.height;
            holderHeight = annotationHolderRect.width;
        }
        this.setState({
            left: annotationHelper.getRoundedValueAnnotationThickness(this.state.left, holderWidth),
            top: annotationHelper.getRoundedValueAnnotationThickness(this.state.top, holderHeight)
        });

    };

    /**
     * check annotation thickness
     */
    protected checkThickness = () => {
        //if (this.isRenderedFully) {
        this.checkThicknessOnResize();
        //}
    };

	/**
	 * check annotation thickness
	 */
    protected checkThicknessOnAnimationCompleted(): void {
        let annotationHolderRect: ClientRectDOM = this.getAnnotationHolderElementProperties();
        /** If the function is triggered on the normal basis, the thickness seems
         * to differ in uniformity, hence a timeout is applied for persisting the thickness
         */
        this.updateAnnotationThicknessOnResize(annotationHolderRect);
    }

    /**
     * removes the selected annotation.
     */
    protected removeAnnotation = (): void => {
        this.isInStampPanel = false;
        let annotationClientTokenToBeDeleted: Array<string> = [];
        let isMarkByAnnotation: boolean;
        isMarkByAnnotation = responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus);
        annotationClientTokenToBeDeleted.push(this.props.annotationData.clientToken);
        markingActionCreator.removeAnnotation(annotationClientTokenToBeDeleted, isMarkByAnnotation);
    };

    /**
     * After DOM update set the annotation thickness
     */
    private checkThicknessOnResize = () => {
        // this settimeout causes issues when response is unmounted. this check is to handle this error
        let annotationHolderRect: ClientRectDOM = this.getAnnotationHolderElementProperties();
        /** If the function is triggered on the normal basis, the thickness seems
         * to differ in uniformity, hence a timeout is applied for persisting the thickness
         */
        setTimeout(() => {
            this.updateAnnotationThicknessOnResize(annotationHolderRect);
        }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
    };

    /**
     * initiateRender
     */
    protected initiateRender = () => {
        this.loadEmpty = true;
        /** To resolve rerendering issue, at first the line element
         * is replaced by empty div and rerendered again with a timeout
         */
        this.setState({ renderedOn: Date.now() });
        this.loadEmpty = false;
        setTimeout(() => {
            this.setState({ renderedOn: Date.now() });
        }, 500);
    };

    /**
     * Reset the overlay boundary on each action to get the updated image size.
     * @param {HTMLElement} element?
     * * @param {Number} rotated angle?
     */
    protected resetOverlayStitchedBoundary(element?: Element, angle?: number) {
        let rotatedAngle = annotationHelper.getAngleforRotation(element === undefined ?
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
        } else {
            let annotationOverlayParentElement: Element = this.props.getAnnotationOverlayElement() ?
                this.props.getAnnotationOverlayElement().parentElement : undefined;
            this.overlayBoundary = annotationHelper.getStitchedImageBoundary(
                annotationOverlayParentElement, rotatedAngle);
        }
    }

    // Gets or sets a value indicating whether current annotation holder
    // contains any stitched images.
    private get isStitchedImage(): boolean {
        return this.overlayBoundary.length > 0;
    }

    /**
     * Adjust the stitched image gap with respect to the image position for structred response.
     * @param {number} annotationTop
     * @param {number} rotatedAngle
     * @param {number} holderElement
     * @param {number} isSaving
     * @returns The adjusted annotation top.
     */
    private adjustAnnotationPoistionOnStitchedGap(annotationTop: number,
        rotatedAngle: number,
        holderElement: HTMLElement,
        isSaving: boolean = false): number {
        if (holderElement) {
            this.resetOverlayStitchedBoundary(holderElement, rotatedAngle);
        }

        if (this.overlayBoundary && this.overlayBoundary.length > 0) {
            var totalImageHeight: number = 0;
            var stitchedImageIndex: number = 0;
            var stitchedImageSeperator: number = 0;
            for (var i = 0; i < this.overlayBoundary.length; ) {
                totalImageHeight += this.overlayBoundary[i].imageHeight;

                // If the looping last image consider we are at 100%. This will help
                // to calculate annotations placed at the edge.
                var currentPagePercentage =
                    (i < this.overlayBoundary.length - 1) ? (totalImageHeight / holderElement.clientHeight) * 100 : 100;
                if (annotationTop < currentPagePercentage) {
                    i = this.overlayBoundary.length;
                } else {
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
    }

    /**
     * get hit area for line annotations
     */
    protected getLineAnnotationHitArea() {
        if (!this.isPreviousAnnotation) {
            return (<span className='hit-area' key={this.props.id + '_hitarea'}></span>);
        }
    }

    /**
     *  get style pointer events
     */
    protected get getStyleSpanPointerEvents() {
        /* Removed unwanted conditions as part of defect fix : #38721 */
        if (this.props.isInFullResponseView) {
            return 'none';
        }
    }

    /**
     * returns rgb color for active and inactive annotation
     * @param isFade
     * @param annotationType
     */
    public getAnnotationColorInRGB(isFade: any, annotationType: enums.DynamicAnnotation): string {
        let rgbaColor: string = colouredAnnotationsHelper.createAnnotationStyle(this.props.annotationData,
            annotationType).fill;

        // for inactive annotations
        if (isFade) {
            rgbaColor = colouredAnnotationsHelper.getTintedRgbColor(rgbaColor);
        }

        return rgbaColor;
    }

    /**
     * add a link annotation if the page is linked by previous marker and
     * current marker is adding or updating a annotation
     * @param pageNo
     * @param isInLinkedPage
     */
    private addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo: number, isInLinkedPage: boolean) {
        let treeViewHelper = new treeViewDataHelper();
        let tree = treeViewHelper.treeViewItem();
        let multipleMarkSchemes = markingHelper.getMarkschemeParentNodeDetails(
            tree, markingStore.instance.currentMarkSchemeId, true);
        pageLinkHelper.addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo, isInLinkedPage,
            this.props.pagesLinkedByPreviousMarkers, multipleMarkSchemes);
    }

    /* checks whether the pointer is in comment holder
     * @param e
     */
    private isPointerInCommentHolder = (e: MouseEvent | Touch): any => {
        let currentPointerElement = htmlUtilities.getElementFromPosition(e.clientX, e.clientY);
        if (currentPointerElement != null && currentPointerElement.attributes.getNamedItem('class') !== null &&
            currentPointerElement.attributes.getNamedItem('class').nodeValue !== null) {
            let nodeValue = currentPointerElement.attributes.getNamedItem('class').nodeValue;
            let arrayOfClasses = ['comments-bg', 'comment-box', 'commentbox-inner', 'comment-box-header',
                'comment-heading', 'comment-icon-holder', 'offpage-comment-icon', 'comment-box-content',
                'comment-input', 'comment-textbox', 'commentbox-fader'];
            if (arrayOfClasses.indexOf(nodeValue) > -1) {
                return true;
            }
        }
        return false;
    }

	/**
	 * Gets annotation properties of width and height based on the given
	 * holder width and image properties.
	 * @param holderElement
	 * @param width
	 * @param height
	 */
    private getAnnotationProperties(holderElement: HTMLElement, width: number, height: number): any {

        let annotationProperties: any = { 'width': 0, 'height': 0 };

        let imageHeight = Number(holderElement.getAttribute('data-imageheight'));
        let imageWidth = Number(holderElement.getAttribute('data-imagewidth'));
        annotationProperties.height = annotationHelper.calculatePercentage(height, imageHeight);
        annotationProperties.width = annotationHelper.calculatePercentage(width, imageWidth);
        return annotationProperties;
    }

	/**
	 * Gets a value indicating dynamic annotation pattern identifier while moving the HWavy/VWavy line.
	 * This will help to avoid conflicting b/w dulicate id's for multiple svgs.
	 */
    protected get getDynamicPatternId(): string {
        return this.isAnnotationMoving ? this.props.id + '_moving' : this.props.id;
    }

    /**
     * This method will set selection border while stamping an dynamic annotation
     * in devices - that will hold the previously selected dynamic stamp
     * @protected
     * @memberof DynamicStampBase
     */
    protected setBorderOnStamping = () => {
        if (this.isTouchDevice) {
            if (this.props.isActive && this.props.isAnnotationAdded) {
                this.deSelectPreviousStamp();
                that = this;
                this.switchBorder(true);
            }
        }
    }

    /**
     * This will remove/ add selection
     * @protected
     * @memberof DynamicStampBase
     */
    protected addOrRemoveSelectionBorder = (isSelected: boolean): void => {

        if (this.state.isShowBorder && !isSelected) {
            this.switchBorder(isSelected);
        }
    }

    /**
     * We've to remove the dynamic annotation selection if any stamp is selected in fav bar.
     * @private
     * @memberof Ellipse
     */
    protected onStampSelected = (): void => {
        if (this.state.isShowBorder) {
            this.addOrRemoveSelectionBorder(false);
        }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * This will update the dynamic stamp selection.
     * @protected
     * @memberof DynamicStampBase
     */
    protected updateSelection = (isSelected: boolean): void => {
        this.addOrRemoveSelectionBorder(isSelected);
    }

    /**
     * This will deselect the previously selected stamp.
     * @private
     * @memberof DynamicStampBase
     */
    private deSelectPreviousStamp = (e?: Event, preventEvent: boolean = false) => {
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
    }

    /* return z-index for dynamic stamp */
    protected get zIndex(): number {
        if (this.isPreviousAnnotation) {
            return this.previousRemarkZIndex;
        } else {
            return !this.props.isActive || this.props.isFade ?
                annotationHelper.getCurrentResponseZIndex() : this.getZindexValue();
        }
    }
}

export = DynamicStampBase;