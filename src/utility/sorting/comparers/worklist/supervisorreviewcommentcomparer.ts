import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is Supervisor review comment comparer class and method
 */
class SupervisorReviewCommentComparer implements comparerInterface {
    /** Comparer to sort the work list in ascending order of review comment column */
    public compare(a: ResponseBase, b: ResponseBase) {
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
    }
}

export = SupervisorReviewCommentComparer;