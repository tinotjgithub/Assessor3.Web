import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

/**
 * Action for updating marking progress.
 */
class UpdateMarkingProgressAction extends dataRetrievalAction {

    private _initialMarkingProgress: number;

    /**
     * Initializing a new instance of UpdateMarkingProgressAction.
     * @param {boolean} success
     */
    constructor(markingProgress: number, success: boolean) {
        super(action.Source.View, actionType.UPDATE_MARKING_PROGRESS, success);
        this._initialMarkingProgress = markingProgress;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markingProgress}/g, markingProgress.toString());
    }

    /**
     * getting iniial marking progress
     * @param {number} _initialMarkingProgress
     */
    public get initialMarkingProgress(): number {
        return this._initialMarkingProgress;
    }
}
export = UpdateMarkingProgressAction;