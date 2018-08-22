"use strict";
var enums = require('../enums');
var qigStore = require('../../../stores/qigselector/qigstore');
var busyIndicatorActionCreator = require('../../../actions/busyindicator/busyindicatoractioncreator');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
var workListStore = require('../../../stores/worklist/workliststore');
var examinerStore = require('../../../stores/markerinformation/examinerstore');
/**
 * Helper class
 */
var AllocateResponsesHelper = (function () {
    function AllocateResponsesHelper() {
    }
    /**
     * On selecting a qiq if the marking limit is not equal to the total allocated responses count,
     * allocate the rest
     */
    AllocateResponsesHelper.allocateQualificationResponses = function () {
        if (AllocateResponsesHelper.isAllocationNeeded()) {
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.responseAllocation);
            responseActionCreator.allocateResponse(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, enums.WorklistType.live, true, qigStore.instance.selectedQIGForMarkerOperation.examSessionId, qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, examinerStore.instance.getMarkerInformation.examinerId, false, false, enums.RemarkRequestType.Unknown, false);
        }
    };
    /**
     * returns whether allocation is needed based on the target
     * @returns true- if allocation need to done, else false
     */
    AllocateResponsesHelper.isAllocationNeeded = function () {
        var currentTarget = targetSummaryStore.instance.getCurrentTarget();
        if (currentTarget === undefined) {
            return false;
        }
        var currentMarkingMode = targetSummaryStore.instance.getCurrentMarkingMode();
        var maximumMarkingLimit = currentTarget.maximumMarkingLimit;
        var openResponseCount = currentTarget.examinerProgress.openResponsesCount
            + (isNaN(currentTarget.examinerProgress.atypicalOpenResponsesCount) ?
                0 : currentTarget.examinerProgress.atypicalOpenResponsesCount);
        var closedResponseCount = currentTarget.examinerProgress.closedResponsesCount;
        if ((currentMarkingMode === enums.MarkingMode.Practice ||
            currentMarkingMode === enums.MarkingMode.Approval ||
            currentMarkingMode === enums.MarkingMode.ES_TeamApproval) &&
            maximumMarkingLimit > (openResponseCount + closedResponseCount)) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * returns the worklist type based on the marking mode
     */
    AllocateResponsesHelper.getWorkListTypeByMarkingMode = function (markingMode) {
        var workListType;
        /**
         * set the worklist type from  the marking mode
         */
        switch (markingMode) {
            case enums.MarkingMode.LiveMarking:
                workListType = (workListStore.instance.currentWorklistType === enums.WorklistType.atypical)
                    ? enums.WorklistType.atypical : enums.WorklistType.live;
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
                if (workListStore.instance.isDirectedRemark) {
                    workListType = enums.WorklistType.directedRemark;
                }
                else {
                    workListType = enums.WorklistType.pooledRemark;
                }
                break;
            case enums.MarkingMode.Simulation:
                workListType = enums.WorklistType.simulation;
                break;
        }
        return workListType;
    };
    return AllocateResponsesHelper;
}());
module.exports = AllocateResponsesHelper;
//# sourceMappingURL=allocateresponseshelper.js.map