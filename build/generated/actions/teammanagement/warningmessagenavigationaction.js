"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for warning message navigation.
 */
var WarningMessageNavigationAction = (function (_super) {
    __extends(WarningMessageNavigationAction, _super);
    /**
     * constructor
     * @param failurecode
     * @param warningmessageaction
     */
    function WarningMessageNavigationAction(failureCode, warningMessageAction) {
        _super.call(this, action.Source.View, actionType.WARNING_MESSAGE_NAVIGATION_ACTION);
        this._failureCode = failureCode;
        this._warningMessageAction = warningMessageAction;
        this.auditLog.logContent = this.auditLog.logContent.
            replace(/{ Failure code}/g, failureCode.toString());
    }
    Object.defineProperty(WarningMessageNavigationAction.prototype, "failureCode", {
        /**
         * Return failure code.
         */
        get: function () {
            return this._failureCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarningMessageNavigationAction.prototype, "warningMessageAction", {
        /**
         * Return warning message action.
         */
        get: function () {
            return this._warningMessageAction;
        },
        enumerable: true,
        configurable: true
    });
    return WarningMessageNavigationAction;
}(action));
module.exports = WarningMessageNavigationAction;
//# sourceMappingURL=warningmessagenavigationaction.js.map