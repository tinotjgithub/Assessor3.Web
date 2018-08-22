"use strict";
/**
 * Holds the data service failure reason
 */
var ConcurrentSessionErrorReturn = (function () {
    /**
     * Initialising instance of service error return.
     *
     * @param {string} error
     */
    function ConcurrentSessionErrorReturn(error) {
        this._error = error;
    }
    Object.defineProperty(ConcurrentSessionErrorReturn.prototype, "error", {
        /**
         * Gets a value indicating the dataservice error
         * @returns
         */
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    return ConcurrentSessionErrorReturn;
}());
module.exports = ConcurrentSessionErrorReturn;
//# sourceMappingURL=concurrentsessionerrorreturn.js.map