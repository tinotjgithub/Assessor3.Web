"use strict";
/**
 * Login related information stored in this class
 */
var LoginSession = (function () {
    function LoginSession() {
    }
    LoginSession.MARKING_SESSION_TRACKING_ID = null;
    ////public static SECURITY_TOKEN: string = null;
    LoginSession.EXAMINER_ID = 0;
    LoginSession.FOREGROUND_REQUEST_COUNT = 0;
    LoginSession.SECOND_PRIORITY_REQUEST_COUNT = 0;
    ////public static REFRESH_TOKEN: string = null;
    ////public static TOKEN_TIME_STAMP: number = 0;
    LoginSession.AWARDING_BODY = null;
    ////public static TOKEN_EXPIRY: number = 0;
    LoginSession.IS_AUTHENTICATED = false;
    LoginSession.IS_FAMILIARISATION_LOGIN = false;
    LoginSession.SESSION_IDENTIFIER = null;
    LoginSession.IS_SUPPORT_ADMIN_LOGIN = false;
    return LoginSession;
}());
module.exports = LoginSession;
//# sourceMappingURL=loginsession.js.map