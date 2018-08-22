import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import atypicalresponsesearchresult = require('../../dataservices/response/atypicalresponsesearchresult');

/**
 * The Action class for Response Allocation
 */
class AtypicalResponseSearchAction extends dataRetrievalAction {

    private _atypicalSearchResultData: atypicalresponsesearchresult;

    /**
     * Initializing a new instance of allocate action.
     * @param {boolean} success
     */
    constructor(data: atypicalresponsesearchresult, success: boolean) {
        super(action.Source.View, actionType.ATYPICAL_RESPONSE_SEARCH, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._atypicalSearchResultData = data;
    }

    public get atypicalSearchResultData(): atypicalresponsesearchresult {
        return this._atypicalSearchResultData;
    }
}
export = AtypicalResponseSearchAction;