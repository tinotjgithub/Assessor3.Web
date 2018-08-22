"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ActionInterruptedAction = (function (_super) {
    __extends(ActionInterruptedAction, _super);
    /**
     * Constructor
     * @param allowNavigation
     */
    function ActionInterruptedAction(allowNavigation, isFromLogout) {
        if (allowNavigation === void 0) { allowNavigation = false; }
        if (isFromLogout === void 0) { isFromLogout = false; }
        _super.call(this, action.Source.View, actionType.ACTION_INTERRUPTED_ACTION);
        this._allowNavigation = allowNavigation;
        this._isFromLogout = isFromLogout;
    }
    Object.defineProperty(ActionInterruptedAction.prototype, "allowNavigation", {
        /**
         * Gets a value indicating whether the navigation is Needed.
         * @returns
         */
        get: function () {
            return this._allowNavigation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionInterruptedAction.prototype, "isFromLogout", {
        /**
         * Gets a value indicating interruption was from logout
         */
        get: function () {
            return this._isFromLogout;
        },
        enumerable: true,
        configurable: true
    });
    return ActionInterruptedAction;
}(action));
module.exports = ActionInterruptedAction;
//# sourceMappingURL=actoninterruptedaction.js.map