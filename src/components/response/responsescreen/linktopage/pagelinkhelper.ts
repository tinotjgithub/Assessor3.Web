import worklistStore = require('../../../../stores/worklist/workliststore');
import qigStore = require('../../../../stores/qigselector/qigstore');
import configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import examinerStore = require('../../../../stores/markerinformation/examinerstore');
import responseStore = require('../../../../stores/response/responsestore');
import enums = require('../../../utility/enums');
import constants = require('../../../utility/constants');
import markingStore = require('../../../../stores/marking/markingstore');
import annotation = require('../../../../stores/response/typings/annotation');
import treeViewItem = require('../../../../stores/markschemestructure/typings/treeviewitem');
import markingActionCreator = require('../../../../actions/marking/markingactioncreator');
import annotationHelper = require('../../../utility/annotation/annotationhelper');
import examinerMarkData = require('../../../../stores/response/typings/examinermarkdata');
import configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import responseHelper = require('../../../utility/responsehelper/responsehelper');
import targetHelper = require('../../../../utility/target/targethelper');
import examinerMarksAndAnnotation = require('../../../../stores/response/typings/examinermarksandannotation');
import markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
import loggerHelperConstants = require('../../../utility/loggerhelperconstants');
import loggingHelper = require('../../../utility/marking/markingauditlogginghelper');
import loggerConstants = require('../../../utility/loggerhelperconstants');
import imageZoneStore = require('../../../../stores/imagezones/imagezonestore');
import examinerMarksAndAnnotations = require('../../../../stores/response/typings/examinermarksandannotation');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');

/**
 * helper class for link to question
 */
class PageLinkHelper {

    /**
     * return true if we need to show link to question
     * @param isAtypicalResponse
     */
    public static doShowLinkToQuestion(isAtypicalResponse: boolean): boolean {
        if (responseHelper.isEResponse || isAtypicalResponse) {
            return false;
        } else {
            let responseMode = worklistStore.instance.getResponseMode;
            let qigId = qigStore.instance.selectedQIGForMarkerOperation !== undefined ?
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
            let updatePendingResponsesWhenSuspendedCcValue = configurableCharacteristicsHelper
                .getCharacteristicValue('UpdatePendingResponsesWhenSuspended', qigId);
            let updatePendingResponseWhenSuspendedCcStatus = updatePendingResponsesWhenSuspendedCcValue === 'true';
            let examinerStatus = examinerStore.instance.getMarkerInformation ?
                examinerStore.instance.getMarkerInformation.approvalStatus : undefined;

            if (examinerStatus === enums.ExaminerApproval.Suspended && responseMode === enums.ResponseMode.pending &&
                !updatePendingResponseWhenSuspendedCcStatus) {
                return false;
            } else if ((responseMode !== enums.ResponseMode.closed &&
                (responseStore.instance.markingMethod === enums.MarkingMethod.Structured || responseHelper.isEbookMarking))) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * return all the linked items against a page
     * @param pageNumber
     */
    public static getAllLinkedItemsAgainstPage(pageNumber: number): annotation[] {
        let annotation: annotation[] = [];
        let currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        let showDefAnnotationsOnly: boolean = PageLinkHelper.isSelectedTabEligibleForDefMarks ?
            annotationHelper.showDefMarkAndAnnotation() : false;
        let allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);
        if (allMarksAndAnnotations) {
            allMarksAndAnnotations.forEach((x: examinerMarksAndAnnotations) => {
                if (x.annotations) {
                    x.annotations.filter(item => {
                        if (item.stamp === constants.LINK_ANNOTATION &&
                            item.markingOperation !== enums.MarkingOperation.deleted && item.pageNo === pageNumber) {
                            if (PageLinkHelper.isSelectedTabEligibleForDefMarks) {
                                if (item.definitiveMark === showDefAnnotationsOnly) {
                                    annotation.push(item);
                                }
                            } else {
                                annotation.push(item);
                            }
                        }
                    });
                }
            });
            return annotation;
        }

        return null;
    }

    /**
     * return all the linked items
     */
    public static getAllLinkedItems(): annotation[] {
        let annotation: annotation[] = [];
        let currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        let allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);
        let showDefAnnotationsOnly: boolean = PageLinkHelper.isSelectedTabEligibleForDefMarks ?
            annotationHelper.showDefMarkAndAnnotation() : false;
        if (allMarksAndAnnotations) {

            allMarksAndAnnotations.forEach((x: examinerMarksAndAnnotations) => {
                if (x.annotations) {
                    x.annotations.filter(item => {
                        if (item.stamp === constants.LINK_ANNOTATION &&
                            item.markingOperation !== enums.MarkingOperation.deleted) {
                            if (PageLinkHelper.isSelectedTabEligibleForDefMarks) {
                                if (item.definitiveMark === showDefAnnotationsOnly) {
                                    annotation.push(item);
                                }
                            } else {
                                annotation.push(item);
                            }
                        }
                    });
                }
            });
            return annotation;
        }

        return null;
    }

