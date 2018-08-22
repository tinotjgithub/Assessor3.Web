"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Candidate number comparer class and method
 */
var CandidateComparer = (function () {
    function CandidateComparer() {
    }
    /** Comparer to sort the work list in ascending order of Candidate number */
    CandidateComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSort(+a.centreCandidateNumber, +b.centreCandidateNumber);
        if (value === 0) {
            return comparerhelper.integerSort(+a.displayId, +b.displayId);
        }
        return value;
    };
    return CandidateComparer;
}());
module.exports = CandidateComparer;
//# sourceMappingURL=candidatecomparer.js.map