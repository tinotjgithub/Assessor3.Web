"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * The class holds user info details
 * @param {boolean} success
 */
var UserInfoAction = (function (_super) {
    __extends(UserInfoAction, _super);
    /**
     * Initializing a new instance of UserInfo Argument.
     * @param {boolean} success
     */
    function UserInfoAction(success, userinfoargument) {
        _super.call(this, action.Source.View, actionType.USERINFO, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this.userInfoArgument = userinfoargument;
    }
    Object.defineProperty(UserInfoAction.prototype, "UserInfo", {
        /**
         * Gets the user name.
         * @returns The user information
         */
        get: function () {
            return this.userInfoArgument;
        },
        enumerable: true,
        configurable: true
    });
    return UserInfoAction;
}(dataRetrievalAction));
module.exports = UserInfoAction;
//# sourceMappingURL=userinfoaction.js.map