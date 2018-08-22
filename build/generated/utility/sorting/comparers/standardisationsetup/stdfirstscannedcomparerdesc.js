"use strict";
/**
 * This is a First scanned comparer class and method
 */
var StdFirstScannedComparerDesc = (function () {
    function StdFirstScannedComparerDesc() {
    }
    /** Comparer to sort the standardisation list in descending order of first scanned */
    StdFirstScannedComparerDesc.prototype.compare = function (a, b) {
        if (a.firstScanned > b.firstScanned) {
            return -1;
        }
        if (a.firstScanned < b.firstScanned) {
            return 1;
        }
        return 0;
    };
    return StdFirstScannedComparerDesc;
}());
module.exports = StdFirstScannedComparerDesc;
//# sourceMappingURL=stdfirstscannedcomparerdesc.js.map