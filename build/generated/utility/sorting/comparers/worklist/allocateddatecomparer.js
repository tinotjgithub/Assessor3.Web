"use strict";
/**
 * This is a Allocated date comparer class and method
 */
var AllocatedDateComparer = (function () {
    function AllocatedDateComparer() {
    }
    /** Comparer to sort the work list in ascending order of Allocated Date */
    AllocatedDateComparer.prototype.compare = function (a, b) {
        if (a.allocatedDate < b.allocatedDate) {
            return -1;
        }
        if (a.allocatedDate > b.allocatedDate) {
            return 1;
        }
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    };
    return AllocatedDateComparer;
}());
module.exports = AllocatedDateComparer;
//# sourceMappingURL=allocateddatecomparer.js.map