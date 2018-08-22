"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Candidate number comparer class and method
 */
var StdCandidateComparer = (function () {
    function StdCandidateComparer() {
    }
    /** Comparer to sort the work list in ascending order of Candidate number */
    StdCandidateComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSort(+a.centreCandidateNumber, +b.centreCandidateNumber);
        if (value === 0) {
            return comparerhelper.integerSort(+a.candidateScriptId, +b.candidateScriptId);
        }
        return value;
    };
    return StdCandidateComparer;
}());
module.exports = StdCandidateComparer;
//# sourceMappingURL=stdcandidatecomparer.js.map