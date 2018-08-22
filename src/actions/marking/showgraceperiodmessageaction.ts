import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class ShowGracePeriodMessageAction extends action {
    private _failureReason: enums.ResponseNavigateFailureReason;

    /**
     * Constructor
     * @param failureReason
     */
    constructor(failureReason: enums.ResponseNavigateFailureReason) {
        super(action.Source.View, actionType.SHOW_GRACE_PERIOD_NOT_FULLY_MARKED_MESSAGE);
        this._failureReason = failureReason;
    }
    public get failureReason(): enums.ResponseNavigateFailureReason {
        return this._failureReason;
    }
}
export = ShowGracePeriodMessageAction;