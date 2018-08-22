"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Centre number comparer class and method
 */
var CentreComparer = (function () {
    function CentreComparer() {
    }
    /** Comparer to sort the work list in ascending order of Centre number */
    CentreComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSort(+a.centreNumber, +b.centreNumber);
        if (value === 0) {
            return comparerhelper.integerSort(+a.displayId, +b.displayId);
        }
        return value;
    };
    return CentreComparer;
}());
module.exports = CentreComparer;
//# sourceMappingURL=centrecomparer.js.map