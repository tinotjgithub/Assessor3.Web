"use strict";
var comparerhelper = require('../../comparerhelper');
/**
 * This is a 'Note' comparer class and method
 */
var StdNoteComparer = (function () {
    function StdNoteComparer() {
    }
    /**
     * Comparer class for 'Note' comparer
     * @param a
     * @param b
     */
    StdNoteComparer.prototype.compare = function (a, b) {
        var value;
        value = comparerhelper.stringSort(a.note ? a.note : '', b.note ? b.note : '');
        if (value === 0) {
            return comparerhelper.integerSort(a.candidateScriptId, b.candidateScriptId);
        }
        return value;
    };
    return StdNoteComparer;
}());
module.exports = StdNoteComparer;
//# sourceMappingURL=stdnotecomparer.js.map