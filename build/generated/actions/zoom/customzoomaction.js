"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var CustomZoomAction = (function (_super) {
    __extends(CustomZoomAction, _super);
    /**
     * Constructor
     * @param customZoomType
     * @param responseViewSettings
     * @param userZoomValue
     */
    function CustomZoomAction(customZoomType, responseViewSettings, userZoomValue) {
        _super.call(this, action.Source.View, actionType.CUSTOM_ZOOM_ACTION);
        this._customZoomType = customZoomType;
        this._responseViewSettings = responseViewSettings;
        this._userZoomValue = userZoomValue;
    }
    Object.defineProperty(CustomZoomAction.prototype, "zoomType", {
        /**
         * Get the zoom type.
         * @returns seleceted zoom type
         */
        get: function () {
            return this._customZoomType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomZoomAction.prototype, "responseViewSettings", {
        /**
         * Get the view where the response is going to switch
         */
        get: function () {
            return this._responseViewSettings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomZoomAction.prototype, "userZoomValue", {
        /**
         * Get user zoom value
         */
        get: function () {
            return this._userZoomValue;
        },
        enumerable: true,
        configurable: true
    });
    return CustomZoomAction;
}(action));
module.exports = CustomZoomAction;
//# sourceMappingURL=customzoomaction.js.map