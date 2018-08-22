"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var GetUnReadMandatoryMessageStatusAction = (function (_super) {
    __extends(GetUnReadMandatoryMessageStatusAction, _super);
    /**
     * Constructor
     * @param success
     * @param isUnreadMandatoryMessagePresent
     */
    function GetUnReadMandatoryMessageStatusAction(success, isUnreadMandatoryMessagePresent, triggerPoint) {
        _super.call(this, action.Source.View, actionType.GET_UNREAD_MANDATORY_MESSAGE_STATUS, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._isUnreadMandatoryMessagePresent = isUnreadMandatoryMessagePresent;
        this._triggerPoint = triggerPoint;
    }
    Object.defineProperty(GetUnReadMandatoryMessageStatusAction.prototype, "isUnreadMandatoryMessagePresent", {
        /**
         * Return true if unread mandatory messages present else return false
         */
        get: function () {
            return this._isUnreadMandatoryMessagePresent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetUnReadMandatoryMessageStatusAction.prototype, "triggerPoint", {
        /**
         * Returns the triggering point
         */
        get: function () {
            return this._triggerPoint;
        },
        enumerable: true,
        configurable: true
    });
    return GetUnReadMandatoryMessageStatusAction;
}(dataRetrievalAction));
module.exports = GetUnReadMandatoryMessageStatusAction;
//# sourceMappingURL=getunreadmandatorymessagestatusaction.js.map