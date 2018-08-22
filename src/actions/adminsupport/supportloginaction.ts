import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class SupportLoginAction extends dataRetrievalAction {

    private username: string;
    private _isAdvancedFamilarisationEnabled: boolean;
    private _isReportsVisible: boolean;
    private _isAdminRemarker: boolean;
    private _isFamiliarizationLogin: boolean;

    /**
     * constructor
     * @param success
     * @param username
     * @param isAdvancedFamilarisationEnabled
     * @param isReportsVisible
     * @param isAdminRemarker
     * @param isFamiliarisationLogin
     * @param errorJsonObject
     */
    constructor(success: boolean, username: string, isAdvancedFamilarisationEnabled: boolean,
        isReportsVisible: boolean, isAdminRemarker: boolean, isFamiliarisationLogin: boolean, errorJsonObject?: any) {
        super(action.Source.View, actionType.SUPPORT_LOGIN, success, errorJsonObject);
        this.username = username;
        this._isAdvancedFamilarisationEnabled = isAdvancedFamilarisationEnabled;
        this._isAdminRemarker = isAdminRemarker;
        this._isReportsVisible = isReportsVisible;
        this._isFamiliarizationLogin = isFamiliarisationLogin;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }

    /**
     * Gets the user name property
     */
    get userName() {
        return this.username;
    }

    /**
     * Get the value indicates whether the AdvancedFamilarisationEnabled or not
     */
    get isAdvancedFamilarisationEnabled() {
        return this._isAdvancedFamilarisationEnabled;
    }

    /**
     * Get the value indicates whether Admin Remarker or not
     */
    get isAdminRemarker() {
        return this._isAdminRemarker;
    }

    /**
     * Get the value indicates whether the Reports visible or not
     */
    get isReportsVisible() {
        return this._isReportsVisible;
    }

    /**
     * Get the value indicates whether its familirisation Login.
     */
    get isFamiliarizationLogin() {
        return this._isFamiliarizationLogin;
    }
}

export = SupportLoginAction;