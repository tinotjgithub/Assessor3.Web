"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * Total times reused comparer class and method.
 */
var TotalTimesReUsedComparerDesc = (function () {
    function TotalTimesReUsedComparerDesc() {
    }
    /**
     * Comparer method for total times reused.
     * @param a
     * @param b
     */
    TotalTimesReUsedComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSortDesc(a.timesReUsed, b.timesReUsed);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return TotalTimesReUsedComparerDesc;
}());
module.exports = TotalTimesReUsedComparerDesc;
//# sourceMappingURL=totaltimesreusedcomparerDesc.js.map