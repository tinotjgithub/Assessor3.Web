"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to open markchange reason popup.
 */
var OpenMarkChangeReasonAction = (function (_super) {
    __extends(OpenMarkChangeReasonAction, _super);
    /**
     * Constructor
     */
    function OpenMarkChangeReasonAction() {
        _super.call(this, action.Source.View, actionType.OPEN_MARK_CHANGE_REASON_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
    return OpenMarkChangeReasonAction;
}(action));
module.exports = OpenMarkChangeReasonAction;
//# sourceMappingURL=openmarkchangereasonaction.js.map