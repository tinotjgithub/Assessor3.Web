import LoginSession = require('../../app/loginsession');
import DataServiceBase = require('../base/dataservicebase');
import URLs = require('../base/urls');
import logoutArgument = require('./logoutargument');
import cookie = require('react-cookie');
import constants = require('../../components/utility/constants');
import promise = require('es6-promise');
declare let config: any;

/**
 * Authentication data service class
 */
class AuthenticationDataService extends DataServiceBase {

    /**
     * Authenticate the entered username and password from login screen
     * @param userName
     * @param password
     * @param isFamilirisationLogin
     * @param callback
     */
    public authenticate(
        userName: string,
        password: string,
        isFamilirisationLogin: boolean,
        callback: ((success: boolean,
            isAdvancedFamilarisationEnabled: boolean,
            isReportsVisible: boolean,
            isAdminRemarker: boolean,
            isMarkerPasswordManagementEnabled: boolean,
            passwordChangeKey: string,
            isAdminLogin: boolean,
            json?: any) => void)): void {

        let screenResolution = screen.width.toString() + 'x' + screen.height.toString();
        let data = {
            'username': userName,
            'password': password,
            'granttype': 'password',
            'screenresolution': screenResolution,
            'isFamiliarisation': isFamilirisationLogin
        };
        let url = URLs.AUTHENTICATE_URL;

        // Making AJAX call for Login without the security header
        let authenticationPromise = this.makeAJAXCallWithoutHeader(
            'POST',
            url,
            JSON.stringify(data));

        authenticationPromise.then(function (json: any) {
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
                callback(true, isFamilirisationLogin && json.IsAdvancedFamilarisationEnabled, json.IsReportsVisible, json.IsAdminRemarker,
                    json.IsMarkerPasswordManagementEnabled, json.PasswordChangeKey, json.IsAdminSupportEnabled, json);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, false, false, false, null, null, false, json);
            }
        });
    }

    /**
     * Authenticate the entered username and password from login screen
     * @param userName
     * @param password
     * @param isFamilirisationLogin
     * @param callback
     */
    public reAuthenticate(
        isFamilirisationLogin: boolean,
        callback: ((success: boolean,
            isAdvancedFamilarisationEnabled: boolean,
            isReportsVisible: boolean,
            isAdminRemarker: boolean,
            userName: string,
            isAdminLogin: boolean,
            json?: any) => void)): void {

        let url = URLs.RE_AUTHENTICATE_URL;

        // Making AJAX call for Login without the security header
        let authenticationPromise = this.makeAJAXCallWithoutHeader(
            'GET',
            url);

        authenticationPromise.then(function (json: any) {
            if (callback) {
                LoginSession.MARKING_SESSION_TRACKING_ID = json.MarkingSessionTrackingId;
                LoginSession.IS_AUTHENTICATED = true;
                LoginSession.EXAMINER_ID = json.ExaminerId;
                LoginSession.AWARDING_BODY = json.AwardingBody;
                LoginSession.IS_FAMILIARISATION_LOGIN = isFamilirisationLogin;
                LoginSession.SESSION_IDENTIFIER = cookie.load(constants.SESSION_IDENTIFIER_COOKIE, true);
                LoginSession.IS_SUPPORT_ADMIN_LOGIN = json.IsAdminSupportEnabled;
                callback(true, json.IsAdvancedFamilarisationEnabled, json.IsReportsVisible,
                    json.IsAdminRemarker, json.UserName, json.IsAdminSupportEnabled);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, false, false, false, '', false, json);
            }
        });
    }

    /**
     * Update's session details
     * @param logoutData
     * @param callback
     */
    public updateUserSession(logoutData: logoutArgument, callback: ((success: boolean, json?: any) => void)): void {

        // Logout from AI and clear the cookies from the browser if reports page is accessed
        let logoutAIPromise = logoutData.isReportsPageAccessed ?
            this.makeAJAXCallWithoutDatatype('POST', config.general.AI_URL + '?A3Logout=true') :
            new promise.Promise(function (resolve: any, reject: any) {
                resolve();
            });

        let that = this;

        logoutAIPromise.then(function (json: any) {
            let logoutPromise = that.makeAJAXCall('POST', URLs.UPDATE_USER_SESSION_ON_LOGOUT, JSON.stringify(logoutData));
            logoutPromise.then(function (json: any) {
                if (callback) {
                    callback(true);
                }
            }).catch(function (json: any) {
                if (callback) {
                    callback(false, json);
                }
            });
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Authenticate the entered username and password from login screen of admin support enviornment
     * @param userName
     * @param userId
     * @param callback
     */
    public supportAdminAuthenticate(
        userName: string,
        userId: number,
        callback: ((success: boolean,
            isAdvancedFamilarisationEnabled: boolean,
            isReportsVisible: boolean,
            isAdminRemarker: boolean,
            isMarkerPasswordManagementEnabled: boolean,
            passwordChangeKey: string,
            json?: any) => void)): void {
        let url = URLs.SUPPORTAUTHENTICATE_URL + '/' + userId;

        // Making AJAX call for Login without the security header
        let supportAuthenticationPromise = this.makeAJAXCallWithoutHeader(
            'GET',
            url);

        supportAuthenticationPromise.then(function (json: any) {
            if (callback) {
                LoginSession.MARKING_SESSION_TRACKING_ID = json.MarkingSessionTrackingId;
                LoginSession.IS_AUTHENTICATED = true;
                LoginSession.EXAMINER_ID = json.ExaminerId;
                LoginSession.AWARDING_BODY = json.AwardingBody;
                LoginSession.IS_FAMILIARISATION_LOGIN = false;
                LoginSession.IS_SUPPORT_ADMIN_LOGIN = true;

                LoginSession.SESSION_IDENTIFIER = cookie.load(constants.SESSION_IDENTIFIER_COOKIE, true);
                callback(true, false, json.IsReportsVisible, json.IsAdminRemarker,
                    json.IsMarkerPasswordManagementEnabled, json.PasswordChangeKey);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, false, false, false, null, json);
            }
        });
    }
}

let authenticationDataService = new AuthenticationDataService();

export = authenticationDataService;