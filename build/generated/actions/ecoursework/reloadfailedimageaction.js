"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ReloadFailedImageAction = (function (_super) {
    __extends(ReloadFailedImageAction, _super);
    /**
     * Constructor
     */
    function ReloadFailedImageAction() {
        _super.call(this, action.Source.View, actionType.RELOAD_FAILED_IMAGE);
    }
    return ReloadFailedImageAction;
}(action));
module.exports = ReloadFailedImageAction;
//# sourceMappingURL=reloadfailedimageaction.js.map