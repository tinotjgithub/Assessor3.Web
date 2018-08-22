"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var EnhancedOffPageCommentUpdatedAction = (function (_super) {
    __extends(EnhancedOffPageCommentUpdatedAction, _super);
    function EnhancedOffPageCommentUpdatedAction(isEnhancedOffPageCommentEdited) {
        _super.call(this, action.Source.View, actionType.ENHANCED_OFF_PAGE_COMMENT_UPDATED_ACTION);
        this._isEnhancedOffPageCommentEdited = isEnhancedOffPageCommentEdited;
    }
    Object.defineProperty(EnhancedOffPageCommentUpdatedAction.prototype, "isEnhanedOffPageCommentEdited", {
        /**
         * Returns whether the enhanced off page comment is edited or not
         * @readonly
         * @private
         * @type {boolean}
         * @memberof EnhancedOffPageCommentUpdatedAction
         */
        get: function () {
            return this._isEnhancedOffPageCommentEdited;
        },
        enumerable: true,
        configurable: true
    });
    return EnhancedOffPageCommentUpdatedAction;
}(action));
module.exports = EnhancedOffPageCommentUpdatedAction;
//# sourceMappingURL=enhancedoffpagecommentupdatedaction.js.map