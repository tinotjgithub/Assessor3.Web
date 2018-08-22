import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ProcessSaveAndNavigationAction extends action {

    /**
     * Constructor
     */
    constructor() {
        super(action.Source.View, actionType.PROCESS_SAVE_AND_NAVIGATION_ACTION);
    }

}

export = ProcessSaveAndNavigationAction;