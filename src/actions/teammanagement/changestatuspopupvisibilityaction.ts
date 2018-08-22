import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for change examiner status popup visibility.
 */
class ChangeStatusPopupVisibilityAction extends action {

    private _doVisiblePopup: boolean;

    /**
     * constructor
     * @param doVisiblePopup
     */
    constructor(doVisiblePopup: boolean) {
        super(action.Source.View, actionType.CHANGE_STATUS_POPUP_VISIBILITY_ACTION);
        this._doVisiblePopup = doVisiblePopup;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, doVisiblePopup.toString());
    }

    /**
     * popup visibility status.
     */
    public get doVisiblePopup(): boolean {
        return this._doVisiblePopup;
    }

}

export = ChangeStatusPopupVisibilityAction;
