/**
 * Login related information stored in this class
 */
class LoginSession {
    public static MARKING_SESSION_TRACKING_ID: string = null;
    ////public static SECURITY_TOKEN: string = null;
    public static EXAMINER_ID: number = 0;
    public static FOREGROUND_REQUEST_COUNT: number = 0;
    public static SECOND_PRIORITY_REQUEST_COUNT: number = 0;
    ////public static REFRESH_TOKEN: string = null;
    ////public static TOKEN_TIME_STAMP: number = 0;
    public static AWARDING_BODY: string = null;
    ////public static TOKEN_EXPIRY: number = 0;
    public static IS_AUTHENTICATED: boolean = false;
    public static IS_FAMILIARISATION_LOGIN: boolean = false;
    public static SESSION_IDENTIFIER: string = null;
    public static IS_SUPPORT_ADMIN_LOGIN: boolean = false;
}

export = LoginSession;