"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for change examiner status
 */
var ChangeExaminerStatusAction = (function (_super) {
    __extends(ChangeExaminerStatusAction, _super);
    /**
     * constructor
     * @param success
     * @param examinerStatusReturn
     */
    function ChangeExaminerStatusAction(success, examinerstatusReturn) {
        _super.call(this, action.Source.View, actionType.CHANGE_EXAMINER_STATUS);
        this._success = success;
        this._examinerStatusReturn = examinerstatusReturn;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', success.toString());
    }
    Object.defineProperty(ChangeExaminerStatusAction.prototype, "success", {
        /**
         * Success status
         */
        get: function () {
            return this._success;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChangeExaminerStatusAction.prototype, "examinerStatusReturn", {
        /**
         * Examiner status return
         */
        get: function () {
            return this._examinerStatusReturn;
        },
        enumerable: true,
        configurable: true
    });
    return ChangeExaminerStatusAction;
}(action));
module.exports = ChangeExaminerStatusAction;
//# sourceMappingURL=changeexaminerstatusaction.js.map