import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import enums = require('../../components/utility/enums');

/**
 * The Action class for Response Allocation
 */
class ValidateResponseAction extends dataRetrievalAction {

    private _validateResponseReturnData: ValidateResponseReturnData;
    private _isStandardisationSetup: boolean;

    /**
     * Initializing a new instance of allocate action.
     * @param {boolean} success
     */
    constructor(validateResponseReturnData: ValidateResponseReturnData, success: boolean, isStandardisationSetup: boolean) {
        super(action.Source.View, actionType.VALIDATE_RESPONSE, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._validateResponseReturnData = validateResponseReturnData;
        this._isStandardisationSetup = isStandardisationSetup;
    }

    public get validateResponseReturnData(): ValidateResponseReturnData {
        return this._validateResponseReturnData;
    }

    public get isStandardisationSetupValidation(): boolean {
        return this._isStandardisationSetup;
    }
}
export = ValidateResponseAction;