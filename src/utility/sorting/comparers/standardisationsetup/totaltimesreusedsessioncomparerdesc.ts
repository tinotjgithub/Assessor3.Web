import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * Total times reused session descending comparer class and method.
 */
class TotalTimesReUsedSessionComparerDesc implements comparerInterface {

    /**
     * Comparer method for total times reused session
     * @param a 
     * @param b 
     */
    public compare(a: StandardisationResponseDetails, b: StandardisationResponseDetails) {
        let value: number;
        value = comparerhelper.integerSortDesc(a.timesReUsedSession, b.timesReUsedSession);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    }
}

export = TotalTimesReUsedSessionComparerDesc;