"use strict";
var dispatcher = require('../../app/dispatcher');
var loginAction = require('./loginaction');
var authenticationDataService = require('../../dataservices/authentication/authenticationdataservice');
var familiarisationDataService = require('../../dataservices/familirisation/familiarisationdataservice');
var familarisationAction = require('../familarisation/familiarisationaction');
var selectExaminerAction = require('../adminsupport/selectexamineraction');
var supportloginAction = require('../adminsupport/supportloginaction');
var Promise = require('es6-promise');
/**
 * Login action creator helper class
 */
var LoginActionCreator = (function () {
    function LoginActionCreator() {
    }
    /**
     * Call the authentication service and then generate an appropriate login action
     * @param userName
     * @param password
     * @param isFamilirisationLogin
     */
    LoginActionCreator.prototype.login = function (userName, password, isFamilirisationLogin, selectedlaunguage) {
        var that = this;
        authenticationDataService.authenticate(userName, password, isFamilirisationLogin, function (success, isAdvancedFamilarisationEnabled, isReportsVisible, isAdminRemarker, isMarkerPasswordManagementEnabled, passwordChangeKey, isAdminLogin, json) {
            if (isMarkerPasswordManagementEnabled && passwordChangeKey && success) {
                // when password change key exists redirects to new url.
                that.openPasswordManagemanetUrl(passwordChangeKey, userName, selectedlaunguage);
            }
            else {
                // Dispatch the login action once the authentication call completes
                dispatcher.dispatch(new loginAction(success, userName, isAdvancedFamilarisationEnabled, isReportsVisible, isAdminRemarker, isFamilirisationLogin, isAdminLogin, json));
            }
        });
    };
    /**
     * To check whether the redirect request is authenticated or not.
     * @param isFamilirisationLogin
     */
    LoginActionCreator.prototype.isAuthenticate = function () {
        authenticationDataService.reAuthenticate(function (success, isAdvancedFamilarisationEnabled, isReportsVisible, isAdminRemarker, userName, isAdminSupportEnabled, json) {
            // Dispatch the login action once the authentication call completes
            dispatcher.dispatch(new loginAction(success, userName, isAdvancedFamilarisationEnabled, isReportsVisible, isAdminRemarker, undefined, isAdminSupportEnabled, json));
        });
    };
    /**
     * create the components in database
     */
    LoginActionCreator.prototype.setUpFamilarisationData = function () {
        familiarisationDataService.setUpFamilarisationData(function (success, isFamComponentsCreated) {
            // Dispatch the action once the action completes
            dispatcher.dispatch(new familarisationAction(success, isFamComponentsCreated));
        });
    };
    /**
     * Redirect assessor to change email and password management url
     * @param passwordChangeKey
     * @param username
     */
    LoginActionCreator.prototype.openPasswordManagemanetUrl = function (passwordChangeKey, username, selectedlaunguage) {
        var queryString = config.general.PASSWORD_RESET_URL
            + '?pckey=' + passwordChangeKey + '&'
            + 'mode=activation&'
            + 'returnurl=' + config.general.SERVICE_BASE_URL + '\index.html?isPasswordResetSuccess=true&'
            + 'username=' + username + '&'
            + 'app=a3&'
            + 'culture=' + selectedlaunguage;
        window.open(queryString, '_self');
    };
    /**
     * Redirect assessor to suppport login action
     * @param userName
     * @param userId
     */
    LoginActionCreator.prototype.supportLogin = function (userName, userId) {
        authenticationDataService.supportAdminAuthenticate(userName, userId, function (success, isAdvancedFamilarisationEnabled, isReportsVisible, isAdminRemarker, isMarkerPasswordManagementEnabled, passwordChangeKey, json) {
            // Dispatch the login action once the authentication call completes
            dispatcher.dispatch(new supportloginAction(success, userName, false, isReportsVisible, isAdminRemarker, false, json));
        });
    };
    /**
     * select examiner in support enviornment
     * @param examinerId
     */
    LoginActionCreator.prototype.selectExaminer = function (examinerId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new selectExaminerAction(examinerId));
        }).catch();
    };
    return LoginActionCreator;
}());
var loginActionCreator = new LoginActionCreator();
module.exports = loginActionCreator;
//# sourceMappingURL=loginactioncreator.js.map