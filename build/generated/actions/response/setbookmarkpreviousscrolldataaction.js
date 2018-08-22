"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var SetBookmarkPreviousScrollDataAction = (function (_super) {
    __extends(SetBookmarkPreviousScrollDataAction, _super);
    /**
     * Constructor SetBookmarkPreviousScrollDataAction
     */
    function SetBookmarkPreviousScrollDataAction(bookmarkPreviousScrollData) {
        _super.call(this, action.Source.View, actionType.SET_BOOKMARK_PREVIOUS_SCROLL_DATA_ACTION);
        this._bookmarkPreviousScrollData = bookmarkPreviousScrollData;
    }
    Object.defineProperty(SetBookmarkPreviousScrollDataAction.prototype, "getBookmarkPreviousScrollData", {
        /**
         * This method will return the previous scroll Data
         */
        get: function () {
            return this._bookmarkPreviousScrollData;
        },
        enumerable: true,
        configurable: true
    });
    return SetBookmarkPreviousScrollDataAction;
}(action));
module.exports = SetBookmarkPreviousScrollDataAction;
//# sourceMappingURL=setbookmarkpreviousscrolldataaction.js.map