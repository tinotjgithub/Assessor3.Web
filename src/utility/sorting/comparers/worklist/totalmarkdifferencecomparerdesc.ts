import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Total mark difference comparer class and method
 */
class TotalMarkDifferenceComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in descending order of total mark difference */
    public compare(a: any, b: any) {
        if (((a.seedTypeId === 0) ? '0' : a.totalMarksDifference) >
            ((b.seedTypeId === 0) ? '0' : b.totalMarksDifference)) {
            return -1;
        }
        if (((a.seedTypeId === 0) ? '0' : a.totalMarksDifference) <
            ((b.seedTypeId === 0) ? '0' : b.totalMarksDifference)) {
            return 1;
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

export = TotalMarkDifferenceComparerDesc;