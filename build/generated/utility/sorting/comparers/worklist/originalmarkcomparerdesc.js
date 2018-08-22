"use strict";
/**
 * This is a Mark comparer class and method
 */
var OriginalMarkComparerDesc = (function () {
    function OriginalMarkComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of Mark */
    OriginalMarkComparerDesc.prototype.compare = function (a, b) {
        if (((a.markingProgress < 100) ? -100 : a.originalMarkTotal) >
            ((b.markingProgress < 100) ? -100 : b.originalMarkTotal)) {
            return -1;
        }
        if (((a.markingProgress < 100) ? -100 : a.originalMarkTotal) <
            ((b.markingProgress < 100) ? -100 : b.originalMarkTotal)) {
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
    return OriginalMarkComparerDesc;
}());
module.exports = OriginalMarkComparerDesc;
//# sourceMappingURL=originalmarkcomparerdesc.js.map