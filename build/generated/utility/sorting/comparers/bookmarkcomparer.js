"use strict";
/**
 * This is a bookmark list comparer class and method
 */
var BookmarkComparer = (function () {
    function BookmarkComparer() {
    }
    /** Comparer to sort bookmarks based on the alphabetical order of the bookmark names
     * If there are bookmarks with the same name, then sort based on time of creation, the oldest comes first.
     */
    BookmarkComparer.prototype.compare = function (a, b) {
        if (a.comment.toLowerCase() < b.comment.toLowerCase()) {
            return -1;
        }
        else if (a.comment.toLowerCase() > b.comment.toLowerCase()) {
            return 1;
        }
        else {
            if (a.createdDate < b.createdDate) {
                return -1;
            }
            if (a.createdDate > b.createdDate) {
                return 1;
            }
            return 0;
        }
    };
    return BookmarkComparer;
}());
module.exports = BookmarkComparer;
//# sourceMappingURL=bookmarkcomparer.js.map