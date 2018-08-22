"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var Promise = require('es6-promise');
var qigSelectorDataFetchAction = require('./qigselectordatafetchaction');
var qigSelectorDataService = require('../../dataservices/qigselector/qigselectordataservice');
var qigselectoraction = require('./qigselectoraction');
var workListInitialisationAction = require('../../actions/worklist/worklistinitialisationaction');
var showHeaderIconsAction = require('./showheadericonsaction');
var base = require('../base/actioncreatorbase');
var navigateToWorklistFromQigselectorAction = require('../qigselector/navigatetoworklistfromqigselectoraction');
var operationModeHelper = require('../../components/utility/userdetails/userinfo/operationmodehelper');
var createExaminerRoleForAdminRemarker = require('./createexaminerroleforadminremarkeraction');
var getLocksInQigsAction = require('./getlocksinqigsaction');
var showLocksInQigPopupAction = require('./showlocksinqigpopupaction');
var openQigFromLockedListAction = require('./openqigfromlockedlistaction');
var getSimulationModeExitedQigsAction = require('./getsimulationmodeexitedqigsaction');
var getSimulationExitedAndLockInQigsAction = require('./getsimulationexitedandlockinqigsaction');
var simulationTargetCompletedAction = require('./simulationtargetcompletedaction');
var standardisationSetupCompletedAction = require('./standardisationsetupcompletedaction');
var enums = require('../../components/utility/enums');
var QigSelectorActionCreator = (function (_super) {
    __extends(QigSelectorActionCreator, _super);
    function QigSelectorActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Method which retrieves the data for the QIG Selector
     * @param qigToBeFetched
     * @param fetchOnlyLoggedInExamierData
     * @param isFromSearch
     * @param isFromHistory
     * @param isFromLocksInPopUp
     * @param doEmit
     */
    QigSelectorActionCreator.prototype.getQIGSelectorData = function (qigToBeFetched, fetchOnlyLoggedInExamierData, isFromSearch, isFromHistory, isFromLocksInPopUp, doEmit, isFromMultiQigDropDown) {
        if (fetchOnlyLoggedInExamierData === void 0) { fetchOnlyLoggedInExamierData = false; }
        if (isFromSearch === void 0) { isFromSearch = false; }
        if (isFromHistory === void 0) { isFromHistory = false; }
        if (isFromLocksInPopUp === void 0) { isFromLocksInPopUp = false; }
        if (doEmit === void 0) { doEmit = true; }
        if (isFromMultiQigDropDown === void 0) { isFromMultiQigDropDown = false; }
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            qigSelectorDataService.getQIGSelectorData(function (success, json) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json, false, true)) {
                    // Dispatch the login action once the authentication call completes
                    dispatcher.dispatch(new qigSelectorDataFetchAction(success, qigToBeFetched, fetchOnlyLoggedInExamierData, json, isFromSearch, isFromHistory, isFromLocksInPopUp, doEmit, isFromMultiQigDropDown));
                    resolve(json);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            }, qigToBeFetched, fetchOnlyLoggedInExamierData ? 0 : operationModeHelper.subExaminerId);
        });
    };
    /**
     * Method which retrieves the Admin remarkers QIG selector data
     */
    QigSelectorActionCreator.prototype.getAdminRemarkerQIGSelectorData = function (isFromLocksInPopUp) {
        if (isFromLocksInPopUp === void 0) { isFromLocksInPopUp = false; }
        var that = this;
        qigSelectorDataService.getAdminRemarkerQIGSelectorData(function (success, json) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(json)) {
                // Dispatch the login action once the authentication call completes
                dispatcher.dispatch(new qigSelectorDataFetchAction(success, 0, false, json, false, false, isFromLocksInPopUp, false, true));
            }
        });
    };
    /**
     * Method which retrieves the Examiner role identifier for an Admin remarker againts a QIG
     * @param qigToBeFetched
     * @param fetchOnlyLoggedInExamierData
     */
    QigSelectorActionCreator.prototype.createAdminRemarkerRole = function (markSchemeGroupId, callBack) {
        var that = this;
        var createAdminRemarkerRole = qigSelectorDataService.createAdminRemarkerRole(markSchemeGroupId);
        createAdminRemarkerRole.then(function (json) {
            if (that.validateCall(json)) {
                dispatcher.dispatch(new createExaminerRoleForAdminRemarker(json));
                callBack();
            }
        });
    };
    /**
     * Initialise worklist calls
     * @param markSchemeStructureData The markSchemeStructureData
     * @param ccData The ccData
     * @param markingProgressData The markingProgressData
     */
    QigSelectorActionCreator.prototype.initialiseWorklist = function (markSchemeStructureData, ccData, markerInfoData, markingProgressData) {
        dispatcher.dispatch(new workListInitialisationAction(markSchemeStructureData, ccData, markerInfoData, markingProgressData));
    };
    /**
     * Method which is called when opening a QIG
     * @param qigId
     * @param dispatchEvent
     */
    QigSelectorActionCreator.prototype.openQIG = function (qigId, dispatchEvent, isFromHistory) {
        if (dispatchEvent === void 0) { dispatchEvent = true; }
        if (isFromHistory === void 0) { isFromHistory = false; }
        return new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new qigselectoraction(qigId, dispatchEvent, isFromHistory));
        }).catch();
    };
    /**
     * Show Header Icons if the QIGs are available
     */
    QigSelectorActionCreator.prototype.showHeaderIconsOnQIGsAvailable = function (displayIcons) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new showHeaderIconsAction(displayIcons));
        }).catch();
    };
    /**
     * Open worklist from qigselector
     */
    QigSelectorActionCreator.prototype.navigateToWorklistFromQigSelector = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new navigateToWorklistFromQigselectorAction());
        }).catch();
    };
    /**
     * Method which retrieves no of locks againts QIGs
     * @param isFromLogout
     * @param initiateDispatch
     */
    QigSelectorActionCreator.prototype.getLocksInQigs = function (isFromLogout, initiateDispatch) {
        if (initiateDispatch === void 0) { initiateDispatch = true; }
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            qigSelectorDataService.getLocksInQigs(function (success, json) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json, false, true, enums.WarningMessageAction.None, isFromLogout)) {
                    if (initiateDispatch) {
                        // Dispatch the login action once the authentication call completes
                        dispatcher.dispatch(new getLocksInQigsAction(success, json, isFromLogout));
                    }
                    resolve(json);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
    /**
     * Method which is called when opening a QIG
     * @param doShowLocksInQigPopup
     */
    QigSelectorActionCreator.prototype.showLocksInQigPopup = function (doShowLocksInQigPopup, isFromLogout) {
        return new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new showLocksInQigPopupAction(doShowLocksInQigPopup, isFromLogout));
        }).catch();
    };
    /**
     * Method which is called when opening a QIG from locked list
     * @param qigId
     */
    QigSelectorActionCreator.prototype.qigSelectedFromLockedList = function (qigId) {
        return new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new openQigFromLockedListAction(qigId));
        }).catch();
    };
    /**
     * Method which gets the simulation exited qig data.
     * @param initiateDispatch
     */
    QigSelectorActionCreator.prototype.getSimulationModeExitedQigs = function (initiateDispatch) {
        if (initiateDispatch === void 0) { initiateDispatch = true; }
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            qigSelectorDataService.getSimulationModeExitedQigs(function (success, json) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json)) {
                    if (initiateDispatch) {
                        // Dispatch the action to get simulation mode exited qigs
                        dispatcher.dispatch(new getSimulationModeExitedQigsAction(success, json));
                    }
                    resolve(json);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
    /**
     * Method which retrives the locks in qigs and simulation mode exited qigs
     * @param isFromLogout
     */
    QigSelectorActionCreator.prototype.getSimulationExitedQigsAndLocksInQigs = function (isFromLogout) {
        var that = this;
        // After retrieving locks in qigs and simulation mode exited qigs
        Promise.Promise.all([
            that.getSimulationModeExitedQigs(false),
            that.getLocksInQigs(isFromLogout, false)
        ]).
            then(function (result) {
            dispatcher.dispatch(new getSimulationExitedAndLockInQigsAction(result[0].success, result[1].success, result[0], result[1], isFromLogout));
        });
    };
    /**
     * Method which is called when the simulation target is to be completed.
     * @param simulationArgument
     * @param containerPage
     * @param navigateTo
     * @param onSelectingQig
     */
    QigSelectorActionCreator.prototype.setSimulationTargetToComplete = function (simulationArgument) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            qigSelectorDataService.setSimulationTargetToComplete(function (success, json) {
                //This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json)) {
                    dispatcher.dispatch(new simulationTargetCompletedAction(success, json, simulationArgument.simulationExaminerRoleIdList));
                    resolve(json);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            }, simulationArgument);
        });
    };
    /**
     * Method which is called to check if standardisatino setup is completed for the qig
     * @param markSchemeGroupId
     */
    QigSelectorActionCreator.prototype.checkStandardisationSetupCompleted = function (markSchemeGroupId, navigatedFrom, navigatedTo) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            qigSelectorDataService.checkStandardisationSetupCompleted(function (success, json) {
                //This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json)) {
                    dispatcher.dispatch(new standardisationSetupCompletedAction(success, json, navigatedFrom, navigatedTo));
                    resolve(json);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            }, markSchemeGroupId);
        });
    };
    return QigSelectorActionCreator;
}(base));
var qigSelectorActionCreator = new QigSelectorActionCreator();
module.exports = qigSelectorActionCreator;
//# sourceMappingURL=qigselectoractioncreator.js.map