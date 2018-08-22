"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Centre number comparer class and method
 */
var StdOrginalSessionComparer = (function () {
    function StdOrginalSessionComparer() {
    }
    /**
     * Comparer to sort standardisation sestup script id in descending order
     * @param a StandardisationResponseDetails
     * @param b StandardisationResponseDetails
     */
    StdOrginalSessionComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSort(a.originalSession, b.originalSession);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return StdOrginalSessionComparer;
}());
module.exports = StdOrginalSessionComparer;
//# sourceMappingURL=stdorginalsessioncomparer.js.map