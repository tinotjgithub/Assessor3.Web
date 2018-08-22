"use strict";
/**
 * This is a Script comparer class and method
 */
var StdScriptComparer = (function () {
    function StdScriptComparer() {
    }
    /** Comparer to sort the standardisation centre list in ascending order of Scripts */
    StdScriptComparer.prototype.compare = function (a, b) {
        if (a.totalScripts > b.totalScripts) {
            return 1;
        }
        if (a.totalScripts < b.totalScripts) {
            return -1;
        }
        return 0;
    };
    return StdScriptComparer;
}());
module.exports = StdScriptComparer;
//# sourceMappingURL=stdscriptcomparer.js.map