"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var userInfoAction = require('./userinfoaction');
var userInfoArgument = require('../../dataservices/user/userinfoargument');
var userDataService = require('../../dataservices/user/userdataservice');
var userInfoSaveAction = require('./userinfosaveaction');
var toggleUserInfoAction = require('./toggleuserinfoaction');
var userInfoClickAction = require('./userInfoClickAction');
var actionType = require('../base/actiontypes');
var Promise = require('es6-promise');
var actionCreatorBase = require('../base/actioncreatorbase');
var markerOperationModeChangedAction = require('./markeroperationmodechangedaction');
var resetDoLoadWorklistStatusAction = require('../marking/resetdoloadworkliststatusaction');
var menuVisibilityAction = require('../menu/menuvisibilityaction');
var showLogoutPopupAction = require('../logout/showlogoutpopupaction');
var switchUserButtonClickAction = require('./switchuserbuttonclickaction');
/**
 * Class for poopulating user information
 */
var UserInfoActionCreator = (function (_super) {
    __extends(UserInfoActionCreator, _super);
    function UserInfoActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Populate logged in user information.
     */
    UserInfoActionCreator.prototype.GetLoggedUserInfo = function () {
        var that = this;
        userDataService.GetUserInformation(function (success, json) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            that.validateCall(json, false, true);
            var userInfo = new userInfoArgument(json.Initials, json.Surname, json.EmailAddress, json.UserName, json.IsEligibleForScriptAvailableEmailAlert);
            dispatcher.dispatch(new userInfoAction(true, userInfo));
        });
    };
    /**
     * Saving email
     * @param {ExaminerEmailArgument} examinerEmailArgument
     */
    UserInfoActionCreator.prototype.SaveEmailAddress = function (examinerEmailArgument) {
        var that = this;
        userDataService.SaveEmailAddress((examinerEmailArgument), function (success, json) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(json)) {
                dispatcher.dispatch(new userInfoSaveAction(success, examinerEmailArgument));
            }
        });
    };
    /**
     * Toggle user information panel.
     */
    UserInfoActionCreator.prototype.ToggleUserInfoPanel = function (saveUserOptionData) {
        if (saveUserOptionData === void 0) { saveUserOptionData = true; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new toggleUserInfoAction(actionType.TOGGLE_USER_INFO_PANEL, saveUserOptionData));
        }).catch();
    };
    /**
     * user info panel clicked.
     */
    UserInfoActionCreator.prototype.userInfoClicked = function (isUserInfoOpen) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new userInfoClickAction(isUserInfoOpen));
        }).catch();
    };
    /**
     * Operation mode changing action called
     * @param operationMode
     */
    UserInfoActionCreator.prototype.changeOperationMode = function (operationMode, doLoadCurrentExaminerWorklist, isFromMenu) {
        if (doLoadCurrentExaminerWorklist === void 0) { doLoadCurrentExaminerWorklist = false; }
        if (isFromMenu === void 0) { isFromMenu = false; }
        return new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markerOperationModeChangedAction(operationMode, doLoadCurrentExaminerWorklist, isFromMenu));
        }).catch();
    };
    /**
     * changes the visibility of menu Wrapper
     */
    UserInfoActionCreator.prototype.changeMenuVisibility = function (doVisible) {
        if (doVisible === void 0) { doVisible = true; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new menuVisibilityAction(doVisible));
        }).catch();
    };
    /**
     * displays the logout confirmation popup
     */
    UserInfoActionCreator.prototype.showLogoutPopup = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new showLogoutPopupAction());
        }).catch();
    };
    /**
     * Reset LoadWorklist status
     * @param doLoadCurrentExaminerWorklist
     */
    UserInfoActionCreator.prototype.resetDoLoadWorklistStatus = function (doLoadCurrentExaminerWorklist) {
        if (doLoadCurrentExaminerWorklist === void 0) { doLoadCurrentExaminerWorklist = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new resetDoLoadWorklistStatusAction(doLoadCurrentExaminerWorklist));
        }).catch();
    };
    /**
     * Handle the Switch User Button Click
     */
    UserInfoActionCreator.prototype.onSwitchUserButtonClick = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new switchUserButtonClickAction());
        }).catch();
    };
    return UserInfoActionCreator;
}(actionCreatorBase));
var useractioncreator = new UserInfoActionCreator();
module.exports = useractioncreator;
//# sourceMappingURL=userinfoactioncreator.js.map