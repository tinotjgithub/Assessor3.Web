import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for storing examiner drill down information
 */
class UpdateExaminerDrillDownDataAction extends action {

    // examiner drill down data
    private _examinerDrillDownData: ExaminerDrillDownData;
    private _isFromHistory: boolean;

    /**
     * constructor
     * @param examinerDrillDownData
     * @param isFromHistory
     */
    constructor(examinerDrillDownData: ExaminerDrillDownData, isFromHistory: boolean) {
        super(action.Source.View, actionType.UPDATE_EXAMINER_DRILL_DOWN_DATA);
        this._examinerDrillDownData = examinerDrillDownData;
        this._isFromHistory = isFromHistory;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{examinerId}/g, examinerDrillDownData.examinerId.toString()).
            replace(/{examinerRoleId}/g, examinerDrillDownData.examinerRoleId.toString());
    }

   /**
    * Returns the examiner drill down information
    */
    public get examinerDrillDownData(): ExaminerDrillDownData {
        return this._examinerDrillDownData;
    }

   /**
    * Returns true if it is from history
    */
    public get isFromHistory(): boolean {
        return this._isFromHistory;
    }

}

export = UpdateExaminerDrillDownDataAction;
