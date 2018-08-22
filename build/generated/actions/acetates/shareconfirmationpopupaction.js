"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ShareConfirmationPopupAction = (function (_super) {
    __extends(ShareConfirmationPopupAction, _super);
    /**
     * Constructor
     * @param clientToken
     * @param isShared
     */
    function ShareConfirmationPopupAction(clientToken, isShared) {
        _super.call(this, action.Source.View, actionType.SHARE_CONFIRMATION_POPUP_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{action}/g, clientToken.toString());
        this._clientToken = clientToken;
        this._isShared = isShared;
    }
    Object.defineProperty(ShareConfirmationPopupAction.prototype, "clienToken", {
        /**
         * Get clientToken of selected acetate
         */
        get: function () {
            return this._clientToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareConfirmationPopupAction.prototype, "ShareMultiline", {
        /**
         * Get shared status of selected acetate
         */
        get: function () {
            return this._isShared;
        },
        enumerable: true,
        configurable: true
    });
    return ShareConfirmationPopupAction;
}(action));
module.exports = ShareConfirmationPopupAction;
//# sourceMappingURL=shareconfirmationpopupaction.js.map