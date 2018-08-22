"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ClearTeamListSelectionAction = (function (_super) {
    __extends(ClearTeamListSelectionAction, _super);
    /**
     * Constructor ClearTeamListSelectionAction
     * @param examinerRoleId
     */
    function ClearTeamListSelectionAction(examinerRoleId) {
        _super.call(this, action.Source.View, actionType.CLEAR_TEAM_LIST_SELECTION_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
        this._examinerRoleId = examinerRoleId;
    }
    Object.defineProperty(ClearTeamListSelectionAction.prototype, "examinerRoleId", {
        /**
         * get current examiner role id
         */
        get: function () {
            return this._examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    return ClearTeamListSelectionAction;
}(action));
module.exports = ClearTeamListSelectionAction;
//# sourceMappingURL=clearteamlistselectionaction.js.map