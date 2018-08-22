import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import Immutable = require('immutable');

/**
 * Action class for reseting acetate save in progress status.
 */
class ResetAcetateSaveInProgressStatusAction extends action {

    private _acetatesList: Immutable.List<Acetate>;

    constructor(acetatesList: Immutable.List<Acetate>) {
        super(action.Source.View, actionType.RESET_ACETATE_SAVE_IN_PROGRESS_STATUS_ACTION);
        this._acetatesList = acetatesList;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ acetates list count}/g,
        acetatesList.size.toString());
    }

    /**
     * Returns acetate list.
     */
    public get acetatesList(): Immutable.List<Acetate> {
        return this._acetatesList;
    }
}

export = ResetAcetateSaveInProgressStatusAction;
