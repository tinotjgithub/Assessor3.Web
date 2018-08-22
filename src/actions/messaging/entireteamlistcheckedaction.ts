import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class EntireteamlistcheckedAction extends action {

    private _isChecked: boolean;

    /**
     * Constructor EntireteamlistcheckedAction
     * @param isChecked
     */
    constructor(isChecked: boolean) {
        super(action.Source.View, actionType.ENTIRE_TEAM_LIST_CHECKED_ACTION);
        this._isChecked = isChecked;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, isChecked.toString());
    }

    /**
     * Get status if the entire team selected or not.
     */
    public get isChecked(): boolean {
        return this._isChecked;
    }
}
export = EntireteamlistcheckedAction;
