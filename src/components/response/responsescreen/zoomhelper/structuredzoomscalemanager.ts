import zoomScaleManagerBase = require('./zoomscalemanager');
import enums = require('../../../utility/enums');
import constants = require('../../../utility/constants');

class StructuredZoomScaleManager extends zoomScaleManagerBase {

    /**
     * Constructor StructuredZoomscaleManager
     */
    constructor() {
        super();
        this.currentZoom = 0;
    }

    private zoomFactor: number;

    /**
     * Set zoom factor
     * @param {number} factor
     */
    public setZoomFactor(factor: number) {
        this.zoomFactor = factor;
    }

    /**
     * Return the current zoom value
     * @returns
     */
    public get getCurrentZoom(): number {
        return this.currentZoom;
    }

    /**
     * Setting the initial zoom attributes.
     * @param {number} naturalWidth of the large image
     * @param {number} containerClientWidth the div container width
     */
    public setZoomAttributes(naturalWidth: number,
        containerClientWidth: number,
        naturalHeight: number): void {
        super.setZoomAttributes(naturalWidth, containerClientWidth, naturalHeight);
    }

    /**
     * Get the natural width of the zoomable object
     * @returns
     */
    public get naturalZoomableWidth(): number {
        return this.maximumNaturalZoomableWidth;
    }

    /**
     * Get the zoom value according to the width
     */
    public setZoomValue(value: number): void {

        this.currentZoom = value;
    }

    /**
     * Perform the zooming
     * @param {enums.ZoomType} zoomType
     * @param {any = undefined} zoomEvent
     * @param userZoomValue
     */
    public performZooming(zoomType: enums.ZoomType, zoomEvent: any = undefined, userZoomValue?: number) {
        this.currentZoom = this.getZoomValue(zoomType, userZoomValue);
    }

    /**
     * Apply the image width based on the rotation.
     * @param {boolean} hasRotatedImage
     * @returns
     */
    public getRotatedImageWidth(hasRotatedImage: boolean, imageZoneHeight: number = 0): number {

        // if the response has been rotated then we need to apply the changes
        // respect to the height of the rotated image, othervise noraml width.
        if (hasRotatedImage) {
            return (this.currentZoom / 100) * imageZoneHeight === 0 ? this.maximumNaturalZoomableHeight : imageZoneHeight;
        } else {
            return this.getContainerWidthInPixel;
        }
    }

    /**
     * Return the updated zoom percentage
     * @param {enums.ZoomType} zoomType
     * @param userZoomValue
     */
    private getZoomValue(zoomType: enums.ZoomType, userZoomValue?: number): number {

        // If the zoom value has not set yet, because the previous zoom preference
        // might be FitWidth/FitHeight, set the zoom value according to that.
        if (this.currentZoom === 0) {
            this.currentZoom = (this.containerWidth / this.naturalZoomableWidth) * 100;
        }

        let updatedZoomPercentage: number = 0;
        let zoomFactor: number;
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
                } else {
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
    }
}
export = StructuredZoomScaleManager;