import responseAllocationButtonValidationParameter = require('./responseallocationbuttonvalidationparameter');
import localeStore = require('../../../stores/locale/localestore');
import targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import enums = require('../enums');
import qigStore = require('../../../stores/qigselector/qigstore');
import qigSelectorValidationHelper = require('../qigselector/qigselectorvalidationhelper');
import loginStore = require('../../../stores/login/loginstore');
import responseHelper = require('../responsehelper/responsehelper');

/**
 * Helper class for response allocation button
 * It handles the enabling/disabling as well as the visibility status of the button
 */
class ResponseAllocationButtonValidationHelper {

    /**
     * Returns an entity representing the states to be set for the response allocation button
     * @param liveWorklistStatistics contains the worklist details
     * @param examinerQigStatus the current qig status of the examiner
     * @param examinerApprovalStatus contains the examiner approval status
     * @param worklistType stores the worklist type
     * @param remarkRequestType stores the remark request type
     */
    public static validate(liveWorklistStatistics: LiveOpenWorklist, examinerQigStatus: enums.ExaminerQIGStatus,
        examinerApprovalStatus: enums.ExaminerApproval, worklistType: enums.WorklistType, remarkRequestType: enums.RemarkRequestType,
        isTeamManagementMode: boolean)
        : responseAllocationButtonValidationParameter {

        let responseAllocationButtonMainText: string;
        let responseAllocationButtonTitle: string = '';
        let responseAllocationButtonSubText: string = '';
        let isResponseAllocateButtonVisible: boolean = true;
        let isResponseAllocateButtonEnabled: boolean = false;
        let isWorklistInformationBannerVisible: boolean = false;

        // Getting the response allocation dropdown buttons text
        let responseAllocationButtonSingleResponseText: string;
        let responseAllocationButtonUpToOpenResponseText: string;
        let isWholeResponseResponseAllocationButtonAvailable: boolean = false;

        // we need to hide the Response allocation button if the marker operation mode is Team Management.
        if (isTeamManagementMode) {
            isResponseAllocateButtonVisible = false;
        } else {

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
            } else {
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

                let isConcurrentLimitMet: boolean = new qigSelectorValidationHelper()
                    .isConcurrentLimitMet(qigStore.instance.selectedQIGForMarkerOperation, liveWorklistStatistics);
                //Not applicable for pooled remark since the live complete status does not affect pooled remarks
                if ((examinerQigStatus === enums.ExaminerQIGStatus.LiveComplete
                    || examinerQigStatus === enums.ExaminerQIGStatus.OverAllTargetReached
                    || examinerQigStatus === enums.ExaminerQIGStatus.OverAllTargetCompleted)
                    && worklistType !== enums.WorklistType.pooledRemark) {
                    // If the live marking is completed or the marking target is reached.
                    isResponseAllocateButtonEnabled = false;
                    responseAllocationButtonSubText = localeStore.instance.TranslateText
                        ('marking.worklist.action-buttons.allocate-button-target-reached-indicator');
                } else if (isConcurrentLimitMet) {
                    // If the current open response count meets the concurrent limit
                    responseAllocationButtonSubText =
                        localeStore.instance.TranslateText
                            ('marking.worklist.action-buttons.allocate-button-concurrent-limit-reached-indicator');
                    isResponseAllocateButtonEnabled = false;
                } else if (liveWorklistStatistics.unallocatedResponsesCount <= 0) {
                    // If there are no unallocated responses left
                    responseAllocationButtonSubText = localeStore.instance.TranslateText
                        ('marking.worklist.no-responses-available-helper.header');
                    isResponseAllocateButtonEnabled = false;
                } else {
                    //If the above conditions are not satisfied the allocation button should be enabled
                    isResponseAllocateButtonEnabled = true;
                }
            }

            // If the allocation button is already enabled, then disable the same if the total responses count
            // has gone over the maximum marking limit and over allocation
            if (isResponseAllocateButtonEnabled) {
                let isAggregateTargetsCCEnabled: boolean = qigStore.instance.selectedQIGForMarkerOperation.isAggregateQIGTargetsON;
                if (worklistType === enums.WorklistType.live) {
                    let currentTarget: markingTargetSummary = targetSummaryStore.instance.getCurrentTarget();
                    if (currentTarget && currentTarget.markingModeID === enums.MarkingMode.LiveMarking) {

                        // Retrieving the marking targets collection
                        let targetSummary: Immutable.List<markingTargetSummary>
                            = targetSummaryStore.instance.getExaminerMarkingTargetProgress();

                        if (targetSummary) {
                            let totalLiveResponsesCount: number = 0;
                            // Looping through the marking targets collection
                            for (let index = 0; index < targetSummary.count(); index++) {
                                let target: markingTargetSummary = targetSummary.get(index);
                                if (target.markingModeID === enums.MarkingMode.LiveMarking
                                    || target.examinerProgress.isDirectedRemark) {
                                    if (isAggregateTargetsCCEnabled) {
                                         // Summing up the total live responses count
                                         totalLiveResponsesCount += target.aggregatedOpenResponsesCount +
                                         target.aggregatedClosedResponsesCount;
                                    } else {
                                        // Summing up the total live responses count
                                        totalLiveResponsesCount += target.examinerProgress.openResponsesCount +
                                        target.examinerProgress.pendingResponsesCount +
                                        target.examinerProgress.closedResponsesCount;
                                    }

                                    if (target.markingModeID === enums.MarkingMode.LiveMarking && !isAggregateTargetsCCEnabled) {
                                        totalLiveResponsesCount += target.examinerProgress.atypicalOpenResponsesCount;
                                    }
                                }
                            }

                            let maximumMarkingLimit: number = isAggregateTargetsCCEnabled ?
                                currentTarget.aggregatedMaximumMarkingLimit : currentTarget.maximumMarkingLimit;
                            let overAllocationCount: number = isAggregateTargetsCCEnabled ?
                                currentTarget.aggregatedOverAllocationCount : currentTarget.overAllocationCount;

                            // Setting the visibility of response allocation button status
                            isResponseAllocateButtonEnabled =
                                totalLiveResponsesCount < maximumMarkingLimit + overAllocationCount;

                            if (isResponseAllocateButtonEnabled) {
                                responseAllocationButtonTitle =
                                    localeStore.instance.TranslateText('marking.worklist.action-buttons.allocate-button-tooltip');
                            } else {
                                responseAllocationButtonTitle = '';
                            }
                        }
                    }
                    //if the worklist type is pooledremark we dont have to check about the current target of the examiner
                    // and also the over allocation target of the examiner
                } else if (worklistType === enums.WorklistType.pooledRemark) {
                    let target: markingTargetSummary = targetSummaryStore.instance.getRemarkTarget(remarkRequestType);
                    if (target) {
                        let totalRemarkResponsesCount: number = 0;
                        let maximumMarkingLimit: number = 0;
                        let overAllocationCount: number = 0;
                        let isMaximumMarkingLimitMet: boolean = false;
                        let isConcurrentLimitMet: boolean = false;
                        // Summing up the total remark responses count
                        if (isAggregateTargetsCCEnabled) {
                            totalRemarkResponsesCount += target.aggregatedOpenResponsesCount +
                                target.aggregatedClosedResponsesCount;
                            maximumMarkingLimit = target.aggregatedMaximumMarkingLimit;
                            overAllocationCount = target.aggregatedOverAllocationCount;
                            isMaximumMarkingLimitMet = (totalRemarkResponsesCount === maximumMarkingLimit + overAllocationCount);
                            isConcurrentLimitMet = (target.aggregatedOpenResponsesCount === target.aggregatedMaximumConcurrentLimit);
                             // Setting the visibility of response allocation button status
                            isResponseAllocateButtonEnabled = (target.aggregatedOpenResponsesCount <
                                target.aggregatedMaximumConcurrentLimit)
                                && (totalRemarkResponsesCount < maximumMarkingLimit + overAllocationCount);
                        } else {
                            totalRemarkResponsesCount += target.examinerProgress.openResponsesCount +
                                target.examinerProgress.pendingResponsesCount +
                                target.examinerProgress.closedResponsesCount;
                            maximumMarkingLimit = target.maximumMarkingLimit;
                            overAllocationCount = target.overAllocationCount;
                            // Setting the visibility of response allocation button status
                            isResponseAllocateButtonEnabled = (totalRemarkResponsesCount < maximumMarkingLimit + overAllocationCount);
                        }

                        if (!isResponseAllocateButtonEnabled) {
                            if (isAggregateTargetsCCEnabled && isConcurrentLimitMet && !isMaximumMarkingLimitMet) {
                                responseAllocationButtonSubText = localeStore.instance.TranslateText(
                                    'marking.worklist.action-buttons.allocate-button-concurrent-limit-reached-indicator');
                            } else {
                                responseAllocationButtonSubText = localeStore.instance.TranslateText(
                                    'marking.worklist.action-buttons.allocate-button-target-reached-indicator');
                            }
                            responseAllocationButtonTitle = '';
                        }
                    }
                }
            }
        }

        // returning the parameter which defines the button state
        return new responseAllocationButtonValidationParameter(responseAllocationButtonMainText,
            responseAllocationButtonSubText,
            isResponseAllocateButtonVisible,
            isResponseAllocateButtonEnabled,
            isWorklistInformationBannerVisible,
            responseAllocationButtonTitle,
            responseAllocationButtonSingleResponseText,
            responseAllocationButtonUpToOpenResponseText,
            isWholeResponseResponseAllocationButtonAvailable
        );
    }
}

export = ResponseAllocationButtonValidationHelper;