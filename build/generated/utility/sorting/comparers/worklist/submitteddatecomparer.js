"use strict";
/**
 * This is a Allocated date comparer class and method
 */
var SubmittedDateComparer = (function () {
    function SubmittedDateComparer() {
    }
    /** Comparer to sort the work list in ascending order of Allocated Date */
    SubmittedDateComparer.prototype.compare = function (a, b) {
        if (a.submittedDate < b.submittedDate) {
            return -1;
        }
        if (a.submittedDate > b.submittedDate) {
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
    return SubmittedDateComparer;
}());
module.exports = SubmittedDateComparer;
//# sourceMappingURL=submitteddatecomparer.js.map