    /**
     * return true if a page is linked
     * @param pageNumber
     */
    public static isPageLinked(pageNumber: number): boolean {
        let linkedAnnotations: annotation[] = PageLinkHelper.getAllLinkedItemsAgainstPage(pageNumber);
        if (linkedAnnotations && linkedAnnotations.filter(item => item.pageNo === pageNumber &&
            item.markingOperation !== enums.MarkingOperation.deleted).length > 0) {
            return true;
        }

        return false;
    }

    /**
     * return true if a page is linked by previous marker
     * @param pageNumber
     * @param previousResponseIndex
     */
    public static isPageLinkedByPreviousMarker(pageNumber: number, previousResponseIndex: number): boolean {
        let linkedAnnotations: annotation[] =
            PageLinkHelper.getLinkedAnnotationsFromPreviousMarksByPageNumeber(pageNumber, previousResponseIndex);
        if (linkedAnnotations && linkedAnnotations.filter(item => item.pageNo === pageNumber &&
            item.markingOperation !== enums.MarkingOperation.deleted).length > 0) {
            return true;
        }

        return false;
    }

    /**
     * return all the linked items against a page by previous marker
     * @param pageNumber
     * @param previousResponseIndex
     */
    public static getLinkedAnnotationsFromPreviousMarksByPageNumeber(pageNumber: number, previousResponseIndex: number): annotation[] {
        let currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        let examinerMarksAgainstResponse: Array<examinerMarkData> = markingStore.instance.getExaminerMarksAgainstResponse;
        let allMarksAndAnnotations = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
            .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId]
            .allMarksAndAnnotations[previousResponseIndex];
        if (allMarksAndAnnotations && allMarksAndAnnotations.annotations) {
            return allMarksAndAnnotations.annotations.filter(item => item.stamp === constants.LINK_ANNOTATION &&
                item.markingOperation !== enums.MarkingOperation.deleted && item.pageNo === pageNumber);
        }

