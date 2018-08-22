"use strict";
/**
 * This is a Mark comparer class and method
 */
var OriginalMarkComparer = (function () {
    function OriginalMarkComparer() {
    }
    /** Comparer to sort the work list in ascending order of Mark */
    OriginalMarkComparer.prototype.compare = function (a, b) {
        if (((a.markingProgress < 100) ? -100 : a.originalMarkTotal) >
            ((b.markingProgress < 100) ? -100 : b.originalMarkTotal)) {
            return 1;
        }
        if (((a.markingProgress < 100) ? -100 : a.originalMarkTotal) <
            ((b.markingProgress < 100) ? -100 : b.originalMarkTotal)) {
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
    return OriginalMarkComparer;
}());
module.exports = OriginalMarkComparer;
//# sourceMappingURL=originalmarkcomparer.js.map