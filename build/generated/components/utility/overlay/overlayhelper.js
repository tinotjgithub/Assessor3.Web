"use strict";
var enums = require('../enums');
var Immutable = require('immutable');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var acetatesActionCreator = require('../../../actions/acetates/acetatesactioncreator');
var constants = require('../constants');
var annotationHelper = require('../annotation/annotationhelper');
var responseStore = require('../../../stores/response/responsestore');
var responseHelper = require('../responsehelper/responsehelper');
var fracsHelper = require('../../../utility/generic/fracshelper');
var acetateContextMenuData = require('../contextmenu/acetatecontextmenudata');
var OverlayHelper = (function () {
    function OverlayHelper() {
    }
    /**
     * return acetates for skipped zones
     * @param acetatesList
     * @param itemId
     * @param imageProps
     * @param linkingScenarioProps
     */
    OverlayHelper.getAcetatesForSkippedZones = function (acetatesList, itemId, imageProps, linkingScenarioProps) {
        // skipped zones are zones which wont come for render while liniking, for eg : consider having 2 zones of 
        // same page in same output page. when this is linked to the same page, then first zone will come for render
        // and will be shown in full. as the page is already displayed there is no need for second zone to render. 
        // but acetates in these zones need to be shown in correct position in linked page.
        var skippedZones = linkingScenarioProps.skippedZones;
        var currentZones = imageProps.currentImageZones;
        var acetatesAgainstSkippedZones = Immutable.List();
        if (skippedZones && skippedZones.count() > 0 && currentZones && acetatesList) {
            skippedZones.map(function (skippedZone) {
                // get all the zones above a skipped zone. this is needed as y position for acetate is calculated
                // w.r.t the height of output page and now its linked and is splitted. so need we need to consider 
                // height of zones above the current zone inorder to calculate the y value from the current zone.
                var zonesAboveSkippedZone = currentZones.filter(function (item) { return item.sequence < skippedZone.sequence
                    && item.outputPageNo === skippedZone.outputPageNo; }).toList();
                if (imageProps.getHeightOfZones && zonesAboveSkippedZone.count() >= 0 && acetatesList) {
                    var skippedImageNaturalDimension = imageProps.getImageNaturalDimension(skippedZone.pageNo);
                    var skippedZoneTop_1 = OverlayHelper.convertPercentageToPixel(skippedImageNaturalDimension.naturalHeight, skippedZone.topEdge);
                    var skippedZoneLeft_1 = OverlayHelper.convertPercentageToPixel(skippedImageNaturalDimension.naturalWidth, skippedZone.leftEdge);
                    var skippedZoneHeight_1 = OverlayHelper.convertPercentageToPixel(skippedImageNaturalDimension.naturalHeight, skippedZone.height);
                    var heightOfZonesAboveSkippedZone_1 = imageProps.getHeightOfZones(zonesAboveSkippedZone);
                    acetatesList.map(function (acetate) {
                        var p1 = OverlayHelper.findAcetateFirstPoint(acetate.acetateData);
                        if (acetate.acetateData.outputPageNumber === skippedZone.outputPageNo &&
                            acetate.itemId === itemId &&
                            p1.y >= heightOfZonesAboveSkippedZone_1 &&
                            p1.y <= heightOfZonesAboveSkippedZone_1 + skippedZoneHeight_1) {
                            // add the zone left and top values as these zones wont come for render.
                            // heightOfZonesAboveSkippedZone is the total height of all the zones above 
                            // current skipped zone within the output page.
                            var imageLinkingData = {
                                topAboveZone: heightOfZonesAboveSkippedZone_1,
                                skippedZoneTop: skippedZoneTop_1,
                                skippedZoneLeft: skippedZoneLeft_1
                            };
                            acetate.imageLinkingData = imageLinkingData;
                            acetatesAgainstSkippedZones = acetatesAgainstSkippedZones.push(acetate);
                        }
                    });
                }
            });
        }
        return acetatesAgainstSkippedZones;
    };
    /**
     * get first point from acetate data based on y value from points
     * @param acetateData
     */
    OverlayHelper.findAcetateFirstPoint = function (acetateData) {
        var acetateLines = acetateData.acetateLines;
        var firstPoint;
        acetateLines.map(function (line) {
            var acetatePoints = line.points;
            firstPoint = acetatePoints[0];
            acetatePoints.map(function (point) {
                if (point.y < firstPoint.y) {
                    firstPoint = point;
                }
            });
        });
        return firstPoint;
    };
    /**
     * find percentage
     * @param numerator
     * @param denominator
     */
    OverlayHelper.findPercentage = function (numerator, denominator) {
        return (numerator / denominator) * 100;
    };
    /**
     * find the percentage
     * @param numerator
     * @param denominator
     */
    OverlayHelper.convertPercentageToPixel = function (numerator, denominator) {
        return (numerator * (denominator / 100));
    };
    /**
     * return all the acetates for current page or zone
     * @param acetatesList
     * @param itemId
     * @param doApplyLinkingScenarios
     * @param imageProps
     * @param linkingScenarioProps
     */
    OverlayHelper.getAcetesForCurrentPageOrZone = function (acetatesList, itemId, doApplyLinkingScenarios, imageProps, linkingScenarioProps) {
        var acetatesToRender = null;
        var acetatesAgainstCurrentQuestion = null;
        if (acetatesList) {
            if (doApplyLinkingScenarios) {
                // for structured linking secnarios
                if (imageProps.isALinkedPage) {
                    // get acetates from additional pages
                    if (imageProps.currentImageZone) {
                        // zoned page (linked)
                        acetatesAgainstCurrentQuestion = OverlayHelper.getAcetatesInLinkingScenario(acetatesList, itemId, linkingScenarioProps.zoneHeight, linkingScenarioProps.topAboveCurrentZone, imageProps.outputPageNo);
                    }
                    // acetates aganist linked pages
                    var acetatesAgainstCurrentQuestionInLinkedPage = this.getAcetatesAgainstPageNo(acetatesList, itemId, imageProps.pageNo);
                    // concat the result into single collection
                    if (acetatesAgainstCurrentQuestion) {
                        acetatesAgainstCurrentQuestion = acetatesAgainstCurrentQuestion.concat(acetatesAgainstCurrentQuestionInLinkedPage);
                    }
                    else {
                        acetatesAgainstCurrentQuestion = acetatesAgainstCurrentQuestionInLinkedPage;
                    }
                }
                else {
                    acetatesAgainstCurrentQuestion = OverlayHelper.getAcetatesInLinkingScenario(acetatesList, itemId, linkingScenarioProps.zoneHeight, linkingScenarioProps.topAboveCurrentZone, imageProps.outputPageNo);
                }
            }
            else if (imageProps.outputPageNo > 0) {
                // for normal structured
                acetatesAgainstCurrentQuestion = this.getAcetatesAgainstOutputPageNo(acetatesList, itemId, imageProps.outputPageNo);
            }
            else {
                // for unstructured
                acetatesAgainstCurrentQuestion = this.getAcetatesAgainstPageNo(acetatesList, itemId, imageProps.pageNo);
            }
        }
        return acetatesAgainstCurrentQuestion;
    };
    /**
     * return acetates against a page no
     * @param acetatesList
     * @param itemId
     * @param pageNo
     */
    OverlayHelper.getAcetatesAgainstPageNo = function (acetatesList, itemId, pageNo) {
        return acetatesList.filter(function (item) { return item.acetateData.wholePageNumber === pageNo && item.itemId === itemId; });
    };
    /**
     * return acetates against output page no
     * @param acetatesList
     * @param itemId
     * @param outputPageNo
     */
    OverlayHelper.getAcetatesAgainstOutputPageNo = function (acetatesList, itemId, outputPageNo) {
        return acetatesList.filter(function (item) { return item.acetateData.outputPageNumber === outputPageNo && item.itemId === itemId; });
    };
    /**
     * return acetates in linking scenario
     * @param acetatesList
     * @param itemId
     * @param zoneHeight
     * @param topAboveCurrentZone
     * @param outputPageNo
     */
    OverlayHelper.getAcetatesInLinkingScenario = function (acetatesList, itemId, zoneHeight, topAboveCurrentZone, outputPageNo) {
        var acetatesAgainstCurrentQuestion = null;
        acetatesAgainstCurrentQuestion = acetatesList.filter(function (item) {
            // we only need to check the first point as in linking we will be showing the
            // acetate in the page from which the acetate started drawing
            var p1 = OverlayHelper.findAcetateFirstPoint(item.acetateData);
            if (item.acetateData.outputPageNumber === outputPageNo &&
                item.itemId === itemId &&
                p1.y >= topAboveCurrentZone &&
                p1.y <= topAboveCurrentZone + zoneHeight) {
                return true;
            }
        });
        return acetatesAgainstCurrentQuestion;
    };
    /**
     * Gets the tool type of the overlay
     * @param overlayName
     */
    OverlayHelper.getOverlayToolType = function (overlayName) {
        var toolType = enums.ToolType.ruler;
        if (overlayName.indexOf('ruler') === 0) {
            toolType = enums.ToolType.ruler;
        }
        else if (overlayName.indexOf('protractor') === 0) {
            toolType = enums.ToolType.protractor;
        }
        else if (overlayName.indexOf('multiline') === 0) {
            toolType = enums.ToolType.multiline;
        }
        return toolType;
    };
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
    OverlayHelper.addAcetate = function (acetateType, examinerRoleId, itemId, props, elementId, overlayBoundary, imageDimension) {
        var acetateToAdd = OverlayHelper.getDefaultAcetate(acetateType, examinerRoleId, itemId, props, elementId, overlayBoundary, imageDimension, props.linkingScenarioProps);
        acetatesActionCreator.addOrUpdateAcetate(acetateToAdd, enums.MarkingOperation.added);
    };
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
    OverlayHelper.getDefaultAcetate = function (acetateType, examinerRoleId, itemId, props, elementId, overlayBoundary, imageDimension, linkingScenarioProps) {
        var defaultAcetateToAdd = {
            acetateData: OverlayHelper.getDefaultAcetateData(acetateType, props, elementId, overlayBoundary, imageDimension, linkingScenarioProps),
            examinerRoleId: examinerRoleId,
            itemId: itemId,
            shared: false,
            clientToken: htmlUtilities.guid,
            markingOperation: enums.MarkingOperation.added,
            isSaveInProgress: false,
            updateOn: Date.now()
        };
        return defaultAcetateToAdd;
    };
    /**
     * Gets the dfault acetate data.
     * @param acetateType
     * @param props
     * @param elementId
     * @param overlayBoundary
     * @param imageDimension
     * @param linkingScenarioProps
     */
    OverlayHelper.getDefaultAcetateData = function (acetateType, props, elementId, overlayBoundary, imageDimension, linkingScenarioProps) {
        var outputPageNumber = 0;
        var wholePageNumber = 0;
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured && !props.imageProps.isALinkedPage) {
            outputPageNumber = props.imageProps.outputPageNo;
        }
        if (this.isAcetatePlacedAgainstPage(props.imageProps.isALinkedPage)) {
            wholePageNumber = props.imageProps.pageNo;
        }
        var defaultAcetateData = {
            toolType: acetateType,
            backColour: constants.RULER_BACK_COLOR,
            shadeBackGround: 'False',
            outputPageNumber: outputPageNumber,
            wholePageNumber: wholePageNumber,
            acetateLines: OverlayHelper.getDefaultAcetateLines(acetateType, props, elementId, overlayBoundary, imageDimension, linkingScenarioProps)
        };
        return defaultAcetateData;
    };
    /**
     * Gets the dfault acetate lines.
     * @param acetateType
     * @param props
     * @param elementId
     * @param overlayBoundary
     * @param imageDimension
     * @param linkingScenarioProps
     */
    OverlayHelper.getDefaultAcetateLines = function (acetateType, props, elementId, overlayBoundary, imageDimension, linkingScenarioProps) {
        var defaultAcetateLines = new Array();
        var acetateLine;
        var viewPoints = OverlayHelper.getViewPortPoints(elementId, props.imageProps, acetateType, linkingScenarioProps);
        // Centre coordinates for the image.
        var imageCentreCoordinates = {
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
    };
    /**
     * get the acetate point based on image centre coordinates
     * @param acetateType
     * @param imageCentreCoordinates
     * @param overlayBoundary
     * @param imageDimension
     * @param doAddLineWithThreePoints
     */
    OverlayHelper.getAcetatePoints = function (acetateType, imageCentreCoordinates, overlayBoundary, imageDimension, doAddLineWithThreePoints, props) {
        var defaultAcetatePoints = Array();
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
                }
                else {
                    defaultAcetatePoints = OverlayHelper.getMultiLinePoints(imageCentreCoordinates);
                }
                break;
        }
        return defaultAcetatePoints;
    };
    /**
     * to get viewport points to place overlays
     * @param elementId
     * @param imageProps
     * @param acetateType
     * @param linkingScenarioProps
     */
    OverlayHelper.getViewPortPoints = function (elementId, imageProps, acetateType, linkingScenarioProps) {
        var isStructured = imageProps.outputPageNo > 0 ? true : false;
        var hasMultipleZones = (imageProps && imageProps.stitchedImageZones &&
            imageProps.stitchedImageZones.length > 0) ? true : false;
        if (isStructured && hasMultipleZones) {
            return OverlayHelper.getViewPortPointsStructured(elementId, imageProps, acetateType, linkingScenarioProps);
        }
        else {
            return OverlayHelper.getViewPortPointsUnstructured(elementId, imageProps, acetateType, linkingScenarioProps);
        }
    };
    /**
     * to get viewport points for unstructured (includes structured single image viewer)
     * @param elementId
     * @param imageProps
     * @param acetateType
     * @param linkingScenarioProps
     */
    OverlayHelper.getViewPortPointsUnstructured = function (elementId, imageProps, acetateType, linkingScenarioProps) {
        var _imageDimension;
        // class="marksheet-holder "
        var markSheetImageElement = htmlUtilities.getElementById(elementId);
        var viewHolderClientRect = OverlayHelper.getMarkSheetViewHolder().getBoundingClientRect();
        var markSheetContainer = OverlayHelper.getMarkSheetContainer();
        // class="marksheet-img"
        var imgClientRect = null;
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
        var scrollTop = markSheetContainer.scrollTop;
        var scrollLeft = markSheetContainer.scrollLeft;
        var containerHeight = markSheetContainer.offsetHeight;
        var containerWidth = markSheetContainer.clientWidth;
        var defaultDimension = OverlayHelper.getAcetateDefaultDimension(acetateType);
        var rotatedImageClientRectHeight;
        var rotatedImageClientRectWidth;
        var rotatedAngle = OverlayHelper.getRotatedAngle(imageProps.pageNo, imageProps.linkedOutputPageNo);
        // set image client rects based on rotated angle
        if ((rotatedAngle / 90) % 2 === 1) {
            rotatedImageClientRectHeight = imgClientRect.width;
            rotatedImageClientRectWidth = imgClientRect.height;
        }
        else {
            rotatedImageClientRectHeight = imgClientRect.height;
            rotatedImageClientRectWidth = imgClientRect.width;
        }
        // holding default size of acetate
        var acetateWidth = (defaultDimension.width / _imageDimension.imageWidth) * rotatedImageClientRectWidth;
        var acetateHeight = (defaultDimension.height / _imageDimension.imageHeight) * rotatedImageClientRectHeight;
        // if the viewable part of zone has enough space to place the acetate it returns true
        var isValidViewableAreaToPlace = (rotatedImageClientRectHeight > acetateHeight) &&
            (rotatedImageClientRectWidth > acetateWidth) ? true : false;
        if (!isValidViewableAreaToPlace) {
            return { x: 0, y: 0 };
        }
        var imgTop = imgClientRect.top;
        var imgLeft = imgClientRect.left;
        var viewHolderTop = viewHolderClientRect.top;
        var viewHolderLeft = viewHolderClientRect.left;
        var zoneHeight = imgClientRect.height;
        var zoneWidth = imgClientRect.width;
        var zoneTopViewHolder = imgTop - viewHolderTop;
        var zoneLeftViewHolder = imgLeft - viewHolderLeft;
        var ystartPoint = 0;
        var yendPoint = 0;
        var xstartPoint = 0;
        var xendPoint = 0;
        var y = 0;
        var x = 0;
        if (zoneTopViewHolder > scrollTop) {
            ystartPoint = zoneTopViewHolder;
        }
        else {
            ystartPoint = scrollTop;
        }
        if ((zoneTopViewHolder + zoneHeight) < (scrollTop + containerHeight)) {
            yendPoint = zoneTopViewHolder + zoneHeight;
        }
        else {
            yendPoint = scrollTop + containerHeight;
        }
        if (zoneLeftViewHolder > scrollLeft) {
            xstartPoint = zoneLeftViewHolder;
        }
        else {
            xstartPoint = scrollLeft;
        }
        if ((zoneLeftViewHolder + zoneWidth) < (scrollLeft + containerWidth)) {
            xendPoint = zoneLeftViewHolder + zoneWidth;
        }
        else {
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
        acetateType === enums.ToolType.protractor ? 0 : acetateHeight, acetateWidth, rotatedAngle)) {
            // if the acetate is not fully visible in the given coordinates, then place at the mid of the page
            x = _imageDimension.imageWidth / 2;
            y = _imageDimension.imageHeight / 2;
        }
        else {
            _a = OverlayHelper.getAdjustedXYBasedOnRotatedAngle(x, y, rotatedAngle, zoneWidth, zoneHeight, _imageDimension, linkingScenarioProps, imageProps), x = _a[0], y = _a[1];
        }
        return { x: x, y: y };
        var _a;
    };
    /**
     * to get viewport points for structured (includes stitched image viewer)
     * @param elementId
     * @param imageProps
     */
    OverlayHelper.getViewPortPointsStructured = function (elementId, imageProps, acetateType, linkingScenarioProps) {
        var defaultDimension = OverlayHelper.getAcetateDefaultDimension(acetateType);
        var rotatedAngle = OverlayHelper.getRotatedAngle(imageProps.pageNo, imageProps.linkedOutputPageNo);
        // class="marksheet-holder " ex: elementId= outputpage_1
        var markSheetImageElement = htmlUtilities.getElementById(elementId);
        var annotationOverlayClientRect = markSheetImageElement.getElementsByClassName('annotation-overlay')[0].getBoundingClientRect();
        var viewHolderClientRect = OverlayHelper.getMarkSheetViewHolder().getBoundingClientRect();
        var markSheetContainer = OverlayHelper.getMarkSheetContainer();
        var imageContainer = htmlUtilities.getElementById('imagecontainer');
        var imgClientRect = null;
        var availableZonesInFracs = [];
        // finding number of zones inside particular outputpage
        var zones = markSheetImageElement.getElementsByClassName('marksheet-img');
        // looping to finding most visible zone
        for (var i = 0; i < zones.length; i++) {
            var zoneRect = zones[i].getBoundingClientRect();
            var imageContainerRect = OverlayHelper.getImageContainerRectBasedOnRotatedAngle(rotatedAngle, imageContainer);
            var imageContainerfracsRect = fracsHelper.fracsRect(imageContainerRect.left, imageContainerRect.top, imageContainerRect.width, imageContainerRect.height);
            var zonefracsRect = fracsHelper.fracsRect(zoneRect.left, zoneRect.top, zoneRect.width, zoneRect.height);
            // finding fracs for each zone w.r.t image container for calculating viewable portion
            var fracsData = fracsHelper.getFracsWithRespectToContainerByRect(zonefracsRect, imageContainerfracsRect);
            var clientRect = OverlayHelper.adjustClientRectBasedOnRotatedAngle(rotatedAngle, zoneRect, viewHolderClientRect);
            var zoneNatural = {
                imageHeight: OverlayHelper.getStitchedImageDimension(imageProps.stitchedImageZones, imageProps.getImageNaturalDimension, i).height,
                imageWidth: OverlayHelper.getStitchedImageDimension(imageProps.stitchedImageZones, imageProps.getImageNaturalDimension, i).width
            };
            // holding default size of acetate
            var acetateWidth = (defaultDimension.width / zoneNatural.imageWidth) * clientRect.width;
            var acetateHeight = (defaultDimension.height / zoneNatural.imageHeight) * clientRect.height;
            var obj = {
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
        var container = OverlayHelper.getMarkSheetContainerClientValuesBasedOnRotatedAngle(rotatedAngle, markSheetContainer);
        var overlayRect = OverlayHelper.adjustClientRectBasedOnRotatedAngle(rotatedAngle, annotationOverlayClientRect, viewHolderClientRect);
        var y = 0;
        var x = 0;
        // sorting zones based on visibility
        var availableZones = availableZonesInFracs.sort(function (a, b) { return b.visible - a.visible; });
        // looping all the available zones and finding the valid visibile or valid invisible zones
        for (var i = 0; i < availableZones.length; i++) {
            var currentZone = availableZones[i];
            if (currentZone.isValid) {
                // get boundary to place acetate
                var _a = OverlayHelper.getBoundaryToPlaceAcetateForStitchedImage(currentZone, container), xStart = _a[0], xEnd = _a[1], yStart = _a[2], yEnd = _a[3];
                // get the x,y position to place acetate against the stitched image w.r.t image natural dimension
                _b = OverlayHelper.getXYToPlaceAcetateInStitchedImage(xStart, xEnd, yStart, yEnd, overlayRect, currentZone, container, rotatedAngle, markSheetImageElement), x = _b[0], y = _b[1];
                if (linkingScenarioProps) {
                    y = y + linkingScenarioProps.topAboveCurrentZone;
                }
                return { x: x, y: y };
            }
        }
        return { x: x, y: y };
        var _b;
    };
    /**
     * Gets the total grey gap value of output page in pixel.
     * @param outputPageWidth
     * @param index
     */
    OverlayHelper.getGreyGapInPixel = function (outputPageWidth, index) {
        var greyGap = (constants.GREY_GAP_PERCENT * outputPageWidth) / 100;
        return greyGap * index;
    };
    /**
     * To get default dimension based on acetate type
     * @param acetateType
     */
    OverlayHelper.getAcetateDefaultDimension = function (acetateType, doAddLineWithThreePoints) {
        if (doAddLineWithThreePoints === void 0) { doAddLineWithThreePoints = false; }
        var imageCentreCoordinates = {
            x: 0,
            y: 0
        };
        var defaultAcetatePoints = Array();
        if (doAddLineWithThreePoints) {
            defaultAcetatePoints = OverlayHelper.getMultiLineWithThreePoints(imageCentreCoordinates);
        }
        else {
            defaultAcetatePoints = OverlayHelper.getAcetatePoints(acetateType, imageCentreCoordinates);
        }
        var defaultAcetatePointsXSort = JSON.parse(JSON.stringify(defaultAcetatePoints));
        var defaultAcetatePointsYSort = JSON.parse(JSON.stringify(defaultAcetatePoints));
        // sorting 'x' points desc
        var xPoints = defaultAcetatePointsXSort.sort(function (a, b) { return b.x - a.x; });
        // sorting 'y' points desc
        var yPoints = defaultAcetatePointsYSort.sort(function (a, b) { return b.y - a.y; });
        // finding the difference between first 'x' point(maximum value) and last point(minimum value)
        var x = xPoints[0].x - xPoints[xPoints.length - 1].x;
        // finding the difference between first 'y' point(maximum value) and last point(minimum value)
        var y = yPoints[0].y - yPoints[yPoints.length - 1].y;
        var defaultDimension = { width: x, height: y };
        return defaultDimension;
    };
    /**
     * Gets the visible page no.
     * @param visibleImageId
     */
    OverlayHelper.getVisiblePageNo = function (visibleImageId) {
        var splittedImageId = visibleImageId.split('_');
        return Number(splittedImageId[1]);
    };
    /**
     *  Gets the natural height and width of the first zone for stitched images.
     * @param imageZones
     * @param getImageNaturalDimension
     */
    OverlayHelper.getStitchedImageDimension = function (imageZones, getImageNaturalDimension, index) {
        if (index === void 0) { index = 0; }
        var scaledDimesnion = {
            height: imageZones[index].height,
            width: imageZones[index].width
        };
        var imageDimension = getImageNaturalDimension(imageZones[index].pageNo);
        var naturalDimension = {
            height: (scaledDimesnion.height * imageDimension.naturalHeight) / 100,
            width: (scaledDimesnion.width * imageDimension.naturalWidth) / 100
        };
        return naturalDimension;
    };
    /**
     * return image dimension
     * @param imageProps
     */
    OverlayHelper.getImageDimension = function (imageProps) {
        var imageDimension = { imageWidth: 0, imageHeight: 0 };
        if (imageProps.outputPageNo > 0) {
            imageDimension = { imageWidth: imageProps.outputPageWidth, imageHeight: imageProps.outputPageHeight };
        }
        else {
            imageDimension = { imageWidth: imageProps.naturalWidth, imageHeight: imageProps.naturalHeight };
        }
        return imageDimension;
    };
    /**
     * Returns parent element having a specific class
     * @param el
     * @param classname
     */
    OverlayHelper.findAncestor = function (el, className) {
        var element = el;
        if (el !== null && el !== undefined && el.className !== undefined) {
            while (el !== null && el !== undefined && (el = (el.parentElement || el.parentNode))) {
                if (typeof el.className === 'string' && el.className.indexOf(className) >= 0) {
                    break;
                }
                else if (typeof el.className === 'object' && el.className.baseVal.indexOf(className) >= 0) {
                    break;
                }
                else {
                    continue;
                }
            }
        }
        if (el === null) {
            el = element ? element : el;
        }
        return el;
    };
    /**
     * return true if mouse pointer is in stitched grey gap
     * @param clientX
     * @param clientY
     * @param rotatedAngle
     * @param annotationOverlayElement
     */
    OverlayHelper.isInStitchedGap = function (clientX, clientY, rotatedAngle, annotationOverlayElement, overlayBoundary) {
        if (annotationOverlayElement) {
            var overlayBoundary_1 = annotationHelper.getStitchedImageBoundary(annotationOverlayElement, rotatedAngle);
            return !annotationHelper.isAnnotationInsideStitchedImage(overlayBoundary_1, rotatedAngle, clientX, clientY);
        }
        return false;
    };
    /**
     * return true if mouse pointer is inside stitched image boundary
     * @param dy
     * @param clientX
     * @param clientY
     * @param rotatedAngle
     * @param annotationOverlayElement
     */
    OverlayHelper.isOutsideStitchedImage = function (dy, clientX, clientY, rotatedAngle, annotationOverlayElement) {
        if (annotationOverlayElement) {
            var overlayBoundary = annotationHelper.getStitchedImageBoundary(annotationOverlayElement, rotatedAngle);
            var stitchedImageIndex = OverlayHelper.getStitchedImageGapIndex(dy, rotatedAngle, annotationOverlayElement, overlayBoundary);
            var stitchedImage = overlayBoundary[stitchedImageIndex];
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
                }
                else {
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
    };
    /**
     * Gets the mouse pointers delta coordinates.
     * @param deltaX
     * @param deltaY
     * @param rotatedAngle
     */
    OverlayHelper.getMousePointerDeltaXY = function (deltaX, deltaY, rotatedAngle) {
        var adjustedDeltaX = deltaX;
        var adjustedDeltaY = deltaY;
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
    };
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
    OverlayHelper.getAdjustedXYBasedOnRotatedAngle = function (x, y, rotatedAngle, zoneWidth, zoneHeight, imageDimension, linkingScenarioProps, imageProps) {
        var adjustedX = x;
        var adjustedY = y;
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
        }
        else if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
            adjustedY = (adjustedY / zoneWidth) * imageDimension.imageHeight;
            adjustedX = (adjustedX / zoneHeight) * imageDimension.imageWidth;
        }
        return [adjustedX, adjustedY];
    };
    /**
     * Gets the mosue pointer client x,y coordinates.
     * @param actualX
     * @param actualY
     * @param rotatedAngle
     * @param currentOverlayHolderClientRect
     * @param currentAnnotationHolderElement
     * @param imageDimension
     */
    OverlayHelper.getMousePointerClientXY = function (actualX, actualY, rotatedAngle, currentOverlayHolderClientRect, currentAnnotationHolderElement, imageDimension) {
        var dx = 0;
        var dy = 0;
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
    };
    /**
     * check whether the acetate is inside the stitched image or not
     * @param overlayElementClientRect
     * @param annotationHolderRect
     * @param rotatedAngle
     * @param overlayBoundary
     */
    OverlayHelper.isInsideStichedImage = function (overlayElementClientRect, annotationHolderRect, rotatedAngle, overlayBoundary) {
        var isValid = false;
        if (overlayBoundary.length > 0) {
            if (overlayBoundary && overlayBoundary.length > 0) {
                var insideScript = false;
                var acetateBoundaryEnd = 0;
                var acetateBoundaryStart = 0;
                var acetateBoundaryLeft = 0;
                var acetateBoundaryRight = 0;
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
    };
    /**
     * return stitched image offset for a point
     * @param point
     * @param rotatedAngle
     * @param annotationOverlayParentElement
     * @param stitchedImageIndex
     */
    OverlayHelper.findStitchedImageGapOffset = function (point, rotatedAngle, annotationOverlayParentElement, stitchedImageIndex) {
        if (stitchedImageIndex === void 0) { stitchedImageIndex = -1; }
        var stitchedImageSeperator = 0;
        var overlayBoundary = annotationHelper.getStitchedImageBoundary(annotationOverlayParentElement, rotatedAngle);
        if (stitchedImageIndex === -1) {
            stitchedImageIndex = OverlayHelper.getStitchedImageGapIndex(point, rotatedAngle, annotationOverlayParentElement, overlayBoundary);
        }
        stitchedImageSeperator = annotationHelper.calculateStitchedImageGapOffset(rotatedAngle, stitchedImageIndex, overlayBoundary, annotationOverlayParentElement);
        return stitchedImageSeperator;
    };
    /**
     * return index of stitched image gap for a point
     * @param point
     * @param rotatedAngle
     * @param annotationOverlayParentElement
     * @param overlayBoundary
     */
    OverlayHelper.getStitchedImageGapIndex = function (point, rotatedAngle, annotationOverlayParentElement, overlayBoundary) {
        var stitchedImageIndex = 0;
        if ((overlayBoundary && overlayBoundary.length > 0) && annotationOverlayParentElement) {
            var totalImageHeight = 0;
            for (var i = 0; i < overlayBoundary.length;) {
                totalImageHeight += overlayBoundary[i].imageHeight;
                var currentPagePercentage = (totalImageHeight / annotationOverlayParentElement.clientHeight) * 100;
                if (point < currentPagePercentage) {
                    i = overlayBoundary.length;
                }
                else {
                    i++;
                    stitchedImageIndex++;
                }
            }
        }
        return stitchedImageIndex;
    };
    /**
     * find stitched image gap index based on current coordinate value
     * @param point
     * @param overlayBoundary
     */
    OverlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate = function (point, overlayBoundary) {
        var stitchedImageIndex = 0;
        if (overlayBoundary && overlayBoundary.length > 0) {
            for (var i = 0; i < overlayBoundary.length;) {
                if (point < overlayBoundary[i].end && point > overlayBoundary[i].start) {
                    i = overlayBoundary.length;
                }
                else {
                    i++;
                    stitchedImageIndex++;
                }
            }
        }
        return stitchedImageIndex;
    };
    /**
     * Gets the image zone boundary list of the stitched images.
     * @param {any} element
     * @param {number} angle
     */
    OverlayHelper.getStitchedImageBoundary = function (element, angle) {
        var boundary = [];
        // If no valid boundary given return empty set.
        if (element === null || element === undefined) {
            return boundary;
        }
        else if (element.className.indexOf('annotation-overlay') > -1) {
            var markSheetWrapperElement = element.parentElement;
            var imageZones = markSheetWrapperElement.children;
            for (var i = 0; i < imageZones.length; i++) {
                // From the children of marksheet-wrapper only image zones need to be considered, neglecting annotation-overlay
                if (imageZones[i] !== null && imageZones[i].className !== null &&
                    imageZones[i].className.indexOf('annotation-overlay') < 0 &&
                    imageZones[i].className.indexOf('marksheet-img stitched') > -1) {
                    // Computing the 3% margin in pixel to calculate the distance from top to the gray area.
                    var elem = imageZones[i].getBoundingClientRect();
                    var startEdge = void 0;
                    var endEdge = void 0;
                    var leftEdge = void 0;
                    var rightEdge = void 0;
                    if (angle === enums.RotateAngle.Rotate_90 || angle === enums.RotateAngle.Rotate_270) {
                        startEdge = elem.left;
                        endEdge = elem.right;
                        leftEdge = elem.top;
                        rightEdge = elem.bottom;
                    }
                    else {
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
    };
    /**
     * return rotated angle for a page no
     * @param pageNo
     * @param outputPageNo
     */
    OverlayHelper.getRotatedAngle = function (pageNo, outputPageNo) {
        var displayAngle = 0;
        var displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
        if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
            displayAngleCollection.map(function (angle, key) {
                var str = key.split('_');
                if (str[0] + '_' + str[1] + '_' + str[2] === 'img_' + pageNo + '_' + outputPageNo) {
                    displayAngle = angle;
                }
            });
        }
        return annotationHelper.getAngleforRotation(displayAngle);
    };
    /**
     * gets the overlay boundaries in pixels
     * @param overlayBoundary
     * @param rotatedAngle
     * @param currentOverlayHolderClientRect
     * @param currentAnnotationHolderElement
     * @param imageDimension
     */
    OverlayHelper.getOverlayBoundaryInPixel = function (overlayBoundary, rotatedAngle, currentOverlayHolderClientRect, currentAnnotationHolderElement, imageDimension) {
        var overlayBoundaryInPixel = JSON.parse(JSON.stringify(overlayBoundary));
        for (var index = 0; index < overlayBoundary.length; index++) {
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
    };
    /**
     * gets the ruler points in a given coordinates
     * @param imageCentreCoordinates
     */
    OverlayHelper.getRulerPoints = function (imageCentreCoordinates) {
        var defaultAcetatePoints = Array();
        // Ruler starting point.
        var point1 = {
            x: imageCentreCoordinates.x - constants.RULER_LENGTH_OFFSET,
            y: imageCentreCoordinates.y
        };
        // Ruler end point.
        var point2 = {
            x: imageCentreCoordinates.x + constants.RULER_LENGTH_OFFSET,
            y: imageCentreCoordinates.y
        };
        defaultAcetatePoints.push(point1);
        defaultAcetatePoints.push(point2);
        return defaultAcetatePoints;
    };
    /**
     * gets the multiline points in a given coordinates
     * @param imageCentreCoordinates
     */
    OverlayHelper.getMultiLinePoints = function (imageCentreCoordinates) {
        var defaultAcetatePoints = Array();
        // Multiline point 1.
        var mp1 = {
            x: imageCentreCoordinates.x - (1.5 * constants.MULTI_LINE_OFFSET_X),
            y: imageCentreCoordinates.y - constants.MULTI_LINE_OFFSET_Y
        };
        // Multiline point 2.
        var mp2 = {
            x: imageCentreCoordinates.x - (0.5 * constants.MULTI_LINE_OFFSET_X),
            y: imageCentreCoordinates.y + constants.MULTI_LINE_OFFSET_Y
        };
        // Multiline point 3.
        var mp3 = {
            x: imageCentreCoordinates.x + (0.5 * constants.MULTI_LINE_OFFSET_X),
            y: imageCentreCoordinates.y - constants.MULTI_LINE_OFFSET_Y
        };
        // Multiline point 4.
        var mp4 = {
            x: imageCentreCoordinates.x + (1.5 * constants.MULTI_LINE_OFFSET_X),
            y: imageCentreCoordinates.y + constants.MULTI_LINE_OFFSET_Y
        };
        defaultAcetatePoints.push(mp1);
        defaultAcetatePoints.push(mp2);
        defaultAcetatePoints.push(mp3);
        defaultAcetatePoints.push(mp4);
        return defaultAcetatePoints;
    };
    /**
     * gets the multiline with 3 points in a given coordinates
     * @param imageCentreCoordinates
     */
    OverlayHelper.getMultiLineWithThreePoints = function (imageCentreCoordinates) {
        var defaultAcetatePoints = Array();
        // Multiline point 1.
        var mp1 = {
            x: imageCentreCoordinates.x,
            y: imageCentreCoordinates.y
        };
        // Multiline point 2.
        var mp2 = {
            x: imageCentreCoordinates.x + (constants.MULTI_LINE_OFFSET_X),
            y: imageCentreCoordinates.y + (2 * constants.MULTI_LINE_OFFSET_Y)
        };
        // Multiline point 3.
        var mp3 = {
            x: imageCentreCoordinates.x + (2 * constants.MULTI_LINE_OFFSET_X),
            y: imageCentreCoordinates.y
        };
        defaultAcetatePoints.push(mp1);
        defaultAcetatePoints.push(mp2);
        defaultAcetatePoints.push(mp3);
        return defaultAcetatePoints;
    };
    /**
     * gets protractor points in a given coordinates
     * @param imageCentreCoordinates
     * @param overlayBoundary
     * @param imageDimension
     */
    OverlayHelper.getProtractorPoints = function (imageCentreCoordinates, overlayBoundary, imageDimension, props) {
        var defaultAcetatePoints = Array();
        // Protractor starting point.
        var protractorPoint1 = {
            x: imageCentreCoordinates.x - constants.PROTRACTOR_LENGTH_OFFSET,
            y: imageCentreCoordinates.y
        };
        // Protractor mid point.
        var protractorPoint2 = {
            x: imageCentreCoordinates.x + constants.PROTRACTOR_LENGTH_OFFSET,
            y: imageCentreCoordinates.y
        };
        // Protractor end point.
        var protractorPoint3 = {
            x: imageCentreCoordinates.x - constants.PROTRACTOR_LENGTH_OFFSET,
            y: imageCentreCoordinates.y - constants.PROTRACTOR_ANGLE_OFFSET
        };
        // If the Last point is above the page obtain a point such that the angle will be 50
        if (imageCentreCoordinates.y > 0 && protractorPoint3.y < 0) {
            /* adjust points with an offset value such that all points are inside the zone.
               the offset value is the total pixels of potractorPoint3's ycoordinate above the response
               Added a 2px to avoid border values
            */
            var adjustmentOffset = Math.abs(protractorPoint3.y) + 2;
            _a = OverlayHelper.adjustProtractorPointsWithOffset([protractorPoint1, protractorPoint2, protractorPoint3], adjustmentOffset), protractorPoint1 = _a[0], protractorPoint2 = _a[1], protractorPoint3 = _a[2];
        }
        // reduce the grey gap area which is added while rendering             
        var gryaGapInPixel = overlayBoundary ? (overlayBoundary[1].start - overlayBoundary[0].end) : 0;
        if (gryaGapInPixel > 0) {
            _b = OverlayHelper.checkAndAdjustProtractorPoints([protractorPoint1, protractorPoint2, protractorPoint3], gryaGapInPixel, overlayBoundary, imageDimension, props.getAnnotationOverlayElement), protractorPoint1 = _b[0], protractorPoint2 = _b[1], protractorPoint3 = _b[2];
        }
        defaultAcetatePoints.push(protractorPoint1);
        defaultAcetatePoints.push(protractorPoint2);
        defaultAcetatePoints.push(protractorPoint3);
        return defaultAcetatePoints;
        var _a, _b;
    };
    /**
     * return client rect based on rotated angle
     * @param rotatedAngle
     * @param elementClientRect
     * @param viewHolderClientRect
     */
    OverlayHelper.adjustClientRectBasedOnRotatedAngle = function (rotatedAngle, elementClientRect, viewHolderClientRect) {
        var clientRect = {
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
    };
    /**
     * return markscheet container client value based on rotated angle
     * @param rotatedAngle
     * @param markSheetContainer
     */
    OverlayHelper.getMarkSheetContainerClientValuesBasedOnRotatedAngle = function (rotatedAngle, markSheetContainer) {
        var clientValues = { scrollLeft: 0, scrollTop: 0, height: 0, width: 0 };
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
    };
    /**
     * return image container client rect based on rotated angle
     * @param rotatedAngle
     * @param imageContainer
     */
    OverlayHelper.getImageContainerRectBasedOnRotatedAngle = function (rotatedAngle, imageContainer) {
        var clientRect = {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0
        };
        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_90:
                var toolBarPanel = htmlUtilities.getElementById('toolPanelId').getBoundingClientRect();
                var imageContainerRect = imageContainer.getBoundingClientRect();
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
    };
    /**
     * return boundary to place acetate
     * @param currentZone
     * @param container
     */
    OverlayHelper.getBoundaryToPlaceAcetateForStitchedImage = function (currentZone, container) {
        var yStart = 0;
        var yEnd = 0;
        var xStart = 0;
        var xEnd = 0;
        // checks whether y startpoint is from the TOP or MIDDLE of particular zone
        if (currentZone.top > container.scrollTop) {
            yStart = currentZone.top;
        }
        else {
            yStart = container.scrollTop;
        }
        // checks whether y endpoint is from the TOP or MIDDLE of particular zone
        if ((currentZone.top + currentZone.clientHeight) < (container.scrollTop + container.height)) {
            yEnd = currentZone.top + currentZone.clientHeight;
        }
        else {
            yEnd = container.scrollTop + container.height;
        }
        // checks whether x startpoint is from the TOP or MIDDLE of particular zone
        if (currentZone.left > container.scrollLeft) {
            xStart = currentZone.left;
        }
        else {
            xStart = container.scrollLeft;
        }
        // checks whether x endpoint is from the TOP or MIDDLE of particular zone
        if ((currentZone.left + currentZone.clientWidth) < (container.scrollLeft + container.width)) {
            xEnd = currentZone.left + currentZone.clientWidth;
        }
        else {
            xEnd = container.scrollLeft + container.width;
        }
        return [xStart, xEnd, yStart, yEnd];
    };
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
    OverlayHelper.getXYToPlaceAcetateInStitchedImage = function (xStart, xEnd, yStart, yEnd, overlayRect, currentZone, imageContainerRect, rotatedAngle, markSheetImageElement) {
        var x = 0;
        var y = 0;
        // holds viewable startpoint and endpoint
        var viewableHeight = yEnd - yStart;
        var viewableWidth = xEnd - xStart;
        // if the viewable part of zone has enough space to place the acetate it returns true
        var isValidViewableAreaToPlace = (viewableHeight > currentZone.acetateHeight) &&
            (viewableWidth > currentZone.acetateWidth) ? true : false;
        // if the full part of zone has enough space to place the acetate it returns true
        var isValidZoneToPlace = (currentZone.clientHeight > currentZone.acetateHeight) &&
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
        }
        else if (isValidZoneToPlace) {
            // if it is valid zone then the startpoint and endpoint is calculated based on full zone (includes invisible area)
            yStart = currentZone.top;
            yEnd = currentZone.top + currentZone.clientHeight;
            xStart = currentZone.left;
            xEnd = currentZone.left + currentZone.clientWidth;
            y = (yEnd - yStart) / 2;
            x = (xEnd - xStart) / 2;
        }
        else {
            return [0, 0];
        }
        // getting top value relative to overlay
        var zoneTopOverlay = (currentZone.top - overlayRect.top);
        y = y + zoneTopOverlay;
        var gapOffSet = 0;
        if (annotationHelper.IsOddangle(rotatedAngle)) {
            gapOffSet = markSheetImageElement.clientHeight;
        }
        else {
            gapOffSet = markSheetImageElement.clientWidth;
        }
        // reduce the grey gap area which is added while rendering 
        y = y - OverlayHelper.getGreyGapInPixel(gapOffSet, currentZone.imgNo);
        // x and y position related to natural image dimension
        y = Math.abs((y / currentZone.clientHeight) * currentZone.naturalHeight);
        x = Math.abs((x / currentZone.clientWidth) * currentZone.naturalWidth);
        return [x, y];
    };
    /**
     * return marksheet container element
     */
    OverlayHelper.getMarkSheetContainer = function () {
        return htmlUtilities.getElementsByClassName('marksheet-container')[0];
    };
    /**
     * get the overlayboundary w.r.t rotated angle
     * @param rotatedAngle
     * @param elementId
     * @param annotationOverlayHolderClientRect
     */
    OverlayHelper.getZonesClientRectBasedOnRotatedAngle = function (rotatedAngle, elementId, annotationOverlayHolderClientRect) {
        var markSheetImageElement = htmlUtilities.getElementById(elementId);
        // finding number of zones inside particular outputpage
        var zones = markSheetImageElement.getElementsByClassName('marksheet-img');
        var zoneBoundary = [];
        for (var i = 0; i < zones.length; i++) {
            var zoneRect = zones[i].getBoundingClientRect();
            var clientRect = OverlayHelper.adjustClientRectBasedOnRotatedAngle(rotatedAngle, zoneRect, annotationOverlayHolderClientRect);
            // Store the boundary.
            zoneBoundary.push({
                start: clientRect.top, end: clientRect.bottom,
                imageWidth: zones[i].clientWidth, imageHeight: zones[i].clientHeight
            });
        }
        return zoneBoundary;
    };
    /**
     * adjust the points of protractor with an offset value
     * @param points
     * @param offset
     */
    OverlayHelper.adjustProtractorPointsWithOffset = function (points, offset) {
        for (var index = 0; index < points.length; index++) {
            points[index].y += offset;
        }
        return points;
    };
    /**
     * check and adjust the protractor if it is between two stitched imgaes
     * @param protractorPoints
     * @param gryaGapInPixel
     * @param overlayBoundary
     * @param imageDimension
     * @param annotationOverlayElement
     */
    OverlayHelper.checkAndAdjustProtractorPoints = function (protractorPoints, gryaGapInPixel, overlayBoundary, imageDimension, annotationOverlayElement) {
        // stitched image gap index of mid and third points
        var potractorPoint2CurrentStitchedImageGapIndex = overlayBoundary ? OverlayHelper.getStitchedImageGapIndex(OverlayHelper.findPercentage(protractorPoints[1].y, imageDimension.imageHeight), 0, annotationOverlayElement, overlayBoundary) : 0;
        var potractorPoint3CurrentStitchedImageGapIndex = overlayBoundary ? OverlayHelper.getStitchedImageGapIndex(OverlayHelper.findPercentage(protractorPoints[2].y, imageDimension.imageHeight), 0, annotationOverlayElement, overlayBoundary) : 0;
        // stitched image index of mid point, 
        // potractorPoint2CurrentStitchedImageGapIndex * gryaGapInPixel is the total graygap in pixel till mid point
        var potractorPoint2StitchedImageIndex = OverlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate(protractorPoints[1].y + potractorPoint2CurrentStitchedImageGapIndex * gryaGapInPixel, overlayBoundary);
        // stitched gap index of third point, 
        // potractorPoint3CurrentStitchedImageGapIndex * gryaGapInPixel is the total graygap in pixel till third point
        var potractorPoint3StitchedImageIndex = OverlayHelper.getStitchedImageGapIndexWithRespectToClientCoordinate(protractorPoints[2].y + potractorPoint3CurrentStitchedImageGapIndex * gryaGapInPixel, overlayBoundary);
        // if the stitched gap index of mid and thrid points are differenet,
        // means trying to draw a protractor between two stitched imgaes
        if (potractorPoint2StitchedImageIndex !== potractorPoint3StitchedImageIndex) {
            /* adjust all points with an offset in pixel, the offset value is the difference between
               end point of potractorPoint2's previous overlay and potractorPoint3's ycoordinate.
               deduct a total graygap of potractorPoint2, because these graygap are not considering while calculating the
               point. Graygap adjustment is handling on render
               Added a 2px to avoid border values
            */
            var adjustmentOffset = Math.abs((overlayBoundary[potractorPoint2StitchedImageIndex - 1].end - protractorPoints[2].y) -
                (potractorPoint2StitchedImageIndex - 1) * gryaGapInPixel) + 2;
            _a = OverlayHelper.adjustProtractorPointsWithOffset([protractorPoints[0],
                protractorPoints[1], protractorPoints[2]], adjustmentOffset), protractorPoints[0] = _a[0], protractorPoints[1] = _a[1], protractorPoints[2] = _a[2];
        }
        return protractorPoints;
        var _a;
    };
    /**
     * return marksheet view holder element
     */
    OverlayHelper.getMarkSheetViewHolder = function () {
        return htmlUtilities.getElementsByClassName('marksheet-view-holder')[0];
    };
    /**
     * return acetate context menu data.
     */
    OverlayHelper.getAcetateContextMenuData = function (clientToken, toolType) {
        var data;
        data = new acetateContextMenuData;
        data.acetateToolType = toolType;
        data.clientToken = clientToken;
        data.contextMenuType = enums.ContextMenuType.acetate;
        return data;
    };
    /**
     * Checks if the acettae is to be placed against the page.
     * @param isALinkedPage
     */
    OverlayHelper.isAcetatePlacedAgainstPage = function (isALinkedPage) {
        return responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured ||
            responseHelper.isAtypicalResponse() || isALinkedPage;
    };
    /**
     * check whether the coordinates are valid to place the acetate
     * @param x
     * @param y
     * @param imgClientRect
     * @param acetateHeight
     * @param acetateWidth
     * @param rotatedAngle
     */
    OverlayHelper.isInValidCoordinatesToPlaceInViewableArea = function (x, y, imgClientRect, acetateHeight, acetateWidth, rotatedAngle) {
        /* check whether possible to draw the acetate fully inside the viewable area in the given coordinate
           by checking the possible height, width, left and top values of acetate with image */
        if ((rotatedAngle / 90) % 2 === 1) {
            // case when rotate angle is 90 or 270
            return ((acetateWidth / 2 + y > imgClientRect.height) ||
                (acetateHeight / 2 + x > imgClientRect.width) ||
                (x - acetateHeight / 2 < 0) ||
                (y - acetateWidth / 2 < 0));
        }
        else {
            // case when rotate angle is 0 or 180
            return ((acetateHeight / 2 + y > imgClientRect.height) ||
                (acetateWidth / 2 + x > imgClientRect.width) ||
                (x - acetateWidth / 2 < 0) ||
                (y - acetateHeight / 2 < 0));
        }
    };
    /**
     * Check whether acetate is inside annotation holder.
     * @param {ClientRectDOM} clientRectInPixels
     * @param {ClientRectDOM} annotationHolderRect
     * @returns
     */
    OverlayHelper.isAcetateInsideHolder = function (clientRect, annotationHolderRect) {
        var clientRectInsideAnnotationHolder = true;
        if (clientRect.left <= annotationHolderRect.left ||
            clientRect.left + clientRect.width >= (annotationHolderRect.width + annotationHolderRect.left) ||
            clientRect.top <= annotationHolderRect.top ||
            clientRect.top + clientRect.height >= (annotationHolderRect.height + annotationHolderRect.top)) {
            clientRectInsideAnnotationHolder = false;
        }
        return clientRectInsideAnnotationHolder;
    };
    return OverlayHelper;
}());
module.exports = OverlayHelper;
//# sourceMappingURL=overlayhelper.js.map