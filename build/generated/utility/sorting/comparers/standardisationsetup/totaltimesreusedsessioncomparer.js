"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * Total times reused session comparer class and method.
 */
var TotalTimesReUsedSessionComparer = (function () {
    function TotalTimesReUsedSessionComparer() {
    }
    /**
     * Comparer method for total times reused session
     * @param a
     * @param b
     */
    TotalTimesReUsedSessionComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSort(a.timesReUsedSession, b.timesReUsedSession);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return TotalTimesReUsedSessionComparer;
}());
module.exports = TotalTimesReUsedSessionComparer;
//# sourceMappingURL=totaltimesreusedsessioncomparer.js.map