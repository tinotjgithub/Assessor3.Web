"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var SetCommentContainerRightAction = (function (_super) {
    __extends(SetCommentContainerRightAction, _super);
    /**
     * Creates an instance of setCommentContainerRightAction.
     *
     * @memberof setCommentContainerRightAction
     */
    function SetCommentContainerRightAction(right) {
        _super.call(this, action.Source.View, actionType.SET_COMMENT_CONTAINER_RIGHT);
        this._right = right;
    }
    Object.defineProperty(SetCommentContainerRightAction.prototype, "commentContainerRight", {
        /**
         * comment container right attribute
         *
         * @readonly
         * @type {number}
         * @memberof SetCommentContainerRightAction
         */
        get: function () {
            return this._right;
        },
        enumerable: true,
        configurable: true
    });
    return SetCommentContainerRightAction;
}(action));
module.exports = SetCommentContainerRightAction;
//# sourceMappingURL=setcommentcontainerrightaction.js.map