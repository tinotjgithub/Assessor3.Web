import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is Supervisor review comment descending comparer class and method
 */
class SupervisorReviewCommentComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in descending order of Review comment column */
    public compare(a: ResponseBase, b: ResponseBase) {

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
    }
}

export = SupervisorReviewCommentComparerDesc;