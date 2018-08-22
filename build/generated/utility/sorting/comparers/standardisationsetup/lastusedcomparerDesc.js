"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a last used descending comparer class and method.
 */
var LastUsedComparerDesc = (function () {
    function LastUsedComparerDesc() {
    }
    /**
     * Comrarer class for last used comparer
     * @param a
     * @param b
     */
    LastUsedComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSortDesc(a.lastUsed, b.lastUsed);
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return LastUsedComparerDesc;
}());
module.exports = LastUsedComparerDesc;
//# sourceMappingURL=lastusedcomparerDesc.js.map