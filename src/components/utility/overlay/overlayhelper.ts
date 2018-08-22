import enums = require('../enums');
import Immutable = require('immutable');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import acetatesActionCreator = require('../../../actions/acetates/acetatesactioncreator');
import constants = require('../constants');
import annotationHelper = require('../annotation/annotationhelper');
import responseStore = require('../../../stores/response/responsestore');
import responseHelper = require('../responsehelper/responsehelper');
import fracsHelper = require('../../../utility/generic/fracshelper');
import acetateContextMenuData = require('../contextmenu/acetatecontextmenudata');

class OverlayHelper {

    /**
     * return acetates for skipped zones
     * @param acetatesList
     * @param itemId
     * @param imageProps
     * @param linkingScenarioProps
     */
    public static getAcetatesForSkippedZones(acetatesList: Immutable.List<Acetate>, itemId: number, imageProps: any,
        linkingScenarioProps: any) {
        // skipped zones are zones which wont come for render while liniking, for eg : consider having 2 zones of 
        // same page in same output page. when this is linked to the same page, then first zone will come for render
        // and will be shown in full. as the page is already displayed there is no need for second zone to render. 
        // but acetates in these zones need to be shown in correct position in linked page.
        let skippedZones: Immutable.List<ImageZone> = linkingScenarioProps.skippedZones;
        let currentZones: Immutable.List<ImageZone> = imageProps.currentImageZones;
        let acetatesAgainstSkippedZones: Immutable.List<Acetate> = Immutable.List<Acetate>();
        if (skippedZones && skippedZones.count() > 0 && currentZones && acetatesList ) {
            skippedZones.map((skippedZone: ImageZone) => {
                // get all the zones above a skipped zone. this is needed as y position for acetate is calculated
                // w.r.t the height of output page and now its linked and is splitted. so need we need to consider 
                // height of zones above the current zone inorder to calculate the y value from the current zone.
                let zonesAboveSkippedZone = currentZones.filter(item => item.sequence < skippedZone.sequence
                    && item.outputPageNo === skippedZone.outputPageNo).toList();
                if (imageProps.getHeightOfZones && zonesAboveSkippedZone.count() >= 0 && acetatesList) {
                    let skippedImageNaturalDimension = imageProps.getImageNaturalDimension(skippedZone.pageNo);
                    let skippedZoneTop = OverlayHelper.convertPercentageToPixel(skippedImageNaturalDimension.naturalHeight,
                        skippedZone.topEdge);
                    let skippedZoneLeft = OverlayHelper.convertPercentageToPixel(skippedImageNaturalDimension.naturalWidth,
                        skippedZone.leftEdge);
                    let skippedZoneHeight = OverlayHelper.convertPercentageToPixel(skippedImageNaturalDimension.naturalHeight,
                        skippedZone.height);
                    let heightOfZonesAboveSkippedZone = imageProps.getHeightOfZones(zonesAboveSkippedZone);
                    acetatesList.map((acetate: Acetate) => {
                        let p1 = OverlayHelper.findAcetateFirstPoint(acetate.acetateData);
                        if (acetate.acetateData.outputPageNumber === skippedZone.outputPageNo &&
                            acetate.itemId === itemId &&
                            p1.y >= heightOfZonesAboveSkippedZone &&
                            p1.y <= heightOfZonesAboveSkippedZone + skippedZoneHeight) {
                            // add the zone left and top values as these zones wont come for render.
                            // heightOfZonesAboveSkippedZone is the total height of all the zones above 
                            // current skipped zone within the output page.
                            let imageLinkingData = {
                                topAboveZone: heightOfZonesAboveSkippedZone,
                                skippedZoneTop: skippedZoneTop,
                                skippedZoneLeft: skippedZoneLeft
                            };
                            acetate.imageLinkingData = imageLinkingData;
                            acetatesAgainstSkippedZones = acetatesAgainstSkippedZones.push(acetate);
                        }
                    });
                }
            });
        }

        return acetatesAgainstSkippedZones;
    }

    /**
     * get first point from acetate data based on y value from points
     * @param acetateData
     */
    private static findAcetateFirstPoint(acetateData: AcetateData): AcetatePoint {
        let acetateLines = acetateData.acetateLines;
        let firstPoint: AcetatePoint;
        acetateLines.map((line: AcetateLine) => {
            let acetatePoints = line.points;
            firstPoint = acetatePoints[0];
            acetatePoints.map((point: AcetatePoint) => {
                if (point.y < firstPoint.y) {
                    firstPoint = point;
                }
            });
        });

        return firstPoint;
    }

    /**
     * find percentage
     * @param numerator
     * @param denominator
     */
    public static findPercentage(numerator: number, denominator: number) {
        return (numerator / denominator) * 100;
    }

    /**
     * find the percentage
     * @param numerator
     * @param denominator
     */
    public static convertPercentageToPixel(numerator: number, denominator: number) {
        return (numerator * (denominator / 100));
    }

    /**
     * return all the acetates for current page or zone
     * @param acetatesList
     * @param itemId
     * @param doApplyLinkingScenarios
     * @param imageProps
     * @param linkingScenarioProps
     */
    public static getAcetesForCurrentPageOrZone(acetatesList: Immutable.List<Acetate>, itemId: number,
        doApplyLinkingScenarios: boolean, imageProps: any, linkingScenarioProps: any) {
        let acetatesToRender = null;
        let acetatesAgainstCurrentQuestion = null;
        if (acetatesList) {
            if (doApplyLinkingScenarios) {
                // for structured linking secnarios
                if (imageProps.isALinkedPage) {
                    // get acetates from additional pages
                    if (imageProps.currentImageZone) {
                        // zoned page (linked)
                        acetatesAgainstCurrentQuestion = OverlayHelper.getAcetatesInLinkingScenario(acetatesList, itemId,
                            linkingScenarioProps.zoneHeight, linkingScenarioProps.topAboveCurrentZone, imageProps.outputPageNo);
                    }
                    // acetates aganist linked pages
                    let acetatesAgainstCurrentQuestionInLinkedPage = this.getAcetatesAgainstPageNo(acetatesList, itemId, imageProps.pageNo);
                    // concat the result into single collection
                    if (acetatesAgainstCurrentQuestion) {
                        acetatesAgainstCurrentQuestion = acetatesAgainstCurrentQuestion.concat(acetatesAgainstCurrentQuestionInLinkedPage);
                    } else {
                        acetatesAgainstCurrentQuestion = acetatesAgainstCurrentQuestionInLinkedPage;
                    }
                } else {
                    acetatesAgainstCurrentQuestion = OverlayHelper.getAcetatesInLinkingScenario(acetatesList, itemId,
                        linkingScenarioProps.zoneHeight, linkingScenarioProps.topAboveCurrentZone, imageProps.outputPageNo);
                }
            } else if (imageProps.outputPageNo > 0) {
                // for normal structured
                acetatesAgainstCurrentQuestion = this.getAcetatesAgainstOutputPageNo(acetatesList,
                    itemId, imageProps.outputPageNo);
            } else {
                // for unstructured
                acetatesAgainstCurrentQuestion = this.getAcetatesAgainstPageNo(acetatesList,
                    itemId, imageProps.pageNo);
            }
        }

        return acetatesAgainstCurrentQuestion;
    }

    /**
     * return acetates against a page no
     * @param acetatesList
     * @param itemId
     * @param pageNo
     */
    private static getAcetatesAgainstPageNo(acetatesList: Immutable.List<Acetate>, itemId: number, pageNo: number) {
        return acetatesList.filter(item => item.acetateData.wholePageNumber === pageNo && item.itemId === itemId);
    }

    /**
     * return acetates against output page no
     * @param acetatesList
     * @param itemId
     * @param outputPageNo
     */
    private static getAcetatesAgainstOutputPageNo(acetatesList: Immutable.List<Acetate>, itemId: number, outputPageNo: number) {
        return acetatesList.filter(item => item.acetateData.outputPageNumber === outputPageNo && item.itemId === itemId);
    }

    /**
     * return acetates in linking scenario
     * @param acetatesList
     * @param itemId
     * @param zoneHeight
     * @param topAboveCurrentZone
     * @param outputPageNo
     */
    private static getAcetatesInLinkingScenario(acetatesList: Immutable.List<Acetate>, itemId: number,
        zoneHeight: number, topAboveCurrentZone: number, outputPageNo: number) {
        let acetatesAgainstCurrentQuestion = null;
        acetatesAgainstCurrentQuestion = acetatesList.filter((item: Acetate) => {
            // we only need to check the first point as in linking we will be showing the
            // acetate in the page from which the acetate started drawing
            let p1 = OverlayHelper.findAcetateFirstPoint(item.acetateData);
            if (item.acetateData.outputPageNumber === outputPageNo &&
                item.itemId === itemId &&
                p1.y >= topAboveCurrentZone &&
                p1.y <= topAboveCurrentZone + zoneHeight) {
                return true;
            }
        });

        return acetatesAgainstCurrentQuestion;
    }

