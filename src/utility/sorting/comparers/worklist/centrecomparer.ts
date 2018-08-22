import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a Centre number comparer class and method
 */
class CentreComparer implements comparerInterface {
    /** Comparer to sort the work list in ascending order of Centre number */
    public compare(a: ResponseBase, b: ResponseBase) {
        let value: number;
        value = comparerhelper.integerSort(+a.centreNumber, +b.centreNumber);

        if (value === 0) {
            return comparerhelper.integerSort(+a.displayId, +b.displayId);
        }
        return value;
    }
}

export = CentreComparer;