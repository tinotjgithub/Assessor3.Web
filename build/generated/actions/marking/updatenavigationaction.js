"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateNavigationAction = (function (_super) {
    __extends(UpdateNavigationAction, _super);
    /**
     * Constructor for UpdateNavigationAction
     * @param navigateTo
     * @param doEmit
     */
    function UpdateNavigationAction(navigateTo, doEmit) {
        _super.call(this, action.Source.View, actionType.NAVIGATION_UPDATE_ACTION);
        this._doEmit = true;
        this._navigateTo = navigateTo;
        this._doEmit = doEmit;
    }
    Object.defineProperty(UpdateNavigationAction.prototype, "navigateTo", {
        /**
         * Show Icons in Header bar
         * @returns flag whether show header icons
         */
        get: function () {
            return this._navigateTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateNavigationAction.prototype, "doEmit", {
        /**
         * to ensure emiting event
         * @returns true if it is valid to emit
         */
        get: function () {
            return this._doEmit;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateNavigationAction;
}(action));
module.exports = UpdateNavigationAction;
//# sourceMappingURL=updatenavigationaction.js.map