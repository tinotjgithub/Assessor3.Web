"use strict";
var markingStore = require('../../../stores/marking/markingstore');
var Immutable = require('immutable');
var enums = require('../enums');
var qigStore = require('../../../stores/qigselector/qigstore');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var responseStore = require('../../../stores/response/responsestore');
var worklistStore = require('../../../stores/worklist/workliststore');
var toolbarStore = require('../../../stores/toolbar/toolbarstore');
var constants = require('../constants');
var stampStore = require('../../../stores/stamp/stampstore');
var userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../utility/useroption/useroptionkeys');
var colouredAnnotationsHelper = require('../../../utility/stamppanel/colouredannotationshelper');
var configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var treeViewDataHelper = require('../../../utility/treeviewhelpers/treeviewdatahelper');
var marksAndAnnotationsVisibilityHelper = require('../../../components/utility/marking/marksandannotationsvisibilityhelper');
var imageZoneStore = require('../../../stores/imagezones/imagezonestore');
var markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
var annotationContextMenuData = require('../contextmenu/annotationcontextmenudata');
var AnnotationHelper = (function () {
    function AnnotationHelper() {
    }
    /**
     * sets the zindex for the static annotation from image width and height
     * @param imageWidth
     * @param imageHeight
     */
    AnnotationHelper.setZIndexForStaticAnnotations = function (imageWidth, imageHeight) {
        AnnotationHelper.zIndex = Math.round(imageWidth * imageHeight);
    };
    /**
     * Get current marking group annotation
     */
    AnnotationHelper.getCurrentMarkGroupAnnotation = function () {
        var previousAnnotations = Array();
        var showDefAnnotationsOnly = markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
            markerOperationModeFactory.operationMode.isDefinitveMarkingStarted;
        var allAnnotations;
        if (markingStore.instance.examinerMarksAgainstCurrentResponse) {
            var marksAndAnnotations_1 = markingStore.instance.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[markingStore.instance.selectedQIGMarkGroupId].allMarksAndAnnotations[0];
            allAnnotations = marksAndAnnotations_1.annotations;
            var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            var visiblityInfo = marksAndAnnotationsVisibilityHelper.
                getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId).get(0);
            if (allAnnotations) {
                allAnnotations.filter(function (annotation) {
                    // set the remark request type for the annotations
                    annotation.remarkRequestTypeId = marksAndAnnotations_1.remarkRequestTypeId;
                    annotation.zOrder = AnnotationHelper.maxZIndex();
                });
            }
            if (showDefAnnotationsOnly) {
                // Filter the definitive annotaion.
                allAnnotations = allAnnotations.filter(function (annotation) { return annotation.definitiveMark === true; });
            }
        }
        return allAnnotations;
    };
    /**
     * Get remark annotations
     */
    AnnotationHelper.getCurrentMarkGroupPreviousRemarkAnnotations = function (seedType) {
        this.treeViewHelper = new treeViewDataHelper();
        var previousAnnotations = Array();
        if (markingStore.instance.examinerMarksAgainstCurrentResponse) {
            var allMarkSchemGroupIds = markingStore.instance.getRelatedWholeResponseQIGIds();
            var markSchemeGroupIndex = 0;
            var _loop_1 = function() {
                var markGroupId = markingStore.instance.currentMarkGroupId;
                var allResponseCurrentQigMarksAndAnnotations = markingStore.instance.examinerMarksAgainstCurrentResponse.
                    examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations;
                // for whole response, loop through annotations of each qig
                if (allMarkSchemGroupIds && allMarkSchemGroupIds.length > 0) {
                    markGroupId = markingStore.instance.
                        getMarkGroupIdQIGtoRIGMap(allMarkSchemGroupIds[markSchemeGroupIndex++]);
                }
                var allMarksAndAnnotations = markingStore.instance.examinerMarksAgainstCurrentResponse.
                    examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations;
                var allMarksAndAnnotationsLength = allMarksAndAnnotations.length;
                allMarksAndAnnotations.filter(function (item, index) {
                    // exclude current marking annotations
                    if (index > 0) {
                        item.annotations.map(function (annotation) {
                            // set the remark request type for the annotations
                            annotation.remarkRequestTypeId = item.remarkRequestTypeId;
                            annotation.zOrder = allMarksAndAnnotationsLength - index;
                            annotation.markGroupIdofWholeResponse = allResponseCurrentQigMarksAndAnnotations[index].markGroupId;
                        });
                        previousAnnotations = previousAnnotations.concat(item.annotations);
                    }
                });
                if (markerOperationModeFactory.operationMode.isPreviousAnnotationsInGrayColour(seedType)) {
                    // grey color for defenitive marks
                    var red_1 = 128;
                    var green_1 = 128;
                    var blue_1 = 128;
                    previousAnnotations.map(function (previousAnnotation) {
                        previousAnnotation.red = red_1;
                        previousAnnotation.green = green_1;
                        previousAnnotation.blue = blue_1;
                    });
                }
            };
            do {
                _loop_1();
            } while (markSchemeGroupIndex < allMarkSchemGroupIds.length);
        }
        return previousAnnotations;
    };
    /**
     * gets whether the current response mode is pending.
     */
    AnnotationHelper.isPendingWorklist = function () {
        return worklistStore.instance.getResponseMode === enums.ResponseMode.pending;
    };
    /**
     * get previous remark annotation details
     * @param isClosedEurSeed
     * @param isClosedLiveSeed
     * @param seedType
     */
    AnnotationHelper.getPreviousAnnotationDetails = function (isClosedEurSeed, isClosedLiveSeed, seedType) {
        var allMarksAndAnnotations = markingStore.instance.getAllMarksAndAnnotations();
        var allMarksAndAnnotationsCount = allMarksAndAnnotations.length - 1;
        var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        var visiblityInfo = marksAndAnnotationsVisibilityHelper.getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId);
        var responseMode = responseStore.instance.selectedResponseMode;
        var counter = -1;
        var remarkBaseColor = colouredAnnotationsHelper.getRemarkBaseColor(enums.DynamicAnnotation.None).fill;
        var items = allMarksAndAnnotations.map(function (item) {
            var previousMarksAndAnnotationDetails = Immutable.Map();
            counter++;
            var examinerMarksAgainstResponse = markingStore.instance.getExaminerMarksAgainstResponse;
            var allMarksAndAnnotation = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId]
                .allMarksAndAnnotations[counter];
            var previousRemarkBaseColor = colouredAnnotationsHelper.getPreviousRemarkBaseColor(examinerMarksAgainstResponse);
            if (visiblityInfo.get(counter).isAnnotationVisible === true) {
                previousMarksAndAnnotationDetails = marksAndAnnotationsVisibilityHelper.
                    getMarkSchemePanelColumnHeaderAttributes(counter, item, allMarksAndAnnotationsCount, visiblityInfo, isClosedEurSeed, isClosedLiveSeed, remarkBaseColor, responseMode, seedType, markingStore.instance.currentMarkGroupId, worklistStore.instance.currentWorklistType, allMarksAndAnnotation, previousRemarkBaseColor);
                if (counter === 0) {
                    return null;
                }
                return previousMarksAndAnnotationDetails;
            }
        });
        return items;
    };
    /**
     * Get annotation to display in current page
     * @param imageClusterId
     * @param outputPageNo
     * @param currentImageMaxWidth
     * @param pageNo
     */
    AnnotationHelper.getAnnotationsToDisplayInCurrentPage = function (imageClusterId, outputPageNo, currentImageMaxWidth, pageNo, isReadOnly, seedType, isAtypical, markSchemesWithSameImages, isEbookMarking) {
        if (isAtypical === void 0) { isAtypical = false; }
        if (markSchemesWithSameImages === void 0) { markSchemesWithSameImages = undefined; }
        if (isEbookMarking === void 0) { isEbookMarking = false; }
        var annotationsToDisplayInCurrentPage;
        this.treeViewHelper = new treeViewDataHelper();
        // Get all annotations against the response
        var currentAnnotations = Immutable.List(markingStore.instance.allAnnotationsAgainstResponse(markingStore.instance.currentMarkGroupId)).toList();
        // filter current annotations
        annotationsToDisplayInCurrentPage = this.filterAnnotations(currentAnnotations, imageClusterId, outputPageNo, currentImageMaxWidth, pageNo, false, isAtypical, markSchemesWithSameImages, undefined, isEbookMarking);
        // check if the response is not opened in FR view, since we only need to show the remark annotations in zoned view
        // isReadOnly will be set to true only for FR view (fullresponseimageviewer.tsx)
        if (isReadOnly !== true && this.doShowPreviousAnnotations) {
            // get the previous annotations
            var previousRemarkAnnotations = Immutable.List(AnnotationHelper.getCurrentMarkGroupPreviousRemarkAnnotations(seedType));
            // filter remark annotations
            var previousAnnotations = this.filterAnnotations(previousRemarkAnnotations, imageClusterId, outputPageNo, currentImageMaxWidth, pageNo, true, false, markSchemesWithSameImages, currentAnnotations, isEbookMarking);
            if (annotationsToDisplayInCurrentPage) {
                annotationsToDisplayInCurrentPage = annotationsToDisplayInCurrentPage.concat(previousAnnotations);
                return annotationsToDisplayInCurrentPage;
            }
            else {
                return previousAnnotations;
            }
        }
        return annotationsToDisplayInCurrentPage;
    };
    Object.defineProperty(AnnotationHelper, "doShowPreviousAnnotations", {
        get: function () {
            var hasShowStandardisationDefinitiveMarksCC = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ShowStandardisationDefinitiveMarks, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
            var hasAutomaticQualityFeedbackCC = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.AutomaticQualityFeedback, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
            var hasShowTLSeedDefinitiveMarksCC = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ShowTLSeedDefinitiveMarks).toLowerCase() === 'true';
            var showPrevious = true;
            if (AnnotationHelper.treeViewHelper) {
                if ((AnnotationHelper.treeViewHelper.isDirectedRemark &&
                    AnnotationHelper.treeViewHelper.isSeedResponse === enums.SeedType.None) || AnnotationHelper.treeViewHelper.isPractice ||
                    AnnotationHelper.treeViewHelper.isPooledRemark ||
                    ((AnnotationHelper.treeViewHelper.isStandardisation || AnnotationHelper.treeViewHelper.isSecondStandardisation)
                        && (markerOperationModeFactory.operationMode.isTeamManagementMode ? true : (AnnotationHelper.treeViewHelper.isClosed
                            && hasShowStandardisationDefinitiveMarksCC))) ||
                    ((AnnotationHelper.treeViewHelper.isLive || AnnotationHelper.treeViewHelper.isDirectedRemark)
                        && (AnnotationHelper.treeViewHelper.isClosed || AnnotationHelper.isPendingWorklist()
                            || (AnnotationHelper.treeViewHelper.isOpen && markerOperationModeFactory.operationMode.isTeamManagementMode &&
                                hasShowTLSeedDefinitiveMarksCC)) && AnnotationHelper.treeViewHelper.isSeedResponse !== enums.SeedType.None &&
                        hasAutomaticQualityFeedbackCC)) {
                    showPrevious = true;
                }
                else {
                    showPrevious = false;
                }
            }
            return showPrevious;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Annotation filtering method
     * @param annotations
     * @param imageClusterId
     * @param outputPageNo
     * @param currentImageMaxWidth
     * @param pageNo
     * @param isPrevious
     * @param markSchemesWithSameImageClusterId
     */
    AnnotationHelper.filterAnnotations = function (annotations, imageClusterId, outputPageNo, currentImageMaxWidth, pageNo, isPrevious, isAtypical, markSchemesWithSameImages, currentMarkingAnnotations, isEbookMarking) {
        if (isAtypical === void 0) { isAtypical = false; }
        if (markSchemesWithSameImages === void 0) { markSchemesWithSameImages = undefined; }
        if (currentMarkingAnnotations === void 0) { currentMarkingAnnotations = undefined; }
        if (isEbookMarking === void 0) { isEbookMarking = false; }
        var showDefAnnotationsOnly = markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
            markerOperationModeFactory.operationMode.isDefinitveMarkingStarted;
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured
            && markingStore.instance.currentQuestionItemInfo
            && markingStore.instance.currentQuestionItemImageClusterId === undefined
            && !isAtypical) {
            AnnotationHelper.findAnnotationsAgainstOutputPageForMarkscheme(annotations, outputPageNo, currentImageMaxWidth);
        }
        else if (imageClusterId > 0) {
            // get all the linked annotations against image cluster id which are not against current question item
            var linkedAnnotations = AnnotationHelper.getLinkedAnnotationsAgainstImage(markSchemesWithSameImages, isPrevious ? currentMarkingAnnotations : annotations);
            AnnotationHelper.findAnnotationsToDisplayForStructured(linkedAnnotations, outputPageNo, imageClusterId, currentImageMaxWidth, annotations);
        }
        else if (isEbookMarking) {
            // get all the linked annotations against image cluster id which are not against current question item
            var linkedAnnotations = AnnotationHelper.getLinkedAnnotationsAgainstImage(markSchemesWithSameImages, isPrevious ? currentMarkingAnnotations : annotations);
            AnnotationHelper.findAnnotationsToDisplayForEBookMarking(linkedAnnotations, markSchemesWithSameImages, outputPageNo, currentImageMaxWidth, annotations);
        }
        else {
            // get the stamps for the page
            this.annotationsToDisplayInCurrentPage = annotations.filter(function (annotation) {
                return annotation.pageNo === pageNo &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted
                    && annotation.stamp !== constants.LINK_ANNOTATION;
            });
        }
        // set if annotation is of a remark or not
        this.annotationsToDisplayInCurrentPage.map(function (annotation) {
            annotation.isPrevious = isPrevious;
        });
        if (showDefAnnotationsOnly) {
            this.annotationsToDisplayInCurrentPage = this.annotationsToDisplayInCurrentPage.filter(function (x) { return x.definitiveMark === true; });
        }
        return this.annotationsToDisplayInCurrentPage;
    };
    /**
     * Returns a annotation entity based on the details to add to overlay.
     * @param stampId
     * @param pageNo
     * @param imageClusterId
     * @param outputPageNo
     * @param left
     * @param top
     * @param action
     * @param width
     * @param height
     * @param associatedMarkSchemeId
     * @param rotateAngle
     */
    AnnotationHelper.getAnnotationToAdd = function (stampId, pageNo, imageClusterId, outputPageNo, left, top, action, width, height, associatedMarkSchemeId, rotateAngle, numericMarkValue) {
        var openedResponseDetails = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString());
        var rgbForRed = 255;
        var rgbForBlue = 0;
        var rgbForGreen = 0;
        var annotationColor;
        var annotationWidth = 0;
        var annotationHeight = 0;
        var defaultWidth = 0;
        var defaultHeight = 0;
        _a = AnnotationHelper.getAnnotationDefaultValue(stampId, undefined, undefined, null, rotateAngle), defaultWidth = _a[0], defaultHeight = _a[1];
        switch (stampId) {
            case enums.DynamicAnnotation.Highlighter:
            case enums.DynamicAnnotation.Ellipse:
                annotationColor = userOptionsHelper.getUserOptionByName(userOptionKeys.HIGHTLIGHTER_COLOR, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                if (annotationColor) {
                    _b = this.getRGBColor(annotationColor), rgbForRed = _b[0], rgbForGreen = _b[1], rgbForBlue = _b[2];
                }
                else if (worklistStore.instance.getRemarkRequestType > 0) {
                    // if user option is not having any  color then get the base color from db if its a remark
                    var stampName = enums.DynamicAnnotation[stampId];
                    var cssProps = colouredAnnotationsHelper.
                        getRemarkBaseColor(enums.DynamicAnnotation[stampName]);
                    var rgb = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
                    rgbForRed = parseInt(rgb[0]);
                    rgbForGreen = parseInt(rgb[1]);
                    rgbForBlue = parseInt(rgb[2]);
                }
                // Display default Width and hight while Stamping & Drag and drop.
                if (action === enums.AddAnnotationAction.Pan) {
                    annotationWidth = 0;
                    annotationHeight = 0;
                }
                else if (action === enums.AddAnnotationAction.Stamping) {
                    // Maintain the cursor inside the highlighter position after Stamping & Drag and drop.
                    top = top - (defaultHeight / defaultWidth);
                    left = left - (defaultHeight / defaultWidth);
                    if (rotateAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90) {
                        top = top + (defaultWidth / defaultHeight);
                    }
                    annotationWidth = width;
                    annotationHeight = height;
                }
                break;
            case enums.DynamicAnnotation.HorizontalLine:
            case enums.DynamicAnnotation.HWavyLine:
                if (stampId === enums.DynamicAnnotation.HWavyLine) {
                    if (rotateAngle === enums.RotateAngle.Rotate_0 ||
                        rotateAngle === enums.RotateAngle.Rotate_180) {
                        top = top - (defaultHeight / 2);
                        left = left - (defaultWidth / 15);
                    }
                    else if (rotateAngle === enums.RotateAngle.Rotate_90 ||
                        rotateAngle === enums.RotateAngle.Rotate_270) {
                        top = top - (defaultHeight / 6);
                        left = left - (defaultWidth / 10);
                    }
                }
                // Display default Width and hight while Stamping & Drag and drop.
                if (action === enums.AddAnnotationAction.Pan) {
                    annotationWidth = 0;
                    annotationHeight = constants.DEFAULT_HLINE_HEIGHT;
                }
                else if (action === enums.AddAnnotationAction.Stamping) {
                    annotationWidth = width;
                    annotationHeight = constants.DEFAULT_HLINE_HEIGHT;
                }
                break;
            case enums.DynamicAnnotation.VWavyLine:
                if (rotateAngle === enums.RotateAngle.Rotate_0 ||
                    rotateAngle === enums.RotateAngle.Rotate_180) {
                    top = top - (defaultHeight / 6);
                    left = left - (defaultWidth / 10);
                }
                else if (rotateAngle === enums.RotateAngle.Rotate_90 ||
                    rotateAngle === enums.RotateAngle.Rotate_270) {
                    left = left - (defaultWidth / 4);
                }
                // Display default Width and hight while Stamping & Drag and drop.
                if (action === enums.AddAnnotationAction.Pan) {
                    annotationWidth = constants.DEFAULT_HLINE_HEIGHT;
                    annotationHeight = 0;
                }
                else if (action === enums.AddAnnotationAction.Stamping) {
                    annotationWidth = constants.DEFAULT_HLINE_HEIGHT;
                    annotationHeight = height;
                }
                break;
            case enums.DynamicAnnotation.OnPageComment:
                // saving anchor position
                annotationWidth = width;
                annotationHeight = height;
                break;
            default:
                // saving anchor position
                annotationWidth = width;
                annotationHeight = height;
                break;
        }
        if (left < 0 || top < 0) {
            return;
        }
        var newlyAddedAnnotation = {
            markingOperation: enums.MarkingOperation.added,
            stamp: stampId,
            markSchemeId: associatedMarkSchemeId,
            pageNo: pageNo ? pageNo : 0,
            imageClusterId: imageClusterId ? imageClusterId : 0,
            outputPageNo: outputPageNo ? outputPageNo : 0,
            examinerRoleId: markingStore.instance.selectedQIGExaminerRoleId,
            markGroupId: markingStore.instance.selectedQIGMarkGroupId,
            markSchemeGroupId: markingStore.instance.selectedQIGMarkSchemeGroupId,
            candidateScriptId: openedResponseDetails.candidateScriptId,
            leftEdge: Math.round(left),
            topEdge: Math.round(top),
            annotationId: 0,
            clientToken: htmlUtilities.guid,
            red: rgbForRed,
            blue: rgbForBlue,
            green: rgbForGreen,
            comment: undefined,
            definitiveMark: false,
            freehand: '',
            height: Math.round(annotationHeight),
            isDirty: true,
            uniqueId: htmlUtilities.guid,
            questionTagId: markingStore.instance.currentQuestionItemQuestionTagId,
            rowVersion: '',
            transparency: 0,
            version: 0,
            width: Math.round(annotationWidth),
            zOrder: AnnotationHelper.maxZIndex(),
            dataShareLevel: null,
            dimension: '',
            isPrevious: false,
            remarkRequestTypeId: worklistStore.instance.getRemarkRequestType,
            numericValue: numericMarkValue
        };
        return newlyAddedAnnotation;
        var _a, _b;
    };
    /**
     * Get rgb color of the annotation
     * @param annotationColor
     */
    AnnotationHelper.getRGBColor = function (annotationColor) {
        if (annotationColor) {
            var colors = annotationColor.replace('rgb(', '').replace(')', '').split(',');
            return [Number(colors[0]), Number(colors[1]), Number(colors[2])];
        }
    };
    /**
     * Check if annotation/stamp is dragged at the correct droppable location in the screen
     * @param xPos
     * @param yPos
     * @param element
     * @param panSource
     */
    AnnotationHelper.isPanOnStampPanel = function (element, panSource) {
        var isOverpannableArea = false;
        /* Annotation/Stamp can be dragged from two location
         * 1. Stamp panel (Expanded and Favorite)
         * 2. Annotation Overlay (Response screen)
         * Based on the source location pan source will be set. If annotation is dragged inside the response screen we need to
         * check only whether pannable area is annotation overlay. If annotation is dragged from stamp panel we need to check
         * whether it is being dragged from expanded to favorite stamp panel, favorite to expanded stamp panel, expanded or favorite
         * stamp panel to response screen. Based on the draggable area, we will set the flag
         */
        if (element != null && element !== undefined) {
            var parentElement = htmlUtilities.findAncestor(element, 'icon-groups-wrap');
            if (panSource === enums.PanSource.StampPanel &&
                (element.id.indexOf('mainpanel') >= 0 ||
                    element.id.indexOf('favouritepanel') >= 0 ||
                    element.id.indexOf('iconToolsTray') >= 0 ||
                    element.id.indexOf('svgScriptStamp') >= 0 ||
                    element.id.indexOf('righttrayicon') >= 0 ||
                    element.id.indexOf('defaultmarkingtray') >= 0 ||
                    parentElement.id.indexOf('mainpanel') >= 0)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Returns true if the mouse pointer is outside the grey area of the script.
     * @param element
     * @param left
     * @param top
     * @param imageWidth
     * @param imageHeight
     * @param angle
     */
    AnnotationHelper.checkMouseOutsideGreyArea = function (element, left, top, imageWidth, imageHeight, angle) {
        angle = AnnotationHelper.getAngleforRotation(angle);
        if (element !== null && element.attributes.getNamedItem('class') !== null &&
            element.attributes.getNamedItem('class').nodeValue !== null &&
            element.attributes.getNamedItem('class').nodeValue.indexOf('marksheet-img') > -1) {
            if (angle !== undefined && (angle % 360 === 90 || angle % 360 === 270)) {
                imageWidth = element.clientHeight;
                imageHeight = imageHeight + element.clientWidth;
            }
            else {
                imageWidth = element.clientWidth;
                imageHeight = imageHeight + element.clientHeight;
            }
            var gap = (element.offsetTop + 25.1563);
            if (left < imageWidth && top < imageHeight) {
                return true;
            }
            else {
                if (left > imageWidth && top < imageHeight) {
                    return false;
                }
                return this.checkMouseOutsideGreyArea(element.nextSibling, left, top, imageWidth, imageHeight, angle);
            }
        }
        else {
            return true;
        }
    };
    /**
     * To check whether the angle is odd or not.
     * @param {number} rotatedAngle
     * @returns
     */
    AnnotationHelper.IsOddangle = function (rotatedAngle) {
        return !!((this.getAngleforRotation(rotatedAngle) / enums.RotateAngle.Rotate_90) % 2);
    };
    /**
     * Checking whether the annotation dragging or put inside the stitched image seperator gap and more than
     * the width or height.
     * @param {any} element
     * @param {number} left
     * @param {number} top
     * @param {number} imageWidth
     * @param {number} imageHeight
     * @param {number} angle
     * @param {number} scrollTop
     * @param {Array<AnnotationBoundary>} overlayBoundary
     * @returns
     */
    AnnotationHelper.checkGreyAreaAfterRotationStitched = function (element, left, top, imageWidth, imageHeight, angle, scrollTop, overlayBoundary, clientX, clientY) {
        return this.checkGreyAreaAfterRotation(element, left, top, imageWidth, imageHeight, angle, scrollTop);
    };
    /**
     * Checking whether the annotation is in gray area of the stitched image
     * @param {Array<AnnotationBoundary>} overlayBoundary
     * @param {number} angle
     * @param {number} clientX
     * @param {number} clientY
     * @returns
     */
    AnnotationHelper.isAnnotationInsideStitchedImage = function (overlayBoundary, angle, clientX, clientY) {
        var isInsideScript = false;
        // First fail condition to verify dragging annotation is inside the gray area
        if (overlayBoundary && overlayBoundary.length > 0) {
            for (var i = 0; i < overlayBoundary.length; i++) {
                if (angle === enums.RotateAngle.Rotate_0 || angle === enums.RotateAngle.Rotate_360) {
                    // Added 1px gap to avoid adding annotation at the edge of the script. Otherwise 1px diff will
                    // cost when converting to % at the render method. This will now assume that clientY belongs to
                    // different image.
                    clientY -= 1;
                    if (clientY > overlayBoundary[i].start && clientY < overlayBoundary[i].end) {
                        isInsideScript = true;
                    }
                }
                else if (angle === enums.RotateAngle.Rotate_180) {
                    // Added 1px gap to avoid adding annotation at the edge of the script. Otherwise 1px diff will
                    // cost when converting to % at the render method. This will now assume that clientY belongs to
                    // different image.
                    clientY += 1;
                    if (clientY > overlayBoundary[i].start && clientY < overlayBoundary[i].end) {
                        isInsideScript = true;
                    }
                }
                else if (angle === enums.RotateAngle.Rotate_90 || angle === enums.RotateAngle.Rotate_270) {
                    if (clientX < overlayBoundary[i].end && clientX > overlayBoundary[i].start) {
                        isInsideScript = true;
                    }
                }
            }
        }
        else {
            isInsideScript = true;
        }
        return isInsideScript;
    };
    /**
     *
     * Get the image zone to verify the mouseover and tap to show the 'View whole response' button
     * in structured stitched zones
     *
     * @static
     * @param {Array<AnnotationBoundary>} overlayBoundary
     * @param {number} angle
     * @param {number} clientX
     * @param {number} clientY
     * @param {ImageZone[]} imageZones
     * @returns
     * @memberof AnnotationHelper
     */
    AnnotationHelper.getImageZone = function (overlayBoundary, angle, clientX, clientY, imageZones) {
        if (overlayBoundary && overlayBoundary.length > 0) {
            for (var i = 0; i < overlayBoundary.length; i++) {
                if (angle === enums.RotateAngle.Rotate_0 || angle === enums.RotateAngle.Rotate_360) {
                    // Added 1px gap to avoid adding annotation at the edge of the script. Otherwise 1px diff will
                    // cost when converting to % at the render method. This will now assume that clientY belongs to
                    // different image.
                    clientY -= 1;
                    if (clientY > overlayBoundary[i].start && clientY < overlayBoundary[i].end) {
                        return imageZones[i];
                    }
                }
                else if (angle === enums.RotateAngle.Rotate_180) {
                    // Added 1px gap to avoid adding annotation at the edge of the script. Otherwise 1px diff will
                    // cost when converting to % at the render method. This will now assume that clientY belongs to
                    // different image.
                    clientY += 1;
                    if (clientY > overlayBoundary[i].start && clientY < overlayBoundary[i].end) {
                        return imageZones[i];
                    }
                }
                else if (angle === enums.RotateAngle.Rotate_90 || angle === enums.RotateAngle.Rotate_270) {
                    if (clientX < overlayBoundary[i].end && clientX > overlayBoundary[i].start) {
                        return imageZones[i];
                    }
                }
            }
        }
    };
    /**
     * To check whether the x,y position is outside the grey area of the script.
     * @param {any} element
     * @param {number} left
     * @param {number} top
     * @param {number} imageWidth
     * @param {number} imageHeight
     * @param {number} angle
     * @param {number} scrollTop
     * @returns
     */
    AnnotationHelper.checkGreyAreaAfterRotation = function (element, left, top, imageWidth, imageHeight, angle, scrollTop) {
        if (element !== null && element.attributes && element.attributes.getNamedItem('class') !== null &&
            element.attributes.getNamedItem('class').nodeValue !== null &&
            element.attributes.getNamedItem('class').nodeValue.indexOf('marksheet-img') > -1) {
            angle = this.getAngleforRotation(angle);
            if (angle === enums.RotateAngle.Rotate_0 || angle === enums.RotateAngle.Rotate_360) {
                imageWidth = element.clientWidth;
                imageHeight = imageHeight + element.clientHeight;
                var margineDistance = parseFloat(window.getComputedStyle(element).marginTop.replace('px', ''));
                var seperator = (element.offsetTop);
                if ((left > 0 && left < imageWidth) && (top > 0 && top < imageHeight)) {
                    return true;
                }
                else {
                    if (left > imageWidth && top < imageHeight) {
                        return false;
                    }
                    return this.checkGreyAreaAfterRotation(element.nextSibling, left, top, imageWidth, imageHeight, angle, scrollTop);
                }
            }
            else if (angle === enums.RotateAngle.Rotate_180) {
                imageWidth = element.clientWidth;
                imageHeight = imageHeight + element.clientHeight;
                var imageLeft = element.getBoundingClientRect().left;
                if ((left > imageLeft && left < (imageLeft + imageWidth)) && top < imageHeight) {
                    return true;
                }
                else {
                    if (left < imageLeft && top < imageHeight) {
                        return false;
                    }
                    return this.checkGreyAreaAfterRotation(element.previousSibling, left, top, imageWidth, imageHeight, angle, scrollTop);
                }
            }
            else if (angle === enums.RotateAngle.Rotate_90) {
                imageWidth = element.clientHeight;
                imageHeight = imageHeight + element.clientWidth;
                if (left < imageWidth && top < imageHeight) {
                    return true;
                }
                else {
                    if (top > imageHeight && left < imageWidth) {
                        return false;
                    }
                    return this.checkGreyAreaAfterRotation(element.previousSibling, left, top, imageWidth, imageHeight, angle, scrollTop);
                }
            }
            else if (angle === enums.RotateAngle.Rotate_270) {
                imageWidth = imageWidth + element.clientHeight;
                imageHeight = element.clientWidth;
                var imageTop = element.getBoundingClientRect().top + scrollTop;
                if ((left > 0 && left < imageWidth) && top > imageTop) {
                    return true;
                }
                else {
                    if (left < imageWidth && top < imageTop) {
                        return false;
                    }
                    return this.checkGreyAreaAfterRotation(element.nextSibling, left, top, imageWidth, imageHeight, angle, scrollTop);
                }
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    };
    /**
     * Check the current mark scheme having any annotations added by the user.
     * @returns Number of annotation that are new/updated
     */
    AnnotationHelper.hasUserAddedAnnotationExistsForTheCurrentMarkScheme = function () {
        var annotations = Immutable.List(AnnotationHelper.getCurrentMarkGroupAnnotation());
        // For intial loading disable the reset button.
        if (markingStore.instance.currentQuestionItemInfo === undefined) {
            return false;
        }
        // get newly added/updated annotation only and avoid LINK annotation.
        return annotations.some(function (annotation) {
            return annotation.markSchemeId === markingStore.instance.currentQuestionItemInfo.uniqueId
                && annotation.markingOperation !== enums.MarkingOperation.deleted
                && annotation.stamp !== constants.LINK_ANNOTATION
                && !annotation.addedBySystem;
        });
    };
    /**
     * return true if stamp is line, otherwise false
     * @param stampId
     */
    AnnotationHelper.isLineAnnotation = function (stampId) {
        return AnnotationHelper.isHorizontalLine(stampId) ||
            AnnotationHelper.isVerticalLine(stampId);
    };
    /**
     * return true if stamp is a horizontal line
     * @param stampId
     */
    AnnotationHelper.isHorizontalLine = function (stampId) {
        return stampId === enums.DynamicAnnotation.HorizontalLine ||
            stampId === enums.DynamicAnnotation.HWavyLine;
    };
    /**
     * return true if stamp is a vertical line
     * @param stampId
     */
    AnnotationHelper.isVerticalLine = function (stampId) {
        return stampId === enums.DynamicAnnotation.VWavyLine;
    };
    /**
     * return true if line annotation is drawing in horizontal direction
     * @param stampId
     * @param rotatedAngle
     */
    AnnotationHelper.doDrawLineHorizontally = function (stampId, rotatedAngle) {
        if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
            if (AnnotationHelper.isVerticalLine(stampId)) {
                return true;
            }
        }
        else {
            if (AnnotationHelper.isHorizontalLine(stampId)) {
                return true;
            }
        }
        return false;
    };
    /**
     * return true if line annotations are overlapping with another line annotation
     * @param clientX
     * @param clientY
     * @param rotatedAngle
     * @param stampId
     */
    AnnotationHelper.isLineAnnotationsOverlapping = function (clientX, clientY, rotatedAngle, stampId) {
        var maxPixelsToCheck = 5;
        var classNamesToCheck = ['hit-area', 'line', 'resizer'];
        var leftElement = null;
        var rightElement = null;
        if (AnnotationHelper.doDrawLineHorizontally(stampId, rotatedAngle)) {
            for (var counter = 1; counter <= maxPixelsToCheck; counter++) {
                leftElement = htmlUtilities.getElementFromPosition(clientX, clientY - counter);
                rightElement = htmlUtilities.getElementFromPosition(clientX, clientY + counter);
                if (AnnotationHelper.checkElementClassName(leftElement, classNamesToCheck) ||
                    AnnotationHelper.checkElementClassName(rightElement, classNamesToCheck)) {
                    return true;
                }
            }
        }
        else {
            for (var counter = 1; counter <= maxPixelsToCheck; counter++) {
                leftElement = htmlUtilities.getElementFromPosition(clientX - counter, clientY);
                rightElement = htmlUtilities.getElementFromPosition(clientX + counter, clientY);
                if (AnnotationHelper.checkElementClassName(leftElement, classNamesToCheck) ||
                    AnnotationHelper.checkElementClassName(rightElement, classNamesToCheck)) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * return true if the elements classname contains any of the items in the array
     * @param element
     * @param subStringsToCheck
     */
    AnnotationHelper.checkElementClassName = function (element, subStringsToCheck) {
        if (element && typeof element.className === 'string' && subStringsToCheck) {
            if (AnnotationHelper.isDynamicAnnotationElement(element)) {
                return true;
            }
            for (var i = 0; i < subStringsToCheck.length; i++) {
                var className = subStringsToCheck[i];
                if (element.className.indexOf(className) >= 0) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Check the rectangle co-ordinates are overlaps with anothor
     * @param event
     * @param cursorWidth
     * @param cursorHeight
     * @param holderClassName
     */
    AnnotationHelper.isAnnotationPlacedOnTopOfAnother = function (stampType, element, clientX, clientY, holderClassName, rotatedAngle, overlayBoundary) {
        var left = clientX;
        var top = clientY;
        var cursorWidth = 0;
        var cursorHeight = 0;
        if (!overlayBoundary) {
            overlayBoundary = [];
        }
        if ((stampType === enums.StampType.text) &&
            (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90
                || rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270)) {
            // Get the width of the cursor based on the image width (4 percentage if image + 10 px)
            var width = element.clientWidth * (4 / 100) + 10;
            // when rotated, cursor width and height is swapped.
            cursorWidth = width;
            cursorHeight = width;
        }
        else {
            // Get the width of the cursor based on the image width (4 percentage if image - 4 px)
            cursorWidth = element.clientWidth * (4 / 100) - 4;
            // If the stamp is text type height is 67 % of the width.
            cursorHeight = cursorWidth;
        }
        // keep the annotation overlay for checking if all points in rectangle fall on the same script Image.
        // This is required for booklet view when the user can stamp the annotation in between the images.
        var previousElementIdStampedOn = '';
        /*
         * Get the points in the rectangle from the mouse cursor and inspect it is in the annotation holder
         * If any of this points are not in the 'annotation-holder' it is overlaping with anothor
         * Currently 6 points in the rectagle inspects. Since the text annotation having lower width than image stamp.
         * Handle other points in future if rerquired.
        */
        for (var scenarioCounter = 1; scenarioCounter <= 9; scenarioCounter++) {
            switch (scenarioCounter) {
                case 1:
                    // Get the Left Top co-ordinates of rectangle
                    left = clientX - (cursorWidth / 2);
                    top = clientY - (cursorHeight / 2);
                    break;
                case 2:
                    // Get the Left Bottom co-ordinates of rectangle
                    left = clientX - (cursorWidth / 2);
                    top = clientY + (cursorHeight / 2);
                    break;
                case 3:
                    // Get the Right Top co-ordinates of rectangle
                    left = clientX + (cursorWidth / 2);
                    top = clientY - (cursorHeight / 2);
                    break;
                case 4:
                    // Get the Right Bottom co-ordinates of rectangle
                    left = clientX + (cursorWidth / 2);
                    top = clientY + (cursorHeight / 2);
                    break;
                case 5:
                    // Get the Left Centre co-ordinates of rectangle
                    left = clientX - (cursorWidth / 2);
                    top = clientY;
                    break;
                case 6:
                    // Get the Right Centre co-ordinates of rectangle
                    left = clientX + (cursorWidth / 2);
                    top = clientY;
                    break;
                case 7:
                    // Get the centre co-ordinates of rectangle
                    left = clientX;
                    top = clientY;
                    break;
                case 8:
                    // Get the top centre co-ordinates of rectangle
                    left = clientX;
                    top = clientY - (cursorHeight / 2);
                    break;
                case 9:
                    // Get the bottom centre co-ordinates of rectangle
                    left = clientX;
                    top = clientY + (cursorHeight / 2);
                    break;
            }
            // For stitched images we are calculating the edges have crossed the stitiched image gap.
            if (overlayBoundary && overlayBoundary.length > 0) {
                var annotaionOverStitchedGap = this.isAnnotationInsideStitchedImage(overlayBoundary, rotatedAngle, left, top);
                if (!annotaionOverStitchedGap) {
                    return true;
                }
            }
            // Get the element in the point
            var elementInMousePointer = htmlUtilities.getElementFromPosition(left, top);
            // Check the class is same as the Holder class for verifying the point is in the holder.
            if (elementInMousePointer !== null && typeof elementInMousePointer.className === 'string') {
                if (elementInMousePointer.className.indexOf(holderClassName) === -1) {
                    // Co-ordinates overlaps with some other element.
                    if (elementInMousePointer.id.indexOf('previous') === -1 && !this.isDynamicAnnotationElement(elementInMousePointer)) {
                        return true;
                    }
                }
                else {
                    if (previousElementIdStampedOn !== '' && previousElementIdStampedOn !== elementInMousePointer.id) {
                        // The annotation has fell on two script images - Booklet view scenario
                        return true;
                    }
                    else {
                        previousElementIdStampedOn = elementInMousePointer.id;
                    }
                }
            }
            else if (elementInMousePointer === null) {
                return true;
            }
        }
        return false;
    };
    /**
     * This method will find the current annotaion position and its imagezone, then returns the corresponding width/height.
     * @param clientRect
     * @param topScroll
     */
    AnnotationHelper.getImageZoneRestriction = function (clientRect, topScroll, imageZoneRect, annotationHolderRect, imageZones) {
        // let imageZoneRect: ClientRect = this.props.getImageContainerRect();
        // let annotationHolderRect: ClientRect = this.getAnnotationHolderElementProperties();
        var annotationTop = Math.round(((clientRect.top + topScroll) -
            (annotationHolderRect.top + topScroll)) + clientRect.height);
        var annotationLeft = Math.round((clientRect.left - annotationHolderRect.left) + clientRect.width);
        var annotationHolderImageZone = {
            width: 0,
            height: 0
        };
        /** 'topPositioninZone' variable stores the imagezone's position top value */
        var topPositioninZone = 0;
        /** Loop through the imagezones and find the width and height for restricting the movement or resize of the annotation */
        for (var index = 0; index < imageZones.length; index++) {
            /* 'previousZoneHeight' variable contains the previous zone height while moving/resizing the annotation*/
            var previousZoneHeight = topPositioninZone > 0 ? imageZoneRect[index - 1].height : topPositioninZone;
            var nextImageZoneWidth = 0;
            /* Below 'if' condition will check whether there is another imagezone after the current imagezone
            and current imagezone width is greater than the next imagezone width */
            if (imageZoneRect[index + 1] && imageZoneRect[index].width > imageZoneRect[index + 1].width) {
                /* 'nextImageZoneWidth' variable stores the next imagezone width */
                var nextImageZoneWidth_1 = imageZoneRect[index + 1].width;
                /* If the annotation position is greater than the next imagezone width then the annotation
                y-axis movement/resize will be restricted within the current imagezone height*/
                if (annotationLeft > Math.round(nextImageZoneWidth_1)) {
                    nextImageZoneWidth_1 = Math.round(annotationHolderRect.width *
                        imageZones[index + 1].holderWidth / 100);
                    annotationHolderImageZone.height = Math.round(annotationHolderRect.height -
                        Math.round(nextImageZoneWidth_1 * imageZones[index + 1].zonePaddingTop / 100));
                }
            }
            /**
             * Condition checks if imagezone height restriction is greater than 0 then current imagezone
             * height is set, else its set by adding next imagezone height to the 'topPositioninZone' variable
             */
            var heightRestriction = annotationHolderImageZone.height > 0 ?
                annotationHolderImageZone.height : Math.round((topPositioninZone
                + imageZoneRect[index].height));
            if (annotationTop <= heightRestriction && annotationTop >= Math.round(previousZoneHeight)) {
                /**
                 * If the annoation is placed in a imagezone, then annotation x-axis movement/resize
                 * will be restricted within the current imagezone width
                 */
                annotationHolderImageZone.width = Math.round(annotationHolderRect.width *
                    imageZones[index].holderWidth / 100);
                break;
            }
            else {
                /* 'topPositioninZone' variable stores the imagezone's position top value */
                topPositioninZone = Math.round(topPositioninZone + imageZoneRect[index].height);
            }
        }
        /**
         * If the restricted width/height is lesser than 0 value, then annotation-overlay dimensions are set accordingly
         */
        annotationHolderImageZone.width = annotationHolderImageZone.width <= 0 ?
            annotationHolderRect.width : annotationHolderImageZone.width;
        annotationHolderImageZone.height = annotationHolderImageZone.height <= 0 ?
            annotationHolderRect.height : annotationHolderImageZone.height;
        return annotationHolderImageZone;
    };
    /**
     * This method will check the mouse left and top position related to the annotation holder area and if the image is not present
     * @param element
     * @param left
     * @param top
     * @param imageWidth
     * @param imageHeight
     */
    AnnotationHelper.checkMouseInCorrectPosition = function (element, left, top, imageWidth, imageHeight, pageNo, angle) {
        if (pageNo > 0 || responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured) {
            // Unstructured response, No need to validate
            return true;
        }
        return AnnotationHelper.checkMouseOutsideGreyArea(element, left, top, imageWidth, imageHeight, angle);
    };
    /**
     * This method will check whether annoatation boundary coordinates are inside the gray area region
     * @param annotationRect
     * @param annotationHolderElement
     * @param marksheetElement
     * @param rotatedAngle
     */
    AnnotationHelper.validateAnnotationBoundary = function (annotationRect, annotationHolderElement, marksheetElement, rotatedAngle) {
        var width = annotationRect.width;
        var height = annotationRect.height;
        var annotationHolderRect = annotationHolderElement.getBoundingClientRect();
        var annotationInGrayArea = false;
        var annotationBoundaryCoordinates = [];
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);
        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_0:
            case enums.RotateAngle.Rotate_360:
                annotationBoundaryCoordinates = [
                    { 'left': annotationRect.left, 'top': annotationRect.top },
                    { 'left': annotationRect.left + width, 'top': annotationRect.top },
                    { 'left': annotationRect.left, 'top': annotationRect.top + height },
                    { 'left': annotationRect.left + width, 'top': annotationRect.top + height }
                ];
                break;
            case enums.RotateAngle.Rotate_180:
                annotationBoundaryCoordinates = [
                    {
                        'left': annotationHolderRect.width - (annotationRect.left + annotationRect.width),
                        'top': annotationHolderRect.height - (annotationRect.top + annotationRect.height)
                    },
                    {
                        'left': annotationHolderRect.width - (annotationRect.left),
                        'top': annotationHolderRect.height - (annotationRect.top + annotationRect.height)
                    },
                    {
                        'left': annotationHolderRect.width - (annotationRect.left + annotationRect.width),
                        'top': annotationHolderRect.height - annotationRect.top
                    },
                    {
                        'left': annotationHolderRect.width - (annotationRect.left),
                        'top': annotationHolderRect.height - annotationRect.top
                    }
                ];
                break;
            case enums.RotateAngle.Rotate_90:
                annotationBoundaryCoordinates = [
                    { 'left': (annotationHolderRect.width - (annotationRect.top + height)), 'top': annotationRect.left },
                    { 'left': (annotationHolderRect.width - annotationRect.top), 'top': annotationRect.left },
                    {
                        'left': (annotationHolderRect.width - (annotationRect.top + height)),
                        'top': annotationRect.left + annotationRect.width
                    },
                    {
                        'left': (annotationHolderRect.width - annotationRect.top),
                        'top': annotationRect.left + annotationRect.width
                    }
                ];
                break;
            case enums.RotateAngle.Rotate_270:
                annotationBoundaryCoordinates = [
                    {
                        'left': annotationRect.top, 'top': annotationHolderRect.height -
                            (annotationRect.left + annotationRect.width)
                    },
                    {
                        'left': annotationRect.top + annotationRect.height,
                        'top': annotationHolderRect.height - (annotationRect.left + annotationRect.width)
                    },
                    { 'left': annotationRect.top, 'top': annotationHolderRect.height - annotationRect.left },
                    {
                        'left': annotationRect.top + annotationRect.height,
                        'top': annotationHolderRect.height - annotationRect.left
                    }
                ];
                break;
        }
        annotationBoundaryCoordinates.map(function (coordinates) {
            var propsForGrayAreaCheck = AnnotationHelper.setElementPropertiesForGrayAreaCheck((coordinates.left +
                annotationHolderRect.left), (coordinates.top + annotationHolderRect.top), annotationHolderElement.parentElement, marksheetElement, rotatedAngle);
            var inGrayArea = !(AnnotationHelper.checkGreyAreaAfterRotation(propsForGrayAreaCheck.element, propsForGrayAreaCheck.left, propsForGrayAreaCheck.top, 0, 0, propsForGrayAreaCheck.angle, propsForGrayAreaCheck.scrollTop));
            if (inGrayArea) {
                annotationInGrayArea = true;
            }
        });
        return annotationInGrayArea;
    };
    /**
     * This check is to prevent the click event from firing in IE when PanEnd is fired
     */
    AnnotationHelper.checkEventFiring = function () {
        if (toolbarStore.instance.panStampId === 0
            && toolbarStore.instance.selectedStampId !== 0) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * pixelsToPercentConversion function converts pixel to percent relative to the parent container
     * @param pixels
     * @param parentinPixel
     */
    AnnotationHelper.pixelsToPercentConversion = function (pixels, parentinPixel) {
        var value = (pixels / parentinPixel) * 100;
        /** For rounding the value up to 3 decimal points */
        return Math.round(value * 1000) / 1000;
    };
    /**
     * percentToPixelConversion function converts percent to pixel relative to the parent container
     * @param percent
     * @param parentinPixel
     */
    AnnotationHelper.percentToPixelConversion = function (percent, parentinPixel) {
        var value = (percent / 100) * parentinPixel;
        return Math.round(value);
    };
    /**
     * getAnnotationCoordinatesOnRotate function is to get top and left of the annotation after rotation.
     * @param annotationHolderElement
     * @param currentElement
     * @param x
     * @param y
     * @param rotatedAngle
     */
    AnnotationHelper.getAnnotationCoordinatesOnRotate = function (annotationHolderElement, currentElement, left, top, rotatedAngle) {
        var annotationLeft = 0;
        var annotationTop = 0;
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);
        switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
            case enums.RotateAngle.Rotate_0:
            case enums.RotateAngle.Rotate_180:
            case enums.RotateAngle.Rotate_360:
                annotationLeft = this.maintainPositionOnRotate(annotationHolderElement, currentElement, left, top, rotatedAngle)[0];
                annotationTop = this.maintainPositionOnRotate(annotationHolderElement, currentElement, left, top, rotatedAngle)[1];
                break;
            case enums.RotateAngle.Rotate_90:
            case enums.RotateAngle.Rotate_270:
                annotationLeft = this.maintainPositionOnRotate(annotationHolderElement, currentElement, left, top, rotatedAngle)[1];
                annotationTop = this.maintainPositionOnRotate(annotationHolderElement, currentElement, left, top, rotatedAngle)[0];
                break;
        }
        return [annotationLeft, annotationTop];
    };
    /**
     * maintainPositionOnRotate function is to convert the points after rotating.
     * @param annotationHolderElement
     * @param currentElement
     * @param x
     * @param y
     * @param rotatedAngle
     */
    AnnotationHelper.maintainPositionOnRotate = function (annotationHolderElement, currentElement, x, y, rotatedAngle) {
        var cx = 0;
        var cy = 0;
        var angle = 0;
        var radians = 0;
        var cos = 0;
        var sin = 0;
        var nx = 0;
        var ny = 0;
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);
        switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
            case enums.RotateAngle.Rotate_0:
                cx = annotationHolderElement.width / 2;
                cy = annotationHolderElement.height / 2;
                angle = enums.RotateAngle.Rotate_0;
                break;
            case enums.RotateAngle.Rotate_90:
                cx = Math.round((annotationHolderElement.width / 2) -
                    (currentElement.width / 2));
                cy = Math.round((annotationHolderElement.width / 2) -
                    (currentElement.width / 2));
                angle = enums.RotateAngle.Rotate_90;
                break;
            case enums.RotateAngle.Rotate_180:
                cx = (annotationHolderElement.width / 2) -
                    (currentElement.width / 2);
                cy = (annotationHolderElement.height / 2) -
                    (currentElement.height / 2);
                angle = enums.RotateAngle.Rotate_180;
                break;
            case enums.RotateAngle.Rotate_270:
                cx = (annotationHolderElement.height / 2) -
                    (currentElement.height / 2);
                cy = (annotationHolderElement.height / 2) -
                    (currentElement.height / 2);
                angle = enums.RotateAngle.Rotate_270;
                break;
        }
        radians = (Math.PI / 180) * angle;
        cos = Math.cos(radians);
        sin = Math.sin(radians);
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
    };
    /**
     * retainAnnotationOnRotate function is to get the points after rotating.
     * @param rotatedAngle
     * @param clientRect
     * @param annotationHolderElement
     * @param currentElement
     */
    AnnotationHelper.retainAnnotationOnRotate = function (rotatedAngle, clientRect, annotationHolderElement, currentElement) {
        var width = annotationHolderElement.width;
        var height = annotationHolderElement.height;
        var left = clientRect.left;
        var top = clientRect.top;
        switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
            case enums.RotateAngle.Rotate_90:
            case enums.RotateAngle.Rotate_270:
                left = this.pixelsToPercentConversion(this.maintainPositionOnRotate(annotationHolderElement, currentElement, left, top, rotatedAngle)[1], width);
                top = this.pixelsToPercentConversion(this.maintainPositionOnRotate(annotationHolderElement, currentElement, left, top, rotatedAngle)[0], height);
                break;
            default:
                left = this.pixelsToPercentConversion(this.maintainPositionOnRotate(annotationHolderElement, currentElement, left, top, rotatedAngle)[0], width);
                top = this.pixelsToPercentConversion(this.maintainPositionOnRotate(annotationHolderElement, currentElement, left, top, rotatedAngle)[1], height);
                break;
        }
        if (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90 ||
            rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270) {
            return [top, left];
        }
        return [left, top];
    };
    /**
     * checkOutsideResponseArea for checking whether its outside respone area
     * @param currentOutputImageHeight
     * @param currentImageMaxWidth
     * @param top
     * @param left
     * @param annotationWidth
     * @param annotationHeight
     * @param action
     */
    AnnotationHelper.checkOutsideResponseArea = function (currentOutputImageHeight, currentImageMaxWidth, top, left, annotationWidth, annotationHeight, action) {
        if (currentOutputImageHeight > (top + (annotationHeight))
            && currentImageMaxWidth > (left + (annotationWidth))
            && left > 0 && top > 0) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * find the annotation holder for the corresponding element
     * @param element
     */
    AnnotationHelper.findAnnotationHolderOfAnElement = function (element) {
        while (element.id.indexOf('annotationoverlay') === -1
            && element.parentNode != null
            && element.parentNode !== undefined
            && element.id !== 'imagecontainer') {
            element = element.parentNode;
        }
        // Since annotation holder and overlay holder both come under Annotation overlay
        element = element.id.indexOf('Overlay_') > -1 ? element.firstChild : element;
        return element;
    };
    /**
     * This check is to whether the element is dynamic annotation
     */
    AnnotationHelper.isDynamicAnnotationElement = function (element) {
        if (element) {
            var attributeValue = 'dynamicannotation';
            var isDynamicAnnotation = false;
            if (element.getAttribute('data-type') === attributeValue) {
                isDynamicAnnotation = true;
            }
            else if (element.parentNode.getAttribute('data-type') === attributeValue) {
                isDynamicAnnotation = true;
            }
            else if (element.parentNode.parentNode.getAttribute('data-type') === attributeValue) {
                isDynamicAnnotation = true;
            }
            else {
                isDynamicAnnotation = false;
            }
            return isDynamicAnnotation;
        }
        else {
            return false;
        }
    };
    /**
     * Checks if the stamp is a Dynamic Annotation and NOT On page comment
     * @param {any} stamp stampData
     */
    AnnotationHelper.isDynamicAnnotation = function (stamp) {
        var isDynamicAnnotation = false;
        if (stamp) {
            isDynamicAnnotation = this.isDynamicStampType(stamp.stampType) && !this.isOnPageComment(stamp.stampId);
        }
        return isDynamicAnnotation;
    };
    /**
     * Checks if the stamp is a Dynamic type (INCLUDES on page comment)
     * @param {any} stampType stampType
     */
    AnnotationHelper.isDynamicStampType = function (stampType) {
        return stampType === enums.StampType.dynamic;
    };
    /**
     * Checks if the stamp is an Image type
     * @param stamp
     */
    AnnotationHelper.isImageAnnotation = function (stamp) {
        if (stamp) {
            return stamp.stampType === enums.StampType.image;
        }
        return false;
    };
    /**
     * Checks if the stamp is a Text type
     * @param stamp
     */
    AnnotationHelper.isTextAnnotation = function (stamp) {
        if (stamp) {
            return stamp.stampType === enums.StampType.text;
        }
        return false;
    };
    /**
     * Is the stamp On page Comment
     * @param {number} stampId Stamp ID
     */
    AnnotationHelper.isOnPageComment = function (stampId) {
        return stampId === enums.DynamicAnnotation.OnPageComment;
    };
    /**
     * This check is to whether the element is previous annotation
     */
    AnnotationHelper.isPreviousAnnotation = function (element) {
        var attributeValue = 'previous';
        var isPreviousAnnotation = false;
        if (element.getAttribute('data-annotation-relevance') === attributeValue) {
            isPreviousAnnotation = true;
        }
        return isPreviousAnnotation;
    };
    /**
     * This check is to whether the response is read only
     */
    AnnotationHelper.isResponseReadOnly = function () {
        return markerOperationModeFactory.operationMode.isResponseReadOnly;
    };
    /**
     * getAnnotationDefaultValue - calculate width and height of the dynamic annotation
     * @param stampId
     * @param width
     * @param height
     * @param element
     * @param rotatedAngle
     * @param isStamping
     */
    AnnotationHelper.getAnnotationDefaultValue = function (stampId, width, height, element, rotatedAngle, isStamping) {
        var stamp = stampStore.instance.getStamp(stampId);
        var isWidthRequired = false;
        var isHeightRequired = true;
        switch (stampId) {
            case enums.DynamicAnnotation.Highlighter:
                if (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90 ||
                    rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270) {
                    width = (width === undefined ? constants.DEFAULT_HIGHLIGHTER_HEIGHT : width);
                    height = (height === undefined ? constants.DEFAULT_HIGHLIGHTER_WIDTH : height);
                }
                else {
                    width = (width === undefined ? constants.DEFAULT_HIGHLIGHTER_WIDTH : width);
                    height = (height === undefined ? constants.DEFAULT_HIGHLIGHTER_HEIGHT : height);
                }
                isWidthRequired = isHeightRequired = true;
                break;
            case enums.DynamicAnnotation.Ellipse:
                if (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90 ||
                    rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270) {
                    width = (width === undefined ? constants.DEFAULT_ELLIPSE_HEIGHT : width);
                    height = (height === undefined ? constants.DEFAULT_ELLIPSE_WIDTH : height);
                }
                else {
                    width = (width === undefined ? constants.DEFAULT_ELLIPSE_WIDTH : width);
                    height = (height === undefined ? constants.DEFAULT_ELLIPSE_HEIGHT : height);
                }
                isWidthRequired = isHeightRequired = true;
                break;
            case enums.DynamicAnnotation.HorizontalLine:
            case enums.DynamicAnnotation.HWavyLine:
                if (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90 ||
                    rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270) {
                    width = (width === undefined ? constants.DEFAULT_HLINE_HEIGHT : width);
                    height = (height === undefined ? constants.DEFAULT_HLINE_WIDTH : height);
                }
                else {
                    width = (width === undefined ? constants.DEFAULT_HLINE_WIDTH : width);
                    height = (height === undefined ? constants.DEFAULT_HLINE_HEIGHT : height);
                }
                isWidthRequired = true;
                isHeightRequired = false;
                break;
            case enums.DynamicAnnotation.VWavyLine:
                if (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90 ||
                    rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270) {
                    width = (width === undefined ? constants.DEFAULT_VLINE_WIDTH : width);
                    height = (height === undefined ? constants.DEFAULT_VLINE_HEIGHT : height);
                }
                else {
                    width = (width === undefined ? constants.DEFAULT_VLINE_HEIGHT : width);
                    height = (height === undefined ? constants.DEFAULT_VLINE_WIDTH : height);
                }
                isWidthRequired = false;
                isHeightRequired = true;
                break;
            default:
                // Get the width of the cursor based on the image width (4 percentage if image - 4 px)
                width = (element) ? element.clientWidth * (4 / 100) - 4 : 4;
                // If the stamp is text type height is 67 % of the width.
                height = width * ((stampId === enums.StampType.text ? 67 : 100) / 100);
                break;
        }
        /* Dynamic Annotation Default size is 8 X 5 percentage */
        if (element && isStamping && this.isDynamicAnnotation(stamp)) {
            if (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90 ||
                rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270) {
                width = (5 / 100) * element.clientWidth;
                height = (8 / 100) * element.clientWidth;
                if (!isHeightRequired) {
                    width = (1 / 100) * element.clientWidth;
                }
                if (!isWidthRequired) {
                    height = (1 / 100) * element.clientWidth;
                }
            }
            else {
                width = (8 / 100) * element.clientWidth;
                height = (5 / 100) * element.clientWidth;
                if (!isHeightRequired) {
                    height = (1 / 100) * element.clientWidth;
                }
                if (!isWidthRequired) {
                    width = (1 / 100) * element.clientWidth;
                }
            }
        }
        return [width, height];
    };
    /**
     * To check the stamping is in correct position or not
     * @param left
     * @param top
     * @param annotationWidth
     * @param annotationHeight
     * @param currentImageMaxWidth
     * @param currentOutputImageHeight
     * @param rotatedAngle
     */
    AnnotationHelper.checkStampingInResponseArea = function (left, top, annotationWidth, annotationHeight, zoneTop, currentImageMaxWidth, currentOutputImageHeight, rotatedAngle) {
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);
        if (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_0) {
            if ((Math.round(top) + Math.round(annotationHeight) - Math.round(zoneTop) >= currentOutputImageHeight) ||
                (Math.round(left) + Math.round(annotationWidth) >= currentImageMaxWidth)) {
                return false;
            }
        }
        return true;
    };
    /**
     *  To check whether stamping / drawing annotation is in grey area for stitched response.
     * @param clientX
     * @param clientY
     * @param rotatedAngle
     * @param drawDirection
     * @param annotationHolderElement
     * @param marksheetElement
     * @param index
     */
    AnnotationHelper.checkInGreyArea = function (clientX, clientY, rotatedAngle, drawDirection, annotationHolderElement, marksheetElement, index, isStamping, stampId, overlayBoundary) {
        var inGreyArea = false;
        var x;
        var y;
        var bountryPoints = [];
        var width = 0;
        var height = 0;
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);
        var stamp = stampStore.instance.getStamp(stampId);
        _a = this.getAnnotationDefaultValue(stampId, undefined, undefined, annotationHolderElement, rotatedAngle, isStamping), width = _a[0], height = _a[1];
        /**
         * Unlike dynamic annotation static annotation is placing center of the Cursor.
         * So we take the half width and height of the static annotation
         */
        if (stamp === undefined) {
            width = width / 2;
            height = height / 2;
        }
        if (isStamping) {
            bountryPoints = [
                { 'x': 0, 'y': 0 },
                { 'x': 0, 'y': height },
                { 'x': width, 'y': 0 },
                { 'x': width, 'y': height }
            ];
        }
        else {
            bountryPoints = [
                { 'x': 0, 'y': 0 }
            ];
        }
        index = index === undefined ? 0 : index;
        if (index < bountryPoints.length) {
            if (drawDirection) {
                x = clientX - bountryPoints[index].x;
                y = clientY - bountryPoints[index].y;
            }
            else {
                x = clientX + bountryPoints[index].x;
                y = clientY + bountryPoints[index].y;
            }
        }
        else {
            return false;
        }
        // No need to check the gray area check if it above the dynamic annotation
        if (!AnnotationHelper.isDynamicAnnotationElement(annotationHolderElement)) {
            var propsForGrayAreaCheck = AnnotationHelper.setElementPropertiesForGrayAreaCheck(x, y, annotationHolderElement.parentElement, marksheetElement, rotatedAngle);
            inGreyArea = !(AnnotationHelper.checkGreyAreaAfterRotationStitched(propsForGrayAreaCheck.element, propsForGrayAreaCheck.left, propsForGrayAreaCheck.top, 0, 0, propsForGrayAreaCheck.angle, propsForGrayAreaCheck.scrollTop, overlayBoundary, clientX, clientY));
        }
        if (!inGreyArea) {
            if (index < bountryPoints.length) {
                inGreyArea = this.checkInGreyArea(clientX, clientY, rotatedAngle, drawDirection, annotationHolderElement, marksheetElement, ++index, isStamping, stampId, overlayBoundary);
                if (inGreyArea) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return inGreyArea;
        }
        var _a;
    };
    /**
     * get the zIndex of curent response
     */
    AnnotationHelper.getCurrentResponseZIndex = function () {
        if (markingStore.instance.examinerMarksAgainstCurrentResponse) {
            return markingStore.instance.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId].allMarksAndAnnotations.length;
        }
        else {
            return 0;
        }
    };
    /**
     * get the zIndex for specified response
     * @param markGroupId
     */
    AnnotationHelper.getResponseZIndex = function (markGroupId) {
        return markingStore.instance.examinerMarksAgainstResponse(markGroupId).
            examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations.length;
    };
    /**
     * return the max z index value for the annotation in the response
     */
    AnnotationHelper.maxZIndex = function (markGroupId) {
        if (markGroupId === void 0) { markGroupId = undefined; }
        if (AnnotationHelper.zIndex > 0) {
            return AnnotationHelper.zIndex;
        }
        else {
            var zIndex = markGroupId === undefined ? AnnotationHelper.getCurrentResponseZIndex()
                : AnnotationHelper.getResponseZIndex(markGroupId);
            return zIndex;
        }
    };
    /**
     * Convert value to percentage.
     * @param numerator
     * @param denominator
     */
    AnnotationHelper.calculatePercentage = function (numerator, denominator) {
        return (numerator / denominator) * 100;
    };
    /**
     * find the percentage
     * @param numerator
     * @param denominator
     */
    AnnotationHelper.findPercentage = function (numerator, denominator) {
        return (numerator * (denominator / 100));
    };
    /**
     * To get annotation dimensions in percent.
     * @param stampId
     * @param width
     * @param height
     * @param annotationOverlayElementRect
     * @param currentImageMaxWidth
     * @param currentOutputImageHeight
     * @param rotatedAngle
     */
    AnnotationHelper.getAnnotationDimensionsInPercent = function (stampId, width, height, annotationOverlayElementRect, currentImageMaxWidth, currentOutputImageHeight, rotatedAngle) {
        var defaultWidthInPercentage = 0;
        var defaultHeightInPercentage = 0;
        var annotationWidthInPercent = 0;
        var annotationHeightInPercent = 0;
        var _a = this.getAnnotationDefaultValue(stampId, undefined, undefined, null, rotatedAngle), defaultWidth = _a[0], defaultHeight = _a[1];
        defaultWidthInPercentage = this.calculatePercentage((defaultWidth /
            annotationOverlayElementRect.width) * currentImageMaxWidth, currentImageMaxWidth);
        defaultHeightInPercentage = this.calculatePercentage((defaultHeight /
            annotationOverlayElementRect.height) * currentOutputImageHeight, currentOutputImageHeight);
        annotationWidthInPercent = this.calculatePercentage((width /
            annotationOverlayElementRect.width) * currentImageMaxWidth, currentImageMaxWidth);
        annotationHeightInPercent = this.calculatePercentage((height /
            annotationOverlayElementRect.height) * currentOutputImageHeight, currentOutputImageHeight);
        return [defaultWidthInPercentage, defaultHeightInPercentage, annotationWidthInPercent, annotationHeightInPercent];
    };
    /**
     * To get drawing direction.
     * @param rotatedAngle
     */
    AnnotationHelper.getDrawDirection = function (rotatedAngle) {
        var drawDirection = enums.DrawDirection.Right;
        switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
            case enums.RotateAngle.Rotate_0:
            case enums.RotateAngle.Rotate_90:
                drawDirection = enums.DrawDirection.Right;
                break;
            case enums.RotateAngle.Rotate_180:
                drawDirection = enums.DrawDirection.Bottom;
                break;
            case enums.RotateAngle.Rotate_270:
                drawDirection = enums.DrawDirection.Left;
                break;
        }
        return drawDirection;
    };
    /**
     * Get the Hline Dimenstions while drawing the HLine in rotated and normal mode.
     * @param dimensions
     * @param clientToken
     * @param rotatedAngle
     * @param left
     * @param top
     * @param annotationDataWidth
     * @param annotationDataHeight
     * @param isHorizontal
     */
    AnnotationHelper.getLineDimensions = function (dimensions, clientToken, rotatedAngle, left, top, annotationDataWidth, annotationDataHeight, isHorizontal) {
        var hLineRect = { left: 0, bottom: 0, height: 0, right: 0, top: 0, width: 0 };
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);
        if (clientToken) {
            hLineRect.left = isHorizontal ? dimensions.left : left;
            hLineRect.top = isHorizontal ? top : dimensions.top;
            hLineRect.width = dimensions.width;
            hLineRect.height = dimensions.height;
        }
        else {
            hLineRect.left = dimensions.left;
            hLineRect.top = dimensions.top;
            hLineRect.width = dimensions.width;
            hLineRect.height = dimensions.height;
        }
        return hLineRect;
    };
    /**
     * Check the page Having annottaion
     * @param pageNo
     */
    AnnotationHelper.HasPageContainsCurrentMarkGroupAnnotation = function (pageNo, hasUnmanagedSLAO) {
        if (markingStore.instance.examinerMarksAgainstCurrentResponse) {
            var currentAnnotations = Immutable.List(markingStore.instance.allAnnotationsAgainstResponse(markingStore.instance.currentMarkGroupId));
            if (hasUnmanagedSLAO) {
                return currentAnnotations.some(function (annotation) {
                    return annotation.pageNo === pageNo && annotation.stamp !== constants.LINK_ANNOTATION &&
                        annotation.markingOperation !== enums.MarkingOperation.deleted;
                });
            }
            else {
                return currentAnnotations.some(function (annotation) {
                    return annotation.pageNo === pageNo && annotation.stamp !== constants.LINK_ANNOTATION &&
                        annotation.markingOperation !== enums.MarkingOperation.deleted;
                });
            }
        }
        return false;
    };
    Object.defineProperty(AnnotationHelper, "IsSeenStampConfiguredForQIG", {
        /**
         * Get the value indicating whether the Seen stamp is configured or not
         */
        get: function () {
            return stampStore.instance.IsSeenStampConfiguredForQIG;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * get the annotations of specified mark group
     * @param markGroupId
     */
    AnnotationHelper.getExaminerMarksAgainstResponse = function (markGroupId) {
        var annotation = [];
        var showDefAnnotationsOnly = markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
            markerOperationModeFactory.operationMode.isDefinitveMarkingStarted;
        var marksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(markGroupId);
        if (marksAndAnnotations) {
            marksAndAnnotations.forEach(function (x) {
                if (x.annotations) {
                    var allAnnotations = x.annotations;
                    var maxZOrder_1 = AnnotationHelper.maxZIndex(markGroupId);
                    if (allAnnotations) {
                        allAnnotations.filter(function (annotation) {
                            // set the remark request type for the annotations
                            annotation.remarkRequestTypeId = x.remarkRequestTypeId;
                            annotation.zOrder = maxZOrder_1;
                        });
                    }
                    if (showDefAnnotationsOnly) {
                        allAnnotations = allAnnotations.filter(function (annotation) { return annotation.definitiveMark === true; });
                    }
                    allAnnotations.forEach(function (x) {
                        annotation.push(x);
                    });
                }
            });
        }
        return annotation;
    };
    /**
     * Get annotation to display in current page
     * @param imageClusterId
     * @param outputPageNo
     * @param currentImageMaxWidth
     * @param pageNo
     */
    AnnotationHelper.getCurrentAnnotationsByPageNo = function (imageClusterId, outputPageNo, currentImageMaxWidth, pageNo) {
        var annotationsToDisplayInCurrentPage;
        var currentAnnotations = Immutable.List(markingStore.instance.allAnnotationsAgainstResponse(markingStore.instance.currentMarkGroupId));
        // Reset the annotation collection
        this.annotationsToDisplayInCurrentPage = '';
        // filter current annotations
        annotationsToDisplayInCurrentPage = this.filterAnnotations(currentAnnotations, imageClusterId, outputPageNo, currentImageMaxWidth, pageNo, false);
        return annotationsToDisplayInCurrentPage;
    };
    /**
     * Get annotation to display in current page
     * @param pageNo
     * @param markGroupId
     */
    AnnotationHelper.getAnnotationsInAdditionalObjectByPageNo = function (pageNo, markGroupId) {
        var annotationsToDisplayInCurrentPage;
        var currentAnnotations = Immutable.List(AnnotationHelper.getExaminerMarksAgainstResponse(markGroupId));
        // filter current annotations
        annotationsToDisplayInCurrentPage = this.filterAnnotationsByPageNumber(currentAnnotations, pageNo);
        return annotationsToDisplayInCurrentPage;
    };
    /**
     * filter annotations based on page number
     * @param annotations
     * @param pageNo
     */
    AnnotationHelper.filterAnnotationsByPageNumber = function (annotations, pageNo) {
        var annotationsToDisplayInCurrentPage;
        var showDefAnnotationsOnly = markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
            markerOperationModeFactory.operationMode.isDefinitveMarkingStarted;
        if (showDefAnnotationsOnly) {
            // get the stamps for the page
            annotationsToDisplayInCurrentPage = annotations.filter(function (annotation) {
                return annotation.pageNo === pageNo &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted &&
                    annotation.definitiveMark === true;
            });
        }
        else {
            // get the stamps for the page
            annotationsToDisplayInCurrentPage = annotations.filter(function (annotation) {
                return annotation.pageNo === pageNo &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted;
            });
        }
        return annotationsToDisplayInCurrentPage;
    };
    /**
     * Get previous annotation to display in current page
     * @param pageNo
     * @param markGroupId
     */
    AnnotationHelper.getPreviousAnnotationsInPageNo = function (pageNo, seedType) {
        var annotationsToDisplayInCurrentPage;
        // find previous annotations
        var previousAnnotations = Immutable.List(AnnotationHelper.getCurrentMarkGroupPreviousRemarkAnnotations(seedType));
        // filter current annotations
        annotationsToDisplayInCurrentPage = this.filterAnnotationsByPageNumber(previousAnnotations, pageNo);
        return annotationsToDisplayInCurrentPage;
    };
    /**
     * returns true if page is linked or flagged as seen.
     */
    AnnotationHelper.isLinkedOrFlaggedAsSeenInPage = function (annotations) {
        var isLinkedOrFlaggedAsSeen = false;
        // The variable isLinkedOrFlaggedAsSeen is set only if flagged as seen or linked the page to a question.
        isLinkedOrFlaggedAsSeen = annotations ?
            annotations.some(function (x) {
                return (x.stamp === constants.SEEN_STAMP_ID && x.addedBySystem === true) || x.stamp === constants.LINK_ANNOTATION;
            }) : false;
        return isLinkedOrFlaggedAsSeen;
    };
    /**
     * Get the annotation count from annotation list.
     * @param favouritesStampCollection
     */
    AnnotationHelper.getStampsWithCount = function (favouritesStampCollection) {
        var annotationCounts = {};
        var currentAnnotations = AnnotationHelper.getCurrentMarkGroupAnnotation();
        var uniqueId = markingStore.instance.currentQuestionItemInfo ? markingStore.instance.currentQuestionItemInfo.uniqueId : 0;
        // Get the count of annotations from the annotation list.
        if (currentAnnotations) {
            currentAnnotations.map(function (annotation, index) {
                // Check the annotation belongs to selected question item and not a deleted one.
                if (annotation.markSchemeId === uniqueId && annotation.markingOperation !== enums.MarkingOperation.deleted) {
                    // Store the annotation Count in Key Value Pair so we no need to loop through it while getting the count.
                    if (annotationCounts[annotation.stamp]) {
                        annotationCounts[annotation.stamp] += 1;
                    }
                    else {
                        annotationCounts[annotation.stamp] = 1;
                    }
                }
            });
        }
        // Update the count for favourite stamp panel.
        favouritesStampCollection.map(function (stamp, index) {
            if (annotationCounts[stamp.stampId]) {
                stamp.count = annotationCounts[stamp.stampId];
            }
            else {
                stamp.count = 0;
            }
        });
        return favouritesStampCollection;
    };
    /**
     * Get The Annotation List For displaying annotations in Structured full response view.
     * @param pageNo
     * @param imageWidth
     * @param imageHeight
     * @param isAdditionalObject
     * @param isALinkedPage
     */
    AnnotationHelper.getAnnotationsForThePageInStructuredResponse = function (pageNo, imageWidth, imageHeight, isAdditionalObject, isALinkedPage) {
        if (pageNo === 0 || responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured) {
            return undefined;
        }
        // Collection to keep the modified annotation, to display in the page
        var annotationsForThePage = [];
        // Get the Annotations added to the response. For entire response
        var currentAnnotations = Immutable.List(markingStore.instance.allAnnotationsAgainstResponse(markingStore.instance.currentMarkGroupId)).toList();
        // exclude deleted annotations
        currentAnnotations = Immutable.List(currentAnnotations.filter(function (x) {
            return x.markingOperation !== enums.MarkingOperation.deleted;
        }));
        // Get the Image Cluster Ids, associated with this page
        var imageClusters = AnnotationHelper.getImageClustersForThePage(pageNo);
        // Loop the Image Clusters and check the zones for the clusters
        imageClusters.forEach(function (imageClusterIdInPage) {
            //  Get the annotations added for this image cluster.
            var annotationsAgainstCluster = currentAnnotations.filter(function (annotation) {
                return annotation.imageClusterId === imageClusterIdInPage;
            }).toArray();
            // Get the zones associated with this cluster
            var imageZonesForTheCluster = AnnotationHelper.getZonesFortheImageCluster(imageClusterIdInPage);
            // Loop the annotations against the clusters and check the annotation is relevent to this page.
            annotationsAgainstCluster.forEach(function (annotation) {
                var zoneHeight = 0;
                var breakAnnotationCheck = false;
                var lastOutPutPageNo = 0;
                // Loop the Zones for validating the annotations with page
                imageZonesForTheCluster.forEach(function (imageZone) {
                    // Check the annotation found in a page, or the output page no got changed during loop.
                    if (!breakAnnotationCheck || lastOutPutPageNo !== imageZone.outputPageNo) {
                        // Get the zone height.
                        var currentZoneHeight = imageHeight * (imageZone.height / 100);
                        // If output page no got changed, Reset the calculated zone height.
                        if (lastOutPutPageNo > 0 && lastOutPutPageNo !== imageZone.outputPageNo) {
                            zoneHeight = 0;
                        }
                        lastOutPutPageNo = imageZone.outputPageNo;
                        // sum the zone height, related to the zone (stitched image)
                        zoneHeight += currentZoneHeight;
                        // Check the annotation top edge belogs to the calculated zone area.
                        if (zoneHeight - annotation.topEdge >= 0 && annotation.outputPageNo === imageZone.outputPageNo) {
                            // Make sure it  is in the same page. If so adjust the top and left.
                            if (imageZone.pageNo === pageNo) {
                                // Create a clone of the annotaion.
                                var cloneOfA = JSON.parse(JSON.stringify(annotation));
                                // If on page comment, calculate height and width
                                if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                                    cloneOfA.height = (imageHeight * (imageZone.topEdge / 100)) + annotation.height;
                                    cloneOfA.width = (imageWidth * (imageZone.leftEdge / 100)) + annotation.width;
                                    /* Check the top edge exceeds zone height(excluding the current zone height),
                                    If so decrease the top.*/
                                    if (cloneOfA.height > zoneHeight - currentZoneHeight) {
                                        cloneOfA.height -= zoneHeight - currentZoneHeight;
                                    }
                                }
                                else {
                                    // top and left are stored related to the zone in database
                                    // It should be alterd related to the current image.
                                    cloneOfA.topEdge = (imageHeight * (imageZone.topEdge / 100)) + annotation.topEdge;
                                    cloneOfA.leftEdge = (imageWidth * (imageZone.leftEdge / 100)) + annotation.leftEdge;
                                    /* Check the top edge exceeds zone height(excluding the current zone height),
                                    If so decrease the top.*/
                                    if (cloneOfA.topEdge > zoneHeight - currentZoneHeight) {
                                        cloneOfA.topEdge -= zoneHeight - currentZoneHeight;
                                    }
                                }
                                // add alterd annotation to the collection.
                                annotationsForThePage.push(cloneOfA);
                            }
                            // Indicate the flag for skipping loop for the next zone.
                            breakAnnotationCheck = true;
                        }
                    }
                });
            });
        });
        // get all the annotations on the linked page
        if (isALinkedPage || isAdditionalObject) {
            annotationsForThePage = annotationsForThePage.concat(currentAnnotations.filter(function (annotation) { return annotation.pageNo === pageNo &&
                annotation.stamp !== constants.LINK_ANNOTATION; }).toArray());
        }
        // return the annotation list for rendering in the page.
        return Immutable.List(annotationsForThePage);
    };
    /**
     * get the zones associated with a page.
     * @param imageClusterId
     */
    AnnotationHelper.getZonesFortheImageCluster = function (imageClusterId) {
        var imageZones;
        if (imageZoneStore.instance.imageZoneList != null) {
            imageZones = imageZoneStore.instance.imageZoneList.imageZones;
            var imageZonesForTheCluster = imageZones.filter(function (imageZone) { return imageZone.imageClusterId === imageClusterId; }).
                sort(function (obj1, obj2) {
                return (obj1.sequence > obj2.sequence) ? 0 : -1;
            });
            return Immutable.List(imageZonesForTheCluster);
        }
    };
    /**
     * get the zones associated with a mark scheme.
     * @param markSchemeId
     */
    AnnotationHelper.getZonesFortheMarkScheme = function (markSchemeId) {
        var imageZones;
        var candidateScriptId = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString()).candidateScriptId;
        if (imageZoneStore.instance.candidateScriptImageZoneList != null) {
            imageZones = imageZoneStore.instance.candidateScriptImageZoneList.get(candidateScriptId);
            var imageZonesForTheMakScheme = imageZones.filter(function (imageZone) { return imageZone.markSchemeId === markSchemeId; }).
                sort(function (imgZone1, imgZone2) {
                return (imgZone1.sequence > imgZone2.sequence) ? 0 : -1;
            });
            return Immutable.List(imageZonesForTheMakScheme);
        }
    };
    /**
     * Get the image cluster Ids associated with page no.
     * @param pageNo
     */
    AnnotationHelper.getImageClustersForThePage = function (pageNo) {
        var imageClusterIds = [];
        var imageZones;
        if (imageZoneStore.instance.imageZoneList != null) {
            imageZones = imageZoneStore.instance.imageZoneList.imageZones;
            var imageZonesForPage = Immutable.List(imageZones.filter(function (imageZone) { return imageZone.pageNo === pageNo; }));
            imageZonesForPage.forEach(function (imageZone) {
                if (imageClusterIds.indexOf(imageZone.imageClusterId) < 0) {
                    imageClusterIds.push(imageZone.imageClusterId);
                }
            });
        }
        return imageClusterIds;
    };
    /**
     * Get the mark scheme ids associated with page no.
     * @param pageNo
     */
    AnnotationHelper.getMarkSchemesForThePage = function (pageNo) {
        var markSchemeIds = [];
        var candidateScriptId = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString()).candidateScriptId;
        var imageZones;
        if (imageZoneStore.instance.candidateScriptImageZoneList != null) {
            imageZones = imageZoneStore.instance.candidateScriptImageZoneList.get(candidateScriptId);
            var imageZonesForPage = Immutable.List(imageZones.filter(function (imageZone) { return imageZone.pageNo === pageNo; }));
            imageZonesForPage.forEach(function (imageZone) {
                if (markSchemeIds.indexOf(imageZone.markSchemeId) < 0) {
                    markSchemeIds.push(imageZone.markSchemeId);
                }
            });
        }
        return markSchemeIds;
    };
    /**
     * Gets the image zone boundary list of the stitched images.
     * @param {any} element
     */
    AnnotationHelper.getStitchedImageBoundary = function (element, angle) {
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
                    angle = this.getAngleforRotation(angle);
                    // Computing the 3% margin in pixel to calculate the distance from top to the gray area.
                    var elem = imageZones[i].getBoundingClientRect();
                    var startEdge = void 0;
                    var endEdge = void 0;
                    if (angle === enums.RotateAngle.Rotate_90 || angle === enums.RotateAngle.Rotate_270) {
                        startEdge = elem.left;
                        endEdge = elem.right;
                    }
                    else {
                        startEdge = elem.top;
                        endEdge = elem.bottom;
                    }
                    // Store the boundary.
                    boundary.push({
                        //start: seperator, end: nextImageZone.offsetTop,
                        start: startEdge, end: endEdge,
                        imageWidth: imageZones[i].clientWidth, imageHeight: imageZones[i].clientHeight,
                        top: elem.top, left: elem.left
                    });
                }
            }
        }
        return boundary;
    };
    /**
     * Validating the dynamic annotation draw or mouse move to check whether the annotation is overlaps the
     * annotation gap.
     * @param annotationRect
     * @param annotationHolderElement
     * @param marksheetElement
     * @param rotatedAngle
     * @param blockThreshold
     */
    AnnotationHelper.validateAnnotaionBoundaryOnStitchedImageGap = function (annotationRect, annotationHolderRect, overlayBoundary, rotatedAngle, blockThreshold, action) {
        if (blockThreshold === void 0) { blockThreshold = 0; }
        if (action === void 0) { action = enums.AddAnnotationAction.Pan; }
        var isValid = true;
        var blockThresholdAtStart = blockThreshold;
        // Adding a 5px gap fixed tp prevent placing lines athe the very end.
        var blockThresholdAtEnd = 5;
        var annotationBoundaryCoordinates = [];
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);
        if (overlayBoundary && overlayBoundary.length > 0) {
            var insideScript = false;
            var annotationBoundaryEnd = 0;
            var annotationBoundaryStart = 0;
            // Apply the rotation values.
            switch (rotatedAngle) {
                case enums.RotateAngle.Rotate_0:
                case enums.RotateAngle.Rotate_360:
                    if (action === enums.AddAnnotationAction.Stamping) {
                        annotationBoundaryStart = annotationRect.top;
                        annotationBoundaryEnd = annotationRect.top + annotationRect.height;
                    }
                    else {
                        annotationBoundaryStart = annotationRect.top;
                        annotationBoundaryEnd = annotationBoundaryStart + annotationRect.height;
                    }
                    blockThresholdAtStart = blockThreshold;
                    break;
                case enums.RotateAngle.Rotate_90:
                    if (action === enums.AddAnnotationAction.Stamping) {
                        annotationBoundaryStart = annotationRect.left;
                        annotationBoundaryEnd = annotationRect.left + annotationRect.width;
                    }
                    else {
                        annotationBoundaryStart =
                            annotationHolderRect.right
                                - ((annotationRect.top - annotationHolderRect.top) + annotationRect.height);
                        annotationBoundaryEnd = annotationBoundaryStart + annotationRect.height;
                    }
                    blockThresholdAtStart = blockThresholdAtEnd;
                    blockThresholdAtEnd = blockThreshold;
                    break;
                case enums.RotateAngle.Rotate_180:
                    if (action === enums.AddAnnotationAction.Stamping) {
                        annotationBoundaryStart = annotationRect.top - annotationRect.height;
                        annotationBoundaryEnd = annotationRect.top;
                    }
                    else {
                        // image rotation puerly dependend on css, meanwhile we have to calculate
                        // start and end points from header portion(lyk image is in 360).
                        annotationBoundaryStart =
                            annotationHolderRect.bottom - (annotationRect.top + annotationRect.height)
                                + annotationHolderRect.top;
                        annotationBoundaryEnd = annotationBoundaryStart + annotationRect.height;
                    }
                    blockThresholdAtStart = blockThresholdAtEnd;
                    blockThresholdAtEnd = blockThreshold;
                    break;
                case enums.RotateAngle.Rotate_270:
                    if (action === enums.AddAnnotationAction.Stamping) {
                        annotationBoundaryStart = annotationRect.left;
                        annotationBoundaryEnd = annotationRect.left + annotationRect.width;
                    }
                    else {
                        annotationBoundaryStart = annotationHolderRect.left +
                            (annotationRect.top - annotationHolderRect.top);
                        annotationBoundaryEnd = annotationBoundaryStart + annotationRect.height;
                    }
                    blockThresholdAtStart = blockThreshold;
                    break;
            }
            for (var i = 0; i < overlayBoundary.length; i++) {
                if (annotationBoundaryStart > (overlayBoundary[i].start + blockThresholdAtStart) &&
                    annotationBoundaryStart < (overlayBoundary[i].end - blockThresholdAtEnd) &&
                    annotationBoundaryEnd > (overlayBoundary[i].start + blockThresholdAtStart) &&
                    annotationBoundaryEnd < (overlayBoundary[i].end - blockThresholdAtEnd)) {
                    insideScript = true;
                }
            }
            isValid = insideScript;
        }
        return isValid;
    };
    /**
     * return annotations to display in the linked page
     * @param isALinkedPage
     * @param imageClusterId
     * @param currentImageMaxWidth
     * @param zoneTop
     * @param zoneHeight
     * @param outputPageNo
     * @param multipleMarkSchemes
     * @param doShowPreviousMarkerLinkedPages
     * @param seedType
     */
    AnnotationHelper.getAnnotationsToDisplayInLinkingScenarios = function (isALinkedPage, imageClusterId, currentImageMaxWidth, topAboveCurrentZone, zoneHeight, outputPageNo, pageNo, multipleMarkSchemes, doShowPreviousMarkerLinkedPages, seedType, isEBookMarking) {
        var currentAnnotations = markingStore.instance.allAnnotationsAgainstResponse(markingStore.instance.currentMarkGroupId);
        var displayOrder = 1;
        var isIeOrEdge = htmlUtilities.isIE || htmlUtilities.isEdge;
        if (isIeOrEdge) {
            // add display order for each annotation. fix for annotation not disappear after moving in linked page IE #54209
            currentAnnotations.map(function (item) {
                item.displayOrder = displayOrder++;
            });
        }
        // get the previous annotations
        if (this.doShowPreviousAnnotations && doShowPreviousMarkerLinkedPages) {
            var previousRemarkAnnotations = AnnotationHelper.getCurrentMarkGroupPreviousRemarkAnnotations(seedType);
            if (currentAnnotations) {
                previousRemarkAnnotations.map(function (annotation) {
                    annotation.isPrevious = true;
                });
                currentAnnotations = currentAnnotations.concat(previousRemarkAnnotations);
            }
        }
        var annotationsToDisplayInCurrentPage = Immutable.List();
        // get annotations based on page number
        multipleMarkSchemes.treeViewItemList.map(function (item) {
            annotationsToDisplayInCurrentPage = annotationsToDisplayInCurrentPage.concat(currentAnnotations.filter(function (annotation) {
                return annotation.pageNo === pageNo &&
                    annotation.stamp !== constants.LINK_ANNOTATION &&
                    annotation.markSchemeId === item.uniqueId &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted;
            })).toList();
        });
        // return the annotations which are placed in linked page which have no image cluster id
        // case for linking SLAOs and other pages which are not as part of current zones
        if (isALinkedPage === true && imageClusterId === 0) {
            return annotationsToDisplayInCurrentPage;
        }
        // Dispaly "SEEN" annoatation only if page is linked to that question item.
        if (isEBookMarking && !isALinkedPage) {
            annotationsToDisplayInCurrentPage = annotationsToDisplayInCurrentPage.filter(function (annotation) {
                return annotation.addedBySystem !== true;
            }).toList();
        }
        multipleMarkSchemes.treeViewItemList.map(function (item) {
            // get annotations based on the top left values of the zone
            annotationsToDisplayInCurrentPage = annotationsToDisplayInCurrentPage.concat(currentAnnotations.filter(function (annotation) {
                return annotation.imageClusterId === imageClusterId &&
                    annotation.leftEdge <= currentImageMaxWidth &&
                    annotation.topEdge >= topAboveCurrentZone &&
                    annotation.topEdge <= topAboveCurrentZone + zoneHeight &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted &&
                    annotation.outputPageNo === outputPageNo &&
                    annotation.markSchemeId === item.uniqueId;
            })).toList();
        });
        if (isIeOrEdge) {
            // sort items based on display order
            annotationsToDisplayInCurrentPage = annotationsToDisplayInCurrentPage.sort(function (a, b) {
                return a.displayOrder - b.displayOrder;
            }).toList();
        }
        return annotationsToDisplayInCurrentPage;
    };
    /**
     * determine the output page for annotation
     * @param doApplyLinkingScenarios
     * @param imageZones
     * @param imageZone
     * @param outputPageNo
     */
    AnnotationHelper.getOutputPageNo = function (doApplyLinkingScenarios, imageZones, imageZone, outputPageNo) {
        var outputPageNumber = 0;
        if (doApplyLinkingScenarios === true) {
            if (imageZones && imageZones.length > 0) {
                // for stitched images
                outputPageNumber = imageZones[0].outputPageNo;
            }
            else if (imageZone) {
                // for single image viewer
                outputPageNumber = imageZone.outputPageNo;
            }
            else {
                // for single image viewer with no zones
                outputPageNumber = outputPageNo;
            }
        }
        else {
            // work as normal if linking scenario is not enabled
            outputPageNumber = outputPageNo;
        }
        return outputPageNumber;
    };
    /**
     * filter annotation disticlty by page number
     * @param annotations
     */
    AnnotationHelper.filetrAnnotationsDistinctlyByPageNo = function (annotations) {
        var distinctAnnotations = [];
        annotations.forEach(function (annotation) {
            var annotationsInSpecificPage = distinctAnnotations.filter(function (distinctAnnotation) {
                return distinctAnnotation.pageNo === annotation.pageNo;
            });
            if (annotationsInSpecificPage.length === 0) {
                distinctAnnotations.push(annotation);
            }
        });
        return distinctAnnotations;
    };
    /**
     * Returns Corrected anotation rect values while drawing dynamic annotation.
     * @param annotationRect
     * @param annotationOverlayRect
     * @param rotatedAngle
     */
    AnnotationHelper.getAnnotationRectOnDrawing = function (annotationRect, annotationOverlayRect, rotatedAngle) {
        // Handle dynamic annotation Drawing scenarios
        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_180:
                // we have to find top from the bottom side of page
                annotationRect.top =
                    annotationOverlayRect.bottom -
                        ((annotationRect.top - annotationOverlayRect.top) + annotationRect.height);
                break;
            case enums.RotateAngle.Rotate_90:
                annotationRect.top =
                    annotationOverlayRect.right -
                        ((annotationRect.top - annotationOverlayRect.top) + annotationRect.height);
                break;
        }
        return annotationRect;
    };
    /**
     * return true if the event is cancelled
     * @param event
     */
    AnnotationHelper.isEventCanceled = function (event) {
        var isEventCanceled = false;
        if (event && event.srcEvent) {
            isEventCanceled = event.srcEvent.type === 'pointercancel';
        }
        return isEventCanceled;
    };
    /**
     *  Calculates the stitched image gap offset
     * @param displayAngle
     * @param stitchedImageIndex
     * @param overlayBoundary
     * @param annotationOverlayParentElement
     */
    AnnotationHelper.calculateStitchedImageGapOffset = function (displayAngle, stitchedImageIndex, overlayBoundary, annotationOverlayParentElement) {
        var stitchedImageSeperator = 0;
        // We are checking index comes under the overlay boundary length because, in IE
        // when Marksheet-Holder animation works, it will not give correct width and height of the annotation
        // overlay. So stitchedImageIndex wille be outOfIndex. To resolve that we will
        // allow the annotationoverlay to render for the first time and in another render after the
        // animation over will set with the actual values.
        if (stitchedImageIndex > 0 && stitchedImageIndex < overlayBoundary.length) {
            switch (displayAngle) {
                case enums.RotateAngle.Rotate_360:
                case enums.RotateAngle.Rotate_0:
                    stitchedImageSeperator = overlayBoundary[stitchedImageIndex].start
                        - overlayBoundary[stitchedImageIndex - 1].end;
                    break;
                case enums.RotateAngle.Rotate_90:
                    stitchedImageSeperator = overlayBoundary[stitchedImageIndex - 1].start
                        - overlayBoundary[stitchedImageIndex].end;
                    break;
                case enums.RotateAngle.Rotate_270:
                    stitchedImageSeperator = overlayBoundary[stitchedImageIndex].start
                        - overlayBoundary[stitchedImageIndex - 1].end;
                    break;
                case enums.RotateAngle.Rotate_180:
                    stitchedImageSeperator = overlayBoundary[stitchedImageIndex - 1].start
                        - overlayBoundary[stitchedImageIndex].end;
                    break;
            }
            stitchedImageSeperator = (stitchedImageSeperator / annotationOverlayParentElement.clientHeight) * 100;
            stitchedImageSeperator = stitchedImageSeperator * stitchedImageIndex;
        }
        return stitchedImageSeperator;
    };
    /**
     * Is the element an acetate
     * @param element
     */
    AnnotationHelper.isAcetate = function (element, excludeAcetateResizer) {
        if (excludeAcetateResizer === void 0) { excludeAcetateResizer = false; }
        var acetateAttributes = ['overlay-hit-area-line', 'overlay-plus-hover', 'overlay-mover-area'];
        acetateAttributes = excludeAcetateResizer ? acetateAttributes.splice(0, 2) : acetateAttributes;
        if (element && element.attributes) {
            var elementClassName = element.attributes.getNamedItem('class') ? element.attributes.getNamedItem('class').nodeValue : '';
            for (var _i = 0, acetateAttributes_1 = acetateAttributes; _i < acetateAttributes_1.length; _i++) {
                var acetateAttribute = acetateAttributes_1[_i];
                if (elementClassName.indexOf(acetateAttribute) > -1) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Get Annotations For The Page In EBookMarking
     * @param pageNo
     * @param imageWidth
     * @param imageHeight
     * @param isAdditionalObject
     * @param isALinkedPage
     */
    AnnotationHelper.getAnnotationsForThePageInEBookMarking = function (pageNo, imageWidth, imageHeight, isALinkedPage, isEResponse) {
        var _this = this;
        if (pageNo === 0) {
            return undefined;
        }
        // Collection to keep the modified annotation, to display in the page
        var annotationsForThePage = [];
        // Get the Annotations added to the response. For entire response
        var currentAnnotations = Immutable.List(AnnotationHelper.getCurrentMarkGroupAnnotation());
        // exclude deleted annotations
        currentAnnotations = Immutable.List(currentAnnotations.filter(function (x) {
            return x.markingOperation !== enums.MarkingOperation.deleted;
        }));
        // For an EResponse return annotations to display for the page.
        if (isEResponse) {
            return Immutable.List(currentAnnotations.filter(function (x) { return x.pageNo === pageNo; }));
        }
        else {
            // Get the Image Cluster Ids, associated with this page
            var markSchemes = AnnotationHelper.getMarkSchemesForThePage(pageNo);
            // Loop the Image Clusters and check the zones for the clusters
            markSchemes.forEach(function (markSchemeId) {
                //  Get the annotations added for this image cluster.
                var annotationsAgainstMarkScheme = currentAnnotations.filter(function (annotation) {
                    return annotation.markSchemeId === markSchemeId;
                }).toArray();
                // Get the zones associated with this cluster
                var imageZonesForTheMarkScheme = AnnotationHelper.getZonesFortheMarkScheme(markSchemeId);
                annotationsForThePage = _this.validateAndGetAnnotationsAgainstMarkScheme(imageZonesForTheMarkScheme, imageHeight, annotationsAgainstMarkScheme, pageNo, annotationsForThePage);
            });
            var imageZones = imageZoneStore.instance.currentCandidateScriptImageZone;
            // get unmananged zones of the page number
            var unManagedZones = (imageZones ? imageZones.filter(function (x) {
                return x.docStorePageQuestionTagTypeId === 4 && x.pageNo === pageNo;
            }) : undefined);
            // get all the annotations on the linked page and unmanaged zones
            if (isALinkedPage || (unManagedZones && unManagedZones.count() > 0)) {
                annotationsForThePage = annotationsForThePage.concat(currentAnnotations.filter(function (annotation) { return annotation.pageNo === pageNo &&
                    annotation.stamp !== constants.LINK_ANNOTATION; }).toArray());
            }
        }
        // return the annotation list for rendering in the page.
        return Immutable.List(annotationsForThePage);
    };
    /**
     * validate and get annotations against mark scvheme.
     * @param imageZones
     * @param imageHeight
     * @param annotations
     * @param pageNo
     * @param annotationsForThePage
     */
    AnnotationHelper.validateAndGetAnnotationsAgainstMarkScheme = function (imageZones, imageHeight, annotations, pageNo, annotationsForThePage) {
        // Loop the annotations against the clusters and check the annotation is relevent to this page.
        annotations.forEach(function (annotation) {
            var zoneHeight = 0;
            var breakAnnotationCheck = false;
            var lastOutPutPageNo = 0;
            // Loop the Zones for validating the annotations with page
            imageZones.forEach(function (imageZone) {
                // Check the annotation found in a page, or the output page no got changed during loop.
                if (!breakAnnotationCheck || lastOutPutPageNo !== imageZone.outputPageNo) {
                    // Get the zone height.
                    var currentZoneHeight = imageHeight * (imageZone.height / 100);
                    // If output page no got changed, Reset the calculated zone height.
                    if (lastOutPutPageNo > 0 && lastOutPutPageNo !== imageZone.outputPageNo) {
                        zoneHeight = 0;
                    }
                    lastOutPutPageNo = imageZone.outputPageNo;
                    // sum the zone height, related to the zone (stitched image)
                    zoneHeight += currentZoneHeight;
                    // Check the annotation top edge belogs to the calculated zone area.
                    if (annotation.outputPageNo === imageZone.outputPageNo) {
                        // Make sure it  is in the same page. If so adjust the top and left.
                        if (imageZone.pageNo === pageNo) {
                            // Create a clone of the annotaion.
                            var cloneOfA = JSON.parse(JSON.stringify(annotation));
                            // If on page comment, calculate height and width
                            if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                                cloneOfA.height = annotation.height;
                                cloneOfA.width = annotation.width;
                                /* Check the top edge exceeds zone height(excluding the current zone height),
                                If so decrease the top.*/
                                if (cloneOfA.height > zoneHeight - currentZoneHeight) {
                                    cloneOfA.height -= zoneHeight - currentZoneHeight;
                                }
                            }
                            else {
                                // top and left are stored related to the zone in database
                                // It should be alterd related to the current image.
                                cloneOfA.topEdge = annotation.topEdge;
                                cloneOfA.leftEdge = annotation.leftEdge;
                                /* Check the top edge exceeds zone height(excluding the current zone height),
                                If so decrease the top.*/
                                if (cloneOfA.topEdge > zoneHeight - currentZoneHeight) {
                                    cloneOfA.topEdge -= zoneHeight - currentZoneHeight;
                                }
                            }
                            // add alterd annotation to the collection.
                            annotationsForThePage.push(cloneOfA);
                        }
                        // Indicate the flag for skipping loop for the next zone.
                        breakAnnotationCheck = true;
                    }
                }
            });
        });
        return annotationsForThePage;
    };
    /**
     * Method to calculate annotation coordinates on rotate
     * Different implementation for EBM Components
     * @param left
     * @param top
     * @param rotatedAngle
     * @param naturalWidth
     * @param zoneTop
     * @param element
     * @param currentOutputImageHeight
     */
    AnnotationHelper.getEbookmarkingAnnotationCoordinateOnRotate = function (left, top, rotatedAngle, naturalWidth, zoneTop, currentOutputImageHeight, element) {
        var annotationLeft = 0;
        var annotationTop = 0;
        var width = 0;
        var height = 0;
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);
        // Handle both linked and zoned page rotation
        // Calculate annotation top, left relative to natural height.
        // for linked page, the full page will show and there is no zone available
        // so no need to consider zone top while calulating annotation top.
        // for zoned page, we should consider adding annotation top to the zone top as annotation shows against zone.
        switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
            case enums.RotateAngle.Rotate_0:
            case enums.RotateAngle.Rotate_180:
            case enums.RotateAngle.Rotate_360:
                annotationTop = (zoneTop + (top / element.clientHeight) * currentOutputImageHeight);
                annotationLeft = (left / element.clientWidth) * naturalWidth;
                break;
            case enums.RotateAngle.Rotate_90:
            case enums.RotateAngle.Rotate_270:
                // While rotating 90/270, add zone top to the left.
                annotationTop = (top / element.clientHeight) * currentOutputImageHeight;
                annotationLeft = (zoneTop + (left / element.clientWidth) * naturalWidth);
                break;
        }
        return [annotationLeft, annotationTop];
    };
    /**
     * return annotation context menu data.
     */
    AnnotationHelper.getContextMenuData = function (clientToken, annotationOverlayWidth, annotation) {
        var data;
        data = new annotationContextMenuData;
        data.contextMenuType = enums.ContextMenuType.annotation;
        data.clientToken = clientToken;
        data.annotationData = annotation;
        data.annotationOverlayWidth = annotationOverlayWidth;
        return data;
    };
    /**
     * // get all the linked annotations against image cluster id which are not against current question item
     */
    AnnotationHelper.getLinkedAnnotationsAgainstImage = function (markSchemesWithSameImages, currentmarkingAnnotations) {
        var linkedAnnotations = [];
        if (markSchemesWithSameImages && markSchemesWithSameImages.count() > 1) {
            markSchemesWithSameImages.map(function (item) {
                currentmarkingAnnotations.filter(function (annotation) {
                    if (annotation.stamp === constants.LINK_ANNOTATION &&
                        annotation.markSchemeId === item.uniqueId &&
                        annotation.markingOperation !== enums.MarkingOperation.deleted) {
                        linkedAnnotations.push(annotation);
                    }
                });
            });
            linkedAnnotations = linkedAnnotations.filter(function (item) { return item !== undefined; });
        }
        return linkedAnnotations;
    };
    /**
     * Finds the annotations to be displayed for EBookMarking responses.
     * @param linkedAnnotations
     * @param markSchemesWithSameImages
     * @param outputPageNo
     * @param currentImageMaxWidth
     * @param annotations
     */
    AnnotationHelper.findAnnotationsToDisplayForEBookMarking = function (linkedAnnotations, markSchemesWithSameImages, outputPageNo, currentImageMaxWidth, annotations) {
        var _this = this;
        if (markSchemesWithSameImages && markSchemesWithSameImages.count() > 1) {
            if (linkedAnnotations && linkedAnnotations.length > 0) {
                AnnotationHelper.findAnnotationsAgainstOutputPageForMarkscheme(annotations, outputPageNo, currentImageMaxWidth);
            }
            else {
                // Get the stamps for the mark scheme id and the ouput page no.
                this.annotationsToDisplayInCurrentPage = Immutable.List();
                markSchemesWithSameImages.map(function (item) {
                    _this.annotationsToDisplayInCurrentPage = _this.annotationsToDisplayInCurrentPage.concat(annotations.filter(function (annotation) {
                        return annotation.markSchemeId === item.uniqueId &&
                            annotation.outputPageNo === outputPageNo
                            && annotation.leftEdge <= currentImageMaxWidth
                            && annotation.markingOperation !== enums.MarkingOperation.deleted
                            && annotation.stamp !== constants.LINK_ANNOTATION;
                    }));
                });
            }
        }
        else {
            AnnotationHelper.findAnnotationsAgainstOutputPageForMarkscheme(annotations, outputPageNo, currentImageMaxWidth);
        }
    };
    /**
     * Finds the annotations to be displayed for structured responses.
     * @param linkedAnnotations
     * @param outputPageNo
     * @param imageClusterId
     * @param currentImageMaxWidth
     * @param annotations
     */
    AnnotationHelper.findAnnotationsToDisplayForStructured = function (linkedAnnotations, outputPageNo, imageClusterId, currentImageMaxWidth, annotations) {
        if (linkedAnnotations && linkedAnnotations.length > 0) {
            this.annotationsToDisplayInCurrentPage = annotations.filter(function (annotation) {
                return annotation.imageClusterId === imageClusterId &&
                    annotation.outputPageNo === outputPageNo
                    && annotation.leftEdge <= currentImageMaxWidth
                    && annotation.markingOperation !== enums.MarkingOperation.deleted
                    && annotation.stamp !== constants.LINK_ANNOTATION
                    && annotation.markSchemeId === markingStore.instance.currentMarkSchemeId;
            });
        }
        else {
            // Get the stapms for the imageClusterId and the ouput page no.
            this.annotationsToDisplayInCurrentPage = annotations.filter(function (annotation) {
                return annotation.imageClusterId === imageClusterId &&
                    annotation.outputPageNo === outputPageNo
                    && annotation.leftEdge <= currentImageMaxWidth
                    && annotation.markingOperation !== enums.MarkingOperation.deleted
                    && annotation.stamp !== constants.LINK_ANNOTATION;
            });
        }
    };
    /**
     * Finds the annotations to be displayed against the outptut page for a markscheme.
     * @param annotations
     * @param outputPageNo
     * @param currentImageMaxWidth
     */
    AnnotationHelper.findAnnotationsAgainstOutputPageForMarkscheme = function (annotations, outputPageNo, currentImageMaxWidth) {
        // Get the stamps for the mark scheme id and the ouput page no.
        this.annotationsToDisplayInCurrentPage = annotations.filter(function (annotation) {
            return annotation.markSchemeId === markingStore.instance.currentMarkSchemeId &&
                annotation.outputPageNo === outputPageNo
                && annotation.leftEdge <= currentImageMaxWidth
                && annotation.markingOperation !== enums.MarkingOperation.deleted
                && annotation.stamp !== constants.LINK_ANNOTATION;
        });
    };
    /* zindex for the static annotation */
    AnnotationHelper.zIndex = 0;
    /**
     * getDimensionsToRetain function is to get the dimensions to retain.
     * @param currentRect
     */
    AnnotationHelper.getDimensionsToRetain = function (currentRect, resizeMinVal, initialCoordinates, displayAngle, stampId) {
        var blnIsRetain = false;
        /** To check whether the rotated angle is 90/270 */
        var blnIsOddAngle = AnnotationHelper.IsOddangle(AnnotationHelper.getAngleforRotation(displayAngle));
        switch (stampId) {
            case enums.DynamicAnnotation.HorizontalLine:
            case enums.DynamicAnnotation.HWavyLine:
                /** If width is greater than height  ,width should be considered and viceversa(applicable during rotation) */
                if (initialCoordinates.width > initialCoordinates.height) {
                    if (blnIsOddAngle) {
                        if (currentRect.height < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    }
                    else {
                        if (currentRect.width < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    }
                }
                else {
                    if (blnIsOddAngle) {
                        if (currentRect.width < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    }
                    else {
                        if (currentRect.height < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    }
                }
                break;
            case enums.DynamicAnnotation.VWavyLine:
                /** If width is greater than height,width should be considered and viceversa(applicable during rotation) */
                if (initialCoordinates.width > initialCoordinates.height) {
                    if (blnIsOddAngle) {
                        if (currentRect.height < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    }
                    else {
                        if (currentRect.width < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    }
                }
                else {
                    if (blnIsOddAngle) {
                        if (currentRect.width < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    }
                    else {
                        if (currentRect.height < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    }
                }
                break;
            case enums.DynamicAnnotation.Highlighter:
            case enums.DynamicAnnotation.Ellipse:
                if (currentRect.width < resizeMinVal.width || (currentRect.height < resizeMinVal.height)) {
                    blnIsRetain = true;
                }
                break;
        }
        /** If true the dynamic annotation would be retained */
        return blnIsRetain;
    };
    /**
     * Get the actual angle while rotation.
     * @param rotatedAngle
     */
    AnnotationHelper.getAngleforRotation = function (rotatedAngle) {
        if (typeof rotatedAngle === 'undefined') {
            rotatedAngle = 0;
        }
        rotatedAngle = rotatedAngle % enums.RotateAngle.Rotate_360;
        if (rotatedAngle < 0) {
            rotatedAngle = enums.RotateAngle.Rotate_360 + rotatedAngle;
            rotatedAngle = Math.abs(rotatedAngle);
        }
        return rotatedAngle;
    };
    /**
     * Set the properties for gray area checking.
     * @param {number} left
     * @param {number} top
     * @param {any} element
     * @param {HTMLElement} marksheetElement
     * @param {number} rotateAngle
     * @returns
     */
    AnnotationHelper.setElementPropertiesForGrayAreaCheck = function (left, top, element, marksheetElement, rotateAngle) {
        left = left - element.getBoundingClientRect().left;
        top = top - element.getBoundingClientRect().top;
        var angle = AnnotationHelper.getAngleforRotation(rotateAngle);
        var marksheetWrapperElement = element.parentElement;
        var propsForGrayAreaCheck = {
            'element': element,
            'left': left,
            'top': top,
            'angle': angle,
            'scrollTop': marksheetElement.scrollTop
        };
        if (angle === enums.RotateAngle.Rotate_180 || angle === enums.RotateAngle.Rotate_90) {
            propsForGrayAreaCheck.element = element.previousElementSibling;
            if (angle === enums.RotateAngle.Rotate_180) {
                propsForGrayAreaCheck.left = left + element.getBoundingClientRect().left;
            }
        }
        else if (angle === enums.RotateAngle.Rotate_270) {
            propsForGrayAreaCheck.top = (top + element.getBoundingClientRect().top) + marksheetElement.scrollTop;
            propsForGrayAreaCheck.element = marksheetWrapperElement.firstElementChild;
        }
        else {
            propsForGrayAreaCheck.element = marksheetWrapperElement.firstElementChild;
        }
        return propsForGrayAreaCheck;
    };
    /**
     * Check if mouse position has gone outside the response area.
     * @param {any} event
     * @param {string} annotationtype?
     * @param {Element} annotationElement?
     * @param {number} angle?
     * @param {number} stampId?
     * @param {boolean} isStamping?
     * @returns
     */
    AnnotationHelper.checkMouseDrawingOutsideResponseArea = function (event, annotationtype, annotationElement, angle, stampId, isStamping) {
        var element = annotationElement;
        var actualX = event.changedPointers !== undefined ? event.changedPointers[0].clientX : event.clientX;
        var actualY = event.changedPointers !== undefined ? event.changedPointers[0].clientY : event.clientY;
        angle = AnnotationHelper.getAngleforRotation(angle);
        var _a = [0, 0], defaultWidth = _a[0], defaultHeight = _a[1];
        if (stampId) {
            _b = AnnotationHelper.getAnnotationDefaultValue(stampId, undefined, undefined, annotationElement, angle, isStamping), defaultWidth = _b[0], defaultHeight = _b[1];
        }
        else {
            _c = [constants.DEFAULT_HIGHLIGHTER_WIDTH, constants.DEFAULT_HIGHLIGHTER_HEIGHT], defaultWidth = _c[0], defaultHeight = _c[1];
        }
        var left = actualX - element.getBoundingClientRect().left;
        var top = actualY - element.getBoundingClientRect().top;
        // Getting the element at the current cursor position
        var currentElement = htmlUtilities.getElementFromPosition(actualX, actualY);
        if (currentElement && typeof currentElement.className === 'string' && (currentElement.className.indexOf('txt-icon') === 0 ||
            currentElement.className.indexOf('svg-icon') === 0 || currentElement.className.indexOf('annotation-wrap') >= 0)) {
            if (!AnnotationHelper.checkMouseInCorrectPosition(element.nextSibling, left, top, 0, 0, angle)) {
                return true;
            }
            else {
                return false;
            }
        }
        if (currentElement != null && currentElement !== undefined) {
            var elemClass = (currentElement.className && typeof (currentElement.className) === 'string') ?
                currentElement.className : null;
            if (currentElement.id.indexOf('annotationoverlay') < 0 &&
                (elemClass && currentElement.className.indexOf('resize') < 0 && currentElement.className.indexOf('hit-area') < 0)) {
                return true;
            }
            else if (currentElement.id.indexOf('annotationoverlay') >= 0) {
                if (!AnnotationHelper.checkMouseInCorrectPosition(element.nextSibling, left, top, 0, 0, angle)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
        var _b, _c;
    };
    /**
     * Setting initCoordinates for rotation
     * @rotatedAngle current rotatedAngle
     * @event event
     * @holderRect AnnotationHolder rect
     */
    AnnotationHelper.setRotationCoordinates = function (event, rotatedAngle, holderRect) {
        var dX = 0;
        var dY = 0;
        var width = holderRect.width;
        var height = holderRect.height;
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);
        switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
            case enums.RotateAngle.Rotate_0:
            case enums.RotateAngle.Rotate_360:
                dX = -(event.deltaX);
                dY = -(event.deltaY);
                break;
            case enums.RotateAngle.Rotate_90:
                dX = -(event.deltaY);
                dY = (event.deltaX);
                holderRect.height = width;
                holderRect.width = height;
                break;
            case enums.RotateAngle.Rotate_180:
                dX = (event.deltaX);
                dY = (event.deltaY);
                break;
            case enums.RotateAngle.Rotate_270:
                dX = (event.deltaY);
                dY = -(event.deltaX);
                holderRect.height = width;
                holderRect.width = height;
                break;
        }
        return { 'deltaX': dX, 'deltaY': dY, 'holderRect': holderRect };
    };
    /**
     * Get the updated client rect after rotation.
     * @param elementclientRect
     * @param annotationHolderElement
     * @param marksheetElement
     * @param rotatedAngle
     */
    AnnotationHelper.getRotatedClientRect = function (elementclientRect, annotationHolderElement, marksheetElement, stampId, rotatedAngle, actionType) {
        var annotationHolderRectRotate = annotationHolderElement.getBoundingClientRect();
        var rotatedClientRect;
        switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
            case enums.RotateAngle.Rotate_0:
            case enums.RotateAngle.Rotate_360:
                rotatedClientRect = {
                    left: elementclientRect.left - annotationHolderRectRotate.left,
                    top: (elementclientRect.top + marksheetElement.scrollTop) - (marksheetElement.scrollTop +
                        annotationHolderRectRotate.top),
                    width: elementclientRect.width,
                    height: elementclientRect.height,
                    right: 0,
                    bottom: 0
                };
                break;
            case enums.RotateAngle.Rotate_180:
                rotatedClientRect = {
                    left: annotationHolderRectRotate.width - ((elementclientRect.left + elementclientRect.width) -
                        annotationHolderRectRotate.left),
                    top: (annotationHolderRectRotate.height -
                        (elementclientRect.top + elementclientRect.height)) + annotationHolderRectRotate.top,
                    width: elementclientRect.width,
                    height: elementclientRect.height,
                    right: 0,
                    bottom: 0
                };
                break;
            case enums.RotateAngle.Rotate_90:
                var width = elementclientRect.width;
                if (actionType === enums.AddAction.DrawEnd) {
                    width = elementclientRect.width > AnnotationHelper.getAnnotationDefaultValue(stampId)[0] ? elementclientRect.width : 0;
                }
                rotatedClientRect = {
                    left: (elementclientRect.top + marksheetElement.scrollTop) - (marksheetElement.scrollTop +
                        annotationHolderRectRotate.top),
                    top: annotationHolderRectRotate.width -
                        ((elementclientRect.left + width) - annotationHolderRectRotate.left),
                    width: elementclientRect.height,
                    height: elementclientRect.width,
                    right: 0,
                    bottom: 0
                };
                break;
            case enums.RotateAngle.Rotate_270:
                rotatedClientRect = {
                    left: annotationHolderRectRotate.height -
                        ((elementclientRect.top + elementclientRect.height) - annotationHolderRectRotate.top),
                    top: elementclientRect.left - annotationHolderRectRotate.left,
                    width: elementclientRect.height,
                    height: elementclientRect.width,
                    right: 0,
                    bottom: 0
                };
                break;
        }
        return rotatedClientRect;
    };
    /**
     * Get Hline left/top rounded values
     * @param valueInPercent
     * @param container
     */
    AnnotationHelper.getRoundedValueAnnotationThickness = function (valueInPercent, container) {
        var valueInPx = valueInPercent * container / 100;
        valueInPx = Math.round(valueInPx);
        var calculatedRoundedPercent = valueInPx / container * 100;
        return calculatedRoundedPercent;
    };
    /**
     * Get stroke-width of annotation relative to the annotation-holder element
     * @param annotationHolderElement
     * @param displayangle
     */
    AnnotationHelper.getStrokeWidth = function (annotationHolderElement, displayangle) {
        var strokeWidth = 1;
        if (annotationHolderElement) {
            var rotatedAngle = AnnotationHelper.getAngleforRotation(displayangle);
            var holderWidth = annotationHolderElement.getBoundingClientRect().width;
            if (rotatedAngle === enums.RotateAngle.Rotate_90 ||
                rotatedAngle === enums.RotateAngle.Rotate_270) {
                holderWidth = annotationHolderElement.getBoundingClientRect().height;
            }
            strokeWidth = holderWidth * constants.STROKE_WIDTH_RATIO;
        }
        return strokeWidth.toFixed(2);
    };
    return AnnotationHelper;
}());
module.exports = AnnotationHelper;
//# sourceMappingURL=annotationhelper.js.map