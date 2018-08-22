import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * Total times reused session comparer class and method.
 */
class TotalTimesReUsedSessionComparer implements comparerInterface {

    /**
     * Comparer method for total times reused session
     * @param a 
     * @param b 
     */
    public compare(a: StandardisationResponseDetails, b: StandardisationResponseDetails) {
        let value: number;
        value = comparerhelper.integerSort(a.timesReUsedSession, b.timesReUsedSession);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    }
}

export = TotalTimesReUsedSessionComparer;