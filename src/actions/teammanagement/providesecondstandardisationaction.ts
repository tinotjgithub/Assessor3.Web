import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import setSecondStandardisationReturn = require('../../dataservices/teammanagement/typings/setsecondstandardisationreturn');

/**
 * Action class for second standardisation.
 */
class ProvideSecondStandardisationAction extends action {

    private _success: boolean;
    private _secondStandardisationReturn: setSecondStandardisationReturn;

    /**
     * constructor
     * @param success
     * @param secondStandardisationReturn
     */
    constructor(success: boolean, secondStandardisationReturn: setSecondStandardisationReturn) {
        super(action.Source.View, actionType.PROVIDE_SECOND_STANDARDISATION);
        this._success = success;
        this._secondStandardisationReturn = secondStandardisationReturn;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', success.toString());
    }

    /**
     * Success status
     */
    public get success(): boolean {
        return this._success;
    }

    /**
     * Examiner status return
     */
    public get secondStandardisationReturn(): setSecondStandardisationReturn {
        return this._secondStandardisationReturn;
    }
}

export = ProvideSecondStandardisationAction;
