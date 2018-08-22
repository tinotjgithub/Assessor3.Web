"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for reseting Multi Qig Lock Data.
 */
var MultiLockDataResetAction = (function (_super) {
    __extends(MultiLockDataResetAction, _super);
    function MultiLockDataResetAction() {
        _super.call(this, action.Source.View, actionType.MULTI_LOCK_DATA_RESET);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, 'true');
    }
    return MultiLockDataResetAction;
}(action));
module.exports = MultiLockDataResetAction;
//# sourceMappingURL=multilockdataresetaction.js.map