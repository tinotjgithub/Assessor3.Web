import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Class for Worklist List view set scoll Action
 */
class SetScrollWorklistColumnsAction extends action {

    /**
     * Constructor SetScrollWorklistColumnsAction
     */
    constructor() {
        super(action.Source.View, actionType.SETSCROLL_WORKLISTCOLUMNS_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
}

export = SetScrollWorklistColumnsAction;