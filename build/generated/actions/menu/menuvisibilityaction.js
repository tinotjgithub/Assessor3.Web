"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for Menu Wrapper Visibility.
 */
var MenuVisibilityAction = (function (_super) {
    __extends(MenuVisibilityAction, _super);
    /**
     * @constructor
     */
    function MenuVisibilityAction(doVisible) {
        _super.call(this, action.Source.View, actionType.MENU_VISIBILITY_ACTION);
        this._doVisibleMenu = doVisible;
    }
    Object.defineProperty(MenuVisibilityAction.prototype, "doVisibleMenu", {
        /**
         * Get menu visiblity
         */
        get: function () {
            return this._doVisibleMenu;
        },
        enumerable: true,
        configurable: true
    });
    return MenuVisibilityAction;
}(action));
module.exports = MenuVisibilityAction;
//# sourceMappingURL=menuvisibilityaction.js.map