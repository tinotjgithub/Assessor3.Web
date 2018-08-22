import enums = require('../../components/utility/enums');
import qigStore = require('../../stores/qigselector/qigstore');
import markingTargetSummary = require('../../stores/worklist/typings/markingtargetsummary');
import workListStore = require('../../stores/worklist/workliststore');
import targetSummaryStore = require('../../stores/worklist/targetsummarystore');
import targetHelper = require('../../utility/target/targethelper');
import allocateResponseHelper = require('../../components/utility/responseallocation/allocateresponseshelper');
import markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
import markingStore = require('../../stores/marking/markingstore');
import worklistActioncreator = require('../../actions/worklist/worklistactioncreator');
import markerProgressData = require('../../stores/worklist/typings/markerprogressdata');
import navigationStore = require('../../stores/navigation/navigationstore');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');

class WorkListDataHelper {

    /**
     * Method to invoke the calls to fetch the related data for the:
     * (i) QIG Selected from the QIG Selector list (OR)
     * (ii) QIG Remembered from the User Options
     */
    public fetchRelatedDataForQIGAfterMarkSchemeStructureAndCC = (isInTeamManagement: boolean) => {
        let workListType: enums.WorklistType;
        let remarkRequestTypeID: enums.RemarkRequestType;
        if (qigStore.instance.selectedQIGForMarkerOperation) {
            /* Default response mode */
            let responseMode = workListStore.instance.getResponseMode ?
                workListStore.instance.getResponseMode : enums.ResponseMode.open;
            let msgId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            let erId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
            let qpId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            let currentTarget: markingTargetSummary = targetSummaryStore.instance.getCurrentTarget();
            let examinerQigStatus: enums.ExaminerQIGStatus = targetHelper.getExaminerQigStatus();
            let isElectronicStandardisationTeamMember =
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;

            // If live marking is completed and the marker has open response in other worklist, then navigate to the correspoding worklist.
            if ((examinerQigStatus === enums.ExaminerQIGStatus.LiveComplete
                || examinerQigStatus === enums.ExaminerQIGStatus.OverAllTargetCompleted)
                && currentTarget.examinerProgress.openResponsesCount === 0) {
                let _markingTargetsSummary: Immutable.List<markingTargetSummary> =
                    targetSummaryStore.instance.getExaminerMarkingTargetProgress();
                _markingTargetsSummary.findEntry((markingTarget: markingTargetSummary) => {
                    if (markingTarget.examinerProgress.openResponsesCount > 0) {
                        if (markingTarget.markingModeID === enums.MarkingMode.LiveMarking) {
                            workListType = enums.WorklistType.live;
                            return true;
                        } else if (markingTarget.markingModeID === enums.MarkingMode.Remarking
                            && markingTarget.examinerProgress.isDirectedRemark === true) {
                            if (!workListStore.instance.currentWorklistType ||
                                workListStore.instance.currentWorklistType as enums.WorklistType === enums.WorklistType.none) {
                                workListType = enums.WorklistType.directedRemark;
                                remarkRequestTypeID = !workListStore.instance.getRemarkRequestType
                                    || workListStore.instance.getRemarkRequestType as enums.RemarkRequestType ===
                                    enums.RemarkRequestType.Unknown ?
                                    markingTarget.remarkRequestTypeID : workListStore.instance.getRemarkRequestType;
                            } else {
                                workListType = workListStore.instance.currentWorklistType;
                            }
                            return true;
                        } else if (markingTarget.examinerProgress.atypicalOpenResponsesCount > 0) {
                            workListType = enums.WorklistType.atypical;
                            return true;
                        }
                    }
                });
            }

            // Check for selected worklist type is disabled.
            let _markingTargetsSummary: Immutable.List<markingTargetSummary> =
                targetSummaryStore.instance.getExaminerMarkingTargetProgress();
            let isTargetDisabled: boolean = this.isSelectedWorklistTypeDisabled(_markingTargetsSummary);
            // If worklist type is set in the store, then fetch data related to the worklist type
            // else get data based on marking mode
            if (workListType === undefined) {
                if (workListStore.instance.currentWorklistType !== undefined &&
                    workListStore.instance.currentWorklistType !== enums.WorklistType.none && !isTargetDisabled) {
                    workListType = workListStore.instance.currentWorklistType;
                } else {
                    workListType = allocateResponseHelper.getWorkListTypeByMarkingMode(targetHelper.getSelectedQigMarkingMode());
                }
            }
            let isCurrentlySelectedWorklistIsLive: boolean = this.isLiveWorklist(workListType);
            let remarkRequestType: enums.RemarkRequestType = (remarkRequestTypeID ===
                (enums.RemarkRequestType.Unknown || undefined)) ? this.getRemarkRequestType(workListType) : remarkRequestTypeID;

            let isDirectedRemark: boolean = (remarkRequestTypeID ===
                (enums.RemarkRequestType.Unknown || undefined)) ? this.getIsDirectedRemarkRequestType(workListType) : false;

            if (allocateResponseHelper.isAllocationNeeded() === false || isCurrentlySelectedWorklistIsLive === true) {

                responseMode = targetSummaryStore.instance.getCurrentResponseMode
                    (targetHelper.getMarkingModeByWorklistType(workListType), workListType, currentTarget.markingModeID);

                /* Call to get response details to show in worklist */
                responseMode = markerOperationModeFactory.operationMode.responseModeBasedOnQualityFeedbackForQigSelector(responseMode,
                    targetHelper.getMarkingModeByWorklistType(workListType), remarkRequestType);

                /* Submitted second standardisation response is not visible in the closed work list while navigating via Menu panel.
                   When we approved the examiner manually.
                   When an examiner is in the Approved Review state and he has also completed the standardization target.
                   But the response not visible in the closed work list while navigating via the menu panel.
                   So set the response mode as 'closed' to show the closed work list while navigating via the menu panel.
                */
                if (navigationStore.instance.isFromMenu &&
                    (qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus === enums.ExaminerApproval.Approved ||
                     qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus === enums.ExaminerApproval.ApprovedReview)
                    && (workListType === enums.WorklistType.secondstandardisation || workListType === enums.WorklistType.standardisation)
                    && currentTarget.markingModeID === enums.MarkingMode.LiveMarking) {
                    responseMode = enums.ResponseMode.closed;
                }

                let useCache: boolean = workListStore.instance.getIsResponseClose === true && !markingStore.instance.isMarksSavedToDb
                    && !workListStore.instance.isMessageStatusChanged && !workListStore.instance.isExceptionStatusChanged
                    && !isInTeamManagement;
                    let hasComplexOptionality = configurableCharacteristicsHelper.getCharacteristicValue(
                    configurableCharacteristicsNames.ComplexOptionality,
                    markingStore.instance.selectedQIGMarkSchemeGroupId).toLowerCase() === 'true' ? true : false;
                worklistActioncreator.notifyWorklistTypeChange
                    (msgId,
                    erId,
                    qpId,
                    workListType,
                    responseMode,
                    remarkRequestType,
                    isDirectedRemark,
                    isElectronicStandardisationTeamMember,
                    useCache,
                    false,
                    hasComplexOptionality);

            } else if (isCurrentlySelectedWorklistIsLive === false) {

                if (!isInTeamManagement) {
                    /* Allocate the practise/standardisation / directed remark responses */
                    allocateResponseHelper.allocateQualificationResponses();
                } else {
                    /* If marker in TeamManagement drill-down view then we don't need to perform automatic allocation, so we just
                    load the worklist with empty grid */
                    responseMode = targetSummaryStore.instance.getCurrentResponseMode
                        (targetHelper.getMarkingModeByWorklistType(workListType), workListType, currentTarget.markingModeID);
                    worklistActioncreator.notifyWorklistTypeChange(msgId, erId, qpId, workListType, responseMode, remarkRequestType,
                        isDirectedRemark, isElectronicStandardisationTeamMember, false);
                }
            }

            /* checking whether this call is triggered by response close or not */
            if (workListStore.instance.getIsResponseClose) {
                responseMode = workListStore.instance.getResponseMode;
                /* reseting the isResponseClose flag after getting the selected response mode */
                worklistActioncreator.responseClosed(false);
            }
        }
    };

