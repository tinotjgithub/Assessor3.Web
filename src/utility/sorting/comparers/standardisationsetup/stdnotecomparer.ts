import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a 'Note' comparer class and method
 */
class StdNoteComparer implements comparerInterface {
    /**
     * Comparer class for 'Note' comparer
     * @param a 
     * @param b 
     */
    public compare(a: StandardisationResponseDetails, b: StandardisationResponseDetails){
        let value: number;
        value = comparerhelper.stringSort(a.note ? a.note : '', b.note ? b.note : '');
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    }
}

export = StdNoteComparer;