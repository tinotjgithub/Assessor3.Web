import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Last updated date comparer class and method
 */
class LastUpdatedDateComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in descending order of last updated Date */
    public compare(a: any, b: any) {
        if (a.lastUpdatedDate < b.lastUpdatedDate) {
            return 1;
        }
        if (a.lastUpdatedDate > b.lastUpdatedDate) {
            return -1;
        }
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    }
}

export = LastUpdatedDateComparerDesc;