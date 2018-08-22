import dispatcher = require('../../app/dispatcher');
import worklistTypeAction = require('./worklisttypeaction');
import enums = require('../../components/utility/enums');
import worklistDataFetchAction = require('./worklistdatafetchaction');
import worklistDataService = require('../../dataservices/worklist/worklistdataservice');
import markerProgressData = require('../../stores/worklist/typings/markerprogressdata');
import responseModeChangeAction = require('./responsemodechangeaction');
import responseCloseAction = require('./responsecloseaction');
import setScrollWorklistColumnsAction = require('./setscrollworklistcolumnsaction');
import Promise = require('es6-promise');
import base = require('../base/actioncreatorbase');
import sortAction = require('./sortaction');
import responseSortDetails = require('../../components/utility/grid/responsesortdetails');
import operationModeHelper = require('../../components/utility/userdetails/userinfo/operationmodehelper');
import worklistHistoryInfoAction = require('./worklisthistoryinfoaction');
import worklistHistoryInfo = require('../../utility/breadcrumb/worklisthistoryinfo');
import getMarkingCheckWorklistAccessStatusAction = require('./getmarkingcheckworklistaccessstatusaction');
import markingCheckWorklistFetchAction = require('./markingcheckworklistgetaction');
import worklistSeedFilterAction = require('./worklistseedfilteraction');
import loginSession = require('../../app/loginsession');
import markerOpertionModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
import ccValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import historyItem = require('../../utility/breadcrumb/historyitem');
import markingCheckCompleteAction = require('./markingcheckcompleteaction');
import removeResponseFromWorklist = require('./removeresponseaction');

/**
 * Marking mode helper action creator
 * @param {enums.MarkingMode} markingmode
 */
class WorklistActionCreator extends base {

