import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for resetting status of loading worklist
 */
class ResetDoLoadWorklistStatusAction extends action {

    // private variable for holding status for load examiner worklist
    private _doLoadCurrentExaminerWorklist: boolean;

    /**
     * Consturctor
     * @param doLoadCurrentExaminerWorklist
     */
    constructor(doLoadCurrentExaminerWorklist: boolean) {
        super(action.Source.View, actionType.RESET_DO_LOAD_WORKLIST_STATUS_ACTION);
        this._doLoadCurrentExaminerWorklist = doLoadCurrentExaminerWorklist;
    }

    /**
     *  Returns the status whether to load examiner worklist or dont
     */
    public get doLoadCurrentExaminerWorklist(): boolean {
        return this._doLoadCurrentExaminerWorklist;
    }
}

export = ResetDoLoadWorklistStatusAction;
