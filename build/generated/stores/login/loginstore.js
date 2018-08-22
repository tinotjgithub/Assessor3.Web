"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var ActionType = require('../../actions/base/actiontypes');
/**
 * Login store
 */
var LoginStore = (function (_super) {
    __extends(LoginStore, _super);
    /**
     * @constructor
     */
    function LoginStore() {
        var _this = this;
        _super.call(this);
        this._isAdvancedFamilarisationEnabled = false;
        this._isFamiliarisationDataCreated = false;
        this._isAdminRemarker = false;
        this._isReportsVisible = false;
        this._isAdminLoginEnabled = false;
        this._dispatchToken = dispatcher.register(function (action) {
            if (action.actionType === ActionType.LOGIN) {
                _this._success = action.success;
                if (_this._success) {
                    _this.loggedInUsername = action.userName;
                    _this._isAdvancedFamilarisationEnabled = action.isAdvancedFamilarisationEnabled;
                    _this._isAdminRemarker = action.isFamiliarizationLogin ?
                        false : action.isAdminRemarker;
                    _this._isFamiliarisationDataCreated = false;
                    _this._isReportsVisible = action.isReportsVisible;
                    _this._isAdminLoginEnabled = action.isAdminLoginEnabled;
                }
                else {
                    _this.statusCode = action.getStatusCode;
                    _this.errorMessage = action.getErrorMessage;
                }
                _this.emit(LoginStore.LOGIN_EVENT);
            }
            else if (action.actionType === ActionType.USER_SESSION_UPDATE_ON_LOGOUT) {
                _this.emit(LoginStore.UPDATE_SESSION_ON_LOGOUT_EVENT);
            }
            else if (action.actionType === ActionType.NOTIFY_CONCURRENT_SESSION_ACTIVE) {
                _this.emit(LoginStore.CONCURRENT_SESSION_ACTIVE);
            }
            else if (action.actionType === ActionType.CREATE_FAMILARISATION_DATA_ACTION) {
                _this._isFamiliarisationDataCreated = true;
                _this.emit(LoginStore.FAMILIARISATION_DATA_CREATED_EVENT);
            }
            else if (action.actionType === ActionType.SUPPORT_LOGIN) {
                var supportLoginAction_1 = action;
                _this._success = supportLoginAction_1.success;
                if (_this._success) {
                    _this.loggedInUsername = supportLoginAction_1.userName;
                    _this._isAdvancedFamilarisationEnabled = supportLoginAction_1.isAdvancedFamilarisationEnabled;
                    _this._isAdminRemarker = supportLoginAction_1.isFamiliarizationLogin ?
                        false : supportLoginAction_1.isAdminRemarker;
                    _this._isFamiliarisationDataCreated = false;
                    _this._isReportsVisible = supportLoginAction_1.isReportsVisible;
                    _this.emit(LoginStore.SUPPORT_LOGIN_EVENT);
                }
                else {
                    _this.statusCode = supportLoginAction_1.getStatusCode;
                    _this.errorMessage = supportLoginAction_1.getErrorMessage;
                }
            }
        });
    }
    Object.defineProperty(LoginStore.prototype, "loggedInUserName", {
        /**
         * Get the UserName for the logged in user
         */
        get: function () {
            return this.loggedInUsername;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginStore.prototype, "success", {
        /**
         * Get the success value for the login action
         */
        get: function () {
            return this._success;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginStore.prototype, "getStatusCode", {
        /**
         * Get the status code for the login action
         */
        get: function () {
            return this.statusCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginStore.prototype, "getErrorMessage", {
        /**
         * Get the value error Message
         */
        get: function () {
            return this.errorMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginStore.prototype, "isAdvancedFamilarisationEnabled", {
        /**
         * Get the value indicates whether the AdvancedFamilarisationEnabled or not
         */
        get: function () {
            return this._isAdvancedFamilarisationEnabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginStore.prototype, "isAdminRemarker", {
        /**
         * Get the value indicates whether Admin Remarker or not
         */
        get: function () {
            return this._isAdminRemarker;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginStore.prototype, "isFamiliarisationDataCreated", {
        /**
         * get the value indicates whether the Familiarisation data created or not
         */
        get: function () {
            return this._isFamiliarisationDataCreated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginStore.prototype, "isReportsVisible", {
        /**
         * get the value indicates whether the reports visible or not
         */
        get: function () {
            return this._isReportsVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginStore.prototype, "isAdminLoginEnabled", {
        /**
         * get the value indicates whether it is admin login or not
         */
        get: function () {
            return this._isAdminLoginEnabled;
        },
        enumerable: true,
        configurable: true
    });
    LoginStore.LOGIN_EVENT = 'login';
    LoginStore.UPDATE_SESSION_ON_LOGOUT_EVENT = 'updateSessionOnLogout';
    LoginStore.CONCURRENT_SESSION_ACTIVE = 'concurrentsessionactive';
    LoginStore.FAMILIARISATION_DATA_CREATED_EVENT = 'familiarisationdatacreatedevent';
    LoginStore.SUPPORT_LOGIN_EVENT = 'supportloginevent';
    return LoginStore;
}(storeBase));
var instance = new LoginStore();
module.exports = { LoginStore: LoginStore, instance: instance };
//# sourceMappingURL=loginstore.js.map