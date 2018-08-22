"use strict";
/**
 * This is Supervisor review comment descending comparer class and method
 */
var SupervisorReviewCommentComparerDesc = (function () {
    function SupervisorReviewCommentComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of Review comment column */
    SupervisorReviewCommentComparerDesc.prototype.compare = function (a, b) {
        if (a.setAsReviewedCommentId > b.setAsReviewedCommentId) {
            return -1;
        }
        if (a.setAsReviewedCommentId < b.setAsReviewedCommentId) {
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
    return SupervisorReviewCommentComparerDesc;
}());
module.exports = SupervisorReviewCommentComparerDesc;
//# sourceMappingURL=supervisorreviewcommentcomparerdesc.js.map