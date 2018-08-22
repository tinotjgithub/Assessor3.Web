"use strict";
/**
 * This is a Centre number comparer class and method
 */
var StdScriptAvailableComparerDesc = (function () {
    function StdScriptAvailableComparerDesc() {
    }
    /** Comparer to sort the standardisation centre list in decending order of Available scripts */
    StdScriptAvailableComparerDesc.prototype.compare = function (a, b) {
        if (a.availableScripts > b.availableScripts) {
            return -1;
        }
        if (a.availableScripts < b.availableScripts) {
            return 1;
        }
        return 0;
    };
    return StdScriptAvailableComparerDesc;
}());
module.exports = StdScriptAvailableComparerDesc;
//# sourceMappingURL=stdscriptavailablecomparerdesc.js.map