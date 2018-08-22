"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UserInfoClickAction = (function (_super) {
    __extends(UserInfoClickAction, _super);
    /**
     * Constructor UserInfoClickAction
     * @param userInfoPanelOpen
     */
    function UserInfoClickAction(userInfoPanelOpen) {
        _super.call(this, action.Source.View, actionType.USER_INFO_CLICK_ACTION);
        if (userInfoPanelOpen) {
            this.auditLog.logContent = this.auditLog.logContent.replace('{0}', userInfoPanelOpen.toString());
        }
        this._UserInfoPanelOpen = userInfoPanelOpen;
    }
    Object.defineProperty(UserInfoClickAction.prototype, "isUserInfoPanelOpen", {
        get: function () {
            return this._UserInfoPanelOpen;
        },
        enumerable: true,
        configurable: true
    });
    return UserInfoClickAction;
}(action));
module.exports = UserInfoClickAction;
//# sourceMappingURL=userinfoclickaction.js.map