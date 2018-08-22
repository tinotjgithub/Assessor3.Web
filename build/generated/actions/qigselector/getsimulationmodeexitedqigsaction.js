"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var GetSimulationModeExitedQigsAction = (function (_super) {
    __extends(GetSimulationModeExitedQigsAction, _super);
    /**
     * Constructor of simulation modeexited qigs action
     * @param success
     * @param simulationModeExitedQigList
     */
    function GetSimulationModeExitedQigsAction(success, simulationModeExitedQigList) {
        _super.call(this, action.Source.View, actionType.GET_SIMULATION_MODE_EXITED_QIGS, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._simulationModeExitedQigList = simulationModeExitedQigList;
    }
    Object.defineProperty(GetSimulationModeExitedQigsAction.prototype, "simulationModeExitedQigList", {
        /**
         * Retrieves simulation mode exited qigs
         */
        get: function () {
            return this._simulationModeExitedQigList;
        },
        enumerable: true,
        configurable: true
    });
    return GetSimulationModeExitedQigsAction;
}(dataRetrievalAction));
module.exports = GetSimulationModeExitedQigsAction;
//# sourceMappingURL=getsimulationmodeexitedqigsaction.js.map