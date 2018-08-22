"use strict";
var qigStore = require('../../stores/qigselector/qigstore');
var qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
var Immutable = require('immutable');
var simulationTargetCompleteArgument = require('../../stores/qigselector/typings/simulationtargetcompleteargument');
var enums = require('../../components/utility/enums');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
var rememberQig = require('../../stores/useroption/typings/rememberqig');
var userOptionsHelper = require('../useroption/useroptionshelper');
var userOptionKeys = require('../useroption/useroptionkeys');
/**
 * Simulation mode helper
 */
var SimulationModeHelper = (function () {
    function SimulationModeHelper() {
    }
    /**
     * To handle calls to get simulation exited qigs a nd locks in qig
     * @param isFromLogout
     */
    SimulationModeHelper.handleSimulationExitedQigsAndLocksInQig = function (isFromLogout) {
        qigSelectorActionCreator.getSimulationExitedQigsAndLocksInQigs(isFromLogout);
    };
    Object.defineProperty(SimulationModeHelper, "isSimulationExitedQigDataAvailable", {
        /**
         * Checks if data for simulation exited qigs are available.
         */
        get: function () {
            return qigStore.instance.getSimulationModeExitedQigList !== undefined &&
                qigStore.instance.getSimulationModeExitedQigList.qigList.count() > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimulationModeHelper, "isLockInQigsDataAvailable", {
        /**
         * Checks if data for locks in qig are available
         */
        get: function () {
            return qigStore.instance.getLocksInQigList !== undefined &&
                qigStore.instance.getLocksInQigList.locksInQigDetailsList.count() > 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To handle calls to set simulation exited qigs target to complete.
     */
    SimulationModeHelper.handleSimulationTargetCompletion = function (isFromQigSelector) {
        var simulationExitedExaminerRoleIds = Immutable.List();
        var simulationArgument = new simulationTargetCompleteArgument();
        var simulationModeExitedQigList = Immutable.List();
        if (isFromQigSelector) {
            simulationModeExitedQigList = qigStore.instance.getSimulationModeExitedQigList === undefined ?
                undefined :
                qigStore.instance.getSimulationModeExitedQigList.qigList;
            // Pushing the examiner role ids of the simulation exited qigs into list
            if (simulationModeExitedQigList) {
                simulationModeExitedQigList.map(function (_simulationModeExitedQig) {
                    simulationExitedExaminerRoleIds = simulationExitedExaminerRoleIds.push(_simulationModeExitedQig.examinerRoleId);
                });
            }
        }
        else {
            simulationExitedExaminerRoleIds = simulationExitedExaminerRoleIds.push(qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        }
        // Binding to argument           
        simulationArgument.simulationExaminerRoleIdList = simulationExitedExaminerRoleIds;
        if (simulationExitedExaminerRoleIds.count() > 0) {
            qigSelectorActionCreator.setSimulationTargetToComplete(simulationArgument);
        }
    };
    /**
     * To check if standardisation setup completion check is necessarry.
     */
    SimulationModeHelper.shouldCheckForStandardisationSetupCompletion = function () {
        // If current target is simulation then standardisation setup completion check should be made
        if (qigStore.instance.getSelectedQIGForTheLoggedInUser) {
            return !qigStore.instance.getSelectedQIGForTheLoggedInUser.standardisationSetupComplete &&
                qigStore.instance.getSelectedQIGForTheLoggedInUser.currentMarkingTarget.markingMode === enums.MarkingMode.Simulation;
        }
        else {
            return false;
        }
    };
    /**
     *  Checks if the standardisation setup is completed form the failure reasons
     * @param navigationFailureReason
     */
    SimulationModeHelper.isStandardisationSetupCompletedExitsIn = function (navigationFailureReason) {
        return navigationFailureReason.indexOf(enums.ResponseNavigateFailureReason.StandardisationSetupCompletedWhileInSimulation) > -1;
    };
    /**
     * Clears the cache and sets the rember qig data before completing simulation target
     */
    SimulationModeHelper.clearCacheBeforBeforeSimulationTargetCompletion = function () {
        this.storageAdapterHelper = new storageAdapterHelper();
        // Clearing the cache of qigselector, worklist, marker progress and simulation exited qigs       
        this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
        this.storageAdapterHelper.clearStorageArea('worklist');
        this.storageAdapterHelper.clearStorageArea('marker');
        this.storageAdapterHelper.clearCacheByKey('simulationexitedqigs', 'qigdata');
        // Updating remeber qig data
        var _rememberQig = new rememberQig();
        _rememberQig.qigId = 0;
        _rememberQig.area = enums.QigArea.QigSelector;
        _rememberQig.worklistType = enums.WorklistType.none;
        userOptionsHelper.save(userOptionKeys.REMEMBER_PREVIOUS_QIG, JSON.stringify(_rememberQig), true);
    };
    /**
     * Check standardisation setup completion
     */
    SimulationModeHelper.checkStandardisationSetupCompletion = function (navigatedFrom, navigatedTo, isFromMenu) {
        if ((!qigStore.instance.getSelectedQIGForTheLoggedInUser.standardisationSetupComplete || isFromMenu) &&
            qigStore.instance.getSelectedQIGForTheLoggedInUser.currentMarkingTarget.markingMode === enums.MarkingMode.Simulation) {
            qigSelectorActionCreator.checkStandardisationSetupCompleted(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId, navigatedFrom, navigatedTo);
        }
    };
    return SimulationModeHelper;
}());
module.exports = SimulationModeHelper;
//# sourceMappingURL=simulationmodehelper.js.map