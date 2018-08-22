"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var actionNotificationInfo = require('./notificationinfo/actionnotificationinfo');
var actionExaminerOnlineStatusInfo = require('./examineronlinestatus/actionexamineronlinestatusinfo');
/**
 * Action class for Background pulse.
 */
var BackgroundPulseAction = (function (_super) {
    __extends(BackgroundPulseAction, _super);
    /**
     * @constructor
     */
    function BackgroundPulseAction(success, backgroundPulseReturnData) {
        _super.call(this, action.Source.View, actionType.BACKGROUND_PULSE, success);
        this.notificationData = new actionNotificationInfo();
        this.onlineStatusData = new actionExaminerOnlineStatusInfo();
        this.notificationData.setUnreadMessageCount = backgroundPulseReturnData.unreadMessageCount;
        this.notificationData.setExceptionMessageCount = backgroundPulseReturnData.exceptionMessageCount;
        this.notificationData.setUnreadMandatoryMessageCount = backgroundPulseReturnData.unreadMandatoryMessageCount;
        this.onlineStatusData.isExaminerLoggedOut = backgroundPulseReturnData.isSupervisorLoggedOut;
        this.onlineStatusData.supervisorTimeSinceLastPingInMinutes = backgroundPulseReturnData.supervisorTimeSinceLastPingInMinutes;
        this.onlineStatusData.examinerApprovalStatus = backgroundPulseReturnData.examinerApprovalStatus;
        this.onlineStatusData.role = backgroundPulseReturnData.role;
        this.notificationData.setCoordinationCompleteBit = backgroundPulseReturnData.coordinationComplete;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    Object.defineProperty(BackgroundPulseAction.prototype, "getNotificationData", {
        /**
         * returns the notification data
         */
        get: function () {
            return this.notificationData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BackgroundPulseAction.prototype, "getOnlineStatusData", {
        /**
         * returns the examiner online status indicator data.
         */
        get: function () {
            return this.onlineStatusData;
        },
        enumerable: true,
        configurable: true
    });
    return BackgroundPulseAction;
}(dataRetrievalAction));
module.exports = BackgroundPulseAction;
//# sourceMappingURL=backgroundpulseaction.js.map