    /**
     * Gets the tool type of the overlay
     * @param overlayName
     */
    public static getOverlayToolType(overlayName: string): enums.ToolType {
        let toolType: enums.ToolType = enums.ToolType.ruler;
        if (overlayName.indexOf('ruler') === 0) {
            toolType = enums.ToolType.ruler;
        } else if (overlayName.indexOf('protractor') === 0) {
            toolType = enums.ToolType.protractor;
        } else if (overlayName.indexOf('multiline') === 0) {
            toolType = enums.ToolType.multiline;
        }
        return toolType;
    }

    /**
     * Adds an acetate to the script image
     * @param acetateType
     * @param examinerRoleId
     * @param itemId
     * @param imageProps
     * @param elementId
     * @param overlayBoundary
     * @param imageDimension
     */
    public static addAcetate(acetateType: enums.ToolType, examinerRoleId: number, itemId: number, props: any,
        elementId: string, overlayBoundary?: AnnotationBoundary[],
        imageDimension?: { imageWidth: number, imageHeight: number }): void {
        let acetateToAdd: Acetate = OverlayHelper.getDefaultAcetate(acetateType, examinerRoleId, itemId, props, elementId,
            overlayBoundary, imageDimension, props.linkingScenarioProps);
        acetatesActionCreator.addOrUpdateAcetate(acetateToAdd, enums.MarkingOperation.added);
    }

    /**
     * Gets the default acetate properties.
     * @param acetateType
     * @param examinerRoleId
     * @param itemId
     * @param props
     * @param elementId
     * @param overlayBoundary
     * @param imageDimension
     * @param linkingScenarioProps
     */
    private static getDefaultAcetate(acetateType: enums.ToolType,
        examinerRoleId: number,
        itemId: number,
        props: OverlayHolderProps,
        elementId: string,
        overlayBoundary?: AnnotationBoundary[],
        imageDimension?: { imageWidth: number, imageHeight: number }, linkingScenarioProps?: any): Acetate {
        let defaultAcetateToAdd: Acetate = {
            acetateData: OverlayHelper.getDefaultAcetateData(acetateType, props, elementId, overlayBoundary,
                imageDimension, linkingScenarioProps),
            examinerRoleId: examinerRoleId,
            itemId: itemId,
            shared: false,
            clientToken: htmlUtilities.guid,
            markingOperation: enums.MarkingOperation.added,
            isSaveInProgress: false,
            updateOn: Date.now()
        };

        return defaultAcetateToAdd;
    }

    /**
     * Gets the dfault acetate data.
     * @param acetateType
     * @param props
     * @param elementId
     * @param overlayBoundary
     * @param imageDimension
     * @param linkingScenarioProps
     */
    private static getDefaultAcetateData(acetateType: enums.ToolType, props: OverlayHolderProps, elementId: string,
        overlayBoundary?: AnnotationBoundary[],
        imageDimension?: { imageWidth: number, imageHeight: number },
        linkingScenarioProps?: any): AcetateData {

        let outputPageNumber: number = 0;
        let wholePageNumber: number = 0;

        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured && !props.imageProps.isALinkedPage) {
            outputPageNumber = props.imageProps.outputPageNo;
        }

