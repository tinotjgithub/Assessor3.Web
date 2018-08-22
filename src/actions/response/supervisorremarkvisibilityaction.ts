import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for supervisor remark button visibility.
 */
class SupervisorRemarkVisibilityAction extends action {

    private _isVisible: boolean;

    /**
     * constructor
     * @param isVisible
     */
    constructor(isVisible: boolean) {
        super(action.Source.View, actionType.SUPERVISOR_REMARK_VISIBILITY_ACTION);
        this._isVisible = isVisible;
        this.auditLog.logContent = this.auditLog.logContent.replace
            (/{ isVisible}/g, isVisible.toString());
    }

    /**
     * Return supervisor remark button visibility status.
     */
    public get isVisible(): boolean {
        return this._isVisible;
    }

}

export = SupervisorRemarkVisibilityAction;
