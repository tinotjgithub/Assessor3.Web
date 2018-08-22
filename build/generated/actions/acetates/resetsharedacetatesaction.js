"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for reseting shared acetates.
 */
var ResetSharedAcetatesAction = (function (_super) {
    __extends(ResetSharedAcetatesAction, _super);
    function ResetSharedAcetatesAction() {
        _super.call(this, action.Source.View, actionType.RESET_SHARED_ACETATES_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.
            replace(/{ reset shared acetate invoked}/g, 'true');
    }
    return ResetSharedAcetatesAction;
}(action));
module.exports = ResetSharedAcetatesAction;
//# sourceMappingURL=resetsharedacetatesaction.js.map