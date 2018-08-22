import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for Auto approval message status update.
 */
class AutoApprovalMessageAction extends dataRetrievalAction {

    /**
     * @constructor
     */
    constructor(success: boolean) {
        super(action.Source.View, actionType.AUTO_APPROVAL_MESSAGE_UPDATE, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
}

export = AutoApprovalMessageAction;