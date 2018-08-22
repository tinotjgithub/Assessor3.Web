"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for reset the selected exception.
 */
var SelectedExceptionResetAction = (function (_super) {
    __extends(SelectedExceptionResetAction, _super);
    /**
     * constructor.
     * @param isResetSelection
     */
    function SelectedExceptionResetAction(isResetSelection) {
        _super.call(this, action.Source.View, actionType.SELECTED_EXCEPTION_RESET_ACTION);
        this._isResetSelection = isResetSelection;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ resetstatus}/g, isResetSelection.toString());
    }
    Object.defineProperty(SelectedExceptionResetAction.prototype, "isResetSelection", {
        /**
         * Reset exception selection.
         */
        get: function () {
            return this._isResetSelection;
        },
        enumerable: true,
        configurable: true
    });
    return SelectedExceptionResetAction;
}(action));
module.exports = SelectedExceptionResetAction;
//# sourceMappingURL=selectedexceptionresetaction.js.map