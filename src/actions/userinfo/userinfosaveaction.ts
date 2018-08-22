import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

/**
 *
 * @param {boolean} success
 */
class UserInfoSaveAction extends dataRetrievalAction {

    private emailSaveSucess: boolean;
    private examinerEmail: ExaminerEmailArgument;
    /**
     * Initializing a new instance of UserInfo Argument.
     * @param {boolean} success
     */
    constructor(success: boolean, examinerEmailArgument: ExaminerEmailArgument) {
        super(action.Source.View, actionType.USERINFO_SAVE, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this.emailSaveSucess = success;
        this.examinerEmail = examinerEmailArgument;
    }

    public get getSaveSuccess(): boolean {
        return this.emailSaveSucess;
    }
    public get getExaminerInfo(): ExaminerEmailArgument {
        return this.examinerEmail;
    }
}
export = UserInfoSaveAction;