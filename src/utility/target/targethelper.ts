import qigStore = require('../../stores/qigselector/qigstore');
import enums = require('../../components/utility/enums');
import markingTargetSummary = require('../../stores/worklist/typings/markingtargetsummary');
import targetSummaryStore = require('../../stores/worklist/targetsummarystore');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import worklistStore = require('../../stores/worklist/workliststore');

/**
 * Helper class for target summary
 */
class TargetHelper {

    /**
     * Get the marking mode based on the target summary store.
     * Impacted areas: auto approval scenarios, left side targets click, tab visibility.
     */
    public static getSelectedQigMarkingMode(): enums.MarkingMode {
        let markingMode: enums.MarkingMode;
        let currentMarkingMode: enums.MarkingMode = targetSummaryStore.instance.getCurrentMarkingMode();

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

            // Check if QIG status is awaiting approval
        } else if (this.isExaminerQigStatusAwaitingApproval() === true
            && currentMarkingMode === enums.MarkingMode.Simulation) {
            markingMode = enums.MarkingMode.Simulation;
        } else if (this.isExaminerQigStatusAwaitingApproval() === true
            && currentMarkingMode !== enums.MarkingMode.Practice) {
            markingMode = this.getSelectedQigMarkingModeBasedOnPreviousMarkingMode();

            // Get the marking mode from current target
        } else {
            markingMode = targetSummaryStore.instance.getCurrentMarkingMode();
        }

