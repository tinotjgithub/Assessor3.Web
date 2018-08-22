import enums = require('../../enums');
interface ZoomAttributes {
    // Indicating the zoom type
    zoomType: enums.ZoomType;
    // The zoom event
    zoomEvent: any;
}
export = ZoomAttributes;