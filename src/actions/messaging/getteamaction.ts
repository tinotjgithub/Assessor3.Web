import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import TeamReturn = require('../../stores/message/typings/teamreturn');

class GetTeamAction extends dataRetrievalAction {

    private _team: TeamReturn;
    private _examinerRoleId: number;

    /**
     * Constructor GetTeamAction
     * @param success
     * @param team
     * @param examinerRoleId
     */
    constructor(success: boolean, team: TeamReturn, examinerRoleId: number) {
        super(action.Source.View, actionType.GET_TEAM_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._team = team;
        this._examinerRoleId = examinerRoleId;
    }

    /**
     * get team
     */
    public get team(): TeamReturn {
        return this._team;
    }

    /**
     * get current examiner role id
     */
    public get examinerRoleId(): number {
        return this._examinerRoleId;
    }

}

export = GetTeamAction;
