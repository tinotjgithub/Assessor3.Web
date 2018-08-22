"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var BookmarkGoBackButtonClickAction = (function (_super) {
    __extends(BookmarkGoBackButtonClickAction, _super);
    /**
     * Constructor BookmarkGoBackButtonClickAction
     */
    function BookmarkGoBackButtonClickAction() {
        _super.call(this, action.Source.View, actionType.BOOKMARK_GO_BACK_BUTTON_CLICK_ACTION);
    }
    return BookmarkGoBackButtonClickAction;
}(action));
module.exports = BookmarkGoBackButtonClickAction;
//# sourceMappingURL=bookmarkgobackbuttonclickaction.js.map