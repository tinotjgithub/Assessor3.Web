"use strict";
/**
 * This is a comment comparer class and method
 */
var CommentComparer = (function () {
    function CommentComparer() {
    }
    /** Comparer to sort items in decending order of comments */
    CommentComparer.prototype.compare = function (a, b) {
        if (a.comment.trim().toLowerCase() > b.comment.trim().toLowerCase()) {
            return -1;
        }
        if (a.comment.trim().toLowerCase() < b.comment.trim().toLowerCase()) {
            return 1;
        }
        return 0;
    };
    return CommentComparer;
}());
module.exports = CommentComparer;
//# sourceMappingURL=commentcomparerdesc.js.map