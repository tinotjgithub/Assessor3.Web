"use strict";
/**
 * Entity class for busy indicator
 */
var BusyIndicatorParameter = (function () {
    /**
     * Initializing new instance of busy indicator entity.
     */
    function BusyIndicatorParameter(busyIndicatorText, style) {
        this.busyIndicatorText = busyIndicatorText;
        this.style = style;
    }
    Object.defineProperty(BusyIndicatorParameter.prototype, "BusyIndicatorText", {
        /**
         * Returns back the text to be shown in the busy indicator
         */
        get: function () {
            return this.busyIndicatorText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BusyIndicatorParameter.prototype, "BusyIndicatorStyle", {
        /**
         * Returns busy indicator style
         */
        get: function () {
            return this.style;
        },
        enumerable: true,
        configurable: true
    });
    return BusyIndicatorParameter;
}());
module.exports = BusyIndicatorParameter;
//# sourceMappingURL=busyindicatorparameter.js.map