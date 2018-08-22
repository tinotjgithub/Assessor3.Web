"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ZoomOptionClickedAction = (function (_super) {
    __extends(ZoomOptionClickedAction, _super);
    /**
     * Constructor ZoomOptionClickedAction
     * @param isZoomOptionOpen
     */
    function ZoomOptionClickedAction(isZoomOptionOpen) {
        _super.call(this, action.Source.View, actionType.ZOOM_OPTION_CLICKED_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', isZoomOptionOpen.toString());
        this._isZoomOptionOpen = isZoomOptionOpen;
    }
    Object.defineProperty(ZoomOptionClickedAction.prototype, "isZoomOptionOpen", {
        /**
         * Get wether the zoom panel is open or closed.
         * @returns isZoomOptionOpen
         */
        get: function () {
            return this._isZoomOptionOpen;
        },
        enumerable: true,
        configurable: true
    });
    return ZoomOptionClickedAction;
}(action));
module.exports = ZoomOptionClickedAction;
//# sourceMappingURL=zoomoptionclickedaction.js.map