import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import examinerStatusReturn = require('../../dataservices/teammanagement/typings/setexaminerstatusreturn');

/**
 * Action class for change examiner status
 */
class ChangeExaminerStatusAction extends action {

    private _success: boolean;
    private _examinerStatusReturn: examinerStatusReturn;

    /**
     * constructor
     * @param success
     * @param examinerStatusReturn
     */
    constructor(success: boolean, examinerstatusReturn: examinerStatusReturn) {
        super(action.Source.View, actionType.CHANGE_EXAMINER_STATUS);
        this._success = success;
        this._examinerStatusReturn = examinerstatusReturn;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', success.toString());
    }

    /**
     * Success status
     */
    public get success(): boolean {
        return this._success;
    }

    /**
     * Examiner status return
     */
    public get examinerStatusReturn(): examinerStatusReturn {
        return this._examinerStatusReturn;
    }

}

export = ChangeExaminerStatusAction;
