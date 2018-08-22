"use strict";
var stringFormatHelper = require('../../../stringformat/stringformathelper');
/**
 * This is a Admin Support Examiner Code comparer class
 */
var AdminSupportNameComparer = (function () {
    function AdminSupportNameComparer() {
    }
    /**
     * Comparer to sort the Admin Support Examiner list in ascending order of examiner name
     */
    AdminSupportNameComparer.prototype.compare = function (a, b) {
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
    AdminSupportNameComparer.prototype.getFormattedExaminerName = function (initials, surname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    return AdminSupportNameComparer;
}());
module.exports = AdminSupportNameComparer;
//# sourceMappingURL=AdminSupportNameComparer.js.map