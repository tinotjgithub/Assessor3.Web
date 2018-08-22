import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import standardisationSortDetails = require('../../components/utility/grid/standardisationsortdetails');

class SortAction extends action {
    private sortDetails: standardisationSortDetails;

    /**
     * sort action constructor
     * @param sortDetails
     */
    constructor(sortDetails: standardisationSortDetails) {
        super(action.Source.View, actionType.STANDARDISATION_SORT_ACTION);
        this.sortDetails = sortDetails;
        this.auditLog.logContent = this.auditLog.logContent;
    }

    public get getStandardisationSortDetails(): standardisationSortDetails {
        return this.sortDetails;
    }
}

export = SortAction;
