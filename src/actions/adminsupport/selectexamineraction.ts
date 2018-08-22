import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Class for Select Examiner Action
 */
class SelectExaminerAction extends action {

    private _selectedExaminerId: number;

    /**
     * Constructor SelectExaminerAction
     * @param examinerId
     */
    constructor(examinerId: number) {
        super(action.Source.View, actionType.SUPPORTLOGIN_EXAMINER_SELECTED);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', examinerId.toString());
        this._selectedExaminerId = examinerId;
    }

    /**
     * This method will return the examiner Id
     */
    public get examinerId(): number {
        return this._selectedExaminerId;
    }
}

export = SelectExaminerAction;