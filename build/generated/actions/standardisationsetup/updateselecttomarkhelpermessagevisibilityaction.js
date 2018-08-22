"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateSelectToMarkHelperMessageVisibilityAction = (function (_super) {
    __extends(UpdateSelectToMarkHelperMessageVisibilityAction, _super);
    /**
     * Constructore.
     * @param success
     * @param isVisible
     */
    function UpdateSelectToMarkHelperMessageVisibilityAction(isVisible) {
        _super.call(this, action.Source.View, actionType.UPDATE_SELECTTOMARK_HELPER_MESSAGE_VISIBILITY);
        this._isVisible = isVisible;
    }
    Object.defineProperty(UpdateSelectToMarkHelperMessageVisibilityAction.prototype, "isHelperMessageVisible", {
        get: function () {
            return this._isVisible;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateSelectToMarkHelperMessageVisibilityAction;
}(action));
module.exports = UpdateSelectToMarkHelperMessageVisibilityAction;
//# sourceMappingURL=updateselecttomarkhelpermessagevisibilityaction.js.map