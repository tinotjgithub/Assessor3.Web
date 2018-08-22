"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var AddNewBookmarkAction = (function (_super) {
    __extends(AddNewBookmarkAction, _super);
    /**
     * Constructor AddNewBookmarkAction
     * @param isSelected
     */
    function AddNewBookmarkAction(isSelected) {
        _super.call(this, action.Source.View, actionType.ADD_NEW_BOOKMARK_ACTION);
        this._isAddNewBookmarkSelected = isSelected;
    }
    Object.defineProperty(AddNewBookmarkAction.prototype, "isAddNewBookmarkSelected", {
        /**
         * This method will return if a bookmark is selected or not
         */
        get: function () {
            return this._isAddNewBookmarkSelected;
        },
        enumerable: true,
        configurable: true
    });
    return AddNewBookmarkAction;
}(action));
module.exports = AddNewBookmarkAction;
//# sourceMappingURL=addnewbookmarkaction.js.map