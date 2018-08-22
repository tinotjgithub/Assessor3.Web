import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a StandardisationSetUp Script ID comparer class and method
 */
class StdScriptIdComparer implements comparerInterface {
    /** Comparer to sort the standardisationsetup Candidate Script ID ascending order */
    public compare(a: ResponseBase, b: ResponseBase) {
        return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
    }
}
export = StdScriptIdComparer;