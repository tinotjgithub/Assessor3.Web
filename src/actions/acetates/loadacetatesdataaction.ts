import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class LoadAcetatesDataAction extends dataRetrievalAction {
    private acetatesList: Immutable.List<Acetate>;

    /**
     * Constructor of LoadAcetatesDataAction
     * @param success
     * @param acetatesData
     */
    constructor(success: boolean, acetatesList: Immutable.List<Acetate>) {
        super(action.Source.View, actionType.LOAD_ACETATES_DATA_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this.acetatesList = acetatesList;
    }

    /**
     * Retrieves acetates data
     */
    public get acetatesData(): Immutable.List<Acetate> {
        return this.acetatesList;
    }
}

export = LoadAcetatesDataAction;
