"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ShowLocksInQigPopupAction = (function (_super) {
    __extends(ShowLocksInQigPopupAction, _super);
    /**
     * Constructor for ShowLocksInQigPopupAction
     * @param doShowLocksInQigPopup
     */
    function ShowLocksInQigPopupAction(doShowLocksInQigPopup, isFromLogout) {
        _super.call(this, action.Source.View, actionType.SHOW_LOCKS_IN_QIG_POPUP);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ doShowLocksInQigPopup}/g, doShowLocksInQigPopup ? 'true' : 'false');
        this._doShowLocksInQigPopup = doShowLocksInQigPopup;
        this._isFromLogout = isFromLogout;
    }
    Object.defineProperty(ShowLocksInQigPopupAction.prototype, "doShowLocksInQigPopup", {
        /**
         * Retrieves doShowLocksInQigPopup
         */
        get: function () {
            return this._doShowLocksInQigPopup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowLocksInQigPopupAction.prototype, "isShowLocksFromLogout", {
        get: function () {
            return this._isFromLogout;
        },
        enumerable: true,
        configurable: true
    });
    return ShowLocksInQigPopupAction;
}(action));
module.exports = ShowLocksInQigPopupAction;
//# sourceMappingURL=showlocksinqigpopupaction.js.map