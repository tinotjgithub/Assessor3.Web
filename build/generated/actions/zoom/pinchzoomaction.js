"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * action class for pinch to zoom
 */
var PinchZoomAction = (function (_super) {
    __extends(PinchZoomAction, _super);
    /**
     * Constructor PinchZoomAction
     * @param isPinchZooming
     */
    function PinchZoomAction(isPinchZooming) {
        _super.call(this, action.Source.View, actionType.PINCH_ZOOM);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', isPinchZooming.toString());
        this._isPinchZooming = isPinchZooming;
    }
    Object.defineProperty(PinchZoomAction.prototype, "isPinchZooming", {
        /*pinch to zoom enabled or not*/
        get: function () {
            return this._isPinchZooming;
        },
        enumerable: true,
        configurable: true
    });
    return PinchZoomAction;
}(action));
module.exports = PinchZoomAction;
//# sourceMappingURL=pinchzoomaction.js.map