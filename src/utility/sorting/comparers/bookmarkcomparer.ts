import bookmark = require('../../../stores/marking/bookmarkcomponentwrapper');
import comparerInterface = require('../sortbase/comparerinterface');

/**
 * This is a bookmark list comparer class and method
 */
class BookmarkComparer implements comparerInterface {
    /** Comparer to sort bookmarks based on the alphabetical order of the bookmark names
     * If there are bookmarks with the same name, then sort based on time of creation, the oldest comes first.
     */
    public compare(a: bookmark, b: bookmark) {

        if (a.comment.toLowerCase() < b.comment.toLowerCase()) {
            return -1;
        } else if (a.comment.toLowerCase() > b.comment.toLowerCase()) {
            return 1;
        } else {
            if (a.createdDate < b.createdDate) {
                return -1;
            }
            if (a.createdDate > b.createdDate) {
                return 1;
            }

            return 0;
        }
    }
}

export = BookmarkComparer;