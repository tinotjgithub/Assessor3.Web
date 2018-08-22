import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import Immutable = require('immutable');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
/**
 * Action class for getting exceptions
 */
class GetUnActionedExceptionAction extends dataRetrievalAction {

   /**
    * The private variable to hold exception list
    */
    private _exceptiondata: Immutable.List<UnActionedExceptionDetails>;
    private _isFromBackToException: boolean = false;

    /**
     * 
     * @param {boolean} success
     * @param {number} markSchemegroupId
     * @param {number} examinerID
     * @param {Immutable.List<UnActionedExceptionDetails>} unActionedExceptionList
     */
    constructor(success: boolean,
        markSchemegroupId: number,
        examinerID: number,
        unActionedExceptionList: Immutable.List<UnActionedExceptionDetails>, isFromResponse) {
        super(action.Source.View, actionType.GET_UNACTIONED_EXCEPTION_ACTION, success);

        this.auditLog.logContent = this.auditLog.logContent.replace('{examinerId}',
            examinerID.toString()).replace('{markSchemeGroupId}',
            markSchemegroupId.toString());
        if (success) {
            this._exceptiondata = unActionedExceptionList;
        } else {
            this._exceptiondata = undefined;
        }
        this._isFromBackToException = isFromResponse;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', success.toString());
    }

    /**
     * return List of exceptions
     */
    public get exceptiondata(): Immutable.List<UnActionedExceptionDetails> {
        return this._exceptiondata;
    }

    public get isFromResponse(): boolean {
        return this._isFromBackToException;
    }
}

export = GetUnActionedExceptionAction;