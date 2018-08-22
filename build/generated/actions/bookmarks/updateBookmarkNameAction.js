"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateBookmarkNameAction = (function (_super) {
    __extends(UpdateBookmarkNameAction, _super);
    /**
     * Constructor UpdateBookmarkNameAction
     * @param bookmark
     */
    function UpdateBookmarkNameAction(bookmarkName, clientToken) {
        _super.call(this, action.Source.View, actionType.UPDATE_BOOKMARK_NAME_ACTION);
        this._bookmarkNameToSave = bookmarkName;
        this._bookmarkClientToken = clientToken;
    }
    Object.defineProperty(UpdateBookmarkNameAction.prototype, "bookmarkNameToSave", {
        /**
         * This method will return the bookmark name of the newly added bookmark
         */
        get: function () {
            return this._bookmarkNameToSave;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateBookmarkNameAction.prototype, "bookmarkClientToken", {
        /**
         * This method will return the client token of the newly added bookmark
         */
        get: function () {
            return this._bookmarkClientToken;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateBookmarkNameAction;
}(action));
module.exports = UpdateBookmarkNameAction;
//# sourceMappingURL=updateBookmarkNameAction.js.map