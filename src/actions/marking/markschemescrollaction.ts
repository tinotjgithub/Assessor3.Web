import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

class MarkSchemeScrollAction extends action {

    /**
     * Constructor
     */
    constructor() {
        super(action.Source.View, actionType.MARK_SCHEME_SCROLL_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
}

export = MarkSchemeScrollAction;