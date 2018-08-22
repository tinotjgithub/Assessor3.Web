import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a First Scanned comparer class and method
 */
class StdFirstScannedComparer implements comparerInterface {
    /** Comparer to sort the standardisation list in ascending order of first scanned */
    public compare(a: StandardisationCentreDetails, b: StandardisationCentreDetails) {
        if (a.firstScanned > b.firstScanned) {
            return 1;
        }
        if (a.firstScanned < b.firstScanned) {
            return -1;
        }
        return 0;
    }
}

export = StdFirstScannedComparer;