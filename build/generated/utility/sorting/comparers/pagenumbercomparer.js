"use strict";
var PageNumberComparer = (function () {
    function PageNumberComparer() {
    }
    /** Comparer to sort the pages list in ascending order of Page Number */
    PageNumberComparer.prototype.compare = function (a, b) {
        if (a.pageNumber > b.pageNumber) {
            return 1;
        }
        if (a.pageNumber < b.pageNumber) {
            return -1;
        }
        return 0;
    };
    return PageNumberComparer;
}());
module.exports = PageNumberComparer;
//# sourceMappingURL=pagenumbercomparer.js.map