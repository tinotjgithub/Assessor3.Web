import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class MarkingCheckWorklistGetAction extends action {

    /**
     * Examiner id
     */
    private _examinerId: number;

    /**
     * Constructor
     * @param historyInfo
     */
    constructor(examinerId: number) {
        super(action.Source.View, actionType.MARKING_CHECK_EXAMINER_WORKLIST_GET);
        this._examinerId = examinerId;
    }

    /**
     * Examiner id to fetch the worklist
     */
    public get examinerId(): number {
        return this._examinerId;
    }
}

export = MarkingCheckWorklistGetAction;