import dispatcher = require('../../app/dispatcher');
import enums = require('../../components/utility/enums');
import teamManagementDataService = require('../../dataservices/teammanagement/teammanagementdataservice');
import Promise = require('es6-promise');
import base = require('../base/actioncreatorbase');
import myTeamDataFetchAction = require('./myteamdatafetchaction');
import expandOrCollapseNodeAction = require('./expandorcollapsenodeaction');
import openTeamManagementAction = require('./openteammanagementaction');
import leftPanelToggleAction = require('./leftpaneltoggleaction');
import updateExaminerDrillDownDataAction = require('./updateexaminerdrilldowndataaction');
import teamManagementTabSelectAction = require('./teammanagementtabselectaction');
import setAsReviewedAction = require('./setasreviewedaction');
import getUnActionedExceptionAction = require('./getunactionedexceptionaction');
import loginSession = require('../../app/loginsession');
import setExaminerStatuseArguments = require('../../dataservices/teammanagement/typings/setexaminerstatusearguments');
import changeExaminerStatusAction = require('./changeexaminerstatusaction');
import changeExaminerStatusButtonBusyStatusUpdateAction = require('./changeexaminerstatusbuttonbusystatusupdateaction');
import setExaminerStatusReturn = require('../../dataservices/teammanagement/typings/setexaminerstatusreturn');
import provideSecondStandardisationAction = require('./providesecondstandardisationaction');
import setSecondStandardisationReturn = require('../../dataservices/teammanagement/typings/setsecondstandardisationreturn');
import setSecondStandardisationArguments = require('../../dataservices/teammanagement/typings/setsecondStandardisationarguments');
import changeStatusPopupVisibilityAction = require('./changestatuspopupvisibilityaction');
import helpExaminersDataFetchAction = require('./helpexaminersdatafetchaction');
import validateTeamManagementExaminerAction = require('./validateteammanagementexamineraction');
import getTeamOverviewDataAction = require('./getteamoverviewdataaction');
import executeApprovalManagementAction = require('./executeapprovalmanagementaction');
import canExecuteApprovalManagementAction = require('./canexecuteapprovalmanagementaction');
import selectedExceptionAction = require('./selectedexceptionaction');
import selectedExceptionResetAction = require('./selectedexceptionresetaction');
import teamManagementHistoryInfoAction = require('./teammanagementhistoryinfoaction');
import historyItem = require('../../utility/breadcrumb/historyitem');
import removeHistoryItemAction = require('../../actions/history/removehistoryitemaction');
import samplingStatusChangeAction = require('../../actions/sampling/samplingstatuschangeaction');
import supervisorSamplingCommentArguments = require('../../dataservices/teammanagement/typings/supervisorsamplingcommentarguments');
import warningMessageNavigationAction = require('./warningmessagenavigationaction');
import teamSortAction = require('./teamsortaction');
import teamOverViewDetails = require('../../dataservices/teammanagement/typings/teamoverviewdetails');
import browserOnlineStatusUpdationAction = require('../applicationoffline/browseronlinestatusupdationaction');
import actionInterruptedAction = require('../applicationoffline/actoninterruptedaction');
import qigSelectedFromMultiqigdropdownaction = require('./qigSelectedFromMultiQigDropDownAction');
import qigDetails = require('../../dataservices/teammanagement/typings/qigdetails');
import multiQigLockDataFetchAction = require('./multiqiglockdatafetchaction');
import updateMultiQigLockSelectionAction = require('./updatemultiqiglockselectionaction');
import multiLockDataResetAction = require('./multilockdataresetaction');
import multiQigLockResultAction = require('./multiqiglockresultaction');
import returnResponseToMarkerButtonClickedAction = require('./returnresponsetomarkerbuttonclickedaction');
import returnToMarkerArguments = require('../../dataservices/teammanagement/typings/returntomarkerarguments');
import returnToMarkerReturn = require('../../dataservices/teammanagement/typings/returntomarkerreturn');
import responseReturnedToWorklistAction = require('./responsereturnedtoworklistaction');

/**
 * Team management action creator
 */
class TeamManagementActionCreator extends base {

