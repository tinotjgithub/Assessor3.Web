import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for retrieving MyTeam data
 */
class MyTeamDataFetchAction extends dataRetrievalAction {

    private _myTeamDataList: Immutable.List<ExaminerData>;
    private _isFromHistory: boolean;

    /**
     * constructor
     * @param success
     * @param myTeamDataList
     * @param isFromHistory
     * @param failureCode
     */
    constructor(success: boolean, myTeamDataList: Immutable.List<ExaminerData>,
        isFromHistory: boolean) {
        super(action.Source.View, actionType.MY_TEAM_DATA_FETCH, success);
        this._myTeamDataList = myTeamDataList;
        this._isFromHistory = isFromHistory;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    /**
     * Returns my team data
     */
    public get myTeamData(): Immutable.List<ExaminerData> {
        return this._myTeamDataList;
    }

    /**
     * Returns true if it is from history
     */
    public get isFromHistory(): boolean {
        return this._isFromHistory;
    }
}

export = MyTeamDataFetchAction;
