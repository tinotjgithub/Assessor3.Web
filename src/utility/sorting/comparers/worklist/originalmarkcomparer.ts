import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Mark comparer class and method
 */
class OriginalMarkComparer implements comparerInterface {
    /** Comparer to sort the work list in ascending order of Mark */
    public compare(a: ResponseBase, b: ResponseBase) {

        if (((a.markingProgress < 100) ? -100 : a.originalMarkTotal) >
            ((b.markingProgress < 100) ? -100 : b.originalMarkTotal)) {
            return 1;
        }
        if (((a.markingProgress < 100) ? -100 : a.originalMarkTotal) <
            ((b.markingProgress < 100) ? -100 : b.originalMarkTotal)) {
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

export = OriginalMarkComparer;