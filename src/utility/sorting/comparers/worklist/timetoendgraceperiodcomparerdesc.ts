import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Response ID comparer class and method
 */
class TimeToEndGracePeriodComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in ascending order of Time To End Grace Period */
    public compare(a: any, b: any) {
        if (a.timeToEndOfGracePeriod > b.timeToEndOfGracePeriod) {
            return -1;
        }
        if (a.timeToEndOfGracePeriod < b.timeToEndOfGracePeriod) {
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

export = TimeToEndGracePeriodComparerDesc;