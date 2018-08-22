import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class CalculateRecipientCountAction extends action {
    /**
     * Constructor
     * @param success
     */
    constructor() {
        super(action.Source.View, actionType.CALCULATE_RECIPIENT_COUNT_ACTION);
    }
}

export = CalculateRecipientCountAction;
