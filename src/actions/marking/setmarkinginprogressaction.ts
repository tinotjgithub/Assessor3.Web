import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for setting marking in progress.
 */
class SetMarkingInProgressAction extends action {

    private _isMarkingInProgress: boolean;

    /**
     * constructor
     * @param isMarkingInProgress
     */
    constructor(isMarkingInProgress: boolean) {
        super(action.Source.View, actionType.SET_MARKING_IN_PROGRESS_ACTION);
        this._isMarkingInProgress = isMarkingInProgress;
    }

     /**
      * Get marking in progress
      */
    public get isMarkingInProgress(): boolean {
        return this._isMarkingInProgress;
    }
}

export = SetMarkingInProgressAction;
