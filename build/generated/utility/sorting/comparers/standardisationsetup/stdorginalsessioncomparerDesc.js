"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Centre number comparer class and method
 */
var StdOrginalSessionComparerDesc = (function () {
    function StdOrginalSessionComparerDesc() {
    }
    /**
     * Comparer to sort standardisation sestup scriptid in descending order
     * @param a StandardisationScriptDetails
     * @param b StandardisationScriptDetails
     */
    StdOrginalSessionComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSortDesc(a.originalSession, b.originalSession);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return StdOrginalSessionComparerDesc;
}());
module.exports = StdOrginalSessionComparerDesc;
//# sourceMappingURL=stdorginalsessioncomparerDesc.js.map