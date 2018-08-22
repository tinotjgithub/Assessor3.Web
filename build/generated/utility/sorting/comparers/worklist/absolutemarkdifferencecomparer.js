"use strict";
/**
 * This is a Absolute mark difference comparer class and method
 */
var AbsoluteMarkDifferenceComparer = (function () {
    function AbsoluteMarkDifferenceComparer() {
    }
    /** Comparer to sort the work list in ascending order of Absolute mark difference */
    AbsoluteMarkDifferenceComparer.prototype.compare = function (a, b) {
        if (((a.seedTypeId === 0) ? '0' : a.absoluteMarksDifference) >
            ((b.seedTypeId === 0) ? '0' : b.absoluteMarksDifference)) {
            return 1;
        }
        if (((a.seedTypeId === 0) ? '0' : a.absoluteMarksDifference) <
            ((b.seedTypeId === 0) ? '0' : b.absoluteMarksDifference)) {
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
    return AbsoluteMarkDifferenceComparer;
}());
module.exports = AbsoluteMarkDifferenceComparer;
//# sourceMappingURL=absolutemarkdifferencecomparer.js.map