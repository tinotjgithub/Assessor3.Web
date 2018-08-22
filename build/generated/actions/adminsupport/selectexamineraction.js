"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for Select Examiner Action
 */
var SelectExaminerAction = (function (_super) {
    __extends(SelectExaminerAction, _super);
    /**
     * Constructor SelectExaminerAction
     * @param examinerId
     */
    function SelectExaminerAction(examinerId) {
        _super.call(this, action.Source.View, actionType.SUPPORTLOGIN_EXAMINER_SELECTED);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', examinerId.toString());
        this._selectedExaminerId = examinerId;
    }
    Object.defineProperty(SelectExaminerAction.prototype, "examinerId", {
        /**
         * This method will return the examiner Id
         */
        get: function () {
            return this._selectedExaminerId;
        },
        enumerable: true,
        configurable: true
    });
    return SelectExaminerAction;
}(action));
module.exports = SelectExaminerAction;
//# sourceMappingURL=selectexamineraction.js.map