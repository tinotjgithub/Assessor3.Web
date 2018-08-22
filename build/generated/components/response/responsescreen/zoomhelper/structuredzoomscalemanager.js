"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var zoomScaleManagerBase = require('./zoomscalemanager');
var enums = require('../../../utility/enums');
var constants = require('../../../utility/constants');
var StructuredZoomScaleManager = (function (_super) {
    __extends(StructuredZoomScaleManager, _super);
    /**
     * Constructor StructuredZoomscaleManager
     */
    function StructuredZoomScaleManager() {
        _super.call(this);
        this.currentZoom = 0;
    }
    /**
     * Set zoom factor
     * @param {number} factor
     */
    StructuredZoomScaleManager.prototype.setZoomFactor = function (factor) {
        this.zoomFactor = factor;
    };
    Object.defineProperty(StructuredZoomScaleManager.prototype, "getCurrentZoom", {
        /**
         * Return the current zoom value
         * @returns
         */
        get: function () {
            return this.currentZoom;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Setting the initial zoom attributes.
     * @param {number} naturalWidth of the large image
     * @param {number} containerClientWidth the div container width
     */
    StructuredZoomScaleManager.prototype.setZoomAttributes = function (naturalWidth, containerClientWidth, naturalHeight) {
        _super.prototype.setZoomAttributes.call(this, naturalWidth, containerClientWidth, naturalHeight);
    };
    Object.defineProperty(StructuredZoomScaleManager.prototype, "naturalZoomableWidth", {
        /**
         * Get the natural width of the zoomable object
         * @returns
         */
        get: function () {
            return this.maximumNaturalZoomableWidth;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the zoom value according to the width
     */
    StructuredZoomScaleManager.prototype.setZoomValue = function (value) {
        this.currentZoom = value;
    };
    /**
     * Perform the zooming
     * @param {enums.ZoomType} zoomType
     * @param {any = undefined} zoomEvent
     * @param userZoomValue
     */
    StructuredZoomScaleManager.prototype.performZooming = function (zoomType, zoomEvent, userZoomValue) {
        if (zoomEvent === void 0) { zoomEvent = undefined; }
        this.currentZoom = this.getZoomValue(zoomType, userZoomValue);
    };
    /**
     * Apply the image width based on the rotation.
     * @param {boolean} hasRotatedImage
     * @returns
     */
    StructuredZoomScaleManager.prototype.getRotatedImageWidth = function (hasRotatedImage, imageZoneHeight) {
        if (imageZoneHeight === void 0) { imageZoneHeight = 0; }
        // if the response has been rotated then we need to apply the changes
        // respect to the height of the rotated image, othervise noraml width.
        if (hasRotatedImage) {
            return (this.currentZoom / 100) * imageZoneHeight === 0 ? this.maximumNaturalZoomableHeight : imageZoneHeight;
        }
        else {
            return this.getContainerWidthInPixel;
        }
    };
    /**
     * Return the updated zoom percentage
     * @param {enums.ZoomType} zoomType
     * @param userZoomValue
     */
    StructuredZoomScaleManager.prototype.getZoomValue = function (zoomType, userZoomValue) {
        // If the zoom value has not set yet, because the previous zoom preference
        // might be FitWidth/FitHeight, set the zoom value according to that.
        if (this.currentZoom === 0) {
            this.currentZoom = (this.containerWidth / this.naturalZoomableWidth) * 100;
        }
        var updatedZoomPercentage = 0;
        var zoomFactor;
        switch (zoomType) {
            case enums.ZoomType.CustomZoomIn:
                zoomFactor = (constants.MAX_ZOOM_PERCENTAGE - this.currentZoom) / constants.MIN_ZOOM_PERCENTAGE;
                updatedZoomPercentage = zoomFactor >= 1 ?
                    this.currentZoom + constants.MIN_ZOOM_PERCENTAGE : constants.MAX_ZOOM_PERCENTAGE;
                break;
            case enums.ZoomType.CustomZoomOut:
                if (this.currentZoom > constants.MAX_ZOOM_PERCENTAGE) {
                    zoomFactor = (constants.MAX_ZOOM_PERCENTAGE - this.currentZoom) / constants.MIN_ZOOM_PERCENTAGE;
                    updatedZoomPercentage = zoomFactor >= 1 ?
                        this.currentZoom + constants.MIN_ZOOM_PERCENTAGE : constants.MAX_ZOOM_PERCENTAGE;
                }
                else {
                    zoomFactor = (this.currentZoom - constants.MIN_ZOOM_PERCENTAGE);
                    updatedZoomPercentage = zoomFactor >= constants.MIN_ZOOM_PERCENTAGE ?
                        this.currentZoom - constants.MIN_ZOOM_PERCENTAGE : constants.MIN_ZOOM_PERCENTAGE;
                }
                break;
            case enums.ZoomType.PinchOut:
                updatedZoomPercentage = this.currentZoom + constants.PINCH_ZOOM_FACTOR <= constants.MAX_ZOOM_PERCENTAGE ?
                    this.currentZoom + constants.PINCH_ZOOM_FACTOR : constants.MAX_ZOOM_PERCENTAGE;
                break;
            case enums.ZoomType.PinchIn:
                updatedZoomPercentage = this.currentZoom - constants.PINCH_ZOOM_FACTOR >= constants.MIN_ZOOM_PERCENTAGE ?
                    this.currentZoom - constants.PINCH_ZOOM_FACTOR : constants.MIN_ZOOM_PERCENTAGE;
                break;
            case enums.ZoomType.UserInput:
                updatedZoomPercentage = userZoomValue;
                break;
            default:
                break;
        }
        return updatedZoomPercentage;
    };
    return StructuredZoomScaleManager;
}(zoomScaleManagerBase));
module.exports = StructuredZoomScaleManager;
//# sourceMappingURL=structuredzoomscalemanager.js.map