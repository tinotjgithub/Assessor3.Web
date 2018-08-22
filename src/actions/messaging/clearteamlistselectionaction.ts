import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ClearTeamListSelectionAction extends action {

    private _examinerRoleId: number;

    /**
     * Constructor ClearTeamListSelectionAction
     * @param examinerRoleId
     */
    constructor(examinerRoleId: number) {
        super(action.Source.View, actionType.CLEAR_TEAM_LIST_SELECTION_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
        this._examinerRoleId = examinerRoleId;
    }

    /**
     * get current examiner role id
     */
    public get examinerRoleId(): number {
        return this._examinerRoleId;
    }

}
export = ClearTeamListSelectionAction;
