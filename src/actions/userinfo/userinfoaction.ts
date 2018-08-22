import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import userInfoArgument = require('../../dataservices/user/userinfoargument');

/**
 * The class holds user info details
 * @param {boolean} success
 */
class UserInfoAction extends dataRetrievalAction {

    // User info argument
    private userInfoArgument: userInfoArgument;

    /**
     * Initializing a new instance of UserInfo Argument.
     * @param {boolean} success
     */
    constructor(success: boolean, userinfoargument: userInfoArgument) {
        super(action.Source.View, actionType.USERINFO, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this.userInfoArgument = userinfoargument;
    }

    /**
     * Gets the user name.
     * @returns The user information
     */
    public get UserInfo(): userInfoArgument {
        return this.userInfoArgument;
    }
}
export = UserInfoAction;