"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for displaying logout confirmation popup.
 */
var ShowLogoutPopupAction = (function (_super) {
    __extends(ShowLogoutPopupAction, _super);
    /**
     * @constructor
     */
    function ShowLogoutPopupAction() {
        _super.call(this, action.Source.View, actionType.SHOW_LOGOUT_POPUP_ACTION);
    }
    return ShowLogoutPopupAction;
}(action));
module.exports = ShowLogoutPopupAction;
//# sourceMappingURL=showlogoutpopupaction.js.map