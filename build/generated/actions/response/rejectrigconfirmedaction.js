"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for Reject rig confirmation.
 */
var RejectRigConfirmedAction = (function (_super) {
    __extends(RejectRigConfirmedAction, _super);
    /**
     * Constructor RejectRigConfirmationAction
     */
    function RejectRigConfirmedAction(displayId) {
        _super.call(this, action.Source.View, actionType.REJECT_RIG_CONFIRMATION_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{Display_Id}/g, displayId.toString());
    }
    Object.defineProperty(RejectRigConfirmedAction.prototype, "DisplayId", {
        /**
         * returns display id of a response which is rejected.
         */
        get: function () {
            return this._displayId;
        },
        enumerable: true,
        configurable: true
    });
    return RejectRigConfirmedAction;
}(action));
module.exports = RejectRigConfirmedAction;
//# sourceMappingURL=rejectrigconfirmedaction.js.map