import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

/**
 * The Action class for FRV scroll action
 */
class FullResponseViewScrollAction extends action {


    /**
     * Initializing a new instance of scroll action.
     */
    constructor() {
        super(action.Source.View, actionType.FRV_SCROLL_ACTION);
    }
}
export = FullResponseViewScrollAction;