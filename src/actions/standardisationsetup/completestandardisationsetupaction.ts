import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Complete Standardisation action
 */
class CompleteStandardisationSetupAction extends action {

    private _completeStandardisationSetupReturnDetails: CompleteStandardisationSetupReturn;

    /**
     * Constructor
     * @param success
     * @param resultData
     */
    constructor(success: boolean, resultData: CompleteStandardisationSetupReturn) {
        super(action.Source.View, actionType.COMPLETE_STANDARDISATION_SETUP);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._completeStandardisationSetupReturnDetails = resultData;
    }
    /*
     Complete Standardisation return details 
     */
    public get completeStandardisationSetupReturnDetails(): CompleteStandardisationSetupReturn {
        return this._completeStandardisationSetupReturnDetails;
    }
}

export = CompleteStandardisationSetupAction;
