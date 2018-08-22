"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateselectedteamlistAction = (function (_super) {
    __extends(UpdateselectedteamlistAction, _super);
    /**
     * Constructor UpdatetoaddresslistactionAction
     * @param isSaved
     */
    function UpdateselectedteamlistAction(isSaved) {
        _super.call(this, action.Source.View, actionType.UPDATE_SELECTED_TEAM_LIST_ACTION);
        this._isSaved = isSaved;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, isSaved.toString());
    }
    Object.defineProperty(UpdateselectedteamlistAction.prototype, "isSaved", {
        /**
         * Get status if the selected team is saved in the store or not.
         */
        get: function () {
            return this._isSaved;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateselectedteamlistAction;
}(action));
module.exports = UpdateselectedteamlistAction;
//# sourceMappingURL=updateselectedteamlistaction.js.map