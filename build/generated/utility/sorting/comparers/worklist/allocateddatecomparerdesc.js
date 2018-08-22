"use strict";
/**
 * This is a Allocated date comparer class and method
 */
var AllocatedDateComparerDesc = (function () {
    function AllocatedDateComparerDesc() {
    }
    /** Comparer to sort the work list in ascending order of Allocated Date */
    AllocatedDateComparerDesc.prototype.compare = function (a, b) {
        if (a.allocatedDate < b.allocatedDate) {
            return 1;
        }
        if (a.allocatedDate > b.allocatedDate) {
            return -1;
        }
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    };
    return AllocatedDateComparerDesc;
}());
module.exports = AllocatedDateComparerDesc;
//# sourceMappingURL=allocateddatecomparerdesc.js.map