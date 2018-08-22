"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a update pending comparer class and method.
 */
var StdIsReUsedInQigComparer = (function () {
    function StdIsReUsedInQigComparer() {
    }
    /**
     * get element text
     * @param item
     */
    StdIsReUsedInQigComparer.prototype.getElementText = function (item) {
        return item ? 'Yes' : 'No';
    };
    /**
     * Method to compare update pending column.
     * @param a
     * @param b
     */
    StdIsReUsedInQigComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSort(this.getElementText(a.reUsedQIG), this.getElementText(b.reUsedQIG));
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return StdIsReUsedInQigComparer;
}());
module.exports = StdIsReUsedInQigComparer;
//# sourceMappingURL=stdisreusedinqiqcomparer.js.map