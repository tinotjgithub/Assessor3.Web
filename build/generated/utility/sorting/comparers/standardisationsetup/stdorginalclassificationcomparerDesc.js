"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a orginal session comparer class and method.
 */
var StdOrginalClassificationComparerDesc = (function () {
    function StdOrginalClassificationComparerDesc() {
    }
    /**
     * Comparer to sort standardisation sestup Orginal Classification Comparer in descending order
     * @param a StandardisationResponseDetails
     * @param b StandardisationResponseDetails
     */
    StdOrginalClassificationComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSortDesc(a.originalClassification, b.originalClassification);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return StdOrginalClassificationComparerDesc;
}());
module.exports = StdOrginalClassificationComparerDesc;
//# sourceMappingURL=stdorginalclassificationcomparerDesc.js.map