"use strict";
var enums = require('../../components/utility/enums');
var qigStore = require('../../stores/qigselector/qigstore');
var examinerStore = require('../../stores/markerinformation/examinerstore');
var markingStore = require('../../stores/marking/markingstore');
var worklistStore = require('../../stores/worklist/workliststore');
var submitStore = require('../../stores/submit/submitstore');
var worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
var markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
var QualityFeedbackHelper = (function () {
    function QualityFeedbackHelper() {
    }
    /**
     * Checks whethher the worklist is disabled based on quality feedback.
     * @param {enums.WorklistType} worklistType
     * @param {enums.RemarkRequestType} remarkRequetType
     * @returns
     */
    QualityFeedbackHelper.isWorklistDisabledBasedOnQualityFeedback = function (worklistType, remarkRequetType) {
        return markerOperationModeFactory.operationMode.isWorklistDisabledBasedOnQualityFeedback(worklistType, remarkRequetType);
    };
    /**
     * Method which returns if the response navigation is blocked due to Quality Feedback Outstanding status
     */
    QualityFeedbackHelper.isResponseNavigationBlocked = function () {
        // If team management, navigation should not block.
        return markerOperationModeFactory.operationMode.isResponseNavigationBlocked(QualityFeedbackHelper.isQualityFeedbackPossibleInWorklist(worklistStore.instance.currentWorklistType));
    };
    /**
     * Method which returns if the Quality Feedback is possible in the specified worklist
     * @param worklistType
     */
    QualityFeedbackHelper.isQualityFeedbackPossibleInWorklist = function (worklistType) {
        switch (worklistType) {
            case enums.WorklistType.live:
            case enums.WorklistType.directedRemark:
                return true;
            default:
                return false;
        }
    };
    /**
     * indicates whether the quality feedback message needs to be displayed
     * @param {enums.WorklistType} worklistType
     * @returns
     */
    QualityFeedbackHelper.isQualtiyHelperMessageNeededToBeDisplayed = function (worklistType) {
        // If team management, Qualtiy Feedback activities should be restricted.
        return markerOperationModeFactory.operationMode.isQualtiyHelperMessageNeededToBeDisplayed(worklistType);
    };
    /**
     * get the response mode based on quality feedback
     * @returns
     */
    QualityFeedbackHelper.getResponseModeBasedOnQualityFeedback = function () {
        if (markerOperationModeFactory.operationMode.isExaminerHasQualityFeedback && !worklistStore.instance.isMarkingCheckMode) {
            if (markerOperationModeFactory.operationMode.isAutomaticQualityFeedbackCCOn) {
                return enums.ResponseMode.closed;
            }
            else {
                return enums.ResponseMode.pending;
            }
        }
        else {
            return undefined;
        }
    };
    /**
     * checks whether the tab is disabled based on quality feedback
     * @param {enums.ResponseMode} tabBasedOnQualityFeedback
     * @param {enums.ResponseMode} currentTab
     * @returns
     */
    QualityFeedbackHelper.isTabDisabledBasedOnQualityFeedback = function (tabBasedOnQualityFeedback, currentTab) {
        return markerOperationModeFactory.operationMode.isTabDisabledBasedOnQualityFeedback(tabBasedOnQualityFeedback, currentTab);
    };
    /**
     * Checks whether the seed needs to be highlighted or not
     * @param {enums.QualityFeedbackStatus} qualityFeedBackStatus
     * @param {boolean} isSeedResponse
     * @returns
     */
    QualityFeedbackHelper.isSeedNeededToBeHighlighted = function (qualityFeedBackStatus, isSeedResponse) {
        return markerOperationModeFactory.operationMode.isSeedNeededToBeHighlighted(qualityFeedBackStatus, isSeedResponse);
    };
    /**
     * Gets the quality feedback status message
     * @returns
     */
    QualityFeedbackHelper.getQualityFeedbackStatusMessage = function () {
        if (examinerStore.instance.getMarkerInformation.approvalStatus !== enums.ExaminerApproval.Suspended) {
            return 'marking.worklist.quality-feedback-helper.quality-feedback-outstanding';
        }
        else {
            return 'marking.worklist.quality-feedback-helper.quality-feedback-outstanding-and-suspended';
        }
    };
    /**
     * Force the navigation to worklist
     * @param {boolean} considerQualityFeedback
     */
    QualityFeedbackHelper.forceNavigationToWorklist = function (considerQualityFeedback) {
        // If Marker got withdrawn during the actions. Skip the activities.
        if (qigStore.instance.selectedQIGForMarkerOperation === undefined) {
            return;
        }
        var responseMode = considerQualityFeedback ?
            QualityFeedbackHelper.getResponseModeBasedOnQualityFeedback() : enums.ResponseMode.open;
        var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        var examinerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        var questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
        var workListType = worklistStore.instance.currentWorklistType;
        var remarkRequestType = worklistStore.instance.getRemarkRequestType;
        var isDirectedRemark = worklistStore.instance.isDirectedRemark;
        var isElectronicStandardisationTeamMember = qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;
        if ((submitStore.instance.getCurrentWorklistType === enums.WorklistType.standardisation
            || submitStore.instance.getCurrentWorklistType === enums.WorklistType.secondstandardisation)) {
            if (submitStore.instance.getSubmitResponseReturn.examinerApprovalStatus === enums.ExaminerApproval.Approved) {
                // Marker Got Approved during submission. Message is displayed from worklist component helper.
                // Set The new worklist type as Live and navigate
                workListType = enums.WorklistType.live;
            }
        }
        worklistActionCreator.notifyWorklistTypeChange(markSchemeGroupId, examinerRoleId, questionPaperPartId, workListType, responseMode, remarkRequestType, isDirectedRemark, isElectronicStandardisationTeamMember, worklistStore.instance.getIsResponseClose && !markingStore.instance.isMarksSavedToDb);
    };
    return QualityFeedbackHelper;
}());
module.exports = QualityFeedbackHelper;
//# sourceMappingURL=qualityfeedbackhelper.js.map