"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Candidate Number comparer class and method
 */
var StdCandidateComparerDesc = (function () {
    function StdCandidateComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of Candidate number */
    StdCandidateComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSortDesc(+a.centreCandidateNumber, +b.centreCandidateNumber);
        if (value === 0) {
            return comparerhelper.integerSort(+a.candidateScriptId, +b.candidateScriptId);
        }
        return value;
    };
    return StdCandidateComparerDesc;
}());
module.exports = StdCandidateComparerDesc;
//# sourceMappingURL=stdcandidatecomparerdesc.js.map