"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * Total times reused session descending comparer class and method.
 */
var TotalTimesReUsedSessionComparerDesc = (function () {
    function TotalTimesReUsedSessionComparerDesc() {
    }
    /**
     * Comparer method for total times reused session
     * @param a
     * @param b
     */
    TotalTimesReUsedSessionComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSortDesc(a.timesReUsedSession, b.timesReUsedSession);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return TotalTimesReUsedSessionComparerDesc;
}());
module.exports = TotalTimesReUsedSessionComparerDesc;
//# sourceMappingURL=totaltimesreusedsessioncomparerDesc.js.map