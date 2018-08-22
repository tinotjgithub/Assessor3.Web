"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var GetTeamOverviewDataAction = (function (_super) {
    __extends(GetTeamOverviewDataAction, _super);
    /**
     * COnstructor for the Team overview action
     * @param success
     * @param markSchemeGroupId
     * @param examinerRoleId
     * @param teamOverviewCount
     * @param isFromRememberQig
     * @param isHelpExaminersDataRefreshRequired
     */
    function GetTeamOverviewDataAction(success, markSchemeGroupId, examinerRoleId, teamOverviewCount, isFromRememberQig, isHelpExaminersDataRefreshRequired) {
        _super.call(this, action.Source.View, actionType.GET_TEAM_OVERVIEW_DATA_FETCH_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace('{examinerRoleId}', examinerRoleId.toString()).replace('{markSchemeGroupId}', markSchemeGroupId.toString());
        if (success) {
            this._teamOverviewCountData = teamOverviewCount;
            this._isFromRememberQig = isFromRememberQig;
            this._isHelpExaminersDataRefreshRequired = isHelpExaminersDataRefreshRequired;
        }
        else {
            this._teamOverviewCountData = undefined;
        }
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', success.toString());
    }
    Object.defineProperty(GetTeamOverviewDataAction.prototype, "teamOverviewCountData", {
        /**
         * The getter method for giving back the team overview Counts
         */
        get: function () {
            return this._teamOverviewCountData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetTeamOverviewDataAction.prototype, "isFromRememberQig", {
        /**
         * returns true if call is from remember qig
         */
        get: function () {
            return this._isFromRememberQig;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetTeamOverviewDataAction.prototype, "isHelpExaminersDataRefreshRequired", {
        /**
         * returns true when the help examiners data refresh is required when count is loaded
         */
        get: function () {
            return this._isHelpExaminersDataRefreshRequired;
        },
        enumerable: true,
        configurable: true
    });
    return GetTeamOverviewDataAction;
}(dataRetrievalAction));
module.exports = GetTeamOverviewDataAction;
//# sourceMappingURL=getteamoverviewdataaction.js.map