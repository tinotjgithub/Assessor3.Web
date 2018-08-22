import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a Centre number comparer class and method
 */
class StdOrginalSessionComparer implements comparerInterface {

    /**
     * Comparer to sort standardisation sestup script id in descending order
     * @param a StandardisationResponseDetails
     * @param b StandardisationResponseDetails
     */
    public compare(a: StandardisationResponseDetails, b: StandardisationResponseDetails) {
        let value: number;
        value = comparerhelper.stringSort(a.originalSession, b.originalSession);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    }
}

export = StdOrginalSessionComparer;