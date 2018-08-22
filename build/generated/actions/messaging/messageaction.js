"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var Immutable = require('immutable');
/**
 * Action class for getting messages
 */
var MessageAction = (function (_super) {
    __extends(MessageAction, _super);
    /**
     * constructor
     * @param success
     * @param getMessagesReturn
     * @param messageFolderType
     * @param responseId
     * @param isResultFromCache
     * @param checkUnreadMandatoryMessage
     */
    function MessageAction(success, getMessagesReturn, messageFolderType, responseId, isResultFromCache, checkUnreadMandatoryMessage) {
        _super.call(this, action.Source.View, actionType.GET_MESSAGE_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent;
        if (success) {
            this._messages = Immutable.List(getMessagesReturn.messages);
            this._messageMarkSchemes = Immutable.List(getMessagesReturn.messagingMarkSchemes);
            this._messageFolderType = messageFolderType;
            this._responseId = responseId;
            this._totalUnreadMessageCount = getMessagesReturn.totalUnreadMessageCount;
            this._isResultFromCache = isResultFromCache;
            this._checkUnreadMandatoryMessage = checkUnreadMandatoryMessage;
        }
        else {
            this._messages = undefined;
        }
    }
    Object.defineProperty(MessageAction.prototype, "messages", {
        /**
         * return List of messages
         */
        get: function () {
            return this._messages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageAction.prototype, "messageMarkSchemes", {
        /**
         * return List of mark schemes for the messages.
         */
        get: function () {
            return this._messageMarkSchemes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageAction.prototype, "messageFolderType", {
        /**
         * return message folder type.
         */
        get: function () {
            return this._messageFolderType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageAction.prototype, "responseId", {
        /**
         * Returns the response id, if provided.
         */
        get: function () {
            return this._responseId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageAction.prototype, "getTotalUnreadMessageCount", {
        /**
         * Get the total unread message count
         */
        get: function () {
            return this._totalUnreadMessageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageAction.prototype, "isResultFromCache", {
        /**
         * Get the indication that the result from cache or not
         */
        get: function () {
            return this._isResultFromCache;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageAction.prototype, "checkUnreadMandatoryMessage", {
        /**
         * Gets whether need to check unread mandatory message or not
         */
        get: function () {
            return this._checkUnreadMandatoryMessage;
        },
        enumerable: true,
        configurable: true
    });
    return MessageAction;
}(dataRetrievalAction));
module.exports = MessageAction;
//# sourceMappingURL=messageaction.js.map