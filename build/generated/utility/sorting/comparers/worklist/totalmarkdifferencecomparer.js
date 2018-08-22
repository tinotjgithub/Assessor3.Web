"use strict";
/**
 * This is a Total mark difference comparer class and method
 */
var TotalMarkDifferenceComparer = (function () {
    function TotalMarkDifferenceComparer() {
    }
    /** Comparer to sort the work list in ascending order of total mark difference */
    TotalMarkDifferenceComparer.prototype.compare = function (a, b) {
        if (((a.seedTypeId === 0) ? '0' : a.totalMarksDifference) >
            ((b.seedTypeId === 0) ? '0' : b.totalMarksDifference)) {
            return 1;
        }
        if (((a.seedTypeId === 0) ? '0' : a.totalMarksDifference) <
            ((b.seedTypeId === 0) ? '0' : b.totalMarksDifference)) {
            return -1;
        }
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    };
    return TotalMarkDifferenceComparer;
}());
module.exports = TotalMarkDifferenceComparer;
//# sourceMappingURL=totalmarkdifferencecomparer.js.map