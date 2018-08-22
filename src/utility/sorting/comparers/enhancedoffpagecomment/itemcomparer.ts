import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Item comparer class and method
 */
class ItemComparer implements comparerInterface {
    /** Comparer to sort items in ascending order of Mark Scheme names */
    public compare(a: EnhancedOffPageCommentViewDataItem, b: EnhancedOffPageCommentViewDataItem) {
        if (a.itemSortValue > b.itemSortValue) {
            return 1;
        }
        if (a.itemSortValue < b.itemSortValue) {
            return -1;
        }

        return 0;
    }
}

export = ItemComparer;