import action = require('../base/action');
import actionType = require('../base/actiontypes');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

/**
 * Action when live worklist is selected
 */
class ResponseCloseAction extends dataRetrievalAction {
    private isResponseClose: boolean;
    /**
     * worklist type constructor
     * @param markingmode
     * @param responseMode
     * @param success
     * @param isCached
     * @param responseData
     * @param json
     */
    constructor(isResponseClose: boolean) {
        super(action.Source.View, actionType.RESPONSE_CLOSE, true);
        this.isResponseClose = isResponseClose;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{isResponseClose}/g, isResponseClose.toString());
    }

    /**
     * Gets the response mode
     */
    get getIsResponseClose() {
        return this.isResponseClose;
    }
}

export = ResponseCloseAction;