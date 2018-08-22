"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var CreateExaminerRoleForAdminRemarkerAction = (function (_super) {
    __extends(CreateExaminerRoleForAdminRemarkerAction, _super);
    /**
     * Constructor
     * @param examinerRoleId
     */
    function CreateExaminerRoleForAdminRemarkerAction(examinerRoleId) {
        _super.call(this, action.Source.View, actionType.CREATE_EXAMINER_ROLE_FOR_ADMIN_REMARKER);
        this.examinerRoleId = examinerRoleId;
    }
    Object.defineProperty(CreateExaminerRoleForAdminRemarkerAction.prototype, "selectedQIGExaminerRoleId", {
        get: function () {
            return this.examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    return CreateExaminerRoleForAdminRemarkerAction;
}(action));
module.exports = CreateExaminerRoleForAdminRemarkerAction;
//# sourceMappingURL=createexaminerroleforadminremarkeraction.js.map