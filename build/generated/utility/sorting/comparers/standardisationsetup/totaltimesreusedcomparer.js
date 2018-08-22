"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * Total times reused comparer class and method.
 */
var TotalTimesReUsedComparer = (function () {
    function TotalTimesReUsedComparer() {
    }
    /**
     * Comparer method for total times reused.
     * @param a
     * @param b
     */
    TotalTimesReUsedComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSort(a.timesReUsed, b.timesReUsed);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return TotalTimesReUsedComparer;
}());
module.exports = TotalTimesReUsedComparer;
//# sourceMappingURL=totaltimesreusedcomparer.js.map