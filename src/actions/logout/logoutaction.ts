import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class LogoutAction extends dataRetrievalAction {

   /**
    * Logout action
    * @param success
    * @param errorJsonObject
    */
    constructor(success: boolean, errorJsonObject?: any) {
        super(action.Source.View, actionType.USER_SESSION_UPDATE_ON_LOGOUT, success, errorJsonObject);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
}

export = LogoutAction;
