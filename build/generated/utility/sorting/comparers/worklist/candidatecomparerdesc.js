"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Candidate Number comparer class and method
 */
var CandidateComparer = (function () {
    function CandidateComparer() {
    }
    /** Comparer to sort the work list in descending order of Candidate number */
    CandidateComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSortDesc(+a.centreCandidateNumber, +b.centreCandidateNumber);
        if (value === 0) {
            return comparerhelper.integerSort(+a.displayId, +b.displayId);
        }
        return value;
    };
    return CandidateComparer;
}());
module.exports = CandidateComparer;
//# sourceMappingURL=candidatecomparerdesc.js.map