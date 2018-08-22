"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Centre number comparer class and method
 */
var StdCentreComparerDesc = (function () {
    function StdCentreComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of Centre number */
    StdCentreComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSortDesc(+a.centreNumber, +b.centreNumber);
        if (value === 0) {
            return comparerhelper.integerSort(+a.candidateScriptId, +b.candidateScriptId);
        }
        return value;
    };
    return StdCentreComparerDesc;
}());
module.exports = StdCentreComparerDesc;
//# sourceMappingURL=stdcentrecomparerdesc.js.map