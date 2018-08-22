"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var enums = require('../../components/utility/enums');
var teamManagementDataService = require('../../dataservices/teammanagement/teammanagementdataservice');
var Promise = require('es6-promise');
var base = require('../base/actioncreatorbase');
var myTeamDataFetchAction = require('./myteamdatafetchaction');
var expandOrCollapseNodeAction = require('./expandorcollapsenodeaction');
var openTeamManagementAction = require('./openteammanagementaction');
var leftPanelToggleAction = require('./leftpaneltoggleaction');
var updateExaminerDrillDownDataAction = require('./updateexaminerdrilldowndataaction');
var teamManagementTabSelectAction = require('./teammanagementtabselectaction');
var setAsReviewedAction = require('./setasreviewedaction');
var getUnActionedExceptionAction = require('./getunactionedexceptionaction');
var loginSession = require('../../app/loginsession');
var changeExaminerStatusAction = require('./changeexaminerstatusaction');
var changeExaminerStatusButtonBusyStatusUpdateAction = require('./changeexaminerstatusbuttonbusystatusupdateaction');
var provideSecondStandardisationAction = require('./providesecondstandardisationaction');
var changeStatusPopupVisibilityAction = require('./changestatuspopupvisibilityaction');
var helpExaminersDataFetchAction = require('./helpexaminersdatafetchaction');
var validateTeamManagementExaminerAction = require('./validateteammanagementexamineraction');
var getTeamOverviewDataAction = require('./getteamoverviewdataaction');
var executeApprovalManagementAction = require('./executeapprovalmanagementaction');
var canExecuteApprovalManagementAction = require('./canexecuteapprovalmanagementaction');
var selectedExceptionAction = require('./selectedexceptionaction');
var selectedExceptionResetAction = require('./selectedexceptionresetaction');
var teamManagementHistoryInfoAction = require('./teammanagementhistoryinfoaction');
var removeHistoryItemAction = require('../../actions/history/removehistoryitemaction');
var samplingStatusChangeAction = require('../../actions/sampling/samplingstatuschangeaction');
var warningMessageNavigationAction = require('./warningmessagenavigationaction');
var teamSortAction = require('./teamsortaction');
var browserOnlineStatusUpdationAction = require('../applicationoffline/browseronlinestatusupdationaction');
var actionInterruptedAction = require('../applicationoffline/actoninterruptedaction');
var qigSelectedFromMultiqigdropdownaction = require('./qigSelectedFromMultiQigDropDownAction');
var multiQigLockDataFetchAction = require('./multiqiglockdatafetchaction');
var updateMultiQigLockSelectionAction = require('./updatemultiqiglockselectionaction');
var multiLockDataResetAction = require('./multilockdataresetaction');
var multiQigLockResultAction = require('./multiqiglockresultaction');
/**
 * Team management action creator
 */
