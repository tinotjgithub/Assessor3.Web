"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ResponseImageRotatedAction = (function (_super) {
    __extends(ResponseImageRotatedAction, _super);
    /**
     * Constructor ResponseImageRotatedAction
     * @param hasRotatedImages
     */
    function ResponseImageRotatedAction(hasRotatedImages, rotatedImages) {
        _super.call(this, action.Source.View, actionType.RESPONSE_IMAGE_ROTATED_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
        this._hasRotatedImages = hasRotatedImages;
        this._rotatedImages = rotatedImages;
    }
    Object.defineProperty(ResponseImageRotatedAction.prototype, "hasResponseImageRotated", {
        /**
         * Get a value indicating whether response has been rortated
         * @returns
         */
        get: function () {
            return this._hasRotatedImages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseImageRotatedAction.prototype, "getRotatedImages", {
        get: function () {
            return this._rotatedImages;
        },
        enumerable: true,
        configurable: true
    });
    return ResponseImageRotatedAction;
}(action));
module.exports = ResponseImageRotatedAction;
//# sourceMappingURL=responseimagerotatedaction.js.map