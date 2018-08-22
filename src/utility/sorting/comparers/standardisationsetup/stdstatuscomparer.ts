import comparerInterface = require('../../sortbase/comparerinterface');
import comparerhelper = require('../../comparerhelper');

/**
 * This is a Centre number comparer class and method
 */
class StdStatusComparer implements comparerInterface {
	/**
	 * get the available status
	 * @param item StandardisationScriptDetails
	 */
	private getStatusText(item: StandardisationScriptDetails) : string {
		return (!item.isAllocatedALive
			&& !item.isUsedForProvisionalMarking) ? 'Available' : 'Not available';
	}
    /**
     * Comparer to sort standardisation sestup scriptid in descending order
     * @param a StandardisationScriptDetails
     * @param b StandardisationScriptDetails
     */
	public compare(a: StandardisationScriptDetails, b: StandardisationScriptDetails) {
        return comparerhelper.stringSort(this.getStatusText(a), this.getStatusText(b));
	}
}

export = StdStatusComparer;