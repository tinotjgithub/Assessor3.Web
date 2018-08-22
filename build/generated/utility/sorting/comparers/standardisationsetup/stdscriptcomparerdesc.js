"use strict";
/**
 * This is a Script comparer class and method
 */
var StdScriptComparerDesc = (function () {
    function StdScriptComparerDesc() {
    }
    /** Comparer to sort the standardisation centre list in descending order of Scripts */
    StdScriptComparerDesc.prototype.compare = function (a, b) {
        if (a.totalScripts > b.totalScripts) {
            return -1;
        }
        if (a.totalScripts < b.totalScripts) {
            return 1;
        }
        return 0;
    };
    return StdScriptComparerDesc;
}());
module.exports = StdScriptComparerDesc;
//# sourceMappingURL=stdscriptcomparerdesc.js.map