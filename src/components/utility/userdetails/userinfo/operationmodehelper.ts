import worklistStore = require('../../../../stores/worklist/workliststore');
import markingTargetSummary = require('../../../../stores/worklist/typings/markingtargetsummary');
import userInfoStore = require('../../../../stores/userinfo/userinfostore');
import teamManagementStore = require('../../../../stores/teammanagement/teammanagementstore');
import qigStore = require('../../../../stores/qigselector/qigstore');
import markingTarget = require('../../../../stores/qigselector/typings/markingtarget');
import enums = require('../../enums');

class OperationModeHelper {

   /**
    * Return the current markSchemeGroupId - If current operation mode is teammanagement then it will return the selected markSchemeGroupId
    */
    public static get markSchemeGroupId(): number {
        if (this.isTeamManagementMode && teamManagementStore.instance.examinerDrillDownData) {
            return teamManagementStore.instance.selectedMarkSchemeGroupId;
        } else {
            return qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        }
    }

   /**
    * Return the examiner roleId - If current operation mode is teammanagement then it will return the selected examiners roleId
    */
    public static get examinerRoleId(): number {
        if (this.isTeamManagementMode && teamManagementStore.instance.examinerDrillDownData) {
            return teamManagementStore.instance.examinerDrillDownData.examinerRoleId;
        } else {
            return qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        }
    }

   /**
    * Returns the examiner roleId of the authorised user
    */
    public static get authorisedExaminerRoleId(): number {
        return teamManagementStore.instance.selectedExaminerRoleId ? teamManagementStore.instance.selectedExaminerRoleId :
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
    }

   /**
    * Return the sub examinerId - If current operation mode is teammanagement then it will return the selected examinerId
    */
    public static get subExaminerId(): number {
        let examinerId: number;
        if (this.isTeamManagementMode && teamManagementStore.instance.examinerDrillDownData) {
            examinerId = teamManagementStore.instance.examinerDrillDownData.examinerId;
        } else if (this.isTeamManagementMode && teamManagementStore.instance.selectedException) {
            examinerId = teamManagementStore.instance.selectedException.originatorExaminerId;
        }
        return examinerId;
    }

   /**
    * Returns the selected Response mode
    */
    public static getSelectedResponseMode(markingMode?: enums.MarkingMode,
        remarkRequestTypeId?: enums.RemarkRequestType,
        worklistType?: enums.WorklistType,
        isSelectedExaminerSTM?: boolean): enums.ResponseMode {
        // Only Closed tabs are displaying while Help examiners mode.
        if (OperationModeHelper.isTeamManagementMode &&
            teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) {
            return enums.ResponseMode.closed;
        }

        let selectedResponseMode: enums.ResponseMode = enums.ResponseMode.open;
        let currentMarkingTarget;
        let closedResponsesCount: number;
        let pendingResponsesCount: number;

        // finding current marking target from marking mode and remark request typeId
        if (markingMode) {
            remarkRequestTypeId = remarkRequestTypeId ? remarkRequestTypeId : 0;
            currentMarkingTarget =
                qigStore.instance.selectedQIGForMarkerOperation.markingTargets.filter((x: markingTarget) =>
                    x.markingMode === markingMode && x.remarkRequestType === remarkRequestTypeId);
        } else {
            currentMarkingTarget = qigStore.instance.selectedQIGForMarkerOperation.currentMarkingTarget;
        }

        // As per the requirement if any responses are available in closed then we have to select the closed tab and if no closed responses
        // and response(s) are available in submitted closed then we have to select the grace period tab.
		if (currentMarkingTarget.length > 0) {
			let atypicalClosedResponsesCount: number = 0;
			let atypicalPendingResponsesCount: number = 0;
			// Find atypical response counts
			let markingTargetsSummary: Immutable.List<markingTargetSummary> =
				worklistStore.instance.getExaminerMarkingTargetProgress(isSelectedExaminerSTM);
			if (markingTargetsSummary) {
				let livemarkingTargetSummary: markingTargetSummary = markingTargetsSummary.filter((x: markingTargetSummary) =>
                    x.markingModeID === enums.MarkingMode.LiveMarking).first();
                if (livemarkingTargetSummary) {
                    // find counts only if the marker has live target
                    atypicalClosedResponsesCount = livemarkingTargetSummary.examinerProgress.atypicalClosedResponsesCount;
                    atypicalPendingResponsesCount = livemarkingTargetSummary.examinerProgress.atypicalPendingResponsesCount;
                }
			}

			if (worklistType === enums.WorklistType.atypical) {
				closedResponsesCount = atypicalClosedResponsesCount;
				pendingResponsesCount = atypicalPendingResponsesCount;
			} else if (worklistType === enums.WorklistType.live || worklistType === undefined) {
				// In the Inital loading of a subordinate's worklist in Teammanagement, worklistType is not specified.
				// In Live worklist, atyipical response count also included. 
				closedResponsesCount = currentMarkingTarget[0].closedResponsesCount - atypicalClosedResponsesCount;
				pendingResponsesCount = currentMarkingTarget[0].pendingResponsesCount - atypicalPendingResponsesCount;
			}else {
				closedResponsesCount = currentMarkingTarget[0].closedResponsesCount;
				pendingResponsesCount = currentMarkingTarget[0].pendingResponsesCount;
            }

            if (closedResponsesCount > 0) {
                selectedResponseMode = enums.ResponseMode.closed;
            } else if (pendingResponsesCount > 0) {
                selectedResponseMode = enums.ResponseMode.pending;
            }
        }

        return selectedResponseMode;
    }

    /**
     * Get the value for checking help examiners
     */
    public static get isHelpExaminersView() {
        return OperationModeHelper.isTeamManagementMode &&
            teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers;
    }

   /**
    * Return true if current operation mode is TeamManagement
    * Use marker operation mode factory for operation mode switching logic
    */
    private static get isTeamManagementMode(): boolean {
        return userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement;
    }
}

export = OperationModeHelper;