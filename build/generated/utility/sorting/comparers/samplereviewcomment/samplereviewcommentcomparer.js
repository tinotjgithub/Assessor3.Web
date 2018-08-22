"use strict";
/**
 * This is a review comment comparer class and method
 */
var SampleReviewCommentComparer = (function () {
    function SampleReviewCommentComparer() {
    }
    /**
     * Comparer to sort review comment
     */
    SampleReviewCommentComparer.prototype.compare = function (a, b) {
        if (a.sequenceNo < b.sequenceNo) {
            return -1;
        }
        if (a.sequenceNo > b.sequenceNo) {
            return 1;
        }
        return 0;
    };
    return SampleReviewCommentComparer;
}());
module.exports = SampleReviewCommentComparer;
//# sourceMappingURL=samplereviewcommentcomparer.js.map