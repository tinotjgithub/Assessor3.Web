"use strict";
/**
 * This is Supervisor review comment comparer class and method
 */
var SupervisorReviewCommentComparer = (function () {
    function SupervisorReviewCommentComparer() {
    }
    /** Comparer to sort the work list in ascending order of review comment column */
    SupervisorReviewCommentComparer.prototype.compare = function (a, b) {
        if (a.setAsReviewedCommentId > b.setAsReviewedCommentId) {
            return 1;
        }
        if (a.setAsReviewedCommentId < b.setAsReviewedCommentId) {
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
    return SupervisorReviewCommentComparer;
}());
module.exports = SupervisorReviewCommentComparer;
//# sourceMappingURL=supervisorreviewcommentcomparer.js.map