        if (this.isAcetatePlacedAgainstPage(props.imageProps.isALinkedPage)) {
            wholePageNumber = props.imageProps.pageNo;
        }
        let defaultAcetateData: AcetateData = {
            toolType: acetateType,
            backColour: constants.RULER_BACK_COLOR,
            shadeBackGround: 'False',
            outputPageNumber: outputPageNumber,
            wholePageNumber: wholePageNumber,
            acetateLines: OverlayHelper.getDefaultAcetateLines(acetateType, props, elementId, overlayBoundary,
                imageDimension, linkingScenarioProps)
        };
        return defaultAcetateData;
    }

    /**
     * Gets the dfault acetate lines.
     * @param acetateType
     * @param props
     * @param elementId
     * @param overlayBoundary
     * @param imageDimension
     * @param linkingScenarioProps
     */
    private static getDefaultAcetateLines(acetateType: enums.ToolType,
        props: OverlayHolderProps, elementId: string,
        overlayBoundary?: AnnotationBoundary[],
        imageDimension?: { imageWidth: number, imageHeight: number },
        linkingScenarioProps?: any): Array<AcetateLine> {
        let defaultAcetateLines: Array<AcetateLine> = new Array<AcetateLine>();
        let acetateLine: AcetateLine;

        let viewPoints = OverlayHelper.getViewPortPoints(elementId, props.imageProps, acetateType, linkingScenarioProps);
        // Centre coordinates for the image.
        let imageCentreCoordinates: Point = {
            x: viewPoints.x,
            y: viewPoints.y
        };

        if (imageCentreCoordinates.x === 0 && imageCentreCoordinates.y === 0) {
            return null;
        }

        acetateLine = {
            colour: constants.LINE_COLOR,
            lineType: enums.LineType.line,
            points: OverlayHelper.getAcetatePoints(acetateType, imageCentreCoordinates, overlayBoundary, imageDimension, undefined, props)
        };
        defaultAcetateLines.push(acetateLine);
        return defaultAcetateLines;
    }

    /**
     * get the acetate point based on image centre coordinates
     * @param acetateType
     * @param imageCentreCoordinates
     * @param overlayBoundary
     * @param imageDimension
     * @param doAddLineWithThreePoints
     */
    public static getAcetatePoints(acetateType: enums.ToolType, imageCentreCoordinates: Point,
        overlayBoundary?: AnnotationBoundary[],
        imageDimension?: { imageWidth: number, imageHeight: number }, doAddLineWithThreePoints?: boolean,
        props?: OverlayHolderProps): Array<AcetatePoint> {
        let defaultAcetatePoints: Array<AcetatePoint> = Array<AcetatePoint>();

        switch (acetateType) {
            case enums.ToolType.ruler:
                defaultAcetatePoints = OverlayHelper.getRulerPoints(imageCentreCoordinates);
                break;
            case enums.ToolType.protractor:
                defaultAcetatePoints = OverlayHelper.getProtractorPoints(imageCentreCoordinates, overlayBoundary, imageDimension, props);
                break;
            case enums.ToolType.multiline:
                if (doAddLineWithThreePoints) {
                    defaultAcetatePoints = OverlayHelper.getMultiLineWithThreePoints(imageCentreCoordinates);
                } else {
                    defaultAcetatePoints = OverlayHelper.getMultiLinePoints(imageCentreCoordinates);
                }
                break;
        }
        return defaultAcetatePoints;
    }

    /**
     * to get viewport points to place overlays
     * @param elementId
     * @param imageProps
     * @param acetateType
     * @param linkingScenarioProps
     */
    private static getViewPortPoints(elementId: string, imageProps: any, acetateType: enums.ToolType, linkingScenarioProps?: any) {

        let isStructured: boolean = imageProps.outputPageNo > 0 ? true : false;
        let hasMultipleZones: boolean = (imageProps && imageProps.stitchedImageZones &&
            imageProps.stitchedImageZones.length > 0) ? true : false;

        if (isStructured && hasMultipleZones) {
            return OverlayHelper.getViewPortPointsStructured(elementId, imageProps, acetateType, linkingScenarioProps);
        } else {
            return OverlayHelper.getViewPortPointsUnstructured(elementId, imageProps, acetateType, linkingScenarioProps);
        }
    }

    /**
     * to get viewport points for unstructured (includes structured single image viewer)
     * @param elementId
     * @param imageProps
     * @param acetateType
     * @param linkingScenarioProps
     */
    private static getViewPortPointsUnstructured(elementId: string, imageProps: any, acetateType: enums.ToolType,
        linkingScenarioProps?: any) {
        let _imageDimension: any;

        // class="marksheet-holder "
        let markSheetImageElement: any = htmlUtilities.getElementById(elementId);

        let viewHolderClientRect = OverlayHelper.getMarkSheetViewHolder().getBoundingClientRect();

        let markSheetContainer = OverlayHelper.getMarkSheetContainer();

        // class="marksheet-img"
        let imgClientRect = null;

        // Gets the image dimensions.
        _imageDimension = {
            imageHeight: imageProps.outputPageNo > 0 ?
                imageProps.outputPageHeight :
                imageProps.naturalHeight,
            imageWidth: imageProps.outputPageNo > 0 ?
                imageProps.outputPageWidth :
                imageProps.naturalWidth
        };

        // for single image viewer(includes unstructured component)
        imgClientRect = markSheetImageElement.getElementsByClassName('marksheet-img')[0].getBoundingClientRect();

        let scrollTop = markSheetContainer.scrollTop;
        let scrollLeft = markSheetContainer.scrollLeft;
        let containerHeight = markSheetContainer.offsetHeight;
        let containerWidth = markSheetContainer.clientWidth;

        let defaultDimension = OverlayHelper.getAcetateDefaultDimension(acetateType);
        let rotatedImageClientRectHeight;
        let rotatedImageClientRectWidth;
        let rotatedAngle = OverlayHelper.getRotatedAngle(imageProps.pageNo, imageProps.linkedOutputPageNo);

        // set image client rects based on rotated angle
        if ((rotatedAngle / 90) % 2 === 1) {
            rotatedImageClientRectHeight = imgClientRect.width;
            rotatedImageClientRectWidth = imgClientRect.height;
        } else {
            rotatedImageClientRectHeight = imgClientRect.height;
            rotatedImageClientRectWidth = imgClientRect.width;
        }

        // holding default size of acetate
        let acetateWidth: number = (defaultDimension.width / _imageDimension.imageWidth) * rotatedImageClientRectWidth;
        let acetateHeight: number = (defaultDimension.height / _imageDimension.imageHeight) * rotatedImageClientRectHeight;

        // if the viewable part of zone has enough space to place the acetate it returns true
        let isValidViewableAreaToPlace: boolean = (rotatedImageClientRectHeight > acetateHeight) &&
            (rotatedImageClientRectWidth > acetateWidth) ? true : false;

        if (!isValidViewableAreaToPlace) {
            return { x: 0, y: 0 };
        }

        let imgTop = imgClientRect.top;
        let imgLeft = imgClientRect.left;

        let viewHolderTop = viewHolderClientRect.top;
        let viewHolderLeft = viewHolderClientRect.left;

        let zoneHeight = imgClientRect.height;
        let zoneWidth = imgClientRect.width;

        let zoneTopViewHolder = imgTop - viewHolderTop;
        let zoneLeftViewHolder = imgLeft - viewHolderLeft;

        let ystartPoint = 0;
        let yendPoint = 0;

        let xstartPoint = 0;
        let xendPoint = 0;

        let y = 0;
        let x = 0;

        if (zoneTopViewHolder > scrollTop) {
            ystartPoint = zoneTopViewHolder;
        } else {
            ystartPoint = scrollTop;
        }

        if ((zoneTopViewHolder + zoneHeight) < (scrollTop + containerHeight)) {
            yendPoint = zoneTopViewHolder + zoneHeight;
        } else {
            yendPoint = scrollTop + containerHeight;
        }

        if (zoneLeftViewHolder > scrollLeft) {
            xstartPoint = zoneLeftViewHolder;
        } else {
            xstartPoint = scrollLeft;
        }

        if ((zoneLeftViewHolder + zoneWidth) < (scrollLeft + containerWidth)) {
            xendPoint = zoneLeftViewHolder + zoneWidth;
        } else {
            xendPoint = scrollLeft + containerWidth;
        }

        y = (yendPoint - ystartPoint) / 2;
        x = (xendPoint - xstartPoint) / 2;

        if (scrollTop > zoneTopViewHolder) {
            y = scrollTop - zoneTopViewHolder + y;
        }

        if (scrollLeft > zoneLeftViewHolder) {
            x = scrollLeft - zoneLeftViewHolder + x;
        }

        if (OverlayHelper.isInValidCoordinatesToPlaceInViewableArea(x, y, imgClientRect,
            // for ruler & protractor, no need to consider height. since we draw the base line from the given coordinates
            acetateType === enums.ToolType.protractor ? 0 : acetateHeight,
            acetateWidth, rotatedAngle)) {
            // if the acetate is not fully visible in the given coordinates, then place at the mid of the page
            x = _imageDimension.imageWidth / 2;
            y = _imageDimension.imageHeight / 2;
        } else {
            [x, y] = OverlayHelper.getAdjustedXYBasedOnRotatedAngle(x, y, rotatedAngle,
                zoneWidth, zoneHeight, _imageDimension, linkingScenarioProps, imageProps);
        }
        return { x: x, y: y };
    }

    /**
     * to get viewport points for structured (includes stitched image viewer)
     * @param elementId
     * @param imageProps
     */
    private static getViewPortPointsStructured(elementId: string, imageProps: any, acetateType: enums.ToolType,
        linkingScenarioProps?: any) {
        let defaultDimension = OverlayHelper.getAcetateDefaultDimension(acetateType);
        let rotatedAngle = OverlayHelper.getRotatedAngle(imageProps.pageNo, imageProps.linkedOutputPageNo);
        // class="marksheet-holder " ex: elementId= outputpage_1
        let markSheetImageElement: any = htmlUtilities.getElementById(elementId);
        let annotationOverlayClientRect = markSheetImageElement.getElementsByClassName('annotation-overlay')[0].getBoundingClientRect();
        let viewHolderClientRect = OverlayHelper.getMarkSheetViewHolder().getBoundingClientRect();
        let markSheetContainer = OverlayHelper.getMarkSheetContainer();
        let imageContainer = htmlUtilities.getElementById('imagecontainer');
        let imgClientRect = null;
        let availableZonesInFracs: Array<any> = [];

        // finding number of zones inside particular outputpage
        let zones = markSheetImageElement.getElementsByClassName('marksheet-img');

        // looping to finding most visible zone
        for (let i = 0; i < zones.length; i++) {

            let zoneRect = zones[i].getBoundingClientRect();
            let imageContainerRect = OverlayHelper.getImageContainerRectBasedOnRotatedAngle(rotatedAngle, imageContainer);
            let imageContainerfracsRect = fracsHelper.fracsRect(imageContainerRect.left, imageContainerRect.top,
                imageContainerRect.width, imageContainerRect.height);
            let zonefracsRect = fracsHelper.fracsRect(zoneRect.left, zoneRect.top, zoneRect.width, zoneRect.height);

            // finding fracs for each zone w.r.t image container for calculating viewable portion
            let fracsData = fracsHelper.getFracsWithRespectToContainerByRect(zonefracsRect, imageContainerfracsRect);
            let clientRect = OverlayHelper.adjustClientRectBasedOnRotatedAngle(rotatedAngle, zoneRect, viewHolderClientRect);

            let zoneNatural = {
                imageHeight: OverlayHelper.getStitchedImageDimension(
                    imageProps.stitchedImageZones, imageProps.getImageNaturalDimension, i).height,
                imageWidth: OverlayHelper.getStitchedImageDimension(
                    imageProps.stitchedImageZones, imageProps.getImageNaturalDimension, i).width
            };

            // holding default size of acetate
            let acetateWidth: number = (defaultDimension.width / zoneNatural.imageWidth) * clientRect.width;
            let acetateHeight: number = (defaultDimension.height / zoneNatural.imageHeight) * clientRect.height;

            let obj = {
                visible: fracsData.visible,
                imgNo: i,
                clientHeight: clientRect.height,
                clientWidth: clientRect.width,
                isValid: ((clientRect.height > acetateHeight) && (clientRect.width > acetateWidth)) ? true : false,
                acetateWidth: acetateWidth,
                acetateHeight: acetateHeight,
                naturalWidth: zoneNatural.imageWidth,
                naturalHeight: zoneNatural.imageHeight,
                top: clientRect.top,
                left: clientRect.left
            };
            availableZonesInFracs.push(obj);
        }

        let container = OverlayHelper.getMarkSheetContainerClientValuesBasedOnRotatedAngle(rotatedAngle, markSheetContainer);
        let overlayRect = OverlayHelper.adjustClientRectBasedOnRotatedAngle(rotatedAngle,
            annotationOverlayClientRect, viewHolderClientRect);
        let y = 0; let x = 0;

        // sorting zones based on visibility
        let availableZones: Array<any> = availableZonesInFracs.sort(
            (a: any, b: any) => { return b.visible - a.visible; });

        // looping all the available zones and finding the valid visibile or valid invisible zones
        for (let i = 0; i < availableZones.length; i++) {
            let currentZone = availableZones[i];
            if (currentZone.isValid) {
                // get boundary to place acetate
                let [xStart, xEnd, yStart, yEnd] = OverlayHelper.getBoundaryToPlaceAcetateForStitchedImage(currentZone, container);
                // get the x,y position to place acetate against the stitched image w.r.t image natural dimension
                [x, y] = OverlayHelper.getXYToPlaceAcetateInStitchedImage(xStart, xEnd, yStart, yEnd,
                    overlayRect, currentZone, container, rotatedAngle, markSheetImageElement);
                if (linkingScenarioProps) {
                    y = y + linkingScenarioProps.topAboveCurrentZone;
                }
                return { x: x, y: y };
            }
        }

        return { x: x, y: y };
    }

    /**
     * Gets the total grey gap value of output page in pixel.
     * @param outputPageWidth
     * @param index
     */
    private static getGreyGapInPixel(outputPageWidth: number, index: number): number {
        let greyGap = (constants.GREY_GAP_PERCENT * outputPageWidth) / 100;
        return greyGap * index;
    }

    /**
     * To get default dimension based on acetate type
     * @param acetateType
     */
    public static getAcetateDefaultDimension(acetateType: enums.ToolType, doAddLineWithThreePoints: boolean = false) {
        let imageCentreCoordinates = {
            x: 0,
            y: 0
        };
        let defaultAcetatePoints: Array<AcetatePoint> = Array<AcetatePoint>();
        if (doAddLineWithThreePoints) {
            defaultAcetatePoints = OverlayHelper.getMultiLineWithThreePoints(imageCentreCoordinates);
        } else {
            defaultAcetatePoints = OverlayHelper.getAcetatePoints(acetateType, imageCentreCoordinates);
        }

        let defaultAcetatePointsXSort = JSON.parse(JSON.stringify(defaultAcetatePoints));
        let defaultAcetatePointsYSort = JSON.parse(JSON.stringify(defaultAcetatePoints));

        // sorting 'x' points desc
        let xPoints: Array<AcetatePoint> = defaultAcetatePointsXSort.sort(
            (a: any, b: any) => { return b.x - a.x; });

        // sorting 'y' points desc
        let yPoints: Array<AcetatePoint> = defaultAcetatePointsYSort.sort(
            (a: any, b: any) => { return b.y - a.y; });

        // finding the difference between first 'x' point(maximum value) and last point(minimum value)
        let x = xPoints[0].x - xPoints[xPoints.length - 1].x;

        // finding the difference between first 'y' point(maximum value) and last point(minimum value)
        let y = yPoints[0].y - yPoints[yPoints.length - 1].y;
        let defaultDimension = { width: x, height: y };
        return defaultDimension;
    }

    /**
     * Gets the visible page no.
     * @param visibleImageId
     */
    public static getVisiblePageNo(visibleImageId: string): number {
        let splittedImageId: string[] = visibleImageId.split('_');
        return Number(splittedImageId[1]);
    }

    /**
     *  Gets the natural height and width of the first zone for stitched images.
     * @param imageZones
     * @param getImageNaturalDimension
     */
    public static getStitchedImageDimension(imageZones: ImageZone[], getImageNaturalDimension: Function,
        index: number = 0): any {
        let scaledDimesnion = {
            height: imageZones[index].height,
            width: imageZones[index].width
        };
        let imageDimension = getImageNaturalDimension(imageZones[index].pageNo);
        let naturalDimension = {
            height: (scaledDimesnion.height * imageDimension.naturalHeight) / 100,
            width: (scaledDimesnion.width * imageDimension.naturalWidth) / 100
        };
        return naturalDimension;
    }

    /**
     * return image dimension
     * @param imageProps
     */
    public static getImageDimension(imageProps: any) {
        let imageDimension = { imageWidth: 0, imageHeight: 0 };
        if (imageProps.outputPageNo > 0) {
            imageDimension = { imageWidth: imageProps.outputPageWidth, imageHeight: imageProps.outputPageHeight };
        } else {
            imageDimension = { imageWidth: imageProps.naturalWidth, imageHeight: imageProps.naturalHeight };
        }

        return imageDimension;
    }

    /**
     * Returns parent element having a specific class
     * @param el
     * @param classname
     */
    public static findAncestor(el: any, className: string) {
        let element: Element = el;

        if (el !== null && el !== undefined && el.className !== undefined) {
            while (el !== null && el !== undefined && (el = (el.parentElement || el.parentNode))) {
                if (typeof el.className === 'string' && el.className.indexOf(className) >= 0) {
                    break;
                } else if (typeof el.className === 'object' && el.className.baseVal.indexOf(className) >= 0) {
                    break;
                } else {
                    continue;
                }
            }
        }

        if (el === null) {
            el = element ? element : el;
        }

        return el;
    }

    /**
     * return true if mouse pointer is in stitched grey gap
     * @param clientX
     * @param clientY
     * @param rotatedAngle
     * @param annotationOverlayElement
     */
    public static isInStitchedGap(clientX: number, clientY: number, rotatedAngle: number, annotationOverlayElement: any,
        overlayBoundary: Array<AnnotationBoundary>): boolean {
        if (annotationOverlayElement) {
            let overlayBoundary: Array<AnnotationBoundary> =
                annotationHelper.getStitchedImageBoundary(annotationOverlayElement, rotatedAngle);
            return !annotationHelper.isAnnotationInsideStitchedImage(overlayBoundary, rotatedAngle, clientX, clientY);
        }
        return false;
    }

    /**
     * return true if mouse pointer is inside stitched image boundary
     * @param dy
     * @param clientX
     * @param clientY
     * @param rotatedAngle
     * @param annotationOverlayElement
     */
    public static isOutsideStitchedImage(dy: number, clientX: number, clientY: number,
        rotatedAngle: number, annotationOverlayElement: any): boolean {
        if (annotationOverlayElement) {
            let overlayBoundary: Array<AnnotationBoundary> =
                annotationHelper.getStitchedImageBoundary(annotationOverlayElement, rotatedAngle);
            let stitchedImageIndex = OverlayHelper.getStitchedImageGapIndex(dy,
                rotatedAngle, annotationOverlayElement, overlayBoundary);
            let stitchedImage = overlayBoundary[stitchedImageIndex];
            if (stitchedImage) {
                if (rotatedAngle === 90 || rotatedAngle === 270) {
                    // check for x asix
                    if (clientX < stitchedImage.left || clientX > stitchedImage.left + stitchedImage.imageHeight) {
                        return false;
                    }

                    // check for y axis
                    if (clientY < stitchedImage.top || clientY > stitchedImage.top + stitchedImage.imageWidth) {
                        return false;
                    }
                } else {
                    // check for x asix
                    if (clientX < stitchedImage.left || clientX > stitchedImage.left + stitchedImage.imageWidth) {
                        return false;
                    }

                    // check for y axis
                    if (clientY < stitchedImage.top || clientY > stitchedImage.top + stitchedImage.imageHeight) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Gets the mouse pointers delta coordinates.
     * @param deltaX
     * @param deltaY
     * @param rotatedAngle
     */
    public static getMousePointerDeltaXY(deltaX: number, deltaY: number, rotatedAngle: number): [number, number] {
        let adjustedDeltaX = deltaX;
        let adjustedDeltaY = deltaY;
        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_90:
                adjustedDeltaX = deltaY;
                adjustedDeltaY = -deltaX;
                break;
            case enums.RotateAngle.Rotate_180:
                adjustedDeltaX = -deltaX;
                adjustedDeltaY = -deltaY;
                break;
            case enums.RotateAngle.Rotate_270:
                adjustedDeltaX = -deltaY;
                adjustedDeltaY = deltaX;
                break;
        }
        return [adjustedDeltaX, adjustedDeltaY];
    }

    /**
     * Returns the adjusted x and y of acetates w.r.t rotated angle.
     * @param x
     * @param y
     * @param rotatedAngle
     * @param zoneWidth
     * @param zoneHeight
     * @param imageDimension
     * @param linkingScenarioProps
     */
    public static getAdjustedXYBasedOnRotatedAngle(x: number, y: number, rotatedAngle: number, zoneWidth: number,
        zoneHeight: number, imageDimension: any, linkingScenarioProps?: any, imageProps?: any): [number, number] {
        let adjustedX = x;
        let adjustedY = y;
        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_90:
                adjustedX = y;
                adjustedY = zoneWidth - x;
                break;
            case enums.RotateAngle.Rotate_180:
                adjustedX = zoneWidth - x;
                adjustedY = zoneHeight - y;
                break;
            case enums.RotateAngle.Rotate_270:
                adjustedX = zoneHeight - y;
                adjustedY = x;
                break;
        }
        // Adjusting x and y position related to natural image dimension
        if (rotatedAngle === enums.RotateAngle.Rotate_0 || rotatedAngle === enums.RotateAngle.Rotate_180) {
            adjustedY = (adjustedY / zoneHeight) * imageDimension.imageHeight;
            adjustedX = (adjustedX / zoneWidth) * imageDimension.imageWidth;
            if (linkingScenarioProps && !this.isAcetatePlacedAgainstPage(imageProps.isALinkedPage)) {
                adjustedY = adjustedY + linkingScenarioProps.topAboveCurrentZone;
            }
        } else if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
            adjustedY = (adjustedY / zoneWidth) * imageDimension.imageHeight;
            adjustedX = (adjustedX / zoneHeight) * imageDimension.imageWidth;
        }
        return [adjustedX, adjustedY];
    }

    /**
     * Gets the mosue pointer client x,y coordinates.
     * @param actualX
     * @param actualY
     * @param rotatedAngle
     * @param currentOverlayHolderClientRect
     * @param currentAnnotationHolderElement
     * @param imageDimension
     */
    public static getMousePointerClientXY(actualX: number, actualY: number, rotatedAngle: number,
        currentOverlayHolderClientRect: ClientRectDOM, currentAnnotationHolderElement: Element, imageDimension: any): [number, number] {
        let dx = 0;
        let dy = 0;
        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_0:
                dx = ((actualX - currentOverlayHolderClientRect.left) / currentAnnotationHolderElement.clientWidth)
                    * imageDimension.imageWidth;
                dy = ((actualY - currentOverlayHolderClientRect.top) / currentAnnotationHolderElement.clientHeight)
                    * imageDimension.imageHeight;
                break;
            case enums.RotateAngle.Rotate_90:
                dx = ((actualY - currentOverlayHolderClientRect.top) / currentAnnotationHolderElement.clientWidth)
                    * imageDimension.imageWidth;
                dy = ((currentOverlayHolderClientRect.right - actualX) / currentAnnotationHolderElement.clientHeight)
                    * imageDimension.imageHeight;
                break;
            case enums.RotateAngle.Rotate_180:
                dx = ((currentOverlayHolderClientRect.right - actualX) / currentAnnotationHolderElement.clientWidth)
                    * imageDimension.imageWidth;
                dy = ((currentOverlayHolderClientRect.bottom - actualY) / currentAnnotationHolderElement.clientHeight)
                    * imageDimension.imageHeight;
                break;
            case enums.RotateAngle.Rotate_270:
                dx = ((currentOverlayHolderClientRect.bottom - actualY) / currentAnnotationHolderElement.clientWidth)
                    * imageDimension.imageWidth;
                dy = ((actualX - currentOverlayHolderClientRect.left) / currentAnnotationHolderElement.clientHeight)
                    * imageDimension.imageHeight;
                break;
        }
        return [dx, dy];
    }

    /**
     * check whether the acetate is inside the stitched image or not
     * @param overlayElementClientRect
     * @param annotationHolderRect
     * @param rotatedAngle
     * @param overlayBoundary
     */
    public static isInsideStichedImage(overlayElementClientRect: ClientRect, annotationHolderRect: ClientRect,
        rotatedAngle: number, overlayBoundary: Array<AnnotationBoundary>) {
        let isValid: boolean = false;
        if (overlayBoundary.length > 0) {
            if (overlayBoundary && overlayBoundary.length > 0) {
                var insideScript: boolean = false;
                let acetateBoundaryEnd = 0;
                let acetateBoundaryStart = 0;
                let acetateBoundaryLeft = 0;
                let acetateBoundaryRight = 0;

                // Apply the rotation values.
                switch (rotatedAngle) {
                    case enums.RotateAngle.Rotate_0:
                    case enums.RotateAngle.Rotate_360:
                    case enums.RotateAngle.Rotate_180:
                        acetateBoundaryStart =
                            overlayElementClientRect.top;
                        acetateBoundaryEnd = acetateBoundaryStart + overlayElementClientRect.height;
                        acetateBoundaryLeft = overlayElementClientRect.left;
                        acetateBoundaryRight = acetateBoundaryLeft + overlayElementClientRect.width;
                        break;
                    case enums.RotateAngle.Rotate_90:
                    case enums.RotateAngle.Rotate_270:
                        acetateBoundaryStart =
                            overlayElementClientRect.left;
                        acetateBoundaryEnd = acetateBoundaryStart + overlayElementClientRect.width;
                        acetateBoundaryLeft = overlayElementClientRect.top;
                        acetateBoundaryRight = acetateBoundaryLeft + overlayElementClientRect.height;
                        break;
                }

                // check the acetate position aganist each overlay boundaries
                for (var i = 0; i < overlayBoundary.length; i++) {
                    if (acetateBoundaryStart > overlayBoundary[i].start &&
                        acetateBoundaryStart < overlayBoundary[i].end &&
                        acetateBoundaryEnd > overlayBoundary[i].start &&
                        acetateBoundaryEnd < overlayBoundary[i].end &&
                        acetateBoundaryLeft > overlayBoundary[i].left &&
                        acetateBoundaryLeft < overlayBoundary[i].right &&
                        acetateBoundaryRight > overlayBoundary[i].left &&
                        acetateBoundaryRight < overlayBoundary[i].right) {
                        insideScript = true;
                    }
                }

                isValid = insideScript;
            }
        }
        return isValid;
    }

    /**
     * return stitched image offset for a point
     * @param point
     * @param rotatedAngle
     * @param annotationOverlayParentElement
     * @param stitchedImageIndex
     */
    public static findStitchedImageGapOffset(point: number, rotatedAngle: number,
        annotationOverlayParentElement: any, stitchedImageIndex: number = -1): number {
        let stitchedImageSeperator: number = 0;
        let overlayBoundary = annotationHelper.getStitchedImageBoundary(annotationOverlayParentElement, rotatedAngle);
        if (stitchedImageIndex === -1) {
            stitchedImageIndex = OverlayHelper.getStitchedImageGapIndex(point, rotatedAngle,
                annotationOverlayParentElement, overlayBoundary);
        }
        stitchedImageSeperator = annotationHelper.calculateStitchedImageGapOffset(rotatedAngle,
            stitchedImageIndex, overlayBoundary, annotationOverlayParentElement);
        return stitchedImageSeperator;
    }

    /**
     * return index of stitched image gap for a point
     * @param point
     * @param rotatedAngle
     * @param annotationOverlayParentElement
     * @param overlayBoundary
     */
    public static getStitchedImageGapIndex(point: number, rotatedAngle: number,
        annotationOverlayParentElement: any, overlayBoundary: AnnotationBoundary[]): number {
        let stitchedImageIndex: number = 0;
        if ((overlayBoundary && overlayBoundary.length > 0) && annotationOverlayParentElement) {
            let totalImageHeight: number = 0;
            for (let i = 0; i < overlayBoundary.length; ) {
                totalImageHeight += overlayBoundary[i].imageHeight;
                let currentPagePercentage = (totalImageHeight / annotationOverlayParentElement.clientHeight) * 100;
                if (point < currentPagePercentage) {
                    i = overlayBoundary.length;
                } else {
                    i++;
                    stitchedImageIndex++;
                }
            }
        }

        return stitchedImageIndex;
    }

    /**
     * find stitched image gap index based on current coordinate value
     * @param point
     * @param overlayBoundary
     */
    public static getStitchedImageGapIndexWithRespectToClientCoordinate(point: number,
        overlayBoundary: AnnotationBoundary[]): number {
        let stitchedImageIndex: number = 0;
        if (overlayBoundary && overlayBoundary.length > 0) {
            for (let i = 0; i < overlayBoundary.length; ) {
                if (point < overlayBoundary[i].end && point > overlayBoundary[i].start) {
                    i = overlayBoundary.length;
                } else {
                    i++;
                    stitchedImageIndex++;
                }
            }

        }

        return stitchedImageIndex;
    }

    /**
     * Gets the image zone boundary list of the stitched images.
     * @param {any} element
     * @param {number} angle
     */
    public static getStitchedImageBoundary(element: any, angle: number): Array<AnnotationBoundary> {
        var boundary: Array<AnnotationBoundary> = [];
        // If no valid boundary given return empty set.
        if (element === null || element === undefined) {
            return boundary;
        } else if (element.className.indexOf('annotation-overlay') > -1) {
            let markSheetWrapperElement: Element = element.parentElement;
            let imageZones = markSheetWrapperElement.children;
            for (let i = 0; i < imageZones.length; i++) {
                // From the children of marksheet-wrapper only image zones need to be considered, neglecting annotation-overlay
                if (imageZones[i] !== null && imageZones[i].className !== null &&
                    imageZones[i].className.indexOf('annotation-overlay') < 0 &&
                    imageZones[i].className.indexOf('marksheet-img stitched') > -1) {
                    // Computing the 3% margin in pixel to calculate the distance from top to the gray area.
                    let elem = imageZones[i].getBoundingClientRect();

                    let startEdge: number;
                    let endEdge: number;
                    let leftEdge: number;
                    let rightEdge: number;
                    if (angle === enums.RotateAngle.Rotate_90 || angle === enums.RotateAngle.Rotate_270) {
                        startEdge = elem.left;
                        endEdge = elem.right;
                        leftEdge = elem.top;
                        rightEdge = elem.bottom;

                    } else {
                        startEdge = elem.top;
                        endEdge = elem.bottom;
                        leftEdge = elem.left;
                        rightEdge = elem.right;
                    }
                    // Store the boundary.
                    boundary.push({
                        //start: seperator, end: nextImageZone.offsetTop,
                        start: startEdge, end: endEdge,
                        imageWidth: imageZones[i].clientWidth, imageHeight: imageZones[i].clientHeight,
                        top: elem.top, left: leftEdge, right: rightEdge
                    });
                }
            }
        }

        return boundary;
    }

    /**
     * return rotated angle for a page no
     * @param pageNo
     * @param outputPageNo
     */
    public static getRotatedAngle(pageNo: number, outputPageNo: number): number {
        let displayAngle = 0;
        let displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
        if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
            displayAngleCollection.map((angle: number, key: string) => {
                let str = key.split('_');
                if (str[0] + '_' + str[1] + '_' + str[2] === 'img_' + pageNo + '_' + outputPageNo) {
                    displayAngle = angle;
                }
            });
        }
        return annotationHelper.getAngleforRotation(displayAngle);
    }

    /**
     * Check whether acetate is inside annotation holder.
     * @param {ClientRectDOM} clientRectInPixels
     * @param {ClientRectDOM} annotationHolderRect
     * @returns
     */
    public static isAcetateInsideHolder = (clientRect: ClientRectDOM, annotationHolderRect: ClientRectDOM): boolean => {
        let clientRectInsideAnnotationHolder = true;
        if (clientRect.left <= annotationHolderRect.left ||
            clientRect.left + clientRect.width >= (annotationHolderRect.width + annotationHolderRect.left) ||
            clientRect.top <= annotationHolderRect.top ||
            clientRect.top + clientRect.height >= (annotationHolderRect.height + annotationHolderRect.top)) {
            clientRectInsideAnnotationHolder = false;
        }
        return clientRectInsideAnnotationHolder;
    };

    /**
     * gets the overlay boundaries in pixels
     * @param overlayBoundary
     * @param rotatedAngle
     * @param currentOverlayHolderClientRect
     * @param currentAnnotationHolderElement
     * @param imageDimension
     */
    public static getOverlayBoundaryInPixel(overlayBoundary: AnnotationBoundary[], rotatedAngle: number,
        currentOverlayHolderClientRect: ClientRectDOM, currentAnnotationHolderElement: Element,
        imageDimension: { imageWidth: number, imageHeight: number }): AnnotationBoundary[] {
        let overlayBoundaryInPixel: AnnotationBoundary[] = JSON.parse(JSON.stringify(overlayBoundary));
        for (let index = 0; index < overlayBoundary.length; index++) {
            switch (rotatedAngle) {
                case enums.RotateAngle.Rotate_0:
                case enums.RotateAngle.Rotate_180:
                case enums.RotateAngle.Rotate_360:
                    overlayBoundaryInPixel[index].start = ((overlayBoundaryInPixel[index].start) /
                        currentAnnotationHolderElement.clientHeight) * imageDimension.imageHeight;
                    overlayBoundaryInPixel[index].end = ((overlayBoundaryInPixel[index].end) /
                        currentAnnotationHolderElement.clientHeight) * imageDimension.imageHeight;
                    break;
                case enums.RotateAngle.Rotate_90:
                case enums.RotateAngle.Rotate_270:
                    overlayBoundaryInPixel[index].start = ((overlayBoundaryInPixel[index].start) /
                        currentAnnotationHolderElement.clientWidth) * imageDimension.imageWidth;
                    overlayBoundaryInPixel[index].end = ((overlayBoundaryInPixel[index].end) /
                        currentAnnotationHolderElement.clientWidth) * imageDimension.imageWidth;
                    break;
            }
        }
        return overlayBoundaryInPixel;
    }

    /**
     * gets the ruler points in a given coordinates
     * @param imageCentreCoordinates
     */
    private static getRulerPoints(imageCentreCoordinates: Point): Array<AcetatePoint> {
        let defaultAcetatePoints: Array<AcetatePoint> = Array<AcetatePoint>();

        // Ruler starting point.
        let point1: AcetatePoint = {
            x: imageCentreCoordinates.x - constants.RULER_LENGTH_OFFSET,
            y: imageCentreCoordinates.y
        };
        // Ruler end point.
        let point2: AcetatePoint = {
            x: imageCentreCoordinates.x + constants.RULER_LENGTH_OFFSET,
            y: imageCentreCoordinates.y
        };
        defaultAcetatePoints.push(point1);
        defaultAcetatePoints.push(point2);
        return defaultAcetatePoints;
    }

    /**
     * gets the multiline points in a given coordinates
     * @param imageCentreCoordinates
     */
    private static getMultiLinePoints(imageCentreCoordinates: Point): Array<AcetatePoint> {
        let defaultAcetatePoints: Array<AcetatePoint> = Array<AcetatePoint>();

        // Multiline point 1.
        var mp1: AcetatePoint = {
            x: imageCentreCoordinates.x - (1.5 * constants.MULTI_LINE_OFFSET_X),
            y: imageCentreCoordinates.y - constants.MULTI_LINE_OFFSET_Y
        };

        // Multiline point 2.
        var mp2: AcetatePoint = {
            x: imageCentreCoordinates.x - (0.5 * constants.MULTI_LINE_OFFSET_X),
            y: imageCentreCoordinates.y + constants.MULTI_LINE_OFFSET_Y
        };

        // Multiline point 3.
        var mp3: AcetatePoint = {
            x: imageCentreCoordinates.x + (0.5 * constants.MULTI_LINE_OFFSET_X),
            y: imageCentreCoordinates.y - constants.MULTI_LINE_OFFSET_Y
        };

        // Multiline point 4.
        var mp4: AcetatePoint = {
            x: imageCentreCoordinates.x + (1.5 * constants.MULTI_LINE_OFFSET_X),
            y: imageCentreCoordinates.y + constants.MULTI_LINE_OFFSET_Y
        };

        defaultAcetatePoints.push(mp1);
        defaultAcetatePoints.push(mp2);
        defaultAcetatePoints.push(mp3);
        defaultAcetatePoints.push(mp4);
        return defaultAcetatePoints;
    }

    /**
     * gets the multiline with 3 points in a given coordinates
     * @param imageCentreCoordinates
     */
    private static getMultiLineWithThreePoints(imageCentreCoordinates: Point): Array<AcetatePoint> {
        let defaultAcetatePoints: Array<AcetatePoint> = Array<AcetatePoint>();

        // Multiline point 1.
        let mp1: AcetatePoint = {
            x: imageCentreCoordinates.x,
            y: imageCentreCoordinates.y
        };

        // Multiline point 2.
        let mp2: AcetatePoint = {
            x: imageCentreCoordinates.x + (constants.MULTI_LINE_OFFSET_X),
            y: imageCentreCoordinates.y + (2 * constants.MULTI_LINE_OFFSET_Y)
        };

        // Multiline point 3.
        let mp3: AcetatePoint = {
            x: imageCentreCoordinates.x + (2 * constants.MULTI_LINE_OFFSET_X),
            y: imageCentreCoordinates.y
        };

        defaultAcetatePoints.push(mp1);
        defaultAcetatePoints.push(mp2);
        defaultAcetatePoints.push(mp3);
        return defaultAcetatePoints;
    }

    /**
     * gets protractor points in a given coordinates
     * @param imageCentreCoordinates
     * @param overlayBoundary
     * @param imageDimension
     */
    private static getProtractorPoints(imageCentreCoordinates: Point,
        overlayBoundary?: AnnotationBoundary[],
        imageDimension?: { imageWidth: number, imageHeight: number },
        props?: OverlayHolderProps): Array<AcetatePoint> {
        let defaultAcetatePoints: Array<AcetatePoint> = Array<AcetatePoint>();

        // Protractor starting point.
        let protractorPoint1: AcetatePoint = {
            x: imageCentreCoordinates.x - constants.PROTRACTOR_LENGTH_OFFSET,
            y: imageCentreCoordinates.y
        };
        // Protractor mid point.
        let protractorPoint2: AcetatePoint = {
            x: imageCentreCoordinates.x + constants.PROTRACTOR_LENGTH_OFFSET,
            y: imageCentreCoordinates.y
        };
        // Protractor end point.
        let protractorPoint3: AcetatePoint = {
            x: imageCentreCoordinates.x - constants.PROTRACTOR_LENGTH_OFFSET,
            y: imageCentreCoordinates.y - constants.PROTRACTOR_ANGLE_OFFSET
        };

        // If the Last point is above the page obtain a point such that the angle will be 50
        if (imageCentreCoordinates.y > 0 && protractorPoint3.y < 0) {
            /* adjust points with an offset value such that all points are inside the zone.
               the offset value is the total pixels of potractorPoint3's ycoordinate above the response
               Added a 2px to avoid border values
            */
            let adjustmentOffset = Math.abs(protractorPoint3.y) + 2;
            [protractorPoint1, protractorPoint2, protractorPoint3] =
                OverlayHelper.adjustProtractorPointsWithOffset([protractorPoint1, protractorPoint2, protractorPoint3], adjustmentOffset);
        }

        // reduce the grey gap area which is added while rendering             
        let gryaGapInPixel = overlayBoundary ? (overlayBoundary[1].start - overlayBoundary[0].end) : 0;
        if (gryaGapInPixel > 0) {
            [protractorPoint1, protractorPoint2, protractorPoint3] =
                OverlayHelper.checkAndAdjustProtractorPoints([protractorPoint1, protractorPoint2, protractorPoint3],
                    gryaGapInPixel, overlayBoundary, imageDimension, props.getAnnotationOverlayElement);
        }

        defaultAcetatePoints.push(protractorPoint1);
        defaultAcetatePoints.push(protractorPoint2);
        defaultAcetatePoints.push(protractorPoint3);

        return defaultAcetatePoints;
    }

    /**
     * return client rect based on rotated angle
     * @param rotatedAngle
     * @param elementClientRect
     * @param viewHolderClientRect
     */
    private static adjustClientRectBasedOnRotatedAngle(rotatedAngle: enums.RotateAngle,
        elementClientRect: ClientRectDOM, viewHolderClientRect: ClientRectDOM): ClientRectDOM {

        let clientRect: ClientRectDOM = {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0
        };

        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_0:
            case enums.RotateAngle.Rotate_360:
                clientRect.left = elementClientRect.left - viewHolderClientRect.left;
                clientRect.top = elementClientRect.top - viewHolderClientRect.top;
                clientRect.bottom = clientRect.top + elementClientRect.height;
                clientRect.height = elementClientRect.height;
                clientRect.width = elementClientRect.width;
                break;
            case enums.RotateAngle.Rotate_90:
                clientRect.left = viewHolderClientRect.top - elementClientRect.top;
                clientRect.top = viewHolderClientRect.right - elementClientRect.right;
                clientRect.bottom = clientRect.top + elementClientRect.width;
                clientRect.height = elementClientRect.width;
                clientRect.width = elementClientRect.height;
                break;
            case enums.RotateAngle.Rotate_180:
                clientRect.left = viewHolderClientRect.right - elementClientRect.right;
                clientRect.top = viewHolderClientRect.height -
                    (elementClientRect.bottom - viewHolderClientRect.top);
                clientRect.bottom = clientRect.top + elementClientRect.height;
                clientRect.height = elementClientRect.height;
                clientRect.width = elementClientRect.width;
                break;
            case enums.RotateAngle.Rotate_270:
                clientRect.left = viewHolderClientRect.height -
                    (elementClientRect.bottom - viewHolderClientRect.top);
                clientRect.top = elementClientRect.left - viewHolderClientRect.left;
                clientRect.bottom = clientRect.top + elementClientRect.width;
                clientRect.height = elementClientRect.width;
                clientRect.width = elementClientRect.height;
                break;
        }

        return clientRect;
    }

    /**
     * return markscheet container client value based on rotated angle
     * @param rotatedAngle
     * @param markSheetContainer
     */
    private static getMarkSheetContainerClientValuesBasedOnRotatedAngle(rotatedAngle: enums.RotateAngle,
        markSheetContainer: Element) {

        let clientValues = { scrollLeft: 0, scrollTop: 0, height: 0, width: 0 };
        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_0:
            case enums.RotateAngle.Rotate_360:
                clientValues.scrollTop = markSheetContainer.scrollTop;
                clientValues.scrollLeft = markSheetContainer.scrollLeft;
                break;
            case enums.RotateAngle.Rotate_90:
                clientValues.scrollTop = markSheetContainer.scrollWidth -
                    (markSheetContainer.scrollLeft + markSheetContainer.clientWidth);
                clientValues.scrollLeft = markSheetContainer.scrollTop;
                break;
            case enums.RotateAngle.Rotate_180:
                clientValues.scrollTop = markSheetContainer.scrollHeight -
                    (markSheetContainer.scrollTop + markSheetContainer.clientHeight);
                clientValues.scrollLeft = markSheetContainer.scrollWidth -
                    (markSheetContainer.scrollLeft + markSheetContainer.clientWidth);
                break;
            case enums.RotateAngle.Rotate_270:
                clientValues.scrollLeft = markSheetContainer.scrollHeight -
                    (markSheetContainer.scrollTop + markSheetContainer.clientHeight);
                clientValues.scrollTop = markSheetContainer.scrollLeft;
                break;
        }

        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_90:
            case enums.RotateAngle.Rotate_270:
                clientValues.height = markSheetContainer.clientWidth;
                clientValues.width = markSheetContainer.clientHeight;
                break;
            default:
                clientValues.height = markSheetContainer.clientHeight;
                clientValues.width = markSheetContainer.clientWidth;
                break;
        }

        return clientValues;
    }

    /**
     * return image container client rect based on rotated angle
     * @param rotatedAngle
     * @param imageContainer
     */
    private static getImageContainerRectBasedOnRotatedAngle(rotatedAngle: enums.RotateAngle, imageContainer: Element) {
        let clientRect: ClientRectDOM = {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0
        };

        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_90:
                let toolBarPanel = htmlUtilities.getElementById('toolPanelId').getBoundingClientRect();
                let imageContainerRect = imageContainer.getBoundingClientRect();

                clientRect.bottom = imageContainerRect.bottom;
                clientRect.height = imageContainerRect.height;
                clientRect.left = imageContainerRect.left;
                clientRect.right = imageContainerRect.right + toolBarPanel.width;
                clientRect.top = imageContainerRect.top;
                clientRect.width = imageContainerRect.width;
                break;
            default:
                clientRect = imageContainer.getBoundingClientRect();
                break;
        }

        return clientRect;
    }

    /**
     * return boundary to place acetate
     * @param currentZone
     * @param container
     */
    private static getBoundaryToPlaceAcetateForStitchedImage(currentZone: any, container: any) {
        let yStart = 0; let yEnd = 0;
        let xStart = 0; let xEnd = 0;

        // checks whether y startpoint is from the TOP or MIDDLE of particular zone
        if (currentZone.top > container.scrollTop) {
            yStart = currentZone.top;
        } else {
            yStart = container.scrollTop;
        }

        // checks whether y endpoint is from the TOP or MIDDLE of particular zone
        if ((currentZone.top + currentZone.clientHeight) < (container.scrollTop + container.height)) {
            yEnd = currentZone.top + currentZone.clientHeight;
        } else {
            yEnd = container.scrollTop + container.height;
        }

        // checks whether x startpoint is from the TOP or MIDDLE of particular zone
        if (currentZone.left > container.scrollLeft) {
            xStart = currentZone.left;
        } else {
            xStart = container.scrollLeft;
        }

        // checks whether x endpoint is from the TOP or MIDDLE of particular zone
        if ((currentZone.left + currentZone.clientWidth) < (container.scrollLeft + container.width)) {
            xEnd = currentZone.left + currentZone.clientWidth;
        } else {
            xEnd = container.scrollLeft + container.width;
        }

        return [xStart, xEnd, yStart, yEnd];
    }

    /**
     * return xy position to place acetate w.r.t image natural dimension
     * @param xStart
     * @param xEnd
     * @param yStart
     * @param yEnd
     * @param overlayRect
     * @param zoneRect
     * @param imageContainerRect
     * @param rotatedAngle
     * @param markSheetImageElement
     */
    private static getXYToPlaceAcetateInStitchedImage(xStart: number, xEnd: number, yStart: number, yEnd: number,
        overlayRect: any, currentZone: any, imageContainerRect: any, rotatedAngle: number, markSheetImageElement: Element) {
        let x = 0; let y = 0;
        // holds viewable startpoint and endpoint
        let viewableHeight: number = yEnd - yStart;
        let viewableWidth: number = xEnd - xStart;

        // if the viewable part of zone has enough space to place the acetate it returns true
        let isValidViewableAreaToPlace: boolean = (viewableHeight > currentZone.acetateHeight) &&
            (viewableWidth > currentZone.acetateWidth) ? true : false;

        // if the full part of zone has enough space to place the acetate it returns true
        let isValidZoneToPlace: boolean = (currentZone.clientHeight > currentZone.acetateHeight) &&
            (currentZone.clientWidth > currentZone.acetateWidth);
        if (isValidViewableAreaToPlace) {
            y = (yEnd - yStart) / 2;
            x = (xEnd - xStart) / 2;

            if (imageContainerRect.scrollTop > currentZone.top) {
                y = imageContainerRect.scrollTop - currentZone.top + y;
            }

            if (imageContainerRect.scrollLeft > currentZone.left) {
                x = imageContainerRect.scrollLeft - currentZone.left + x;
            }
        } else if (isValidZoneToPlace) {

            // if it is valid zone then the startpoint and endpoint is calculated based on full zone (includes invisible area)
            yStart = currentZone.top;
            yEnd = currentZone.top + currentZone.clientHeight;

            xStart = currentZone.left;
            xEnd = currentZone.left + currentZone.clientWidth;

            y = (yEnd - yStart) / 2;
            x = (xEnd - xStart) / 2;
        } else {
            return [0, 0];
        }

        // getting top value relative to overlay
        let zoneTopOverlay = (currentZone.top - overlayRect.top);
        y = y + zoneTopOverlay;

        let gapOffSet = 0;
        if (annotationHelper.IsOddangle(rotatedAngle)) {
            gapOffSet = markSheetImageElement.clientHeight;
        } else {
            gapOffSet = markSheetImageElement.clientWidth;
        }
        // reduce the grey gap area which is added while rendering 
        y = y - OverlayHelper.getGreyGapInPixel(gapOffSet, currentZone.imgNo);

        // x and y position related to natural image dimension
        y = Math.abs((y / currentZone.clientHeight) * currentZone.naturalHeight);
        x = Math.abs((x / currentZone.clientWidth) * currentZone.naturalWidth);

        return [x, y];
    }

    /**
     * return marksheet container element
     */
    public static getMarkSheetContainer(): Element {
        return htmlUtilities.getElementsByClassName('marksheet-container')[0];
    }

    /**
     * get the overlayboundary w.r.t rotated angle
     * @param rotatedAngle
     * @param elementId
     * @param annotationOverlayHolderClientRect
     */
    public static getZonesClientRectBasedOnRotatedAngle(rotatedAngle: number, elementId: string,
        annotationOverlayHolderClientRect: ClientRect) {
        let markSheetImageElement: Element = htmlUtilities.getElementById(elementId);
        // finding number of zones inside particular outputpage
        let zones = markSheetImageElement.getElementsByClassName('marksheet-img');
        let zoneBoundary: Array<AnnotationBoundary> = [];

        for (let i = 0; i < zones.length; i++) {

            let zoneRect = zones[i].getBoundingClientRect();
            let clientRect = OverlayHelper.adjustClientRectBasedOnRotatedAngle(rotatedAngle, zoneRect, annotationOverlayHolderClientRect);
            // Store the boundary.
            zoneBoundary.push({
                start: clientRect.top, end: clientRect.bottom,
                imageWidth: zones[i].clientWidth, imageHeight: zones[i].clientHeight
            });
        }
        return zoneBoundary;
    }

    /**
     * adjust the points of protractor with an offset value
     * @param points
     * @param offset
     */
    private static adjustProtractorPointsWithOffset(points: Point[], offset: number) {
        for (let index: number = 0; index < points.length; index++) {
            points[index].y += offset;
        }
        return points;
    }

    /**
     * check and adjust the protractor if it is between two stitched imgaes
     * @param protractorPoints
     * @param gryaGapInPixel
     * @param overlayBoundary
     * @param imageDimension
     * @param annotationOverlayElement
     */
    private static checkAndAdjustProtractorPoints(protractorPoints: Point[],
        gryaGapInPixel: number, overlayBoundary: Array<AnnotationBoundary>,
        imageDimension: { imageWidth: number, imageHeight: number }, annotationOverlayElement: Element) {

        // stitched image gap index of mid and third points
        let potractorPoint2CurrentStitchedImageGapIndex = overlayBoundary ? OverlayHelper.getStitchedImageGapIndex(
            OverlayHelper.findPercentage(protractorPoints[1].y, imageDimension.imageHeight),
            0, annotationOverlayElement,
            overlayBoundary) : 0;

        let potractorPoint3CurrentStitchedImageGapIndex = overlayBoundary ? OverlayHelper.getStitchedImageGapIndex(
            OverlayHelper.findPercentage(protractorPoints[2].y, imageDimension.imageHeight),
            0, annotationOverlayElement,
            overlayBoundary) : 0;

        // stitched image index of mid point, 
        // potractorPoint2CurrentStitchedImageGapIndex * gryaGapInPixel is the total graygap in pixel till mid point
        let potractorPoint2StitchedImageIndex = OverlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate(
            protractorPoints[1].y + potractorPoint2CurrentStitchedImageGapIndex * gryaGapInPixel,
            overlayBoundary);

        // stitched gap index of third point, 
        // potractorPoint3CurrentStitchedImageGapIndex * gryaGapInPixel is the total graygap in pixel till third point
        let potractorPoint3StitchedImageIndex = OverlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate(
            protractorPoints[2].y + potractorPoint3CurrentStitchedImageGapIndex * gryaGapInPixel,
            overlayBoundary);

        // if the stitched gap index of mid and thrid points are differenet,
        // means trying to draw a protractor between two stitched imgaes
        if (potractorPoint2StitchedImageIndex !== potractorPoint3StitchedImageIndex) {
            /* adjust all points with an offset in pixel, the offset value is the difference between
               end point of potractorPoint2's previous overlay and potractorPoint3's ycoordinate.
               deduct a total graygap of potractorPoint2, because these graygap are not considering while calculating the
               point. Graygap adjustment is handling on render
               Added a 2px to avoid border values
            */
            let adjustmentOffset = Math.abs((overlayBoundary[potractorPoint2StitchedImageIndex - 1].end - protractorPoints[2].y) -
                (potractorPoint2StitchedImageIndex - 1) * gryaGapInPixel) + 2;
            [protractorPoints[0], protractorPoints[1], protractorPoints[2]] =
                OverlayHelper.adjustProtractorPointsWithOffset([protractorPoints[0],
                protractorPoints[1], protractorPoints[2]], adjustmentOffset);
        }
        return protractorPoints;
    }

    /**
     * return marksheet view holder element
     */
    public static getMarkSheetViewHolder(): Element {
        return htmlUtilities.getElementsByClassName('marksheet-view-holder')[0];
    }

    /**
     * return acetate context menu data.
     */
    public static getAcetateContextMenuData(clientToken: string, toolType: enums.ToolType): acetateContextMenuData {
        let data: acetateContextMenuData;
        data = new acetateContextMenuData;
        data.acetateToolType = toolType;
        data.clientToken = clientToken;
        data.contextMenuType = enums.ContextMenuType.acetate;
        return data;
    }

    /**
     * Checks if the acettae is to be placed against the page.
     * @param isALinkedPage
     */
    private static isAcetatePlacedAgainstPage(isALinkedPage: boolean): boolean {
        return responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured ||
            responseHelper.isAtypicalResponse() || isALinkedPage;
    }

    /**
     * check whether the coordinates are valid to place the acetate
     * @param x
     * @param y
     * @param imgClientRect
     * @param acetateHeight
     * @param acetateWidth
     * @param rotatedAngle
     */
    private static isInValidCoordinatesToPlaceInViewableArea(x: number, y: number,
        imgClientRect: any, acetateHeight: number, acetateWidth: number, rotatedAngle: number) {
        /* check whether possible to draw the acetate fully inside the viewable area in the given coordinate
           by checking the possible height, width, left and top values of acetate with image */
        if ((rotatedAngle / 90) % 2 === 1) {
        // case when rotate angle is 90 or 270
            return ((acetateWidth / 2 + y > imgClientRect.height) ||
                (acetateHeight / 2 + x > imgClientRect.width) ||
                (x - acetateHeight / 2 < 0) ||
                (y - acetateWidth / 2 < 0));
        } else {
        // case when rotate angle is 0 or 180
            return ((acetateHeight / 2 + y > imgClientRect.height) ||
                (acetateWidth / 2 + x > imgClientRect.width) ||
                (x - acetateWidth / 2 < 0) ||
                (y - acetateHeight / 2 < 0));
        }
    }
}

export = OverlayHelper;