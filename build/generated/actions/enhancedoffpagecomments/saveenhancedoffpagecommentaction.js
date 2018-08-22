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
 * The Action class to save enhancedOffpage comments.
 */
var SaveEnhancedOffPageCommentAction = (function (_super) {
    __extends(SaveEnhancedOffPageCommentAction, _super);
    function SaveEnhancedOffPageCommentAction(enhancedOffPageClientTokensToBeDeleted, markingOperation, commentText, selectedMarkSchemeId, selectedFileId) {
        _super.call(this, action.Source.View, actionType.SAVE_ENHANCED_OFFPAGE_COMMENTS_ACTION);
        this._enhancedOffPageClientTokens = enhancedOffPageClientTokensToBeDeleted;
        this._markingOperation = markingOperation;
        this._commentText = commentText;
        this._selectedMarkSchemeId = selectedMarkSchemeId;
        this._selectedFileId = selectedFileId;
        // If the marking operation is none we dont have to log the action
        if (markingOperation !== enums.MarkingOperation.none) {
            var enhancedOffPageCommentsClientTokensString_1 = '';
            this._enhancedOffPageClientTokens.forEach(function (item) {
                enhancedOffPageCommentsClientTokensString_1 = item + '|';
            });
            this.auditLog.logContent = this.auditLog.logContent.replace('{0}', enhancedOffPageCommentsClientTokensString_1
                .replace('{1}', this._markingOperation.toString())
                .replace('{2}', this._selectedMarkSchemeId ? this._selectedMarkSchemeId.toString() : '')
                .replace('{3}', this.selectedFileId ? this._selectedFileId.toString() : ''));
        }
    }
    Object.defineProperty(SaveEnhancedOffPageCommentAction.prototype, "enhancedOffPageClientTokensToBeDeleted", {
        /**
         * Get the enhanced off page comment details to save
         */
        get: function () {
            return this._enhancedOffPageClientTokens;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveEnhancedOffPageCommentAction.prototype, "markingOperation", {
        /**
         * Get the marking operation which have to be saved
         */
        get: function () {
            return this._markingOperation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveEnhancedOffPageCommentAction.prototype, "commentText", {
        /**
         * Get the comment text
         */
        get: function () {
            return this._commentText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveEnhancedOffPageCommentAction.prototype, "selectedMarkSchemeId", {
        /**
         * Get the selected markscheme id
         */
        get: function () {
            return this._selectedMarkSchemeId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveEnhancedOffPageCommentAction.prototype, "selectedFileId", {
        /**
         * Returns the selected file id
         */
        get: function () {
            return this._selectedFileId;
        },
        enumerable: true,
        configurable: true
    });
    return SaveEnhancedOffPageCommentAction;
}(action));
module.exports = SaveEnhancedOffPageCommentAction;
//# sourceMappingURL=saveenhancedoffpagecommentaction.js.map