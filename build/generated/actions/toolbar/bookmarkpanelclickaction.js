"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var BookmarkPanelClickAction = (function (_super) {
    __extends(BookmarkPanelClickAction, _super);
    function BookmarkPanelClickAction(isBookmarkPanelOpen) {
        _super.call(this, action.Source.View, actionType.BOOKMARK_PANEL_CLICK_ACTION);
        this._isBookmarkPanelOpen = isBookmarkPanelOpen;
    }
    Object.defineProperty(BookmarkPanelClickAction.prototype, "isBookmarkPanelOpen", {
        /**
         * returns bookmark panel open status.
         */
        get: function () {
            return this._isBookmarkPanelOpen;
        },
        enumerable: true,
        configurable: true
    });
    return BookmarkPanelClickAction;
}(action));
module.exports = BookmarkPanelClickAction;
//# sourceMappingURL=bookmarkpanelclickaction.js.map