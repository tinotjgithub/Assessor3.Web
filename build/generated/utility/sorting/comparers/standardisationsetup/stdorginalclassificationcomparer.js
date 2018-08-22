"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a orginal session comparer class and method.
 */
var StdOrginalClassificationComparer = (function () {
    function StdOrginalClassificationComparer() {
    }
    /**
     * Comparer to sort standardisation sestup Orginal Classification Comparer in ascending order
     * @param a StandardisationResponseDetails
     * @param b StandardisationResponseDetails
     */
    StdOrginalClassificationComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSort(a.originalClassification, b.originalClassification);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return StdOrginalClassificationComparer;
}());
module.exports = StdOrginalClassificationComparer;
//# sourceMappingURL=stdorginalclassificationcomparer.js.map