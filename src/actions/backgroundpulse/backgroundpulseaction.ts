import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import actionNotificationInfo = require('./notificationinfo/actionnotificationinfo');
import actionExaminerOnlineStatusInfo = require('./examineronlinestatus/actionexamineronlinestatusinfo');
import backgroundPulseReturn = require('../../stores/backgroundpulse/typings/backgroundpulsereturn');

/**
 * Action class for Background pulse.
 */
class BackgroundPulseAction extends dataRetrievalAction {

    private notificationData: actionNotificationInfo;
    private onlineStatusData: actionExaminerOnlineStatusInfo;
     /**
      * @constructor
      */
    constructor(success: boolean, backgroundPulseReturnData: backgroundPulseReturn) {
        super(action.Source.View, actionType.BACKGROUND_PULSE, success);
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

    /**
     * returns the notification data
     */
    public get getNotificationData() {
        return this.notificationData;
    }

    /**
     * returns the examiner online status indicator data.
     */
    public get getOnlineStatusData() {
        return this.onlineStatusData;
    }
}

export = BackgroundPulseAction;