var TeamManagementActionCreator = (function (_super) {
    __extends(TeamManagementActionCreator, _super);
    function TeamManagementActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * fetches the my team grid data
     * @param {number} examinerRoleID
     * @param {number} markSchemeGroupId
     * @param {boolean} useCache
     */
    TeamManagementActionCreator.prototype.getMyTeamData = function (examinerRoleId, markSchemeGroupId, useCache, isFromHistory) {
        if (useCache === void 0) { useCache = true; }
        if (isFromHistory === void 0) { isFromHistory = false; }
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            teamManagementDataService.getMyTeamData(examinerRoleId, markSchemeGroupId, function (success, myTeamDataList, isResultFromCache) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(myTeamDataList, false, true, enums.WarningMessageAction.None, false, true)) {
                    if (!success) {
                        myTeamDataList = undefined;
                    }
                    dispatcher.dispatch(new myTeamDataFetchAction(success, myTeamDataList, isFromHistory));
                    resolve(myTeamDataList);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            }, useCache);
        });
    };
    /**
     * This method will return the team management overview counts
     *
     * @param {number} examinerRoleId
     * @param {number} markSchemeGroupId
     * @param {boolean} [useCache=true]
     * @param {boolean} [isFromRememberQig=false]
     * @param {boolean} [isHelpExaminersDataRefreshRequired=true]
     * @memberof TeamManagementActionCreator
     */
    TeamManagementActionCreator.prototype.getTeamManagementOverviewCounts = function (examinerRoleId, markSchemeGroupId, useCache, isFromRememberQig, isHelpExaminersDataRefreshRequired) {
        var _this = this;
        if (useCache === void 0) { useCache = true; }
        if (isFromRememberQig === void 0) { isFromRememberQig = false; }
        if (isHelpExaminersDataRefreshRequired === void 0) { isHelpExaminersDataRefreshRequired = true; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            var that = _this;
            teamManagementDataService.getTeamManagementOverviewCounts(examinerRoleId, markSchemeGroupId, function (success, teamoverviewdetails, isResultFromCache) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(teamoverviewdetails, false, true)) {
                    if (!success) {
                        teamoverviewdetails = undefined;
                    }
                    dispatcher.dispatch(new getTeamOverviewDataAction(true, markSchemeGroupId, examinerRoleId, teamoverviewdetails, isFromRememberQig, isHelpExaminersDataRefreshRequired));
                }
            }, useCache);
        }).catch();
    };
    /**
     * Collapse or Expand a examiner node
     * @param examinerRoleId
     * @param isExpanded
     */
    TeamManagementActionCreator.prototype.expandOrCollapseExaminerNode = function (examinerRoleId, isExpanded) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new expandOrCollapseNodeAction(examinerRoleId, isExpanded));
        }).catch();
    };
    /**
     * Open Team Management
     * @param examinerRoleId
     * @param markSchemeGroupId
     * @param isFromHistoryItem
     */
    TeamManagementActionCreator.prototype.openTeamManagement = function (examinerRoleId, markSchemeGroupId, isFromHistoryItem, emitEvent, isFromMultiQigDropDown) {
        if (isFromMultiQigDropDown === void 0) { isFromMultiQigDropDown = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new openTeamManagementAction(examinerRoleId, markSchemeGroupId, isFromHistoryItem, emitEvent, isFromMultiQigDropDown));
        }).catch();
    };
    /**
     * Saves the state of the team management left panel for the session
     * @param isLeftPanelCollapsed indicates whether the panel is collapsed or not
     */
    TeamManagementActionCreator.prototype.leftPanelToggleSave = function (isLeftPanelCollapsed) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new leftPanelToggleAction(isLeftPanelCollapsed));
        }).catch();
    };
    /**
     * Save the examiner drill down data in team management store
     * @param examinerDrillDownData
     * @param isFromHistory
     */
    TeamManagementActionCreator.prototype.updateExaminerDrillDownData = function (examinerDrillDownData, isFromHistory) {
        if (isFromHistory === void 0) { isFromHistory = false; }
        return new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateExaminerDrillDownDataAction(examinerDrillDownData, isFromHistory));
        }).catch();
    };
    /**
     * change examiner status.
     * @param args
     */
    TeamManagementActionCreator.prototype.changeExaminerStatus = function (args) {
        var that = this;
        teamManagementDataService.changeExaminerStatus(args, function (success, examinerStatusReturn) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(examinerStatusReturn, false, true, enums.WarningMessageAction.ChangeExaminerStatus)) {
                dispatcher.dispatch(new changeExaminerStatusAction(success, examinerStatusReturn));
            }
        });
    };
    /**
     * provide second standardisation.
     * @param args
     */
    TeamManagementActionCreator.prototype.provideSecondStandardisation = function (args) {
        var that = this;
        teamManagementDataService.provideSecondStandardisation(args, function (success, secondStandardisationReturn) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(secondStandardisationReturn, false, true, enums.WarningMessageAction.ChangeExaminerStatus)) {
                dispatcher.dispatch(new provideSecondStandardisationAction(success, secondStandardisationReturn));
            }
        });
    };
    /**
     * Set the team management selected Tab in team management store
     * @param selectedTab
     */
    TeamManagementActionCreator.prototype.teammanagementTabSelect = function (selectedTab) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new teamManagementTabSelectAction(selectedTab));
        }).catch();
    };
    /**
     * Set the responses as reviewed
     */
    TeamManagementActionCreator.prototype.setResponseAsReviewed = function (markGroupId, reviewerExaminerRoleId, isSeed, selectedExaminerRoleId, subordinateExaminerId, markSchemeGroupId, reviewComment) {
        var that = this;
        var args = {
            reviewerExaminerRoleId: reviewerExaminerRoleId,
            selectedExaminerRoleId: selectedExaminerRoleId,
            markGroupId: markGroupId,
            isSeed: isSeed,
            subordinateExaminerId: subordinateExaminerId,
            markSchemeGroupId: markSchemeGroupId,
            reviewCommentId: reviewComment
        };
        teamManagementDataService.SetResonseAsReviewed(args, function (returnData, success) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(returnData, false, true, enums.WarningMessageAction.SetAsReviewed)) {
                if (!success) {
                    returnData = undefined;
                }
                dispatcher.dispatch(new setAsReviewedAction(returnData, success));
            }
        });
    };
    /**
     * Method to show or hide change status popup.
     * @param isVisible
     */
    TeamManagementActionCreator.prototype.doVisibleChangeStatusPopup = function (isVisible) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new changeStatusPopupVisibilityAction(isVisible));
        }).catch();
    };
    /**
     * Sets the examiner status change button as busy
     */
    TeamManagementActionCreator.prototype.setExaminerChangeStatusButtonBusy = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new changeExaminerStatusButtonBusyStatusUpdateAction());
        }).catch();
    };
    /**
     * getUnactioned exception Details
     * @param markSchemeGroupId
     */
    TeamManagementActionCreator.prototype.getUnactionedExceptions = function (markSchemeGroupId, useCache, isFromResponse) {
        if (useCache === void 0) { useCache = true; }
        if (isFromResponse === void 0) { isFromResponse = false; }
        var that = this;
        teamManagementDataService.getUnActionedExceptions(markSchemeGroupId, function (success, unactionedExceptions, isResultFromCache) {
            if (that.validateCall(unactionedExceptions, false, true)) {
                if (!success) {
                    unactionedExceptions = undefined;
                }
                dispatcher.dispatch(new getUnActionedExceptionAction(success, markSchemeGroupId, loginSession.EXAMINER_ID, unactionedExceptions, isFromResponse));
            }
        }, useCache);
    };
    /**
     * fetches the Help Examiners Data
     * @param {number} examinerRoleID
     * @param {number} markSchemeGroupId
     * @param {boolean} useCache
     */
    TeamManagementActionCreator.prototype.GetHelpExminersData = function (examinerRoleId, markSchemeGroupId, useCache, isFromHistory) {
        if (useCache === void 0) { useCache = true; }
        if (isFromHistory === void 0) { isFromHistory = false; }
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            teamManagementDataService.getHelpExminersData(examinerRoleId, markSchemeGroupId, function (success, examinersDataForHelpExaminer, isResultFromCache) {
                // This will validate the call to find any network failure and is mandatory to add this.
                if (that.validateCall(examinersDataForHelpExaminer, false, true)) {
                    if (!success) {
                        examinersDataForHelpExaminer = undefined;
                    }
                    dispatcher.dispatch(new helpExaminersDataFetchAction(success, examinersDataForHelpExaminer, isFromHistory));
                    resolve(examinersDataForHelpExaminer);
                }
                else {
                    reject(null);
                }
            }, useCache);
        });
    };
    /**
     * validates the team management examiner
     * @param markSchemeGroupId
     * @param subExaminerRoleId
     * @param subExaminerId
     */
    TeamManagementActionCreator.prototype.teamManagementExaminerValidation = function (markSchemeGroupId, examinerRoleId, subExaminerRoleId, subExaminerId, examinerValidationArea, isFromRememberQig, actualDisplayId, selectedMarkingMode, exceptionId, isTeamManagementTabSelect) {
        if (examinerRoleId === void 0) { examinerRoleId = 0; }
        if (subExaminerRoleId === void 0) { subExaminerRoleId = 0; }
        if (subExaminerId === void 0) { subExaminerId = 0; }
        if (examinerValidationArea === void 0) { examinerValidationArea = enums.ExaminerValidationArea.None; }
        if (isFromRememberQig === void 0) { isFromRememberQig = false; }
        if (actualDisplayId === void 0) { actualDisplayId = null; }
        if (selectedMarkingMode === void 0) { selectedMarkingMode = enums.MarkingMode.None; }
        if (exceptionId === void 0) { exceptionId = 0; }
        if (isTeamManagementTabSelect === void 0) { isTeamManagementTabSelect = false; }
        var that = this;
        var warningMessageAction;
        warningMessageAction = enums.WarningMessageAction.None;
        if (examinerValidationArea === enums.ExaminerValidationArea.MarkCheckWorklist) {
            warningMessageAction = enums.WarningMessageAction.CheckingExaminerViewingResponse;
        }
        else if (examinerValidationArea === enums.ExaminerValidationArea.MyTeam &&
            isTeamManagementTabSelect) {
            // checking whether the validation is from teammanagement tab- since need not show warning message 
            // on clicking from Menu- recent history
            warningMessageAction = enums.WarningMessageAction.MyTeamAction;
        }
        else if (examinerValidationArea === enums.ExaminerValidationArea.ExceptionAction) {
            warningMessageAction = enums.WarningMessageAction.ExceptionAction;
        }
        else if (examinerValidationArea === enums.ExaminerValidationArea.TeamWorklist) {
            warningMessageAction = enums.WarningMessageAction.TeamWorklist;
        }
        // This online check is needed to handle the case when the user clicks on the examiner when
        // the browser is back online after from being offline, even before the ping updates the status.
        if (that.isOnline) {
            teamManagementDataService.teamManagementExaminerValidation(markSchemeGroupId, examinerRoleId, subExaminerRoleId, subExaminerId, examinerValidationArea, function (success, validateExaminerReturn) {
                // This will validate the call to find any network failure and is mandatory to add this.
                if (that.validateCall(validateExaminerReturn, false, true, warningMessageAction)) {
                    dispatcher.dispatch(new validateTeamManagementExaminerAction(success, validateExaminerReturn, markSchemeGroupId, isFromRememberQig, examinerValidationArea, actualDisplayId, selectedMarkingMode, subExaminerId, subExaminerRoleId, exceptionId, isTeamManagementTabSelect));
                }
            });
        }
        else {
            // If the application was online no clcikignthe examiner update the status and interrupt.
            new Promise.Promise(function (resolve, reject) {
                resolve();
            }).then(function () {
                dispatcher.dispatch(new browserOnlineStatusUpdationAction(that.isOnline, true));
            }).then(function () {
                dispatcher.dispatch(new actionInterruptedAction(false, false));
            });
        }
    };
    /**
     * Execute the SEP Action
     * @param doSEPApprovalManagementActionArgument
     */
    TeamManagementActionCreator.prototype.ExecuteApprovalManagementAction = function (doSEPApprovalManagementActionArgument, isMultiLock) {
        if (isMultiLock === void 0) { isMultiLock = false; }
        var that = this;
        teamManagementDataService.ExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument, function (success, doSEPApprovalManagementActionReturn) {
            /* This will validate the call to find any network failure and is mandatory to add this.
               For multi lock if any failure occur, does not required to show warning message popup.
               So we have to set warning message action as 'None'.That is failed action shown in multi lock result popup
            */
            var warningMessageAction = isMultiLock ?
                enums.WarningMessageAction.None : enums.WarningMessageAction.SEPAction;
            if (that.validateCall(doSEPApprovalManagementActionReturn.
                sepApprovalManagementActionResult[0], false, true, warningMessageAction)) {
                if (!success) {
                    doSEPApprovalManagementActionReturn = undefined;
                }
                dispatcher.dispatch(new executeApprovalManagementAction(true, doSEPApprovalManagementActionReturn, isMultiLock));
            }
        });
    };
    /**
     * Can Execute the SEP Action
     * @param doSEPApprovalManagementActionArgument
     */
    TeamManagementActionCreator.prototype.CanExecuteApprovalManagementAction = function (doSEPApprovalManagementActionArgument) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new canExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument));
        }).catch();
    };
    /**
     * Method to get the selected exception.
     * @param exceptionId
     */
    TeamManagementActionCreator.prototype.selectedException = function (exceptionId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new selectedExceptionAction(exceptionId));
        }).catch();
    };
    /**
     * Method to reset the selected exception.
     * @param resetSelection
     */
    TeamManagementActionCreator.prototype.resetSelectedException = function (resetSelection) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new selectedExceptionResetAction(resetSelection));
        }).catch();
    };
    /**
     * setting team history info
     * @param _historyItem
     * @param _markingMode
     * @param _failureCode
     */
    TeamManagementActionCreator.prototype.setTeamManagementHistoryInfo = function (_historyItem, _markingMode, _failureCode) {
        if (_failureCode === void 0) { _failureCode = enums.FailureCode.None; }
        return new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new teamManagementHistoryInfoAction(_historyItem, _markingMode, _failureCode));
        }).catch();
    };
    /**
     * removing history info
     * @param qigId
     * @param doRemoveTeamObject
     */
    TeamManagementActionCreator.prototype.removeHistoryItem = function (qigId, doRemoveTeamObject) {
        if (doRemoveTeamObject === void 0) { doRemoveTeamObject = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new removeHistoryItemAction(qigId, doRemoveTeamObject));
        }).catch();
    };
    /**
     * sampling Status Change
     * @param supervisorSamplingCommentArguments
     */
    TeamManagementActionCreator.prototype.samplingStatusChange = function (supervisorSamplingCommentArguments, displayId) {
        var that = this;
        teamManagementDataService.updateSamplingReviewComments(supervisorSamplingCommentArguments, function (success, supervisorSamplingCommentReturn) {
            // This will validate the call to find any network failure and is mandatory to add this.
            if (that.validateCall(supervisorSamplingCommentReturn, false, true, enums.WarningMessageAction.SupervisorSampling)) {
                dispatcher.dispatch(new samplingStatusChangeAction(supervisorSamplingCommentReturn.success, supervisorSamplingCommentReturn, displayId));
            }
        });
    };
    /**
     * Method to handle the warning message navigation.
     * @param isVisible
     */
    TeamManagementActionCreator.prototype.warningMessageNavigation = function (failureCode, warningMessageAction) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new warningMessageNavigationAction(failureCode, warningMessageAction));
        }).catch();
    };
    /**
     * This method will update the current sort details.
     * @param sortDetails
     */
    TeamManagementActionCreator.prototype.onSortClick = function (sortDetails) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new teamSortAction(sortDetails));
        }).catch();
    };
    /**
     * Qig selected from multi qig drop down
     */
    TeamManagementActionCreator.prototype.qigSelectedFromMultiQigDropDown = function (qigDetail) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new qigSelectedFromMultiqigdropdownaction(qigDetail));
        }).catch();
    };
    /**
     * fetches the Multi Qig Lock Examiners Data
     * @param {number} examinerRoleID
     * @param {number} markSchemeGroupId
     * @param {number} selectedExaminerId
     * @param {number} selectedExaminerRoleId
     */
    TeamManagementActionCreator.prototype.GetMultiQigLockExaminersData = function (logginedInExaminerId, markSchemeGroupId, selectedExaminerId, selectedExaminerRoleId) {
        var that = this;
        teamManagementDataService.getMultiQigLockExaminersDetails(logginedInExaminerId, markSchemeGroupId, selectedExaminerId, function (success, multiQigLockExaminer) {
            // This will validate the call to find any network failure and is mandatory to add this.
            if (that.validateCall(multiQigLockExaminer, false, false)) {
                if (!success) {
                    multiQigLockExaminer = undefined;
                }
                dispatcher.dispatch(new multiQigLockDataFetchAction(success, multiQigLockExaminer, selectedExaminerId, markSchemeGroupId, selectedExaminerRoleId));
            }
        });
    };
    /**
     * Update multi qig lock selection .
     */
    TeamManagementActionCreator.prototype.updateMultiQigLockSelection = function (markSchemeGroupId, isSelectedAll) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateMultiQigLockSelectionAction(markSchemeGroupId, isSelectedAll));
        }).catch();
    };
    /**
     * Method to reset the multi lock data.
     */
    TeamManagementActionCreator.prototype.resetMultiLockData = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new multiLockDataResetAction());
        }).catch();
    };
    /**
     * Method to get the multi qig lock result.
     */
    TeamManagementActionCreator.prototype.getMultiQigLockResult = function (multiQigLockResults) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new multiQigLockResultAction(multiQigLockResults));
        }).catch();
    };
    return TeamManagementActionCreator;
}(base));
var teamManagementActionCreator = new TeamManagementActionCreator();
module.exports = teamManagementActionCreator;
//# sourceMappingURL=teammanagementactioncreator.js.map