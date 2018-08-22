"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var HideReuseToggleAction = (function (_super) {
    __extends(HideReuseToggleAction, _super);
    /**
     * Hide Reuse Toggle action constructor
     */
    function HideReuseToggleAction() {
        _super.call(this, action.Source.View, actionType.HIDE_REUSE_TOGGLE_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
    return HideReuseToggleAction;
}(action));
module.exports = HideReuseToggleAction;
//# sourceMappingURL=hidereusetoggleaction.js.map