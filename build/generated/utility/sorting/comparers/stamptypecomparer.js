"use strict";
/**
 * This is a stamp type comparer  class and method
 * All comparers should implement the ComparerInterface
 */
var StampTypeComparer = (function () {
    function StampTypeComparer() {
    }
    /** Comparer to sort the stamp type in ascending order */
    StampTypeComparer.prototype.compare = function (a, b) {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    };
    return StampTypeComparer;
}());
module.exports = StampTypeComparer;
//# sourceMappingURL=stamptypecomparer.js.map