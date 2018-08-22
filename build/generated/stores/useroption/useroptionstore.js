"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var dispatcher = require('../../app/dispatcher');
var actionType = require('../../actions/base/actiontypes');
var UseroptionStore = (function (_super) {
    __extends(UseroptionStore, _super);
    /**
     * Constructor for Useroptions store
     */
    function UseroptionStore() {
        var _this = this;
        _super.call(this);
        this._isLoaded = false;
        /** Emiting after retrieving user options */
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.USER_OPTION_GET:
                    _this.success = action.success;
                    if (_this.success) {
                        _this._isLoaded = true;
                        _this.userOptions = action.getUserOptions;
                        _this.emit(UseroptionStore.USER_OPTION_GET_EVENT);
                    }
                    break;
                case actionType.USER_OPTION_SAVE:
                    _this.saveSuccess = action.success;
                    /** Getting saved user option */
                    var savedUserOption_1 = action.getSavedUserOption;
                    _this.saveStatusCode = action.getStatusCode;
                    _this.saveErrorMessage = action.getErrorMessage;
                    /** Updating local user option with saved user option */
                    savedUserOption_1.userOptions.forEach(function (userOption) {
                        _this.updateUserOptionValue(userOption.userOptionName, userOption.value, savedUserOption_1.examinerRoleId ? savedUserOption_1.examinerRoleId : 0);
                    });
                    _this.emit(UseroptionStore.USER_OPTION_SAVE_EVENT);
                    break;
                case actionType.USER_OPTION_SAVE_ON_LOGOUT:
                    _this.saveSuccess = action.success;
                    _this.emit(UseroptionStore.USER_OPTION_SAVE_ON_LOGOUT_EVENT);
                    break;
            }
        });
    }
    /**
     * Update user option values based on userOptionKey
     * @param {string} userOptionKey
     * @param {string} userOptionValue
     * @returns
     */
    UseroptionStore.prototype.updateUserOptionValue = function (userOptionKey, userOptionValue, examinerRoleId) {
        if (this.userOptions && this.userOptions.userOptions.count() > 0) {
            this.userOptions.userOptions.map(function (item) {
                if (item.userOptionName === userOptionKey && item.examinerRoleId === examinerRoleId) {
                    item.value = userOptionValue;
                }
            });
        }
    };
    Object.defineProperty(UseroptionStore.prototype, "getUserOptions", {
        /**
         * Returns user option JSON
         * @returns
         */
        get: function () {
            return this.userOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UseroptionStore.prototype, "getSaveSuccess", {
        /**
         * Returns save success value
         * @returns
         */
        get: function () {
            return this.saveSuccess;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UseroptionStore.prototype, "getSaveStatusCode", {
        /**
         * Retrns save status code
         * @returns
         */
        get: function () {
            return this.saveStatusCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UseroptionStore.prototype, "getSaveErrorMessage", {
        /**
         * Retrns save Error message
         * @returns
         */
        get: function () {
            return this.saveErrorMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UseroptionStore.prototype, "isLoaded", {
        /**
         * Returns whether store loaded
         */
        get: function () {
            return this._isLoaded;
        },
        enumerable: true,
        configurable: true
    });
    UseroptionStore.USER_OPTION_GET_EVENT = 'UserOptionGet';
    UseroptionStore.USER_OPTION_SAVE_EVENT = 'UserOptionSaveEvent';
    UseroptionStore.USER_OPTION_SAVE_ON_LOGOUT_EVENT = 'UserOptionSaveOnLogoutEvent';
    return UseroptionStore;
}(storeBase));
var instance = new UseroptionStore();
module.exports = { UseroptionStore: UseroptionStore, instance: instance };
//# sourceMappingURL=useroptionstore.js.map