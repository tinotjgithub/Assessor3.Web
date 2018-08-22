"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a orginal marks updated comparer class and method.
 */
var OrginalMarksUpdatedComparer = (function () {
    function OrginalMarksUpdatedComparer() {
    }
    /**
     * gets column elwmwnt text.
     * @param item
     */
    OrginalMarksUpdatedComparer.prototype.getElementText = function (item) {
        return item ? 'Yes' : 'No';
    };
    /**
     * Compare method for orginal marks updated column
     * @param a
     * @param b
     */
    OrginalMarksUpdatedComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSort(this.getElementText(a.originalMarksUpdated), this.getElementText(b.originalMarksUpdated));
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return OrginalMarksUpdatedComparer;
}());
module.exports = OrginalMarksUpdatedComparer;
//# sourceMappingURL=orginalMarksUpdatedcomparer.js.map