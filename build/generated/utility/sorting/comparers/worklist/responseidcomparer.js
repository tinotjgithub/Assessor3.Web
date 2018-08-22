"use strict";
/**
 * This is a Response ID comparer class and method
 */
var ResponseIdComparer = (function () {
    function ResponseIdComparer() {
    }
    /** Comparer to sort the work list in ascending order of Response ID */
    ResponseIdComparer.prototype.compare = function (a, b) {
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    };
    return ResponseIdComparer;
}());
module.exports = ResponseIdComparer;
//# sourceMappingURL=responseidcomparer.js.map