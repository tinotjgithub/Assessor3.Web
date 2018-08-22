"use strict";
var qigStore = require('../../stores/qigselector/qigstore');
var userOptionStore = require('../../stores/useroption/useroptionstore');
var userOptionRecord = require('../../stores/useroption/useroptionrecord');
var userOptionDataRecord = require('../../stores/useroption/useroptiondatarecord');
var Immutable = require('immutable');
var loginSession = require('../../../src/app/loginsession');
var userOptionsActionCreator = require('../../actions/useroption/useroptionactioncreator');
var userOptionKeys = require('./useroptionkeys');
/**
 * Helper class for sorting of an array of any objecys
 */
var UserOptionsHelper = (function () {
    function UserOptionsHelper() {
    }
    /**
     * Saves the user options whether examiner/examinerRole , immediate/not
     * @param {string} userOptionKey user option key
     * @param {string} userOptionValue value of the user option
     * @param {boolean} immediate save immediately to DB
     * @param {number} examinerRoleId Level of the user option to save
     */
    UserOptionsHelper.save = function (userOptionKey, userOptionValue, immediate, isExaminerRole, isLogout, isOffLineMessageShow, examinerRoleId) {
        if (immediate === void 0) { immediate = false; }
        if (isExaminerRole === void 0) { isExaminerRole = false; }
        if (isLogout === void 0) { isLogout = false; }
        if (isOffLineMessageShow === void 0) { isOffLineMessageShow = true; }
        if (examinerRoleId === void 0) { examinerRoleId = 0; }
        if (immediate) {
            // the change needs to be saved immediately to DB
            userOptionsActionCreator.saveUserOptions(this.createUserOptionList(userOptionKey, userOptionValue, isExaminerRole, examinerRoleId), isLogout, isOffLineMessageShow);
        }
        // the change will be saved only during Logout
        if (isExaminerRole) {
            // This is an examiner role level user option
            this.updateUserOptionsForExaminerRole(userOptionKey, userOptionValue, examinerRoleId);
        }
        else {
            // This is an examiner level user option
            this.updateUserOptionValue(userOptionKey, userOptionValue);
        }
    };
    /**
     * Returns user options based on userOptionKey. This wil check for the changed user action as well as the one in store.
     * @param {string} userOptionKey
     * @returns
     */
    UserOptionsHelper.getUserOptionByName = function (userOptionKey, examinerRoleId) {
        return this.getUserOptionByNameAndKey(userOptionKey, 'value', examinerRoleId);
    };
    /**
     * To initaiate the save action and reset the local user option collection
     */
    UserOptionsHelper.InitiateSaveUserOption = function (isLogout) {
        if (this.userOptionsExaminerRoleDelta &&
            this.userOptionsExaminerRoleDelta.length > 0 &&
            qigStore.instance.getSelectedQIGForTheLoggedInUser) {
            this.userOptionsExaminerRoleDelta.forEach(function (userOption) {
                userOptionsActionCreator.saveUserOptions(userOption, isLogout);
            });
        }
        if (this.userOptionsDelta && this.userOptionsDelta.userOptions.count() > 0) {
            userOptionsActionCreator.saveUserOptions(this.userOptionsDelta, isLogout);
        }
        /** resetting the locally stored user option collection */
        this.resetChangedUserOptions();
    };
    Object.defineProperty(UserOptionsHelper, "hasUserOptionsChanged", {
        /**
         * User options changes
         */
        get: function () {
            if ((this.userOptionsDelta && this.userOptionsDelta.userOptions.count() > 0)
                || (this.userOptionsExaminerRoleDelta && this.userOptionsExaminerRoleDelta.length > 0)) {
                return true;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * function reset the tokens of current login session
     */
    UserOptionsHelper.resetTokensAndRedirect = function () {
        loginSession.IS_AUTHENTICATED = false;
        ////loginSession.SECURITY_TOKEN = null;
        ////loginSession.REFRESH_TOKEN = null;
        ////loginSession.TOKEN_TIME_STAMP = 0;
        loginSession.MARKING_SESSION_TRACKING_ID = null;
        loginSession.SESSION_IDENTIFIER = undefined;
        // This will clear the memory.
        window.location.replace(config.general.SERVICE_BASE_URL);
    };
    /**
     * Check whether the examiner has customised the stamps in the current QIG
     */
    UserOptionsHelper.hasExaminerCustomisedTheStamps = function () {
        return this.customisedStampsInQIGs.indexOf(qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId) >= 0;
    };
    /**
     * Creates a new user option record and returns a list
     * @param {string} userOptionKey
     * @param {string} userOptionValue
     * @returns
     */
    UserOptionsHelper.createUserOptionRecord = function (userOptionKey, userOptionValue) {
        var jsonItem = new userOptionRecord();
        jsonItem.userOptionID = UserOptionsHelper.getUserOptionID(userOptionKey);
        jsonItem.userOptionName = userOptionKey;
        jsonItem.isOverridablebyExaminer = UserOptionsHelper.getUserOptionIsOverridablebyExaminer(userOptionKey);
        jsonItem.value = userOptionValue;
        return jsonItem;
    };
    /**
     * Creates a new user option record and returns a list
     * @param {string} userOptionKey
     * @param {string} userOptionValue
     * @returns
     */
    UserOptionsHelper.createUserOptionList = function (userOptionKey, userOptionValue, isExaminerRole, examinerRoleId) {
        if (examinerRoleId === void 0) { examinerRoleId = 0; }
        var jsonItem = new userOptionRecord();
        jsonItem = this.createUserOptionRecord(userOptionKey, userOptionValue);
        var userOptionList = Immutable.List();
        userOptionList = userOptionList.push(jsonItem);
        var userOptionCreated = new userOptionDataRecord();
        userOptionCreated.userOptions = userOptionList;
        userOptionCreated.trackingId = loginSession.MARKING_SESSION_TRACKING_ID;
        if (isExaminerRole) {
            if (examinerRoleId === 0) {
                userOptionCreated.examinerRoleId = qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId;
            }
            else {
                userOptionCreated.examinerRoleId = examinerRoleId;
            }
        }
        return userOptionCreated;
    };
    /**
     * Update user option values based on userOptionKey
     * @param {string} userOptionKey
     * @param {string} userOptionValue
     * @returns
     */
    UserOptionsHelper.updateUserOptionValue = function (userOptionKey, userOptionValue) {
        var isNew;
        isNew = true;
        if (this.userOptionsDelta && this.userOptionsDelta.userOptions.count() > 0) {
            /** Updating if the option is already changed and not saved */
            this.userOptionsDelta.userOptions.map(function (item) {
                if (item.userOptionName === userOptionKey) {
                    item.value = userOptionValue;
                    isNew = false;
                }
            });
        }
        if (isNew) {
            /** Adding the changed option to local collection for save */
            if (!this.userOptionsDelta) {
                this.userOptionsDelta = new userOptionDataRecord();
                this.userOptionsDelta.trackingId = loginSession.MARKING_SESSION_TRACKING_ID;
            }
            if (!this.userOptionsDelta.userOptions) {
                /** initiating a new collection if the local collection is undefined */
                this.userOptionsDelta.userOptions = Immutable.List();
            }
            this.userOptionsDelta.userOptions = this.userOptionsDelta.userOptions.push(this.createUserOptionRecord(userOptionKey, userOptionValue));
        }
    };
    /**
     * This method will update the user options for examiner roleId.
     * @param examinerRoleId
     * @param userOptionKey
     * @param userOptionValue
     */
    UserOptionsHelper.updateUserOptionsForExaminerRole = function (userOptionKey, userOptionValue, examinerRoleId) {
        var isNew = true;
        // if examinerRoleId is not passed, then use the logged In user’s examinerroleid against currently selected QIG
        if (examinerRoleId === 0) {
            examinerRoleId = qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId;
        }
        // If the User customised the Stamps, add the role Id to the collection for skipping the logic later.
        if (userOptionKey === userOptionKeys.REMEMBER_CHOSEN_STAMPS && this.customisedStampsInQIGs.indexOf(examinerRoleId) < 0) {
            this.customisedStampsInQIGs.push(examinerRoleId);
        }
        // if the useroption value is empty and we have already push the examiner role in customisedStampsInQIGs array 
        // then popuout that eaxminerrole id from collection for auto - populating the stamps in fav panel.
        if (userOptionKey === userOptionKeys.REMEMBER_CHOSEN_STAMPS &&
            this.customisedStampsInQIGs.indexOf(examinerRoleId) >= 0 && userOptionValue === '') {
            this.customisedStampsInQIGs.splice(this.customisedStampsInQIGs.indexOf(examinerRoleId), 1);
        }
        if (this.userOptionsExaminerRoleDelta) {
            var userOptionForExaminerRoleId = this.userOptionsExaminerRoleDelta.filter(function (x) { return x.examinerRoleId === examinerRoleId; })[0];
            if (userOptionForExaminerRoleId && userOptionForExaminerRoleId.userOptions.count() > 0) {
                /** Updating if the user option, if it is changed */
                userOptionForExaminerRoleId.userOptions.map(function (item) {
                    if (item.userOptionName === userOptionKey) {
                        item.value = !userOptionValue ? '' : userOptionValue;
                        isNew = false;
                    }
                });
            }
        }
        if (isNew && userOptionValue) {
            // initialise userOptionsForExaminerRole variable if it is undefined or null
            if (!this.userOptionsExaminerRoleDelta) {
                this.userOptionsExaminerRoleDelta = new Array();
            }
            // If entry is not available against examiner role Id then we will push new item to array.
            var userOptionsForExaminerRoleId = this.userOptionsExaminerRoleDelta.filter(function (x) { return x.examinerRoleId === examinerRoleId; })[0];
            if (!userOptionsForExaminerRoleId) {
                userOptionsForExaminerRoleId = new userOptionDataRecord();
                userOptionsForExaminerRoleId.trackingId = loginSession.MARKING_SESSION_TRACKING_ID;
                userOptionsForExaminerRoleId.examinerRoleId = examinerRoleId;
                this.userOptionsExaminerRoleDelta.push(userOptionsForExaminerRoleId);
            }
            // push the user option item.
            var indexOfItem = this.userOptionsExaminerRoleDelta.indexOf(userOptionsForExaminerRoleId);
            var userOptions = (userOptionsForExaminerRoleId.userOptions) ? userOptionsForExaminerRoleId.userOptions.toArray() : [];
            userOptions.push(this.createUserOptionRecord(userOptionKey, userOptionValue));
            this.userOptionsExaminerRoleDelta[indexOfItem].userOptions = Immutable.List(userOptions);
        }
    };
    /**
     * to reset the changed user options collection.
     */
    UserOptionsHelper.resetChangedUserOptions = function () {
        this.userOptionsDelta = undefined;
    };
    /**
     * Returns user options based on userOptionKey
     * @param {string} userOptionKey
     * @returns
     */
    UserOptionsHelper.getUserOptionID = function (userOptionKey, examinerRoleId) {
        return this.getUserOptionByNameAndKey(userOptionKey, 'userOptionID', examinerRoleId);
    };
    /**
     * Returns user options based on userOptionKey
     * @param {string} userOptionKey
     * @returns
     */
    UserOptionsHelper.getUserOptionIsOverridablebyExaminer = function (userOptionKey, examinerRoleId) {
        return this.getUserOptionByNameAndKey(userOptionKey, 'isOverridablebyExaminer', examinerRoleId);
    };
    /**
     * Returns the value of a json key in useroptions json
     * @param userOptionKey
     * @param jsonKey - UserOptionId, UserOptionvalue etc
     */
    UserOptionsHelper.getUserOptionByNameAndKey = function (userOptionKey, jsonKey, examinerRoleId) {
        var userOptionValue;
        var isUserOptionChanged = false;
        if (!examinerRoleId) {
            /** if the local collection is not empty checking for the value of user option in locla collection */
            if (this.userOptionsDelta && this.userOptionsDelta.userOptions.count() > 0) {
                this.userOptionsDelta.userOptions.map(function (item) {
                    if (item.userOptionName === userOptionKey) {
                        userOptionValue = item[jsonKey];
                        isUserOptionChanged = true;
                    }
                });
            }
            /** if the value of user option is not there in local collection check for the same in the collection available in store */
            if (isUserOptionChanged === false) {
                var _userOptions = (userOptionStore.instance) ? userOptionStore.instance.getUserOptions : undefined;
                if (_userOptions) {
                    _userOptions.userOptions.map(function (item) {
                        if (item.userOptionName === userOptionKey) {
                            userOptionValue = item[jsonKey];
                        }
                    });
                }
            }
        }
        else {
            /** if the local collection is not empty checking for the value of user option in local collection */
            if (this.userOptionsExaminerRoleDelta) {
                var userOptionsForExaminerRoleId = this.userOptionsExaminerRoleDelta.filter(function (x) { return x.examinerRoleId === examinerRoleId; })[0];
                if (userOptionsForExaminerRoleId && userOptionsForExaminerRoleId.userOptions.count() > 0) {
                    userOptionsForExaminerRoleId.userOptions.map(function (item) {
                        if (item.userOptionName === userOptionKey) {
                            userOptionValue = item[jsonKey];
                            isUserOptionChanged = true;
                        }
                    });
                }
            }
            /** if the value of user option is not there in local collection check for the same in the collection available in the store */
            if (isUserOptionChanged === false) {
                var _userOptions = (userOptionStore.instance) ? userOptionStore.instance.getUserOptions : undefined;
                if (_userOptions) {
                    _userOptions.userOptions.map(function (item) {
                        if (item.userOptionName === userOptionKey && item.examinerRoleId === examinerRoleId) {
                            userOptionValue = item[jsonKey];
                        }
                    });
                }
            }
        }
        return userOptionValue;
    };
    Object.defineProperty(UserOptionsHelper, "userOptionForCurrentExaminerRole", {
        /**
         *  This method will return the user options for current examiner role based on the current examinerId
         */
        get: function () {
            return this.userOptionsExaminerRoleDelta.filter(function (x) { return x.examinerRoleId === qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId; })[0];
        },
        enumerable: true,
        configurable: true
    });
    UserOptionsHelper.customisedStampsInQIGs = new Array();
    return UserOptionsHelper;
}());
module.exports = UserOptionsHelper;
//# sourceMappingURL=useroptionshelper.js.map