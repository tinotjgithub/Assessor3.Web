"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var GetTeamAction = (function (_super) {
    __extends(GetTeamAction, _super);
    /**
     * Constructor GetTeamAction
     * @param success
     * @param team
     * @param examinerRoleId
     */
    function GetTeamAction(success, team, examinerRoleId) {
        _super.call(this, action.Source.View, actionType.GET_TEAM_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._team = team;
        this._examinerRoleId = examinerRoleId;
    }
    Object.defineProperty(GetTeamAction.prototype, "team", {
        /**
         * get team
         */
        get: function () {
            return this._team;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetTeamAction.prototype, "examinerRoleId", {
        /**
         * get current examiner role id
         */
        get: function () {
            return this._examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    return GetTeamAction;
}(dataRetrievalAction));
module.exports = GetTeamAction;
//# sourceMappingURL=getteamaction.js.map