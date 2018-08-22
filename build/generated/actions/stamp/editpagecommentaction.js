"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var EditPageCommentAction = (function (_super) {
    __extends(EditPageCommentAction, _super);
    /**
     * Constructor EditPageCommentAction
     * @param commentAttribute
     * @param left
     * @param top
     * @param hierarchy
     * @param windowsWidth
     * @param overlayWidth
     * @param overlayHeight
     * @param wrapper
     * @param isCommentBoxReadOnly
     * @param isCommentBoxInActive
     */
    function EditPageCommentAction(commentAttribute, left, top, hierarchy, windowsWidth, overlayWidth, overlayHeight, wrapper, isCommentBoxReadOnly, isCommentBoxInActive) {
        _super.call(this, action.Source.View, actionType.EDIT_ONPAGE_COMMENT);
        this._comment = commentAttribute;
        this._leftOffSet = left;
        this._topOffSet = top;
        this._hierarchy = hierarchy;
        this._windowsWidth = windowsWidth;
        this._overlayHeight = overlayHeight;
        this._overlayWidth = overlayWidth;
        this._wrapper = wrapper;
        this._isCommentBoxReadOnly = isCommentBoxReadOnly;
        this._isCommentBoxInActive = isCommentBoxInActive;
        // Logging
        this.auditLog.logContent = this.auditLog.logContent.replace(/{stampid}/g, this._comment.clientToken)
            .replace(/{hierarchy}/g, this._hierarchy);
    }
    Object.defineProperty(EditPageCommentAction.prototype, "comment", {
        /**
         * Get the comment
         * @returns
         */
        get: function () {
            return this._comment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPageCommentAction.prototype, "leftOffSet", {
        /**
         * Get the left offset
         * @returns
         */
        get: function () {
            return this._leftOffSet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPageCommentAction.prototype, "isCommentBoxReadOnly", {
        /**
         * Get is comment box read only.
         * @returns
         */
        get: function () {
            return this._isCommentBoxReadOnly;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPageCommentAction.prototype, "isCommentBoxInActive", {
        /**
         * Get is comment box read only.
         * @returns
         */
        get: function () {
            return this._isCommentBoxInActive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPageCommentAction.prototype, "topOffSet", {
        /**
         * Get the top offset
         * @returns
         */
        get: function () {
            return this._topOffSet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPageCommentAction.prototype, "qustionHierarhy", {
        /**
         * Get the question hierarchy where stamp belongs to
         * @returns
         */
        get: function () {
            return this._hierarchy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPageCommentAction.prototype, "windowsWidth", {
        /**
         * Get the Windows Width
         * @returns
         */
        get: function () {
            return this._windowsWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPageCommentAction.prototype, "overlayHeight", {
        /**
         * Get the annotation overlay Height
         * @returns
         */
        get: function () {
            return this._overlayHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPageCommentAction.prototype, "overlayWidth", {
        /**
         * Get the annotation overlay width
         * @returns
         */
        get: function () {
            return this._overlayWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPageCommentAction.prototype, "wrapper", {
        /**
         * Get the wrapper
         * @returns
         */
        get: function () {
            return this._wrapper;
        },
        enumerable: true,
        configurable: true
    });
    return EditPageCommentAction;
}(action));
module.exports = EditPageCommentAction;
//# sourceMappingURL=editpagecommentaction.js.map