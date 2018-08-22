"use strict";
var worklistStore = require('../../../../stores/worklist/workliststore');
var qigStore = require('../../../../stores/qigselector/qigstore');
var configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var examinerStore = require('../../../../stores/markerinformation/examinerstore');
var responseStore = require('../../../../stores/response/responsestore');
var enums = require('../../../utility/enums');
var constants = require('../../../utility/constants');
var markingStore = require('../../../../stores/marking/markingstore');
var markingActionCreator = require('../../../../actions/marking/markingactioncreator');
var annotationHelper = require('../../../utility/annotation/annotationhelper');
var configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var responseHelper = require('../../../utility/responsehelper/responsehelper');
var markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
var loggerHelperConstants = require('../../../utility/loggerhelperconstants');
var loggingHelper = require('../../../utility/marking/markingauditlogginghelper');
var loggerConstants = require('../../../utility/loggerhelperconstants');
var imageZoneStore = require('../../../../stores/imagezones/imagezonestore');
/**
 * helper class for link to question
 */
var PageLinkHelper = (function () {
    function PageLinkHelper() {
    }
    /**
     * return true if we need to show link to question
     * @param isAtypicalResponse
     */
    PageLinkHelper.doShowLinkToQuestion = function (isAtypicalResponse) {
        if (responseHelper.isEResponse || isAtypicalResponse) {
            return false;
        }
        else {
            var responseMode = worklistStore.instance.getResponseMode;
            var qigId = qigStore.instance.selectedQIGForMarkerOperation !== undefined ?
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
            var updatePendingResponsesWhenSuspendedCcValue = configurableCharacteristicsHelper
                .getCharacteristicValue('UpdatePendingResponsesWhenSuspended', qigId);
            var updatePendingResponseWhenSuspendedCcStatus = updatePendingResponsesWhenSuspendedCcValue === 'true';
            var examinerStatus = examinerStore.instance.getMarkerInformation ?
                examinerStore.instance.getMarkerInformation.approvalStatus : undefined;
            if (examinerStatus === enums.ExaminerApproval.Suspended && responseMode === enums.ResponseMode.pending &&
                !updatePendingResponseWhenSuspendedCcStatus) {
                return false;
            }
            else if ((responseMode !== enums.ResponseMode.closed &&
                (responseStore.instance.markingMethod === enums.MarkingMethod.Structured || responseHelper.isEbookMarking))) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    /**
     * return all the linked items against a page
     * @param pageNumber
     */
    PageLinkHelper.getAllLinkedItemsAgainstPage = function (pageNumber) {
        var annotation = [];
        var currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        var showDefAnnotationsOnly = this.showDefinitiveMarksOnly();
        var allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);
        if (allMarksAndAnnotations) {
            allMarksAndAnnotations.forEach(function (x) {
                if (x.annotations) {
                    x.annotations.filter(function (item) {
                        if (item.stamp === constants.LINK_ANNOTATION &&
                            item.markingOperation !== enums.MarkingOperation.deleted && item.pageNo === pageNumber) {
                            if (!showDefAnnotationsOnly) {
                                annotation.push(item);
                            }
                            else if (item.definitiveMark === true) {
                                annotation.push(item);
                            }
                        }
                    });
                }
            });
            return annotation;
        }
        return null;
    };
    /**
     * return all the linked items
     */
    PageLinkHelper.getAllLinkedItems = function () {
        var annotation = [];
        var currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        var allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);
        var showDefAnnotationsOnly = this.showDefinitiveMarksOnly();
        if (allMarksAndAnnotations) {
            allMarksAndAnnotations.forEach(function (x) {
                if (x.annotations) {
                    x.annotations.filter(function (item) {
                        if (item.stamp === constants.LINK_ANNOTATION &&
                            item.markingOperation !== enums.MarkingOperation.deleted) {
                            if (!showDefAnnotationsOnly) {
                                annotation.push(item);
                            }
                            else if (item.definitiveMark === true) {
                                annotation.push(item);
                            }
                        }
                    });
                }
            });
            return annotation;
        }
        return null;
    };
    /**
     * return true if a page is linked
     * @param pageNumber
     */
    PageLinkHelper.isPageLinked = function (pageNumber) {
        var linkedAnnotations = PageLinkHelper.getAllLinkedItemsAgainstPage(pageNumber);
        if (linkedAnnotations && linkedAnnotations.filter(function (item) { return item.pageNo === pageNumber &&
            item.markingOperation !== enums.MarkingOperation.deleted; }).length > 0) {
            return true;
        }
        return false;
    };
    /**
     * return true if a page is linked by previous marker
     * @param pageNumber
     * @param previousResponseIndex
     */
    PageLinkHelper.isPageLinkedByPreviousMarker = function (pageNumber, previousResponseIndex) {
        var linkedAnnotations = PageLinkHelper.getLinkedAnnotationsFromPreviousMarksByPageNumeber(pageNumber, previousResponseIndex);
        if (linkedAnnotations && linkedAnnotations.filter(function (item) { return item.pageNo === pageNumber &&
            item.markingOperation !== enums.MarkingOperation.deleted; }).length > 0) {
            return true;
        }
        return false;
    };
    /**
     * return all the linked items against a page by previous marker
     * @param pageNumber
     * @param previousResponseIndex
     */
    PageLinkHelper.getLinkedAnnotationsFromPreviousMarksByPageNumeber = function (pageNumber, previousResponseIndex) {
        var currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        var examinerMarksAgainstResponse = markingStore.instance.getExaminerMarksAgainstResponse;
        var allMarksAndAnnotations = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
            .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId]
            .allMarksAndAnnotations[previousResponseIndex];
        if (allMarksAndAnnotations && allMarksAndAnnotations.annotations) {
            return allMarksAndAnnotations.annotations.filter(function (item) { return item.stamp === constants.LINK_ANNOTATION &&
                item.markingOperation !== enums.MarkingOperation.deleted && item.pageNo === pageNumber; });
        }
        return null;
    };
    /**
     * return true if a page is linked to only one question item
     * @param pageNumber
     */
    PageLinkHelper.numberOfLinks = function (pageNumber) {
        var linkedAnnotations = PageLinkHelper.getAllLinkedItemsAgainstPage(pageNumber);
        return linkedAnnotations && linkedAnnotations.filter(function (item) { return item.pageNo === pageNumber &&
            item.markingOperation !== enums.MarkingOperation.deleted; }).length;
    };
    /**
     * return true if the markscheme is linked otherwise false
     * @param markSchemeId
     */
    PageLinkHelper.isLinked = function (node, pageNumber, isChildrenSkipped, childNodes) {
        var linkedAnnotations = PageLinkHelper.getAllLinkedItemsAgainstPage(pageNumber);
        if (isChildrenSkipped && childNodes) {
            var firstChild_1 = childNodes.get(0);
            if (firstChild_1.imageClusterId) {
                if (linkedAnnotations && linkedAnnotations.filter(function (item) { return item.imageClusterId === firstChild_1.imageClusterId
                    && item.pageNo === pageNumber; }).length > 0) {
                    return true;
                }
            }
        }
        if (linkedAnnotations && linkedAnnotations.filter(function (item) { return item.markSchemeId === node.uniqueId
            && item.pageNo === pageNumber; }).length > 0) {
            return true;
        }
        return false;
    };
    /**
     * return the markschemeid to which the link annotation is to be added
     * @param node
     * @param isChildrenSkipped
     * @param childNodes
     */
    PageLinkHelper.getItemToLink = function (node, childNodes, isChildrenSkipped) {
        // if the child nodes of a item are skipped get the first child markschemeid
        if (isChildrenSkipped && childNodes) {
            var firstChild = childNodes.get(0);
            if (firstChild) {
                return firstChild;
            }
        }
        else if (node.itemType = enums.TreeViewItemType.marksScheme) {
            return node;
        }
        return undefined;
    };
    /**
     * add link annotation
     * @param annotation
     */
    PageLinkHelper.addLinkAnnotation = function (annotation, previousMarkIndex, isStitched, callBack) {
        if (isStitched === void 0) { isStitched = false; }
        markingActionCreator.addNewlyAddedAnnotation(annotation, 0, undefined, previousMarkIndex, isStitched);
        callBack(loggerHelperConstants.MARKENTRY_TYPE_ANNOTATION_ADD_LINK_ANNOTATION, annotation);
    };
    /**
     * remove link annotation
     * @param annotation
     */
    PageLinkHelper.removeLinkAnnotation = function (annotation, callBack) {
        markingActionCreator.removeAnnotation([annotation.clientToken], false, enums.ContextMenuType.annotation, true);
        callBack(loggerHelperConstants.MARKENTRY_TYPE_ANNOTATION_REMOVED_LINK_ANNOTATION, annotation);
    };
    /**
     * return true if annotations is already added in the collection
     * @param clientToken
     */
    PageLinkHelper.isLinkAnnotationAlreadyAdded = function (clientToken) {
        var currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        var allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);
        var showDefAnnotationsOnly = this.showDefinitiveMarksOnly();
        var linkAnnotationCount = 0;
        if (allMarksAndAnnotations) {
            //checks whether the clientToken (linked annotation) passed is available in the collection.
            if (!showDefAnnotationsOnly) {
                allMarksAndAnnotations.forEach(function (x) {
                    if (x.annotations) {
                        linkAnnotationCount += x.annotations.filter(function (item) { return item.clientToken === clientToken
                            && item.markingOperation !== enums.MarkingOperation.deleted; }).length;
                    }
                });
            }
            else {
                allMarksAndAnnotations.forEach(function (x) {
                    if (x.annotations) {
                        linkAnnotationCount += x.annotations.filter(function (item) { return item.clientToken === clientToken
                            && item.markingOperation !== enums.MarkingOperation.deleted
                            && item.definitiveMark === true; }).length;
                    }
                });
            }
        }
        return linkAnnotationCount > 0;
    };
    /**
     * returns link annotation data
     * @param node
     * @param childNodes
     * @param isChildrenSkipped
     * @param pageNumber
     */
    PageLinkHelper.getLinkAnnotationData = function (node, childNodes, isChildrenSkipped, pageNumber) {
        var item = PageLinkHelper.getItemToLink(node, childNodes, isChildrenSkipped);
        return PageLinkHelper.getDataForLinkAnnotationToAdd(item.imageClusterId, pageNumber, item.uniqueId);
    };
    /**
     * get data for link annotation to add
     * @param imageClusterId
     * @param pageNumber
     * @param markSchemeId
     */
    PageLinkHelper.getDataForLinkAnnotationToAdd = function (imageClusterId, pageNumber, markSchemeId) {
        var newlyAddedAnnotation = annotationHelper.getAnnotationToAdd(constants.LINK_ANNOTATION, pageNumber, imageClusterId, 0, 60, 60, enums.AddAnnotationAction.Stamping, 7, 7, markSchemeId, 0, 0);
        newlyAddedAnnotation.addedBySystem = false;
        return newlyAddedAnnotation;
    };
    /**
     * return true if annotation added to a linked page against a markscheme
     * @param pageNumber
     * @param markSchemeId
     */
    PageLinkHelper.isAnnotationAddedAgainstPage = function (pageNumber, markSchemeId) {
        var currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        var allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);
        var showDefAnnotationsOnly = this.showDefinitiveMarksOnly();
        var annotationCount = 0;
        if (allMarksAndAnnotations) {
            if (!showDefAnnotationsOnly) {
                //calculating the annotation count against a particular markscheme and pageno, excluding linked annotation.
                allMarksAndAnnotations.forEach(function (x) {
                    if (x.annotations) {
                        annotationCount += x.annotations.filter(function (item) { return item.pageNo === pageNumber &&
                            item.markSchemeId === markSchemeId && item.stamp !== constants.LINK_ANNOTATION &&
                            item.markingOperation !== enums.MarkingOperation.deleted; }).length;
                    }
                });
            }
            else {
                //calculating the annotation count against a particular markscheme and pageno, excluding linked annotation.
                allMarksAndAnnotations.forEach(function (x) {
                    if (x.annotations) {
                        annotationCount += x.annotations.filter(function (item) { return item.pageNo === pageNumber &&
                            item.markSchemeId === markSchemeId && item.stamp !== constants.LINK_ANNOTATION &&
                            item.markingOperation !== enums.MarkingOperation.deleted &&
                            item.definitiveMark === true; }).length;
                    }
                });
            }
        }
        return annotationCount > 0;
    };
    /**
     * return all the linked items against current markscheme Id.
     * @param markSchemeId
     */
    PageLinkHelper.getAllLinkedItemsAgainstMarkSchemeID = function (markSchemeId) {
        var annotation = [];
        var currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        var showDefAnnotationsOnly = this.showDefinitiveMarksOnly();
        var allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);
        if (allMarksAndAnnotations) {
            allMarksAndAnnotations.forEach(function (x) {
                if (x.annotations) {
                    if (showDefAnnotationsOnly) {
                        x.annotations.filter(function (item) {
                            if (item.stamp === constants.LINK_ANNOTATION &&
                                item.markSchemeId === markSchemeId &&
                                item.markingOperation !== enums.MarkingOperation.deleted &&
                                item.definitiveMark === true) {
                                annotation.push(item);
                            }
                        });
                    }
                    else {
                        x.annotations.filter(function (item) {
                            if (item.stamp === constants.LINK_ANNOTATION &&
                                item.markSchemeId === markSchemeId &&
                                item.markingOperation !== enums.MarkingOperation.deleted) {
                                annotation.push(item);
                            }
                        });
                    }
                }
            });
            return annotation;
        }
        return null;
    };
    /**
     * return the count of all linked items against current markscheme Id excluding pages used in Imagezones.
     * @param markSchemeId
     */
    PageLinkHelper.getLinkedPagesCountExcludingPagesUsedInImageZones = function (markSchemeID) {
        var linkedPages = 0;
        var linkedAnnotations = this.getAllLinkedItemsAgainstMarkSchemeID(markSchemeID);
        if (linkedAnnotations) {
            var currentQuestionItemInfo_1 = markingStore.instance.currentQuestionItemInfo;
            var prvImageZonePageNo_1 = [];
            var _imageZones = (responseHelper.isEbookMarking) ?
                imageZoneStore.instance.currentCandidateScriptImageZone :
                imageZoneStore.instance.imageZoneList.imageZones;
            var imageZones = _imageZones.filter(function (imagezone) {
                return imagezone.imageClusterId === currentQuestionItemInfo_1.imageClusterId;
            });
            var _loop_1 = function(arrayindex) {
                imageZones.map(function (imagezone) {
                    if (imagezone.pageNo === linkedAnnotations[arrayindex].pageNo &&
                        prvImageZonePageNo_1.filter(function (x) { return x === imagezone.pageNo; }).length === 0) {
                        linkedPages++;
                        prvImageZonePageNo_1.push(imagezone.pageNo);
                    }
                });
            };
            for (var arrayindex = 0; arrayindex < linkedAnnotations.length; arrayindex++) {
                _loop_1(arrayindex);
            }
            return (linkedAnnotations.length - linkedPages);
        }
        return linkedPages;
    };
    /**
     * return all the linked items against question item.
     * @param markschemeID
     * @param checkPreviousMarker
     */
    PageLinkHelper.getLinkedAnnotationAgainstQuestionItem = function (markschemeID, checkPreviousMarker) {
        var currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        // keep all marka nd annotation of current response.
        var showDefAnnotationsOnly = this.showDefinitiveMarksOnly();
        var allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(currentMarkGroupId);
        // keep linkannotation details of current and previous question item.
        var linkedAnnotationAgainstMarkscheme = [];
        if (allMarksAndAnnotations) {
            allMarksAndAnnotations.forEach(function (x) {
                if (x.annotations) {
                    // keep link annoation details of the current question item.
                    if (showDefAnnotationsOnly) {
                        x.annotations.filter(function (item) {
                            if (item.markSchemeId === markschemeID &&
                                item.stamp === constants.LINK_ANNOTATION &&
                                item.markingOperation !== enums.MarkingOperation.deleted &&
                                item.definitiveMark === true) {
                                linkedAnnotationAgainstMarkscheme.push(item);
                            }
                        });
                    }
                    else {
                        x.annotations.filter(function (item) {
                            if (item.markSchemeId === markschemeID &&
                                item.stamp === constants.LINK_ANNOTATION &&
                                item.markingOperation !== enums.MarkingOperation.deleted) {
                                linkedAnnotationAgainstMarkscheme.push(item);
                            }
                        });
                    }
                }
            });
            if (checkPreviousMarker) {
                var examinerMarksAgainstResponse = markingStore.instance.getExaminerMarksAgainstResponse;
                if (examinerMarksAgainstResponse && examinerMarksAgainstResponse.length > 0) {
                    var allMarksAndAnnotations_1 = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                        .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId].allMarksAndAnnotations;
                    if (allMarksAndAnnotations_1) {
                        allMarksAndAnnotations_1.map(function (item, index) {
                            // index 0 is for current marking.
                            if (index > 0) {
                                linkedAnnotationAgainstMarkscheme = linkedAnnotationAgainstMarkscheme.concat(PageLinkHelper.getLinkedAnnotationsFromPreviousMarks(index, markschemeID));
                            }
                        });
                    }
                }
            }
            linkedAnnotationAgainstMarkscheme = linkedAnnotationAgainstMarkscheme.filter(function (item) { return item !== undefined; });
            return linkedAnnotationAgainstMarkscheme;
        }
        return null;
    };
    /**
     * return true if the zone is linked
     * @param imageZone
     * @param multipleMarkSchemes
     * @param checkForPreviousMarker
     */
    PageLinkHelper.isZoneLinked = function (imageZone, multipleMarkSchemes, checkForPreviousMarker) {
        if (checkForPreviousMarker === void 0) { checkForPreviousMarker = false; }
        var isLinkedByCurrentMarker = false;
        var isLinkedByPreviousMarker = false;
        if (imageZone) {
            var currentQuestionItemInfo_2 = markingStore.instance.currentQuestionItemInfo;
            var linkedAnnotations = PageLinkHelper.getAllLinkedItemsAgainstPage(imageZone.pageNo);
            if (currentQuestionItemInfo_2 && linkedAnnotations) {
                if (multipleMarkSchemes && multipleMarkSchemes.treeViewItemList.count() === 2) {
                    isLinkedByCurrentMarker = linkedAnnotations.filter(function (item) {
                        return item.imageClusterId === currentQuestionItemInfo_2.imageClusterId;
                    }).length > 0;
                }
                else {
                    isLinkedByCurrentMarker = linkedAnnotations.filter(function (item) {
                        return item.markSchemeId === currentQuestionItemInfo_2.uniqueId;
                    }).length > 0;
                }
                if (checkForPreviousMarker) {
                    var previousMarkerLinkedAnnotations = [];
                    var examinerMarksAgainstResponse = markingStore.instance.getExaminerMarksAgainstResponse;
                    if (examinerMarksAgainstResponse && examinerMarksAgainstResponse.length > 0) {
                        var allMarksAndAnnotations = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                            .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId].allMarksAndAnnotations;
                        if (allMarksAndAnnotations) {
                            allMarksAndAnnotations.map(function (item, index) {
                                // index 0 is for current marking.
                                if (index > 0) {
                                    multipleMarkSchemes.treeViewItemList.map(function (treeViewItem) {
                                        var annotations = PageLinkHelper.getLinkedAnnotationsFromPreviousMarksByPageNumeber(imageZone.pageNo, index);
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
    };
    Object.defineProperty(PageLinkHelper, "doShowPreviousMarkerLinkedPages", {
        /* return true if linked images need to be shown */
        get: function () {
            var workListType = worklistStore.instance.currentWorklistType;
            var responseMode = responseStore.instance.selectedResponseMode;
            var currentWorkListType = worklistStore.instance.currentWorklistType;
            var doShowPreviousMarkerLinkedPages = false;
            if (markerOperationModeFactory.operationMode.isTeamManagementMode && annotationHelper.doShowPreviousAnnotations) {
                return true;
            }
            switch (workListType) {
                case enums.WorklistType.practice:
                    var isBlindPracticeMarkingOn = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.BlindPracticeMarking).toLowerCase() === 'true';
                    if (!(isBlindPracticeMarkingOn === true && responseMode === enums.ResponseMode.open)) {
                        doShowPreviousMarkerLinkedPages = true;
                    }
                    break;
                case enums.WorklistType.standardisation:
                case enums.WorklistType.secondstandardisation:
                    var showStandardisationDefinitiveMarks = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ShowStandardisationDefinitiveMarks, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
                    if (showStandardisationDefinitiveMarks === true && responseMode === enums.ResponseMode.closed) {
                        doShowPreviousMarkerLinkedPages = true;
                    }
                    break;
            }
            if (responseMode === enums.ResponseMode.closed && responseHelper.isSeedResponse) {
                var automaticQualityFeedbackCC = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.AutomaticQualityFeedback, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
                if (automaticQualityFeedbackCC === true) {
                    return true;
                }
            }
            if (currentWorkListType === enums.WorklistType.directedRemark || currentWorkListType === enums.WorklistType.pooledRemark) {
                doShowPreviousMarkerLinkedPages = true;
            }
            return doShowPreviousMarkerLinkedPages;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * get all the linked annotations against a questionitem for a particular marking
     * @param index
     * @param markSchemeId
     */
    PageLinkHelper.getLinkedAnnotationsFromPreviousMarks = function (index, markSchemeId) {
        var examinerMarksAgainstResponse = markingStore.instance.getExaminerMarksAgainstResponse;
        var linkedAnnotations;
        if (examinerMarksAgainstResponse) {
            var allMarksAndAnnotation = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId]
                .allMarksAndAnnotations[index].annotations;
            if (allMarksAndAnnotation && allMarksAndAnnotation.length > 0) {
                linkedAnnotations = allMarksAndAnnotation.filter(function (annotation) {
                    return annotation.stamp === constants.LINK_ANNOTATION &&
                        annotation.markSchemeId === markSchemeId &&
                        annotation.markingOperation !== enums.MarkingOperation.deleted;
                });
            }
        }
        return linkedAnnotations;
    };
    /**
     * get all the linked annotations against a questionitem for a particular marking
     * @param index
     * @param markSchemeId
     */
    PageLinkHelper.getAnnotationsFromPreviousMarks = function (index) {
        var examinerMarksAgainstResponse = markingStore.instance.getExaminerMarksAgainstResponse;
        if (examinerMarksAgainstResponse) {
            return examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId]
                .allMarksAndAnnotations[index].annotations;
        }
        return null;
    };
    /**
     * Add link annotattion to anotated slaos
     * @param currentAnnotations
     * @param additionalScriptImages
     * @param isPreviousMarks
     * @param previousResponseIndex
     */
    PageLinkHelper.addLinksToAnnotatedSLAO = function (currentAnnotations, additionalScriptImages, isPreviousMarks, previousResponseIndex) {
        var _this = this;
        // filter annottaions disticntly by pageno
        currentAnnotations = annotationHelper.filetrAnnotationsDistinctlyByPageNo(currentAnnotations.filter(function (item) { return item.markingOperation !== enums.MarkingOperation.deleted; }));
        // add a dummy link annotation if link is not assosiated with AO having annotation
        currentAnnotations.forEach(function (currentAnnotation) {
            for (var index = 0; index < additionalScriptImages.length; index++) {
                var linkToCurrentPage = void 0;
                if (isPreviousMarks) {
                    // if annottaion is added by previous marker, then add link annotation to previous annotation colection
                    if (PageLinkHelper.isAnnotatedSLAOIsNotLinked(currentAnnotation, isPreviousMarks, additionalScriptImages[index].pageNumber, previousResponseIndex)) {
                        linkToCurrentPage = PageLinkHelper.getDataForLinkAnnotationToAdd(currentAnnotation.imageClusterId, currentAnnotation.pageNo, currentAnnotation.markSchemeId);
                        linkToCurrentPage.isDirty = false;
                        linkToCurrentPage.examinerRoleId = currentAnnotation.examinerRoleId;
                        linkToCurrentPage.markGroupId = currentAnnotation.markGroupId;
                    }
                }
                else {
                    // if annotation is added by current marker, then add link annotation to current annotation colection
                    if (PageLinkHelper.isAnnotatedSLAOIsNotLinked(currentAnnotation, isPreviousMarks, additionalScriptImages[index].pageNumber)) {
                        linkToCurrentPage = PageLinkHelper.getDataForLinkAnnotationToAdd(currentAnnotation.imageClusterId, currentAnnotation.pageNo, currentAnnotation.markSchemeId);
                    }
                }
                if (linkToCurrentPage) {
                    PageLinkHelper.addLinkAnnotation(linkToCurrentPage, previousResponseIndex, false, _this.logAnnoataionModificationAction);
                }
            }
        });
    };
    /**
     * Log annoatation modification actions
     * @param actionType
     * @param annotation
     */
    PageLinkHelper.logAnnoataionModificationAction = function (actionType, annotation) {
        // Log the mark copied details
        new loggingHelper().logAnnotationModifiedAction(loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED, actionType, annotation, markingStore.instance.currentMarkGroupId, markingStore.instance.currentMarkSchemeId);
    };
    /**
     * Returns true if the annotated slao is not linked
     * @param currentAnnotation
     * @param isPreviousMarks
     * @param additionalScriptImagePageNumber
     * @param previousResponseIndex
     */
    PageLinkHelper.isAnnotatedSLAOIsNotLinked = function (currentAnnotation, isPreviousMarks, additionalScriptImagePageNumber, previousResponseIndex) {
        if (isPreviousMarks) {
            return !currentAnnotation.addedBySystem &&
                currentAnnotation.pageNo === additionalScriptImagePageNumber &&
                !PageLinkHelper.isPageLinkedByPreviousMarker(currentAnnotation.pageNo, previousResponseIndex);
        }
        else {
            return !currentAnnotation.addedBySystem &&
                currentAnnotation.pageNo === additionalScriptImagePageNumber &&
                !PageLinkHelper.isPageLinked(currentAnnotation.pageNo);
        }
    };
    /**
     * add a link annotation if the page is linked by previous marker and current marker is
     * adding a annotation for the first time
     */
    PageLinkHelper.addLinkAnnotationIfPageIsLinkedByPreviousMarker = function (pageNo, isALinkedPage, pagesLinkedByPreviousMarkers, multipleMarkSchemes) {
        if (isALinkedPage && PageLinkHelper.doShowPreviousMarkerLinkedPages &&
            pagesLinkedByPreviousMarkers && pagesLinkedByPreviousMarkers.length > 0) {
            var markSchemeId = 0;
            // check if the currently selected question is a multiple markscheme.
            // if its a multiple markscheme then add link annotation against the first child.
            if (multipleMarkSchemes && multipleMarkSchemes.treeViewItemList.count() === 2) {
                markSchemeId = multipleMarkSchemes.treeViewItemList.first().uniqueId;
            }
            else {
                markSchemeId = markingStore.instance.currentQuestionItemInfo.uniqueId;
            }
            // check if the marker is placing annotation on a page which was linked by previous marker
            // check if a link annotation was already added against the current question
            var linkedAnnotationAgainstQuestionitem = PageLinkHelper.getLinkedAnnotationAgainstQuestionItem(markSchemeId, false);
            if (pagesLinkedByPreviousMarkers.indexOf(pageNo) > -1 &&
                linkedAnnotationAgainstQuestionitem && linkedAnnotationAgainstQuestionitem.length === 0) {
                var annotationData = PageLinkHelper.getDataForLinkAnnotationToAdd(0, pageNo, markSchemeId);
                markingActionCreator.addNewlyAddedAnnotation(annotationData, undefined, null, null, null, false, true);
            }
        }
    };
    /**
     * to Link the page on clicking the 'view whole response' button in structured zones
     * @static
     * @param {ImageZone} activeImageZone
     * @param isStitched
     * @param currentMarkSchemeId
     * @memberof PageLinkHelper
     */
    PageLinkHelper.linkImageZone = function (activeImageZone, isStitched, currentMarkSchemeId) {
        var annotationData = PageLinkHelper.getDataForLinkAnnotationToAdd(activeImageZone.imageClusterId ? activeImageZone.imageClusterId : 0, activeImageZone.pageNo, currentMarkSchemeId);
        PageLinkHelper.addLinkAnnotation(annotationData, undefined, isStitched, this.logAnnoataionModificationAction);
    };
    /**
     * Returns true, if the selected response is Unclassified and its editable.
     */
    PageLinkHelper.showDefinitiveMarksOnly = function () {
        return markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
            markerOperationModeFactory.operationMode.isDefinitveMarkingStarted;
    };
    return PageLinkHelper;
}());
module.exports = PageLinkHelper;
//# sourceMappingURL=pagelinkhelper.js.map