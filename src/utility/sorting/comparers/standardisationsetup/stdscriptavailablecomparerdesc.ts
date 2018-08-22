import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Centre number comparer class and method
 */
class StdScriptAvailableComparerDesc implements comparerInterface {
    /** Comparer to sort the standardisation centre list in decending order of Available scripts */
    public compare(a: StandardisationCentreDetails, b: StandardisationCentreDetails) {
        if (a.availableScripts > b.availableScripts) {
            return -1;
        }
        if (a.availableScripts < b.availableScripts) {
            return 1;
        }
        return 0;
    }
}

export = StdScriptAvailableComparerDesc;