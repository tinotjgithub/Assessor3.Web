"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var SetSelectedSideViewCommentAction = (function (_super) {
    __extends(SetSelectedSideViewCommentAction, _super);
    /**
     * constructor for the action
     * @param clientToken
     */
    function SetSelectedSideViewCommentAction(clientToken) {
        _super.call(this, action.Source.View, actionType.SET_SELECTED_SIDE_VIEW_COMMENT_ACTION);
        this._clientToken = clientToken;
    }
    Object.defineProperty(SetSelectedSideViewCommentAction.prototype, "clientToken", {
        get: function () {
            return this._clientToken;
        },
        enumerable: true,
        configurable: true
    });
    return SetSelectedSideViewCommentAction;
}(action));
module.exports = SetSelectedSideViewCommentAction;
//# sourceMappingURL=setselectedsideviewcommentaction.js.map