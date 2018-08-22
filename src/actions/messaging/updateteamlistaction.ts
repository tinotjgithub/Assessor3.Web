import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class UpdateTeamListAction extends action {

    private _examinerRoleId: number;
    private _isExpand: boolean;

    /**
     * Constructor UpdateTeamListAction
     * @param examinerRoleId
     * @param isExpand
     */
    constructor(examinerRoleId: number, isExpand: boolean) {
        super(action.Source.View, actionType.UPDATE_TEAM_LIST_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
        this._examinerRoleId = examinerRoleId;
        this._isExpand = isExpand;
    }

    /**
     * get expanded
     */
    public get isExpand(): boolean {
        return this._isExpand;
    }

    /**
     * get current examiner role id
     */
    public get examinerRoleId(): number {
        return this._examinerRoleId;
    }

}

export = UpdateTeamListAction;
