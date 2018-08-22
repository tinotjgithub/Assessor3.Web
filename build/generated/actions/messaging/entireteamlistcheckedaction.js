"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var EntireteamlistcheckedAction = (function (_super) {
    __extends(EntireteamlistcheckedAction, _super);
    /**
     * Constructor EntireteamlistcheckedAction
     * @param isChecked
     */
    function EntireteamlistcheckedAction(isChecked) {
        _super.call(this, action.Source.View, actionType.ENTIRE_TEAM_LIST_CHECKED_ACTION);
        this._isChecked = isChecked;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, isChecked.toString());
    }
    Object.defineProperty(EntireteamlistcheckedAction.prototype, "isChecked", {
        /**
         * Get status if the entire team selected or not.
         */
        get: function () {
            return this._isChecked;
        },
        enumerable: true,
        configurable: true
    });
    return EntireteamlistcheckedAction;
}(action));
module.exports = EntireteamlistcheckedAction;
//# sourceMappingURL=entireteamlistcheckedaction.js.map