"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
/**
 * Action class for message update
 */
var MessageStatusUpdateAction = (function (_super) {
    __extends(MessageStatusUpdateAction, _super);
    /**
     * Constructor
     * @param success
     * @param msgId
     * @param messageDistributionIds
     * @param msgReadStatus
     */
    function MessageStatusUpdateAction(success, msgId, messageDistributionIds, msgReadStatus) {
        _super.call(this, action.Source.View, actionType.MESSAGE_STATUS_UPDATE_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', msgId.toString())
            .replace('{1}', enums.getEnumString(enums.MessageReadStatus, msgReadStatus));
        this._msgId = msgId;
        this._msgstatus = msgReadStatus;
    }
    Object.defineProperty(MessageStatusUpdateAction.prototype, "messagId", {
        /**
         * Message Id for the update
         */
        get: function () {
            return this._msgId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageStatusUpdateAction.prototype, "messageStatus", {
        /**
         * Message status for the update
         */
        get: function () {
            return this._msgstatus;
        },
        enumerable: true,
        configurable: true
    });
    return MessageStatusUpdateAction;
}(dataRetrievalAction));
module.exports = MessageStatusUpdateAction;
//# sourceMappingURL=messagestatusupdateaction.js.map