import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
/**
 * The Action class for dispatching loading reset statuses(before making call reseting the load status flag)
 *  of markshemestructure and marks in markschemestructurestore and markingstore respectively.
 */
class ResetMarkInfoLoadStatusAction extends dataRetrievalAction {
    private isMarkSchemeReset: boolean;
    /**
     * Initializing a new instance of MarkInfoResetArguments action.
     * @param {boolean} success
     */
    constructor(isMarkSchemeReset: boolean) {
        super(action.Source.View, actionType.RESET_MARK_INFO_LOAD_STATUS, isMarkSchemeReset);
        this.isMarkSchemeReset = isMarkSchemeReset;
    }

    /**
     * resetMarkingInfoStatus
     * @returns
     */
    public get resetMarkSchemeLoadStatus(): boolean {
        return this.isMarkSchemeReset;
    }
}
export = ResetMarkInfoLoadStatusAction;