import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class GetMarkingCheckWorklistAccessStatusAction extends dataRetrievalAction {

    private _isMarkingCheckWorklistAccessPresent: boolean;

    /**
     * Constructor
     * @param success
     * @param isMarkingCheckWorklistAccessPresent
     */
    constructor(success: boolean, isMarkingCheckWorklistAccessPresent: boolean) {
        super(action.Source.View, actionType.MARKING_CHECK_WORKLIST_ACCESS_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());

        this._isMarkingCheckWorklistAccessPresent = isMarkingCheckWorklistAccessPresent;
    }

    /**
     * Return true if unread mandatory messages present else return false
     */
    public get isMarkingCheckWorklistAccessPresent(): boolean {
        return this._isMarkingCheckWorklistAccessPresent;
    }
}

export = GetMarkingCheckWorklistAccessStatusAction;