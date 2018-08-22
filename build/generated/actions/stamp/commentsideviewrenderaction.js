"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action for rendering the comment container from other components
 */
var CommentSideViewRenderAction = (function (_super) {
    __extends(CommentSideViewRenderAction, _super);
    /**
     * constructor for the action object
     */
    function CommentSideViewRenderAction(isAnnotationMove, stampX, stampY, clientToken, inGreyArea) {
        _super.call(this, action.Source.View, actionType.COMMENT_SIDE_VIEW_RENDER_ACTION);
        this._isAnnotationMove = isAnnotationMove;
        this._stampX = stampX;
        this._stampY = stampY;
        this._clientToken = clientToken;
        this._inGreyArea = inGreyArea;
    }
    Object.defineProperty(CommentSideViewRenderAction.prototype, "isAnnotationMove", {
        /**
         * return the value whetehr the action triggered on comment anotation move or drag
         */
        get: function () {
            return this._isAnnotationMove;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentSideViewRenderAction.prototype, "stampX", {
        /**
         * return the value whetehr the action triggered on comment anotation move or drag
         */
        get: function () {
            return this._stampX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentSideViewRenderAction.prototype, "stampY", {
        /**
         * return the value whetehr the action triggered on comment anotation move or drag
         */
        get: function () {
            return this._stampY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentSideViewRenderAction.prototype, "clientToken", {
        /**
         * return the value of currently selected comment's client token
         */
        get: function () {
            return this._clientToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentSideViewRenderAction.prototype, "isInGreyARea", {
        /**
         * return the value of currently selected comment is moving in grey area or not
         */
        get: function () {
            return this._inGreyArea;
        },
        enumerable: true,
        configurable: true
    });
    return CommentSideViewRenderAction;
}(action));
module.exports = CommentSideViewRenderAction;
//# sourceMappingURL=commentsideviewrenderaction.js.map