        return markingMode;
    }

    /**
     * get the selected marking mode based on previous marking mode
     */
    private static getSelectedQigMarkingModeBasedOnPreviousMarkingMode(): enums.MarkingMode {
        let markingMode: enums.MarkingMode;
        let currentMarkingMode: enums.MarkingMode = targetSummaryStore.instance.getCurrentMarkingMode();
        let previousMarkingMode: enums.MarkingMode = this.previousCompletedTarget();

        if (currentMarkingMode === enums.MarkingMode.LiveMarking) {
            if (previousMarkingMode === enums.MarkingMode.ES_TeamApproval
                || previousMarkingMode === enums.MarkingMode.Approval) {
                markingMode = TargetHelper.getStandardisationOrSTMStandardisationMode();
            } else if (previousMarkingMode === enums.MarkingMode.None) {
                markingMode = enums.MarkingMode.LiveMarking;
            }
        } else {
            markingMode = TargetHelper.getStandardisationOrSTMStandardisationMode();
        }

        return markingMode;
    }
    /**
     * Get the marking target to be selected based on the already selected worklist
     * Impacted areas: Directed remarks, autoapproval
     */
    public static getWorklistTargetToBeSelected(worklistType?: enums.WorklistType, isTragetDisabled: boolean = false): enums.MarkingMode {
        let markingMode: enums.MarkingMode;
        let markingModeFromTargets: enums.MarkingMode = TargetHelper.getSelectedQigMarkingMode();
        let _worklistType: enums.WorklistType = worklistType !== undefined ? worklistType :
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
    }

    /**
     * Check QIG is in awaiting approval which means Standardisation submitted but not yet approved.
     */
    public static isExaminerQigStatusAwaitingApproval(): boolean {
        if (examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.NotApproved) {
            return true;
        }

        return false;
    }

    /**
     * Check QIG is in approval which means Standardisation submitted and approved.
     */
    public static isExaminerQigStatusApproval(): boolean {
        if (examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.Approved) {
            return true;
        }

        return false;
    }

    /**
     * check whether the target has STM or Second Standardisation
     * returns true or flase
     */
    private static isSTMOrHasSecondStdTarget() {

        if (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === true
            || TargetHelper.isESTeamApprovalTargetExist() === true) {
            return true;
        }
        return false;
    }

    /**
     * Check whether the marker has Second/STM Standardisation target
     * returns true or flase
     */
    private static isESTeamApprovalTargetExist() {
        let secondStandardisationTarget =
            targetSummaryStore.instance.getExaminerMarkingTargetProgress().
                filter((target: markingTargetSummary) =>
                    target.markingModeID === enums.MarkingMode.ES_TeamApproval).first();

        if (secondStandardisationTarget !== undefined) {
            return true;
        }

        return false;
    }

    /**
     * check whether the standardisation target completed for current taregt summary.
     * returns true or flase
     */
    public static isESTargetCompleted(selectedQigMarkingMode: enums.MarkingMode): boolean {
        let markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        let currentMarkingMode: enums.MarkingMode = TargetHelper.getSelectedQigMarkingMode();
        let isExaminerApproved: boolean = !TargetHelper.isExaminerQigStatusAwaitingApproval();
        let isESTargetCompleted: boolean = false;

        let markingTarget = markingTargetsSummary.filter((x: markingTargetSummary) => x.markingModeID === selectedQigMarkingMode).first();
        if (selectedQigMarkingMode === enums.MarkingMode.Approval || selectedQigMarkingMode === enums.MarkingMode.ES_TeamApproval) {
            // Examiner has passed the current selected target - either approved or in next marking mode
            if (markingTarget.isTargetCompleted && (isExaminerApproved || selectedQigMarkingMode !== currentMarkingMode)) {
                isESTargetCompleted = true;
            } else {  // scenario when examiner not approved , but target still shows completed
                isESTargetCompleted = false;
            }
        } else if (selectedQigMarkingMode !== enums.MarkingMode.Practice) {
            /** setting std completed true if the marking mode is other than standardization or practice */
            isESTargetCompleted = true;
        }

        return isESTargetCompleted;
    }

    /**
     * Check if auto approval causes remaining responses to be deleted
     */
    public static isResponsesDeletedOnAutoApproval(submittedResponseCount: number): boolean {
        /** If submitted responses count is less than the target maximum limit  */
        let markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        let isResponsesDeletedOnAutoApproval: boolean = false;
        let markingModeID: enums.MarkingMode = targetSummaryStore.instance.getCurrentMarkingMode();
        if (markingModeID !== enums.MarkingMode.None) {
            let target: markingTargetSummary = markingTargetsSummary !== undefined
                ? markingTargetsSummary.filter((x: markingTargetSummary) => (x.markingModeID === markingModeID)).last()
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
    }

    /**
     * Get the previous completed target.
     */
    public static previousCompletedTarget(): enums.MarkingMode {
        let markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        let lastCompletedTarget: markingTargetSummary;
        if (markingTargetsSummary !== undefined) {
            markingTargetsSummary = targetSummaryStore.instance.sortMarkingTargetsOnCompletedDate(markingTargetsSummary);
            lastCompletedTarget = markingTargetsSummary !== undefined
                ? markingTargetsSummary.filter((x: markingTargetSummary) => x.isTargetCompleted).last()
                : undefined;
        }

        let selectedQigPreviousMarkingMode: enums.MarkingMode;
        if (lastCompletedTarget) {
            selectedQigPreviousMarkingMode = lastCompletedTarget.markingModeID;
        } else {
            selectedQigPreviousMarkingMode = enums.MarkingMode.None;
        }
        return selectedQigPreviousMarkingMode;
    }

    /**
     * Check Examiner is in Simulation Mode for the current QIG.
     */
    public static isSimulationMode(): boolean {
        if (targetSummaryStore.instance.getCurrentMarkingMode() === enums.MarkingMode.Simulation) {
            return true;
        }
        return false;
    }

    /**
     * returns the Examiner Qig Status based on values from the target store. This has most updated values than qig store.
     */
    public static getExaminerQigStatus(): enums.ExaminerQIGStatus {
        // get the values required for calculating logic.
        let examinerApprovalStatus: enums.ExaminerApproval = examinerStore.instance.getMarkerInformation.approvalStatus;
        if (!qigStore.instance.selectedQIGForMarkerOperation) {
            return enums.ExaminerQIGStatus.None;
        }

        let hasSimulationMode: boolean = qigStore.instance.selectedQIGForMarkerOperation.hasSimulationMode;
        let standardisationSetupComplete: boolean = qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete;
        let hasQualityFeedbackOutstanding: boolean = qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding;
        let currentMarkingMode: enums.MarkingMode = targetSummaryStore.instance.getCurrentMarkingMode();
        let currentTarget: markingTargetSummary = targetSummaryStore.instance.getCurrentTarget();
        let responseCountList: Array<number> = this.getResponseCountList();

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
            let closedCount: number = 0;
            let totalCount: number = 0;
            let maximumMarkingLimit: number = 0;
            let overAllocationCount: number = 0;
            if (qigStore.instance.isAggregatedQigCCEnabledForCurrentQig) {
                closedCount = currentTarget.aggregatedClosedResponsesCount;
                totalCount = currentTarget.aggregatedOpenResponsesCount + closedCount;
                maximumMarkingLimit = currentTarget.aggregatedMaximumMarkingLimit;
                overAllocationCount = currentTarget.aggregatedOverAllocationCount;
            } else {
                closedCount = responseCountList[1] + responseCountList[2];
                totalCount = responseCountList[0] + closedCount;
                maximumMarkingLimit = currentTarget.maximumMarkingLimit;
                overAllocationCount = currentTarget.overAllocationCount;
            }
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
                >= (maximumMarkingLimit + overAllocationCount)) {
                return enums.ExaminerQIGStatus.LiveComplete;
            }

            // If the examiner completed the allocated target.(Calculated using the Pending and closed response count)
            if (closedCount
                >= (maximumMarkingLimit + overAllocationCount)) {
                return enums.ExaminerQIGStatus.OverAllTargetCompleted;
            }

            // If the examiner reached the target.(Calculated using the Open, Pending and closed response count)
            if (totalCount
                >= (maximumMarkingLimit + overAllocationCount)) {
                return enums.ExaminerQIGStatus.OverAllTargetReached;
            }
            return enums.ExaminerQIGStatus.LiveMarking;
        }

        return enums.ExaminerQIGStatus.None;
    }

    /**
     * Get response count including all the live and the directed remark worklist
     */
    private static getResponseCountList(): Array<number> {
        let markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        let responseCountList: Array<number> = [];
        let open: number = 0;
        let closed: number = 0;
        let inGrace: number = 0;
        if (markingTargetsSummary != null) {

            markingTargetsSummary.forEach((m: markingTargetSummary) => {
                if (m.markingModeID === enums.MarkingMode.Remarking
                    && m.examinerProgress.isDirectedRemark === true) {
                    open += m.examinerProgress.openResponsesCount;
                    inGrace += m.examinerProgress.pendingResponsesCount;
                    closed += m.examinerProgress.closedResponsesCount;
                } else if (m.markingModeID === enums.MarkingMode.LiveMarking) {
                    open += m.examinerProgress.openResponsesCount + m.examinerProgress.atypicalOpenResponsesCount;
                    inGrace += m.examinerProgress.pendingResponsesCount + m.examinerProgress.atypicalPendingResponsesCount;
                    closed += m.examinerProgress.closedResponsesCount + m.examinerProgress.atypicalClosedResponsesCount;
                }
            });
        }

        responseCountList.push(open);
        responseCountList.push(inGrace);
        responseCountList.push(closed);

        return responseCountList;
    }

    /**
     * returns the Examiner  Status based on values from the target store. This has most updated values than qig store.
     */
    public static getExaminerApproval(): enums.ExaminerApproval {

        if (!examinerStore.instance.getMarkerInformation) {
            return enums.ExaminerApproval.None;
        }

        // get the values required for calculating logic.
        let examinerApprovalStatus: enums.ExaminerApproval = examinerStore.instance.getMarkerInformation.approvalStatus;

        return examinerApprovalStatus;
    }

    /**
     * Get Standardisation or STM Standardisation based on ES Team Approval
     */
    private static getStandardisationOrSTMStandardisationMode(): enums.MarkingMode {

        if (this.isSTMOrHasSecondStdTarget() === true) {
            return enums.MarkingMode.ES_TeamApproval;
        } else {
            return enums.MarkingMode.Approval;
        }
    }

    /**
     * returns the worklist type based on the marking mode
     */
    public static getWorkListTypeByMarkingMode(markingMode: number): any {
        let workListType: enums.WorklistType;

        /** set the worklist type from  the marking mode */
        switch (markingMode) {
            case enums.MarkingMode.LiveMarking: workListType = enums.WorklistType.live; break;
            case enums.MarkingMode.Practice: workListType = enums.WorklistType.practice; break;
            case enums.MarkingMode.Approval: workListType = enums.WorklistType.standardisation; break;
            case enums.MarkingMode.ES_TeamApproval: workListType = enums.WorklistType.secondstandardisation; break;
            case enums.MarkingMode.Remarking: workListType = enums.WorklistType.directedRemark; break;
        }

        return workListType;
    }

    /**
     * Returns the current remark request type
     */
    public static getCurrentRemarkRequestType(): enums.RemarkRequestType {
        return worklistStore.instance.getRemarkRequestType;
    }

    /**
     * To get the examiners target progress
     */
    public static get getExaminerMarkingTargetProgress(): Immutable.List<markingTargetSummary> {
        return targetSummaryStore.instance.getExaminerMarkingTargetProgress();
    }

    /**
     * To get marking mode by worklist type.
     */
    public static getMarkingModeByWorklistType(worklistType: enums.WorklistType): enums.MarkingMode {
        let markingMode: enums.MarkingMode;

        switch (worklistType) {
            case enums.WorklistType.atypical:
            case enums.WorklistType.live: markingMode = enums.MarkingMode.LiveMarking; break;
            case enums.WorklistType.practice: markingMode = enums.MarkingMode.Practice; break;
            case enums.WorklistType.standardisation: markingMode = enums.MarkingMode.Approval; break;
            case enums.WorklistType.secondstandardisation: markingMode = enums.MarkingMode.ES_TeamApproval; break;
            case enums.WorklistType.pooledRemark:
            case enums.WorklistType.directedRemark:
                // if the marker is withdrawn in background then selectedQIGForMarkerOperation become undefined.
                if (qigStore.instance.selectedQIGForMarkerOperation &&
                    !qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding) {
                    markingMode = enums.MarkingMode.Remarking; break;
                } else {
                    markingMode = enums.MarkingMode.LiveMarking; break;
                }
            case enums.WorklistType.simulation: markingMode = enums.MarkingMode.Simulation; break;
        }

        return markingMode;
    }

    /**
     * To identify whether the selected target has been completed
     */
    public static isSelectedMenuCompleted(selectedQigMarkingMode: enums.MarkingMode): boolean {
        /** checking target is completed when navigating from menu   */
        let markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        let isESTargetCompleted: boolean = false;
        let markingTarget = markingTargetsSummary.filter((x: markingTargetSummary) => x.markingModeID === selectedQigMarkingMode).first();
        if (selectedQigMarkingMode === enums.MarkingMode.Approval || selectedQigMarkingMode === enums.MarkingMode.Practice) {
            // Examiner has approved
            if (markingTarget.isTargetCompleted) {
                isESTargetCompleted = true;
            } else {  //examiner not approved ,
                isESTargetCompleted = false;
            }
        }
        return isESTargetCompleted;
    }

    /**
     * Resetting responsemode by checking the current markingtarget status 
     */
    public static doResetResponseMode(selectedQigMarkingMode: enums.MarkingMode, responseMode: enums.ResponseMode): enums.ResponseMode {
        let _responseMode = responseMode;
        let markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
        let markingTarget = markingTargetsSummary.filter((x: markingTargetSummary) => x.markingModeID === selectedQigMarkingMode).first();
        if (selectedQigMarkingMode === enums.MarkingMode.Approval || selectedQigMarkingMode === enums.MarkingMode.Practice) {
            _responseMode = (!markingTarget.isTargetCompleted &&
                markingTarget.examinerProgress.closedResponsesCount > 0 &&
                markingTarget.examinerProgress.openResponsesCount === 0) ? enums.ResponseMode.closed : responseMode;
        }
        return _responseMode;
    }

    /**
     * Gets a value indicating the current active marking mode.
     * 
     * @readonly
     * @static
     * @type {enums.MarkingMode}
     * @memberof TargetHelper
     */
    public static get currentMarkingMode(): enums.MarkingMode {
        return targetSummaryStore.instance.getCurrentMarkingMode();
    }

}

export = TargetHelper;