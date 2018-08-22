import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for reseting Multi Qig Lock Data.
 */
class MultiLockDataResetAction extends action {
    constructor() {
        super(action.Source.View, actionType.MULTI_LOCK_DATA_RESET);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, 'true');
    }
}

export = MultiLockDataResetAction;
