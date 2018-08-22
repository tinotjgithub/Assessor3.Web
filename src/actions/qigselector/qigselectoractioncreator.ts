import dispatcher = require('../../app/dispatcher');
import Promise = require('es6-promise');
import qigSelectorDataFetchAction = require('./qigselectordatafetchaction');
import qigSelectorDataService = require('../../dataservices/qigselector/qigselectordataservice');
import qigselectoraction = require('./qigselectoraction');
import overviewData = require('../../stores/qigselector/typings/overviewdata');
import configurableCharacteristicsData = require('../../stores/configurablecharacteristics/typings/configurablecharacteristicsdata');
import markerProgressData = require('../../stores/worklist/typings/markerprogressdata');
import workListInitialisationAction = require('../../actions/worklist/worklistinitialisationaction');
import showHeaderIconsAction = require('./showheadericonsaction');
import base = require('../base/actioncreatorbase');
import navigateToWorklistFromQigselectorAction = require('../qigselector/navigatetoworklistfromqigselectoraction');
import operationModeHelper = require('../../components/utility/userdetails/userinfo/operationmodehelper');
import createExaminerRoleForAdminRemarker = require('./createexaminerroleforadminremarkeraction');
import getLocksInQigsAction = require('./getlocksinqigsaction');
import locksInQigDetailsList = require('../../stores/qigselector/typings/locksinqigdetailslist');
import showLocksInQigPopupAction = require('./showlocksinqigpopupaction');
import openQigFromLockedListAction = require('./openqigfromlockedlistaction');
import simulationModeExitedQigList = require('../../stores/qigselector/typings/simulationmodeexitedqiglist');
import getSimulationModeExitedQigsAction = require('./getsimulationmodeexitedqigsaction');
import getSimulationExitedAndLockInQigsAction = require('./getsimulationexitedandlockinqigsaction');
import simulationTargetCompletedAction = require('./simulationtargetcompletedaction');
import simulationTargetCompleteArgument = require('../../stores/qigselector/typings/simulationtargetcompleteargument');
import standardisationSetupCompletedAction = require('./standardisationsetupcompletedaction');
import aggregatedQigExpandOrCollapseAction = require('./aggregatedqigexpandorcollapseaction');
import enums = require('../../components/utility/enums');

class QigSelectorActionCreator extends base {

