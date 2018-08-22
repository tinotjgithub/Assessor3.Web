import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Multi Lock List comparer class and method
 */
class MultiLockListComparer implements comparerInterface {
    /** Comparer to sort the qig list in ascending order of QIG Name */
    public compare(a: MultiQigLockExaminer, b: MultiQigLockExaminer) {
        if (a.qigName > b.qigName) {
            return 1;
        }
        if (a.qigName < b.qigName) {
            return -1;
        }
        return 0;
    }
}

export = MultiLockListComparer;