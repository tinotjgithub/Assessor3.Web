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
 * Action class for message section open or close events.
 */
var MessageViewAction = (function (_super) {
    __extends(MessageViewAction, _super);
    /**
     * constructor
     * @param success
     * @param messageType
     * @param messageAction
     */
    function MessageViewAction(success, messageAction, messageType, navigateTo, navigateFrom) {
        if (navigateFrom === void 0) { navigateFrom = enums.SaveAndNavigate.none; }
        _super.call(this, action.Source.View, actionType.MESSAGE_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', enums.getEnumString(enums.MessageViewAction, messageAction))
            .replace(/{success}/g, success.toString());
        this._messageAction = messageAction;
        this._navigateTo = navigateTo;
        this._navigateFrom = navigateFrom;
        this._messageType = messageType;
    }
    Object.defineProperty(MessageViewAction.prototype, "messageAction", {
        /**
         * return message action - open or close
         */
        get: function () {
            return this._messageAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageViewAction.prototype, "messageType", {
        /**
         * return the current message type
         */
        get: function () {
            return this._messageType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageViewAction.prototype, "navigateTo", {
        /**
         * returns navigate to value
         */
        get: function () {
            return this._navigateTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageViewAction.prototype, "navigateFrom", {
        get: function () {
            return this._navigateFrom;
        },
        enumerable: true,
        configurable: true
    });
    return MessageViewAction;
}(dataRetrievalAction));
module.exports = MessageViewAction;
//# sourceMappingURL=messageviewaction.js.map