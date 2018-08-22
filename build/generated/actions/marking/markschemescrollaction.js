"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var MarkSchemeScrollAction = (function (_super) {
    __extends(MarkSchemeScrollAction, _super);
    /**
     * Constructor
     */
    function MarkSchemeScrollAction() {
        _super.call(this, action.Source.View, actionType.MARK_SCHEME_SCROLL_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
    return MarkSchemeScrollAction;
}(action));
module.exports = MarkSchemeScrollAction;
//# sourceMappingURL=markschemescrollaction.js.map