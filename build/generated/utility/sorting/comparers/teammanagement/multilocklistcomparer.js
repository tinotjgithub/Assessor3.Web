"use strict";
/**
 * This is a Multi Lock List comparer class and method
 */
var MultiLockListComparer = (function () {
    function MultiLockListComparer() {
    }
    /** Comparer to sort the qig list in ascending order of QIG Name */
    MultiLockListComparer.prototype.compare = function (a, b) {
        if (a.qigName > b.qigName) {
            return 1;
        }
        if (a.qigName < b.qigName) {
            return -1;
        }
        return 0;
    };
    return MultiLockListComparer;
}());
module.exports = MultiLockListComparer;
//# sourceMappingURL=multilocklistcomparer.js.map