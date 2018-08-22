import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a Mark comparer class and method
 */
class MarksComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in descending order of Mark */
    public compare(a: any, b: any) {
        let value: number;
        value = comparerhelper.integerSortDesc(
            ((a.updatedDate === null) ? -1 : a.totalMarkValue), ((b.updatedDate === null) ? -1 : b.totalMarkValue));

        if (value === 0) {
            return comparerhelper.integerSort(+a.candidateScriptId, +b.candidateScriptId);
        }
        return value;
    }
}

export = MarksComparerDesc;