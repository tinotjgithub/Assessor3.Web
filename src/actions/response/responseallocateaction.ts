import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import allocatedResponseData = require('../../stores/response/typings/allocatedresponsedata');

/**
 * The Action class for Response Allocation
 */
class ResponseAllocateAction extends dataRetrievalAction {

    private _allocatedResponseData: allocatedResponseData;

    private _isWholeResponseAllocation : boolean;
    /**
     * Initializing a new instance of allocate action.
     * @param {boolean} success
     */
    constructor(data: allocatedResponseData, success: boolean, _isWholeResponseAllocation = false ) {
        super(action.Source.View, actionType.RESPONSE_ALLOCATED, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._allocatedResponseData = data;
        this._isWholeResponseAllocation = _isWholeResponseAllocation;
    }

    public get allocatedResponseData(): allocatedResponseData {
        return this._allocatedResponseData;
    }

    public get isWholeResponseAllocation(): boolean  {
        return this._isWholeResponseAllocation;
    }
}
export = ResponseAllocateAction;