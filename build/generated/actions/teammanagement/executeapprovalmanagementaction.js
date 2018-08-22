"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var Immutable = require('immutable');
/**
 * Action class for retrieving MyTeam data
 */
var ExecuteApprovalManagementAction = (function (_super) {
    __extends(ExecuteApprovalManagementAction, _super);
    /**
     * constructor
     * @param success
     * @param actionType
     */
    function ExecuteApprovalManagementAction(success, sepApprovalManagementActionReturn, isMultiLock) {
        _super.call(this, action.Source.View, actionType.EXECUTE_SEP_ACTION, success);
        this._doSEPApprovalManagementActionReturn = sepApprovalManagementActionReturn;
        this._isMultiLock = isMultiLock;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }
    Object.defineProperty(ExecuteApprovalManagementAction.prototype, "SEPApprovalManagementActionReturn", {
        /**
         * Returns the action return
         */
        get: function () {
            return this._doSEPApprovalManagementActionReturn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExecuteApprovalManagementAction.prototype, "SEPApprovalManagementActionResult", {
        /**
         * Returns the sep action result
         */
        get: function () {
            return Immutable.List(this._doSEPApprovalManagementActionReturn.sepApprovalManagementActionResult);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExecuteApprovalManagementAction.prototype, "isMultiLock", {
        /**
         * Returns the is multi lock or not
         */
        get: function () {
            return this._isMultiLock;
        },
        enumerable: true,
        configurable: true
    });
    return ExecuteApprovalManagementAction;
}(dataRetrievalAction));
module.exports = ExecuteApprovalManagementAction;
//# sourceMappingURL=executeapprovalmanagementaction.js.map