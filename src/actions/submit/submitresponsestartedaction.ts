import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

/**
 * Action to start submit single response
 */
class SubmitResponseStartedAction extends action {

    private _markGroupId: number;

    /**
     * Constructor for ResponseSubmitStarted
     * @param markGroupId The mark group id
     */
    constructor( markGroupId: number) {
        super(action.Source.View, actionType.SINGLE_RESPONSE_SUBMIT_STARTED);
        this._markGroupId = markGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markGroupId}/g, markGroupId.toString());
    }

    /**
     * Gets the mark group id
     */
    get getMarkGroupId() {
        return this._markGroupId;
    }
}
export = SubmitResponseStartedAction;