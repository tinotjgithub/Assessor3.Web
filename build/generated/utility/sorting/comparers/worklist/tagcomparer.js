"use strict";
var TagComparer = (function () {
    function TagComparer() {
    }
    /** Comparer to sort the work list in ascending order of Tag indicator */
    TagComparer.prototype.compare = function (a, b) {
        // "No Tag" with tag id 0 should always display at last
        if (a.tagOrder === 0 && b.tagOrder !== 0) {
            return 1;
        }
        if (a.tagOrder !== 0 && b.tagOrder === 0) {
            return -1;
        }
        if (a.tagOrder !== 0 && b.tagOrder !== 0) {
            if (a.tagOrder > b.tagOrder) {
                return 1;
            }
            if (a.tagOrder < b.tagOrder) {
                return -1;
            }
        }
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    };
    return TagComparer;
}());
module.exports = TagComparer;
//# sourceMappingURL=tagcomparer.js.map