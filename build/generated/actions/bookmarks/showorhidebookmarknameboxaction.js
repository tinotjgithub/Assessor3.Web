"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ShowOrHideBookmarkNameBoxAction = (function (_super) {
    __extends(ShowOrHideBookmarkNameBoxAction, _super);
    function ShowOrHideBookmarkNameBoxAction(bookmarkText, clientToken, isVisible, rotatedAngle) {
        _super.call(this, action.Source.View, actionType.SHOW_OR_HIDE_BOOKMARK_NAME_BOX);
        this._bookmarkText = bookmarkText;
        this._clientToken = clientToken;
        this._isVisible = isVisible;
        this._rotatedAngle = rotatedAngle;
    }
    Object.defineProperty(ShowOrHideBookmarkNameBoxAction.prototype, "bookmarkText", {
        /**
         * This method will return the bookmark name of the newly added bookmark
         */
        get: function () {
            return this._bookmarkText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowOrHideBookmarkNameBoxAction.prototype, "clientToken", {
        get: function () {
            return this._clientToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowOrHideBookmarkNameBoxAction.prototype, "isVisible", {
        get: function () {
            return this._isVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowOrHideBookmarkNameBoxAction.prototype, "rotatedAngle", {
        get: function () {
            return this._rotatedAngle;
        },
        enumerable: true,
        configurable: true
    });
    return ShowOrHideBookmarkNameBoxAction;
}(action));
module.exports = ShowOrHideBookmarkNameBoxAction;
//# sourceMappingURL=showorhidebookmarknameboxaction.js.map