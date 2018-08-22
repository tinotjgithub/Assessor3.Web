"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Centre number comparer class and method
 */
var StdScriptIdComparerDesc = (function () {
    function StdScriptIdComparerDesc() {
    }
    /**
     * Comparer to sort standardisation sestup scriptid in descending order
     * @param a
     * @param b
     */
    StdScriptIdComparerDesc.prototype.compare = function (a, b) {
        return comparerhelper.integerSortDesc(a.candidateScriptId, b.candidateScriptId);
    };
    return StdScriptIdComparerDesc;
}());
module.exports = StdScriptIdComparerDesc;
//# sourceMappingURL=stdscriptidcomparerdesc.js.map