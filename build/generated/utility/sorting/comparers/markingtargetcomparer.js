"use strict";
/**
 * This is a marking target list comparer class and method
 */
var MarkingTargetComparer = (function () {
    function MarkingTargetComparer() {
    }
    /** Comparer to sort the marking target list
     * in ascending order of marking mode id
     */
    MarkingTargetComparer.prototype.compare = function (a, b) {
        if (a.markingTargetDate < b.markingTargetDate) {
            return -1;
        }
        else if (a.markingTargetDate > b.markingTargetDate) {
            return 1;
        }
        else {
            if (a.markingModeID < b.markingModeID) {
                return -1;
            }
            if (a.markingModeID > b.markingModeID) {
                return 1;
            }
            return 0;
        }
    };
    return MarkingTargetComparer;
}());
module.exports = MarkingTargetComparer;
//# sourceMappingURL=markingtargetcomparer.js.map