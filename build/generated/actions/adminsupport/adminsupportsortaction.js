"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var AdminSupportSortAction = (function (_super) {
    __extends(AdminSupportSortAction, _super);
    /**
     * sort action constructor
     * @param sortDetails
     */
    function AdminSupportSortAction(sortDetails) {
        _super.call(this, action.Source.View, actionType.ADMIN_SUPPORT_SORT_ACTION);
        this.sortDetails = sortDetails;
        this.auditLog.logContent = this.auditLog.logContent;
    }
    Object.defineProperty(AdminSupportSortAction.prototype, "getAdminSupportSortDetails", {
        /* return admin support examiner sort details*/
        get: function () {
            return this.sortDetails;
        },
        enumerable: true,
        configurable: true
    });
    return AdminSupportSortAction;
}(action));
module.exports = AdminSupportSortAction;
//# sourceMappingURL=adminsupportsortaction.js.map