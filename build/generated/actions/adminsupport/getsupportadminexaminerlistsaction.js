"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var GetSupportAdminExaminerListsAction = (function (_super) {
    __extends(GetSupportAdminExaminerListsAction, _super);
    /**
     * Constructor
     * @param success
     * @param json
     */
    function GetSupportAdminExaminerListsAction(success, json) {
        _super.call(this, action.Source.View, actionType.GET_SUPPORT_ADMIN_EXAMINER_LISTS);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._supportAdminExaminerList = json;
    }
    Object.defineProperty(GetSupportAdminExaminerListsAction.prototype, "SupportAdminExaminerList", {
        /**
         * returns the Support Admin Examiner List
         */
        get: function () {
            return this._supportAdminExaminerList;
        },
        enumerable: true,
        configurable: true
    });
    return GetSupportAdminExaminerListsAction;
}(action));
module.exports = GetSupportAdminExaminerListsAction;
//# sourceMappingURL=getsupportadminexaminerlistsaction.js.map