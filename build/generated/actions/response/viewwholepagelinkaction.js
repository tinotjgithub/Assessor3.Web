"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ViewWholePageLinkAction = (function (_super) {
    __extends(ViewWholePageLinkAction, _super);
    function ViewWholePageLinkAction(isCursorInsideScript, activeImageZone) {
        _super.call(this, action.Source.View, actionType.VIEW_WHOLE_PAGE_LINK);
        this._isCursorInsideScript = isCursorInsideScript;
        this._activeImageZone = activeImageZone;
    }
    Object.defineProperty(ViewWholePageLinkAction.prototype, "isCursorInsideScript", {
        /**
         * This method will returns supervisor sampling Comment Return details
         */
        get: function () {
            return this._isCursorInsideScript;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewWholePageLinkAction.prototype, "activeImageZone", {
        get: function () {
            return this._activeImageZone;
        },
        enumerable: true,
        configurable: true
    });
    return ViewWholePageLinkAction;
}(action));
module.exports = ViewWholePageLinkAction;
//# sourceMappingURL=viewwholepagelinkaction.js.map