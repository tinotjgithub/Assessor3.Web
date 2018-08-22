class DeviceHelper {
    /**
     * return true if the device is supported touch.
     */
    public static isTouchDevice(): boolean {

        let isTouchDevice = 'ontouchstart' in document.documentElement;
        /* it returns a zero on a mouse only computer, or 1 or more on a touch enabled computer(for IE) */
        let touchpoints = navigator.maxTouchPoints;

        return (isTouchDevice || touchpoints > 0);
    }

    /**
     * return true for Microsoft touch devices
     */
    public static isMSTouchDevice(): boolean {
        return navigator.pointerEnabled ||
            navigator.msPointerEnabled ||
            (navigator.userAgent.match(/Windows/i) && this.isTouchDevice());
    }
}
export = DeviceHelper;