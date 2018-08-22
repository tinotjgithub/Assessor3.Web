"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for supervisor remark change action
 */
var SupervisorRemarkDecisionChangeAction = (function (_super) {
    __extends(SupervisorRemarkDecisionChangeAction, _super);
    /**
     * Constructor
     * @param accuracyIndicator
     * @param remarkDecision
     */
    function SupervisorRemarkDecisionChangeAction(accuracyIndicator, remarkDecision) {
        _super.call(this, action.Source.View, actionType.SUPERVISOR_REMARK_DECISION_CHANGE);
        this._accuracyIndicator = accuracyIndicator;
        this._remarkDecision = remarkDecision;
    }
    Object.defineProperty(SupervisorRemarkDecisionChangeAction.prototype, "accuracyIndicator", {
        get: function () {
            return this._accuracyIndicator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SupervisorRemarkDecisionChangeAction.prototype, "remarkDecision", {
        get: function () {
            return this._remarkDecision;
        },
        enumerable: true,
        configurable: true
    });
    return SupervisorRemarkDecisionChangeAction;
}(action));
module.exports = SupervisorRemarkDecisionChangeAction;
//# sourceMappingURL=supervisorremarkdecisionchangeaction.js.map