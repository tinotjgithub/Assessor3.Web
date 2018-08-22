import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import comparerInterface = require('../sortbase/comparerinterface');

/**
 * This is a marking target list comparer class and method
 */
class MarkingTargetComparer implements comparerInterface {
    /** Comparer to sort the marking target list
     * in ascending order of marking mode id
     */
    public compare(a: markingTargetSummary, b: markingTargetSummary) {

        if (a.markingTargetDate < b.markingTargetDate) {
            return -1;
        } else if (a.markingTargetDate > b.markingTargetDate) {
            return 1;
        } else {
            if (a.markingModeID < b.markingModeID) {
                return -1;
            }
            if (a.markingModeID > b.markingModeID) {
                return 1;
            }

            return 0;
        }
    }
}

export = MarkingTargetComparer;