"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a update pending comparer class and method.
 */
var UpdatePendingComparerDesc = (function () {
    function UpdatePendingComparerDesc() {
    }
    /**
     * get element text
     * @param item
     */
    UpdatePendingComparerDesc.prototype.getElementText = function (item) {
        return item ? 'Yes' : 'No';
    };
    /**
     * Method to compare update pending column.
     * @param a
     * @param b
     */
    UpdatePendingComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSortDesc(this.getElementText(a.updatesPending), this.getElementText(b.updatesPending));
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return UpdatePendingComparerDesc;
}());
module.exports = UpdatePendingComparerDesc;
//# sourceMappingURL=updatependingcomparerDesc.js.map