        return null;
    }

    /**
     * return true if a page is linked to only one question item
     * @param pageNumber
     */
    public static numberOfLinks(pageNumber: number): number {
        let linkedAnnotations: annotation[] = PageLinkHelper.getAllLinkedItemsAgainstPage(pageNumber);
        return linkedAnnotations && linkedAnnotations.filter(item => item.pageNo === pageNumber &&
            item.markingOperation !== enums.MarkingOperation.deleted).length;
    }

    /**
     * return true if the markscheme is linked otherwise false
     * @param markSchemeId
     */
    public static isLinked(node: treeViewItem, pageNumber: number,
        isChildrenSkipped?: boolean, childNodes?: Immutable.List<treeViewItem>) {
        let linkedAnnotations: annotation[] = PageLinkHelper.getAllLinkedItemsAgainstPage(pageNumber);

        if (isChildrenSkipped && childNodes) {
            let firstChild = childNodes.get(0);
            if (firstChild.imageClusterId) {
                if (linkedAnnotations && linkedAnnotations.filter(item => item.imageClusterId === firstChild.imageClusterId
                    && item.pageNo === pageNumber).length > 0) {
                    return true;
                }
            }
        }

        if (linkedAnnotations && linkedAnnotations.filter(item => item.markSchemeId === node.uniqueId
            && item.pageNo === pageNumber).length > 0) {
            return true;
        }

        return false;
    }

    /**
     * return the markschemeid to which the link annotation is to be added
     * @param node
     * @param isChildrenSkipped
     * @param childNodes
     */
    public static getItemToLink(node: treeViewItem, childNodes: Immutable.List<treeViewItem>,
        isChildrenSkipped: boolean): treeViewItem {
        // if the child nodes of a item are skipped get the first child markschemeid
        if (isChildrenSkipped && childNodes) {
            let firstChild = childNodes.get(0);
            if (firstChild) {
                return firstChild;
            }
        } else if (node.itemType = enums.TreeViewItemType.marksScheme) {
            return node;
        }

        return undefined;
    }

    /**
     * add link annotation
     * @param annotation
     */
    public static addLinkAnnotation(annotation: annotation, previousMarkIndex?: number, isStitched: boolean = false, callBack?: Function) {
        markingActionCreator.addNewlyAddedAnnotation(annotation, 0, undefined, previousMarkIndex, isStitched);
        callBack(loggerHelperConstants.MARKENTRY_TYPE_ANNOTATION_ADD_LINK_ANNOTATION, annotation);
    }

    /**
     * remove link annotation
     * @param annotation
     */
    public static removeLinkAnnotation(annotation: annotation, callBack?: Function) {
        let isMarkByAnnotation: boolean;
        isMarkByAnnotation = responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus);
        markingActionCreator.removeAnnotation([annotation.clientToken], isMarkByAnnotation, false, enums.ContextMenuType.annotation, true);
        callBack(loggerHelperConstants.MARKENTRY_TYPE_ANNOTATION_REMOVED_LINK_ANNOTATION, annotation);
    }

    /**
     * return true if annotations is already added in the collection
     * @param clientToken
     */
    public static isLinkAnnotationAlreadyAdded(clientToken: string) {
        let currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        let allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);
        let showDefAnnotationsOnly: boolean = PageLinkHelper.isSelectedTabEligibleForDefMarks ?
            annotationHelper.showDefMarkAndAnnotation() : false;
        let linkAnnotationCount: number = 0;
        if (allMarksAndAnnotations) {
            //checks whether the clientToken (linked annotation) passed is available in the collection.
            allMarksAndAnnotations.forEach((x: examinerMarksAndAnnotations) => {
                if (x.annotations) {
                    linkAnnotationCount += x.annotations.filter(item => item.clientToken === clientToken
                        && item.markingOperation !== enums.MarkingOperation.deleted
                        && (PageLinkHelper.isSelectedTabEligibleForDefMarks ?
                            item.definitiveMark === showDefAnnotationsOnly : true)).length;
                }
            });
        }

        return linkAnnotationCount > 0;
    }

    /**
     * returns link annotation data
     * @param node
     * @param childNodes
     * @param isChildrenSkipped
     * @param pageNumber
     */
    public static getLinkAnnotationData(node: treeViewItem, childNodes: Immutable.List<treeViewItem>,
        isChildrenSkipped: boolean, pageNumber: number): annotation {
        let item = PageLinkHelper.getItemToLink(node, childNodes, isChildrenSkipped);
        return PageLinkHelper.getDataForLinkAnnotationToAdd(item.imageClusterId, pageNumber, item.uniqueId);
    }

    /**
     * get data for link annotation to add
     * @param imageClusterId
     * @param pageNumber
     * @param markSchemeId
     */
    public static getDataForLinkAnnotationToAdd(imageClusterId: number, pageNumber: number, markSchemeId: number): annotation {
        let newlyAddedAnnotation: annotation = annotationHelper.getAnnotationToAdd(constants.LINK_ANNOTATION,
            pageNumber, imageClusterId, 0,
            60, 60,
            enums.AddAnnotationAction.Stamping,
            7, 7,
            markSchemeId, 0, 0);
        newlyAddedAnnotation.addedBySystem = false;
        return newlyAddedAnnotation;
    }

    /**
     * return true if annotation added to a linked page against a markscheme
     * @param pageNumber
     * @param markSchemeId
     */
    public static isAnnotationAddedAgainstPage(pageNumber: number, markSchemeId: number): boolean {
        let currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        let allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);
        let showDefAnnotationsOnly: boolean = PageLinkHelper.isSelectedTabEligibleForDefMarks ?
            annotationHelper.showDefMarkAndAnnotation() : false;
        let annotationCount: number = 0;
        if (allMarksAndAnnotations) {

                //calculating the annotation count against a particular markscheme and pageno, excluding linked annotation.
                allMarksAndAnnotations.forEach((x: examinerMarksAndAnnotations) => {
                    if (x.annotations) {
                        annotationCount += x.annotations.filter(item => item.pageNo === pageNumber &&
                            item.markSchemeId === markSchemeId && item.stamp !== constants.LINK_ANNOTATION &&
                            item.markingOperation !== enums.MarkingOperation.deleted &&
                            (PageLinkHelper.isSelectedTabEligibleForDefMarks ?
                                item.definitiveMark === showDefAnnotationsOnly : true)).length;
                    }
                });
        }

        return annotationCount > 0;
    }

    /**
     * return all the linked items against current markscheme Id.
     * @param markSchemeId
     */
    public static getAllLinkedItemsAgainstMarkSchemeID(markSchemeId: number): annotation[] {
        let annotation: annotation[] = [];
        let currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        let showDefAnnotationsOnly: boolean = PageLinkHelper.isSelectedTabEligibleForDefMarks ?
            annotationHelper.showDefMarkAndAnnotation() : false;
        let allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);
        if (allMarksAndAnnotations) {

            allMarksAndAnnotations.forEach((x: examinerMarksAndAnnotations) => {
                if (x.annotations) {
                    x.annotations.filter(item => {
                        if (item.stamp === constants.LINK_ANNOTATION &&
                            item.markSchemeId === markSchemeId &&
                            item.markingOperation !== enums.MarkingOperation.deleted &&
                            (PageLinkHelper.isSelectedTabEligibleForDefMarks ?
                                item.definitiveMark === showDefAnnotationsOnly : true)) {
                            annotation.push(item);
                        }
                    });
                }
            });
            return annotation;
        }
        return null;
    }

    /**
     * return the count of all linked items against current markscheme Id excluding pages used in Imagezones.
     * @param markSchemeId
     */
    public static getLinkedPagesCountExcludingPagesUsedInImageZones(markSchemeID: number): number {
        let linkedPages: number = 0;

        let linkedAnnotations = this.getAllLinkedItemsAgainstMarkSchemeID(markSchemeID);

        if (linkedAnnotations) {
            let currentQuestionItemInfo = markingStore.instance.currentQuestionItemInfo;
            let prvImageZonePageNo: number[] = [];

            let _imageZones = (responseHelper.isEbookMarking) ?
                imageZoneStore.instance.currentCandidateScriptImageZone :
                imageZoneStore.instance.imageZoneList.imageZones;

            let imageZones = _imageZones.filter((imagezone: ImageZone) =>
                imagezone.imageClusterId === currentQuestionItemInfo.imageClusterId);

            for (let arrayindex = 0; arrayindex < linkedAnnotations.length; arrayindex++) {
                imageZones.map((imagezone: ImageZone) => {
                    if (imagezone.pageNo === linkedAnnotations[arrayindex].pageNo &&
                        prvImageZonePageNo.filter((x: number) => x === imagezone.pageNo).length === 0) {
                        linkedPages++;
                        prvImageZonePageNo.push(imagezone.pageNo);
                    }
                });
            }
            return (linkedAnnotations.length - linkedPages);
        }
        return linkedPages;
    }

    /**
     * return all the linked items against question item.
     * @param markschemeID
     * @param checkPreviousMarker
     */

    public static getLinkedAnnotationAgainstQuestionItem(markschemeID: number, checkPreviousMarker: boolean): annotation[] {
        let currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        // keep all marka nd annotation of current response.
        let showDefAnnotationsOnly: boolean = PageLinkHelper.isSelectedTabEligibleForDefMarks ?
            annotationHelper.showDefMarkAndAnnotation() : false;
        let allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);

        // keep linkannotation details of current and previous question item.
        let linkedAnnotationAgainstMarkscheme: Array<annotation> = [];

        if (allMarksAndAnnotations) {

            allMarksAndAnnotations.forEach((x: examinerMarksAndAnnotations) => {
                if (x.annotations) {
                    // keep link annoation details of the current question item.
                    x.annotations.filter(item => {
                        if (item.markSchemeId === markschemeID &&
                            item.stamp === constants.LINK_ANNOTATION &&
                            item.markingOperation !== enums.MarkingOperation.deleted &&
                            (PageLinkHelper.isSelectedTabEligibleForDefMarks ?
                                item.definitiveMark === showDefAnnotationsOnly : true)) {
                            linkedAnnotationAgainstMarkscheme.push(item);
                        }
                    });
                }
            });

            if (checkPreviousMarker) {
                let examinerMarksAgainstResponse: Array<examinerMarkData> = markingStore.instance.getExaminerMarksAgainstResponse;
                if (examinerMarksAgainstResponse && examinerMarksAgainstResponse.length > 0) {
                    let allMarksAndAnnotations = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                        .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId].allMarksAndAnnotations;
                    if (allMarksAndAnnotations) {
                        allMarksAndAnnotations.map((item: Immutable.List<examinerMarksAndAnnotation>, index: number) => {
                            // index 0 is for current marking.
                            if (index > 0) {
                                linkedAnnotationAgainstMarkscheme = linkedAnnotationAgainstMarkscheme.concat(
                                    PageLinkHelper.getLinkedAnnotationsFromPreviousMarks(index, markschemeID));
                            }
                        });
                    }
                }
            }
            linkedAnnotationAgainstMarkscheme = linkedAnnotationAgainstMarkscheme.filter(item => item !== undefined);
            return linkedAnnotationAgainstMarkscheme;
        }

        return null;
    }

    /**
     * return true if the zone is linked
     * @param imageZone
     * @param multipleMarkSchemes
     * @param checkForPreviousMarker
     */
    public static isZoneLinked(imageZone: ImageZone, multipleMarkSchemes: treeViewItem,
        checkForPreviousMarker: boolean = false): boolean {
        let isLinkedByCurrentMarker = false;
        let isLinkedByPreviousMarker = false;
        if (imageZone) {
            let currentQuestionItemInfo = markingStore.instance.currentQuestionItemInfo;
            let linkedAnnotations = PageLinkHelper.getAllLinkedItemsAgainstPage(imageZone.pageNo);
            if (currentQuestionItemInfo && linkedAnnotations) {
                if (multipleMarkSchemes && multipleMarkSchemes.treeViewItemList.count() === 2) {
                    isLinkedByCurrentMarker = linkedAnnotations.filter(item =>
                        item.imageClusterId === currentQuestionItemInfo.imageClusterId).length > 0;
                } else {
                    isLinkedByCurrentMarker = linkedAnnotations.filter(item =>
                        item.markSchemeId === currentQuestionItemInfo.uniqueId).length > 0;
                }

                if (checkForPreviousMarker) {
                    let previousMarkerLinkedAnnotations: annotation[] = [];
					let examinerMarksAgainstResponse: Array<examinerMarkData> = markingStore.instance.getExaminerMarksAgainstResponse;
					if (examinerMarksAgainstResponse && examinerMarksAgainstResponse.length > 0 && markingStore.instance.currentMarkGroupId !== 0) {
                        let allMarksAndAnnotations = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                            .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId].allMarksAndAnnotations;
                        if (allMarksAndAnnotations) {
                            allMarksAndAnnotations.map((item: Immutable.List<examinerMarksAndAnnotation>, index: number) => {
                                // index 0 is for current marking.
                                if (index > 0) {
                                    multipleMarkSchemes.treeViewItemList.map((treeViewItem: treeViewItem) => {
                                        let annotations = PageLinkHelper.getLinkedAnnotationsFromPreviousMarksByPageNumeber
                                            (imageZone.pageNo, index);
                                        if (annotations && annotations.length > 0 && !isLinkedByPreviousMarker) {
                                            isLinkedByPreviousMarker = true;
                                        }
                                    });
                                }
                            });
                        }
                    }

                    return isLinkedByPreviousMarker || isLinkedByCurrentMarker;
                }
            }
        }
        return isLinkedByCurrentMarker;
    }

    /* return true if linked images need to be shown */
    public static get doShowPreviousMarkerLinkedPages(): boolean {
        let workListType: enums.WorklistType = worklistStore.instance.currentWorklistType;
        let responseMode: enums.ResponseMode = responseStore.instance.selectedResponseMode;
        let currentWorkListType: enums.WorklistType = worklistStore.instance.currentWorklistType;
        let doShowPreviousMarkerLinkedPages = false;
        if (markerOperationModeFactory.operationMode.isTeamManagementMode && annotationHelper.doShowPreviousAnnotations) {
            return true;
        }
        switch (workListType) {
            case enums.WorklistType.practice:
                let isBlindPracticeMarkingOn: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
                    configurableCharacteristicsNames.BlindPracticeMarking).toLowerCase() === 'true';
                if (!(isBlindPracticeMarkingOn === true && responseMode === enums.ResponseMode.open)) {
                    doShowPreviousMarkerLinkedPages = true;
                }
                break;
            case enums.WorklistType.standardisation:
            case enums.WorklistType.secondstandardisation:
                let showStandardisationDefinitiveMarks: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
                    configurableCharacteristicsNames.ShowStandardisationDefinitiveMarks,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
                if (showStandardisationDefinitiveMarks === true && responseMode === enums.ResponseMode.closed) {
                    doShowPreviousMarkerLinkedPages = true;
                }
                break;
        }

        if (responseMode === enums.ResponseMode.closed && responseHelper.isSeedResponse) {
            let automaticQualityFeedbackCC = configurableCharacteristicsHelper.getCharacteristicValue(
                configurableCharacteristicsNames.AutomaticQualityFeedback,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
            if (automaticQualityFeedbackCC === true) {
                return true;
            }
        }

        if (currentWorkListType === enums.WorklistType.directedRemark || currentWorkListType === enums.WorklistType.pooledRemark) {
            doShowPreviousMarkerLinkedPages = true;
        }
        return doShowPreviousMarkerLinkedPages;
    }

    /**
     * get all the linked annotations against a questionitem for a particular marking
     * @param index
     * @param markSchemeId
     */
    public static getLinkedAnnotationsFromPreviousMarks(index: number, markSchemeId: number) {
        let examinerMarksAgainstResponse: Array<examinerMarkData> = markingStore.instance.getExaminerMarksAgainstResponse;
        let linkedAnnotations;
        if (examinerMarksAgainstResponse) {
            let allMarksAndAnnotation = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId]
                .allMarksAndAnnotations[index].annotations;
            if (allMarksAndAnnotation && allMarksAndAnnotation.length > 0) {
                linkedAnnotations = allMarksAndAnnotation.filter(annotation =>
                    annotation.stamp === constants.LINK_ANNOTATION &&
                    annotation.markSchemeId === markSchemeId &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted);
            }
        }

        return linkedAnnotations;
    }

    /**
     * get all the linked annotations against a questionitem for a particular marking
     * @param index
     * @param markSchemeId
     */
    public static getAnnotationsFromPreviousMarks(index: number) {
        let examinerMarksAgainstResponse: Array<examinerMarkData> = markingStore.instance.getExaminerMarksAgainstResponse;
        if (examinerMarksAgainstResponse) {
            return examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId]
                .allMarksAndAnnotations[index].annotations;
        }

        return null;
    }

    /**
     * Add link annotattion to anotated slaos
     * @param currentAnnotations
     * @param additionalScriptImages
     * @param isPreviousMarks
     * @param previousResponseIndex
     */
    public static addLinksToAnnotatedSLAO(currentAnnotations: annotation[],
        additionalScriptImages: ScriptImage[], isPreviousMarks: boolean, previousResponseIndex?: number) {

        // filter annottaions disticntly by pageno
        currentAnnotations = annotationHelper.filetrAnnotationsDistinctlyByPageNo(currentAnnotations.filter(
            item => item.markingOperation !== enums.MarkingOperation.deleted));

        // add a dummy link annotation if link is not assosiated with AO having annotation
        currentAnnotations.forEach((currentAnnotation: annotation) => {
            for (let index = 0; index < additionalScriptImages.length; index++) {
                let linkToCurrentPage: annotation;
                if (isPreviousMarks) {
                    // if annottaion is added by previous marker, then add link annotation to previous annotation colection
                    if (PageLinkHelper.isAnnotatedSLAOIsNotLinked(currentAnnotation, isPreviousMarks,
                        additionalScriptImages[index].pageNumber, previousResponseIndex)) {
                        linkToCurrentPage = PageLinkHelper.getDataForLinkAnnotationToAdd(
                            currentAnnotation.imageClusterId, currentAnnotation.pageNo, currentAnnotation.markSchemeId);
                        linkToCurrentPage.isDirty = false;
                        linkToCurrentPage.examinerRoleId = currentAnnotation.examinerRoleId;
                        linkToCurrentPage.markGroupId = currentAnnotation.markGroupId;
                    }
                } else {
                    // if annotation is added by current marker, then add link annotation to current annotation colection
                    if (PageLinkHelper.isAnnotatedSLAOIsNotLinked(currentAnnotation, isPreviousMarks,
                        additionalScriptImages[index].pageNumber)) {
                        linkToCurrentPage = PageLinkHelper.getDataForLinkAnnotationToAdd(
                            currentAnnotation.imageClusterId, currentAnnotation.pageNo, currentAnnotation.markSchemeId);
                    }
                }
                if (linkToCurrentPage) {
                    PageLinkHelper.addLinkAnnotation(linkToCurrentPage, previousResponseIndex, false, this.logAnnoataionModificationAction);
                }
            }
        });
    }

	/**
	 * Log annoatation modification actions
	 * @param actionType
	 * @param annotation
	 */
    private static logAnnoataionModificationAction(actionType: string, annotation: any): void {
        // Log the mark copied details
        new loggingHelper().logAnnotationModifiedAction(loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED,
            actionType,
            annotation,
            markingStore.instance.currentMarkGroupId,
            markingStore.instance.currentMarkSchemeId);
    }

    /**
     * Returns true if the annotated slao is not linked
     * @param currentAnnotation
     * @param isPreviousMarks
     * @param additionalScriptImagePageNumber
     * @param previousResponseIndex
     */
    private static isAnnotatedSLAOIsNotLinked(currentAnnotation: annotation, isPreviousMarks:
        boolean, additionalScriptImagePageNumber: number, previousResponseIndex?: number) {
        if (isPreviousMarks) {
            return !currentAnnotation.addedBySystem &&
                currentAnnotation.pageNo === additionalScriptImagePageNumber &&
                !PageLinkHelper.isPageLinkedByPreviousMarker(currentAnnotation.pageNo, previousResponseIndex);
        } else {
            return !currentAnnotation.addedBySystem &&
                currentAnnotation.pageNo === additionalScriptImagePageNumber &&
                !PageLinkHelper.isPageLinked(currentAnnotation.pageNo);
        }
    }

    /**
     * add a link annotation if the page is linked by previous marker and current marker is
     * adding a annotation for the first time
     */
    public static addLinkAnnotationIfPageIsLinkedByPreviousMarker(pageNo: number, isALinkedPage: boolean,
        pagesLinkedByPreviousMarkers: number[], multipleMarkSchemes: treeViewItem) {
        if (isALinkedPage && PageLinkHelper.doShowPreviousMarkerLinkedPages &&
            pagesLinkedByPreviousMarkers && pagesLinkedByPreviousMarkers.length > 0) {
            let markSchemeId = 0;
            // check if the currently selected question is a multiple markscheme.
            // if its a multiple markscheme then add link annotation against the first child.
            if (multipleMarkSchemes && multipleMarkSchemes.treeViewItemList.count() === 2) {
                markSchemeId = multipleMarkSchemes.treeViewItemList.first().uniqueId;
            } else {
                markSchemeId = markingStore.instance.currentQuestionItemInfo.uniqueId;
            }
            // check if the marker is placing annotation on a page which was linked by previous marker
            // check if a link annotation was already added against the current question
            let linkedAnnotationAgainstQuestionitem = PageLinkHelper.getLinkedAnnotationAgainstQuestionItem(
                markSchemeId, false);
            if (pagesLinkedByPreviousMarkers.indexOf(pageNo) > -1 &&
                linkedAnnotationAgainstQuestionitem && linkedAnnotationAgainstQuestionitem.length === 0) {
                let annotationData = PageLinkHelper.getDataForLinkAnnotationToAdd(0, pageNo, markSchemeId);
                markingActionCreator.addNewlyAddedAnnotation(annotationData, undefined, null, null, null, false, true);
            }
        }
    }

    /**
     * to Link the page on clicking the 'view whole response' button in structured zones
     * @static
     * @param {ImageZone} activeImageZone
     * @param isStitched
     * @param currentMarkSchemeId
     * @memberof PageLinkHelper
     */
    public static linkImageZone(activeImageZone: ImageZone, isStitched: boolean, currentMarkSchemeId: number) {
        let annotationData = PageLinkHelper.getDataForLinkAnnotationToAdd
            (activeImageZone.imageClusterId ? activeImageZone.imageClusterId : 0,
            activeImageZone.pageNo,
            currentMarkSchemeId);
        PageLinkHelper.addLinkAnnotation(annotationData, undefined, isStitched, this.logAnnoataionModificationAction);
    }

    /**
     * get true if the selected standardisation tab is Unclassified.
     */
    private static get isSelectedTabEligibleForDefMarks(): boolean {
        return standardisationSetupStore.instance.isUnClassifiedWorklist ||
            standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse;
    }
}

export = PageLinkHelper;