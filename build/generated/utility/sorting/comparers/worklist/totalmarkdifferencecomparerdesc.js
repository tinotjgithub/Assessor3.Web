"use strict";
/**
 * This is a Total mark difference comparer class and method
 */
var TotalMarkDifferenceComparerDesc = (function () {
    function TotalMarkDifferenceComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of total mark difference */
    TotalMarkDifferenceComparerDesc.prototype.compare = function (a, b) {
        if (((a.seedTypeId === 0) ? '0' : a.totalMarksDifference) >
            ((b.seedTypeId === 0) ? '0' : b.totalMarksDifference)) {
            return -1;
        }
        if (((a.seedTypeId === 0) ? '0' : a.totalMarksDifference) <
            ((b.seedTypeId === 0) ? '0' : b.totalMarksDifference)) {
            return 1;
        }
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    };
    return TotalMarkDifferenceComparerDesc;
}());
module.exports = TotalMarkDifferenceComparerDesc;
//# sourceMappingURL=totalmarkdifferencecomparerdesc.js.map