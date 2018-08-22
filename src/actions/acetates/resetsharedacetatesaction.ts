import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for reseting shared acetates.
 */
class ResetSharedAcetatesAction extends action {
    constructor() {
        super(action.Source.View, actionType.RESET_SHARED_ACETATES_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.
        replace(/{ reset shared acetate invoked}/g, 'true');
    }
}

export = ResetSharedAcetatesAction;
