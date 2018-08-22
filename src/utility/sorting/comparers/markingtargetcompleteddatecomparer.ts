import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import comparerInterface = require('../sortbase/comparerinterface');

/**
 * This is a marking target list comparer class and method
 */
class MarkingTargetCompletedDateComparer implements comparerInterface {
    /** Comparer to sort the marking target list
     * in ascending order of marking mode id
     */
    public compare(a: markingTargetSummary, b: markingTargetSummary) {
        if (a.targetCompletedDate < b.targetCompletedDate) {
            return -1;
        }
        if (a.targetCompletedDate > b.targetCompletedDate) {
            return 1;
        }

        return 0;
    }
}

export = MarkingTargetCompletedDateComparer;