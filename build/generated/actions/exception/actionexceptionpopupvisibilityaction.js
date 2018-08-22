"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for exception action popup visibility.
 */
var ActionExceptionPopupVisibilityAction = (function (_super) {
    __extends(ActionExceptionPopupVisibilityAction, _super);
    /**
     * Constructor for the  exception action popup visibility
     * @param doVisiblePopup
     * @param exceptionActionType
     */
    function ActionExceptionPopupVisibilityAction(doVisiblePopup, exceptionActionType) {
        _super.call(this, action.Source.View, actionType.EXCEPTION_POPUP_VISIBILITY_ACTION);
        this._doVisiblePopup = doVisiblePopup;
        this._exceptionActionType = exceptionActionType;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, doVisiblePopup.toString());
    }
    Object.defineProperty(ActionExceptionPopupVisibilityAction.prototype, "doVisiblePopup", {
        /**
         * popup visibility status.
         */
        get: function () {
            return this._doVisiblePopup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionExceptionPopupVisibilityAction.prototype, "exceptionActionType", {
        /**
         * exception action type.
         */
        get: function () {
            return this._exceptionActionType;
        },
        enumerable: true,
        configurable: true
    });
    return ActionExceptionPopupVisibilityAction;
}(action));
module.exports = ActionExceptionPopupVisibilityAction;
//# sourceMappingURL=actionexceptionpopupvisibilityaction.js.map