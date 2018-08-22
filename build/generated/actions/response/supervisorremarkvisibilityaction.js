"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for supervisor remark button visibility.
 */
var SupervisorRemarkVisibilityAction = (function (_super) {
    __extends(SupervisorRemarkVisibilityAction, _super);
    /**
     * constructor
     * @param isVisible
     */
    function SupervisorRemarkVisibilityAction(isVisible) {
        _super.call(this, action.Source.View, actionType.SUPERVISOR_REMARK_VISIBILITY_ACTION);
        this._isVisible = isVisible;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ isVisible}/g, isVisible.toString());
    }
    Object.defineProperty(SupervisorRemarkVisibilityAction.prototype, "isVisible", {
        /**
         * Return supervisor remark button visibility status.
         */
        get: function () {
            return this._isVisible;
        },
        enumerable: true,
        configurable: true
    });
    return SupervisorRemarkVisibilityAction;
}(action));
module.exports = SupervisorRemarkVisibilityAction;
//# sourceMappingURL=supervisorremarkvisibilityaction.js.map