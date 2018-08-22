"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for setting image zones against Page number for mark this page functionality
 */
var SetImageZonesForPageNoAction = (function (_super) {
    __extends(SetImageZonesForPageNoAction, _super);
    /**
     * constructor
     * @param imageZones
     */
    function SetImageZonesForPageNoAction(imageZones, linkedAnnotations) {
        _super.call(this, action.Source.View, actionType.SET_IMAGE_ZONES_FOR_PAGE_NO);
        this._imageZones = imageZones;
        this._linkedAnnotations = linkedAnnotations;
    }
    Object.defineProperty(SetImageZonesForPageNoAction.prototype, "imageZones", {
        /**
         * Returns image zone list against page number
         */
        get: function () {
            return this._imageZones;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SetImageZonesForPageNoAction.prototype, "linkedAnnotaion", {
        /**
         * Returns image zone list against page number
         */
        get: function () {
            return this._linkedAnnotations;
        },
        enumerable: true,
        configurable: true
    });
    return SetImageZonesForPageNoAction;
}(action));
module.exports = SetImageZonesForPageNoAction;
//# sourceMappingURL=setimagezonesforpagenoaction.js.map