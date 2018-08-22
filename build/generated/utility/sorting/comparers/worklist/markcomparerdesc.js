"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Mark comparer class and method
 */
var MarkComparerDesc = (function () {
    function MarkComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of Mark */
    MarkComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSortDesc(((a.updatedDate === null) ? -1 : a.totalMarkValue), ((b.updatedDate === null) ? -1 : b.totalMarkValue));
        if (value === 0) {
            return comparerhelper.integerSort(+a.displayId, +b.displayId);
        }
        return value;
    };
    return MarkComparerDesc;
}());
module.exports = MarkComparerDesc;
//# sourceMappingURL=markcomparerdesc.js.map