"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateTeamListAction = (function (_super) {
    __extends(UpdateTeamListAction, _super);
    /**
     * Constructor UpdateTeamListAction
     * @param examinerRoleId
     * @param isExpand
     */
    function UpdateTeamListAction(examinerRoleId, isExpand) {
        _super.call(this, action.Source.View, actionType.UPDATE_TEAM_LIST_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
        this._examinerRoleId = examinerRoleId;
        this._isExpand = isExpand;
    }
    Object.defineProperty(UpdateTeamListAction.prototype, "isExpand", {
        /**
         * get expanded
         */
        get: function () {
            return this._isExpand;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateTeamListAction.prototype, "examinerRoleId", {
        /**
         * get current examiner role id
         */
        get: function () {
            return this._examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateTeamListAction;
}(action));
module.exports = UpdateTeamListAction;
//# sourceMappingURL=updateteamlistaction.js.map