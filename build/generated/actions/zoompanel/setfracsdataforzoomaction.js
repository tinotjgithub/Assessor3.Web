"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
/**
 * Class for Fit Response To Width/Height Action
 */
var SetFracsDataForZoomAction = (function (_super) {
    __extends(SetFracsDataForZoomAction, _super);
    /**
     * Constructor SetFracsDataForZoomAction
     * @param responseViewSettings
     * @param actionType
     */
    function SetFracsDataForZoomAction(responseViewSettings, actionType) {
        _super.call(this, action.Source.View, actionType);
        this.auditLog.logContent = this.auditLog.logContent;
        this._zoomType = responseViewSettings;
    }
    Object.defineProperty(SetFracsDataForZoomAction.prototype, "zoomType", {
        /**
         * This method will return the Fit Type
         */
        get: function () {
            return this._zoomType;
        },
        enumerable: true,
        configurable: true
    });
    return SetFracsDataForZoomAction;
}(action));
module.exports = SetFracsDataForZoomAction;
//# sourceMappingURL=setfracsdataforzoomaction.js.map