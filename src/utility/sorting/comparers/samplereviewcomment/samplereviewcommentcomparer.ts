import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a review comment comparer class and method
 */
class SampleReviewCommentComparer implements comparerInterface {
    /**
     * Comparer to sort review comment
     */
    public compare(a: any, b: any) {
        if (a.sequenceNo < b.sequenceNo) {
            return -1;
        }

        if (a.sequenceNo > b.sequenceNo) {
            return 1;
        }

        return 0;
    }
}

export = SampleReviewCommentComparer;