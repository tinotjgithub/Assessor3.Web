"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var SetMarkEntrySelection = (function (_super) {
    __extends(SetMarkEntrySelection, _super);
    /**
     * Constructor
     */
    function SetMarkEntrySelection(commentSelected, bookmarkSelected) {
        _super.call(this, action.Source.View, actionType.SET_MARK_ENTRY_SELECTED);
        this._isCommentSelected = commentSelected;
    }
    Object.defineProperty(SetMarkEntrySelection.prototype, "isCommentSelected", {
        /**
         * Get the comment focus Status
         * @returns
         */
        get: function () {
            return this._isCommentSelected;
        },
        enumerable: true,
        configurable: true
    });
    return SetMarkEntrySelection;
}(action));
module.exports = SetMarkEntrySelection;
//# sourceMappingURL=setmarkentryselectionaction.js.map