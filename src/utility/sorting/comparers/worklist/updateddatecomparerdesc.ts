import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Updated date comparer class and method
 */
class UpdatedDateComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in descending order of updated Date */
    public compare(a: any, b: any) {
        var date = '01-01-1900';
        if (((a.updatedDate === null) ? date : a.updatedDate) <
            ((b.updatedDate === null) ? date : b.updatedDate)) {
            return 1;
        }
        if (((a.updatedDate === null) ? date : a.updatedDate) >
            ((b.updatedDate === null) ? date : b.updatedDate)) {
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

export = UpdatedDateComparerDesc;