"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action Can Execute Approval Management Action
 */
var CanExecuteApprovalManagementAction = (function (_super) {
    __extends(CanExecuteApprovalManagementAction, _super);
    /**
     * constructor
     * @param doSEPApprovalManagementActionArgument
     */
    function CanExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument) {
        _super.call(this, action.Source.View, actionType.CAN_EXECUTE_SEP_ACTION);
        this._doSEPApprovalManagementActionArgument = doSEPApprovalManagementActionArgument;
        this.auditLog.logContent = this.auditLog.logContent;
    }
    Object.defineProperty(CanExecuteApprovalManagementAction.prototype, "doSEPApprovalManagementActionArgument", {
        /**
         *  Return the DoSEPApprovalManagementActionArgument
         */
        get: function () {
            return this._doSEPApprovalManagementActionArgument;
        },
        enumerable: true,
        configurable: true
    });
    return CanExecuteApprovalManagementAction;
}(action));
module.exports = CanExecuteApprovalManagementAction;
//# sourceMappingURL=canexecuteapprovalmanagementaction.js.map