"use strict";
/**
 * Class for holding examiner online status info
 */
var ActionExaminerOnlineStatusInfo = (function () {
    function ActionExaminerOnlineStatusInfo() {
    }
    Object.defineProperty(ActionExaminerOnlineStatusInfo.prototype, "isExaminerLoggedOut", {
        /**
         * This will return true if examiner is currently logged out else return false
         */
        get: function () {
            return this._isExaminerLoggedOut;
        },
        /**
         * This will set the examiner loggedout field.
         */
        set: function (isExaminerLoggedOut) {
            this._isExaminerLoggedOut = isExaminerLoggedOut;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionExaminerOnlineStatusInfo.prototype, "supervisorTimeSinceLastPingInMinutes", {
        /**
         * This will return the examiner logout date difference in minutes.
         */
        get: function () {
            return this._supervisorTimeSinceLastPingInMinutes;
        },
        /**
         * This will set the examiner logout date difference in minutes.
         */
        set: function (supervisorTimeSinceLastPingInMinutes) {
            this._supervisorTimeSinceLastPingInMinutes = supervisorTimeSinceLastPingInMinutes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionExaminerOnlineStatusInfo.prototype, "examinerApprovalStatus", {
        /**
         * This will return the examiner approval status.
         */
        get: function () {
            return this._examinerApprovalStatus;
        },
        /**
         * This will set the examiner approval status.
         */
        set: function (examinerApprovalStatus) {
            this._examinerApprovalStatus = examinerApprovalStatus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionExaminerOnlineStatusInfo.prototype, "role", {
        /**
         * This will return the role of the examiner.
         */
        get: function () {
            return this._role;
        },
        /**
         * This will set the role of the examiner.
         */
        set: function (role) {
            this._role = role;
        },
        enumerable: true,
        configurable: true
    });
    return ActionExaminerOnlineStatusInfo;
}());
module.exports = ActionExaminerOnlineStatusInfo;
//# sourceMappingURL=actionexamineronlinestatusinfo.js.map