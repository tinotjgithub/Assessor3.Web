import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import teamoverviewdetails = require('../../dataservices/teammanagement/typings/teamoverviewdetails');

class GetTeamOverviewDataAction extends dataRetrievalAction {

    /**
     * The private variable to hold the team Overview Data
     */
    private _teamOverviewCountData: teamoverviewdetails;
    private _isFromRememberQig: boolean;
    private _isHelpExaminersDataRefreshRequired: boolean;

    /**
     * COnstructor for the Team overview action
     * @param success
     * @param markSchemeGroupId
     * @param examinerRoleId
     * @param teamOverviewCount
     * @param isFromRememberQig
     * @param isHelpExaminersDataRefreshRequired
     */
    constructor(success: boolean,
        markSchemeGroupId: number,
        examinerRoleId: number,
        teamOverviewCount: teamoverviewdetails,
        isFromRememberQig: boolean,
        isHelpExaminersDataRefreshRequired: boolean
    ) {
        super(action.Source.View, actionType.GET_TEAM_OVERVIEW_DATA_FETCH_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace('{examinerRoleId}',
            examinerRoleId.toString()).replace('{markSchemeGroupId}',
            markSchemeGroupId.toString());
        if (success) {
            this._teamOverviewCountData = teamOverviewCount;
            this._isFromRememberQig = isFromRememberQig;
            this._isHelpExaminersDataRefreshRequired = isHelpExaminersDataRefreshRequired;
        } else {
            this._teamOverviewCountData = undefined;
        }
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', success.toString());
    }

   /**
    * The getter method for giving back the team overview Counts
    */
    public get teamOverviewCountData(): teamoverviewdetails {
        return this._teamOverviewCountData;
    }

   /**
    * returns true if call is from remember qig
    */
    public get isFromRememberQig(): boolean {
        return this._isFromRememberQig;
    }

    /**
     * returns true when the help examiners data refresh is required when count is loaded
     */
    public get isHelpExaminersDataRefreshRequired(): boolean {
        return this._isHelpExaminersDataRefreshRequired;
    }
}
export = GetTeamOverviewDataAction;
