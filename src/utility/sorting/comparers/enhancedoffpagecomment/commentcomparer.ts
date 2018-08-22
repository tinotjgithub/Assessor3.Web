import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a comment comparer class and method
 */
class CommentComparer implements comparerInterface {
    /** Comparer to sort items in ascending order of comments */
    public compare(a: EnhancedOffPageCommentViewDataItem, b: EnhancedOffPageCommentViewDataItem) {
        if (a.comment.trim().toLowerCase() > b.comment.trim().toLowerCase()) {
            return 1;
        }
        if (a.comment.trim().toLowerCase() < b.comment.trim().toLowerCase()) {
            return -1;
        }

        return 0;
    }
}

export = CommentComparer;