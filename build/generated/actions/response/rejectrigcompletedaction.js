"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for Reject rig Completed action.
 */
var RejectRigCompletedAction = (function (_super) {
    __extends(RejectRigCompletedAction, _super);
    /**
     * Constructor RejectRigCompletedAction
     */
    function RejectRigCompletedAction(success, isNextResponseAvailable) {
        _super.call(this, action.Source.View, actionType.REJECT_RIG_COMPLETED_ACTION);
        this._success = success;
        this._nextResponseAvailable = isNextResponseAvailable;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{status}/g, success.toString());
    }
    Object.defineProperty(RejectRigCompletedAction.prototype, "success", {
        /**
         * return call status.
         */
        get: function () {
            return this._success;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RejectRigCompletedAction.prototype, "isNextResponseAvailable", {
        /**
         * return boolean based on next response avaliablity.
         */
        get: function () {
            return this._nextResponseAvailable;
        },
        enumerable: true,
        configurable: true
    });
    return RejectRigCompletedAction;
}(action));
module.exports = RejectRigCompletedAction;
//# sourceMappingURL=rejectrigcompletedaction.js.map