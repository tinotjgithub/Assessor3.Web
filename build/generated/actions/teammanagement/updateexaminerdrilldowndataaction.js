"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for storing examiner drill down information
 */
var UpdateExaminerDrillDownDataAction = (function (_super) {
    __extends(UpdateExaminerDrillDownDataAction, _super);
    /**
     * constructor
     * @param examinerDrillDownData
     * @param isFromHistory
     */
    function UpdateExaminerDrillDownDataAction(examinerDrillDownData, isFromHistory) {
        _super.call(this, action.Source.View, actionType.UPDATE_EXAMINER_DRILL_DOWN_DATA);
        this._examinerDrillDownData = examinerDrillDownData;
        this._isFromHistory = isFromHistory;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{examinerId}/g, examinerDrillDownData.examinerId.toString()).
            replace(/{examinerRoleId}/g, examinerDrillDownData.examinerRoleId.toString());
    }
    Object.defineProperty(UpdateExaminerDrillDownDataAction.prototype, "examinerDrillDownData", {
        /**
         * Returns the examiner drill down information
         */
        get: function () {
            return this._examinerDrillDownData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateExaminerDrillDownDataAction.prototype, "isFromHistory", {
        /**
         * Returns true if it is from history
         */
        get: function () {
            return this._isFromHistory;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateExaminerDrillDownDataAction;
}(action));
module.exports = UpdateExaminerDrillDownDataAction;
//# sourceMappingURL=updateexaminerdrilldowndataaction.js.map