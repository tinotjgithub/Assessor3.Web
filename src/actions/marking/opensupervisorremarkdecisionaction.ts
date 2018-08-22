import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * The Action class to open supervisor remark decision popup.
 */
class OpenSupervisorRemarkDecisionAction extends action {

    /**
     * Constructor
     */
    constructor() {
        super(action.Source.View, actionType.OPEN_SUPERVISOR_REMARK_DECISION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
}

export = OpenSupervisorRemarkDecisionAction;