"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ToggleCommentLinesVisibilityAction = (function (_super) {
    __extends(ToggleCommentLinesVisibilityAction, _super);
    /**
     * Creates an instance of ToggleCommentLinesVisibilityAction.
     *
     * @memberof ToggleCommentLinesVisibilityAction
     */
    function ToggleCommentLinesVisibilityAction(hideLines, hideBoxes) {
        _super.call(this, action.Source.View, actionType.TOGGLE_COMMENT_LINES_VISIBILITY);
        this._hideLines = false;
        this._hideBoxes = false;
        this._hideLines = hideLines;
        this._hideBoxes = hideBoxes;
    }
    Object.defineProperty(ToggleCommentLinesVisibilityAction.prototype, "hideLines", {
        /**
         * Flag to whether hide Lines or Not
         */
        get: function () {
            return this._hideLines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToggleCommentLinesVisibilityAction.prototype, "hideBoxes", {
        /**
         * Flag to whether hide Lines or Not
         */
        get: function () {
            return this._hideBoxes;
        },
        enumerable: true,
        configurable: true
    });
    return ToggleCommentLinesVisibilityAction;
}(action));
module.exports = ToggleCommentLinesVisibilityAction;
//# sourceMappingURL=togglecommentlinesvisibilityaction.js.map