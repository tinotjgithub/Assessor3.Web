"use strict";
var ZoomScaleManager = (function () {
    function ZoomScaleManager() {
    }
    Object.defineProperty(ZoomScaleManager.prototype, "getContainerWidthInPixel", {
        /**
         * Get the container width after zoom
         * eg? if the zoomable object width is  1628 and container which holds
         * this zoomable object is 889 the result willbe 100%
         * @returns
         */
        get: function () {
            return ((this.currentZoom / 100) * this.maximumNaturalZoomableWidth);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZoomScaleManager.prototype, "zoomableContainerWidth", {
        /**
         * set the container width on update
         * @param {number} updatedWidth
         */
        set: function (updatedWidth) {
            this.containerWidth = updatedWidth;
            // if fitwidth or height update the zoom with updated container width.
            if (this.currentZoom === 0) {
                this.currentZoom = ((updatedWidth / this.maximumNaturalZoomableWidth) * 100);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Setting the zoom attributes
     * @param naturalWidth
     * @param containerClientWidth
     */
    ZoomScaleManager.prototype.setZoomAttributes = function (naturalWidth, containerClientWidth, naturalHeight) {
        this.maximumNaturalZoomableWidth = naturalWidth;
        this.containerWidth = containerClientWidth;
        this.maximumNaturalZoomableHeight = naturalHeight;
    };
    /**
     * Update zoom to fit width
     * @param wrapperWidth
     */
    ZoomScaleManager.prototype.updateZoomToFitWidth = function (wrapperWidth, zoneWidth) {
        if (zoneWidth === void 0) { zoneWidth = 0; }
        if (zoneWidth > 0) {
            this.currentZoom = (wrapperWidth / zoneWidth) * 100;
        }
        else {
            this.currentZoom = (wrapperWidth / this.maximumNaturalZoomableWidth) * 100;
        }
    };
    /**
     * Update zoom to fit height
     * @param wrapperHeight
     */
    ZoomScaleManager.prototype.updateZoomToFitHeight = function (wrapperHeight, zoneHeight) {
        if (zoneHeight === void 0) { zoneHeight = 0; }
        if (zoneHeight > 0) {
            this.currentZoom = (wrapperHeight / zoneHeight) * 100;
        }
        else {
            this.currentZoom = (wrapperHeight / this.maximumNaturalZoomableHeight) * 100;
        }
    };
    return ZoomScaleManager;
}());
module.exports = ZoomScaleManager;
//# sourceMappingURL=zoomscalemanager.js.map