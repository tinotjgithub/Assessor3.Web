import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Centre number comparer class and method
 */
class SpecialistTypeComparer implements comparerInterface {
    /** Comparer to sort the work list in ascending order of Centre number */
    public compare(a: ResponseBase, b: ResponseBase) {
        if (a.specialistType > b.specialistType) {
            return -1;
        }
        if (a.specialistType < b.specialistType) {
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

export = SpecialistTypeComparer;