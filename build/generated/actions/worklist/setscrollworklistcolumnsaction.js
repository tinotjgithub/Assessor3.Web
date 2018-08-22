"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for Worklist List view set scoll Action
 */
var SetScrollWorklistColumnsAction = (function (_super) {
    __extends(SetScrollWorklistColumnsAction, _super);
    /**
     * Constructor SetScrollWorklistColumnsAction
     */
    function SetScrollWorklistColumnsAction() {
        _super.call(this, action.Source.View, actionType.SETSCROLL_WORKLISTCOLUMNS_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
    return SetScrollWorklistColumnsAction;
}(action));
module.exports = SetScrollWorklistColumnsAction;
//# sourceMappingURL=setscrollworklistcolumnsaction.js.map