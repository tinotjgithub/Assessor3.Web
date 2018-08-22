import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ErrorAction extends dataRetrievalAction {
    /**
     * Get the User Name
     * @returns User Name.
     */
    private username: string;
    /**
     * @constructor
     */
    constructor(success: boolean, username: string) {
        super(action.Source.View, actionType.ERROR, success);
        this.username = username;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    /**
     * Get the User Name
     * @returns User Name.
     */
    get userName() {
        return this.username;
    }
}
export = ErrorAction;