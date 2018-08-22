import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class CreateExaminerRoleForAdminRemarkerAction extends action {

    private examinerRoleId: number;

    /**
     * Constructor
     * @param examinerRoleId
     */
    constructor(examinerRoleId: number) {
        super(action.Source.View, actionType.CREATE_EXAMINER_ROLE_FOR_ADMIN_REMARKER);
        this.examinerRoleId = examinerRoleId;
    }

    public get selectedQIGExaminerRoleId(): number {
        return this.examinerRoleId;
    }
}
export = CreateExaminerRoleForAdminRemarkerAction;
