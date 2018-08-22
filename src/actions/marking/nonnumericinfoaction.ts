import action = require('../base/action');
import actionType = require('../base/actiontypes');
/**
 * Action class for closing exceptions
 */
class NonNumericInfoAction extends action {

    /**
     * constructor
     * @param isNonNumeric
     */
    constructor() {
        super(action.Source.View, actionType.NON_NUMERIC_INFO_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
}

export = NonNumericInfoAction;