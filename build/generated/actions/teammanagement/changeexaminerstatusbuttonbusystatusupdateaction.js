"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for setting change examiner status button busy
 */
var ChangeExaminerStatusButtonBusyStatusUpdateAction = (function (_super) {
    __extends(ChangeExaminerStatusButtonBusyStatusUpdateAction, _super);
    /**
     * constructor
     */
    function ChangeExaminerStatusButtonBusyStatusUpdateAction() {
        _super.call(this, action.Source.View, actionType.SET_CHANGE_STATUS_BUTTON_BUSY_ACTION);
    }
    return ChangeExaminerStatusButtonBusyStatusUpdateAction;
}(action));
module.exports = ChangeExaminerStatusButtonBusyStatusUpdateAction;
//# sourceMappingURL=changeexaminerstatusbuttonbusystatusupdateaction.js.map