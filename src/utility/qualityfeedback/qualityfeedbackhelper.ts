import enums = require('../../components/utility/enums');
import qigStore = require('../../stores/qigselector/qigstore');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import configurableCharacteristicsHelper = require('../configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../configurablecharacteristic/configurablecharacteristicsnames');
import markingStore = require('../../stores/marking/markingstore');
import worklistStore = require('../../stores/worklist/workliststore');
import submitStore = require('../../stores/submit/submitstore');
import worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
import markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');

class QualityFeedbackHelper {

    /**
     * Checks whethher the worklist is disabled based on quality feedback.
     * @param {enums.WorklistType} worklistType
     * @param {enums.RemarkRequestType} remarkRequetType
     * @returns
     */
    public static isWorklistDisabledBasedOnQualityFeedback(worklistType: enums.WorklistType, remarkRequetType: enums.RemarkRequestType)
        : boolean {
        return markerOperationModeFactory.operationMode.isWorklistDisabledBasedOnQualityFeedback(worklistType, remarkRequetType);

    }

    /**
     * Method which returns if the response navigation is blocked due to Quality Feedback Outstanding status
     */
    public static isResponseNavigationBlocked(): boolean {
        // If team management, navigation should not block.
        return markerOperationModeFactory.operationMode.isResponseNavigationBlocked(
            QualityFeedbackHelper.isQualityFeedbackPossibleInWorklist(worklistStore.instance.currentWorklistType));
    }

    /**
     * Method which returns if the Quality Feedback is possible in the specified worklist
     * @param worklistType
     */
    private static isQualityFeedbackPossibleInWorklist(worklistType: enums.WorklistType): boolean {

        switch (worklistType) {
            case enums.WorklistType.live:
            case enums.WorklistType.directedRemark:
                return true;
            default:
                return false;
        }
    }

    /**
     * indicates whether the quality feedback message needs to be displayed
     * @param {enums.WorklistType} worklistType
     * @returns
     */
    public static isQualtiyHelperMessageNeededToBeDisplayed(worklistType: enums.WorklistType): boolean {
        // If team management, Qualtiy Feedback activities should be restricted.
        return markerOperationModeFactory.operationMode.isQualtiyHelperMessageNeededToBeDisplayed(worklistType);
    }

    /**
     * get the response mode based on quality feedback
     * @returns
     */
    public static getResponseModeBasedOnQualityFeedback(): enums.ResponseMode {
        if (markerOperationModeFactory.operationMode.isExaminerHasQualityFeedback && !worklistStore.instance.isMarkingCheckMode) {
            if (markerOperationModeFactory.operationMode.isAutomaticQualityFeedbackCCOn) {
                return enums.ResponseMode.closed;
            } else {
                return enums.ResponseMode.pending;
            }
        } else {
            return undefined;
        }
    }

    /**
     * checks whether the tab is disabled based on quality feedback
     * @param {enums.ResponseMode} tabBasedOnQualityFeedback
     * @param {enums.ResponseMode} currentTab
     * @returns
     */
    public static isTabDisabledBasedOnQualityFeedback(tabBasedOnQualityFeedback: enums.ResponseMode,
        currentTab: enums.ResponseMode): boolean {
        return markerOperationModeFactory.operationMode.isTabDisabledBasedOnQualityFeedback(tabBasedOnQualityFeedback, currentTab);
    }

    /**
     * Checks whether the seed needs to be highlighted or not
     * @param {enums.QualityFeedbackStatus} qualityFeedBackStatus
     * @param {boolean} isSeedResponse
     * @returns
     */
    public static isSeedNeededToBeHighlighted(qualityFeedBackStatus: enums.QualityFeedbackStatus, isSeedResponse: boolean): boolean {
        return markerOperationModeFactory.operationMode.isSeedNeededToBeHighlighted(qualityFeedBackStatus, isSeedResponse);
    }

    /**
     * Gets the quality feedback status message
     * @returns
     */
    public static getQualityFeedbackStatusMessage(): string {

        if (examinerStore.instance.getMarkerInformation.approvalStatus !== enums.ExaminerApproval.Suspended) {
            return 'marking.worklist.quality-feedback-helper.quality-feedback-outstanding';
        } else {
            return 'marking.worklist.quality-feedback-helper.quality-feedback-outstanding-and-suspended';
        }
    }

    /**
     * Force the navigation to worklist
     * @param {boolean} considerQualityFeedback
     */
    public static forceNavigationToWorklist(considerQualityFeedback: boolean) {
        // If Marker got withdrawn during the actions. Skip the activities.
        if (qigStore.instance.selectedQIGForMarkerOperation === undefined) {
            return;
        }

        let responseMode = considerQualityFeedback ?
            QualityFeedbackHelper.getResponseModeBasedOnQualityFeedback() : enums.ResponseMode.open;
        let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        let examinerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        let questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
        let workListType: enums.WorklistType = worklistStore.instance.currentWorklistType;
        let remarkRequestType: enums.RemarkRequestType = worklistStore.instance.getRemarkRequestType;
        let isDirectedRemark: boolean = worklistStore.instance.isDirectedRemark;
        let isElectronicStandardisationTeamMember =
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;

        if ((submitStore.instance.getCurrentWorklistType === enums.WorklistType.standardisation
            || submitStore.instance.getCurrentWorklistType === enums.WorklistType.secondstandardisation)) {
            if (submitStore.instance.getSubmitResponseReturn.examinerApprovalStatus === enums.ExaminerApproval.Approved) {
                // Marker Got Approved during submission. Message is displayed from worklist component helper.
                // Set The new worklist type as Live and navigate
                workListType = enums.WorklistType.live;
            }
        }

        worklistActionCreator.notifyWorklistTypeChange
            (markSchemeGroupId, examinerRoleId, questionPaperPartId, workListType, responseMode, remarkRequestType,
            isDirectedRemark,
            isElectronicStandardisationTeamMember,
            worklistStore.instance.getIsResponseClose && !markingStore.instance.isMarksSavedToDb);
    }
}

export = QualityFeedbackHelper;