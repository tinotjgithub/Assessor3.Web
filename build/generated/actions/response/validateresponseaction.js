"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * The Action class for Response Allocation
 */
var ValidateResponseAction = (function (_super) {
    __extends(ValidateResponseAction, _super);
    /**
     * Initializing a new instance of allocate action.
     * @param {boolean} success
     */
    function ValidateResponseAction(validateResponseReturnData, success, isStandardisationSetup) {
        _super.call(this, action.Source.View, actionType.VALIDATE_RESPONSE, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._validateResponseReturnData = validateResponseReturnData;
        this._isStandardisationSetup = isStandardisationSetup;
    }
    Object.defineProperty(ValidateResponseAction.prototype, "validateResponseReturnData", {
        get: function () {
            return this._validateResponseReturnData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidateResponseAction.prototype, "isStandardisationSetupValidation", {
        get: function () {
            return this._isStandardisationSetup;
        },
        enumerable: true,
        configurable: true
    });
    return ValidateResponseAction;
}(dataRetrievalAction));
module.exports = ValidateResponseAction;
//# sourceMappingURL=validateresponseaction.js.map