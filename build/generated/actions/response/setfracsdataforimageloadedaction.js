"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for setting fracs data for response image loaded
 */
var SetFracsDataForImageLoadedAction = (function (_super) {
    __extends(SetFracsDataForImageLoadedAction, _super);
    /**
     * Initializing a new instance of set fracs data for image loaded action.
     */
    function SetFracsDataForImageLoadedAction() {
        _super.call(this, action.Source.View, actionType.SET_FRACS_DATA_IMAGE_LOADED_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
    return SetFracsDataForImageLoadedAction;
}(action));
module.exports = SetFracsDataForImageLoadedAction;
//# sourceMappingURL=setfracsdataforimageloadedaction.js.map