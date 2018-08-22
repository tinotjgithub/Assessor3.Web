import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * The Action class to open markchange reason popup.
 */
class OpenMarkChangeReasonAction extends action {

    /**
     * Constructor
     */
    constructor() {
        super(action.Source.View, actionType.OPEN_MARK_CHANGE_REASON_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
}

export = OpenMarkChangeReasonAction;