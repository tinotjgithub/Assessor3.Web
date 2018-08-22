"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for Team Management Left Main Link Selection
 */
var TeamManagementTabSelectAction = (function (_super) {
    __extends(TeamManagementTabSelectAction, _super);
    /**
     * constructor
     * @selectedTab The type of Team Management Tab
     */
    function TeamManagementTabSelectAction(selectedTab) {
        _super.call(this, action.Source.View, actionType.TEAM_MANAGEMENT_TAB_CLICK_ACTION);
        this._selectedTab = selectedTab;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{selectedTab}/g, selectedTab.toString());
    }
    Object.defineProperty(TeamManagementTabSelectAction.prototype, "selectedTab", {
        /**
         * Get the team Management Link Type
         */
        get: function () {
            return this._selectedTab;
        },
        enumerable: true,
        configurable: true
    });
    return TeamManagementTabSelectAction;
}(action));
module.exports = TeamManagementTabSelectAction;
//# sourceMappingURL=teammanagementtabselectaction.js.map