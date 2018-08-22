import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class RotationCompletedAction extends action {
    /**
     * Creates an instance of RotationCompletedAction.
     */
    constructor() {
        super(action.Source.View, actionType.ROTATION_COMPLETED_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
}

export = RotationCompletedAction;
