"use strict";
/**
 * This is a Last updated date comparer class and method
 */
var LastUpdatedDateComparer = (function () {
    function LastUpdatedDateComparer() {
    }
    /** Comparer to sort the work list in ascending order of last updated Date */
    LastUpdatedDateComparer.prototype.compare = function (a, b) {
        if (a.lastUpdatedDate < b.lastUpdatedDate) {
            return -1;
        }
        if (a.lastUpdatedDate > b.lastUpdatedDate) {
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
    return LastUpdatedDateComparer;
}());
module.exports = LastUpdatedDateComparer;
//# sourceMappingURL=lastupdateddatecomparer.js.map