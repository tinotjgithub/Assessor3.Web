"use strict";
var qigStore = require('../../stores/qigselector/qigstore');
var enums = require('../../components/utility/enums');
var targetSummaryStore = require('../../stores/worklist/targetsummarystore');
var examinerStore = require('../../stores/markerinformation/examinerstore');
var worklistStore = require('../../stores/worklist/workliststore');
/**
 * Helper class for target summary
 */
var TargetHelper = (function () {
    function TargetHelper() {
    }
    /**
     * Get the marking mode based on the target summary store.
     * Impacted areas: auto approval scenarios, left side targets click, tab visibility.
     */
    TargetHelper.getSelectedQigMarkingMode = function () {
        var markingMode;
        var currentMarkingMode = targetSummaryStore.instance.getCurrentMarkingMode();
        if (qigStore.instance.selectedQIGForMarkerOperation &&
            qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding &&
            qigStore.instance.selectedQIGForMarkerOperation.qualityFeedbackOutstandingSeedTypeId === enums.SeedType.EUR) {
            // Marker Submitted the EUR seed and Quality feedback pending.
            // EUR sees is inside the live - directed EUR worklist. Set marking mode as Live
            return enums.MarkingMode.LiveMarking;
        }
        // Check if remarking marking mode
        if (worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType)
            === enums.MarkingMode.Remarking) {
            markingMode = enums.MarkingMode.Remarking;
        }
        else if (this.isExaminerQigStatusAwaitingApproval() === true
            && currentMarkingMode === enums.MarkingMode.Simulation) {
            markingMode = enums.MarkingMode.Simulation;
        }
        else if (this.isExaminerQigStatusAwaitingApproval() === true
            && currentMarkingMode !== enums.MarkingMode.Practice) {
            markingMode = this.getSelectedQigMarkingModeBasedOnPreviousMarkingMode();
        }
        else {
            markingMode = targetSummaryStore.instance.getCurrentMarkingMode();
        }
        return markingMode;
    };
    /**
     * get the selected marking mode based on previous marking mode
     */
    TargetHelper.getSelectedQigMarkingModeBasedOnPreviousMarkingMode = function () {
        var markingMode;
        var currentMarkingMode = targetSummaryStore.instance.getCurrentMarkingMode();
        var previousMarkingMode = this.previousCompletedTarget();
        if (currentMarkingMode === enums.MarkingMode.LiveMarking) {
            if (previousMarkingMode === enums.MarkingMode.ES_TeamApproval
                || previousMarkingMode === enums.MarkingMode.Approval) {
                markingMode = TargetHelper.getStandardisationOrSTMStandardisationMode();
            }
            else if (previousMarkingMode === enums.MarkingMode.None) {
                markingMode = enums.MarkingMode.LiveMarking;
            }
        }
        else {
            markingMode = TargetHelper.getStandardisationOrSTMStandardisationMode();
        }
        return markingMode;
    };
    /**
     * Get the marking target to be selected based on the already selected worklist
     * Impacted areas: Directed remarks, autoapproval
     */
    TargetHelper.getWorklistTargetToBeSelected = function (worklistType, isTragetDisabled) {
        if (isTragetDisabled === void 0) { isTragetDisabled = false; }
        var markingMode;
        var markingModeFromTargets = TargetHelper.getSelectedQigMarkingMode();
        var _worklistType = worklistType !== undefined ? worklistType :
            isTragetDisabled ? enums.WorklistType.none : worklistStore.instance.currentWorklistType;
        switch (_worklistType) {
            case enums.WorklistType.live:
                markingMode = enums.MarkingMode.LiveMarking;
                if (this.isExaminerQigStatusAwaitingApproval() === true
                    && markingModeFromTargets !== enums.MarkingMode.Practice) {
                    markingMode = this.getSelectedQigMarkingModeBasedOnPreviousMarkingMode();
                }
                break;
            case enums.WorklistType.atypical:
            case enums.WorklistType.directedRemark:
                markingMode = enums.MarkingMode.LiveMarking;
                break;
            case enums.WorklistType.practice:
                markingMode = enums.MarkingMode.Practice;
                break;
            case enums.WorklistType.standardisation:
                markingMode = enums.MarkingMode.Approval;
                break;
            case enums.WorklistType.secondstandardisation:
                markingMode = enums.MarkingMode.ES_TeamApproval;
                break;
            case enums.WorklistType.simulation:
                markingMode = enums.MarkingMode.Simulation;
                break;
            default:
                markingMode = markingModeFromTargets;
                break;
        }
        return markingMode;
    };
    /**
     * Check QIG is in awaiting approval which means Standardisation submitted but not yet approved.
     */
    TargetHelper.isExaminerQigStatusAwaitingApproval = function () {
        if (examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.NotApproved) {
            return true;
        }
        return false;
    };
    /**
     * Check QIG is in approval which means Standardisation submitted and approved.
     */
    TargetHelper.isExaminerQigStatusApproval = function () {
        if (examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.Approved) {
            return true;
        }
        return false;
    };
    /**
     * check whether the target has STM or Second Standardisation
     * returns true or flase
     */
    TargetHelper.isSTMOrHasSecondStdTarget = function () {
        if (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === true
            || TargetHelper.isESTeamApprovalTargetExist() === true) {
            return true;
        }
        return false;
    };
    /**
     * Check whether the marker has Second/STM Standardisation target
     * returns true or flase
     */
    TargetHelper.isESTeamApprovalTargetExist = function () {
        var secondStandardisationTarget = targetSummaryStore.instance.getExaminerMarkingTargetProgress().
            filter(function (target) {
            return target.markingModeID === enums.MarkingMode.ES_TeamApproval;
        }).first();
        if (secondStandardisationTarget !== undefined) {
            return true;
        }
        return false;
    };
    /**
     * check whether the standardisation target completed for current taregt summary.
     * returns true or flase
     */
    TargetHelper.isESTargetCompleted = function (selectedQigMarkingMode) {
        var markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        var currentMarkingMode = TargetHelper.getSelectedQigMarkingMode();
        var isExaminerApproved = !TargetHelper.isExaminerQigStatusAwaitingApproval();
        var isESTargetCompleted = false;
        var markingTarget = markingTargetsSummary.filter(function (x) { return x.markingModeID === selectedQigMarkingMode; }).first();
        if (selectedQigMarkingMode === enums.MarkingMode.Approval || selectedQigMarkingMode === enums.MarkingMode.ES_TeamApproval) {
            // Examiner has passed the current selected target - either approved or in next marking mode
            if (markingTarget.isTargetCompleted && (isExaminerApproved || selectedQigMarkingMode !== currentMarkingMode)) {
                isESTargetCompleted = true;
            }
            else {
                isESTargetCompleted = false;
            }
        }
        else if (selectedQigMarkingMode !== enums.MarkingMode.Practice) {
            /** setting std completed true if the marking mode is other than standardization or practice */
            isESTargetCompleted = true;
        }
        return isESTargetCompleted;
    };
    /**
     * Check if auto approval causes remaining responses to be deleted
     */
    TargetHelper.isResponsesDeletedOnAutoApproval = function (submittedResponseCount) {
        /** If submitted responses count is less than the target maximum limit  */
        var markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        var isResponsesDeletedOnAutoApproval = false;
        var markingModeID = targetSummaryStore.instance.getCurrentMarkingMode();
        if (markingModeID !== enums.MarkingMode.None) {
            var target = markingTargetsSummary !== undefined
                ? markingTargetsSummary.filter(function (x) { return (x.markingModeID === markingModeID); }).last()
                : undefined;
            // Target will get only after user respond to the Congratulation popup. So we are assuming that,
            // add the current submit response submitted list with the closed response count to get the actual
            // submitted response count if marker is submitting response one by one.
            if (target.maximumMarkingLimit >
                (target.examinerProgress.closedResponsesCount + submittedResponseCount)) {
                isResponsesDeletedOnAutoApproval = true;
            }
        }
        return isResponsesDeletedOnAutoApproval;
    };
    /**
     * Get the previous completed target.
     */
    TargetHelper.previousCompletedTarget = function () {
        var markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        var lastCompletedTarget;
        if (markingTargetsSummary !== undefined) {
            markingTargetsSummary = targetSummaryStore.instance.sortMarkingTargetsOnCompletedDate(markingTargetsSummary);
            lastCompletedTarget = markingTargetsSummary !== undefined
                ? markingTargetsSummary.filter(function (x) { return x.isTargetCompleted; }).last()
                : undefined;
        }
        var selectedQigPreviousMarkingMode;
        if (lastCompletedTarget) {
            selectedQigPreviousMarkingMode = lastCompletedTarget.markingModeID;
        }
        else {
            selectedQigPreviousMarkingMode = enums.MarkingMode.None;
        }
        return selectedQigPreviousMarkingMode;
    };
    /**
     * Check Examiner is in Simulation Mode for the current QIG.
     */
    TargetHelper.isSimulationMode = function () {
        if (targetSummaryStore.instance.getCurrentMarkingMode() === enums.MarkingMode.Simulation) {
            return true;
        }
        return false;
    };
    /**
     * returns the Examiner Qig Status based on values from the target store. This has most updated values than qig store.
     */
    TargetHelper.getExaminerQigStatus = function () {
        // get the values required for calculating logic.
        var examinerApprovalStatus = examinerStore.instance.getMarkerInformation.approvalStatus;
        if (!qigStore.instance.selectedQIGForMarkerOperation) {
            return enums.ExaminerQIGStatus.None;
        }
        var hasSimulationMode = qigStore.instance.selectedQIGForMarkerOperation.hasSimulationMode;
        var standardisationSetupComplete = qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete;
        var hasQualityFeedbackOutstanding = qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding;
        var currentMarkingMode = targetSummaryStore.instance.getCurrentMarkingMode();
        var currentTarget = targetSummaryStore.instance.getCurrentTarget();
        var responseCountList = this.getResponseCountList();
        // If the examiner is suspended, then returns the status as 'Suspended'.
        if (examinerApprovalStatus === enums.ExaminerApproval.Suspended) {
            return enums.ExaminerQIGStatus.Suspended;
        }
        // If the examiner is marking in simulation mode and Simulation Mode CC is ON, then returns the status as 'Simulation'
        if (hasSimulationMode && this.isSimulationMode()) {
            return enums.ExaminerQIGStatus.Simulation;
        }
        // If standardisation setup is not complete for the QIG, then returns the status as 'Waiting (Standardisation)'.
        if (!standardisationSetupComplete) {
            return enums.ExaminerQIGStatus.WaitingStandardisation;
        }
        // If the examiner has outstanding quality feedback to review, the  returns the status as 'Quality Feedback'.
        if (hasQualityFeedbackOutstanding) {
            return enums.ExaminerQIGStatus.QualityFeedback;
        }
        // If the examiner is marking on their practice marking, then returns the status as 'Practice Marking'.
        if (currentMarkingMode === enums.MarkingMode.Practice) {
            return enums.ExaminerQIGStatus.Practice;
        }
        // If the examiner is marking on their Standardisation marking, then returns the status as 'Standardisation Marking'.
        if (currentMarkingMode === enums.MarkingMode.Approval) {
            return enums.ExaminerQIGStatus.StandardisationMarking;
        }
        // If the examiner is marking on their STM/2nd standardisation marking,
        //   then returns the status as 'STM/2nd Standardisation Marking'.
        if (currentMarkingMode === enums.MarkingMode.ES_TeamApproval) {
            return qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === true ?
                enums.ExaminerQIGStatus.STMStandardisationMarking : enums.ExaminerQIGStatus.SecondStandardisationMarking;
        }
        if (currentMarkingMode === enums.MarkingMode.LiveMarking) {
            // If the Logged in examier is of Admin re-marker role then retun Live Marking
            if (qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.adminRemarker) {
                return enums.ExaminerQIGStatus.LiveMarking;
            }
            // If the examiner is completed their standardisation marking and is not yet approved,
            // then returns the status as 'Awaiting Approval'.
            if (examinerApprovalStatus === enums.ExaminerApproval.NotApproved) {
                return enums.ExaminerQIGStatus.AwaitingApproval;
            }
            // If the examiner meets their live marking target, then returns the status as 'Live Complete'.
            if ((currentTarget.examinerProgress.closedResponsesCount + currentTarget.examinerProgress.pendingResponsesCount)
                >= (currentTarget.maximumMarkingLimit + currentTarget.overAllocationCount)) {
                return enums.ExaminerQIGStatus.LiveComplete;
            }
            // If the examiner completed the allocated target.(Calculated using the Pending and closed response count)
            if ((responseCountList[1] + responseCountList[2])
                >= (currentTarget.maximumMarkingLimit + currentTarget.overAllocationCount)) {
                return enums.ExaminerQIGStatus.OverAllTargetCompleted;
            }
            // If the examiner reached the target.(Calculated using the Open, Pending and closed response count)
            if ((responseCountList[0] + responseCountList[1] + responseCountList[2])
                >= (currentTarget.maximumMarkingLimit + currentTarget.overAllocationCount)) {
                return enums.ExaminerQIGStatus.OverAllTargetReached;
            }
            return enums.ExaminerQIGStatus.LiveMarking;
        }
        return enums.ExaminerQIGStatus.None;
    };
    /**
     * Get response count including all the live and the directed remark worklist
     */
    TargetHelper.getResponseCountList = function () {
        var markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        var responseCountList = [];
        var open = 0;
        var closed = 0;
        var inGrace = 0;
        if (markingTargetsSummary != null) {
            markingTargetsSummary.forEach(function (m) {
                if (m.markingModeID === enums.MarkingMode.Remarking
                    && m.examinerProgress.isDirectedRemark === true) {
                    open += m.examinerProgress.openResponsesCount;
                    inGrace += m.examinerProgress.pendingResponsesCount;
                    closed += m.examinerProgress.closedResponsesCount;
                }
                else if (m.markingModeID === enums.MarkingMode.LiveMarking) {
                    open += m.examinerProgress.openResponsesCount;
                    open += m.examinerProgress.atypicalOpenResponsesCount;
                    inGrace += m.examinerProgress.pendingResponsesCount;
                    inGrace += m.examinerProgress.atypicalPendingResponsesCount;
                    closed += m.examinerProgress.closedResponsesCount;
                    closed += m.examinerProgress.atypicalClosedResponsesCount;
                }
            });
        }
        responseCountList.push(open);
        responseCountList.push(inGrace);
        responseCountList.push(closed);
        return responseCountList;
    };
    /**
     * returns the Examiner  Status based on values from the target store. This has most updated values than qig store.
     */
    TargetHelper.getExaminerApproval = function () {
        if (!examinerStore.instance.getMarkerInformation) {
            return enums.ExaminerApproval.None;
        }
        // get the values required for calculating logic.
        var examinerApprovalStatus = examinerStore.instance.getMarkerInformation.approvalStatus;
        return examinerApprovalStatus;
    };
    /**
     * Get Standardisation or STM Standardisation based on ES Team Approval
     */
    TargetHelper.getStandardisationOrSTMStandardisationMode = function () {
        if (this.isSTMOrHasSecondStdTarget() === true) {
            return enums.MarkingMode.ES_TeamApproval;
        }
        else {
            return enums.MarkingMode.Approval;
        }
    };
    /**
     * returns the worklist type based on the marking mode
     */
    TargetHelper.getWorkListTypeByMarkingMode = function (markingMode) {
        var workListType;
        /** set the worklist type from  the marking mode */
        switch (markingMode) {
            case enums.MarkingMode.LiveMarking:
                workListType = enums.WorklistType.live;
                break;
            case enums.MarkingMode.Practice:
                workListType = enums.WorklistType.practice;
                break;
            case enums.MarkingMode.Approval:
                workListType = enums.WorklistType.standardisation;
                break;
            case enums.MarkingMode.ES_TeamApproval:
                workListType = enums.WorklistType.secondstandardisation;
                break;
            case enums.MarkingMode.Remarking:
                workListType = enums.WorklistType.directedRemark;
                break;
        }
        return workListType;
    };
    /**
     * Returns the current remark request type
     */
    TargetHelper.getCurrentRemarkRequestType = function () {
        return worklistStore.instance.getRemarkRequestType;
    };
    Object.defineProperty(TargetHelper, "getExaminerMarkingTargetProgress", {
        /**
         * To get the examiners target progress
         */
        get: function () {
            return targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To get marking mode by worklist type.
     */
    TargetHelper.getMarkingModeByWorklistType = function (worklistType) {
        var markingMode;
        switch (worklistType) {
            case enums.WorklistType.atypical:
            case enums.WorklistType.live:
                markingMode = enums.MarkingMode.LiveMarking;
                break;
            case enums.WorklistType.practice:
                markingMode = enums.MarkingMode.Practice;
                break;
            case enums.WorklistType.standardisation:
                markingMode = enums.MarkingMode.Approval;
                break;
            case enums.WorklistType.secondstandardisation:
                markingMode = enums.MarkingMode.ES_TeamApproval;
                break;
            case enums.WorklistType.pooledRemark:
            case enums.WorklistType.directedRemark:
                // if the marker is withdrawn in background then selectedQIGForMarkerOperation become undefined.
                if (qigStore.instance.selectedQIGForMarkerOperation &&
                    !qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding) {
                    markingMode = enums.MarkingMode.Remarking;
                    break;
                }
                else {
                    markingMode = enums.MarkingMode.LiveMarking;
                    break;
                }
            case enums.WorklistType.simulation:
                markingMode = enums.MarkingMode.Simulation;
                break;
        }
        return markingMode;
    };
    /**
     * To identify whether the selected target has been completed
     */
    TargetHelper.isSelectedMenuCompleted = function (selectedQigMarkingMode) {
        /** checking target is completed when navigating from menu   */
        var markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        var isESTargetCompleted = false;
        var markingTarget = markingTargetsSummary.filter(function (x) { return x.markingModeID === selectedQigMarkingMode; }).first();
        if (selectedQigMarkingMode === enums.MarkingMode.Approval || selectedQigMarkingMode === enums.MarkingMode.Practice) {
            // Examiner has approved
            if (markingTarget.isTargetCompleted) {
                isESTargetCompleted = true;
            }
            else {
                isESTargetCompleted = false;
            }
        }
        return isESTargetCompleted;
    };
    /**
     * Resetting responsemode by checking the current markingtarget status
     */
    TargetHelper.doResetResponseMode = function (selectedQigMarkingMode, responseMode) {
        var _responseMode = responseMode;
        var markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        var markingTarget = markingTargetsSummary.filter(function (x) { return x.markingModeID === selectedQigMarkingMode; }).first();
        if (selectedQigMarkingMode === enums.MarkingMode.Approval || selectedQigMarkingMode === enums.MarkingMode.Practice) {
            _responseMode = (!markingTarget.isTargetCompleted &&
                markingTarget.examinerProgress.closedResponsesCount > 0 &&
                markingTarget.examinerProgress.openResponsesCount === 0) ? enums.ResponseMode.closed : responseMode;
        }
        return _responseMode;
    };
    Object.defineProperty(TargetHelper, "currentMarkingMode", {
        /**
         * Gets a value indicating the current active marking mode.
         *
         * @readonly
         * @static
         * @type {enums.MarkingMode}
         * @memberof TargetHelper
         */
        get: function () {
            return targetSummaryStore.instance.getCurrentMarkingMode();
        },
        enumerable: true,
        configurable: true
    });
    return TargetHelper;
}());
module.exports = TargetHelper;
//# sourceMappingURL=targethelper.js.map