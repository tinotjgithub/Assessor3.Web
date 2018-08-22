"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a update pending comparer class and method.
 */
var StdIsReUsedInQigComparerDesc = (function () {
    function StdIsReUsedInQigComparerDesc() {
    }
    /**
     * get element text
     * @param item
     */
    StdIsReUsedInQigComparerDesc.prototype.getElementText = function (item) {
        return item ? 'Yes' : 'No';
    };
    /**
     * Method to compare update pending column.
     * @param a
     * @param b
     */
    StdIsReUsedInQigComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSortDesc(this.getElementText(a.reUsedQIG), this.getElementText(b.reUsedQIG));
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return StdIsReUsedInQigComparerDesc;
}());
module.exports = StdIsReUsedInQigComparerDesc;
//# sourceMappingURL=stdisreusedinqiqcomparerDesc.js.map