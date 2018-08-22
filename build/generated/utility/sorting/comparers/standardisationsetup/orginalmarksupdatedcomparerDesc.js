"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a orginal marks updated comparer class and method.
 */
var OrginalMarksUpdatedComparerDesc = (function () {
    function OrginalMarksUpdatedComparerDesc() {
    }
    /**
     * gets column elwmwnt text.
     * @param item
     */
    OrginalMarksUpdatedComparerDesc.prototype.getElementText = function (item) {
        return item ? 'Yes' : 'No';
    };
    /**
     * Compare method for orginal marks updated column
     * @param a
     * @param b
     */
    OrginalMarksUpdatedComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSortDesc(this.getElementText(a.originalMarksUpdated), this.getElementText(b.originalMarksUpdated));
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return OrginalMarksUpdatedComparerDesc;
}());
module.exports = OrginalMarksUpdatedComparerDesc;
//# sourceMappingURL=orginalmarksupdatedcomparerDesc.js.map