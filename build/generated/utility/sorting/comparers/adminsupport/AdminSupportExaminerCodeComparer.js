"use strict";
/**
 * This is a Admin Support Examiner Code comparer class and method
 */
var AdminSupportExaminerCodeComparer = (function () {
    function AdminSupportExaminerCodeComparer() {
    }
    /** Comparer to sort the Admin Support Examiner list in ascending order of Employee number */
    AdminSupportExaminerCodeComparer.prototype.compare = function (a, b) {
        if (a.employeeNum.trim().toLowerCase() > b.employeeNum.trim().toLowerCase()) {
            return 1;
        }
        if (a.employeeNum.trim().toLowerCase() < b.employeeNum.trim().toLowerCase()) {
            return -1;
        }
        return 0;
    };
    return AdminSupportExaminerCodeComparer;
}());
module.exports = AdminSupportExaminerCodeComparer;
//# sourceMappingURL=AdminSupportExaminerCodeComparer.js.map