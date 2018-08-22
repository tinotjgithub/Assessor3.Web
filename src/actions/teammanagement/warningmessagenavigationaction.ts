import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for warning message navigation.
 */
class WarningMessageNavigationAction extends action {

    private _failureCode: enums.FailureCode;
    private _warningMessageAction: enums.WarningMessageAction;

    /**
     * constructor
     * @param failurecode
     * @param warningmessageaction
     */
    constructor(failureCode: enums.FailureCode, warningMessageAction: enums.WarningMessageAction) {
        super(action.Source.View, actionType.WARNING_MESSAGE_NAVIGATION_ACTION);
        this._failureCode = failureCode;
        this._warningMessageAction = warningMessageAction;
        this.auditLog.logContent = this.auditLog.logContent.
            replace(/{ Failure code}/g, failureCode.toString());
    }

    /**
     * Return failure code.
     */
    public get failureCode(): enums.FailureCode {
        return this._failureCode;
    }

    /**
     * Return warning message action.
     */
    public get warningMessageAction(): enums.WarningMessageAction {
        return this._warningMessageAction;
    }

}

export = WarningMessageNavigationAction;
