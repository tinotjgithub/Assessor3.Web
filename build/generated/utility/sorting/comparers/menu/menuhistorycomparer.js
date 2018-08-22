"use strict";
/**
 * This is a Menu History comparer class and method
 */
var MenuHistoryComparer = (function () {
    function MenuHistoryComparer() {
    }
    /**
     * Comparer to sort menu history
     */
    MenuHistoryComparer.prototype.compare = function (a, b) {
        if (a.timeStamp > b.timeStamp) {
            return -1;
        }
        if (a.timeStamp < b.timeStamp) {
            return 1;
        }
        return 0;
    };
    return MenuHistoryComparer;
}());
module.exports = MenuHistoryComparer;
//# sourceMappingURL=menuhistorycomparer.js.map