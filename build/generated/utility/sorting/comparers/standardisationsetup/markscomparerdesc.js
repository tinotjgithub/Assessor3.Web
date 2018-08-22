"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Mark comparer class and method
 */
var MarksComparerDesc = (function () {
    function MarksComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of Mark */
    MarksComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSortDesc(((a.updatedDate === null) ? -1 : a.totalMarkValue), ((b.updatedDate === null) ? -1 : b.totalMarkValue));
        if (value === 0) {
            return comparerhelper.integerSort(+a.candidateScriptId, +b.candidateScriptId);
        }
        return value;
    };
    return MarksComparerDesc;
}());
module.exports = MarksComparerDesc;
//# sourceMappingURL=markscomparerdesc.js.map