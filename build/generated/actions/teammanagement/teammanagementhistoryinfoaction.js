"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var TeamManagementHistoryInfoAction = (function (_super) {
    __extends(TeamManagementHistoryInfoAction, _super);
    /**
     * Constructor
     * @param historyItem
     * @param markingMode
     * @param markingMode
     * @param failureCode
     */
    function TeamManagementHistoryInfoAction(historyItem, markingMode, failureCode) {
        _super.call(this, action.Source.View, actionType.TEAM_MANAGEMENT_HISTORY_INFO_ACTION);
        this._historyItem = historyItem;
        this._markingMode = markingMode;
        this._failureCode = failureCode;
    }
    Object.defineProperty(TeamManagementHistoryInfoAction.prototype, "historyItem", {
        /**
         * Returns the current history item
         */
        get: function () {
            return this._historyItem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementHistoryInfoAction.prototype, "markingMode", {
        /**
         * Returns the marker mode
         */
        get: function () {
            return this._markingMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementHistoryInfoAction.prototype, "failureCode", {
        /**
         * Returns the failure code
         */
        get: function () {
            return this._failureCode;
        },
        enumerable: true,
        configurable: true
    });
    return TeamManagementHistoryInfoAction;
}(action));
module.exports = TeamManagementHistoryInfoAction;
//# sourceMappingURL=teammanagementhistoryinfoaction.js.map