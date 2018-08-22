import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 *  The add or update acetate action.
 */
class AcetateMovingAction extends action {

    private _isMoving: boolean = false;

    /**
     * Constructor for the action.
     * @param clientToken
     * @param isMoving
     */
    constructor(clientToken: string, isMoving: boolean) {
        super(action.Source.View, actionType.ACETATE_MOVING_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', clientToken)
            .replace('{1}', isMoving.toString());
        this._isMoving = isMoving;
    }

    /* return true acetate is moving */
    public get isMoving(): boolean {
        return this._isMoving;
    }
}

export = AcetateMovingAction;
