"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionTypes = require('../base/actiontypes');
var ShowHeaderIconsAction = (function (_super) {
    __extends(ShowHeaderIconsAction, _super);
    /**
     * Constructor for ShowHeaderIconsAction
     * @param showIcons
     */
    function ShowHeaderIconsAction(showIcons) {
        if (showIcons === void 0) { showIcons = true; }
        _super.call(this, action.Source.View, actionTypes.SHOW_HEADER_ICONS);
        this._showHeaderIcons = showIcons;
    }
    Object.defineProperty(ShowHeaderIconsAction.prototype, "showHeaderIcons", {
        /**
         * Show Icons in Header bar
         * @returns flag whether show header icons
         */
        get: function () {
            return this._showHeaderIcons;
        },
        enumerable: true,
        configurable: true
    });
    return ShowHeaderIconsAction;
}(action));
module.exports = ShowHeaderIconsAction;
//# sourceMappingURL=showheadericonsaction.js.map