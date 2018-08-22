import enums = require('../../../utility/enums');
class ZoomScaleManager {

    // Holds the actual object width.
    // If this is an image will contain naturalWidth of the same image
    protected maximumNaturalZoomableWidth: number;

    // Indicate the container width which holds the zoomable object.
    protected containerWidth: number;

    // Holds the base scale factor which determines the scaling point.
    protected zoomableScaleFactor: number;

    // Holds a value indicating the current amount of zoom
    // which is going to save as useroption.
    protected currentZoom: number;

    protected maximumNaturalZoomableHeight: number;

    /**
     * Get the container width after zoom
     * eg? if the zoomable object width is  1628 and container which holds
     * this zoomable object is 889 the result willbe 100%
     * @returns
     */
    public get getContainerWidthInPixel(): number {
        return ((this.currentZoom / 100) * this.maximumNaturalZoomableWidth);
    }

    /**
     * set the container width on update
     * @param {number} updatedWidth
     */
    public set zoomableContainerWidth(updatedWidth: number) {
        this.containerWidth = updatedWidth;

        // if fitwidth or height update the zoom with updated container width.
        if (this.currentZoom === 0) {
            this.currentZoom = ((updatedWidth / this.maximumNaturalZoomableWidth) * 100);
        }
    }

    /**
     * Setting the zoom attributes
     * @param naturalWidth
     * @param containerClientWidth
     */
    protected setZoomAttributes(naturalWidth: number, containerClientWidth: number, naturalHeight: number): void {
        this.maximumNaturalZoomableWidth = naturalWidth;
        this.containerWidth = containerClientWidth;
        this.maximumNaturalZoomableHeight = naturalHeight;
    }

    /**
     * Update zoom to fit width
     * @param wrapperWidth
     */
    public updateZoomToFitWidth(wrapperWidth: number, zoneWidth: number = 0): void {
        if (zoneWidth > 0) {
            this.currentZoom = (wrapperWidth / zoneWidth) * 100;
        } else {
            this.currentZoom = (wrapperWidth / this.maximumNaturalZoomableWidth) * 100;
        }
    }

    /**
     * Update zoom to fit height
     * @param wrapperHeight
     */
    public updateZoomToFitHeight(wrapperHeight: number, zoneHeight: number = 0): void {
        if (zoneHeight > 0) {
            this.currentZoom = (wrapperHeight / zoneHeight) * 100;
        } else {
            this.currentZoom = (wrapperHeight / this.maximumNaturalZoomableHeight) * 100;
        }
    }
}
export = ZoomScaleManager;