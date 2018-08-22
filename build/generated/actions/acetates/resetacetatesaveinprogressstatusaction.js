"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for reseting acetate save in progress status.
 */
var ResetAcetateSaveInProgressStatusAction = (function (_super) {
    __extends(ResetAcetateSaveInProgressStatusAction, _super);
    function ResetAcetateSaveInProgressStatusAction(acetatesList) {
        _super.call(this, action.Source.View, actionType.RESET_ACETATE_SAVE_IN_PROGRESS_STATUS_ACTION);
        this._acetatesList = acetatesList;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ acetates list count}/g, acetatesList.size.toString());
    }
    Object.defineProperty(ResetAcetateSaveInProgressStatusAction.prototype, "acetatesList", {
        /**
         * Returns acetate list.
         */
        get: function () {
            return this._acetatesList;
        },
        enumerable: true,
        configurable: true
    });
    return ResetAcetateSaveInProgressStatusAction;
}(action));
module.exports = ResetAcetateSaveInProgressStatusAction;
//# sourceMappingURL=resetacetatesaveinprogressstatusaction.js.map