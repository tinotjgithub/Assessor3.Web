import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * The Action class to display Marke Change Reason Needed popup.
 */
class ShowMarkChangeReasonNeededMessageAction extends action {
    private _failureReason: enums.ResponseNavigateFailureReason;
    private _navigateTo: enums.SaveAndNavigate;

    /**
     * Constructor
     * @param failureReason
     * @param navigateTo
     */
    constructor(failureReason: enums.ResponseNavigateFailureReason, navigateTo: enums.SaveAndNavigate) {
        super(action.Source.View, actionType.SHOW_MARK_CHANGE_REASON_NEEDED_MESSAGE_ACTION);
        this._failureReason = failureReason;
        this._navigateTo = navigateTo;
        this.auditLog.logContent = this.auditLog.logContent;
    }

    /**
     * Get failure reason
     */
    public get failureReason(): enums.ResponseNavigateFailureReason {
        return this._failureReason;
    }

    /**
     *  get navigateTo
     */
    public get navigateTo(): enums.SaveAndNavigate {
        return this._navigateTo;
    }
}

export = ShowMarkChangeReasonNeededMessageAction;