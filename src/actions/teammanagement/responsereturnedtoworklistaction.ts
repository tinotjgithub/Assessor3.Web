import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for show the returnresponsetomarkerworklist confirmation popup.
 */
class ResponseReturnedToWorklistAction extends action {

    private _returnResponseResult: enums.ReturnToMarkerResult;

    /**
     * Initializing a new instance.
     */
    constructor(returnResponseResult: enums.ReturnToMarkerResult) {
        super(action.Source.View, actionType.RETURNED_RESPONSE_TO_WORKLIST_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{result}/g, returnResponseResult.toString());
        this._returnResponseResult = returnResponseResult;
    }

    // Gets the result of return response operation
    public get returnResponseResult(): enums.ReturnToMarkerResult {
        return this._returnResponseResult;
    }
}

export = ResponseReturnedToWorklistAction;