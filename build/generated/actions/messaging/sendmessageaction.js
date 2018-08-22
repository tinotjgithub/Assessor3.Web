"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var SendMessageAction = (function (_super) {
    __extends(SendMessageAction, _super);
    /**
     * Constructor
     * @param success
     */
    function SendMessageAction(success, examinerRoleId, messagePriority, examBodyTypeId, failureCode, shouldClearMessageDetails, messageSendErrorCode) {
        _super.call(this, action.Source.View, actionType.SEND_MESSAGE_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._examinerRoleId = examinerRoleId;
        this._messagePriority = messagePriority;
        this._examBodyTypeId = examBodyTypeId;
        this._failureCode = failureCode;
        this._shouldClearMessageDetails = shouldClearMessageDetails;
        this._messageSendErrorCode = messageSendErrorCode;
    }
    Object.defineProperty(SendMessageAction.prototype, "examinerRoleId", {
        /**
         * get examiner roleid in selected qig
         */
        get: function () {
            return this._examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendMessageAction.prototype, "messagePriority", {
        /**
         * get examiner message priority
         */
        get: function () {
            return this._messagePriority;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendMessageAction.prototype, "examBodyTypeId", {
        /**
         * get examiner exam body type id
         */
        get: function () {
            return this._examBodyTypeId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendMessageAction.prototype, "failureCode", {
        /**
         * get the failure code on Message Sending
         */
        get: function () {
            return this._failureCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendMessageAction.prototype, "shouldClearMessageDetails", {
        /**
         * indicates should clear the message details
         * @readonly
         * @type {boolean}
         */
        get: function () {
            return this._shouldClearMessageDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SendMessageAction.prototype, "messageSendErrorCode", {
        /**
         * Error code on message sending failed scenarios
         */
        get: function () {
            return this._messageSendErrorCode;
        },
        enumerable: true,
        configurable: true
    });
    return SendMessageAction;
}(dataRetrievalAction));
module.exports = SendMessageAction;
//# sourceMappingURL=sendmessageaction.js.map