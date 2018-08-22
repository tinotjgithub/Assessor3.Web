import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Response ID comparer class and method
 */
class ResponseIdComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in ascending order of Response ID */
    public compare(a: ResponseBase, b: ResponseBase) {
        if (+a.displayId > +b.displayId) {
            return -1;
        }
        if (+a.displayId < +b.displayId) {
            return 1;
        }
        return 0;
    }
}

export = ResponseIdComparerDesc;