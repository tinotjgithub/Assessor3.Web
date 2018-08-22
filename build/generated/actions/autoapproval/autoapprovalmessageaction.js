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
 * Action class for Auto approval message status update.
 */
var AutoApprovalMessageAction = (function (_super) {
    __extends(AutoApprovalMessageAction, _super);
    /**
     * @constructor
     */
    function AutoApprovalMessageAction(success) {
        _super.call(this, action.Source.View, actionType.AUTO_APPROVAL_MESSAGE_UPDATE, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    return AutoApprovalMessageAction;
}(dataRetrievalAction));
module.exports = AutoApprovalMessageAction;
//# sourceMappingURL=autoapprovalmessageaction.js.map