import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for Team Management Left Main Link Selection
 */
class TeamManagementTabSelectAction extends action {

    private _selectedTab: enums.TeamManagement;

    /**
     * constructor
     * @selectedTab The type of Team Management Tab
     */
    constructor(selectedTab: enums.TeamManagement) {
        super(action.Source.View, actionType.TEAM_MANAGEMENT_TAB_CLICK_ACTION);
        this._selectedTab = selectedTab;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{selectedTab}/g, selectedTab.toString());
    }

    /**
     * Get the team Management Link Type
     */
    public get selectedTab(): enums.TeamManagement {
        return this._selectedTab;
    }
}
export = TeamManagementTabSelectAction;