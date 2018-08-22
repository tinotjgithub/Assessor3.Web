import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ShowLocksInQigPopupAction extends action {

    private _doShowLocksInQigPopup: boolean;
    private _isFromLogout: boolean;
    /**
     * Constructor for ShowLocksInQigPopupAction
     * @param doShowLocksInQigPopup
     */
    constructor(doShowLocksInQigPopup: boolean, isFromLogout: boolean) {
        super(action.Source.View, actionType.SHOW_LOCKS_IN_QIG_POPUP);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ doShowLocksInQigPopup}/g,
            doShowLocksInQigPopup ? 'true' : 'false');
        this._doShowLocksInQigPopup = doShowLocksInQigPopup;
        this._isFromLogout = isFromLogout;
    }

    /**
     * Retrieves doShowLocksInQigPopup
     */
    public get doShowLocksInQigPopup(): boolean {
        return this._doShowLocksInQigPopup;
    }

    public get isShowLocksFromLogout(): boolean {
        return this._isFromLogout;
    }

}

export = ShowLocksInQigPopupAction;
