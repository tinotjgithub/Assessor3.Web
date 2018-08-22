"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ShowOrHideCommentAction = (function (_super) {
    __extends(ShowOrHideCommentAction, _super);
    /**
     * Constructor ShowOrHideCommentAction
     * @param isOpen
     */
    function ShowOrHideCommentAction(isOpen, isPanAvoidImageContainerRender) {
        _super.call(this, action.Source.View, actionType.SHOW_OR_HIDE_ONPAGE_COMMENT);
        this._isOpen = isOpen;
        this._isPanAvoidImageContainerRender = isPanAvoidImageContainerRender;
    }
    Object.defineProperty(ShowOrHideCommentAction.prototype, "isOpen", {
        // Show Or Hide comment Box 
        get: function () {
            return this._isOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowOrHideCommentAction.prototype, "isPanAvoidImageContainerRender", {
        /**
         * If PAN, avoid image container rerender
         */
        get: function () {
            return this._isPanAvoidImageContainerRender;
        },
        enumerable: true,
        configurable: true
    });
    return ShowOrHideCommentAction;
}(action));
module.exports = ShowOrHideCommentAction;
//# sourceMappingURL=showorhidecommentaction.js.map