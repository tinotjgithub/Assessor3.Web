"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for validating warning message.
 */
var ValidationAction = (function (_super) {
    __extends(ValidationAction, _super);
    /**
     * constructor
     * @param failurecode
     * @param warningmessageaction
     */
    function ValidationAction(failureCode, warningMessageAction) {
        _super.call(this, action.Source.View, actionType.WARNING_MESSAGE_ACTION);
        this._failureCode = failureCode;
        this._warningMessageAction = warningMessageAction;
        this.auditLog.logContent = this.auditLog.logContent.
            replace(/{FailureCode}/g, failureCode.toString());
    }
    Object.defineProperty(ValidationAction.prototype, "failureCode", {
        /**
         * Return failure code.
         */
        get: function () {
            return this._failureCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidationAction.prototype, "warningMessageAction", {
        /**
         * Return warning message action.
         */
        get: function () {
            return this._warningMessageAction;
        },
        enumerable: true,
        configurable: true
    });
    return ValidationAction;
}(action));
module.exports = ValidationAction;
//# sourceMappingURL=validationaction.js.map