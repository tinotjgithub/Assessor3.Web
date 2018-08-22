"use strict";
/**
 * This is a updated date comparer class and method
 */
var UpdatedDateComparer = (function () {
    function UpdatedDateComparer() {
    }
    /** Comparer to sort the work list in ascending order of updated Date */
    UpdatedDateComparer.prototype.compare = function (a, b) {
        var date = '01-01-1900';
        if (((a.updatedDate === null) ? date : a.updatedDate) <
            ((b.updatedDate === null) ? date : b.updatedDate)) {
            return -1;
        }
        if (((a.updatedDate === null) ? date : a.updatedDate) >
            ((b.updatedDate === null) ? date : b.updatedDate)) {
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
    return UpdatedDateComparer;
}());
module.exports = UpdatedDateComparer;
//# sourceMappingURL=updateddatecomparer.js.map