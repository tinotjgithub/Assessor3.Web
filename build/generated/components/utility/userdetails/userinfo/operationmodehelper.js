"use strict";
var worklistStore = require('../../../../stores/worklist/workliststore');
var userInfoStore = require('../../../../stores/userinfo/userinfostore');
var teamManagementStore = require('../../../../stores/teammanagement/teammanagementstore');
var qigStore = require('../../../../stores/qigselector/qigstore');
var enums = require('../../enums');
var OperationModeHelper = (function () {
    function OperationModeHelper() {
    }
    Object.defineProperty(OperationModeHelper, "markSchemeGroupId", {
        /**
         * Return the current markSchemeGroupId - If current operation mode is teammanagement then it will return the selected markSchemeGroupId
         */
        get: function () {
            if (this.isTeamManagementMode && teamManagementStore.instance.examinerDrillDownData) {
                return teamManagementStore.instance.selectedMarkSchemeGroupId;
            }
            else {
                return qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeHelper, "examinerRoleId", {
        /**
         * Return the examiner roleId - If current operation mode is teammanagement then it will return the selected examiners roleId
         */
        get: function () {
            if (this.isTeamManagementMode && teamManagementStore.instance.examinerDrillDownData) {
                return teamManagementStore.instance.examinerDrillDownData.examinerRoleId;
            }
            else {
                return qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeHelper, "authorisedExaminerRoleId", {
        /**
         * Returns the examiner roleId of the authorised user
         */
        get: function () {
            return teamManagementStore.instance.selectedExaminerRoleId ? teamManagementStore.instance.selectedExaminerRoleId :
                qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeHelper, "subExaminerId", {
        /**
         * Return the sub examinerId - If current operation mode is teammanagement then it will return the selected examinerId
         */
        get: function () {
            var examinerId;
            if (this.isTeamManagementMode && teamManagementStore.instance.examinerDrillDownData) {
                examinerId = teamManagementStore.instance.examinerDrillDownData.examinerId;
            }
            else if (this.isTeamManagementMode && teamManagementStore.instance.selectedException) {
                examinerId = teamManagementStore.instance.selectedException.originatorExaminerId;
            }
            return examinerId;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the selected Response mode
     */
    OperationModeHelper.getSelectedResponseMode = function (markingMode, remarkRequestTypeId, worklistType, isSelectedExaminerSTM) {
        // Only Closed tabs are displaying while Help examiners mode.
        if (OperationModeHelper.isTeamManagementMode &&
            teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) {
            return enums.ResponseMode.closed;
        }
        var selectedResponseMode = enums.ResponseMode.open;
        var currentMarkingTarget;
        var closedResponsesCount;
        var pendingResponsesCount;
        // finding current marking target from marking mode and remark request typeId
        if (markingMode) {
            remarkRequestTypeId = remarkRequestTypeId ? remarkRequestTypeId : 0;
            currentMarkingTarget =
                qigStore.instance.selectedQIGForMarkerOperation.markingTargets.filter(function (x) {
                    return x.markingMode === markingMode && x.remarkRequestType === remarkRequestTypeId;
                });
        }
        else {
            currentMarkingTarget = qigStore.instance.selectedQIGForMarkerOperation.currentMarkingTarget;
        }
        // As per the requirement if any responses are available in closed then we have to select the closed tab and if no closed responses
        // and response(s) are available in submitted closed then we have to select the grace period tab.
        if (currentMarkingTarget.length > 0) {
            var atypicalClosedResponsesCount = 0;
            var atypicalPendingResponsesCount = 0;
            // Find atypical response counts
            var markingTargetsSummary = worklistStore.instance.getExaminerMarkingTargetProgress(isSelectedExaminerSTM);
            if (markingTargetsSummary) {
                var livemarkingTargetSummary = markingTargetsSummary.filter(function (x) {
                    return x.markingModeID === enums.MarkingMode.LiveMarking;
                }).first();
                if (livemarkingTargetSummary) {
                    // find counts only if the marker has live target
                    atypicalClosedResponsesCount = livemarkingTargetSummary.examinerProgress.atypicalClosedResponsesCount;
                    atypicalPendingResponsesCount = livemarkingTargetSummary.examinerProgress.atypicalPendingResponsesCount;
                }
            }
            if (worklistType === enums.WorklistType.atypical) {
                closedResponsesCount = atypicalClosedResponsesCount;
                pendingResponsesCount = atypicalPendingResponsesCount;
            }
            else if (worklistType === enums.WorklistType.live || worklistType === undefined) {
                // In the Inital loading of a subordinate's worklist in Teammanagement, worklistType is not specified.
                // In Live worklist, atyipical response count also included. 
                closedResponsesCount = currentMarkingTarget[0].closedResponsesCount - atypicalClosedResponsesCount;
                pendingResponsesCount = currentMarkingTarget[0].pendingResponsesCount - atypicalPendingResponsesCount;
            }
            else {
                closedResponsesCount = currentMarkingTarget[0].closedResponsesCount;
                pendingResponsesCount = currentMarkingTarget[0].pendingResponsesCount;
            }
            if (closedResponsesCount > 0) {
                selectedResponseMode = enums.ResponseMode.closed;
            }
            else if (pendingResponsesCount > 0) {
                selectedResponseMode = enums.ResponseMode.pending;
            }
        }
        return selectedResponseMode;
    };
    Object.defineProperty(OperationModeHelper, "isHelpExaminersView", {
        /**
         * Get the value for checking help examiners
         */
        get: function () {
            return OperationModeHelper.isTeamManagementMode &&
                teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModeHelper, "isTeamManagementMode", {
        /**
         * Return true if current operation mode is TeamManagement
         * Use marker operation mode factory for operation mode switching logic
         */
        get: function () {
            return userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement;
        },
        enumerable: true,
        configurable: true
    });
    return OperationModeHelper;
}());
module.exports = OperationModeHelper;
//# sourceMappingURL=operationmodehelper.js.map