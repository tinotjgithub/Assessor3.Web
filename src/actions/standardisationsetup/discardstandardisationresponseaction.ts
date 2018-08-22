import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import discardStandardisationResponseReturn = require('../../stores/standardisationsetup/typings/discardstandardisationresponsereturn');

/**
 * Discard provisional response action
 */
class DiscardStandardisationResponseAction extends action {

    private _discardStandardisationResponseReturn: discardStandardisationResponseReturn;

    public esMarkGroupId: Number;
    public displayId: Number;
    /**
     * Constructor
     * @param success
     * @param resultData
     */
    constructor(esMarkGroupIds: Array<Number>, provDisplayId: Number, success: boolean, resultData: discardStandardisationResponseReturn) {
        super(action.Source.View, actionType.DISCARD_STANDARDISATION_RESPONSE);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._discardStandardisationResponseReturn = resultData;
        this.esMarkGroupId = esMarkGroupIds[0];
        this.displayId = provDisplayId;
    }
    /*
     Discard standardisation response return details 
     */
    public get discardStandardisationResponseReturnDetails(): discardStandardisationResponseReturn {
        return this._discardStandardisationResponseReturn;
    }
}

export = DiscardStandardisationResponseAction;
