"use strict";
/**
 * This is a Response ID comparer class and method
 */
var ResponseIdComparerDesc = (function () {
    function ResponseIdComparerDesc() {
    }
    /** Comparer to sort the work list in ascending order of Response ID */
    ResponseIdComparerDesc.prototype.compare = function (a, b) {
        if (+a.displayId > +b.displayId) {
            return -1;
        }
        if (+a.displayId < +b.displayId) {
            return 1;
        }
        return 0;
    };
    return ResponseIdComparerDesc;
}());
module.exports = ResponseIdComparerDesc;
//# sourceMappingURL=responseidcomparerdesc.js.map