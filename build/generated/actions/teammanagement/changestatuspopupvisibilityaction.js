"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for change examiner status popup visibility.
 */
var ChangeStatusPopupVisibilityAction = (function (_super) {
    __extends(ChangeStatusPopupVisibilityAction, _super);
    /**
     * constructor
     * @param doVisiblePopup
     */
    function ChangeStatusPopupVisibilityAction(doVisiblePopup) {
        _super.call(this, action.Source.View, actionType.CHANGE_STATUS_POPUP_VISIBILITY_ACTION);
        this._doVisiblePopup = doVisiblePopup;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, doVisiblePopup.toString());
    }
    Object.defineProperty(ChangeStatusPopupVisibilityAction.prototype, "doVisiblePopup", {
        /**
         * popup visibility status.
         */
        get: function () {
            return this._doVisiblePopup;
        },
        enumerable: true,
        configurable: true
    });
    return ChangeStatusPopupVisibilityAction;
}(action));
module.exports = ChangeStatusPopupVisibilityAction;
//# sourceMappingURL=changestatuspopupvisibilityaction.js.map