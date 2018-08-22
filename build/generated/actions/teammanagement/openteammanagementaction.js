"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for Team Management Open
 */
var OpenTeamManagementAction = (function (_super) {
    __extends(OpenTeamManagementAction, _super);
    /**
     * constructor
     * @param examinerRoleId
     * @param markSchemeGroupId
     * @param isFromHistoryItem
     * @param emitEvent
     */
    function OpenTeamManagementAction(examinerRoleId, markSchemeGroupId, isFromHistoryItem, emitEvent, isFromMultiQigDropDown) {
        _super.call(this, action.Source.View, actionType.OPEN_TEAM_MANAGEMENT);
        this._examinerRoleId = examinerRoleId;
        this._markSchemeGroupId = markSchemeGroupId;
        this._isFromHistoryItem = isFromHistoryItem;
        this._emitEvent = emitEvent;
        this._isFromMultiQigDropDown = isFromMultiQigDropDown;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{examinerRoleId}/g, examinerRoleId.toString()).
            replace(/{markSchemeGroupId}/g, markSchemeGroupId.toString());
    }
    Object.defineProperty(OpenTeamManagementAction.prototype, "examinerRoleId", {
        /**
         * Returns the examinerRoleId
         */
        get: function () {
            return this._examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenTeamManagementAction.prototype, "markSchemeGroupId", {
        /**
         * Returns the markSchemeGroupId
         */
        get: function () {
            return this._markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenTeamManagementAction.prototype, "isFromHistoryItem", {
        /**
         * Returns true if it is from history
         */
        get: function () {
            return this._isFromHistoryItem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenTeamManagementAction.prototype, "canEmit", {
        /**
         * Returns true if needs to be emited
         */
        get: function () {
            return this._emitEvent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenTeamManagementAction.prototype, "isFromMultiQigDropDown", {
        /**
         * Returns true if it is from Multiqigdropdown
         */
        get: function () {
            return this._isFromMultiQigDropDown;
        },
        enumerable: true,
        configurable: true
    });
    return OpenTeamManagementAction;
}(action));
module.exports = OpenTeamManagementAction;
//# sourceMappingURL=openteammanagementaction.js.map