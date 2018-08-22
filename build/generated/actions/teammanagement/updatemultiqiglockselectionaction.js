"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateMultiQigLockSelectionAction = (function (_super) {
    __extends(UpdateMultiQigLockSelectionAction, _super);
    function UpdateMultiQigLockSelectionAction(markSchemeGroupId, isSelectedAll) {
        _super.call(this, action.Source.View, actionType.UPDATE_MULTI_QIG_LOCK_SELECTION);
        this._markSchemeGroupId = markSchemeGroupId;
        this._isSelectedAll = isSelectedAll;
        this.auditLog.logContent = this.auditLog.logContent.
            replace(/{ markSchemeGroupId}/g, markSchemeGroupId.toString());
    }
    Object.defineProperty(UpdateMultiQigLockSelectionAction.prototype, "markSchemeGroupId", {
        get: function () {
            return this._markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateMultiQigLockSelectionAction.prototype, "isSelectedAll", {
        get: function () {
            return this._isSelectedAll;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateMultiQigLockSelectionAction;
}(action));
module.exports = UpdateMultiQigLockSelectionAction;
//# sourceMappingURL=updatemultiqiglockselectionaction.js.map