"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Centre number comparer class and method
 */
var CentreComparerDesc = (function () {
    function CentreComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of Centre number */
    CentreComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSortDesc(+a.centreNumber, +b.centreNumber);
        if (value === 0) {
            return comparerhelper.integerSort(+a.displayId, +b.displayId);
        }
        return value;
    };
    return CentreComparerDesc;
}());
module.exports = CentreComparerDesc;
//# sourceMappingURL=centrecomparerdesc.js.map