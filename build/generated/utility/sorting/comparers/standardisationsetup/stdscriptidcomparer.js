"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a StandardisationSetUp Script ID comparer class and method
 */
var StdScriptIdComparer = (function () {
    function StdScriptIdComparer() {
    }
    /** Comparer to sort the standardisationsetup Candidate Script ID ascending order */
    StdScriptIdComparer.prototype.compare = function (a, b) {
        return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
    };
    return StdScriptIdComparer;
}());
module.exports = StdScriptIdComparer;
//# sourceMappingURL=stdscriptidcomparer.js.map