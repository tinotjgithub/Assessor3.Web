import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ShowReturnToWorklistConfirmationAction extends action {

    /**
     * Constructor
     */
    constructor() {
        super(action.Source.View, actionType.SHOW_RETURN_TO_WORKLIST_CONFIRMATION_ACTION);
    }
}

export = ShowReturnToWorklistConfirmationAction;