"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for enhanced off-page comments visibility change
 *
 * @class EnhancedOffPageCommentsVisibilityAction
 * @extends {action}
 */
var EnhancedOffPageCommentsVisibilityAction = (function (_super) {
    __extends(EnhancedOffPageCommentsVisibilityAction, _super);
    /**
     * Creates an instance of EnhancedOffPageCommentsVisibilityAction.
     * @param {boolean} isVisible
     * @memberof EnhancedOffPageCommentsVisibilityAction
     */
    function EnhancedOffPageCommentsVisibilityAction(isVisible, markSchemeToNavigate) {
        _super.call(this, action.Source.View, actionType.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY);
        this.auditLog.logContent =
            this.auditLog.logContent.replace('{isVisible}', isVisible.toString());
        this._isVisible = isVisible;
        this._markSchemeToNavigate = markSchemeToNavigate;
    }
    Object.defineProperty(EnhancedOffPageCommentsVisibilityAction.prototype, "isVisible", {
        /**
         * Returns isVisible value
         * @readonly
         * @type {boolean}
         * @memberof EnhancedOffPageCommentsVisibilityAction
         */
        get: function () {
            return this._isVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnhancedOffPageCommentsVisibilityAction.prototype, "markSchemeToNavigate", {
        /**
         * Returns the the markscheme to navigate to if any.
         */
        get: function () {
            return this._markSchemeToNavigate;
        },
        enumerable: true,
        configurable: true
    });
    return EnhancedOffPageCommentsVisibilityAction;
}(action));
module.exports = EnhancedOffPageCommentsVisibilityAction;
//# sourceMappingURL=enhancedoffpagecommentsvisibilityaction.js.map