import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class HideReuseToggleAction extends action {

    private _isShowHiddenResponseSelected: boolean;
    /**
     * Hide Reuse Toggle action constructor
     */
    constructor(isShowHiddenResponseSelected: boolean) {
        super(action.Source.View, actionType.HIDE_REUSE_TOGGLE_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
        this._isShowHiddenResponseSelected = isShowHiddenResponseSelected;
    }

    /**
     * Get Show hidden response toggle status
     */
    public get ShowHiddenResponseSelected() {
        return this._isShowHiddenResponseSelected;
    }
}

export = HideReuseToggleAction;
