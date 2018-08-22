"use strict";
/**
 * This is a File comparer class and method
 */
var FileComparer = (function () {
    function FileComparer() {
    }
    /** Comparer to sort items in ascending order of File name */
    FileComparer.prototype.compare = function (a, b) {
        if (a.fileSortValue > b.fileSortValue) {
            return 1;
        }
        if (a.fileSortValue < b.fileSortValue) {
            return -1;
        }
        return 0;
    };
    return FileComparer;
}());
module.exports = FileComparer;
//# sourceMappingURL=filecomparer.js.map