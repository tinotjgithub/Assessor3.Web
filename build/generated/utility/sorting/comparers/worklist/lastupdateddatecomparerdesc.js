"use strict";
/**
 * This is a Last updated date comparer class and method
 */
var LastUpdatedDateComparerDesc = (function () {
    function LastUpdatedDateComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of last updated Date */
    LastUpdatedDateComparerDesc.prototype.compare = function (a, b) {
        if (a.lastUpdatedDate < b.lastUpdatedDate) {
            return 1;
        }
        if (a.lastUpdatedDate > b.lastUpdatedDate) {
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
    return LastUpdatedDateComparerDesc;
}());
module.exports = LastUpdatedDateComparerDesc;
//# sourceMappingURL=lastupdateddatecomparerdesc.js.map