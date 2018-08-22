import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import allocatedResponseData = require('../../stores/response/typings/allocatedresponsedata');
import actionType = require('../base/actiontypes');

/**
 * The Action class for Atypical search mark now click
 */
class AtypicalSearchMarkNowAction extends action {

    private _allocatedResponseData: allocatedResponseData;

    /**
     * Initializing a new instance of mark now action.
     * @param {boolean} success
     */
    constructor(data: allocatedResponseData, success: boolean) {
        super(action.Source.View, actionType.ATYPICAL_SEARCH_MARK_NOW_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._allocatedResponseData = data;
    }

    public get allocatedResponseData(): allocatedResponseData {
        return this._allocatedResponseData;
    }
}
export = AtypicalSearchMarkNowAction;
