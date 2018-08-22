import React = require('react');
import markingStore = require('../../../stores/marking/markingstore');
import annotation = require('../../../stores/response/typings/annotation');
import Immutable = require('immutable');
import enums = require('../enums');
import qigStore = require('../../../stores/qigselector/qigstore');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import responseStore = require('../../../stores/response/responsestore');
import worklistStore = require('../../../stores/worklist/workliststore');
import toolbarStore = require('../../../stores/toolbar/toolbarstore');
import constants = require('../constants');
import stampStore = require('../../../stores/stamp/stampstore');
import userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import initCoordinates = require('../../response/annotations/typings/initcoordinates');
import colouredAnnotationsHelper = require('../../../utility/stamppanel/colouredannotationshelper');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import treeViewDataHelper = require('../../../utility/treeviewhelpers/treeviewdatahelper');
import stampData = require('../../../stores/stamp/typings/stampdata');
import marksAndAnnotationsVisibilityHelper = require('../../../components/utility/marking/marksandannotationsvisibilityhelper');
import imageZoneStore = require('../../../stores/imagezones/imagezonestore');
import markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
import treeViewItem = require('../../../stores/markschemestructure/typings/treeviewitem');
import examinerMarksAndAnnotation = require('../../../stores/response/typings/examinermarksandannotation');
import examinerMarkData = require('../../../stores/response/typings/examinermarkdata');
import annotationContextMenuData = require('../contextmenu/annotationcontextmenudata');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');

class AnnotationHelper {

    private static treeViewHelper: treeViewDataHelper;

    // To hold all annotaions to display in the page
    private static annotationsToDisplayInCurrentPage: any;

    /* zindex for the static annotation */
    private static zIndex = 0;

    /**
     * sets the zindex for the static annotation from image width and height
     * @param imageWidth
     * @param imageHeight
     */
    public static setZIndexForStaticAnnotations(imageWidth: number, imageHeight: number) {
        AnnotationHelper.zIndex = Math.round(imageWidth * imageHeight);
    }