    /**
     * Method which retrieves the data for the QIG Selector
     * @param qigToBeFetched
     * @param fetchOnlyLoggedInExamierData
     * @param isFromSearch
     * @param isFromHistory
     * @param isFromLocksInPopUp
     * @param doEmit
     */
    public getQIGSelectorData(
        qigToBeFetched: number,
        fetchOnlyLoggedInExamierData: boolean = false,
        isFromSearch: boolean = false,
        isFromHistory: boolean = false,
        isFromLocksInPopUp: boolean = false,
        doEmit: boolean = true,
        isFromMultiQigDropDown: boolean = false): Promise<any> {

        let that = this;

        return new Promise.Promise(function (resolve: any, reject: any) {

            qigSelectorDataService.getQIGSelectorData(function (success: boolean, json: overviewData) {

                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json, false, true)) {

                    // Dispatch the login action once the authentication call completes
                    dispatcher.dispatch(new qigSelectorDataFetchAction(
                        success,
                        qigToBeFetched,
                        fetchOnlyLoggedInExamierData,
                        json,
                        isFromSearch,
                        isFromHistory,
                        isFromLocksInPopUp,
                        doEmit,
                        isFromMultiQigDropDown));
                    resolve(json);
                } else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            }, qigToBeFetched, fetchOnlyLoggedInExamierData ? 0 : operationModeHelper.subExaminerId);

        });


    }

    /**
     * Method which retrieves the Admin remarkers QIG selector data
     */
    public getAdminRemarkerQIGSelectorData(isFromLocksInPopUp: boolean = false): void {

        let that = this;
        qigSelectorDataService.getAdminRemarkerQIGSelectorData(function (success: boolean, json: overviewData) {

            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(json)) {
                // Dispatch the login action once the authentication call completes
                dispatcher.dispatch(new qigSelectorDataFetchAction(success, 0, false, json, false, false, isFromLocksInPopUp, true, true));
            }
        });
    }

    /**
     * Method which retrieves the Examiner role identifier for an Admin remarker againts a QIG
     * @param qigToBeFetched
     * @param fetchOnlyLoggedInExamierData
     */
    public createAdminRemarkerRole(markSchemeGroupId: number, callBack: Function): any {

        let that = this;
        let createAdminRemarkerRole = qigSelectorDataService.createAdminRemarkerRole(markSchemeGroupId);

        createAdminRemarkerRole.then((json: any) => {
            if (that.validateCall(json)) {
                dispatcher.dispatch(new createExaminerRoleForAdminRemarker(json));
                callBack();
            }
        });
    }

    /**
     * Initialise worklist calls
     * @param markSchemeStructureData The markSchemeStructureData
     * @param ccData The ccData
     * @param markingProgressData The markingProgressData
     */
    public initialiseWorklist(markSchemeStructureData: any, ccData: any,
        markerInfoData: any, markingProgressData: any): void {

        dispatcher.dispatch(new workListInitialisationAction(
            markSchemeStructureData, ccData, markerInfoData, markingProgressData));
    }

    /**
     * Method which is called when opening a QIG
     * @param qigId
     * @param dispatchEvent
     */
    public openQIG(qigId: number, dispatchEvent: boolean = true, isFromHistory: boolean = false): Promise<any> {
        return new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new qigselectoraction(qigId, dispatchEvent, isFromHistory));
        }).catch();
    }

    /**
     * Show Header Icons if the QIGs are available
     */
    public showHeaderIconsOnQIGsAvailable(displayIcons: boolean): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new showHeaderIconsAction(displayIcons));
        }).catch();
    }

    /**
     * Open worklist from qigselector
     */
    public navigateToWorklistFromQigSelector() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new navigateToWorklistFromQigselectorAction());
        }).catch();
    }

   /**
    * Method which retrieves no of locks againts QIGs
    * @param isFromLogout
    * @param initiateDispatch
    */
    public getLocksInQigs(isFromLogout: boolean, initiateDispatch: boolean = true) {

        let that = this;

        return new Promise.Promise(function (resolve: any, reject: any) {

            qigSelectorDataService.getLocksInQigs(function (success: boolean, json: locksInQigDetailsList) {

                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json, false, true, enums.WarningMessageAction.None, isFromLogout)) {

                    if (initiateDispatch) {
                        // Dispatch the login action once the authentication call completes
                        dispatcher.dispatch(new getLocksInQigsAction(
                            success, json, isFromLogout));
                    }
                    resolve(json);
                } else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    }

    /**
     * Method which is called when opening a QIG
     * @param doShowLocksInQigPopup
     */
    public showLocksInQigPopup(doShowLocksInQigPopup: boolean, isFromLogout: boolean): Promise<any> {
        return new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new showLocksInQigPopupAction(doShowLocksInQigPopup, isFromLogout));
        }).catch();
    }

    /**
     * Method which is called when opening a QIG from locked list
     * @param qigId
     */
    public qigSelectedFromLockedList(qigId: number): Promise<any> {
        return new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new openQigFromLockedListAction(qigId));
        }).catch();
    }

    /**
     * Method which gets the simulation exited qig data.
     * @param initiateDispatch
     */
    public getSimulationModeExitedQigs(initiateDispatch: boolean = true): Promise<any> {
        let that = this;

        return new Promise.Promise(function (resolve: any, reject: any) {

            qigSelectorDataService.getSimulationModeExitedQigs(function (success: boolean, json: simulationModeExitedQigList) {

                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json)) {

                    if (initiateDispatch) {
                        // Dispatch the action to get simulation mode exited qigs
                        dispatcher.dispatch(new getSimulationModeExitedQigsAction(success, json));
                    }

                    resolve(json);
                } else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });

        });
    }

    /**
     * Method which retrives the locks in qigs and simulation mode exited qigs
     * @param isFromLogout
     */
    public getSimulationExitedQigsAndLocksInQigs(isFromLogout: boolean) {
        let that = this;
        // After retrieving locks in qigs and simulation mode exited qigs
        Promise.Promise.all(
            [
                that.getSimulationModeExitedQigs(false),
                that.getLocksInQigs(isFromLogout, false)
            ]).
            then(function (result: any) {
                dispatcher.dispatch(new getSimulationExitedAndLockInQigsAction(result[0].success,
                    result[1].success,
                    result[0],
                    result[1],
                    isFromLogout));
            });
    }

    /**
     * Method which is called when the simulation target is to be completed.
     * @param simulationArgument
     * @param containerPage
     * @param navigateTo
     * @param onSelectingQig
     */
    public setSimulationTargetToComplete(simulationArgument: simulationTargetCompleteArgument): Promise<any> {

        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            qigSelectorDataService.setSimulationTargetToComplete(function (success: boolean, json: any) {

                //This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json)) {

                    dispatcher.dispatch(new simulationTargetCompletedAction(success, json,
                        simulationArgument.simulationExaminerRoleIdList));

                    resolve(json);
                } else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            }, simulationArgument);
        });
    }

    /**
     * Method which is called to check if standardisatino setup is completed for the qig
     * @param markSchemeGroupId
     */
    public checkStandardisationSetupCompleted(markSchemeGroupId: number,
        navigatedFrom: enums.PageContainers,
        navigatedTo: enums.PageContainers): Promise<any> {

        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            qigSelectorDataService.checkStandardisationSetupCompleted(function (success: boolean, json: any) {
                //This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json)) {

                    dispatcher.dispatch(new standardisationSetupCompletedAction(success, json,
                        navigatedFrom, navigatedTo));

                    resolve(json);
                } else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            }, markSchemeGroupId);
        });
    }

    /**
     * Expand or Collapse Qigs for Aggregated Qig
     * @param groupId
     * @param isOpen
     */
    public expandOrCollapseAggregatedQig(groupId: number): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new aggregatedQigExpandOrCollapseAction(groupId));
        }).catch();
    }
}

let qigSelectorActionCreator = new QigSelectorActionCreator();
export = qigSelectorActionCreator;