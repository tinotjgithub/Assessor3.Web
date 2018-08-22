"use strict";
/**
 * This is a Admin Support Examiner Code comparer class
 */
var AdminSupportUsernameComparerDesc = (function () {
    function AdminSupportUsernameComparerDesc() {
    }
    /** Comparer to sort the Admin Support Examiner list in descending order of liveUserName */
    AdminSupportUsernameComparerDesc.prototype.compare = function (a, b) {
        if (a.liveUserName.trim().toLowerCase() > b.liveUserName.trim().toLowerCase()) {
            return -1;
        }
        if (a.liveUserName.trim().toLowerCase() < b.liveUserName.trim().toLowerCase()) {
            return 1;
        }
        return 0;
    };
    return AdminSupportUsernameComparerDesc;
}());
module.exports = AdminSupportUsernameComparerDesc;
//# sourceMappingURL=AdminSupportUsernameComparerDesc.js.map