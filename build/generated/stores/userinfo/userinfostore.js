"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var actionType = require('../../actions/base/actiontypes');
var stringFormatHelper = require('../../utility/stringformat/stringformathelper');
var enums = require('../../components/utility/enums');
/**
 * Class for holding user information
 * @returns
 */
var UserInfoStore = (function (_super) {
    __extends(UserInfoStore, _super);
    /**
     *  Intializing a new instance of User Info store.
     */
    function UserInfoStore() {
        var _this = this;
        _super.call(this);
        this._operationMode = enums.MarkerOperationMode.Marking;
        this._doLoadCurrentExaminerWorklist = false;
        this._isReportsPageSelected = false;
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.USERINFO:
                    var userInfo = action;
                    if (userInfo.success && userInfo.UserInfo.UserName) {
                        _this.username = userInfo.UserInfo.UserName;
                        _this.emailAddress = userInfo.UserInfo.Email;
                        _this.formattedExaminerName = _this.getFormattedName(userInfo.UserInfo);
                        _this._isScriptAvailabilityEmailAlert = userInfo.UserInfo.IsEligibleForScriptAvailableEmailAlert;
                        _this.emit(UserInfoStore.USERINFO_EVENT);
                    }
                    break;
                case actionType.USERINFO_SAVE:
                    if (action.getSaveSuccess) {
                        _this.emailAddress = action.getExaminerInfo.emailAddress;
                        _this.emit(UserInfoStore.USERINFO_SAVE);
                    }
                    break;
                case actionType.TOGGLE_USER_INFO_PANEL:
                    _this.emit(UserInfoStore.TOGGLE_USER_INFO_PANEL, action.saveUserOptionData);
                    break;
                case actionType.USER_INFO_CLICK_ACTION:
                    _this.userInfoPanelOpen = action.isUserInfoPanelOpen;
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    var markerOperationMode = action;
                    _this._operationMode = markerOperationMode.operationMode;
                    _this._doLoadCurrentExaminerWorklist = markerOperationMode.doLoadCurrentExaminerWorklist;
                    var isFromMenu = markerOperationMode.isFromMenu;
                    _this.emit(UserInfoStore.MARKER_OPERATION_MODE_CHANGED, _this.currentOperationMode, _this.doLoadCurrentExaminerWorklist, isFromMenu);
                    break;
                case actionType.RESET_DO_LOAD_WORKLIST_STATUS_ACTION:
                    _this._doLoadCurrentExaminerWorklist = action.doLoadCurrentExaminerWorklist;
                    break;
                case actionType.SHOW_LOGOUT_POPUP_ACTION:
                    _this.emit(UserInfoStore.SHOW_LOGOUT_POPUP_EVENT);
                    break;
                case actionType.CONTAINER_CHANGE_ACTION:
                    var _loadContainerAction = action;
                    if (_loadContainerAction.containerPage === enums.PageContainers.Reports) {
                        _this._isReportsPageSelected = true;
                    }
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    var responseDataGetAction_1 = action;
                    // While opening a response from message, MARKER_OPERATION_MODE_CHANGED_ACTION is not fired,
                    // So set the operation mode. Set marking in case of Supervisor Remark navigation
                    if (responseDataGetAction_1.searchedResponseData.triggerPoint === enums.TriggerPoint.SupervisorRemark) {
                        _this._operationMode = enums.MarkerOperationMode.Marking;
                    }
                    else if (responseDataGetAction_1.searchedResponseData.isTeamManagement) {
                        _this._operationMode = enums.MarkerOperationMode.TeamManagement;
                    }
                    break;
                case actionType.SWITCH_USER_BUTTON_CLICK:
                    _this.emit(UserInfoStore.SWITCH_USER_BUTTON_CLICK);
                    break;
            }
        });
    }
    Object.defineProperty(UserInfoStore.prototype, "UserName", {
        /**
         * Get the logged in user name
         * @returns Formatted user name
         */
        get: function () {
            return this.username;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoStore.prototype, "EmailAddress", {
        /**
         * Gets the email address of the user name.
         * @returns the user name
         */
        get: function () {
            return this.emailAddress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoStore.prototype, "ExaminerName", {
        /**
         * Get examiner name
         * @returns
         */
        get: function () {
            return this.formattedExaminerName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoStore.prototype, "isUserInfoPanelOpen", {
        /*
        * gets user info panel open or closed.
        */
        get: function () {
            return this.userInfoPanelOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoStore.prototype, "currentOperationMode", {
        /**
         * Returns the current operation mode.
         */
        get: function () {
            return this._operationMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoStore.prototype, "doLoadCurrentExaminerWorklist", {
        /**
         *  Returns the status whether to load examiner worklist or dont
         */
        get: function () {
            return this._doLoadCurrentExaminerWorklist;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoStore.prototype, "isReportsPageSelected", {
        /**
         *  Returns whether the user has selected the reports page or not
         */
        get: function () {
            return this._isReportsPageSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoStore.prototype, "IsScriptAvailabilityEmailAlert", {
        /**
         * Return whether the current examiner has eligibility to set the script availability email user option
         */
        get: function () {
            return this._isScriptAvailabilityEmailAlert;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the out put of formatted username
     * @param {userInfoArgument} userInforArg
     * @returns
     */
    UserInfoStore.prototype.getFormattedName = function (userInforArg) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', userInforArg.Initials);
        formattedString = formattedString.replace('{surname}', userInforArg.Surname);
        return formattedString;
    };
    // User info name
    UserInfoStore.USERINFO_EVENT = 'userinfoupdated';
    UserInfoStore.USERINFO_SAVE = 'userinfosave';
    UserInfoStore.TOGGLE_USER_INFO_PANEL = 'toggleuserinformationpanel';
    UserInfoStore.MARKER_OPERATION_MODE_CHANGED = 'markerOperationModeChanged';
    UserInfoStore.SHOW_LOGOUT_POPUP_EVENT = 'ShowLogoutPopupAction';
    UserInfoStore.SWITCH_USER_BUTTON_CLICK = 'SwitchUserButtonClick';
    return UserInfoStore;
}(storeBase));
var instance = new UserInfoStore();
module.exports = { UserInfoStore: UserInfoStore, instance: instance };
//# sourceMappingURL=userinfostore.js.map