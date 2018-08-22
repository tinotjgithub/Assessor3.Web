import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class UpdateselectedteamlistAction extends action {

    private _isSaved: boolean;

    /**
     * Constructor UpdatetoaddresslistactionAction
     * @param isSaved
     */
    constructor(isSaved: boolean) {
        super(action.Source.View, actionType.UPDATE_SELECTED_TEAM_LIST_ACTION);
        this._isSaved = isSaved;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, isSaved.toString());
    }

    /**
     * Get status if the selected team is saved in the store or not.
     */
    public get isSaved(): boolean {
        return this._isSaved;
    }
}
export = UpdateselectedteamlistAction;
