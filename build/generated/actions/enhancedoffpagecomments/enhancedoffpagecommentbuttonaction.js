"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
/**
 * Class for Enhanced offpage comment button action
 * @class EnhancedOffPageCommentButtonAction
 * @extends {action}
 */
var EnhancedOffPageCommentButtonAction = (function (_super) {
    __extends(EnhancedOffPageCommentButtonAction, _super);
    /**
     * Creates an instance of EnhancedOffPageCommentButtonAction.
     * @param {enums.EnhancedOffPageCommentButtonAction} enhancedOffPageCommentButtonAction
     * @memberof EnhancedOffPageCommentButtonAction
     */
    function EnhancedOffPageCommentButtonAction(enhancedOffPageCommentButtonAction) {
        _super.call(this, action.Source.View, actionType.ENHANCED_OFF_PAGE_COMMENT_BUTTON_ACTION);
        this._enhancedOffPageCommentButtonAction = enhancedOffPageCommentButtonAction;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{buttonAction}/g, enums.getEnumString(enums.EnhancedOffPageCommentAction, enhancedOffPageCommentButtonAction));
    }
    Object.defineProperty(EnhancedOffPageCommentButtonAction.prototype, "EnhancedOffPageCommentButtonAction", {
        /**
         * Returns enhanced offpage comment button action
         * @readonly
         * @type {number}
         * @memberof EnhancedOffPageCommentButtonAction
         */
        get: function () {
            return this._enhancedOffPageCommentButtonAction;
        },
        enumerable: true,
        configurable: true
    });
    return EnhancedOffPageCommentButtonAction;
}(action));
module.exports = EnhancedOffPageCommentButtonAction;
//# sourceMappingURL=enhancedoffpagecommentbuttonaction.js.map