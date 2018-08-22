"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * action class using for switching between comments from mark scheme dropdown
 * @class SwitchEnhancedOffPageCommentsAction
 * @extends {action}
 */
var SwitchEnhancedOffPageCommentsAction = (function (_super) {
    __extends(SwitchEnhancedOffPageCommentsAction, _super);
    /**
     * Creates an instance of SwitchEnhancedOffPageCommentsAction.
     * @param {boolean} isCommentEdited
     * @memberof SwitchEnhancedOffPageCommentsAction
     */
    function SwitchEnhancedOffPageCommentsAction(showDiscardPopup) {
        _super.call(this, action.Source.View, actionType.SWITCH_ENHANCED_OFF_PAGE_COMMENTS);
        this._showDiscardPopup = showDiscardPopup;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{showDiscardPopup}/g, showDiscardPopup.toString());
    }
    Object.defineProperty(SwitchEnhancedOffPageCommentsAction.prototype, "showDiscardPopup", {
        /**
         * show discard popup
         * @readonly
         * @type {boolean}
         * @memberof SwitchEnhancedOffPageCommentsAction
         */
        get: function () {
            return this._showDiscardPopup;
        },
        enumerable: true,
        configurable: true
    });
    return SwitchEnhancedOffPageCommentsAction;
}(action));
module.exports = SwitchEnhancedOffPageCommentsAction;
//# sourceMappingURL=switchenhancedoffpagecommentsaction.js.map