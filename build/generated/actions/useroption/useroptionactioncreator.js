"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var userOptionGetAction = require('./useroptiongetaction');
var userOptionSaveAction = require('./useroptionsaveaction');
var userDataService = require('../../dataservices/user/userdataservice');
var Promise = require('es6-promise');
var base = require('../base/actioncreatorbase');
var setRememberQigAction = require('./setrememberqigaction');
var enums = require('../../components/utility/enums');
/**
 * UserOptionActionCreator class
 */
var UserOptionActionCreator = (function (_super) {
    __extends(UserOptionActionCreator, _super);
    function UserOptionActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     *   For fetching user options
     */
    UserOptionActionCreator.prototype.getUserOptions = function (useCache) {
        if (useCache === void 0) { useCache = false; }
        var that = this;
        // User options retrieve dataservice call
        userDataService.retrieveUserOptions(function (success, userOption) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(userOption)) {
                dispatcher.dispatch(new userOptionGetAction(success, userOption));
            }
        }, useCache);
    };
    /**
     * For saving user options
     */
    UserOptionActionCreator.prototype.saveUserOptions = function (userOptionsJson, isLogout, isOffLineMessageShow) {
        if (isLogout === void 0) { isLogout = false; }
        if (isOffLineMessageShow === void 0) { isOffLineMessageShow = true; }
        var that = this;
        /* User option save dataservice call.*/
        userDataService.saveUserOptions(userOptionsJson, function (success, json) {
            // This will validate the call to find any network failure
            // and is mandatory to add this. The validation is needed only when user is trying to logout.
            // The offline error popup need not be thrown when the save useroption call breaks.
            isOffLineMessageShow = isLogout;
            if (that.validateCall(json, false, isOffLineMessageShow, enums.WarningMessageAction.None, isLogout)) {
                dispatcher.dispatch(new userOptionSaveAction(success, isLogout, userOptionsJson));
            }
        });
    };
    /**
     * For updating selected qig details in store
     */
    UserOptionActionCreator.prototype.updateSelectedQigDetails = function (_rememberQigInfo) {
        return new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setRememberQigAction(_rememberQigInfo));
        }).catch();
    };
    return UserOptionActionCreator;
}(base));
var userOptionActionCreator = new UserOptionActionCreator();
module.exports = userOptionActionCreator;
//# sourceMappingURL=useroptionactioncreator.js.map