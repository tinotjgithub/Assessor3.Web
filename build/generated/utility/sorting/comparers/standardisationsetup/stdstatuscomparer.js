"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Centre number comparer class and method
 */
var StdStatusComparer = (function () {
    function StdStatusComparer() {
    }
    /**
     * get the available status
     * @param item StandardisationScriptDetails
     */
    StdStatusComparer.prototype.getStatusText = function (item) {
        return (!item.isAllocatedALive
            && !item.isUsedForProvisionalMarking) ? 'Available' : 'Not available';
    };
    /**
     * Comparer to sort standardisation sestup scriptid in descending order
     * @param a StandardisationScriptDetails
     * @param b StandardisationScriptDetails
     */
    StdStatusComparer.prototype.compare = function (a, b) {
        return comparerhelper.stringSort(this.getStatusText(a), this.getStatusText(b));
    };
    return StdStatusComparer;
}());
module.exports = StdStatusComparer;
//# sourceMappingURL=stdstatuscomparer.js.map