    /**
     * Check's if worklist is live
     * @param worklistType
     */
    private isLiveWorklist(worklistType: enums.WorklistType) {
        let _isLiveWorklist: boolean = false;

        let markingMode: enums.MarkingMode = targetHelper.getWorklistTargetToBeSelected(worklistType);

        switch (markingMode) {
            case enums.MarkingMode.LiveMarking:
                _isLiveWorklist = true;
                break;
        }

        return _isLiveWorklist;
    }

    /**
     * Get remark request type
     * @param worklistType
     */
    private getRemarkRequestType(worklistType: enums.WorklistType): enums.RemarkRequestType {
        return worklistType === enums.WorklistType.directedRemark || worklistType === enums.WorklistType.pooledRemark ?
            workListStore.instance.getRemarkRequestType : enums.RemarkRequestType.Unknown;
    }

    /**
     * Get is directed remark or not
     * @param worklistType
     */
    private getIsDirectedRemarkRequestType(worklistType: enums.WorklistType): boolean {
        if (worklistType === enums.WorklistType.directedRemark) {
            return workListStore.instance.isDirectedRemark ? workListStore.instance.isDirectedRemark : true;
        }
        return false;
    }

    /**
     * Get selected worklist type disabled.
     */
    private isSelectedWorklistTypeDisabled = (markingTargetSummary: Immutable.List<markingTargetSummary>): boolean => {
        let isTargetDisabled: boolean = false;
        let markingModeByWorklistType: enums.MarkingMode =
            targetHelper.getMarkingModeByWorklistType(workListStore.instance.currentWorklistType);
        if (markingModeByWorklistType) {
            let targetByWorklistType: any =
                markingTargetSummary.filter(target => target.markingModeID === markingModeByWorklistType).first();
            isTargetDisabled = markerOperationModeFactory.operationMode.isTargetDisabled(targetByWorklistType, undefined);
        }
        return isTargetDisabled;
    }
}

let instance = new WorkListDataHelper();
export = instance;
