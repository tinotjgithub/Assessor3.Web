"use strict";
var enums = require('../../components/utility/enums');
var qigStore = require('../../stores/qigselector/qigstore');
var workListStore = require('../../stores/worklist/workliststore');
var targetSummaryStore = require('../../stores/worklist/targetsummarystore');
var targetHelper = require('../../utility/target/targethelper');
var allocateResponseHelper = require('../../components/utility/responseallocation/allocateresponseshelper');
var markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
var markingStore = require('../../stores/marking/markingstore');
var worklistActioncreator = require('../../actions/worklist/worklistactioncreator');
var navigationStore = require('../../stores/navigation/navigationstore');
var WorkListDataHelper = (function () {
    function WorkListDataHelper() {
        var _this = this;
        /**
         * Method to invoke the calls to fetch the related data for the:
         * (i) QIG Selected from the QIG Selector list (OR)
         * (ii) QIG Remembered from the User Options
         */
        this.fetchRelatedDataForQIGAfterMarkSchemeStructureAndCC = function (isInTeamManagement) {
            var workListType;
            var remarkRequestTypeID;
            if (qigStore.instance.selectedQIGForMarkerOperation) {
                /* Default response mode */
                var responseMode = workListStore.instance.getResponseMode ?
                    workListStore.instance.getResponseMode : enums.ResponseMode.open;
                var msgId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
                var erId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
                var qpId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
                var currentTarget = targetSummaryStore.instance.getCurrentTarget();
                var examinerQigStatus = targetHelper.getExaminerQigStatus();
                var isElectronicStandardisationTeamMember = qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;
                // If live marking is completed and the marker has open response in other worklist, then navigate to the correspoding worklist.
                if ((examinerQigStatus === enums.ExaminerQIGStatus.LiveComplete
                    || examinerQigStatus === enums.ExaminerQIGStatus.OverAllTargetCompleted)
                    && currentTarget.examinerProgress.openResponsesCount === 0) {
                    var _markingTargetsSummary_1 = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
                    _markingTargetsSummary_1.findEntry(function (markingTarget) {
                        if (markingTarget.examinerProgress.openResponsesCount > 0) {
                            if (markingTarget.markingModeID === enums.MarkingMode.LiveMarking) {
                                workListType = enums.WorklistType.live;
                                return true;
                            }
                            else if (markingTarget.markingModeID === enums.MarkingMode.Remarking
                                && markingTarget.examinerProgress.isDirectedRemark === true) {
                                if (!workListStore.instance.currentWorklistType ||
                                    workListStore.instance.currentWorklistType === enums.WorklistType.none) {
                                    workListType = enums.WorklistType.directedRemark;
                                    remarkRequestTypeID = !workListStore.instance.getRemarkRequestType
                                        || workListStore.instance.getRemarkRequestType ===
                                            enums.RemarkRequestType.Unknown ?
                                        markingTarget.remarkRequestTypeID : workListStore.instance.getRemarkRequestType;
                                }
                                else {
                                    workListType = workListStore.instance.currentWorklistType;
                                }
                                return true;
                            }
                            else if (markingTarget.examinerProgress.atypicalOpenResponsesCount > 0) {
                                workListType = enums.WorklistType.atypical;
                                return true;
                            }
                        }
                    });
                }
                // Check for selected worklist type is disabled.
                var _markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();
                var isTargetDisabled = _this.isSelectedWorklistTypeDisabled(_markingTargetsSummary);
                // If worklist type is set in the store, then fetch data related to the worklist type
                // else get data based on marking mode
                if (workListType === undefined) {
                    if (workListStore.instance.currentWorklistType !== undefined &&
                        workListStore.instance.currentWorklistType !== enums.WorklistType.none && !isTargetDisabled) {
                        workListType = workListStore.instance.currentWorklistType;
                    }
                    else {
                        workListType = allocateResponseHelper.getWorkListTypeByMarkingMode(targetHelper.getSelectedQigMarkingMode());
                    }
                }
                var isCurrentlySelectedWorklistIsLive = _this.isLiveWorklist(workListType);
                var remarkRequestType = (remarkRequestTypeID ===
                    (enums.RemarkRequestType.Unknown || undefined)) ? _this.getRemarkRequestType(workListType) : remarkRequestTypeID;
                var isDirectedRemark = (remarkRequestTypeID ===
                    (enums.RemarkRequestType.Unknown || undefined)) ? _this.getIsDirectedRemarkRequestType(workListType) : false;
                if (allocateResponseHelper.isAllocationNeeded() === false || isCurrentlySelectedWorklistIsLive === true) {
                    responseMode = targetSummaryStore.instance.getCurrentResponseMode(targetHelper.getMarkingModeByWorklistType(workListType), workListType, currentTarget.markingModeID);
                    /* Call to get response details to show in worklist */
                    responseMode = markerOperationModeFactory.operationMode.responseModeBasedOnQualityFeedbackForQigSelector(responseMode, targetHelper.getMarkingModeByWorklistType(workListType), remarkRequestType);
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
                    var useCache = workListStore.instance.getIsResponseClose === true && !markingStore.instance.isMarksSavedToDb
                        && !workListStore.instance.isMessageStatusChanged && !workListStore.instance.isExceptionStatusChanged
                        && !isInTeamManagement;
                    worklistActioncreator.notifyWorklistTypeChange(msgId, erId, qpId, workListType, responseMode, remarkRequestType, isDirectedRemark, isElectronicStandardisationTeamMember, useCache);
                }
                else if (isCurrentlySelectedWorklistIsLive === false) {
                    if (!isInTeamManagement) {
                        /* Allocate the practise/standardisation / directed remark responses */
                        allocateResponseHelper.allocateQualificationResponses();
                    }
                    else {
                        /* If marker in TeamManagement drill-down view then we don't need to perform automatic allocation, so we just
                        load the worklist with empty grid */
                        responseMode = targetSummaryStore.instance.getCurrentResponseMode(targetHelper.getMarkingModeByWorklistType(workListType), workListType, currentTarget.markingModeID);
                        worklistActioncreator.notifyWorklistTypeChange(msgId, erId, qpId, workListType, responseMode, remarkRequestType, isDirectedRemark, isElectronicStandardisationTeamMember, false);
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
         * Get selected worklist type disabled.
         */
        this.isSelectedWorklistTypeDisabled = function (markingTargetSummary) {
            var isTargetDisabled = false;
            var markingModeByWorklistType = targetHelper.getMarkingModeByWorklistType(workListStore.instance.currentWorklistType);
            if (markingModeByWorklistType) {
                var targetByWorklistType = markingTargetSummary.filter(function (target) { return target.markingModeID === markingModeByWorklistType; }).first();
                isTargetDisabled = markerOperationModeFactory.operationMode.isTargetDisabled(targetByWorklistType, undefined);
            }
            return isTargetDisabled;
        };
    }
    /**
     * Check's if worklist is live
     * @param worklistType
     */
    WorkListDataHelper.prototype.isLiveWorklist = function (worklistType) {
        var _isLiveWorklist = false;
        var markingMode = targetHelper.getWorklistTargetToBeSelected(worklistType);
        switch (markingMode) {
            case enums.MarkingMode.LiveMarking:
                _isLiveWorklist = true;
                break;
        }
        return _isLiveWorklist;
    };
    /**
     * Get remark request type
     * @param worklistType
     */
    WorkListDataHelper.prototype.getRemarkRequestType = function (worklistType) {
        return worklistType === enums.WorklistType.directedRemark || worklistType === enums.WorklistType.pooledRemark ?
            workListStore.instance.getRemarkRequestType : enums.RemarkRequestType.Unknown;
    };
    /**
     * Get is directed remark or not
     * @param worklistType
     */
    WorkListDataHelper.prototype.getIsDirectedRemarkRequestType = function (worklistType) {
        if (worklistType === enums.WorklistType.directedRemark) {
            return workListStore.instance.isDirectedRemark ? workListStore.instance.isDirectedRemark : true;
        }
        return false;
    };
    return WorkListDataHelper;
}());
var instance = new WorkListDataHelper();
module.exports = instance;
//# sourceMappingURL=worklistdatahelper.js.map