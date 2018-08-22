import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a Centre number comparer class and method
 */
class StdOrginalSessionComparerDesc implements comparerInterface {

    /**
     * Comparer to sort standardisation sestup scriptid in descending order
     * @param a StandardisationScriptDetails
     * @param b StandardisationScriptDetails
     */
    public compare(a: StandardisationResponseDetails, b: StandardisationResponseDetails) {
        let value: number;
        value = comparerhelper.stringSortDesc(a.originalSession, b.originalSession);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
	}
}

export = StdOrginalSessionComparerDesc;