    /**
     * Get current marking group annotation
     */
    public static getCurrentMarkGroupAnnotation() {
        let previousAnnotations: Array<any> = Array<any>();
        let isSelectedTabEligibleForDefMarks: boolean = standardisationSetupStore.instance.isUnClassifiedWorklist ||
            standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse;
        let showDefAnnotationsOnly: boolean = isSelectedTabEligibleForDefMarks ? AnnotationHelper.showDefMarkAndAnnotation() : false;

        let allAnnotations: any;
        if (markingStore.instance.examinerMarksAgainstCurrentResponse) {
            let marksAndAnnotations = markingStore.instance.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[markingStore.instance.selectedQIGMarkGroupId].allMarksAndAnnotations[0];
            allAnnotations = marksAndAnnotations.annotations;
            let marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            let visiblityInfo = marksAndAnnotationsVisibilityHelper.
                getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails,
                    markingStore.instance.currentMarkGroupId).get(0);

            if (allAnnotations) {
                allAnnotations.filter((annotation: any) => {
                    // set the remark request type for the annotations
                    annotation.remarkRequestTypeId = marksAndAnnotations.remarkRequestTypeId;
                    annotation.zOrder = AnnotationHelper.maxZIndex();
                });
            }

            if (isSelectedTabEligibleForDefMarks) {
                // Filter the definitive annotaion.
                allAnnotations = allAnnotations.filter((annotation: annotation) => annotation.definitiveMark === showDefAnnotationsOnly);
            }
        }
        return allAnnotations;
    }

    /**
     * Get remark annotations
     */
    public static getCurrentMarkGroupPreviousRemarkAnnotations(seedType: enums.SeedType) {
        this.treeViewHelper = new treeViewDataHelper();
        let previousAnnotations: Array<any> = Array<any>();
        if (markingStore.instance.examinerMarksAgainstCurrentResponse) {
            let allMarkSchemGroupIds = markingStore.instance.getRelatedWholeResponseQIGIds();
            let markSchemeGroupIndex = 0;
            do {
                let markGroupId = markingStore.instance.currentMarkGroupId;
                let allResponseCurrentQigMarksAndAnnotations = markingStore.instance.examinerMarksAgainstCurrentResponse.
                    examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations;
                // for whole response, loop through annotations of each qig
                if (allMarkSchemGroupIds && allMarkSchemGroupIds.length > 0) {
                    markGroupId = markingStore.instance.
                        getMarkGroupIdQIGtoRIGMap(allMarkSchemGroupIds[markSchemeGroupIndex++]);
                }
                let allMarksAndAnnotations = markingStore.instance.examinerMarksAgainstCurrentResponse.
                    examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations;
                let allMarksAndAnnotationsLength = allMarksAndAnnotations.length;

                allMarksAndAnnotations.filter((item: any, index: number) => {
                    // exclude current marking annotations
                    if (index > 0) {
                        item.annotations.map((annotation: annotation) => {
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
                    let red = 128;
                    let green = 128;
                    let blue = 128;
                    previousAnnotations.map((previousAnnotation: annotation) => {
                        previousAnnotation.red = red;
                        previousAnnotation.green = green;
                        previousAnnotation.blue = blue;
                    });
                }
            } while (markSchemeGroupIndex < allMarkSchemGroupIds.length);
        }
        return previousAnnotations;
    }


    /**
     * gets whether the current response mode is pending.
     */
    public static isPendingWorklist(): boolean {
        return worklistStore.instance.getResponseMode === enums.ResponseMode.pending;
    }

    /**
     * get previous remark annotation details
     * @param isClosedEurSeed
     * @param isClosedLiveSeed
     * @param seedType
     * @param canRenderPreviousMarksInStandardisationSetup
     */
    public static getPreviousAnnotationDetails(isClosedEurSeed: boolean, isClosedLiveSeed: boolean,
        seedType: enums.SeedType, canRenderPreviousMarksInStandardisationSetup: boolean) {
        let allMarksAndAnnotations = markingStore.instance.getAllMarksAndAnnotations();
        let allMarksAndAnnotationsCount: number = allMarksAndAnnotations.length - 1;
        let marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        let visiblityInfo = marksAndAnnotationsVisibilityHelper.getMarksAndAnnotationVisibilityInfo(
            marksAndAnnotationVisibilityDetails,
            markingStore.instance.currentMarkGroupId);
        let responseMode = responseStore.instance.selectedResponseMode;
        let counter = -1;
        let remarkBaseColor = colouredAnnotationsHelper.getRemarkBaseColor(
            enums.DynamicAnnotation.None).fill;
        let items = allMarksAndAnnotations.map((item: Immutable.List<examinerMarksAndAnnotation>) => {
            let previousMarksAndAnnotationDetails: Immutable.Map<string, any> = Immutable.Map<string, any>();
            counter++;
            let examinerMarksAgainstResponse: Array<examinerMarkData> = markingStore.instance.getExaminerMarksAgainstResponse;
            let allMarksAndAnnotation = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId]
                .allMarksAndAnnotations[counter];
            let previousRemarkBaseColor: string = colouredAnnotationsHelper.getPreviousRemarkBaseColor(examinerMarksAgainstResponse);

            if (visiblityInfo.get(counter).isAnnotationVisible === true) {
                previousMarksAndAnnotationDetails = marksAndAnnotationsVisibilityHelper.
                    getMarkSchemePanelColumnHeaderAttributes(
                        counter,
                        item,
                        allMarksAndAnnotationsCount,
                        visiblityInfo,
                        isClosedEurSeed,
                        isClosedLiveSeed,
                        remarkBaseColor,
                        responseMode,
                        seedType,
                        markingStore.instance.currentMarkGroupId,
                        worklistStore.instance.currentWorklistType,
                        allMarksAndAnnotation,
                        previousRemarkBaseColor,
                        canRenderPreviousMarksInStandardisationSetup);
                if (counter === 0) {
                    return null;
                }
                return previousMarksAndAnnotationDetails;
            }
        });
        return items;
    }

    /**
     * Get annotation to display in current page
     * @param imageClusterId
     * @param outputPageNo
     * @param currentImageMaxWidth
     * @param pageNo
     */
    public static getAnnotationsToDisplayInCurrentPage(imageClusterId: number,
        outputPageNo: number,
        currentImageMaxWidth: number,
        pageNo: number,
        isReadOnly: boolean,
        seedType: enums.SeedType,
        isAtypical: boolean = false,
        markSchemesWithSameImages: Immutable.List<treeViewItem> = undefined, isEbookMarking: boolean = false): any {
        let annotationsToDisplayInCurrentPage: any;
        this.treeViewHelper = new treeViewDataHelper();
        // Get all annotations against the response
        let currentAnnotations =
            Immutable.List(markingStore.instance.allAnnotationsAgainstResponse(markingStore.instance.currentMarkGroupId)).toList();

        // filter current annotations
        annotationsToDisplayInCurrentPage = this.filterAnnotations(currentAnnotations,
            imageClusterId,
            outputPageNo,
            currentImageMaxWidth,
            pageNo,
            false,
            isAtypical,
            markSchemesWithSameImages, undefined, isEbookMarking);

        // check if the response is not opened in FR view, since we only need to show the remark annotations in zoned view
        // isReadOnly will be set to true only for FR view (fullresponseimageviewer.tsx)
        if (isReadOnly !== true && this.doShowPreviousAnnotations) {
            // get the previous annotations
            let previousRemarkAnnotations = Immutable.List(AnnotationHelper.getCurrentMarkGroupPreviousRemarkAnnotations(seedType));
            // filter remark annotations

            let previousAnnotations = this.filterAnnotations(previousRemarkAnnotations,
                imageClusterId,
                outputPageNo,
                currentImageMaxWidth,
                pageNo,
                true,
                false,
                markSchemesWithSameImages,
                currentAnnotations,
                isEbookMarking);

            if (annotationsToDisplayInCurrentPage) {
                annotationsToDisplayInCurrentPage = annotationsToDisplayInCurrentPage.concat(previousAnnotations);
                return annotationsToDisplayInCurrentPage;
            } else {
                return previousAnnotations;
            }
        }

        return annotationsToDisplayInCurrentPage;
    }

    public static get doShowPreviousAnnotations(): boolean {
        // since operation mode is awarding we dont need to show previous annoatations
        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            return false;
        }
        let hasShowStandardisationDefinitiveMarksCC: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ShowStandardisationDefinitiveMarks,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
        let hasAutomaticQualityFeedbackCC: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.AutomaticQualityFeedback,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
        let hasShowTLSeedDefinitiveMarksCC: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ShowTLSeedDefinitiveMarks).toLowerCase() === 'true';

        if (markingStore.instance.canRenderPreviousMarksInStandardisationSetup) {
            return true;
        }

        let showPrevious: boolean = true;
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
            } else {
                showPrevious = false;
            }
        }
        return showPrevious;
    }

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
    private static filterAnnotations(annotations: any, imageClusterId: number, outputPageNo: number,
        currentImageMaxWidth: number, pageNo: number, isPrevious: boolean, isAtypical: boolean = false,
        markSchemesWithSameImages: Immutable.List<treeViewItem> = undefined, currentMarkingAnnotations: any = undefined,
        isEbookMarking: boolean = false): any {

        let isSelectedTabEligibleForDefMarks: boolean = standardisationSetupStore.instance.isUnClassifiedWorklist ||
            standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse;
        let showDefAnnotationsOnly: boolean = isSelectedTabEligibleForDefMarks ? AnnotationHelper.showDefMarkAndAnnotation() : false;

        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured
            && markingStore.instance.currentQuestionItemInfo
            && markingStore.instance.currentQuestionItemImageClusterId === undefined
            && !isAtypical) {
            AnnotationHelper.findAnnotationsAgainstOutputPageForMarkscheme(annotations, outputPageNo, currentImageMaxWidth);
        } else if (imageClusterId > 0) {
            // get all the linked annotations against image cluster id which are not against current question item
            let linkedAnnotations = AnnotationHelper.getLinkedAnnotationsAgainstImage(markSchemesWithSameImages,
                isPrevious ? currentMarkingAnnotations : annotations);
            AnnotationHelper.findAnnotationsToDisplayForStructured(linkedAnnotations, outputPageNo,
                imageClusterId, currentImageMaxWidth, annotations);
        } else if (isEbookMarking) {
            // get all the linked annotations against image cluster id which are not against current question item
            let linkedAnnotations = AnnotationHelper.getLinkedAnnotationsAgainstImage(markSchemesWithSameImages,
                isPrevious ? currentMarkingAnnotations : annotations);
            AnnotationHelper.findAnnotationsToDisplayForEBookMarking(linkedAnnotations, markSchemesWithSameImages, outputPageNo,
                currentImageMaxWidth, annotations);
        } else {
            // get the stamps for the page
            this.annotationsToDisplayInCurrentPage = annotations.filter((annotation: annotation) =>
                annotation.pageNo === pageNo &&
                annotation.markingOperation !== enums.MarkingOperation.deleted
                //exclude link annotation
                && annotation.stamp !== constants.LINK_ANNOTATION
            );
        }

        // set if annotation is of a remark or not
        this.annotationsToDisplayInCurrentPage.map((annotation: annotation) => {
            annotation.isPrevious = isPrevious;
        });

        if (isSelectedTabEligibleForDefMarks) {
            this.annotationsToDisplayInCurrentPage = this.annotationsToDisplayInCurrentPage.filter(
                (x: annotation) => x.definitiveMark === showDefAnnotationsOnly || x.isPrevious === true);
        }

        return this.annotationsToDisplayInCurrentPage;
    }

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
    public static getAnnotationToAdd(stampId: number,
        pageNo: number,
        imageClusterId: number,
        outputPageNo: number,
        left: number,
        top: number,
        action: enums.AddAnnotationAction,
        width: number,
        height: number,
        associatedMarkSchemeId: number,
        rotateAngle: number,
        numericMarkValue: number) {
        let openedResponseDetails = markerOperationModeFactory.operationMode.openedResponseDetails
            (responseStore.instance.selectedDisplayId.toString());
        let rgbForRed: number = 255;
        let rgbForBlue: number = 0;
        let rgbForGreen: number = 0;
        let annotationColor;
        let annotationWidth: number = 0;
        let annotationHeight: number = 0;
        let defaultWidth: number = 0;
        let defaultHeight: number = 0;

        [defaultWidth, defaultHeight] = AnnotationHelper.getAnnotationDefaultValue(stampId, undefined, undefined, null,
            rotateAngle);

        switch (stampId) {
            case enums.DynamicAnnotation.Highlighter:
            case enums.DynamicAnnotation.Ellipse:
                annotationColor = userOptionsHelper.getUserOptionByName(userOptionKeys.HIGHTLIGHTER_COLOR,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                if (annotationColor) {
                    [rgbForRed, rgbForGreen, rgbForBlue] = this.getRGBColor(annotationColor);
                } else if (worklistStore.instance.getRemarkRequestType > 0) {
                    // if user option is not having any  color then get the base color from db if its a remark
                    let stampName: string = enums.DynamicAnnotation[stampId];
                    let cssProps: React.CSSProperties = colouredAnnotationsHelper.
                        getRemarkBaseColor(enums.DynamicAnnotation[stampName]);
                    let rgb = colouredAnnotationsHelper.splitRGBA(cssProps.fill);
                    rgbForRed = parseInt(rgb[0]);
                    rgbForGreen = parseInt(rgb[1]);
                    rgbForBlue = parseInt(rgb[2]);
                }

                // Display default Width and hight while Stamping & Drag and drop.
                if (action === enums.AddAnnotationAction.Pan) {
                    annotationWidth = 0;
                    annotationHeight = 0;
                } else if (action === enums.AddAnnotationAction.Stamping) {
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
                    } else if (rotateAngle === enums.RotateAngle.Rotate_90 ||
                        rotateAngle === enums.RotateAngle.Rotate_270) {
                        top = top - (defaultHeight / 6);
                        left = left - (defaultWidth / 10);
                    }
                }
                // Display default Width and hight while Stamping & Drag and drop.
                if (action === enums.AddAnnotationAction.Pan) {
                    annotationWidth = 0;
                    annotationHeight = constants.DEFAULT_HLINE_HEIGHT;
                } else if (action === enums.AddAnnotationAction.Stamping) {
                    annotationWidth = width;
                    annotationHeight = constants.DEFAULT_HLINE_HEIGHT;
                }
                break;
            case enums.DynamicAnnotation.VWavyLine:
                if (rotateAngle === enums.RotateAngle.Rotate_0 ||
                    rotateAngle === enums.RotateAngle.Rotate_180) {
                    top = top - (defaultHeight / 6);
                    left = left - (defaultWidth / 10);
                } else if (rotateAngle === enums.RotateAngle.Rotate_90 ||
                    rotateAngle === enums.RotateAngle.Rotate_270) {
                    left = left - (defaultWidth / 4);
                }
                // Display default Width and hight while Stamping & Drag and drop.
                if (action === enums.AddAnnotationAction.Pan) {
                    annotationWidth = constants.DEFAULT_HLINE_HEIGHT;
                    annotationHeight = 0;
                } else if (action === enums.AddAnnotationAction.Stamping) {
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
        let newlyAddedAnnotation: annotation = {
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
            annotationId: 0, // Actual annotation Id will only get from DB. Assign unique no for avoid same key error.
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
    }

    /**
     * Get rgb color of the annotation
     * @param annotationColor
     */
    public static getRGBColor(annotationColor: string) {
        if (annotationColor) {
            let colors: Array<string> = annotationColor.replace('rgb(', '').replace(')', '').split(',');
            return [Number(colors[0]), Number(colors[1]), Number(colors[2])];
        }
    }

    /**
     * Check if annotation/stamp is dragged at the correct droppable location in the screen
     * @param xPos
     * @param yPos
     * @param element
     * @param panSource
     */
    public static isPanOnStampPanel(element: Element, panSource: enums.PanSource) {
        let isOverpannableArea = false;

        /* Annotation/Stamp can be dragged from two location
         * 1. Stamp panel (Expanded and Favorite)
         * 2. Annotation Overlay (Response screen)
         * Based on the source location pan source will be set. If annotation is dragged inside the response screen we need to
         * check only whether pannable area is annotation overlay. If annotation is dragged from stamp panel we need to check
         * whether it is being dragged from expanded to favorite stamp panel, favorite to expanded stamp panel, expanded or favorite
         * stamp panel to response screen. Based on the draggable area, we will set the flag
         */
        if (element != null && element !== undefined) {
            let parentElement = htmlUtilities.findAncestor(element, 'icon-groups-wrap');
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
    }

    /**
     * Returns true if the mouse pointer is outside the grey area of the script.
     * @param element
     * @param left
     * @param top
     * @param imageWidth
     * @param imageHeight
     * @param angle
     */
    public static checkMouseOutsideGreyArea(element: any, left: number, top: number,
        imageWidth: number, imageHeight: number, angle?: number): boolean {

        angle = AnnotationHelper.getAngleforRotation(angle);

        if (element !== null && element.attributes.getNamedItem('class') !== null &&
            element.attributes.getNamedItem('class').nodeValue !== null &&
            element.attributes.getNamedItem('class').nodeValue.indexOf('marksheet-img') > -1) {

            if (angle !== undefined && (angle % 360 === 90 || angle % 360 === 270)) {
                imageWidth = element.clientHeight;
                imageHeight = imageHeight + element.clientWidth;
            } else {
                imageWidth = element.clientWidth;
                imageHeight = imageHeight + element.clientHeight;
            }

            var gap = (element.offsetTop + 25.1563);
            if (left < imageWidth && top < imageHeight) {
                return true;
            } else {
                if (left > imageWidth && top < imageHeight) {

                    return false;
                }
                return this.checkMouseOutsideGreyArea(element.nextSibling, left, top, imageWidth, imageHeight, angle);
            }
        } else {
            return true;
        }
    }

    /**
     * getDimensionsToRetain function is to get the dimensions to retain.
     * @param currentRect
     */
    public static getDimensionsToRetain = (currentRect: ClientRectDOM, resizeMinVal: initCoordinates,
        initialCoordinates: initCoordinates, displayAngle: number, stampId: number) => {
        let blnIsRetain: boolean = false;
        /** To check whether the rotated angle is 90/270 */
        let blnIsOddAngle = AnnotationHelper.IsOddangle(AnnotationHelper.getAngleforRotation(displayAngle));
        switch (stampId) {
            case enums.DynamicAnnotation.HorizontalLine:
            case enums.DynamicAnnotation.HWavyLine:
                /** If width is greater than height  ,width should be considered and viceversa(applicable during rotation) */
                if (initialCoordinates.width > initialCoordinates.height) {
                    if (blnIsOddAngle) {
                        if (currentRect.height < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    } else {
                        if (currentRect.width < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    }
                } else {
                    if (blnIsOddAngle) {
                        if (currentRect.width < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    } else {
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
                    } else {
                        if (currentRect.width < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    }
                } else {
                    if (blnIsOddAngle) {
                        if (currentRect.width < resizeMinVal.width) {
                            blnIsRetain = true;
                        }
                    } else {
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
    public static getAngleforRotation = (rotatedAngle: number) => {
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
     * To check whether the angle is odd or not.
     * @param {number} rotatedAngle
     * @returns
     */
    public static IsOddangle(rotatedAngle: number): boolean {
        return !!((this.getAngleforRotation(rotatedAngle) / enums.RotateAngle.Rotate_90) % 2);
    }

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
    public static checkGreyAreaAfterRotationStitched(element: any, left: number, top: number,
        imageWidth: number, imageHeight: number, angle: number,
        scrollTop: number, overlayBoundary: Array<AnnotationBoundary>,
        clientX: number, clientY: number): boolean {

        return this.checkGreyAreaAfterRotation(element, left, top, imageWidth, imageHeight, angle, scrollTop);
    }


    /**
     * Checking whether the annotation is in gray area of the stitched image
     * @param {Array<AnnotationBoundary>} overlayBoundary
     * @param {number} angle
     * @param {number} clientX
     * @param {number} clientY
     * @returns
     */
    public static isAnnotationInsideStitchedImage(overlayBoundary: Array<AnnotationBoundary>,
        angle: number,
        clientX: number,
        clientY: number): boolean {

        var isInsideScript: boolean = false;
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
                } else if (angle === enums.RotateAngle.Rotate_180) {

                    // Added 1px gap to avoid adding annotation at the edge of the script. Otherwise 1px diff will
                    // cost when converting to % at the render method. This will now assume that clientY belongs to
                    // different image.
                    clientY += 1;
                    if (clientY > overlayBoundary[i].start && clientY < overlayBoundary[i].end) {
                        isInsideScript = true;
                    }
                } else if (angle === enums.RotateAngle.Rotate_90 || angle === enums.RotateAngle.Rotate_270) {
                    if (clientX < overlayBoundary[i].end && clientX > overlayBoundary[i].start) {
                        isInsideScript = true;
                    }
                }
            }
        } else {
            isInsideScript = true;
        }
        return isInsideScript;
    }

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
    public static getImageZone(overlayBoundary: Array<AnnotationBoundary>,
        angle: number,
        clientX: number,
        clientY: number,
        imageZones: ImageZone[]) {
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
                } else if (angle === enums.RotateAngle.Rotate_180) {

                    // Added 1px gap to avoid adding annotation at the edge of the script. Otherwise 1px diff will
                    // cost when converting to % at the render method. This will now assume that clientY belongs to
                    // different image.
                    clientY += 1;
                    if (clientY > overlayBoundary[i].start && clientY < overlayBoundary[i].end) {
                        return imageZones[i];
                    }
                } else if (angle === enums.RotateAngle.Rotate_90 || angle === enums.RotateAngle.Rotate_270) {
                    if (clientX < overlayBoundary[i].end && clientX > overlayBoundary[i].start) {
                        return imageZones[i];
                    }
                }
            }
        }

    }

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
    public static checkGreyAreaAfterRotation(element: any, left: number, top: number,
        imageWidth: number, imageHeight: number, angle: number, scrollTop: number): boolean {
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
                } else {
                    if (left > imageWidth && top < imageHeight) {
                        return false;
                    }
                    return this.checkGreyAreaAfterRotation(element.nextSibling, left, top,
                        imageWidth, imageHeight, angle, scrollTop);
                }
            } else if (angle === enums.RotateAngle.Rotate_180) {
                imageWidth = element.clientWidth;
                imageHeight = imageHeight + element.clientHeight;
                let imageLeft = element.getBoundingClientRect().left;

                if ((left > imageLeft && left < (imageLeft + imageWidth)) && top < imageHeight) {
                    return true;
                } else {
                    if (left < imageLeft && top < imageHeight) {
                        return false;
                    }
                    return this.checkGreyAreaAfterRotation(element.previousSibling, left, top,
                        imageWidth, imageHeight, angle, scrollTop);
                }
            } else if (angle === enums.RotateAngle.Rotate_90) {
                imageWidth = element.clientHeight;
                imageHeight = imageHeight + element.clientWidth;

                if (left < imageWidth && top < imageHeight) {
                    return true;
                } else {
                    if (top > imageHeight && left < imageWidth) {
                        return false;
                    }
                    return this.checkGreyAreaAfterRotation(element.previousSibling, left,
                        top, imageWidth, imageHeight, angle, scrollTop);
                }

            } else if (angle === enums.RotateAngle.Rotate_270) {
                imageWidth = imageWidth + element.clientHeight;
                imageHeight = element.clientWidth;
                let imageTop = element.getBoundingClientRect().top + scrollTop;

                if ((left > 0 && left < imageWidth) && top > imageTop) {
                    return true;
                } else {
                    if (left < imageWidth && top < imageTop) {
                        return false;
                    }
                    return this.checkGreyAreaAfterRotation(element.nextSibling, left, top,
                        imageWidth, imageHeight, angle, scrollTop);
                }
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    /**
     * Set the properties for gray area checking.
     * @param {number} left
     * @param {number} top
     * @param {any} element
     * @param {HTMLElement} marksheetElement
     * @param {number} rotateAngle
     * @returns
     */
    public static setElementPropertiesForGrayAreaCheck = (left: number, top: number, element: Element,
        marksheetElement: HTMLElement, rotateAngle: number): any => {
        left = left - element.getBoundingClientRect().left;
        top = top - element.getBoundingClientRect().top;

        let angle = AnnotationHelper.getAngleforRotation(rotateAngle);
        let marksheetWrapperElement: Element = element.parentElement;
        let propsForGrayAreaCheck = {
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

        } else if (angle === enums.RotateAngle.Rotate_270) {
            propsForGrayAreaCheck.top = (top + element.getBoundingClientRect().top) + marksheetElement.scrollTop;
            propsForGrayAreaCheck.element = marksheetWrapperElement.firstElementChild;
        } else {
            propsForGrayAreaCheck.element = marksheetWrapperElement.firstElementChild;
        }

        return propsForGrayAreaCheck;
    };

    /**
     * Check the current mark scheme having any annotations added by the user.
     * @returns Number of annotation that are new/updated
     */
    public static hasUserAddedAnnotationExistsForTheCurrentMarkScheme(): boolean {

        let annotations = Immutable.List(AnnotationHelper.getCurrentMarkGroupAnnotation());

        // For intial loading disable the reset button.
        if (markingStore.instance.currentQuestionItemInfo === undefined) {
            return false;
        }

        // get newly added/updated annotation only and avoid LINK annotation.
        return annotations.some((annotation: annotation) =>
            annotation.markSchemeId === markingStore.instance.currentQuestionItemInfo.uniqueId
            && annotation.markingOperation !== enums.MarkingOperation.deleted
            && annotation.stamp !== constants.LINK_ANNOTATION
            && !annotation.addedBySystem
        );
    }

    /**
     * return true if stamp is line, otherwise false
     * @param stampId
     */
    public static isLineAnnotation(stampId: number): boolean {
        return AnnotationHelper.isHorizontalLine(stampId) ||
            AnnotationHelper.isVerticalLine(stampId);
    }

    /**
     * return true if stamp is a horizontal line
     * @param stampId
     */
    public static isHorizontalLine(stampId: number): boolean {
        return stampId === enums.DynamicAnnotation.HorizontalLine ||
            stampId === enums.DynamicAnnotation.HWavyLine;
    }

    /**
     * return true if stamp is a vertical line
     * @param stampId
     */
    public static isVerticalLine(stampId: number): boolean {
        return stampId === enums.DynamicAnnotation.VWavyLine;
    }

    /**
     * return true if line annotation is drawing in horizontal direction
     * @param stampId
     * @param rotatedAngle
     */
    public static doDrawLineHorizontally(stampId: number, rotatedAngle: number): boolean {
        if (rotatedAngle === enums.RotateAngle.Rotate_90 || rotatedAngle === enums.RotateAngle.Rotate_270) {
            if (AnnotationHelper.isVerticalLine(stampId)) {
                return true;
            }
        } else {
            if (AnnotationHelper.isHorizontalLine(stampId)) {
                return true;
            }
        }

        return false;
    }

    /**
     * return true if line annotations are overlapping with another line annotation
     * @param clientX
     * @param clientY
     * @param rotatedAngle
     * @param stampId
     */
    public static isLineAnnotationsOverlapping(clientX: number, clientY: number, rotatedAngle: number, stampId: number): boolean {
        let maxPixelsToCheck = 5;
        let classNamesToCheck = ['hit-area', 'line', 'resizer'];
        let leftElement = null;
        let rightElement = null;
        if (AnnotationHelper.doDrawLineHorizontally(stampId, rotatedAngle)) {
            for (let counter = 1; counter <= maxPixelsToCheck; counter++) {
                leftElement = htmlUtilities.getElementFromPosition(clientX, clientY - counter);
                rightElement = htmlUtilities.getElementFromPosition(clientX, clientY + counter);
                if (AnnotationHelper.checkElementClassName(leftElement, classNamesToCheck) ||
                    AnnotationHelper.checkElementClassName(rightElement, classNamesToCheck)) {
                    return true;
                }
            }
        } else {
            for (let counter = 1; counter <= maxPixelsToCheck; counter++) {
                leftElement = htmlUtilities.getElementFromPosition(clientX - counter, clientY);
                rightElement = htmlUtilities.getElementFromPosition(clientX + counter, clientY);
                if (AnnotationHelper.checkElementClassName(leftElement, classNamesToCheck) ||
                    AnnotationHelper.checkElementClassName(rightElement, classNamesToCheck)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * return true if the elements classname contains any of the items in the array
     * @param element
     * @param subStringsToCheck
     */
    public static checkElementClassName(element: Element, subStringsToCheck: string[]): boolean {
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
    }

    /**
     * Check the rectangle co-ordinates are overlaps with anothor
     * @param event
     * @param cursorWidth
     * @param cursorHeight
     * @param holderClassName
     */
    public static isAnnotationPlacedOnTopOfAnother(stampType: enums.StampType,
        element: Element, clientX: number, clientY: number,
        holderClassName: string, rotatedAngle?: number,
        overlayBoundary?: Array<AnnotationBoundary>) {
        let left: number = clientX;
        let top: number = clientY;
        let cursorWidth = 0;
        let cursorHeight = 0;

        if (!overlayBoundary) {
            overlayBoundary = [];
        }

        if ((stampType === enums.StampType.text) &&
            (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90
                || rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270)) {

            // Get the width of the cursor based on the image width (4 percentage if image + 10 px)
            let width = element.clientWidth * (4 / 100) + 10;

            // when rotated, cursor width and height is swapped.
            cursorWidth = width;
            cursorHeight = width;
        } else {
            // Get the width of the cursor based on the image width (4 percentage if image - 4 px)
            cursorWidth = element.clientWidth * (4 / 100) - 4;

            // If the stamp is text type height is 67 % of the width.
            cursorHeight = cursorWidth;
        }

        // keep the annotation overlay for checking if all points in rectangle fall on the same script Image.
        // This is required for booklet view when the user can stamp the annotation in between the images.
        let previousElementIdStampedOn: string = '';

        /*
         * Get the points in the rectangle from the mouse cursor and inspect it is in the annotation holder
         * If any of this points are not in the 'annotation-holder' it is overlaping with anothor
         * Currently 6 points in the rectagle inspects. Since the text annotation having lower width than image stamp.
         * Handle other points in future if rerquired.
        */
        for (let scenarioCounter = 1; scenarioCounter <= 9; scenarioCounter++) {
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
            let elementInMousePointer = htmlUtilities.getElementFromPosition(left, top);

            // Check the class is same as the Holder class for verifying the point is in the holder.
            if (elementInMousePointer !== null && typeof elementInMousePointer.className === 'string') {
                if (elementInMousePointer.className.indexOf(holderClassName) === -1) {
                    // Co-ordinates overlaps with some other element.
                    if (elementInMousePointer.id.indexOf('previous') === -1 && !this.isDynamicAnnotationElement(elementInMousePointer)) {
                        return true;
                    }
                } else { // This means that annotation has dropped on an annotation overlay in script
                    if (previousElementIdStampedOn !== '' && previousElementIdStampedOn !== elementInMousePointer.id) {
                        // The annotation has fell on two script images - Booklet view scenario
                        return true;
                    } else {
                        previousElementIdStampedOn = elementInMousePointer.id;
                    }
                }
                // When the annotation is outside of the window, the bottom left and right are returned as null.
                // Fix for defect 29845
            } else if (elementInMousePointer === null) {
                return true;
            }
        }

        return false;
    }

    /**
     * This method will find the current annotaion position and its imagezone, then returns the corresponding width/height.
     * @param clientRect
     * @param topScroll
     */
    public static getImageZoneRestriction(clientRect: ClientRectDOM, topScroll: number, imageZoneRect: any,
        annotationHolderRect: any, imageZones: any) {
        // let imageZoneRect: ClientRect = this.props.getImageContainerRect();
        // let annotationHolderRect: ClientRect = this.getAnnotationHolderElementProperties();
        let annotationTop: number = Math.round(((clientRect.top + topScroll) -
            (annotationHolderRect.top + topScroll)) + clientRect.height);
        let annotationLeft: number = Math.round((clientRect.left - annotationHolderRect.left) + clientRect.width);
        let annotationHolderImageZone: React.CSSProperties = {
            width: 0,
            height: 0
        };
        /** 'topPositioninZone' variable stores the imagezone's position top value */
        let topPositioninZone: number = 0;
        /** Loop through the imagezones and find the width and height for restricting the movement or resize of the annotation */
        for (let index = 0; index < imageZones.length; index++) {
            /* 'previousZoneHeight' variable contains the previous zone height while moving/resizing the annotation*/
            let previousZoneHeight: number = topPositioninZone > 0 ? imageZoneRect[index - 1].height : topPositioninZone;
            let nextImageZoneWidth = 0;
            /* Below 'if' condition will check whether there is another imagezone after the current imagezone
            and current imagezone width is greater than the next imagezone width */
            if (imageZoneRect[index + 1] && imageZoneRect[index].width > imageZoneRect[index + 1].width) {
                /* 'nextImageZoneWidth' variable stores the next imagezone width */
                let nextImageZoneWidth = imageZoneRect[index + 1].width;
                /* If the annotation position is greater than the next imagezone width then the annotation
                y-axis movement/resize will be restricted within the current imagezone height*/
                if (annotationLeft > Math.round(nextImageZoneWidth)) {
                    nextImageZoneWidth = Math.round(annotationHolderRect.width *
                        imageZones[index + 1].holderWidth / 100);
                    annotationHolderImageZone.height = Math.round(annotationHolderRect.height -
                        Math.round(nextImageZoneWidth * imageZones[index + 1].zonePaddingTop / 100));
                }
            }
            /**
             * Condition checks if imagezone height restriction is greater than 0 then current imagezone
             * height is set, else its set by adding next imagezone height to the 'topPositioninZone' variable
             */
            let heightRestriction = annotationHolderImageZone.height > 0 ?
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
            } else {
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
    }

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
    public static checkMouseDrawingOutsideResponseArea = (event: any, annotationtype?: string, annotationElement?:
        Element, angle?: number, stampId?: number, isStamping?: boolean): boolean => {
        let element: Element = annotationElement;
        let actualX = event.changedPointers !== undefined ? event.changedPointers[0].clientX : event.clientX;
        let actualY = event.changedPointers !== undefined ? event.changedPointers[0].clientY : event.clientY;
        angle = AnnotationHelper.getAngleforRotation(angle);
        let [defaultWidth, defaultHeight] = [0, 0];
        if (stampId) {
            [defaultWidth, defaultHeight] = AnnotationHelper.getAnnotationDefaultValue(stampId, undefined, undefined, annotationElement,
                angle, isStamping);
        } else {
            [defaultWidth, defaultHeight] = [constants.DEFAULT_HIGHLIGHTER_WIDTH, constants.DEFAULT_HIGHLIGHTER_HEIGHT];
        }

        let left = actualX - element.getBoundingClientRect().left;
        let top = actualY - element.getBoundingClientRect().top;

        // Getting the element at the current cursor position
        let currentElement: Element = htmlUtilities.getElementFromPosition(actualX, actualY);
        if (currentElement && typeof currentElement.className === 'string' && (currentElement.className.indexOf('txt-icon') === 0 ||
            currentElement.className.indexOf('svg-icon') === 0 || currentElement.className.indexOf('annotation-wrap') >= 0)) {
            if (!AnnotationHelper.checkMouseInCorrectPosition(element.nextSibling, left, top, 0, 0, angle)) {
                return true;
            } else {
                return false;
            }

        }
        if (currentElement != null && currentElement !== undefined) {
            let elemClass = (currentElement.className && typeof (currentElement.className) === 'string') ?
                currentElement.className : null;
            if (currentElement.id.indexOf('annotationoverlay') < 0 &&
                (elemClass && currentElement.className.indexOf('resize') < 0 && currentElement.className.indexOf('hit-area') < 0)) {
                return true;
            } else if (currentElement.id.indexOf('annotationoverlay') >= 0) {
                if (!AnnotationHelper.checkMouseInCorrectPosition(element.nextSibling, left, top, 0, 0, angle)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return true;
        }
    };

    /**
     * This method will check the mouse left and top position related to the annotation holder area and if the image is not present
     * @param element
     * @param left
     * @param top
     * @param imageWidth
     * @param imageHeight
     */
    public static checkMouseInCorrectPosition(element: any, left: number, top: number, imageWidth: number,
        imageHeight: number, pageNo?: number, angle?: number): boolean {

        if (pageNo > 0 || responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured) {
            // Unstructured response, No need to validate
            return true;
        }

        return AnnotationHelper.checkMouseOutsideGreyArea(element, left, top, imageWidth, imageHeight, angle);
    }

    /**
     * This method will check whether annoatation boundary coordinates are inside the gray area region
     * @param annotationRect
     * @param annotationHolderElement
     * @param marksheetElement
     * @param rotatedAngle
     */
    public static validateAnnotationBoundary(annotationRect: ClientRectDOM,
        annotationHolderElement: Element, marksheetElement: HTMLElement, rotatedAngle?: number) {

        let width = annotationRect.width;
        let height = annotationRect.height;
        let annotationHolderRect = annotationHolderElement.getBoundingClientRect();
        let annotationInGrayArea = false;
        let annotationBoundaryCoordinates: Array<any> = [];
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

        annotationBoundaryCoordinates.map(function (coordinates: any) {
            let propsForGrayAreaCheck = AnnotationHelper.setElementPropertiesForGrayAreaCheck((coordinates.left +
                annotationHolderRect.left), (coordinates.top + annotationHolderRect.top), annotationHolderElement.parentElement,
                marksheetElement, rotatedAngle);

            let inGrayArea = !(AnnotationHelper.checkGreyAreaAfterRotation(
                propsForGrayAreaCheck.element, propsForGrayAreaCheck.left, propsForGrayAreaCheck.top, 0, 0,
                propsForGrayAreaCheck.angle, propsForGrayAreaCheck.scrollTop));
            if (inGrayArea) {
                annotationInGrayArea = true;
            }
        });

        return annotationInGrayArea;
    }

    /**
     * This check is to prevent the click event from firing in IE when PanEnd is fired
     */
    public static checkEventFiring() {
        if (toolbarStore.instance.panStampId === 0
            && toolbarStore.instance.selectedStampId !== 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * pixelsToPercentConversion function converts pixel to percent relative to the parent container
     * @param pixels
     * @param parentinPixel
     */
    public static pixelsToPercentConversion(pixels: number, parentinPixel: number): number {
        let value = (pixels / parentinPixel) * 100;
        /** For rounding the value up to 3 decimal points */
        return Math.round(value * 1000) / 1000;
    }

    /**
     * percentToPixelConversion function converts percent to pixel relative to the parent container
     * @param percent
     * @param parentinPixel
     */
    public static percentToPixelConversion(percent: number, parentinPixel: number): number {
        let value = (percent / 100) * parentinPixel;
        return Math.round(value);
    }

    /**
     * getAnnotationCoordinatesOnRotate function is to get top and left of the annotation after rotation.
     * @param annotationHolderElement
     * @param currentElement
     * @param x
     * @param y
     * @param rotatedAngle
     */
    public static getAnnotationCoordinatesOnRotate(annotationHolderElement: ClientRectDOM, currentElement: ClientRectDOM,
        left: number, top: number, rotatedAngle: number) {

        let annotationLeft = 0;
        let annotationTop = 0;
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);

        switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
            case enums.RotateAngle.Rotate_0:
            case enums.RotateAngle.Rotate_180:
            case enums.RotateAngle.Rotate_360:
                annotationLeft = this.maintainPositionOnRotate(annotationHolderElement,
                    currentElement, left, top, rotatedAngle)[0];
                annotationTop = this.maintainPositionOnRotate(annotationHolderElement,
                    currentElement, left, top, rotatedAngle)[1];
                break;
            case enums.RotateAngle.Rotate_90:
            case enums.RotateAngle.Rotate_270:
                annotationLeft = this.maintainPositionOnRotate(annotationHolderElement,
                    currentElement, left, top, rotatedAngle)[1];
                annotationTop = this.maintainPositionOnRotate(annotationHolderElement,
                    currentElement, left, top, rotatedAngle)[0];
                break;
        }

        return [annotationLeft, annotationTop];
    }

    /**
     * maintainPositionOnRotate function is to convert the points after rotating.
     * @param annotationHolderElement
     * @param currentElement
     * @param x
     * @param y
     * @param rotatedAngle
     */
    public static maintainPositionOnRotate(annotationHolderElement: ClientRectDOM, currentElement: ClientRectDOM,
        x: number, y: number, rotatedAngle: number) {

        let cx = 0;
        let cy = 0;
        let angle = 0;
        let radians = 0;
        let cos = 0;
        let sin = 0;
        let nx = 0;
        let ny = 0;
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
    }

    /**
     * retainAnnotationOnRotate function is to get the points after rotating.
     * @param rotatedAngle
     * @param clientRect
     * @param annotationHolderElement
     * @param currentElement
     */
    public static retainAnnotationOnRotate(rotatedAngle: number, clientRect: ClientRectDOM,
        annotationHolderElement: ClientRectDOM,
        currentElement: ClientRectDOM) {

        let width = annotationHolderElement.width;
        let height = annotationHolderElement.height;
        let left = clientRect.left;
        let top = clientRect.top;

        switch (rotatedAngle % enums.RotateAngle.Rotate_360) {
            case enums.RotateAngle.Rotate_90:
            case enums.RotateAngle.Rotate_270:
                left = this.pixelsToPercentConversion(
                    this.maintainPositionOnRotate(annotationHolderElement, currentElement,
                        left, top, rotatedAngle)[1], width);
                top = this.pixelsToPercentConversion(
                    this.maintainPositionOnRotate(annotationHolderElement, currentElement,
                        left, top, rotatedAngle)[0], height);
                break;
            default:
                left = this.pixelsToPercentConversion(
                    this.maintainPositionOnRotate(annotationHolderElement, currentElement,
                        left, top, rotatedAngle)[0], width);
                top = this.pixelsToPercentConversion(
                    this.maintainPositionOnRotate(annotationHolderElement, currentElement,
                        left, top, rotatedAngle)[1], height);
                break;
        }
        if (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90 ||
            rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270) {
            return [top, left];
        }
        return [left, top];
    }

    /**
     * Setting initCoordinates for rotation
     * @rotatedAngle current rotatedAngle
     * @event event
     * @holderRect AnnotationHolder rect
     */
    public static setRotationCoordinates = (event: HammerInput, rotatedAngle: number, holderRect: ClientRectDOM) => {
        let dX = 0;
        let dY = 0;
        let width = holderRect.width;
        let height = holderRect.height;
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
     * checkOutsideResponseArea for checking whether its outside respone area
     * @param currentOutputImageHeight
     * @param currentImageMaxWidth
     * @param top
     * @param left
     * @param annotationWidth
     * @param annotationHeight
     * @param action
     */
    public static checkOutsideResponseArea(currentOutputImageHeight: number, currentImageMaxWidth: number,
        top: number, left: number, annotationWidth: number, annotationHeight: number, action: enums.AddAnnotationAction) {

        if (currentOutputImageHeight > (top + (annotationHeight))
            && currentImageMaxWidth > (left + (annotationWidth))
            && left > 0 && top > 0) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * find the annotation holder for the corresponding element
     * @param element
     */
    public static findAnnotationHolderOfAnElement(element: Element): Element {
        while (element.id.indexOf('annotationoverlay') === -1
            && element.parentNode != null
            && element.parentNode !== undefined
            && element.id !== 'imagecontainer') {
            element = element.parentNode as Element;
        }
        // Since annotation holder and overlay holder both come under Annotation overlay
        element = element.id.indexOf('Overlay_') > -1 ? element.firstChild as Element : element;
        return element;
    }

    /**
     * This check is to whether the element is dynamic annotation
     */
    public static isDynamicAnnotationElement(element: any) {
        if (element) {
            let attributeValue: String = 'dynamicannotation';
            let isDynamicAnnotation: boolean = false;
            if (element.getAttribute('data-type') === attributeValue) {
                isDynamicAnnotation = true;
            } else if (element.parentNode.getAttribute('data-type') === attributeValue) {
                isDynamicAnnotation = true;
            } else if (element.parentNode.parentNode.getAttribute('data-type') === attributeValue) {
                isDynamicAnnotation = true;
            } else {
                isDynamicAnnotation = false;
            }
            return isDynamicAnnotation;
        } else {
            return false;
        }
    }

    /**
     * Checks if the stamp is a Dynamic Annotation and NOT On page comment
     * @param {any} stamp stampData
     */
    public static isDynamicAnnotation(stamp: any): boolean {
        let isDynamicAnnotation: boolean = false;
        if (stamp) {
            isDynamicAnnotation = this.isDynamicStampType(stamp.stampType) && !this.isOnPageComment(stamp.stampId);
        }
        return isDynamicAnnotation;
    }

    /**
     * Checks if the stamp is a Dynamic type (INCLUDES on page comment)
     * @param {any} stampType stampType
     */
    public static isDynamicStampType(stampType: number): boolean {
        return stampType === enums.StampType.dynamic;
    }

    /**
     * Checks if the stamp is an Image type
     * @param stamp
     */
    public static isImageAnnotation(stamp: any): boolean {

        if (stamp) {
            return stamp.stampType === enums.StampType.image;
        }
        return false;
    }

    /**
     * Checks if the stamp is a Text type
     * @param stamp
     */
    public static isTextAnnotation(stamp: any): boolean {

        if (stamp) {
            return stamp.stampType === enums.StampType.text;
        }
        return false;
    }

    /**
     * Is the stamp On page Comment
     * @param {number} stampId Stamp ID
     */
    public static isOnPageComment(stampId: number) {
        return stampId === enums.DynamicAnnotation.OnPageComment;
    }

    /**
     * This check is to whether the element is previous annotation
     */
    public static isPreviousAnnotation(element: any) {

        let attributeValue: String = 'previous';
        let isPreviousAnnotation: boolean = false;
        if (element.getAttribute('data-annotation-relevance') === attributeValue) {
            isPreviousAnnotation = true;
        }

        return isPreviousAnnotation;
    }

    /**
     * This check is to whether the response is read only
     */
    public static isResponseReadOnly() {
        return markerOperationModeFactory.operationMode.isResponseReadOnly;
    }

    /**
     * getAnnotationDefaultValue - calculate width and height of the dynamic annotation
     * @param stampId
     * @param width
     * @param height
     * @param element
     * @param rotatedAngle
     * @param isStamping
     */
    public static getAnnotationDefaultValue(stampId: number, width?: number, height?: number, element?: Element,
        rotatedAngle?: number, isStamping?: boolean) {
        let stamp = stampStore.instance.getStamp(stampId);
        let isWidthRequired: boolean = false;
        let isHeightRequired: boolean = true;

        switch (stampId) {
            case enums.DynamicAnnotation.Highlighter:
                if (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_90 ||
                    rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_270) {
                    width = (width === undefined ? constants.DEFAULT_HIGHLIGHTER_HEIGHT : width);
                    height = (height === undefined ? constants.DEFAULT_HIGHLIGHTER_WIDTH : height);
                } else {
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
                } else {
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
                } else {
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
                } else {
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
            } else {
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
    }

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
    public static checkStampingInResponseArea(left: number, top: number,
        annotationWidth: number, annotationHeight: number, zoneTop: number,
        currentImageMaxWidth: number, currentOutputImageHeight: number,
        rotatedAngle: number): boolean {

        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);
        if (rotatedAngle % enums.RotateAngle.Rotate_360 === enums.RotateAngle.Rotate_0) {
            if ((Math.round(top) + Math.round(annotationHeight) - Math.round(zoneTop) >= currentOutputImageHeight) ||
                (Math.round(left) + Math.round(annotationWidth) >= currentImageMaxWidth)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get the updated client rect after rotation.
     * @param elementclientRect
     * @param annotationHolderElement
     * @param marksheetElement
     * @param rotatedAngle
     */
    public static getRotatedClientRect = (elementclientRect: ClientRectDOM, annotationHolderElement: Element,
        marksheetElement: Element, stampId: number, rotatedAngle: number, actionType?: enums.AddAction) => {

        let annotationHolderRectRotate = annotationHolderElement.getBoundingClientRect();
        let rotatedClientRect: ClientRectDOM;

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
                let width = elementclientRect.width;
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
     *  To check whether stamping / drawing annotation is in grey area for stitched response.
     * @param clientX
     * @param clientY
     * @param rotatedAngle
     * @param drawDirection
     * @param annotationHolderElement
     * @param marksheetElement
     * @param index
     */
    public static checkInGreyArea(clientX: number, clientY: number, rotatedAngle: number, drawDirection: boolean,
        annotationHolderElement: Element, marksheetElement: HTMLElement, index?: number, isStamping?: boolean, stampId?: number,
        overlayBoundary?: Array<AnnotationBoundary>): boolean {
        let inGreyArea: boolean = false;
        let x;
        let y;
        let bountryPoints = [];
        let width = 0;
        let height = 0;
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);

        let stamp = stampStore.instance.getStamp(stampId);

        [width, height] = this.getAnnotationDefaultValue(stampId, undefined, undefined, annotationHolderElement, rotatedAngle, isStamping);

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
        } else {
            bountryPoints = [
                { 'x': 0, 'y': 0 }
            ];
        }
        index = index === undefined ? 0 : index;

        if (index < bountryPoints.length) {
            if (drawDirection) {
                x = clientX - bountryPoints[index].x;
                y = clientY - bountryPoints[index].y;
            } else {
                x = clientX + bountryPoints[index].x;
                y = clientY + bountryPoints[index].y;
            }
        } else {
            return false;
        }

        // No need to check the gray area check if it above the dynamic annotation
        if (!AnnotationHelper.isDynamicAnnotationElement(annotationHolderElement)) {
            let propsForGrayAreaCheck = AnnotationHelper.setElementPropertiesForGrayAreaCheck(
                x, y, annotationHolderElement.parentElement,
                marksheetElement,
                rotatedAngle);

            inGreyArea = !(AnnotationHelper.checkGreyAreaAfterRotationStitched(
                propsForGrayAreaCheck.element,
                propsForGrayAreaCheck.left,
                propsForGrayAreaCheck.top, 0, 0,
                propsForGrayAreaCheck.angle,
                propsForGrayAreaCheck.scrollTop, overlayBoundary, clientX, clientY));
        }

        if (!inGreyArea) {
            if (index < bountryPoints.length) {
                inGreyArea = this.checkInGreyArea(clientX, clientY, rotatedAngle, drawDirection,
                    annotationHolderElement, marksheetElement, ++index, isStamping, stampId, overlayBoundary);
                if (inGreyArea) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return inGreyArea;
        }
    }

    /**
     * get the zIndex of curent response
     */
    public static getCurrentResponseZIndex(): number {
        if (markingStore.instance.examinerMarksAgainstCurrentResponse) {
            return markingStore.instance.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId].allMarksAndAnnotations.length;
        } else {
            return 0;
        }
    }

    /**
     * get the zIndex for specified response
     * @param markGroupId
     */
    private static getResponseZIndex(markGroupId: number): number {
        return markingStore.instance.examinerMarksAgainstResponse(markGroupId).
            examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations.length;
    }

    /**
     * return the max z index value for the annotation in the response
     */
    public static maxZIndex(markGroupId: number = undefined): number {
        if (AnnotationHelper.zIndex > 0) {
            return AnnotationHelper.zIndex;
        } else {
            let zIndex = markGroupId === undefined ? AnnotationHelper.getCurrentResponseZIndex()
                : AnnotationHelper.getResponseZIndex(markGroupId);
            return zIndex;
        }
    }

    /**
     * Convert value to percentage.
     * @param numerator
     * @param denominator
     */
    public static calculatePercentage(numerator: number, denominator: number): number {
        return (numerator / denominator) * 100;
    }

    /**
     * find the percentage
     * @param numerator
     * @param denominator
     */
    public static findPercentage(numerator: number, denominator: number) {
        return (numerator * (denominator / 100));
    }

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
    public static getAnnotationDimensionsInPercent(stampId: number, width: number, height: number,
        annotationOverlayElementRect: ClientRectDOM,
        currentImageMaxWidth: number, currentOutputImageHeight: number, rotatedAngle?: number) {

        let defaultWidthInPercentage = 0;
        let defaultHeightInPercentage = 0;
        let annotationWidthInPercent = 0;
        let annotationHeightInPercent = 0;
        let [defaultWidth, defaultHeight] = this.getAnnotationDefaultValue(stampId, undefined, undefined, null, rotatedAngle);

        defaultWidthInPercentage = this.calculatePercentage((defaultWidth /
            annotationOverlayElementRect.width) * currentImageMaxWidth, currentImageMaxWidth);
        defaultHeightInPercentage = this.calculatePercentage((defaultHeight /
            annotationOverlayElementRect.height) * currentOutputImageHeight, currentOutputImageHeight);
        annotationWidthInPercent = this.calculatePercentage((width /
            annotationOverlayElementRect.width) * currentImageMaxWidth, currentImageMaxWidth);
        annotationHeightInPercent = this.calculatePercentage((height /
            annotationOverlayElementRect.height) * currentOutputImageHeight, currentOutputImageHeight);

        return [defaultWidthInPercentage, defaultHeightInPercentage, annotationWidthInPercent, annotationHeightInPercent];

    }

    /**
     * To get drawing direction.
     * @param rotatedAngle
     */
    public static getDrawDirection(rotatedAngle: number) {

        let drawDirection: enums.DrawDirection = enums.DrawDirection.Right;
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

    }

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
    public static getLineDimensions(dimensions: ClientRectDOM, clientToken: string, rotatedAngle: number,
        left?: number, top?: number, annotationDataWidth?: number, annotationDataHeight?: number, isHorizontal?: boolean) {
        let hLineRect: ClientRectDOM = { left: 0, bottom: 0, height: 0, right: 0, top: 0, width: 0 };
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);

        if (clientToken) {
            hLineRect.left = isHorizontal ? dimensions.left : left;
            hLineRect.top = isHorizontal ? top : dimensions.top;

            hLineRect.width = dimensions.width;
            hLineRect.height = dimensions.height;
        } else {
            hLineRect.left = dimensions.left;
            hLineRect.top = dimensions.top;

            hLineRect.width = dimensions.width;
            hLineRect.height = dimensions.height;
        }
        return hLineRect;
    }

    /**
     * Check the page Having annottaion
     * @param pageNo
     */
    public static HasPageContainsCurrentMarkGroupAnnotation(pageNo: number, hasUnmanagedSLAO?: boolean): boolean {
        if (markingStore.instance.examinerMarksAgainstCurrentResponse) {
            let currentAnnotations = Immutable.List<annotation>(
                markingStore.instance.allAnnotationsAgainstResponse(markingStore.instance.currentMarkGroupId));

            if (hasUnmanagedSLAO) {
                return currentAnnotations.some((annotation: annotation) =>
                    annotation.pageNo === pageNo && annotation.stamp !== constants.LINK_ANNOTATION &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted);
            } else {
                return currentAnnotations.some((annotation: annotation) =>
                    annotation.pageNo === pageNo && annotation.stamp !== constants.LINK_ANNOTATION &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted);
            }
        }

        return false;
    }

    /**
     * Get the value indicating whether the Seen stamp is configured or not
     */
    public static get IsSeenStampConfiguredForQIG() {
        return stampStore.instance.IsSeenStampConfiguredForQIG;
    }

    /**
     * get the annotations of specified mark group
     * @param markGroupId
     */
    public static getExaminerMarksAgainstResponse(markGroupId: number) {
        let annotation: annotation[] = [];
        let isSelectedTabEligibleForDefMarks: boolean = standardisationSetupStore.instance.isUnClassifiedWorklist ||
            standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse;
        let showDefAnnotationsOnly: boolean = isSelectedTabEligibleForDefMarks ? AnnotationHelper.showDefMarkAndAnnotation() : false;
        let marksAndAnnotations: examinerMarksAndAnnotation[] = markingStore.instance.allMarksAndAnnotationAgainstResponse(markGroupId);
        if (marksAndAnnotations) {
            marksAndAnnotations.forEach((x: examinerMarksAndAnnotation) => {
                if (x.annotations) {
                    let allAnnotations: annotation[] = x.annotations;
                    let maxZOrder = AnnotationHelper.maxZIndex(markGroupId);

                    if (allAnnotations) {
                        allAnnotations.filter((annotation: annotation) => {
                            // set the remark request type for the annotations
                            annotation.remarkRequestTypeId = x.remarkRequestTypeId;
                            annotation.zOrder = maxZOrder;
                        });
                    }

                    if (isSelectedTabEligibleForDefMarks) {
                        allAnnotations = allAnnotations.filter((annotation: annotation) =>
                            annotation.definitiveMark === showDefAnnotationsOnly);
                    }

                    allAnnotations.forEach((x: annotation) => {
                        annotation.push(x);
                    });
                }
            });
        }

        return annotation;
    }

    /**
     * Get annotation to display in current page
     * @param imageClusterId
     * @param outputPageNo
     * @param currentImageMaxWidth
     * @param pageNo
     */
    public static getCurrentAnnotationsByPageNo(imageClusterId: number,
        outputPageNo: number,
        currentImageMaxWidth: number,
        pageNo: number): any {
        let annotationsToDisplayInCurrentPage: any;

        let currentAnnotations =
            Immutable.List<annotation>(markingStore.instance.allAnnotationsAgainstResponse(markingStore.instance.currentMarkGroupId));

        // Reset the annotation collection
        this.annotationsToDisplayInCurrentPage = '';

        // filter current annotations
        annotationsToDisplayInCurrentPage = this.filterAnnotations(currentAnnotations,
            imageClusterId,
            outputPageNo,
            currentImageMaxWidth,
            pageNo,
            false);

        return annotationsToDisplayInCurrentPage;
    }

    /**
     * Get annotation to display in current page
     * @param pageNo
     * @param markGroupId
     */
    public static getAnnotationsInAdditionalObjectByPageNo(
        pageNo: number,
        markGroupId: number): any {
        let annotationsToDisplayInCurrentPage: any;
        let currentAnnotations = Immutable.List(AnnotationHelper.getExaminerMarksAgainstResponse(markGroupId));

        // filter current annotations
        annotationsToDisplayInCurrentPage = this.filterAnnotationsByPageNumber(currentAnnotations,
            pageNo);

        return annotationsToDisplayInCurrentPage;
    }

    /**
     * filter annotations based on page number
     * @param annotations
     * @param pageNo
     */
    private static filterAnnotationsByPageNumber(annotations: any, pageNo: number): any {
        let annotationsToDisplayInCurrentPage: any;
        let isSelectedTabEligibleForDefMarks: boolean = standardisationSetupStore.instance.isUnClassifiedWorklist ||
            standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse;
        let showDefAnnotationsOnly: boolean = isSelectedTabEligibleForDefMarks ? AnnotationHelper.showDefMarkAndAnnotation() : false;

        // get the stamps for the page
        annotationsToDisplayInCurrentPage = annotations.filter((annotation: annotation) =>
            annotation.pageNo === pageNo &&
            annotation.markingOperation !== enums.MarkingOperation.deleted &&
            (isSelectedTabEligibleForDefMarks ? annotation.definitiveMark === showDefAnnotationsOnly : true)
        );

        return annotationsToDisplayInCurrentPage;
    }


    /**
     * Get previous annotation to display in current page
     * @param pageNo
     * @param markGroupId
     */
    public static getPreviousAnnotationsInPageNo(
        pageNo: number,
        seedType: enums.SeedType): any {
        let annotationsToDisplayInCurrentPage: any;

        // find previous annotations
        let previousAnnotations = Immutable.List(AnnotationHelper.getCurrentMarkGroupPreviousRemarkAnnotations(seedType));

        // filter current annotations
        annotationsToDisplayInCurrentPage = this.filterAnnotationsByPageNumber(previousAnnotations,
            pageNo);

        return annotationsToDisplayInCurrentPage;
    }

    /**
     * returns true if page is linked or flagged as seen.
     */
    public static isLinkedOrFlaggedAsSeenInPage(annotations: any): boolean {
        let isLinkedOrFlaggedAsSeen: boolean = false;

        // The variable isLinkedOrFlaggedAsSeen is set only if flagged as seen or linked the page to a question.
        isLinkedOrFlaggedAsSeen = annotations ?
            annotations.some((x: annotation) =>
                (x.stamp === constants.SEEN_STAMP_ID && x.addedBySystem === true) || x.stamp === constants.LINK_ANNOTATION) : false;
        return isLinkedOrFlaggedAsSeen;
    }

    /**
     * Get Hline left/top rounded values
     * @param valueInPercent
     * @param container
     */
    public static getRoundedValueAnnotationThickness = (valueInPercent: number, container: number): number => {
        let valueInPx = valueInPercent * container / 100;
        valueInPx = Math.round(valueInPx);
        let calculatedRoundedPercent = valueInPx / container * 100;
        return calculatedRoundedPercent;
    };

    /**
     * Get stroke-width of annotation relative to the annotation-holder element
     * @param annotationHolderElement
     * @param displayangle
     */
    public static getStrokeWidth = (annotationHolderElement: Element, displayangle: number): string => {
        let strokeWidth = 1;
        if (annotationHolderElement) {
            let rotatedAngle = AnnotationHelper.getAngleforRotation(displayangle);
            let holderWidth = annotationHolderElement.getBoundingClientRect().width;
            if (rotatedAngle === enums.RotateAngle.Rotate_90 ||
                rotatedAngle === enums.RotateAngle.Rotate_270) {
                holderWidth = annotationHolderElement.getBoundingClientRect().height;
            }
            strokeWidth = holderWidth * constants.STROKE_WIDTH_RATIO;
        }

        return strokeWidth.toFixed(2);
    };

    /**
     * Get the annotation count from annotation list.
     * @param favouritesStampCollection
     */
    public static getStampsWithCount(favouritesStampCollection: Immutable.List<stampData>) {
        let annotationCounts: Object = {};
        let currentAnnotations: Immutable.List<annotation> = AnnotationHelper.getCurrentMarkGroupAnnotation();
        let uniqueId: number = markingStore.instance.currentQuestionItemInfo ? markingStore.instance.currentQuestionItemInfo.uniqueId : 0;

        // Get the count of annotations from the annotation list.
        if (currentAnnotations) {
            currentAnnotations.map((annotation: annotation, index: number) => {
                // Check the annotation belongs to selected question item and not a deleted one.
                if (annotation.markSchemeId === uniqueId && annotation.markingOperation !== enums.MarkingOperation.deleted) {
                    // Store the annotation Count in Key Value Pair so we no need to loop through it while getting the count.
                    if (annotationCounts[annotation.stamp]) {
                        annotationCounts[annotation.stamp] += 1;
                    } else {
                        annotationCounts[annotation.stamp] = 1;
                    }
                }
            });
        }
        // Update the count for favourite stamp panel.
        favouritesStampCollection.map((stamp: stampData, index: number) => {
            if (annotationCounts[stamp.stampId]) {
                stamp.count = annotationCounts[stamp.stampId];
            } else {
                stamp.count = 0;
            }
        });

        return favouritesStampCollection;
    }

    /**
     * Get The Annotation List For displaying annotations in Structured full response view.
     * @param pageNo
     * @param imageWidth
     * @param imageHeight
     * @param isAdditionalObject
     * @param isALinkedPage
     */
    public static getAnnotationsForThePageInStructuredResponse(
        pageNo: number,
        imageWidth: number,
        imageHeight: number,
        isAdditionalObject: boolean,
        isALinkedPage: boolean): Immutable.List<annotation> {

        if (pageNo === 0 || responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured) {
            return undefined;
        }

        // Collection to keep the modified annotation, to display in the page
        let annotationsForThePage: annotation[] = [];

        // Get the Annotations added to the response. For entire response
        let currentAnnotations =
            Immutable.List(markingStore.instance.allAnnotationsAgainstResponse(markingStore.instance.currentMarkGroupId)).toList();

        // exclude deleted annotations
        currentAnnotations = Immutable.List<annotation>(
            currentAnnotations.filter((x: annotation) =>
                x.markingOperation !== enums.MarkingOperation.deleted));

        // Get the Image Cluster Ids, associated with this page
        let imageClusters: number[] = AnnotationHelper.getImageClustersForThePage(pageNo);

        // Loop the Image Clusters and check the zones for the clusters
        imageClusters.forEach((imageClusterIdInPage: number) => {

            //  Get the annotations added for this image cluster.
            let annotationsAgainstCluster: annotation[] = currentAnnotations.filter((annotation: annotation) =>
                annotation.imageClusterId === imageClusterIdInPage).toArray();

            // Get the zones associated with this cluster
            let imageZonesForTheCluster: Immutable.List<ImageZone> = AnnotationHelper.getZonesFortheImageCluster(imageClusterIdInPage);

            // Loop the annotations against the clusters and check the annotation is relevent to this page.
            annotationsAgainstCluster.forEach((annotation: annotation) => {

                let zoneHeight: number = 0;
                let breakAnnotationCheck: boolean = false;
                let lastOutPutPageNo: number = 0;

                // Loop the Zones for validating the annotations with page
                imageZonesForTheCluster.forEach((imageZone: ImageZone) => {

                    // Check the annotation found in a page, or the output page no got changed during loop.
                    if (!breakAnnotationCheck || lastOutPutPageNo !== imageZone.outputPageNo) {

                        // Get the zone height.
                        let currentZoneHeight = imageHeight * (imageZone.height / 100);

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
                                let cloneOfA: annotation = JSON.parse(JSON.stringify(annotation));

                                // If on page comment, calculate height and width
                                if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                                    cloneOfA.height = (imageHeight * (imageZone.topEdge / 100)) + annotation.height;
                                    cloneOfA.width = (imageWidth * (imageZone.leftEdge / 100)) + annotation.width;

                                    /* Check the top edge exceeds zone height(excluding the current zone height),
                                    If so decrease the top.*/
                                    if (cloneOfA.height > zoneHeight - currentZoneHeight) {
                                        cloneOfA.height -= zoneHeight - currentZoneHeight;
                                    }

                                } else {

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
            annotationsForThePage = annotationsForThePage.concat(
                currentAnnotations.filter((annotation: annotation) => annotation.pageNo === pageNo &&
                    annotation.stamp !== constants.LINK_ANNOTATION).toArray());
        }

        // return the annotation list for rendering in the page.
        return Immutable.List<annotation>(annotationsForThePage);
    }

    /**
     * get the zones associated with a page.
     * @param imageClusterId
     */
    private static getZonesFortheImageCluster(imageClusterId: number): Immutable.List<ImageZone> {
        let imageZones: Immutable.List<ImageZone>;
        if (imageZoneStore.instance.imageZoneList != null) {
            imageZones = imageZoneStore.instance.imageZoneList.imageZones;

            let imageZonesForTheCluster = imageZones.filter((imageZone: ImageZone) => imageZone.imageClusterId === imageClusterId).
                sort(function (obj1: ImageZone, obj2: ImageZone) {
                    return (obj1.sequence > obj2.sequence) ? 0 : -1;
                });

            return Immutable.List<ImageZone>(imageZonesForTheCluster);
        }
    }

    /**
     * get the zones associated with a mark scheme.
     * @param markSchemeId
     */
    private static getZonesFortheMarkScheme(markSchemeId: number): Immutable.List<ImageZone> {
        let imageZones: Immutable.List<ImageZone>;
        let candidateScriptId: number = markerOperationModeFactory.operationMode.openedResponseDetails
            (responseStore.instance.selectedDisplayId.toString()).candidateScriptId;
        if (imageZoneStore.instance.candidateScriptImageZoneList != null) {
            imageZones = imageZoneStore.instance.candidateScriptImageZoneList.get(candidateScriptId);

            let imageZonesForTheMakScheme = imageZones.filter((imageZone: ImageZone) => imageZone.markSchemeId === markSchemeId).
                sort(function (imgZone1: ImageZone, imgZone2: ImageZone) {
                    return (imgZone1.sequence > imgZone2.sequence) ? 0 : -1;
                });

            return Immutable.List<ImageZone>(imageZonesForTheMakScheme);
        }
    }

    /**
     * Get the image cluster Ids associated with page no.
     * @param pageNo
     */
    private static getImageClustersForThePage(pageNo: number): number[] {
        let imageClusterIds: number[] = [];

        let imageZones: Immutable.List<ImageZone>;
        if (imageZoneStore.instance.imageZoneList != null) {
            imageZones = imageZoneStore.instance.imageZoneList.imageZones;

            let imageZonesForPage = Immutable.List<ImageZone>(imageZones.filter((imageZone: ImageZone) => imageZone.pageNo === pageNo));

            imageZonesForPage.forEach((imageZone: ImageZone) => {
                if (imageClusterIds.indexOf(imageZone.imageClusterId) < 0) {
                    imageClusterIds.push(imageZone.imageClusterId);
                }
            });
        }

        return imageClusterIds;
    }

    /**
     * Get the mark scheme ids associated with page no.
     * @param pageNo
     */
    private static getMarkSchemesForThePage(pageNo: number): number[] {
        let markSchemeIds: number[] = [];
        let candidateScriptId: number = markerOperationModeFactory.operationMode.openedResponseDetails
            (responseStore.instance.selectedDisplayId.toString()).candidateScriptId;
        let imageZones: Immutable.List<ImageZone>;
        if (imageZoneStore.instance.candidateScriptImageZoneList != null) {
            imageZones = imageZoneStore.instance.candidateScriptImageZoneList.get(candidateScriptId);

            let imageZonesForPage = Immutable.List<ImageZone>(imageZones.filter((imageZone: ImageZone) => imageZone.pageNo === pageNo));

            imageZonesForPage.forEach((imageZone: ImageZone) => {
                if (markSchemeIds.indexOf(imageZone.markSchemeId) < 0) {
                    markSchemeIds.push(imageZone.markSchemeId);
                }
            });
        }

        return markSchemeIds;
    }

    /**
     * Gets the image zone boundary list of the stitched images.
     * @param {any} element
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

                    angle = this.getAngleforRotation(angle);
                    // Computing the 3% margin in pixel to calculate the distance from top to the gray area.
                    let elem = imageZones[i].getBoundingClientRect();

                    let startEdge: number;
                    let endEdge: number;
                    if (angle === enums.RotateAngle.Rotate_90 || angle === enums.RotateAngle.Rotate_270) {
                        startEdge = elem.left;
                        endEdge = elem.right;
                    } else {
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
    }

    /**
     * Validating the dynamic annotation draw or mouse move to check whether the annotation is overlaps the
     * annotation gap.
     * @param annotationRect
     * @param annotationHolderElement
     * @param marksheetElement
     * @param rotatedAngle
     * @param blockThreshold
     */
    public static validateAnnotaionBoundaryOnStitchedImageGap(annotationRect: ClientRectDOM,
        annotationHolderRect: ClientRectDOM,
        overlayBoundary: Array<AnnotationBoundary>,
        rotatedAngle?: number,
        blockThreshold: number = 0,
        action: enums.AddAnnotationAction = enums.AddAnnotationAction.Pan): boolean {
        var isValid: boolean = true;
        let blockThresholdAtStart: number = blockThreshold;

        // Adding a 5px gap fixed tp prevent placing lines athe the very end.
        let blockThresholdAtEnd: number = 5;

        var annotationBoundaryCoordinates: Array<any> = [];
        rotatedAngle = AnnotationHelper.getAngleforRotation(rotatedAngle);
        if (overlayBoundary && overlayBoundary.length > 0) {
            var insideScript: boolean = false;
            let annotationBoundaryEnd = 0;
            let annotationBoundaryStart = 0;

            // Apply the rotation values.
            switch (rotatedAngle) {
                case enums.RotateAngle.Rotate_0:
                case enums.RotateAngle.Rotate_360:
                    if (action === enums.AddAnnotationAction.Stamping) {
                        annotationBoundaryStart = annotationRect.top;
                        annotationBoundaryEnd = annotationRect.top + annotationRect.height;
                    } else {
                        annotationBoundaryStart = annotationRect.top;
                        annotationBoundaryEnd = annotationBoundaryStart + annotationRect.height;
                    }
                    blockThresholdAtStart = blockThreshold;
                    break;
                case enums.RotateAngle.Rotate_90:
                    if (action === enums.AddAnnotationAction.Stamping) {
                        annotationBoundaryStart = annotationRect.left;
                        annotationBoundaryEnd = annotationRect.left + annotationRect.width;
                    } else {
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
                    } else {
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
                    } else {
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

    }

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
    public static getAnnotationsToDisplayInLinkingScenarios(isALinkedPage: boolean, imageClusterId: number,
        currentImageMaxWidth: number, topAboveCurrentZone: number, zoneHeight: number, outputPageNo: number,
        pageNo: number, multipleMarkSchemes: treeViewItem, doShowPreviousMarkerLinkedPages: boolean, seedType: enums.SeedType,
        isEBookMarking: boolean) {

        let currentAnnotations =
            markingStore.instance.allAnnotationsAgainstResponse(markingStore.instance.currentMarkGroupId);
        let displayOrder = 1;
        let isIeOrEdge = htmlUtilities.isIE || htmlUtilities.isEdge;

        if (isIeOrEdge) {
            // add display order for each annotation. fix for annotation not disappear after moving in linked page IE #54209
            currentAnnotations.map((item: annotation) => {
                item.displayOrder = displayOrder++;
            });
        }

        // get the previous annotations
        if (this.doShowPreviousAnnotations && doShowPreviousMarkerLinkedPages) {
            let previousRemarkAnnotations = AnnotationHelper.getCurrentMarkGroupPreviousRemarkAnnotations(seedType);
            if (currentAnnotations) {
                previousRemarkAnnotations.map((annotation: annotation) => {
                    annotation.isPrevious = true;
                });
                currentAnnotations = currentAnnotations.concat(previousRemarkAnnotations);
            }
        }
        let annotationsToDisplayInCurrentPage = Immutable.List<annotation>();
        // get annotations based on page number
        multipleMarkSchemes.treeViewItemList.map((item: treeViewItem) => {
            annotationsToDisplayInCurrentPage = annotationsToDisplayInCurrentPage.concat(
                currentAnnotations.filter((annotation: annotation) =>
                    annotation.pageNo === pageNo &&
                    annotation.stamp !== constants.LINK_ANNOTATION &&
                    annotation.markSchemeId === item.uniqueId &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted)).toList();
        });

        // return the annotations which are placed in linked page which have no image cluster id
        // case for linking SLAOs and other pages which are not as part of current zones
        if (isALinkedPage === true && imageClusterId === 0) {
            return annotationsToDisplayInCurrentPage;
        }

        // Dispaly "SEEN" annoatation only if page is linked to that question item.
        if (isEBookMarking && !isALinkedPage) {
            annotationsToDisplayInCurrentPage = annotationsToDisplayInCurrentPage.filter(
                (annotation: annotation) =>
                    annotation.addedBySystem !== true
            ).toList();
        }

        multipleMarkSchemes.treeViewItemList.map((item: treeViewItem) => {
            // get annotations based on the top left values of the zone
            annotationsToDisplayInCurrentPage = annotationsToDisplayInCurrentPage.concat(
                currentAnnotations.filter((annotation: annotation) =>
                    annotation.imageClusterId === imageClusterId &&
                    annotation.leftEdge <= currentImageMaxWidth &&
                    annotation.topEdge >= topAboveCurrentZone &&
                    annotation.topEdge <= topAboveCurrentZone + zoneHeight &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted &&
                    annotation.outputPageNo === outputPageNo &&
                    annotation.markSchemeId === item.uniqueId)).toList();
        });

        if (isIeOrEdge) {
            // sort items based on display order
            annotationsToDisplayInCurrentPage = annotationsToDisplayInCurrentPage.sort((a: annotation, b: annotation) => {
                return a.displayOrder - b.displayOrder;
            }).toList();
        }

        return annotationsToDisplayInCurrentPage;
    }

    /**
     * determine the output page for annotation
     * @param doApplyLinkingScenarios
     * @param imageZones
     * @param imageZone
     * @param outputPageNo
     */
    public static getOutputPageNo(doApplyLinkingScenarios: boolean, imageZones: ImageZone[],
        imageZone: ImageZone, outputPageNo: number): number {
        let outputPageNumber = 0;
        if (doApplyLinkingScenarios === true) {
            if (imageZones && imageZones.length > 0) {
                // for stitched images
                outputPageNumber = imageZones[0].outputPageNo;
            } else if (imageZone) {
                // for single image viewer
                outputPageNumber = imageZone.outputPageNo;
            } else {
                // for single image viewer with no zones
                outputPageNumber = outputPageNo;
            }
        } else {
            // work as normal if linking scenario is not enabled
            outputPageNumber = outputPageNo;
        }

        return outputPageNumber;
    }

    /**
     * filter annotation disticlty by page number
     * @param annotations
     */
    public static filetrAnnotationsDistinctlyByPageNo(annotations: annotation[]): annotation[] {
        let distinctAnnotations: annotation[] = [];
        annotations.forEach((annotation: annotation) => {
            let annotationsInSpecificPage = distinctAnnotations.filter((distinctAnnotation: annotation) => {
                return distinctAnnotation.pageNo === annotation.pageNo;
            });
            if (annotationsInSpecificPage.length === 0) {
                distinctAnnotations.push(annotation);
            }
        });

        return distinctAnnotations;
    }

    /**
     * Returns Corrected anotation rect values while drawing dynamic annotation.
     * @param annotationRect
     * @param annotationOverlayRect
     * @param rotatedAngle
     */
    public static getAnnotationRectOnDrawing(annotationRect: ClientRectDOM,
        annotationOverlayRect: ClientRectDOM,
        rotatedAngle: enums.RotateAngle): ClientRectDOM {

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
    }

    /**
     * return true if the event is cancelled
     * @param event
     */
    public static isEventCanceled(event: EventCustom): boolean {
        let isEventCanceled = false;
        if (event && event.srcEvent) {
            isEventCanceled = event.srcEvent.type === 'pointercancel';
        }
        return isEventCanceled;
    }

    /**
     *  Calculates the stitched image gap offset
     * @param displayAngle
     * @param stitchedImageIndex
     * @param overlayBoundary
     * @param annotationOverlayParentElement
     */
    public static calculateStitchedImageGapOffset(displayAngle: number,
        stitchedImageIndex: number,
        overlayBoundary: Array<AnnotationBoundary>,
        annotationOverlayParentElement: Element): number {

        let stitchedImageSeperator: number = 0;

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
    }

    /**
     * Is the element an acetate
     * @param element
     */
    public static isAcetate(element: Element, excludeAcetateResizer: boolean = false): boolean {
        let acetateAttributes: Array<string> = ['overlay-hit-area-line', 'overlay-plus-hover', 'overlay-mover-area'];
        acetateAttributes = excludeAcetateResizer ? acetateAttributes.splice(0, 2) : acetateAttributes;
        if (element && element.attributes) {
            let elementClassName = element.attributes.getNamedItem('class') ? element.attributes.getNamedItem('class').nodeValue : '';
            for (let acetateAttribute of acetateAttributes) {
                if (elementClassName.indexOf(acetateAttribute) > -1) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Get Annotations For The Page In EBookMarking
     * @param pageNo
     * @param imageWidth
     * @param imageHeight
     * @param isAdditionalObject
     * @param isALinkedPage
     */
    public static getAnnotationsForThePageInEBookMarking(pageNo: number,
        imageWidth: number,
        imageHeight: number,
        isALinkedPage: boolean,
        isEResponse: boolean): Immutable.List<annotation> {
        if (pageNo === 0) {
            return undefined;
        }

        // Collection to keep the modified annotation, to display in the page
        let annotationsForThePage: annotation[] = [];

        // Get the Annotations added to the response. For entire response
        let currentAnnotations = Immutable.List<annotation>(AnnotationHelper.getCurrentMarkGroupAnnotation());

        // exclude deleted annotations
        currentAnnotations = Immutable.List<annotation>(
            currentAnnotations.filter((x: annotation) =>
                x.markingOperation !== enums.MarkingOperation.deleted));

        // For an EResponse return annotations to display for the page.
        if (isEResponse) {
            return Immutable.List<annotation>(currentAnnotations.filter((x: annotation) => x.pageNo === pageNo));
        } else {
            // Get the Image Cluster Ids, associated with this page
            let markSchemes: number[] = AnnotationHelper.getMarkSchemesForThePage(pageNo);

            // Loop the Image Clusters and check the zones for the clusters
            markSchemes.forEach((markSchemeId: number) => {

                //  Get the annotations added for this image cluster.
                let annotationsAgainstMarkScheme: annotation[] = currentAnnotations.filter((annotation: annotation) =>
                    annotation.markSchemeId === markSchemeId).toArray();

                // Get the zones associated with this cluster
                let imageZonesForTheMarkScheme: Immutable.List<ImageZone> = AnnotationHelper.getZonesFortheMarkScheme(markSchemeId);

                annotationsForThePage = this.validateAndGetAnnotationsAgainstMarkScheme(imageZonesForTheMarkScheme, imageHeight,
                    annotationsAgainstMarkScheme, pageNo, annotationsForThePage);
            });


            let imageZones = imageZoneStore.instance.currentCandidateScriptImageZone;
            // get unmananged zones of the page number
            let unManagedZones = (imageZones ? imageZones.filter((x: ImageZone) =>
                x.docStorePageQuestionTagTypeId === 4 && x.pageNo === pageNo) : undefined);

            // get all the annotations on the linked page and unmanaged zones
            if (isALinkedPage || (unManagedZones && unManagedZones.count() > 0)) {
                annotationsForThePage = annotationsForThePage.concat(
                    currentAnnotations.filter((annotation: annotation) => annotation.pageNo === pageNo &&
                        annotation.stamp !== constants.LINK_ANNOTATION).toArray());
            }
        }

        // return the annotation list for rendering in the page.
        return Immutable.List<annotation>(annotationsForThePage);
    }

    /**
     * validate and get annotations against mark scvheme.
     * @param imageZones
     * @param imageHeight
     * @param annotations
     * @param pageNo
     * @param annotationsForThePage
     */
    private static validateAndGetAnnotationsAgainstMarkScheme(imageZones: Immutable.List<ImageZone>, imageHeight: number,
        annotations: annotation[],
        pageNo: number,
        annotationsForThePage: annotation[]): annotation[] {

        // Loop the annotations against the clusters and check the annotation is relevent to this page.
        annotations.forEach((annotation: annotation) => {

            let zoneHeight: number = 0;
            let breakAnnotationCheck: boolean = false;
            let lastOutPutPageNo: number = 0;

            // Loop the Zones for validating the annotations with page
            imageZones.forEach((imageZone: ImageZone) => {

                // Check the annotation found in a page, or the output page no got changed during loop.
                if (!breakAnnotationCheck || lastOutPutPageNo !== imageZone.outputPageNo) {

                    // Get the zone height.
                    let currentZoneHeight = imageHeight * (imageZone.height / 100);

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
                            let cloneOfA: annotation = JSON.parse(JSON.stringify(annotation));

                            // If on page comment, calculate height and width
                            if (annotation.stamp === enums.DynamicAnnotation.OnPageComment) {
                                cloneOfA.height = annotation.height;
                                cloneOfA.width = annotation.width;

                                /* Check the top edge exceeds zone height(excluding the current zone height),
                                If so decrease the top.*/
                                if (cloneOfA.height > zoneHeight - currentZoneHeight) {
                                    cloneOfA.height -= zoneHeight - currentZoneHeight;
                                }

                            } else {

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
    }

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
    public static getEbookmarkingAnnotationCoordinateOnRotate(left: number, top: number, rotatedAngle: number, naturalWidth: number,
        zoneTop: number, currentOutputImageHeight: number, element: Element) {
        let annotationLeft = 0;
        let annotationTop = 0;
        let width = 0;
        let height = 0;

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
    }

    /**
     * return annotation context menu data.
     */
    public static getContextMenuData(clientToken: string, annotationOverlayWidth: number,
        annotation?: annotation): annotationContextMenuData {
        let data: annotationContextMenuData;
        data = new annotationContextMenuData;
        data.contextMenuType = enums.ContextMenuType.annotation;
        data.clientToken = clientToken;
        data.annotationData = annotation;
        data.annotationOverlayWidth = annotationOverlayWidth;
        return data;
    }

    /**
     * // get all the linked annotations against image cluster id which are not against current question item
     */
    private static getLinkedAnnotationsAgainstImage(markSchemesWithSameImages: Immutable.List<treeViewItem>,
        currentmarkingAnnotations: any): any {
        let linkedAnnotations = [];
        if (markSchemesWithSameImages && markSchemesWithSameImages.count() > 1) {
            markSchemesWithSameImages.map((item: treeViewItem) => {
                currentmarkingAnnotations.filter((annotation: annotation) => {
                    if (annotation.stamp === constants.LINK_ANNOTATION &&
                        annotation.markSchemeId === item.uniqueId &&
                        annotation.markingOperation !== enums.MarkingOperation.deleted) {
                        linkedAnnotations.push(annotation);
                    }
                });
            });

            linkedAnnotations = linkedAnnotations.filter(item => item !== undefined);
        }
        return linkedAnnotations;
    }

    /**
     * Finds the annotations to be displayed for EBookMarking responses.
     * @param linkedAnnotations
     * @param markSchemesWithSameImages
     * @param outputPageNo
     * @param currentImageMaxWidth
     * @param annotations
     */
    private static findAnnotationsToDisplayForEBookMarking(linkedAnnotations: any,
        markSchemesWithSameImages: Immutable.List<treeViewItem>, outputPageNo: number,
        currentImageMaxWidth: number, annotations: any): void {
        if (markSchemesWithSameImages && markSchemesWithSameImages.count() > 1) {
            if (linkedAnnotations && linkedAnnotations.length > 0) {
                AnnotationHelper.findAnnotationsAgainstOutputPageForMarkscheme(annotations, outputPageNo, currentImageMaxWidth);
            } else {
                // Get the stamps for the mark scheme id and the ouput page no.
                this.annotationsToDisplayInCurrentPage = Immutable.List<any>();
                markSchemesWithSameImages.map((item: treeViewItem) => {
                    this.annotationsToDisplayInCurrentPage = this.annotationsToDisplayInCurrentPage.concat(
                        annotations.filter((annotation: annotation) =>
                            annotation.markSchemeId === item.uniqueId &&
                            annotation.outputPageNo === outputPageNo
                            // If annotation is placed outside the image width, no need to display. It is an issue in Web Assessor
                            && annotation.leftEdge <= currentImageMaxWidth
                            && annotation.markingOperation !== enums.MarkingOperation.deleted
                            && annotation.stamp !== constants.LINK_ANNOTATION));
                });
            }
        } else {
            AnnotationHelper.findAnnotationsAgainstOutputPageForMarkscheme(annotations, outputPageNo, currentImageMaxWidth);
        }
    }

    /**
     * Finds the annotations to be displayed for structured responses.
     * @param linkedAnnotations
     * @param outputPageNo
     * @param imageClusterId
     * @param currentImageMaxWidth
     * @param annotations
     */
    private static findAnnotationsToDisplayForStructured(linkedAnnotations: any, outputPageNo: number, imageClusterId: number,
        currentImageMaxWidth: number, annotations: any): void {
        if (linkedAnnotations && linkedAnnotations.length > 0) {
            this.annotationsToDisplayInCurrentPage = annotations.filter((annotation: annotation) =>
                annotation.imageClusterId === imageClusterId &&
                annotation.outputPageNo === outputPageNo
                // If annotation is placed outside the image width, no need to display. It is an issue in Web Assessor
                && annotation.leftEdge <= currentImageMaxWidth
                && annotation.markingOperation !== enums.MarkingOperation.deleted
                && annotation.stamp !== constants.LINK_ANNOTATION
                && annotation.markSchemeId === markingStore.instance.currentMarkSchemeId);
        } else {
            // Get the stapms for the imageClusterId and the ouput page no.
            this.annotationsToDisplayInCurrentPage = annotations.filter((annotation: annotation) =>
                annotation.imageClusterId === imageClusterId &&
                annotation.outputPageNo === outputPageNo
                // If annotation is placed outside the image width, no need to display. It is an issue in Web Assessor
                && annotation.leftEdge <= currentImageMaxWidth
                && annotation.markingOperation !== enums.MarkingOperation.deleted
                && annotation.stamp !== constants.LINK_ANNOTATION);
        }
    }

    /**
     * Finds the annotations to be displayed against the outptut page for a markscheme.
     * @param annotations
     * @param outputPageNo
     * @param currentImageMaxWidth
     */
    private static findAnnotationsAgainstOutputPageForMarkscheme(annotations: any, outputPageNo: number,
        currentImageMaxWidth: number): void {
        // Get the stamps for the mark scheme id and the ouput page no.
        this.annotationsToDisplayInCurrentPage = annotations.filter((annotation: annotation) =>
            annotation.markSchemeId === markingStore.instance.currentMarkSchemeId &&
            annotation.outputPageNo === outputPageNo
            // If annotation is placed outside the image width, no need to display. It is an issue in Web Assessor
            && annotation.leftEdge <= currentImageMaxWidth
            && annotation.markingOperation !== enums.MarkingOperation.deleted
            && annotation.stamp !== constants.LINK_ANNOTATION);
    }

    /**
     * returns true, if the current examiner has view definitive/ edit definitive permission.
     */
    public static hasViewOrEditDefMarksPermssion(): boolean {
        return (standardisationSetupStore.instance.stdSetupPermissionCCData.role &&
            (standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editDefinitives ||
                standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.viewDefinitives));
    }

    /**
     * returns true, if the definitive marking for the selected unclassified response is started.
     */
    public static hasDefinitiveMarkingStarted(): boolean {
        return (standardisationSetupStore.instance.fetchStandardisationResponseData() &&
            standardisationSetupStore.instance.fetchStandardisationResponseData().hasDefinitiveMark === true) ? true : false;
    }

    /**
     * returns true, if the definitive marking for the selected unclassified response is started.
     */
    public static showDefMarkAndAnnotation(): boolean {
        return AnnotationHelper.hasViewOrEditDefMarksPermssion() && AnnotationHelper.hasDefinitiveMarkingStarted();
    }
}

export = AnnotationHelper;
