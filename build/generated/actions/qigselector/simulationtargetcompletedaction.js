"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var SimulationTargetCompletedAction = (function (_super) {
    __extends(SimulationTargetCompletedAction, _super);
    /**
     * Constructor for simulation target completed action
     * @param success
     * @param isTargetCompleted
     * @param containerPage
     * @param navigateTo
     */
    function SimulationTargetCompletedAction(success, isTargetCompleted, simulationExitedExaminerRoleIds) {
        _super.call(this, action.Source.View, actionType.SIMULATION_TARGET_COMPLETED, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._isTargetCompleted = isTargetCompleted;
        this._simulationExitedExaminerRoleIds = simulationExitedExaminerRoleIds;
    }
    Object.defineProperty(SimulationTargetCompletedAction.prototype, "isTargetCompleted", {
        /**
         * Checking whether the target is completed or not
         */
        get: function () {
            return this._isTargetCompleted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimulationTargetCompletedAction.prototype, "simulationExitedExaminerRoleIds", {
        /**
         * Returns the simulation exited examiner role ids.
         */
        get: function () {
            return this._simulationExitedExaminerRoleIds;
        },
        enumerable: true,
        configurable: true
    });
    return SimulationTargetCompletedAction;
}(dataRetrievalAction));
module.exports = SimulationTargetCompletedAction;
//# sourceMappingURL=simulationtargetcompletedaction.js.map