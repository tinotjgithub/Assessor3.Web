"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var GetSimulationExitedAndLockInQigsAction = (function (_super) {
    __extends(GetSimulationExitedAndLockInQigsAction, _super);
    /**
     *  Constructor of simulation mode exited qigs  and locks in qig action
     * @param successSimulation
     * @param successLocks
     * @param simulationModeExitedQigList
     * @param locksInQigDetailList
     * @param isFromLogout
     */
    function GetSimulationExitedAndLockInQigsAction(successSimulation, successLocks, simulationModeExitedQigList, locksInQigDetailList, isFromLogout) {
        _super.call(this, action.Source.View, actionType.GET_SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS, successSimulation && successLocks);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{successSimulation}/g, successSimulation.toString())
            .replace(/{successLock}/g, successLocks.toString());
        this._simulationModeExitedQigList = simulationModeExitedQigList;
        this._locksInQigDetailsList = locksInQigDetailList;
        this._isFromLogout = isFromLogout;
    }
    Object.defineProperty(GetSimulationExitedAndLockInQigsAction.prototype, "simulationModeExitedQigList", {
        /**
         * Retrieves simulation mode exited qigs
         */
        get: function () {
            return this._simulationModeExitedQigList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetSimulationExitedAndLockInQigsAction.prototype, "locksInQigDetailsList", {
        /**
         * Retrieves no of locks againts QIGs
         */
        get: function () {
            return this._locksInQigDetailsList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetSimulationExitedAndLockInQigsAction.prototype, "isFromLogout", {
        /**
         * Checking whether the call is from logout or not
         */
        get: function () {
            return this._isFromLogout;
        },
        enumerable: true,
        configurable: true
    });
    return GetSimulationExitedAndLockInQigsAction;
}(dataRetrievalAction));
module.exports = GetSimulationExitedAndLockInQigsAction;
//# sourceMappingURL=getsimulationexitedandlockinqigsaction.js.map