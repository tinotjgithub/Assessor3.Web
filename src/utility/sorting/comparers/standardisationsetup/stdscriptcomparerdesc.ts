import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Script comparer class and method
 */
class StdScriptComparerDesc implements comparerInterface {
    /** Comparer to sort the standardisation centre list in descending order of Scripts */
    public compare(a: StandardisationCentreDetails, b: StandardisationCentreDetails) {
        if (a.totalScripts > b.totalScripts) {
            return -1;
        }
        if (a.totalScripts < b.totalScripts) {
            return 1;
        }
        return 0;
    }
}

export = StdScriptComparerDesc;