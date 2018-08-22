"use strict";
/**
 * This is a Admin Support Examiner Code comparer class
 */
var AdminSupportUsernameComparer = (function () {
    function AdminSupportUsernameComparer() {
    }
    /** Comparer to sort the Admin Support Examiner list in ascending order of liveUserName */
    AdminSupportUsernameComparer.prototype.compare = function (a, b) {
        if (a.liveUserName.trim().toLowerCase() > b.liveUserName.trim().toLowerCase()) {
            return 1;
        }
        if (a.liveUserName.trim().toLowerCase() < b.liveUserName.trim().toLowerCase()) {
            return -1;
        }
        return 0;
    };
    return AdminSupportUsernameComparer;
}());
module.exports = AdminSupportUsernameComparer;
//# sourceMappingURL=AdminSupportUsernameComparer.js.map