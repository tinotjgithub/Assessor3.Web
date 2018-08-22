"use strict";
/**
 * This is a marking target list comparer class and method
 */
var MarkingTargetCompletedDateComparer = (function () {
    function MarkingTargetCompletedDateComparer() {
    }
    /** Comparer to sort the marking target list
     * in ascending order of marking mode id
     */
    MarkingTargetCompletedDateComparer.prototype.compare = function (a, b) {
        if (a.targetCompletedDate < b.targetCompletedDate) {
            return -1;
        }
        if (a.targetCompletedDate > b.targetCompletedDate) {
            return 1;
        }
        return 0;
    };
    return MarkingTargetCompletedDateComparer;
}());
module.exports = MarkingTargetCompletedDateComparer;
//# sourceMappingURL=markingtargetcompleteddatecomparer.js.map