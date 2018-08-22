import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action class for Reject rig Completed action.
 */
class RejectRigCompletedAction extends action {

    private _success: boolean;

    private _nextResponseAvailable: boolean;

    /**
     * Constructor RejectRigCompletedAction
     */
    constructor(success: boolean, isNextResponseAvailable: boolean) {
        super(action.Source.View, actionType.REJECT_RIG_COMPLETED_ACTION);
        this._success = success;
        this._nextResponseAvailable = isNextResponseAvailable;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{status}/g, success.toString());
    }

    /**
     * return call status.
     */
    public get success(): boolean {
        return this._success;
    }

    /**
     * return boolean based on next response avaliablity.
     */
    public get isNextResponseAvailable(): boolean {
        return this._nextResponseAvailable;
    }
}

export = RejectRigCompletedAction;