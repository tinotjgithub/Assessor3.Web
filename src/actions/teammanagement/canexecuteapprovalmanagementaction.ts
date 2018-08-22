import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action Can Execute Approval Management Action
 */
class CanExecuteApprovalManagementAction extends action {

    private _doSEPApprovalManagementActionArgument: DoSEPApprovalManagementActionArgument;

    /**
     * constructor
     * @param doSEPApprovalManagementActionArgument
     */
    constructor(doSEPApprovalManagementActionArgument: DoSEPApprovalManagementActionArgument) {
        super(action.Source.View, actionType.CAN_EXECUTE_SEP_ACTION);
        this._doSEPApprovalManagementActionArgument = doSEPApprovalManagementActionArgument;
        this.auditLog.logContent = this.auditLog.logContent;
    }

    /**
     *  Return the DoSEPApprovalManagementActionArgument
     */
    public get doSEPApprovalManagementActionArgument(): DoSEPApprovalManagementActionArgument {
        return this._doSEPApprovalManagementActionArgument;
    }
}

export = CanExecuteApprovalManagementAction;
