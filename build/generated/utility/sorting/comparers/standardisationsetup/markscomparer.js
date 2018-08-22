"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Mark comparer class and method
 */
var MarksComparer = (function () {
    function MarksComparer() {
    }
    /** Comparer to sort the work list in ascending order of Mark */
    MarksComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSort(((a.updatedDate === null) ? -1 : a.totalMarkValue), ((b.updatedDate === null) ? -1 : b.totalMarkValue));
        if (value === 0) {
            return comparerhelper.integerSort(+a.candidateScriptId, +b.candidateScriptId);
        }
        return value;
    };
    return MarksComparer;
}());
module.exports = MarksComparer;
//# sourceMappingURL=markscomparer.js.map