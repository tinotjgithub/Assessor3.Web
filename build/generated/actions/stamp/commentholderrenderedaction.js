"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action for rendering the comment container from other components
 */
var CommentHolderRenderedAction = (function (_super) {
    __extends(CommentHolderRenderedAction, _super);
    /**
     * constructor for the action object
     */
    function CommentHolderRenderedAction(outputPageNo, minHeight) {
        _super.call(this, action.Source.View, actionType.COMMENT_HOLDER_RENDERED_ACTION);
        this._outputPageNo = outputPageNo;
        this._minHeight = minHeight;
    }
    Object.defineProperty(CommentHolderRenderedAction.prototype, "outputPageNo", {
        /**
         * return the value of output page number
         */
        get: function () {
            return this._outputPageNo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentHolderRenderedAction.prototype, "minHeight", {
        /**
         * return the value on miminmum height
         */
        get: function () {
            return this._minHeight;
        },
        enumerable: true,
        configurable: true
    });
    return CommentHolderRenderedAction;
}(action));
module.exports = CommentHolderRenderedAction;
//# sourceMappingURL=commentholderrenderedaction.js.map