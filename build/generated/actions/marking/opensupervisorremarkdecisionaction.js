"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to open supervisor remark decision popup.
 */
var OpenSupervisorRemarkDecisionAction = (function (_super) {
    __extends(OpenSupervisorRemarkDecisionAction, _super);
    /**
     * Constructor
     */
    function OpenSupervisorRemarkDecisionAction() {
        _super.call(this, action.Source.View, actionType.OPEN_SUPERVISOR_REMARK_DECISION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
    return OpenSupervisorRemarkDecisionAction;
}(action));
module.exports = OpenSupervisorRemarkDecisionAction;
//# sourceMappingURL=opensupervisorremarkdecisionaction.js.map