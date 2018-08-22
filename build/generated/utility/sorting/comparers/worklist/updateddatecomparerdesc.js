"use strict";
/**
 * This is a Updated date comparer class and method
 */
var UpdatedDateComparerDesc = (function () {
    function UpdatedDateComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of updated Date */
    UpdatedDateComparerDesc.prototype.compare = function (a, b) {
        var date = '01-01-1900';
        if (((a.updatedDate === null) ? date : a.updatedDate) <
            ((b.updatedDate === null) ? date : b.updatedDate)) {
            return 1;
        }
        if (((a.updatedDate === null) ? date : a.updatedDate) >
            ((b.updatedDate === null) ? date : b.updatedDate)) {
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
    return UpdatedDateComparerDesc;
}());
module.exports = UpdatedDateComparerDesc;
//# sourceMappingURL=updateddatecomparerdesc.js.map