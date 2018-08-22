"use strict";
/**
 * This is a Script available comparer class and method
 */
var StdScriptAvailableComparer = (function () {
    function StdScriptAvailableComparer() {
    }
    /** Comparer to sort the standardisation centre list in ascending order of Available scripts */
    StdScriptAvailableComparer.prototype.compare = function (a, b) {
        if (a.availableScripts > b.availableScripts) {
            return 1;
        }
        if (a.availableScripts < b.availableScripts) {
            return -1;
        }
        return 0;
    };
    return StdScriptAvailableComparer;
}());
module.exports = StdScriptAvailableComparer;
//# sourceMappingURL=stdscriptavailablecomparer.js.map