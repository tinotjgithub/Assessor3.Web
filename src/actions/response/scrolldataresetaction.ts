import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Class for scroll data reset action.
 */
class ScrollDataResetAction extends dataRetrievalAction {

    /**
     * Constructor ScrollDataResetAction
     * @param success
     */
    constructor(success: boolean) {
        super(action.Source.View, actionType.SCROLL_DATA_RESET, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }

}

export = ScrollDataResetAction;