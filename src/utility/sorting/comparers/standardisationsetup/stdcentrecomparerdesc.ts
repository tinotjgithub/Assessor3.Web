import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a Centre number comparer class and method
 */
class StdCentreComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in descending order of Centre number */
    public compare(a: ResponseBase, b: ResponseBase) {
        let value: number;
        value = comparerhelper.integerSortDesc(+a.centreNumber, +b.centreNumber);

        if (value === 0) {
            return comparerhelper.integerSort(+a.candidateScriptId, +b.candidateScriptId);
        }
        return value;
    }
}

export = StdCentreComparerDesc;