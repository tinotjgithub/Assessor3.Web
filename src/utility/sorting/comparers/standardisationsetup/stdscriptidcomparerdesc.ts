import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a Centre number comparer class and method
 */
class StdScriptIdComparerDesc implements comparerInterface {
    /**
     * Comparer to sort standardisation sestup scriptid in descending order
     * @param a
     * @param b
     */
	public compare(a: ResponseBase, b: ResponseBase) {
		return comparerhelper.integerSortDesc(a.candidateScriptId, b.candidateScriptId);
	}
}

export = StdScriptIdComparerDesc;