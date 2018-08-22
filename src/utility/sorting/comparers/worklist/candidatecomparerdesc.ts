import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a Candidate Number comparer class and method
 */
class CandidateComparer implements comparerInterface {
    /** Comparer to sort the work list in descending order of Candidate number */
    public compare(a: ResponseBase, b: ResponseBase) {
        let value: number;
        value = comparerhelper.integerSortDesc(+a.centreCandidateNumber, +b.centreCandidateNumber);

        if (value === 0) {
            return comparerhelper.integerSort(+a.displayId, +b.displayId);
        }
        return value;
    }
}

export = CandidateComparer;