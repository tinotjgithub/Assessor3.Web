"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a Note descending comparer class and method
 */
var StdNoteComparerDesc = (function () {
    function StdNoteComparerDesc() {
    }
    /**
     * Comparer class for 'Note' descending comparer
     * @param a
     * @param b
     */
    StdNoteComparerDesc.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSortDesc(a.note ? a.note : '', b.note ? b.note : '');
        if (value === 0) {
            return comparerhelper.integerSortDesc(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return StdNoteComparerDesc;
}());
module.exports = StdNoteComparerDesc;
//# sourceMappingURL=stdnotecomparerdesc.js.map