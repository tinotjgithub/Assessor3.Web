import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Absolute mark difference comparer class and method
 */
class AbsoluteMarkDifferenceComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in descending order of Absolute mark difference */
    public compare(a: any, b: any) {
        if (((a.seedTypeId === 0) ? '0' : a.absoluteMarksDifference) >
            ((b.seedTypeId === 0) ? '0' : b.absoluteMarksDifference)) {
            return -1;
        }
        if (((a.seedTypeId === 0) ? '0' : a.absoluteMarksDifference) <
            ((b.seedTypeId === 0) ? '0' : b.absoluteMarksDifference)) {
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

export = AbsoluteMarkDifferenceComparerDesc;