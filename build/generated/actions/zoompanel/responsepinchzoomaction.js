"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ResponsePinchZoomAction = (function (_super) {
    __extends(ResponsePinchZoomAction, _super);
    /**
     * Initialise a new instance of response zoom action to prepare the responses pages to
     * start the pinch to Zoom
     * @param {number} marksheetHolderWidth
     */
    function ResponsePinchZoomAction(marksheetHolderWidth) {
        _super.call(this, action.Source.View, actionType.RESPONSEPINCHZOOMACTION);
        // assigning the marksheet holder width
        this._marksheetHolderWidth = marksheetHolderWidth;
    }
    Object.defineProperty(ResponsePinchZoomAction.prototype, "markSheetHolderWidth", {
        /**
         * Gets a value indicating the current marksheet holder width.
         * @returns
         */
        get: function () {
            return this._marksheetHolderWidth;
        },
        enumerable: true,
        configurable: true
    });
    return ResponsePinchZoomAction;
}(action));
module.exports = ResponsePinchZoomAction;
//# sourceMappingURL=responsepinchzoomaction.js.map