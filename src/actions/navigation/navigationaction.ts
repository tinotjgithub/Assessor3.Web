import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class NavigationAction extends action {
    private _fragment: string;

    /**
     * Constructor
     * @param fragment
     */
    constructor(fragment: string) {
        super(action.Source.View, actionType.HASH_CHANGED_EVENT);
        this._fragment = fragment;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{url}/g, fragment);
    }

    public get getFragment(): string {
        return this._fragment;
    }
}

export = NavigationAction;