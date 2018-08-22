import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import responseSortDetails = require('../../components/utility/grid/responsesortdetails');

class SortAction extends action {
    private sortDetails: responseSortDetails;

    /**
     * sort action constructor
     * @param sortDetails
     */
    constructor(sortDetails: responseSortDetails) {
        super(action.Source.View, actionType.SORT_ACTION);
        this.sortDetails = sortDetails;
        this.auditLog.logContent = this.auditLog.logContent;
    }

    public get getResponseSortDetails(): responseSortDetails {
        return this.sortDetails;
    }
}

export = SortAction;
