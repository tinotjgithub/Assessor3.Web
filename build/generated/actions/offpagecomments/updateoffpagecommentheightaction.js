"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
var UpdateOffPageCommentHeightAction = (function (_super) {
    __extends(UpdateOffPageCommentHeightAction, _super);
    function UpdateOffPageCommentHeightAction(panelActionType, panActionType, height) {
        if (!height) {
            height = 0;
        }
        switch (panelActionType) {
            case enums.PanelActionType.ResizedPanel:
                _super.call(this, action.Source.View, actionType.UPDATE_OFF_PAGE_COMMENT_HEIGHT);
                this._panActionType = panActionType;
                this._panelHeight = height;
                break;
            default:
                break;
        }
    }
    Object.defineProperty(UpdateOffPageCommentHeightAction.prototype, "panelHeight", {
        /**
         * Get Panel Height
         */
        get: function () {
            return this._panelHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateOffPageCommentHeightAction.prototype, "panActionType", {
        /**
         * get pan action type
         */
        get: function () {
            return this._panActionType;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateOffPageCommentHeightAction;
}(action));
module.exports = UpdateOffPageCommentHeightAction;
//# sourceMappingURL=updateoffpagecommentheightaction.js.map