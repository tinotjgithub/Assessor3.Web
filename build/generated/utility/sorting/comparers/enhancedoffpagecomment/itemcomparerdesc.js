"use strict";
/**
 * This is a Item comparer class and method
 */
var ItemComparerDesc = (function () {
    function ItemComparerDesc() {
    }
    /** Comparer to sort items in decending order of Mark Scheme names */
    ItemComparerDesc.prototype.compare = function (a, b) {
        if (a.itemSortValue > b.itemSortValue) {
            return -1;
        }
        if (a.itemSortValue < b.itemSortValue) {
            return 1;
        }
        return 0;
    };
    return ItemComparerDesc;
}());
module.exports = ItemComparerDesc;
//# sourceMappingURL=itemcomparerdesc.js.map