    /**
     * fetches the my team grid data
     * @param {number} examinerRoleID
     * @param {number} markSchemeGroupId
     * @param {boolean} useCache
     */
    public getMyTeamData(
        examinerRoleId: number,
        markSchemeGroupId: number,
        useCache: boolean = true,
        isFromHistory: boolean = false) {

        let that = this;

        return new Promise.Promise(function (resolve: any, reject: any) {
            teamManagementDataService.getMyTeamData(examinerRoleId, markSchemeGroupId,
                function (success: boolean, myTeamDataList: Immutable.List<ExaminerData>,
                    isResultFromCache: boolean) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(myTeamDataList, false, true, enums.WarningMessageAction.None, false, true)) {
                        if (!success) {
                            myTeamDataList = undefined;
                        }
                        dispatcher.dispatch(new myTeamDataFetchAction(success, myTeamDataList, isFromHistory));
                        resolve(myTeamDataList);
                    } else {
                        // This will stop promise.all from exec
                        reject(null);
                    }
                }, useCache);
        });
    }

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
    public getTeamManagementOverviewCounts(examinerRoleId: number, markSchemeGroupId: number, useCache: boolean = true,
        isFromRememberQig: boolean = false, isHelpExaminersDataRefreshRequired: boolean = true) {

        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            let that = this;
            teamManagementDataService.getTeamManagementOverviewCounts(examinerRoleId, markSchemeGroupId,
                function (success: boolean, teamoverviewdetails: teamOverViewDetails, isResultFromCache: boolean) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(teamoverviewdetails, false, true)) {
                        if (!success) {
                            teamoverviewdetails = undefined;
                        }
                        dispatcher.dispatch(new getTeamOverviewDataAction(true, markSchemeGroupId, examinerRoleId, teamoverviewdetails,
                            isFromRememberQig, isHelpExaminersDataRefreshRequired));
                    }
                }, useCache);
        }).catch();
    }

    /**
     * Collapse or Expand a examiner node
     * @param examinerRoleId
     * @param isExpanded
     */
    public expandOrCollapseExaminerNode(examinerRoleId: number, isExpanded: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new expandOrCollapseNodeAction(examinerRoleId, isExpanded));
        }).catch();
    }

    /**
     * Open Team Management
     * @param examinerRoleId
     * @param markSchemeGroupId
     * @param isFromHistoryItem
     */
    public openTeamManagement(
        examinerRoleId: number,
        markSchemeGroupId: number,
        isFromHistoryItem: boolean,
        emitEvent: boolean,
        isFromMultiQigDropDown: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new openTeamManagementAction(
                examinerRoleId,
                markSchemeGroupId,
                isFromHistoryItem,
                emitEvent,
                isFromMultiQigDropDown));
        }).catch();
    }

    /**
     * Saves the state of the team management left panel for the session
     * @param isLeftPanelCollapsed indicates whether the panel is collapsed or not
     */
    public leftPanelToggleSave(isLeftPanelCollapsed: boolean): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new leftPanelToggleAction(isLeftPanelCollapsed));
        }).catch();
    }

    /**
     * Save the examiner drill down data in team management store
     * @param examinerDrillDownData
     * @param isFromHistory
     */
    public updateExaminerDrillDownData(
        examinerDrillDownData: ExaminerDrillDownData,
        isFromHistory: boolean = false): Promise<any> {
        return new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateExaminerDrillDownDataAction(examinerDrillDownData, isFromHistory));
        }).catch();
    }

    /**
     * change examiner status.
     * @param args
     */
    public changeExaminerStatus(args: setExaminerStatuseArguments) {
        let that = this;
        teamManagementDataService.changeExaminerStatus(args,
            function (success: boolean, examinerStatusReturn: setExaminerStatusReturn) {

                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(examinerStatusReturn, false, true,
                    enums.WarningMessageAction.ChangeExaminerStatus)) {
                    dispatcher.dispatch(
                        new changeExaminerStatusAction(success, examinerStatusReturn));
                }
            });
    }

    /**
     * provide second standardisation.
     * @param args
     */
    public provideSecondStandardisation(args: setSecondStandardisationArguments) {
        let that = this;

        teamManagementDataService.provideSecondStandardisation(args,
            function (success: boolean, secondStandardisationReturn: setSecondStandardisationReturn) {

                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(secondStandardisationReturn, false, true,
                    enums.WarningMessageAction.ChangeExaminerStatus)) {
                    dispatcher.dispatch(
                        new provideSecondStandardisationAction(success, secondStandardisationReturn));
                }
            });
    }

    /**
     * Set the team management selected Tab in team management store
     * @param selectedTab
     */
    public teammanagementTabSelect(selectedTab: enums.TeamManagement): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new teamManagementTabSelectAction(selectedTab));
        }).catch();
    }

    /**
     * Set the responses as reviewed
     */
    public setResponseAsReviewed(markGroupId: number,
        reviewerExaminerRoleId: number,
        isSeed: boolean,
        selectedExaminerRoleId: number,
        subordinateExaminerId: number,
        markSchemeGroupId: number,
        reviewComment: enums.SetAsReviewedComment): void {
        let that = this;

        let args: ReviewResponseArguments = {
            reviewerExaminerRoleId: reviewerExaminerRoleId,
            selectedExaminerRoleId: selectedExaminerRoleId,
            markGroupId: markGroupId,
            isSeed: isSeed,
            subordinateExaminerId: subordinateExaminerId,
            markSchemeGroupId: markSchemeGroupId,
            reviewCommentId: reviewComment
        };

        teamManagementDataService.SetResonseAsReviewed(args, function (returnData: ReviewedResponseDetails, success: boolean) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(returnData, false, true, enums.WarningMessageAction.SetAsReviewed)) {
                if (!success) {
                    returnData = undefined;
                }
                dispatcher.dispatch(new setAsReviewedAction(returnData, success));
            }
        });
    }

    /**
     * Method to show or hide change status popup.
     * @param isVisible
     */
    public doVisibleChangeStatusPopup(isVisible: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new changeStatusPopupVisibilityAction(isVisible));
        }).catch();
    }

    /**
     * Sets the examiner status change button as busy
     */
    public setExaminerChangeStatusButtonBusy() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new changeExaminerStatusButtonBusyStatusUpdateAction());
        }).catch();
    }

    /**
     * getUnactioned exception Details
     * @param markSchemeGroupId
     */
    public getUnactionedExceptions(markSchemeGroupId: number, useCache: boolean = true, isFromResponse: boolean = false) {
        let that = this;
        teamManagementDataService.getUnActionedExceptions(markSchemeGroupId,
            function (success: boolean, unactionedExceptions: Immutable.List<UnActionedExceptionDetails>, isResultFromCache: boolean) {
                if (that.validateCall(unactionedExceptions, false, true)) {

                    if (!success) {
                        unactionedExceptions = undefined;
                    }
                    dispatcher.dispatch(new getUnActionedExceptionAction(success,
                        markSchemeGroupId,
                        loginSession.EXAMINER_ID,
                        unactionedExceptions, isFromResponse));
                }
            }, useCache);
    }

    /**
     * fetches the Help Examiners Data
     * @param {number} examinerRoleID
     * @param {number} markSchemeGroupId
     * @param {boolean} useCache
     */
    public GetHelpExminersData(examinerRoleId: number, markSchemeGroupId: number, useCache: boolean = true,
        isFromHistory: boolean = false): Promise<any> {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            teamManagementDataService.getHelpExminersData(examinerRoleId, markSchemeGroupId, function (success: boolean,
                examinersDataForHelpExaminer: Immutable.List<ExaminerDataForHelpExaminer>, isResultFromCache: boolean) {

                // This will validate the call to find any network failure and is mandatory to add this.
                if (that.validateCall(examinersDataForHelpExaminer, false, true)) {

                    if (!success) {
                        examinersDataForHelpExaminer = undefined;
                    }
                    dispatcher.dispatch(new helpExaminersDataFetchAction(success, examinersDataForHelpExaminer,
                        isFromHistory));
                    resolve(examinersDataForHelpExaminer);
                } else {
                    reject(null);
                }
            }, useCache);
        });
    }

    /**
     * validates the team management examiner
     * @param markSchemeGroupId
     * @param subExaminerRoleId
     * @param subExaminerId
     */
    public teamManagementExaminerValidation(markSchemeGroupId: number,
        examinerRoleId: number = 0,
        subExaminerRoleId: number = 0,
        subExaminerId: number = 0,
        examinerValidationArea: enums.ExaminerValidationArea = enums.ExaminerValidationArea.None,
        isFromRememberQig: boolean = false,
        actualDisplayId: string = null,
        selectedMarkingMode: enums.MarkingMode = enums.MarkingMode.None,
        exceptionId: number = 0,
        isTeamManagementTabSelect: boolean = false): void {
        let that = this;
        let warningMessageAction: enums.WarningMessageAction;
        warningMessageAction = enums.WarningMessageAction.None;
        if (examinerValidationArea === enums.ExaminerValidationArea.MarkCheckWorklist) {
            warningMessageAction = enums.WarningMessageAction.CheckingExaminerViewingResponse;
        } else if (examinerValidationArea === enums.ExaminerValidationArea.MyTeam &&
            isTeamManagementTabSelect) {
            // checking whether the validation is from teammanagement tab- since need not show warning message 
            // on clicking from Menu- recent history
            warningMessageAction = enums.WarningMessageAction.MyTeamAction;
        } else if (examinerValidationArea === enums.ExaminerValidationArea.ExceptionAction) {
            warningMessageAction = enums.WarningMessageAction.ExceptionAction;
        } else if (examinerValidationArea === enums.ExaminerValidationArea.TeamWorklist) {
            warningMessageAction = enums.WarningMessageAction.TeamWorklist;
        }

        // This online check is needed to handle the case when the user clicks on the examiner when
        // the browser is back online after from being offline, even before the ping updates the status.
        if (that.isOnline) {
            teamManagementDataService.teamManagementExaminerValidation(markSchemeGroupId,
                examinerRoleId,
                subExaminerRoleId,
                subExaminerId,
                examinerValidationArea,
                function (success: boolean, validateExaminerReturn: ValidateExaminerReturn) {
                    // This will validate the call to find any network failure and is mandatory to add this.
                    if (that.validateCall(validateExaminerReturn, false, true, warningMessageAction)) {
                        dispatcher.dispatch(new validateTeamManagementExaminerAction(
                            success, validateExaminerReturn,
                            markSchemeGroupId, isFromRememberQig, examinerValidationArea, actualDisplayId, selectedMarkingMode,
                            subExaminerId, subExaminerRoleId, exceptionId, isTeamManagementTabSelect));
                    }
                });
        } else {
            // If the application was online no clcikignthe examiner update the status and interrupt.
            new Promise.Promise(function (resolve: any, reject: any) {
                resolve();
            }).then(() => {
                dispatcher.dispatch(new browserOnlineStatusUpdationAction(that.isOnline, true));
            }).then(() => {
                dispatcher.dispatch(new actionInterruptedAction(false, false));
            });
        }
    }

    /**
     * Execute the SEP Action
     * @param doSEPApprovalManagementActionArgument
     */
    public ExecuteApprovalManagementAction(
        doSEPApprovalManagementActionArgument: DoSEPApprovalManagementActionArgument, isMultiLock: boolean = false): void {

        let that = this;
        teamManagementDataService.ExecuteApprovalManagementAction(
            doSEPApprovalManagementActionArgument,
            function (success: boolean, doSEPApprovalManagementActionReturn?: DoSEPApprovalManagementActionReturn) {

                /* This will validate the call to find any network failure and is mandatory to add this.
                   For multi lock if any failure occur, does not required to show warning message popup.
                   So we have to set warning message action as 'None'.That is failed action shown in multi lock result popup
                */
                let warningMessageAction: enums.WarningMessageAction = isMultiLock ?
                    enums.WarningMessageAction.None : enums.WarningMessageAction.SEPAction;
                if (that.validateCall(doSEPApprovalManagementActionReturn.
                    sepApprovalManagementActionResult[0], false, true,
                    warningMessageAction)) {

                    if (!success) {
                        doSEPApprovalManagementActionReturn = undefined;
                    }

                    dispatcher.dispatch(new executeApprovalManagementAction(true, doSEPApprovalManagementActionReturn,
                        isMultiLock));
                }
            });
    }

    /**
     * Can Execute the SEP Action
     * @param doSEPApprovalManagementActionArgument
     */
    public CanExecuteApprovalManagementAction(
        doSEPApprovalManagementActionArgument: DoSEPApprovalManagementActionArgument): void {

        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new canExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument));
        }).catch();
    }

    /**
     * Method to get the selected exception.
     * @param exceptionId
     */
    public selectedException(exceptionId: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new selectedExceptionAction(exceptionId));
        }).catch();
    }

    /**
     * Method to reset the selected exception.
     * @param resetSelection
     */
    public resetSelectedException(resetSelection: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new selectedExceptionResetAction(resetSelection));
        }).catch();
    }

    /**
     * setting team history info
     * @param _historyItem
     * @param _markingMode
     * @param _failureCode
     */
    public setTeamManagementHistoryInfo(_historyItem: historyItem,
        _markingMode: enums.MarkerOperationMode,
        _failureCode: enums.FailureCode = enums.FailureCode.None): Promise<any> {
        return new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new teamManagementHistoryInfoAction(_historyItem, _markingMode, _failureCode));
        }).catch();
    }

    /**
     * removing history info
     * @param qigId
     * @param doRemoveTeamObject
     */
    public removeHistoryItem(qigId: number, doRemoveTeamObject: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new removeHistoryItemAction(qigId, doRemoveTeamObject));
        }).catch();
    }

    /**
     * sampling Status Change
     * @param supervisorSamplingCommentArguments
     */
    public samplingStatusChange(supervisorSamplingCommentArguments: supervisorSamplingCommentArguments, displayId: number) {
        let that = this;
        teamManagementDataService.updateSamplingReviewComments(
            supervisorSamplingCommentArguments,
            function (success: boolean, supervisorSamplingCommentReturn: SupervisorSamplingCommentReturn) {

                // This will validate the call to find any network failure and is mandatory to add this.
                if (that.validateCall(supervisorSamplingCommentReturn, false, true,
                    enums.WarningMessageAction.SupervisorSampling)) {

                    dispatcher.dispatch(new samplingStatusChangeAction(supervisorSamplingCommentReturn.success,
                        supervisorSamplingCommentReturn, displayId));
                }
            });
    }

    /**
     * Method to handle the warning message navigation.
     * @param isVisible
     */
    public warningMessageNavigation(failureCode: enums.FailureCode, warningMessageAction: enums.WarningMessageAction) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new warningMessageNavigationAction(failureCode, warningMessageAction));
        }).catch();
    }

    /**
     * This method will update the current sort details.
     * @param sortDetails 
     */
    public onSortClick(sortDetails: TeamManagementSortDetails) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new teamSortAction(sortDetails));
        }).catch();
    }

    /**
     * Qig selected from multi qig drop down
     */
    public qigSelectedFromMultiQigDropDown(qigDetail: qigDetails) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new qigSelectedFromMultiqigdropdownaction(qigDetail));
        }).catch();
    }

    /**
     * fetches the Multi Qig Lock Examiners Data
     * @param {number} examinerRoleID
     * @param {number} markSchemeGroupId
     * @param {number} selectedExaminerId
     * @param {number} selectedExaminerRoleId
     */
    public GetMultiQigLockExaminersData(logginedInExaminerId: number, markSchemeGroupId: number,
        selectedExaminerId: number, selectedExaminerRoleId: number) {
        let that = this;
        teamManagementDataService.getMultiQigLockExaminersDetails(logginedInExaminerId, markSchemeGroupId,
            selectedExaminerId, function (success: boolean,
                multiQigLockExaminer: Immutable.List<MultiQigLockExaminer>) {

                // This will validate the call to find any network failure and is mandatory to add this.
                if (that.validateCall(multiQigLockExaminer, false, false)) {

                if (!success) {
                    multiQigLockExaminer = undefined;
                }

                dispatcher.dispatch(new multiQigLockDataFetchAction(success,
                    multiQigLockExaminer, selectedExaminerId, markSchemeGroupId, selectedExaminerRoleId));
            }
        });
    }

    /**
     * Update multi qig lock selection .
     */
    public updateMultiQigLockSelection(markSchemeGroupId: number, isSelectedAll: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateMultiQigLockSelectionAction(markSchemeGroupId, isSelectedAll));
        }).catch();
    }

    /**
     * Method to reset the multi lock data.
     */
    public resetMultiLockData() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new multiLockDataResetAction());
        }).catch();
    }

    /**
     * Method to get the multi qig lock result.
     */
    public getMultiQigLockResult(multiQigLockResults: Immutable.List<MultiLockResult>) {
        new Promise.Promise(function(resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new multiQigLockResultAction(multiQigLockResults));
        }).catch();
    }

    /**
     * Method to show or hide Return Response To Marker Worklist Confirmation PopUp
     */
    public returnResponseToMarkerWorklistButtonClicked() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new returnResponseToMarkerButtonClickedAction());
        }).catch();
    }

    /**
     * Method to return response to marker worklist
     * @param returnToMarkerArgs
     */
    public returnResponseToMarkerWorklist(returnToMarkerArgs: returnToMarkerArguments) {
        let that = this;
        teamManagementDataService.returnResponseToMarker(
            returnToMarkerArgs,
            function (success: boolean, returnToMarkerReturn: returnToMarkerReturn) {

                // This will validate the call to find any network failure and is mandatory to add this.
                if (that.validateCall(returnToMarkerReturn, false, true)) {
                    dispatcher.dispatch(new responseReturnedToWorklistAction(returnToMarkerReturn.returnToMarkerResult));
                }
            });
    }
}

let teamManagementActionCreator = new TeamManagementActionCreator();
export = teamManagementActionCreator;
