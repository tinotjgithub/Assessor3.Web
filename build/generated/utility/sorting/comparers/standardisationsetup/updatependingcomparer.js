"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a update pending comparer class and method.
 */
var UpdatePendingComparer = (function () {
    function UpdatePendingComparer() {
    }
    /**
     * get element text
     * @param item
     */
    UpdatePendingComparer.prototype.getElementText = function (item) {
        return item ? 'Yes' : 'No';
    };
    /**
     * Method to compare update pending column.
     * @param a
     * @param b
     */
    UpdatePendingComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSort(this.getElementText(a.updatesPending), this.getElementText(b.updatesPending));
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return UpdatePendingComparer;
}());
module.exports = UpdatePendingComparer;
//# sourceMappingURL=updatependingcomparer.js.map