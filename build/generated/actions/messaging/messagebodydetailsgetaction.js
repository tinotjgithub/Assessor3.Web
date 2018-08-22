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
 * Action class for updating message read sttus
 */
var MessageBodyDetailsGetAction = (function (_super) {
    __extends(MessageBodyDetailsGetAction, _super);
    /**
     * Constructor
     * @param success
     * @param msgId
     * @param messagingDetails
     * @param selectedTab
     */
    function MessageBodyDetailsGetAction(success, msgId, messagingDetails, selectedTab) {
        _super.call(this, action.Source.View, actionType.MESSAGE_DETAILS_GET_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', msgId.toString());
        this.msgId = msgId;
        this.msgDetails = messagingDetails;
        this.selctedTab = selectedTab;
    }
    Object.defineProperty(MessageBodyDetailsGetAction.prototype, "messageId", {
        /**
         * Get the message Id
         */
        get: function () {
            return this.msgId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageBodyDetailsGetAction.prototype, "messageDetails", {
        /**
         * Get the message Details
         */
        get: function () {
            return this.msgDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageBodyDetailsGetAction.prototype, "selectedTab", {
        get: function () {
            return this.selctedTab;
        },
        enumerable: true,
        configurable: true
    });
    return MessageBodyDetailsGetAction;
}(dataRetrievalAction));
module.exports = MessageBodyDetailsGetAction;
//# sourceMappingURL=messagebodydetailsgetaction.js.map