"use strict";
/**
 * This is a Item comparer class and method
 */
var ItemComparer = (function () {
    function ItemComparer() {
    }
    /** Comparer to sort items in ascending order of Mark Scheme names */
    ItemComparer.prototype.compare = function (a, b) {
        if (a.itemSortValue > b.itemSortValue) {
            return 1;
        }
        if (a.itemSortValue < b.itemSortValue) {
            return -1;
        }
        return 0;
    };
    return ItemComparer;
}());
module.exports = ItemComparer;
//# sourceMappingURL=itemcomparer.js.map