import enums = require('../enums');
import qigStore = require('../../../stores/qigselector/qigstore');
import busyIndicatorActionCreator = require('../../../actions/busyindicator/busyindicatoractioncreator');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
import workListStore = require('../../../stores/worklist/workliststore');
import examinerStore = require('../../../stores/markerinformation/examinerstore');

/**
 * Helper class
 */
class AllocateResponsesHelper {
    /**
     * On selecting a qiq if the marking limit is not equal to the total allocated responses count,
     * allocate the rest
     */
    public static allocateQualificationResponses() {
        if (AllocateResponsesHelper.isAllocationNeeded()) {
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.responseAllocation);
            responseActionCreator.allocateResponse(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                enums.WorklistType.live,
                true,
                qigStore.instance.selectedQIGForMarkerOperation.examSessionId,
                qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer,
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
                examinerStore.instance.getMarkerInformation.examinerId,
                false,
                false,
                enums.RemarkRequestType.Unknown,
                false,
                false);
        }
    }

    /**
     * returns whether allocation is needed based on the target
     * @returns true- if allocation need to done, else false
     */
    public static isAllocationNeeded(): boolean {
        let currentTarget = targetSummaryStore.instance.getCurrentTarget();
        if (currentTarget === undefined) {
            return false;
        }

        let currentMarkingMode: enums.MarkingMode = targetSummaryStore.instance.getCurrentMarkingMode();
        let maximumMarkingLimit: number = currentTarget.maximumMarkingLimit;
        let openResponseCount: number = currentTarget.examinerProgress.openResponsesCount
            + (isNaN(currentTarget.examinerProgress.atypicalOpenResponsesCount) ?
                0 : currentTarget.examinerProgress.atypicalOpenResponsesCount);
        let closedResponseCount: number = currentTarget.examinerProgress.closedResponsesCount;

        if ((currentMarkingMode === enums.MarkingMode.Practice ||
            currentMarkingMode === enums.MarkingMode.Approval ||
            currentMarkingMode === enums.MarkingMode.ES_TeamApproval) &&
            maximumMarkingLimit > (openResponseCount + closedResponseCount)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * returns the worklist type based on the marking mode
     */
    public static getWorkListTypeByMarkingMode(markingMode: number): any {
        let workListType: enums.WorklistType;

        /**
         * set the worklist type from  the marking mode
         */
        switch (markingMode) {
            case enums.MarkingMode.LiveMarking: workListType = (workListStore.instance.currentWorklistType === enums.WorklistType.atypical)
                ? enums.WorklistType.atypical : enums.WorklistType.live; break;
            case enums.MarkingMode.Practice: workListType = enums.WorklistType.practice; break;
            case enums.MarkingMode.Approval: workListType = enums.WorklistType.standardisation; break;
            case enums.MarkingMode.ES_TeamApproval: workListType = enums.WorklistType.secondstandardisation; break;
            case enums.MarkingMode.Remarking:
                if (workListStore.instance.isDirectedRemark) {
                    workListType = enums.WorklistType.directedRemark;
                } else {
                    workListType = enums.WorklistType.pooledRemark;
                }
                break;
            case enums.MarkingMode.Simulation: workListType = enums.WorklistType.simulation; break;
        }

        return workListType;
    }
}
export = AllocateResponsesHelper;