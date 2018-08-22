"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var SetCommentVisibilityAction = (function (_super) {
    __extends(SetCommentVisibilityAction, _super);
    /**
     * Constructor
     * @param isvisible
     */
    function SetCommentVisibilityAction(isvisible) {
        _super.call(this, action.Source.View, actionType.SET_COMMENT_VISIBILITY_ACTION);
        this._isvisible = isvisible;
    }
    Object.defineProperty(SetCommentVisibilityAction.prototype, "isvisible", {
        /**
         * Gets a value indiacting whether the comment container is visible.
         */
        get: function () {
            return this._isvisible;
        },
        enumerable: true,
        configurable: true
    });
    return SetCommentVisibilityAction;
}(action));
module.exports = SetCommentVisibilityAction;
//# sourceMappingURL=setcommentvisibilityaction.js.map