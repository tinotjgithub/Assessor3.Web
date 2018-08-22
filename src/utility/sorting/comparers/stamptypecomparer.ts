import enums = require('../../../components/utility/enums');
import comparerInterface = require('../sortbase/comparerinterface');

/**
 * This is a stamp type comparer  class and method
 * All comparers should implement the ComparerInterface
 */
class StampTypeComparer implements comparerInterface {
    /** Comparer to sort the stamp type in ascending order */
    public compare(a: enums.StampType, b: enums.StampType) {

        if (a > b) {
            return 1;
        }

        if (a < b) {
            return -1;
        }

        return 0;
    }
}

export = StampTypeComparer;