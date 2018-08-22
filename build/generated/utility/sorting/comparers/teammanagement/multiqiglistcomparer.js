"use strict";
/**
 * This is a Multi QIG List comparer class and method
 */
var MultiQigListComparer = (function () {
    function MultiQigListComparer() {
    }
    /** Comparer to sort the qig list in ascending order of QIG Name */
    MultiQigListComparer.prototype.compare = function (a, b) {
        if (a.qigName > b.qigName) {
            return 1;
        }
        if (a.qigName < b.qigName) {
            return -1;
        }
        return 0;
    };
    return MultiQigListComparer;
}());
module.exports = MultiQigListComparer;
//# sourceMappingURL=multiqiglistcomparer.js.map