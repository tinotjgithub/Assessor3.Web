"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Centre number comparer class and method
 */
var StdCentreComparer = (function () {
    function StdCentreComparer() {
    }
    /** Comparer to sort the work list in ascending order of Centre number */
    StdCentreComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.integerSort(+a.centreNumber, +b.centreNumber);
        if (value === 0) {
            return comparerhelper.integerSort(+a.candidateScriptId, +b.candidateScriptId);
        }
        return value;
    };
    return StdCentreComparer;
}());
module.exports = StdCentreComparer;
//# sourceMappingURL=stdcentrecomparer.js.map