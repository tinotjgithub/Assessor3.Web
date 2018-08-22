"use strict";
var enums = require('../utility/enums');
var worklistValidatorFactory = require('../../utility/worklistvalidators/worklistvalidatorfactory');
var worklistValidatorList = require('../../utility/worklistvalidators/worklistvalidatorlist');
var submitStore = require('../../stores/submit/submitstore');
var customError = require('../base/customerror');
var targetHelper = require('../../utility/target/targethelper');
var worklistStore = require('../../stores/worklist/workliststore');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var qigStore = require('../../stores/qigselector/qigstore');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
/**
 * Helper class for worklist
 */
var WorklistComponentHelper = (function () {
    function WorklistComponentHelper() {
    }
    /**
     * Method which returns array of mark group ids to submit
     */
    WorklistComponentHelper.createMarkgroupIdCollectionForLiveSubmit = function (worklistData, singleResponseMarkGroupId) {
        var markGroupIds = new Array();
        var relatedMarkGroupIds = new Array();
        if (submitStore.instance.getMarkGroupId === 0) {
            /* looping through each response to determine whether the same is eligible for submit */
            worklistData.responses.map(function (response) {
                worklistValidatorFactory.getValidator(worklistValidatorList.liveOpen).submitButtonValidate(response);
                if (response.isSubmitEnabled) {
                    if (response.isWholeResponse) {
                        relatedMarkGroupIds = relatedMarkGroupIds.concat(worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(response.markGroupId));
                    }
                    markGroupIds.push(response.markGroupId);
                }
            });
        }
        else {
            if (worklistData &&
                worklistData.responses.count() > 0 &&
                worklistData.responses.filter(function (x) { return x.markGroupId === singleResponseMarkGroupId; }).first().isWholeResponse) {
                relatedMarkGroupIds = relatedMarkGroupIds.concat(worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(singleResponseMarkGroupId));
            }
            markGroupIds.push(singleResponseMarkGroupId);
        }
        if (relatedMarkGroupIds.length > 0) {
            markGroupIds = markGroupIds.concat(relatedMarkGroupIds);
        }
        return markGroupIds;
    };
    /**
     * Raturns the markgroup ids of practice response to submit.
     * @param {PracticeOpenWorklist} worklistData
     * @param {number} singleResponseMarkGroupId
     * @returns
     */
    WorklistComponentHelper.createMarkGroupIdCollectionForPracticeSubmit = function (worklistData, singleResponseMarkGroupId) {
        var markGroupIds = new Array();
        if (submitStore.instance.getMarkGroupId === 0) {
            worklistData.responses.map(function (response) {
                worklistValidatorFactory.getValidator(worklistValidatorList.practiceOpen).submitButtonValidate(response);
                if (response.isSubmitEnabled) {
                    markGroupIds.push(response.markGroupId);
                }
            });
        }
        else {
            markGroupIds.push(singleResponseMarkGroupId);
        }
        return markGroupIds;
    };
    /**
     * Raturns the markgroup ids of standardization response to submit.
     * @param {StandardisationOpenWorklist} worklistData
     * @param {number} singleResponseMarkGroupId
     * @returns
     */
    WorklistComponentHelper.createMarkGroupIdCollectionForStandardizationSubmit = function (worklistData, singleResponseMarkGroupId) {
        var markGroupIds = new Array();
        if (submitStore.instance.getMarkGroupId === 0) {
            worklistData.responses.map(function (response) {
                worklistValidatorFactory.getValidator(worklistValidatorList.standardisationOpen).submitButtonValidate(response);
                if (response.isSubmitEnabled) {
                    markGroupIds.push(response.markGroupId);
                }
            });
        }
        else {
            markGroupIds.push(singleResponseMarkGroupId);
        }
        return markGroupIds;
    };
    /**
     * Raturns the markgroup ids of directed remark response to submit.
     * @param {StandardisationOpenWorklist} worklistData
     * @param {number} singleResponseMarkGroupId
     * @returns
     */
    WorklistComponentHelper.createMarkGroupIdCollectionForDirectedRemarkSubmit = function (worklistData, singleResponseMarkGroupId) {
        var markGroupIds = new Array();
        var relatedMarkGroupIds = new Array();
        if (submitStore.instance.getMarkGroupId === 0) {
            /* looping through each response to determine whether the same is eligible for submit */
            worklistData.responses.map(function (response) {
                worklistValidatorFactory.getValidator(worklistValidatorList.directedRemarkOpen).submitButtonValidate(response);
                if (response.isSubmitEnabled) {
                    if (response.isWholeResponse) {
                        // grouping related mark-group id's for the whole response.
                        relatedMarkGroupIds = relatedMarkGroupIds.concat(worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(response.markGroupId));
                    }
                    markGroupIds.push(response.markGroupId);
                }
            });
        }
        else {
            if (worklistData &&
                worklistData.responses.count() > 0 &&
                worklistData.responses.filter(function (x) { return x.markGroupId === singleResponseMarkGroupId; }).first().isWholeResponse) {
                // grouping related mark-group id's for the whole response.
                relatedMarkGroupIds = relatedMarkGroupIds.concat(worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(singleResponseMarkGroupId));
            }
            markGroupIds.push(singleResponseMarkGroupId);
        }
        if (relatedMarkGroupIds.length > 0) {
            markGroupIds = markGroupIds.concat(relatedMarkGroupIds);
        }
        return markGroupIds;
    };
    /**
     * Raturns the markgroup ids of pooled remark response to submit.
     * @param {PooledRemarkOpenWorklist} worklistData
     * @param {number} singleResponseMarkGroupId
     * @returns
     */
    WorklistComponentHelper.createMarkGroupIdCollectionForPooledRemarkSubmit = function (worklistData, singleResponseMarkGroupId) {
        var markGroupIds = new Array();
        var relatedMarkGroupIds = new Array();
        if (submitStore.instance.getMarkGroupId === 0) {
            /* looping through each response to determine whether the same is eligible for submit */
            worklistData.responses.map(function (response) {
                worklistValidatorFactory.getValidator(worklistValidatorList.directedRemarkOpen).submitButtonValidate(response);
                if (response.isSubmitEnabled) {
                    // grouping related mark-group id's for the whole response.
                    if (response.isWholeResponse) {
                        relatedMarkGroupIds = relatedMarkGroupIds.concat(worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(response.markGroupId));
                    }
                    markGroupIds.push(response.markGroupId);
                }
            });
        }
        else {
            if (worklistData &&
                worklistData.responses.count() > 0 &&
                worklistData.responses.filter(function (x) { return x.markGroupId === singleResponseMarkGroupId; }).first().isWholeResponse) {
                // grouping related mark-group id's for the whole response.
                relatedMarkGroupIds = relatedMarkGroupIds.concat(worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(singleResponseMarkGroupId));
            }
            markGroupIds.push(singleResponseMarkGroupId);
        }
        if (relatedMarkGroupIds.length > 0) {
            markGroupIds = markGroupIds.concat(relatedMarkGroupIds);
        }
        return markGroupIds;
    };
    /**
     * Method which returns array of mark group ids to submit simulation response/s
     */
    WorklistComponentHelper.createMarkgroupIdCollectionForSimulationSubmit = function (worklistData, singleResponseMarkGroupId) {
        var markGroupIds = new Array();
        if (submitStore.instance.getMarkGroupId === 0) {
            /* looping through each response to determine whether the same is eligible for submit */
            worklistData.responses.map(function (response) {
                worklistValidatorFactory.getValidator(worklistValidatorList.simulationOpen).submitButtonValidate(response);
                if (response.isSubmitEnabled) {
                    markGroupIds.push(response.markGroupId);
                }
            });
        }
        else {
            markGroupIds.push(singleResponseMarkGroupId);
        }
        return markGroupIds;
    };
    /**
     * Method which returns array of mark group ids to submit
     * @param worklistData
     * @param singleResponseMarkGroupId
     */
    WorklistComponentHelper.createMarkgroupIdCollectionForAtypicalSubmit = function (worklistData, singleResponseMarkGroupId) {
        var markGroupIds = new Array();
        /* Collection of Mark Group Ids of realted RIGs in other QIGs */
        var relatedMarkGroupIds = new Array();
        if (submitStore.instance.getMarkGroupId === 0) {
            /* looping through each response to determine whether the same is eligible for submit */
            worklistData.responses.map(function (response) {
                worklistValidatorFactory.getValidator(worklistValidatorList.atypicalOpen).submitButtonValidate(response);
                if (response.isSubmitEnabled) {
                    relatedMarkGroupIds = relatedMarkGroupIds.concat(worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(response.markGroupId));
                    markGroupIds.push(response.markGroupId);
                }
            });
        }
        else {
            relatedMarkGroupIds = relatedMarkGroupIds.concat(worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(singleResponseMarkGroupId));
            markGroupIds.push(singleResponseMarkGroupId);
        }
        if (relatedMarkGroupIds.length > 0) {
            markGroupIds = markGroupIds.concat(relatedMarkGroupIds);
        }
        return markGroupIds;
    };
    /**
     * Get the error message key to show when submit response fails
     */
    WorklistComponentHelper.showMessageOnSubmitResponse = function (submittedResponseCount) {
        var messageKey = '';
        var messageHeaderKey = undefined;
        if (submitStore.instance.getErrorCode > 0) {
            var isInStandardisationworklist = worklistStore.instance.currentWorklistType === enums.WorklistType.practice ||
                worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation ||
                worklistStore.instance.currentWorklistType === enums.WorklistType.secondstandardisation;
            // If standardisation worklist, then no need to check the not approved status
            if (submitStore.instance.getSubmitResponseReturn.examinerApprovalStatus === enums.ExaminerApproval.Suspended) {
                if (submitStore.instance.getSubmitResponseReturn.hasQualityFeedbackOutstanding) {
                    messageKey = 'marking.worklist.approval-status-changed-dialog.body-quality-feedback';
                }
                else {
                    messageKey = 'marking.worklist.approval-status-changed-dialog.body';
                }
                messageHeaderKey = submittedResponseCount === 0 ?
                    'marking.worklist.response-submission-error-dialog.header' : 'marking.worklist.approval-status-changed-dialog.header';
            }
            else if (submitStore.instance.getSubmitResponseReturn.examinerApprovalStatus === enums.ExaminerApproval.NotApproved &&
                !isInStandardisationworklist &&
                worklistStore.instance.currentWorklistType !== enums.WorklistType.simulation) {
                messageKey = 'marking.worklist.approval-status-changed-dialog.body';
                messageHeaderKey = submittedResponseCount === 0 ?
                    'marking.worklist.response-submission-error-dialog.header' : 'marking.worklist.approval-status-changed-dialog.header';
            }
            else {
                switch (submitStore.instance.getErrorCode) {
                    case enums.SubmitResponseErrorCode.responseNotFullyMarked:
                    case enums.SubmitResponseErrorCode.responseHasExceptions:
                    case enums.SubmitResponseErrorCode.allSLAOsNotAnnotated:
                    case enums.SubmitResponseErrorCode.allPagesNotAnnotated:
                    case enums.SubmitResponseErrorCode.onHold:
                    case enums.SubmitResponseErrorCode.mandateMarkschemeNotCommented:
                    case enums.SubmitResponseErrorCode.notAllFilesViewed:
                    case enums.SubmitResponseErrorCode.hasZoningException:
                        messageHeaderKey = submitStore.instance.getMarkGroupId > 0 ?
                            'marking.worklist.submit-response-dialog.header' :
                            'marking.worklist.submit-all-responses-dialog.header';
                        messageKey = submitStore.instance.getMarkGroupId > 0 ?
                            'marking.worklist.response-submission-error-dialog.body-single-response-not-submitted' :
                            'marking.worklist.response-submission-error-dialog.body-some-responses-not-submitted';
                        break;
                    case enums.SubmitResponseErrorCode.responseAlreadySubmitted:
                        if (submitStore.instance.getMarkGroupId > 0) {
                            messageHeaderKey = 'marking.worklist.submit-response-dialog.header';
                            messageKey = 'marking.worklist.response-submission-error-dialog.body-single-response-already-submitted';
                        }
                        else {
                            messageHeaderKey = 'marking.worklist.submit-all-responses-dialog.header';
                            messageKey = 'marking.worklist.response-submission-error-dialog.body-some-responses-already-submitted';
                        }
                        break;
                    case enums.SubmitResponseErrorCode.examinerNotApproved:
                        messageKey = 'marking.worklist.approval-status-changed-dialog.body-relatedQIG';
                        messageHeaderKey = submittedResponseCount === 0 ?
                            'marking.worklist.response-submission-error-dialog.header' :
                            'marking.worklist.approval-status-changed-dialog.header';
                        break;
                    case enums.SubmitResponseErrorCode.examinerSuspended:
                        if (submitStore.instance.getSubmitResponseReturn.hasQualityFeedbackOutstanding) {
                            messageKey = 'marking.worklist.approval-status-changed-dialog.body-quality-feedback';
                        }
                        else {
                            messageKey = 'marking.worklist.approval-status-changed-dialog.body';
                        }
                        messageHeaderKey = submittedResponseCount === 0 ?
                            'marking.worklist.response-submission-error-dialog.header' :
                            'marking.worklist.approval-status-changed-dialog.header';
                        break;
                    case enums.SubmitResponseErrorCode.examinerWithdrawn:
                        //This code added for whole response case and the examinerApprovalStatus contains only current qig’s status, 
                        //but SubmitResponseErrorCode contains status against any qig etc.
                        messageKey = 'marking.worklist.approval-status-changed-dialog.body-withdrawn';
                        messageHeaderKey = submittedResponseCount === 0 ?
                            'marking.worklist.response-submission-error-dialog.header' :
                            'marking.worklist.approval-status-changed-dialog.header';
                        break;
                    default:
                        messageKey = '';
                }
            }
        }
        if (messageKey !== '' && submittedResponseCount === 0) {
            /** Creating custom error message to show */
            var submitErrorMessage = {
                messageHeader: messageHeaderKey,
                messageContent: messageKey
            };
            return submitErrorMessage;
        }
        else if (messageKey !== '') {
            /** Creating custom error message to show */
            var submitResponseError = new customError('Submit', messageKey, messageHeaderKey, false);
            window.onerror('', '', null, null, submitResponseError);
            return undefined;
        }
    };
    /**
     * Sets the auto approval Secondary content
     * @param submittedResponseCount
     */
    WorklistComponentHelper.getAutoApprovalSecondaryContent = function (submittedResponseCount) {
        var deleteResponseOnAutoApproval = targetHelper.isResponsesDeletedOnAutoApproval(submittedResponseCount);
        return ((targetHelper.currentMarkingMode === enums.MarkingMode.ES_TeamApproval
            && qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === false) ?
            ((deleteResponseOnAutoApproval === false) ?
                'marking.worklist.auto-approved-dialog.body-standardisation'
                : 'marking.worklist.auto-approved-dialog.body-excess-second-standardisation-responses-removed')
            : ((targetHelper.currentMarkingMode === enums.MarkingMode.Approval
                && qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === false) ?
                ((deleteResponseOnAutoApproval === false) ?
                    'marking.worklist.auto-approved-dialog.body-standardisation'
                    : 'marking.worklist.auto-approved-dialog.body-excess-standardisation-responses-removed')
                : ((deleteResponseOnAutoApproval === false) ?
                    'marking.worklist.auto-approved-dialog.body-stm-standardisation'
                    : 'marking.worklist.auto-approved-dialog.body-excess-stm-standardisation-responses-removed')));
    };
    /**
     * Returns the markgroup id collection for response submission
     * @param {enums.MarkingMode} markingMode
     * @returns
     */
    WorklistComponentHelper.getMarkgroupIdCollectionForSubmit = function (markingMode) {
        switch (markingMode) {
            case enums.MarkingMode.LiveMarking:
                if (worklistStore.instance.currentWorklistType !== enums.WorklistType.atypical) {
                    return WorklistComponentHelper.createMarkgroupIdCollectionForLiveSubmit(worklistStore.instance.getLiveOpenWorklistDetails, submitStore.instance.getMarkGroupId);
                }
                return WorklistComponentHelper.createMarkgroupIdCollectionForAtypicalSubmit(worklistStore.instance.getAtypicalOpenWorklistDetails, submitStore.instance.getMarkGroupId);
            case enums.MarkingMode.Practice:
                return WorklistComponentHelper.createMarkGroupIdCollectionForPracticeSubmit(worklistStore.instance.getPracticeOpenWorklistDetails, submitStore.instance.getMarkGroupId);
            case enums.MarkingMode.Approval:
                return WorklistComponentHelper.createMarkGroupIdCollectionForStandardizationSubmit(worklistStore.instance.getStandardisationOpenWorklistDetails, submitStore.instance.getMarkGroupId);
            case enums.MarkingMode.ES_TeamApproval:
                return WorklistComponentHelper.createMarkGroupIdCollectionForStandardizationSubmit(worklistStore.instance.getSecondStandardisationOpenWorklistDetails, submitStore.instance.getMarkGroupId);
            case enums.MarkingMode.Remarking:
                if (worklistStore.instance.isDirectedRemark) {
                    return WorklistComponentHelper.createMarkGroupIdCollectionForDirectedRemarkSubmit(worklistStore.instance.getDirectedRemarkOpenWorklistDetails, submitStore.instance.getMarkGroupId);
                }
                else {
                    return WorklistComponentHelper.createMarkGroupIdCollectionForPooledRemarkSubmit(worklistStore.instance.getPooledRemarkOpenWorklistDetails, submitStore.instance.getMarkGroupId);
                }
            case enums.MarkingMode.Simulation:
                return WorklistComponentHelper.createMarkgroupIdCollectionForSimulationSubmit(worklistStore.instance.getSimulationOpenWorklistDetails, submitStore.instance.getMarkGroupId);
        }
    };
    /**
     * Get remark request type
     * @param worklistType
     */
    WorklistComponentHelper.getRemarkRequestType = function (worklistType) {
        return worklistType === enums.WorklistType.directedRemark || worklistType === enums.WorklistType.pooledRemark ?
            worklistStore.instance.getRemarkRequestType : enums.RemarkRequestType.Unknown;
    };
    /**
     * Get is directed remark
     * @param worklistType
     */
    WorklistComponentHelper.getIsDirectedRemark = function (worklistType) {
        return worklistType === enums.WorklistType.directedRemark || worklistType === enums.WorklistType.pooledRemark ?
            worklistStore.instance.isDirectedRemark : false;
    };
    /**
     * Method which returns whether the quality feedback related message should be shown on submitting
     * seeds accurately/within tolerance
     */
    WorklistComponentHelper.shouldShowQualityFeedbackMessage = function () {
        var _automaticQualityFeedback = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.AutomaticQualityFeedback, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        var _seedSubmissionStatus = submitStore.instance.getSubmitResponseReturn.seedSubmissionStatus;
        return _automaticQualityFeedback &&
            _seedSubmissionStatus === enums.SeedSubmissionStatus.SeedsSubmittedWithinToleranceOrAccurately;
    };
    /**
     * Get the tab details that needs to be shown in the live worklist
     * @param targetSummary
     */
    WorklistComponentHelper.getLiveWorklistTabDetails = function (targetSummary) {
        var worklistTabDetails = [];
        // Only closed tab is displaying in help examiners,
        if (teamManagementStore.instance.selectedTeamManagementTab !== enums.TeamManagement.HelpExaminers) {
            worklistTabDetails.push({
                responseMode: enums.ResponseMode.open,
                responseCount: targetSummary.examinerProgress.openResponsesCount
            });
            worklistTabDetails.push({
                responseMode: enums.ResponseMode.pending,
                responseCount: targetSummary.examinerProgress.pendingResponsesCount
            });
        }
        worklistTabDetails.push({
            responseMode: enums.ResponseMode.closed,
            responseCount: targetSummary.examinerProgress.closedResponsesCount
        });
        return worklistTabDetails;
    };
    /**
     * Get the tab details that needs to be shown in the atypical worklist
     * @param targetSummary
     */
    WorklistComponentHelper.getAtypicalWorklistTabDetails = function (targetSummary) {
        var worklistTabDetails = [];
        worklistTabDetails.push({
            responseMode: enums.ResponseMode.open,
            responseCount: (isNaN(targetSummary.examinerProgress.atypicalOpenResponsesCount)
                ? 0 : targetSummary.examinerProgress.atypicalOpenResponsesCount)
        });
        worklistTabDetails.push({
            responseMode: enums.ResponseMode.pending,
            responseCount: (isNaN(targetSummary.examinerProgress.atypicalPendingResponsesCount)
                ? 0 : targetSummary.examinerProgress.atypicalPendingResponsesCount)
        });
        worklistTabDetails.push({
            responseMode: enums.ResponseMode.closed,
            responseCount: (isNaN(targetSummary.examinerProgress.atypicalClosedResponsesCount)
                ? 0 : targetSummary.examinerProgress.atypicalClosedResponsesCount)
        });
        return worklistTabDetails;
    };
    /**
     * Get the tab details that needs to be shown in the live worklist
     * @param targetSummary
     */
    WorklistComponentHelper.getPracticeWorklistTabDetails = function (targetSummary) {
        var worklistTabDetails = [];
        if (!targetSummary.isTargetCompleted) {
            worklistTabDetails.push({
                responseMode: enums.ResponseMode.open,
                responseCount: targetSummary.examinerProgress.openResponsesCount
            });
        }
        worklistTabDetails.push({
            responseMode: enums.ResponseMode.closed,
            responseCount: targetSummary.examinerProgress.closedResponsesCount
        });
        return worklistTabDetails;
    };
    /**
     * Returns StandardisationWorklist TabDetails
     * @param {markingTargetSummary} targetSummary
     * @returns
     */
    WorklistComponentHelper.getStandardisationWorklistTabDetails = function (targetSummary) {
        var worklistTabDetails = [];
        if (markerOperationModeFactory.operationMode.shouldDisplayStandardisationOpenTab(targetSummary)) {
            if (targetHelper.isESTargetCompleted(enums.MarkingMode.Approval) === false) {
                worklistTabDetails.push({
                    responseMode: enums.ResponseMode.open,
                    responseCount: targetSummary.examinerProgress.openResponsesCount
                });
            }
        }
        worklistTabDetails.push({
            responseMode: enums.ResponseMode.closed,
            responseCount: targetSummary.examinerProgress.closedResponsesCount
        });
        return worklistTabDetails;
    };
    /**
     * Returns SecondStandardization TabDetails
     * @param {markingTargetSummary} targetSummary
     * @returns
     */
    WorklistComponentHelper.getSecondStandardizationTabDetails = function (targetSummary) {
        var worklistTabDetails = [];
        if (markerOperationModeFactory.operationMode.shouldDisplayStandardisationOpenTab(targetSummary)) {
            if (targetHelper.isESTargetCompleted(enums.MarkingMode.ES_TeamApproval) === false) {
                worklistTabDetails.push({
                    responseMode: enums.ResponseMode.open,
                    responseCount: targetSummary.examinerProgress.openResponsesCount
                });
            }
        }
        worklistTabDetails.push({
            responseMode: enums.ResponseMode.closed,
            responseCount: targetSummary.examinerProgress.closedResponsesCount
        });
        return worklistTabDetails;
    };
    /**
     * Get the tab details that needs to be shown in the remark worklist
     * @param targetSummary
     */
    WorklistComponentHelper.getRemarkWorklistTabDetails = function (targetSummary) {
        var worklistTabDetails = [];
        worklistTabDetails.push({
            responseMode: enums.ResponseMode.open,
            responseCount: targetSummary.examinerProgress.openResponsesCount
        });
        worklistTabDetails.push({
            responseMode: enums.ResponseMode.pending,
            responseCount: targetSummary.examinerProgress.pendingResponsesCount
        });
        worklistTabDetails.push({
            responseMode: enums.ResponseMode.closed,
            responseCount: targetSummary.examinerProgress.closedResponsesCount
        });
        return worklistTabDetails;
    };
    /**
     * Returns the worklist tab details
     * @param {enums.MarkingMode} markingMode
     * @returns
     */
    WorklistComponentHelper.getWorklistTabDetails = function (markingMode, isTargetRefresh) {
        if (isTargetRefresh === void 0) { isTargetRefresh = false; }
        var worklistTabDetails = [];
        var markingTargetsSummary;
        /** Getting  markingTargetsSummary from worklist store,
         * it will be updated if the worklist response collection changes
         */
        if (isTargetRefresh) {
            /** If calling from refreshTargetProgress in worklist, will return summary data from targetSummaryStore */
            markingTargetsSummary = targetHelper.getExaminerMarkingTargetProgress;
        }
        else {
            /** If calling from markingmodechanged in worklist, will return summary data from workliststore
             * worklist target summary collection is updated based on resposecount in the worklist
             */
            markingTargetsSummary = worklistStore.instance.getExaminerMarkingTargetProgress(markerOperationModeFactory.operationMode.isSelectedExaminerSTM);
        }
        switch (markingMode) {
            case enums.MarkingMode.LiveMarking:
                if (worklistStore.instance.currentWorklistType === enums.WorklistType.atypical) {
                    worklistTabDetails = this.getAtypicalWorklistTabDetails(markingTargetsSummary.filter(function (x) { return x.markingModeID === enums.MarkingMode.LiveMarking; }).first());
                }
                else {
                    worklistTabDetails = this.getLiveWorklistTabDetails(markingTargetsSummary.filter(function (x) { return x.markingModeID === enums.MarkingMode.LiveMarking; }).first());
                }
                break;
            case enums.MarkingMode.Practice:
                worklistTabDetails = this.getPracticeWorklistTabDetails(markingTargetsSummary.filter(function (x) { return x.markingModeID === enums.MarkingMode.Practice; }).first());
                break;
            case enums.MarkingMode.Approval:
                worklistTabDetails = this.getStandardisationWorklistTabDetails(markingTargetsSummary.filter(function (x) { return x.markingModeID === enums.MarkingMode.Approval; }).first());
                break;
            case enums.MarkingMode.ES_TeamApproval:
                worklistTabDetails = this.getSecondStandardizationTabDetails(markingTargetsSummary.filter(function (x) { return x.markingModeID === enums.MarkingMode.ES_TeamApproval; }).first());
                break;
            case enums.MarkingMode.Remarking:
                worklistTabDetails = this.getRemarkWorklistTabDetails(markingTargetsSummary.filter(function (x) { return x.markingModeID === enums.MarkingMode.Remarking
                    && x.remarkRequestTypeID === worklistStore.instance.getRemarkRequestType; }).first());
                break;
            case enums.MarkingMode.Simulation:
                worklistTabDetails = this.getSimulationWorklistTabDetails(markingTargetsSummary.filter(function (x) { return x.markingModeID === enums.MarkingMode.Simulation; }).first());
                break;
            default:
                break;
        }
        return worklistTabDetails;
    };
    /**
     * Get the tab details that needs to be shown in the simulation worklist
     * @param targetSummary
     */
    WorklistComponentHelper.getSimulationWorklistTabDetails = function (targetSummary) {
        var worklistTabDetails = [];
        worklistTabDetails.push({
            responseMode: enums.ResponseMode.open,
            responseCount: targetSummary.examinerProgress.openResponsesCount
        });
        return worklistTabDetails;
    };
    return WorklistComponentHelper;
}());
module.exports = WorklistComponentHelper;
//# sourceMappingURL=worklistcomponenthelper.js.map