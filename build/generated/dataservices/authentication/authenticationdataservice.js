"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LoginSession = require('../../app/loginsession');
var DataServiceBase = require('../base/dataservicebase');
var URLs = require('../base/urls');
var cookie = require('react-cookie');
var constants = require('../../components/utility/constants');
var promise = require('es6-promise');
/**
 * Authentication data service class
 */
var AuthenticationDataService = (function (_super) {
    __extends(AuthenticationDataService, _super);
    function AuthenticationDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Authenticate the entered username and password from login screen
     * @param userName
     * @param password
     * @param isFamilirisationLogin
     * @param callback
     */
    AuthenticationDataService.prototype.authenticate = function (userName, password, isFamilirisationLogin, callback) {
        var screenResolution = screen.width.toString() + 'x' + screen.height.toString();
        var data = {
            'username': userName,
            'password': password,
            'granttype': 'password',
            'screenresolution': screenResolution,
            'isFamiliarisation': isFamilirisationLogin
        };
        var url = URLs.AUTHENTICATE_URL;
        // Making AJAX call for Login without the security header
        var authenticationPromise = this.makeAJAXCallWithoutHeader('POST', url, JSON.stringify(data));
        authenticationPromise.then(function (json) {
            if (callback) {
                LoginSession.MARKING_SESSION_TRACKING_ID = json.MarkingSessionTrackingId;
                LoginSession.IS_AUTHENTICATED = true;
                LoginSession.EXAMINER_ID = json.ExaminerId;
                ////LoginSession.SECURITY_TOKEN = json.access_token;
                ////LoginSession.REFRESH_TOKEN = json.refresh_token;
                ////LoginSession.TOKEN_TIME_STAMP = Date.now() / 1000;
                ////LoginSession.TOKEN_EXPIRY = json.expires_in;
                LoginSession.AWARDING_BODY = json.AwardingBody;
                LoginSession.IS_FAMILIARISATION_LOGIN = isFamilirisationLogin;
                //setting the cookie value for cocurrent session
                LoginSession.SESSION_IDENTIFIER = cookie.load(constants.SESSION_IDENTIFIER_COOKIE, true);
                callback(true, isFamilirisationLogin && json.IsAdvancedFamilarisationEnabled, json.IsReportsVisible, json.IsAdminRemarker, json.IsMarkerPasswordManagementEnabled, json.PasswordChangeKey, json.IsAdminSupportEnabled, json);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, false, false, false, null, null, false, json);
            }
        });
    };
    /**
     * Authenticate the entered username and password from login screen
     * @param userName
     * @param password
     * @param isFamilirisationLogin
     * @param callback
     */
    AuthenticationDataService.prototype.reAuthenticate = function (callback) {
        var url = URLs.RE_AUTHENTICATE_URL;
        // Making AJAX call for Login without the security header
        var authenticationPromise = this.makeAJAXCallWithoutHeader('GET', url);
        authenticationPromise.then(function (json) {
            if (callback) {
                LoginSession.MARKING_SESSION_TRACKING_ID = json.MarkingSessionTrackingId;
                LoginSession.IS_AUTHENTICATED = true;
                LoginSession.EXAMINER_ID = json.ExaminerId;
                LoginSession.AWARDING_BODY = json.AwardingBody;
                LoginSession.IS_FAMILIARISATION_LOGIN = false;
                LoginSession.SESSION_IDENTIFIER = cookie.load(constants.SESSION_IDENTIFIER_COOKIE, true);
                LoginSession.IS_SUPPORT_ADMIN_LOGIN = json.IsAdminSupportEnabled;
                callback(true, json.IsAdvancedFamilarisationEnabled, json.IsReportsVisible, json.IsAdminRemarker, json.UserName, json.IsAdminSupportEnabled);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, false, false, false, '', false, json);
            }
        });
    };
    /**
     * Update's session details
     * @param logoutData
     * @param callback
     */
    AuthenticationDataService.prototype.updateUserSession = function (logoutData, callback) {
        // Logout from AI and clear the cookies from the browser if reports page is accessed
        var logoutAIPromise = logoutData.isReportsPageAccessed ?
            this.makeAJAXCallWithoutDatatype('POST', config.general.AI_URL + '?A3Logout=true') :
            new promise.Promise(function (resolve, reject) {
                resolve();
            });
        var that = this;
        logoutAIPromise.then(function (json) {
            var logoutPromise = that.makeAJAXCall('POST', URLs.UPDATE_USER_SESSION_ON_LOGOUT, JSON.stringify(logoutData));
            logoutPromise.then(function (json) {
                if (callback) {
                    callback(true);
                }
            }).catch(function (json) {
                if (callback) {
                    callback(false, json);
                }
            });
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Authenticate the entered username and password from login screen of admin support enviornment
     * @param userName
     * @param userId
     * @param callback
     */
    AuthenticationDataService.prototype.supportAdminAuthenticate = function (userName, userId, callback) {
        var url = URLs.SUPPORTAUTHENTICATE_URL + '/' + userId;
        // Making AJAX call for Login without the security header
        var supportAuthenticationPromise = this.makeAJAXCallWithoutHeader('GET', url);
        supportAuthenticationPromise.then(function (json) {
            if (callback) {
                LoginSession.MARKING_SESSION_TRACKING_ID = json.MarkingSessionTrackingId;
                LoginSession.IS_AUTHENTICATED = true;
                LoginSession.EXAMINER_ID = json.ExaminerId;
                LoginSession.AWARDING_BODY = json.AwardingBody;
                LoginSession.IS_FAMILIARISATION_LOGIN = false;
                LoginSession.IS_SUPPORT_ADMIN_LOGIN = true;
                LoginSession.SESSION_IDENTIFIER = cookie.load(constants.SESSION_IDENTIFIER_COOKIE, true);
                callback(true, false, json.IsReportsVisible, json.IsAdminRemarker, json.IsMarkerPasswordManagementEnabled, json.PasswordChangeKey);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, false, false, false, null, json);
            }
        });
    };
    return AuthenticationDataService;
}(DataServiceBase));
var authenticationDataService = new AuthenticationDataService();
module.exports = authenticationDataService;
//# sourceMappingURL=authenticationdataservice.js.map