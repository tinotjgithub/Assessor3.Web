"use strict";
/**
 * This is a Allocated date comparer class and method
 */
var SubmittedDateComparerDesc = (function () {
    function SubmittedDateComparerDesc() {
    }
    /** Comparer to sort the work list in ascending order of Allocated Date */
    SubmittedDateComparerDesc.prototype.compare = function (a, b) {
        if (a.submittedDate < b.submittedDate) {
            return 1;
        }
        if (a.submittedDate > b.submittedDate) {
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
    return SubmittedDateComparerDesc;
}());
module.exports = SubmittedDateComparerDesc;
//# sourceMappingURL=submitteddatecomparerdesc.js.map