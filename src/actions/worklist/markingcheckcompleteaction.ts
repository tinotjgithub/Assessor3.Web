import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class MarkingCheckCompleteAction extends action {

    /**
     * Marking check Complete action constructor
     */
    constructor() {
        super(action.Source.View, actionType.MARKING_CHECK_COMPLETE_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }

}

export = MarkingCheckCompleteAction;
