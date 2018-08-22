import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for getting exception id.
 */
class SelectedExceptionAction extends action {

    private _exceptionId: number;

    /**
     * constructor.
     * @param exceptionId
     */
    constructor(exceptionId: number) {
        super(action.Source.View, actionType.SELECTED_EXCEPTION_ACTION);
        this._exceptionId = exceptionId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ exceptionid}/g, exceptionId.toString());
    }

    /**
     * Returns the exception id.
     */
    public get exceptionId(): number {
        return this._exceptionId;
    }

}

export = SelectedExceptionAction;
