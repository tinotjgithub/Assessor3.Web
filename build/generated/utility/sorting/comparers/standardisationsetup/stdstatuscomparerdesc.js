"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Centre number comparer class and method
 */
var StdStatusComparerDesc = (function () {
    function StdStatusComparerDesc() {
    }
    /**
     * get the available status
     * @param item StandardisationScriptDetails
     */
    StdStatusComparerDesc.prototype.getStatusText = function (item) {
        return (!item.isAllocatedALive
            && !item.isUsedForProvisionalMarking) ? 'Available' : 'Not available';
    };
    /**
     * Comparer to sort standardisation sestup scriptid in descending order
     * @param a StandardisationScriptDetails
     * @param b StandardisationScriptDetails
     */
    StdStatusComparerDesc.prototype.compare = function (a, b) {
        return comparerhelper.stringSortDesc(this.getStatusText(a), this.getStatusText(b));
    };
    return StdStatusComparerDesc;
}());
module.exports = StdStatusComparerDesc;
//# sourceMappingURL=stdstatuscomparerdesc.js.map