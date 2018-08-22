"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var LogoutAction = (function (_super) {
    __extends(LogoutAction, _super);
    /**
     * Logout action
     * @param success
     * @param errorJsonObject
     */
    function LogoutAction(success, errorJsonObject) {
        _super.call(this, action.Source.View, actionType.USER_SESSION_UPDATE_ON_LOGOUT, success, errorJsonObject);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    return LogoutAction;
}(dataRetrievalAction));
module.exports = LogoutAction;
//# sourceMappingURL=logoutaction.js.map