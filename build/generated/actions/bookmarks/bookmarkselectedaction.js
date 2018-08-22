"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var BookmarkSelectedAction = (function (_super) {
    __extends(BookmarkSelectedAction, _super);
    /**
     * Constructor BookmarkSelectedAction
     */
    function BookmarkSelectedAction(clientToken) {
        _super.call(this, action.Source.View, actionType.BOOKMARK_SELECTED_ACTION);
        this._clientToken = clientToken;
    }
    Object.defineProperty(BookmarkSelectedAction.prototype, "clientToken", {
        /**
         * This method will return the Selected bookmark Item
         */
        get: function () {
            return this._clientToken;
        },
        enumerable: true,
        configurable: true
    });
    return BookmarkSelectedAction;
}(action));
module.exports = BookmarkSelectedAction;
//# sourceMappingURL=bookmarkselectedaction.js.map