"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Mark comparer class and method
 */
var MarkComparer = (function () {
    function MarkComparer() {
    }
    /** Comparer to sort the work list in ascending order of Mark */
    MarkComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSort(((a.updatedDate === null) ? -1 : a.totalMarkValue), ((b.updatedDate === null) ? -1 : b.totalMarkValue));
        if (value === 0) {
            return comparerhelper.integerSort(+a.displayId, +b.displayId);
        }
        return value;
    };
    return MarkComparer;
}());
module.exports = MarkComparer;
//# sourceMappingURL=markcomparer.js.map