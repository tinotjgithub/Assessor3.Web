import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class NavigateToAction extends action {
    private _fragment: string;

    /**
     * Constructor
     * @param fragment
     */
    constructor(fragment: string) {
        super(action.Source.View, actionType.NAVIGATE_TO);
        this._fragment = fragment;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{url}/g, fragment);
    }

    public get getFragment(): string {
        return this._fragment;
    }
}

export = NavigateToAction;