"use strict";
var responseAllocationButtonValidationParameter = require('./responseallocationbuttonvalidationparameter');
var localeStore = require('../../../stores/locale/localestore');
var targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
var enums = require('../enums');
var qigStore = require('../../../stores/qigselector/qigstore');
var qigSelectorValidationHelper = require('../qigselector/qigselectorvalidationhelper');
var loginStore = require('../../../stores/login/loginstore');
var responseHelper = require('../responsehelper/responsehelper');
/**
 * Helper class for response allocation button
 * It handles the enabling/disabling as well as the visibility status of the button
 */
var ResponseAllocationButtonValidationHelper = (function () {
    function ResponseAllocationButtonValidationHelper() {
    }
    /**
     * Returns an entity representing the states to be set for the response allocation button
     * @param liveWorklistStatistics contains the worklist details
     * @param examinerQigStatus the current qig status of the examiner
     * @param examinerApprovalStatus contains the examiner approval status
     * @param worklistType stores the worklist type
     * @param remarkRequestType stores the remark request type
     */
    ResponseAllocationButtonValidationHelper.validate = function (liveWorklistStatistics, examinerQigStatus, examinerApprovalStatus, worklistType, remarkRequestType, isTeamManagementMode) {
        var responseAllocationButtonMainText;
        var responseAllocationButtonTitle = '';
        var responseAllocationButtonSubText = '';
        var isResponseAllocateButtonVisible = true;
        var isResponseAllocateButtonEnabled = false;
        var isWorklistInformationBannerVisible = false;
        // Getting the response allocation dropdown buttons text
        var responseAllocationButtonSingleResponseText;
        var responseAllocationButtonUpToOpenResponseText;
        var isWholeResponseResponseAllocationButtonAvailable = false;
        // we need to hide the Response allocation button if the marker operation mode is Team Management.
        if (isTeamManagementMode) {
            isResponseAllocateButtonVisible = false;
        }
        else {
            // Getting the response allocation main button text
            // Added the condition to add new button text for pooled remarks
            responseAllocationButtonMainText = (worklistType === enums.WorklistType.pooledRemark)
                || (worklistType === enums.WorklistType.simulation) ?
                localeStore.instance.TranslateText('marking.worklist.action-buttons.allocate-button-remarks') :
                localeStore.instance.TranslateText('marking.worklist.action-buttons.allocate-button');
            responseAllocationButtonSingleResponseText = localeStore.instance.
                TranslateText('marking.worklist.action-buttons.allocate-single-response');
            responseAllocationButtonUpToOpenResponseText = localeStore.instance.
                TranslateText('marking.worklist.action-buttons.allocate-to-concurrent-limit');
            if (worklistType === enums.WorklistType.live
                && qigStore.instance.isWholeResponseAvailable) {
                /* If Ebookmarking then there should not be whole response button */
                isWholeResponseResponseAllocationButtonAvailable = responseHelper.isEbookMarking ? false : true;
            }
            else {
                isWholeResponseResponseAllocationButtonAvailable = false;
            }
            // Setting the different visibility status to the GetNewResponse button based on the current status of the Examiner
            switch (examinerQigStatus) {
                case enums.ExaminerQIGStatus.WaitingStandardisation:
                case enums.ExaminerQIGStatus.Simulation:
                    isResponseAllocateButtonVisible = true;
                    isResponseAllocateButtonEnabled = true;
                    isWorklistInformationBannerVisible = true;
                    break;
                case enums.ExaminerQIGStatus.Practice:
                case enums.ExaminerQIGStatus.StandardisationMarking:
                case enums.ExaminerQIGStatus.SecondStandardisationMarking:
                case enums.ExaminerQIGStatus.STMStandardisationMarking:
                case enums.ExaminerQIGStatus.AwaitingApproval:
                    isResponseAllocateButtonVisible = false;
                    isResponseAllocateButtonEnabled = false;
                    break;
                case enums.ExaminerQIGStatus.LiveComplete:
                case enums.ExaminerQIGStatus.OverAllTargetCompleted:
                    isWorklistInformationBannerVisible = true;
                    break;
                case enums.ExaminerQIGStatus.QualityFeedback:
                case enums.ExaminerQIGStatus.Suspended:
                case enums.ExaminerQIGStatus.OverAllTargetReached:
                    isResponseAllocateButtonEnabled = false;
                    break;
                case enums.ExaminerQIGStatus.LiveMarking:
                    isWorklistInformationBannerVisible = true;
                    isResponseAllocateButtonEnabled = true;
                    break;
                default:
                    isResponseAllocateButtonVisible = true;
                    isResponseAllocateButtonEnabled = true;
                    break;
            }
            // Examiner Approval Status needs not be considered while the marker is in Simulation Marking.
            if (examinerQigStatus !== enums.ExaminerQIGStatus.Simulation) {
                switch (examinerApprovalStatus) {
                    case enums.ExaminerApproval.Approved:
                    case enums.ExaminerApproval.ConditionallyApproved:
                    case enums.ExaminerApproval.ApprovedReview:
                        break;
                    default:
                        isResponseAllocateButtonVisible = true;
                        isResponseAllocateButtonEnabled = false;
                        responseAllocationButtonTitle =
                            localeStore.instance.TranslateText('marking.worklist.action-buttons.allocate-button-not-approved-tooltip');
                        responseAllocationButtonSubText =
                            localeStore.instance.TranslateText('marking.worklist.action-buttons.allocate-button-suspended-indicator');
                        break;
                }
            }
            if (loginStore.instance.isAdminRemarker) {
                isResponseAllocateButtonVisible = true;
            }
            if (liveWorklistStatistics !== undefined && examinerApprovalStatus !== enums.ExaminerApproval.Suspended) {
                var isConcurrentLimitMet = new qigSelectorValidationHelper()
                    .isConcurrentLimitMet(qigStore.instance.selectedQIGForMarkerOperation, liveWorklistStatistics);
                //Not applicable for pooled remark since the live complete status does not affect pooled remarks
                if ((examinerQigStatus === enums.ExaminerQIGStatus.LiveComplete
                    || examinerQigStatus === enums.ExaminerQIGStatus.OverAllTargetReached
                    || examinerQigStatus === enums.ExaminerQIGStatus.OverAllTargetCompleted)
                    && worklistType !== enums.WorklistType.pooledRemark) {
                    // If the live marking is completed or the marking target is reached.
                    isResponseAllocateButtonEnabled = false;
                    responseAllocationButtonSubText = localeStore.instance.TranslateText('marking.worklist.action-buttons.allocate-button-target-reached-indicator');
                }
                else if (isConcurrentLimitMet) {
                    // If the current open response count meets the concurrent limit
                    responseAllocationButtonSubText =
                        localeStore.instance.TranslateText('marking.worklist.action-buttons.allocate-button-concurrent-limit-reached-indicator');
                    isResponseAllocateButtonEnabled = false;
                }
                else if (liveWorklistStatistics.unallocatedResponsesCount <= 0) {
                    // If there are no unallocated responses left
                    responseAllocationButtonSubText = localeStore.instance.TranslateText('marking.worklist.no-responses-available-helper.header');
                    isResponseAllocateButtonEnabled = false;
                }
                else {
                    //If the above conditions are not satisfied the allocation button should be enabled
                    isResponseAllocateButtonEnabled = true;
                }
            }
            // If the allocation button is already enabled, then disable the same if the total responses count
            // has gone over the maximum marking limit and over allocation
            if (isResponseAllocateButtonEnabled) {
                if (worklistType === enums.WorklistType.live) {
                    var currentTarget = targetSummaryStore.instance.getCurrentTarget();
                    if (currentTarget && currentTarget.markingModeID === enums.MarkingMode.LiveMarking) {
                        // Retrieving the marking targets collection
                        var targetSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
                        if (targetSummary) {
                            var totalLiveResponsesCount = 0;
                            // Looping through the marking targets collection
                            for (var index = 0; index < targetSummary.count(); index++) {
                                var target = targetSummary.get(index);
                                if (target.markingModeID === enums.MarkingMode.LiveMarking
                                    || target.examinerProgress.isDirectedRemark) {
                                    // Summing up the total live responses count
                                    totalLiveResponsesCount += target.examinerProgress.openResponsesCount +
                                        target.examinerProgress.pendingResponsesCount +
                                        target.examinerProgress.closedResponsesCount;
                                    if (target.markingModeID === enums.MarkingMode.LiveMarking) {
                                        totalLiveResponsesCount += target.examinerProgress.atypicalOpenResponsesCount;
                                    }
                                }
                            }
                            // Setting the visibility of response allocation button status
                            isResponseAllocateButtonEnabled =
                                totalLiveResponsesCount < currentTarget.maximumMarkingLimit + currentTarget.overAllocationCount;
                            if (isResponseAllocateButtonEnabled) {
                                responseAllocationButtonTitle =
                                    localeStore.instance.TranslateText('marking.worklist.action-buttons.allocate-button-tooltip');
                            }
                            else {
                                responseAllocationButtonTitle = '';
                            }
                        }
                    }
                }
                else if (worklistType === enums.WorklistType.pooledRemark) {
                    var target = targetSummaryStore.instance.getRemarkTarget(remarkRequestType);
                    if (target) {
                        var totalRemarkResponsesCount = 0;
                        // Summing up the total remark responses count
                        totalRemarkResponsesCount += target.examinerProgress.openResponsesCount +
                            target.examinerProgress.pendingResponsesCount +
                            target.examinerProgress.closedResponsesCount;
                        // Setting the visibility of response allocation button status
                        isResponseAllocateButtonEnabled =
                            totalRemarkResponsesCount < target.maximumMarkingLimit + target.overAllocationCount;
                        if (!isResponseAllocateButtonEnabled) {
                            responseAllocationButtonSubText = localeStore.instance.TranslateText('marking.worklist.action-buttons.allocate-button-target-reached-indicator');
                            responseAllocationButtonTitle = '';
                        }
                    }
                }
            }
        }
        // returning the parameter which defines the button state
        return new responseAllocationButtonValidationParameter(responseAllocationButtonMainText, responseAllocationButtonSubText, isResponseAllocateButtonVisible, isResponseAllocateButtonEnabled, isWorklistInformationBannerVisible, responseAllocationButtonTitle, responseAllocationButtonSingleResponseText, responseAllocationButtonUpToOpenResponseText, isWholeResponseResponseAllocationButtonAvailable);
    };
    return ResponseAllocationButtonValidationHelper;
}());
module.exports = ResponseAllocationButtonValidationHelper;
//# sourceMappingURL=responseallocationbuttonvalidationhelper.js.map