"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for getting exception id.
 */
var SelectedExceptionAction = (function (_super) {
    __extends(SelectedExceptionAction, _super);
    /**
     * constructor.
     * @param exceptionId
     */
    function SelectedExceptionAction(exceptionId) {
        _super.call(this, action.Source.View, actionType.SELECTED_EXCEPTION_ACTION);
        this._exceptionId = exceptionId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ exceptionid}/g, exceptionId.toString());
    }
    Object.defineProperty(SelectedExceptionAction.prototype, "exceptionId", {
        /**
         * Returns the exception id.
         */
        get: function () {
            return this._exceptionId;
        },
        enumerable: true,
        configurable: true
    });
    return SelectedExceptionAction;
}(action));
module.exports = SelectedExceptionAction;
//# sourceMappingURL=selectedexceptionaction.js.map