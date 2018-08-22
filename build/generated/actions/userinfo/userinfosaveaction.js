"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 *
 * @param {boolean} success
 */
var UserInfoSaveAction = (function (_super) {
    __extends(UserInfoSaveAction, _super);
    /**
     * Initializing a new instance of UserInfo Argument.
     * @param {boolean} success
     */
    function UserInfoSaveAction(success, examinerEmailArgument) {
        _super.call(this, action.Source.View, actionType.USERINFO_SAVE, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this.emailSaveSucess = success;
        this.examinerEmail = examinerEmailArgument;
    }
    Object.defineProperty(UserInfoSaveAction.prototype, "getSaveSuccess", {
        get: function () {
            return this.emailSaveSucess;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoSaveAction.prototype, "getExaminerInfo", {
        get: function () {
            return this.examinerEmail;
        },
        enumerable: true,
        configurable: true
    });
    return UserInfoSaveAction;
}(dataRetrievalAction));
module.exports = UserInfoSaveAction;
//# sourceMappingURL=userinfosaveaction.js.map