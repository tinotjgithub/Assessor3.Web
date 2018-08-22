"use strict";
/**
 * This is a First Scanned comparer class and method
 */
var StdFirstScannedComparer = (function () {
    function StdFirstScannedComparer() {
    }
    /** Comparer to sort the standardisation list in ascending order of first scanned */
    StdFirstScannedComparer.prototype.compare = function (a, b) {
        if (a.firstScanned > b.firstScanned) {
            return 1;
        }
        if (a.firstScanned < b.firstScanned) {
            return -1;
        }
        return 0;
    };
    return StdFirstScannedComparer;
}());
module.exports = StdFirstScannedComparer;
//# sourceMappingURL=stdfirstscannedcomparer.js.map