"use strict";
/**
 * This is a Absolute mark difference comparer class and method
 */
var AbsoluteMarkDifferenceComparerDesc = (function () {
    function AbsoluteMarkDifferenceComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of Absolute mark difference */
    AbsoluteMarkDifferenceComparerDesc.prototype.compare = function (a, b) {
        if (((a.seedTypeId === 0) ? '0' : a.absoluteMarksDifference) >
            ((b.seedTypeId === 0) ? '0' : b.absoluteMarksDifference)) {
            return -1;
        }
        if (((a.seedTypeId === 0) ? '0' : a.absoluteMarksDifference) <
            ((b.seedTypeId === 0) ? '0' : b.absoluteMarksDifference)) {
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
    return AbsoluteMarkDifferenceComparerDesc;
}());
module.exports = AbsoluteMarkDifferenceComparerDesc;
//# sourceMappingURL=absolutemarkdifferencecomparerdesc.js.map