"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
// Reset stamp banner type
var ResetStampBannerTypeAction = (function (_super) {
    __extends(ResetStampBannerTypeAction, _super);
    /**
     * Constructor
     */
    function ResetStampBannerTypeAction() {
        _super.call(this, action.Source.View, actionType.RESET_STAMP_BANNER_TYPE_ACTION);
    }
    return ResetStampBannerTypeAction;
}(action));
module.exports = ResetStampBannerTypeAction;
//# sourceMappingURL=resetstampbannertypeaction.js.map