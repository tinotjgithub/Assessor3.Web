"use strict";
var DeviceHelper = (function () {
    function DeviceHelper() {
    }
    /**
     * return true if the device is supported touch.
     */
    DeviceHelper.isTouchDevice = function () {
        var isTouchDevice = 'ontouchstart' in document.documentElement;
        /* it returns a zero on a mouse only computer, or 1 or more on a touch enabled computer(for IE) */
        var touchpoints = navigator.maxTouchPoints;
        return (isTouchDevice || touchpoints > 0);
    };
    /**
     * return true for Microsoft touch devices
     */
    DeviceHelper.isMSTouchDevice = function () {
        return navigator.pointerEnabled ||
            navigator.msPointerEnabled ||
            (navigator.userAgent.match(/Windows/i) && this.isTouchDevice());
    };
    return DeviceHelper;
}());
module.exports = DeviceHelper;
//# sourceMappingURL=devicehelper.js.map