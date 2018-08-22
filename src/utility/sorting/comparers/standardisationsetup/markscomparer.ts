import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a Mark comparer class and method
 */
class MarksComparer implements comparerInterface {
    /** Comparer to sort the work list in ascending order of Mark */
    public compare(a: any, b: any) {
        let value: number;
        value = comparerhelper.integerSort(
            ((a.updatedDate === null) ? -1 : a.totalMarkValue), ((b.updatedDate === null) ? -1 : b.totalMarkValue));

        if (value === 0) {
            return comparerhelper.integerSort(+a.candidateScriptId, +b.candidateScriptId);
        }
        return value;
    }
}

export = MarksComparer;