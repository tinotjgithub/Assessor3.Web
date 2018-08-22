import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Script available comparer class and method
 */
class StdScriptAvailableComparer implements comparerInterface {
    /** Comparer to sort the standardisation centre list in ascending order of Available scripts */
    public compare(a: StandardisationCentreDetails, b: StandardisationCentreDetails) {
        if (a.availableScripts > b.availableScripts) {
            return 1;
        }
        if (a.availableScripts < b.availableScripts) {
            return -1;
        }
        return 0;
    }
}

export = StdScriptAvailableComparer;