import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for setting non-recoverable error
 */
class SetNonRecoverableErrorAction extends dataRetrievalAction {

    private _markGroupId: number;

    /**
     * Constructor SetNonRecoverableErrorActions
     * @param markGroupId
     * @param success
     */
    constructor(markGroupId: number, success: boolean) {
        super(action.Source.View, actionType.SET_NON_RECOVERABLE_ERROR, success);
        this._markGroupId = markGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markGroupId}/g, this.markGroupId.toString()).
            replace(/{success}/g, success.toString());
    }

   /**
    * returns the markGroupId
    */
    public get markGroupId() {
        return this._markGroupId;
    }

}

export = SetNonRecoverableErrorAction;