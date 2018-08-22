"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var SupportLoginAction = (function (_super) {
    __extends(SupportLoginAction, _super);
    /**
     * constructor
     * @param success
     * @param username
     * @param isAdvancedFamilarisationEnabled
     * @param isReportsVisible
     * @param isAdminRemarker
     * @param isFamiliarisationLogin
     * @param errorJsonObject
     */
    function SupportLoginAction(success, username, isAdvancedFamilarisationEnabled, isReportsVisible, isAdminRemarker, isFamiliarisationLogin, errorJsonObject) {
        _super.call(this, action.Source.View, actionType.SUPPORT_LOGIN, success, errorJsonObject);
        this.username = username;
        this._isAdvancedFamilarisationEnabled = isAdvancedFamilarisationEnabled;
        this._isAdminRemarker = isAdminRemarker;
        this._isReportsVisible = isReportsVisible;
        this._isFamiliarizationLogin = isFamiliarisationLogin;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    Object.defineProperty(SupportLoginAction.prototype, "userName", {
        /**
         * Gets the user name property
         */
        get: function () {
            return this.username;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SupportLoginAction.prototype, "isAdvancedFamilarisationEnabled", {
        /**
         * Get the value indicates whether the AdvancedFamilarisationEnabled or not
         */
        get: function () {
            return this._isAdvancedFamilarisationEnabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SupportLoginAction.prototype, "isAdminRemarker", {
        /**
         * Get the value indicates whether Admin Remarker or not
         */
        get: function () {
            return this._isAdminRemarker;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SupportLoginAction.prototype, "isReportsVisible", {
        /**
         * Get the value indicates whether the Reports visible or not
         */
        get: function () {
            return this._isReportsVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SupportLoginAction.prototype, "isFamiliarizationLogin", {
        /**
         * Get the value indicates whether its familirisation Login.
         */
        get: function () {
            return this._isFamiliarizationLogin;
        },
        enumerable: true,
        configurable: true
    });
    return SupportLoginAction;
}(dataRetrievalAction));
module.exports = SupportLoginAction;
//# sourceMappingURL=supportloginaction.js.map