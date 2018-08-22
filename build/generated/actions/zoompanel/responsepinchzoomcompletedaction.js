"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ResponsePinchZoomCompletedAction = (function (_super) {
    __extends(ResponsePinchZoomCompletedAction, _super);
    /**
     * Intitializing a new instance of response pinch zoom completed action
     * @param {number} zoomedWidth
     */
    function ResponsePinchZoomCompletedAction(zoomedWidth) {
        _super.call(this, action.Source.View, actionType.RESPONSEPINCHZOOMCOMPLETED);
        this._zoomedWidth = zoomedWidth;
    }
    Object.defineProperty(ResponsePinchZoomCompletedAction.prototype, "zoomedWidth", {
        /**
         * Gets a value indicating the zoomed width of the marksheet-view-holder
         * after pinch.
         * @returns pinched zoom
         */
        get: function () {
            return this._zoomedWidth;
        },
        enumerable: true,
        configurable: true
    });
    return ResponsePinchZoomCompletedAction;
}(action));
module.exports = ResponsePinchZoomCompletedAction;
//# sourceMappingURL=responsepinchzoomcompletedaction.js.map