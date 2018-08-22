"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var CommentsSideViewToggleAction = (function (_super) {
    __extends(CommentsSideViewToggleAction, _super);
    /**
     * Initializing a new instance for both switching to side view of comments.
     * @param {boolean} enableSideView
     */
    function CommentsSideViewToggleAction(enableSideView, currentCommentToken, disableSideViewOnDevices) {
        if (disableSideViewOnDevices === void 0) { disableSideViewOnDevices = false; }
        _super.call(this, action.Source.View, actionType.COMMENTS_SIDEVIEW_TOGGLE_ACTION);
        this._enableSideView = enableSideView;
        this._currentCommentToken = currentCommentToken;
        this._disableSideViewOnDevices = disableSideViewOnDevices;
    }
    Object.defineProperty(CommentsSideViewToggleAction.prototype, "enableSideView", {
        /**
         * Gets a value indicating whether the side view is enabled.
         * @returns
         */
        get: function () {
            return this._enableSideView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentsSideViewToggleAction.prototype, "disableSideViewOnDevices", {
        /**
         * Gets a value indicating whether the side view is disabled for devices.
         * @returns
         */
        get: function () {
            return this._disableSideViewOnDevices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentsSideViewToggleAction.prototype, "currentCommentToken", {
        /**
         * Gets a value of current comments clinet token
         * @returns
         */
        get: function () {
            return this._currentCommentToken;
        },
        enumerable: true,
        configurable: true
    });
    return CommentsSideViewToggleAction;
}(action));
module.exports = CommentsSideViewToggleAction;
//# sourceMappingURL=commentssideviewtoggleaction.js.map