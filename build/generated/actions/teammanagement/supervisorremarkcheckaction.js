"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var SupervisorRemarkCheckAction = (function (_super) {
    __extends(SupervisorRemarkCheckAction, _super);
    /**
     * Initializing a new instance of supervisor check action.
     */
    function SupervisorRemarkCheckAction(supervisorRemarkValidationReturn) {
        _super.call(this, action.Source.View, actionType.SUPERVISOR_REMARK_CHECK_ACTION);
        this._supervisorRemarkValidationReturn = supervisorRemarkValidationReturn;
    }
    Object.defineProperty(SupervisorRemarkCheckAction.prototype, "SupervisorRemarkValidationReturn", {
        /**
         * Get the supervisor remark validation return data.
         */
        get: function () {
            return this._supervisorRemarkValidationReturn;
        },
        enumerable: true,
        configurable: true
    });
    return SupervisorRemarkCheckAction;
}(action));
module.exports = SupervisorRemarkCheckAction;
//# sourceMappingURL=supervisorremarkcheckaction.js.map