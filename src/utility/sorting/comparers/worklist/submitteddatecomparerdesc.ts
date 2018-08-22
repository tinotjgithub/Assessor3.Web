import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Allocated date comparer class and method
 */
class SubmittedDateComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in ascending order of Allocated Date */
    public compare(a: any, b: any) {
        if (a.submittedDate < b.submittedDate) {
            return 1;
        }
        if (a.submittedDate > b.submittedDate) {
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

export = SubmittedDateComparerDesc;