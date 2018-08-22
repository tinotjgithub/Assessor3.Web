import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action class for Reject rig confirmation.
 */
class RejectRigConfirmedAction extends action {

    private _displayId: number;

    /**
     * Constructor RejectRigConfirmationAction
     */
    constructor(displayId: number) {
        super(action.Source.View, actionType.REJECT_RIG_CONFIRMATION_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{Display_Id}/g, displayId.toString());
    }

    /**
     * returns display id of a response which is rejected.
     */
    public get DisplayId(): number {
        return this._displayId;
    }
}

export = RejectRigConfirmedAction;