"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a last used comparer class and method.
 */
var LastUsedComparer = (function () {
    function LastUsedComparer() {
    }
    /**
     * Comrarer class for last used comparer
     * @param a
     * @param b
     */
    LastUsedComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSort(a.lastUsed, b.lastUsed);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return LastUsedComparer;
}());
module.exports = LastUsedComparer;
//# sourceMappingURL=lastusedcomparer.js.map