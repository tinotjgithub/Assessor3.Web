"use strict";
var stringFormatHelper = require('../../../stringformat/stringformathelper');
/**
 * This is a examiner data comparer class and method for team management
 */
var ExaminerDataComparer = (function () {
    function ExaminerDataComparer() {
    }
    /**
     * Comparer to sort the my team list in ascending order of examiner name
     */
    ExaminerDataComparer.prototype.compare = function (a, b) {
        if (this.getFormattedExaminerName(a.initials, a.surname) > this.getFormattedExaminerName(b.initials, b.surname)) {
            return 1;
        }
        if (this.getFormattedExaminerName(a.initials, a.surname) < this.getFormattedExaminerName(b.initials, b.surname)) {
            return -1;
        }
        return 0;
    };
    /**
     * Returns the formatted examiner name
     * @param initials
     * @param surname
     */
    ExaminerDataComparer.prototype.getFormattedExaminerName = function (initials, surname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    return ExaminerDataComparer;
}());
module.exports = ExaminerDataComparer;
//# sourceMappingURL=examinerdatacomparer.js.map