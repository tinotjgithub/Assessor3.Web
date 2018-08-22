import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a orginal session comparer class and method.
 */
class StdOrginalClassificationComparer implements comparerInterface {

    /**
     * Comparer to sort standardisation sestup Orginal Classification Comparer in ascending order
     * @param a StandardisationResponseDetails
     * @param b StandardisationResponseDetails
     */
    public compare(a: StandardisationResponseDetails, b: StandardisationResponseDetails) {
        let value: number;
        value = comparerhelper.stringSort(a.originalClassification, b.originalClassification);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    }
}

export = StdOrginalClassificationComparer;