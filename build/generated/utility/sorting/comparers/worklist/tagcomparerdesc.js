"use strict";
var TagComparerDesc = (function () {
    function TagComparerDesc() {
    }
    /** Comparer to sort the work list in Descending order of Tag indicator */
    TagComparerDesc.prototype.compare = function (a, b) {
        // "No Tag" with tag id 0 should always display at first
        if (a.tagOrder === 0 && b.tagOrder !== 0) {
            return -1;
        }
        if (a.tagOrder !== 0 && b.tagOrder === 0) {
            return 1;
        }
        if (a.tagOrder !== 0 && b.tagOrder !== 0) {
            if (a.tagOrder > b.tagOrder) {
                return -1;
            }
            if (a.tagOrder < b.tagOrder) {
                return 1;
            }
        }
        if (+a.displayId > +b.displayId) {
            return -1;
        }
        if (+a.displayId < +b.displayId) {
            return 1;
        }
        return 0;
    };
    return TagComparerDesc;
}());
module.exports = TagComparerDesc;
//# sourceMappingURL=tagcomparerdesc.js.map