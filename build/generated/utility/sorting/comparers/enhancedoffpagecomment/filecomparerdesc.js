"use strict";
/**
 * This is a File comparer class and method
 */
var FileComparerDesc = (function () {
    function FileComparerDesc() {
    }
    /** Comparer to sort items in decending order of files */
    FileComparerDesc.prototype.compare = function (a, b) {
        if (a.fileSortValue > b.fileSortValue) {
            return -1;
        }
        if (a.fileSortValue < b.fileSortValue) {
            return 1;
        }
        return 0;
    };
    return FileComparerDesc;
}());
module.exports = FileComparerDesc;
//# sourceMappingURL=filecomparerdesc.js.map