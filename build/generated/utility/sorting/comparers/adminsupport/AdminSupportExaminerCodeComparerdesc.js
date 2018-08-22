"use strict";
/**
 * This is a Admin Support Examiner Code comparer class and method
 */
var AdminSupportExaminerCodeComparerDesc = (function () {
    function AdminSupportExaminerCodeComparerDesc() {
    }
    /** Comparer to sort the Admin Support Examiner list in descending order of Employee number */
    AdminSupportExaminerCodeComparerDesc.prototype.compare = function (a, b) {
        if (a.employeeNum.trim().toLowerCase() > b.employeeNum.trim().toLowerCase()) {
            return -1;
        }
        if (a.employeeNum.trim().toLowerCase() < b.employeeNum.trim().toLowerCase()) {
            return 1;
        }
        return 0;
    };
    return AdminSupportExaminerCodeComparerDesc;
}());
module.exports = AdminSupportExaminerCodeComparerDesc;
//# sourceMappingURL=AdminSupportExaminerCodeComparerdesc.js.map