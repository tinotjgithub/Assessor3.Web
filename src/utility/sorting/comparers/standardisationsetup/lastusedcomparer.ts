import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a last used comparer class and method.
 */
class LastUsedComparer implements comparerInterface {

    /**
     * Comrarer class for last used comparer
     * @param a 
     * @param b 
     */
    public compare(a: StandardisationResponseDetails, b: StandardisationResponseDetails) {
        let value: number;
        value = comparerhelper.stringSort(a.lastUsed, b.lastUsed);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    }
}

export = LastUsedComparer;