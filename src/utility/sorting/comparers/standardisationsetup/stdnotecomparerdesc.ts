import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a Note descending comparer class and method
 */
class StdNoteComparerDesc implements comparerInterface {
    /**
     * Comparer class for 'Note' descending comparer
     * @param a 
     * @param b 
     */
    public compare(a: StandardisationResponseDetails, b: StandardisationResponseDetails) {
        let value: number;
        value = comparerhelper.stringSortDesc(a.note ? a.note : '', b.note ? b.note : '');
        if (value === 0) {
            return comparerhelper.integerSortDesc(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    }
}

export = StdNoteComparerDesc;