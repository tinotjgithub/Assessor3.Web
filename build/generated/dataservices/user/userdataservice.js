"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataserviceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var Immutable = require('immutable');
var storageAdapterFactory = require('../storageadapters/storageadapterfactory');
var UserDataService = (function (_super) {
    __extends(UserDataService, _super);
    function UserDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Determines whether to retrieve data from cache or needs a service call and returns the data.
     * @param {((success} callback
     * @param {function} userOptions
     */
    UserDataService.prototype.retrieveUserOptions = function (callback, useCache) {
        if (useCache === void 0) { useCache = false; }
        var getUrl = urls.USER_OPTIONS_GET_URL;
        var that = this;
        if (useCache) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('user', 'userInformation', true, 0);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult) {
                that.retrieveUserOptionsFromServer(callback);
            });
        }
        else {
            this.retrieveUserOptionsFromServer(callback);
        }
    };
    /**
     * Retrieving user option as JSON object from server
     * @param {((success} callback
     */
    UserDataService.prototype.retrieveUserOptionsFromServer = function (callback) {
        var getUrl = urls.USER_OPTIONS_GET_URL;
        var that = this;
        var localePromise = this.makeAJAXCall('GET', getUrl);
        localePromise.then(function (json) {
            if (callback) {
                // need to use a single ref as the updates are going to take place
                // on one single ref.
                var data = that.getImmutable(JSON.parse(json));
                storageAdapterFactory.getInstance().storeData('user', 'userInformation', data, true).then().catch();
                callback(true, data);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * saving user options into server
     * @param {JSON} userOptionsJson
     * @param {((success} callback
     */
    UserDataService.prototype.saveUserOptions = function (userOptionsJson, callback) {
        var userOptions;
        userOptions = JSON.stringify(userOptionsJson);
        var saveUrl = urls.USER_OPTIONS_SAVE_URL;
        var localePromise = this.makeAJAXCall('POST', saveUrl, userOptions);
        localePromise.then(function (json) {
            if (callback) {
                callback(true);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Get user information of the logged in examiner
     * @param {((success} callback
     * @param {function} json
     */
    UserDataService.prototype.GetUserInformation = function (callback) {
        var url = urls.USER_INFO_URL;
        var userInfoPromise = this.makeAJAXCall('GET', url);
        userInfoPromise.then(function (json) {
            callback(true, json);
        }).catch(function (json) {
            callback(false, json);
        });
    };
    /**
     * Saving email address
     * @param {ExaminerEmailArgument} examinerEmailArgument
     * @param {((success} callback
     */
    UserDataService.prototype.SaveEmailAddress = function (examinerEmailArgument, callback) {
        var url = urls.USER_EMAIL_SAVE_URL;
        var userInfoPromise = this.makeAJAXCall('POST', url, JSON.stringify(examinerEmailArgument));
        userInfoPromise.then(function (json) {
            callback(true, null);
        }).catch(function (json) {
            callback(false, json);
        });
    };
    /**
     * get Immutable
     * @param {userOptionData} data
     * @returns
     */
    UserDataService.prototype.getImmutable = function (data) {
        var immutableList = Immutable.List(data.userOptions);
        data.userOptions = immutableList;
        return data;
    };
    return UserDataService;
}(dataserviceBase));
var userDataService = new UserDataService();
module.exports = userDataService;
//# sourceMappingURL=userdataservice.js.map