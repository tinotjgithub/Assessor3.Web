"use strict";
var stringFormatHelper = require('../../../stringformat/stringformathelper');
/**
 * This is a mark check examiners list comparer class and method
 */
var MarkCheckExaminersComparer = (function () {
    function MarkCheckExaminersComparer() {
    }
    /** Comparer to sort the marking target list
     * in ascending order of marking mode id
     */
    MarkCheckExaminersComparer.prototype.compare = function (a, b) {
        if (this.getFormattedName(a.toExaminer.initials, a.toExaminer.surname) <
            this.getFormattedName(b.toExaminer.initials, b.toExaminer.surname)) {
            return -1;
        }
        if (this.getFormattedName(a.toExaminer.initials, a.toExaminer.surname) >
            this.getFormattedName(b.toExaminer.initials, b.toExaminer.surname)) {
            return 1;
        }
        return 0;
    };
    /**
     * Get the out put of formatted username
     * @param {initials} initials
     * @param {surname} surname
     * @returns
     */
    MarkCheckExaminersComparer.prototype.getFormattedName = function (initials, surname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    return MarkCheckExaminersComparer;
}());
module.exports = MarkCheckExaminersComparer;
//# sourceMappingURL=markcheckexaminerscomparer.js.map