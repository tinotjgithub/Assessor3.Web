import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a File comparer class and method
 */
class FileComparer implements comparerInterface {
    /** Comparer to sort items in ascending order of File name */
    public compare(a: EnhancedOffPageCommentViewDataItem, b: EnhancedOffPageCommentViewDataItem) {
        if (a.fileSortValue > b.fileSortValue) {
            return 1;
        }
        if (a.fileSortValue < b.fileSortValue) {
            return -1;
        }

        return 0;
    }
}

export = FileComparer;