    /**
     * fetches the worklist marker progress data
     * @param {number} examinerRoleID
     * @param {boolean = true} initiateDispatch
     */
    public getWorklistMarkerProgressData(examinerRoleID: number,
        markSchemeGroupId: number,
        isElectronicStandardisationTeamMember: boolean,
        initiateDispatch: boolean = true,
        useCache: boolean = false): Promise<any> {

        let that = this;
        // include promoted as seed responses is applicable for live closed responses only, that logic will be handled in sp.
        let includePromotedAsSeedResponses: boolean = (ccValues.examinerCentreExclusivity ||
            !isElectronicStandardisationTeamMember);

        return new Promise.Promise(function (resolve: any, reject: any) {
            worklistDataService.getWorklistMarkerProgressData(examinerRoleID, markSchemeGroupId, includePromotedAsSeedResponses,
                function (success: boolean, json?: markerProgressData) {

                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(json)) {

                        if (!success) {
                            json = undefined;
                        }

                        if (initiateDispatch) {
                            dispatcher.dispatch(new worklistDataFetchAction(success, json));
                        }
                        resolve(json);
                    } else {
                        reject();
                    }
                },
                useCache);
        });
    }

    /**
     * Get the markingCheckWorklist Access permission for the current user
     * @param markSchemeGroupId
     */
    public getMarkingCheckWorklistAccessStatus(markSchemeGroupId: number) {
        worklistDataService.getMarkingCheckWorklistAccessStatus(markSchemeGroupId,
            function (success: boolean, isMarkingCheckPresent: boolean) {
                dispatcher.dispatch(new getMarkingCheckWorklistAccessStatusAction(true, isMarkingCheckPresent));
            });
    }


    /**
     * On Marking CHeck Complete
     * @param markSchemeGroupId
     */
    public markingCheckComplete() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markingCheckCompleteAction());
        }).catch();
    }

    /**
     * notify the user has changed the worklist selection.
     * @param MarkSchemeGroupId The mark scheme group id
     * @param examinerRole The examiner role id
     * @param questionPaperPartId The question paper id
     * @param markingmode The marking mode
     * @param responseMode The response mode
     */
    public notifyWorklistTypeChange(markSchemeGroupId: number,
        examinerRole: number,
        questionPaperPartId: number,
        worklistType: enums.WorklistType,
        responseMode: enums.ResponseMode,
        remarkRequestType: enums.RemarkRequestType = enums.RemarkRequestType.Unknown,
        isDirectedRemark: boolean = false,
        isElectronicStandardisationTeamMember: boolean,
        doUseCache: boolean = true,
        isMarkingCheckWorklist: boolean = false,
        hasComplexOptionality: boolean = false) {

        let _subExaminerId: number = operationModeHelper.subExaminerId;

        let includePromotedAsSeedResponses: boolean = (ccValues.examinerCentreExclusivity ||
            !isElectronicStandardisationTeamMember) && (worklistType ===
            enums.WorklistType.live || worklistType === enums.WorklistType.directedRemark ||
            worklistType === enums.WorklistType.pooledRemark)
             && responseMode === enums.ResponseMode.closed;

        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            /* Data service call to retrieve open live/ Pooled Remark response details */
            worklistDataService.GetWorklistDetails(markSchemeGroupId,
                examinerRole,
                questionPaperPartId,
                remarkRequestType,
                worklistType,
                responseMode,
                doUseCache,
                that.isOnline,
                _subExaminerId,
                operationModeHelper.isHelpExaminersView,
                isMarkingCheckWorklist,
                includePromotedAsSeedResponses,
                function (success: boolean, isCached: boolean, responseData: any) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(responseData, true, true)) {

                        if (!success) {
                            responseData = undefined;
                        }

                        new Promise.Promise(function (resolve: any, reject: any) {
                            resolve();
                        }).then(() => {
                            /* Dispatch the login action once the authentication call completes */
                            dispatcher.dispatch(new worklistTypeAction(
                                worklistType,
                                responseMode,
                                remarkRequestType,
                                isDirectedRemark,
                                success,
                                isCached,
                                responseData,
                                markSchemeGroupId,
                                questionPaperPartId,
                                operationModeHelper.examinerRoleId,
                                hasComplexOptionality));
                        }).catch();
                    }
                });
        });
    }

    /**
     * Handle worklist response mode change
     * @param responseMode The response mode
     */
    public responseModeChanged(responseMode: enums.ResponseMode, isMarkingCheckMode: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new responseModeChangeAction(responseMode, isMarkingCheckMode));
        }).catch();
    }

    /**
     * Updates the store for selected examiner in workliststore and invokes call for worklist
     */
    public onMarkingCheckRequesterExaminerSelected(examinerId: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markingCheckWorklistFetchAction(examinerId));
        }).catch();
    }

    /**
     * Handle navigate to worklist on response close
     * @param responseMode The response mode
     */
    public responseClosed(isResponseClose: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new responseCloseAction(isResponseClose));
        }).catch();
    }

    /**
     * setting the scroll for the worklist List View Tables
     */
    public setScrollWorklistColumns() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setScrollWorklistColumnsAction());
        }).catch();
    }

    /**
     * Handle the sort order
     */
    public onSortedClick(sortDetails: responseSortDetails) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new sortAction(sortDetails));
        }).catch();
    }

    /**
     * setting worklist history info
     */
    public setWorklistHistoryInfo(_historyItem: historyItem, _markingMode: enums.MarkerOperationMode) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new worklistHistoryInfoAction(_historyItem, _markingMode));
        }).catch();
    }

    /**
     * Set the selected filter data
     * @param examinerRoleId
     * @param selectedWorklistFilter
     */
    public setFilteredWorklistData(examinerRoleId: number, selectedWorklistFilter: enums.WorklistSeedFilter): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new worklistSeedFilterAction(examinerRoleId, selectedWorklistFilter));
        }).catch();
    }

    /**
     * This will remove a response from current store worklist collection
     * @param {enums.WorklistType} worklistType 
     * @param {enums.ResponseMode} responseMode 
     * @param {string} displayId 
     * 
     * @memberof WorklistActionCreator
     */
    public removeResponseFromWorklist(worklistType: enums.WorklistType, responseMode: enums.ResponseMode, displayId: string): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new removeResponseFromWorklist(worklistType, responseMode, displayId));
        }).catch();
    }
}

let worklistActionCreator = new WorklistActionCreator();
export = worklistActionCreator;
