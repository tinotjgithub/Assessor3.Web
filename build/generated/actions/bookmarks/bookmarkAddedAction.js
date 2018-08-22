"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var BookmarkAddedAction = (function (_super) {
    __extends(BookmarkAddedAction, _super);
    /**
     * Constructor BookmarkAddedAction
     * @param bookmark
     */
    function BookmarkAddedAction(bookmark) {
        _super.call(this, action.Source.View, actionType.BOOKMARK_ADDED_ACTION);
        this._bookmarkToAdd = bookmark;
    }
    Object.defineProperty(BookmarkAddedAction.prototype, "bookmarkToAdd", {
        /**
         * This method will return the bookmark
         */
        get: function () {
            return this._bookmarkToAdd;
        },
        enumerable: true,
        configurable: true
    });
    return BookmarkAddedAction;
}(action));
module.exports = BookmarkAddedAction;
//# sourceMappingURL=bookmarkAddedAction.js.map