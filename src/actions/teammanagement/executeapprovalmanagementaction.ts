import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import Immutable = require('immutable');

/**
 * Action class for retrieving MyTeam data
 */
class ExecuteApprovalManagementAction extends dataRetrievalAction {

    private _doSEPApprovalManagementActionReturn: DoSEPApprovalManagementActionReturn;

    private _isMultiLock: boolean;

    /**
     * constructor
     * @param success
     * @param actionType
     */
    constructor(success: boolean, sepApprovalManagementActionReturn: DoSEPApprovalManagementActionReturn,
        isMultiLock: boolean) {
        super(action.Source.View, actionType.EXECUTE_SEP_ACTION, success);
        this._doSEPApprovalManagementActionReturn = sepApprovalManagementActionReturn;
        this._isMultiLock = isMultiLock;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    /**
     * Returns the action return
     */
    public get SEPApprovalManagementActionReturn(): DoSEPApprovalManagementActionReturn {
        return this._doSEPApprovalManagementActionReturn;
    }

    /**
     * Returns the sep action result
     */
    public get SEPApprovalManagementActionResult(): Immutable.List<DoSEPApprovalManagementActionResult> {
        return Immutable.List<DoSEPApprovalManagementActionResult>
            (this._doSEPApprovalManagementActionReturn.sepApprovalManagementActionResult);
    }

    /**
     * Returns the is multi lock or not
     */
    public get isMultiLock(): boolean {
        return this._isMultiLock;
    }
}

export = ExecuteApprovalManagementAction;
