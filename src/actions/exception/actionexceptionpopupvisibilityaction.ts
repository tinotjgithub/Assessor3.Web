import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for exception action popup visibility.
 */
class ActionExceptionPopupVisibilityAction extends action {

    private _doVisiblePopup: boolean;
    private _exceptionActionType: enums.ExceptionActionType;

    /**
     * Constructor for the  exception action popup visibility
     * @param doVisiblePopup
     * @param exceptionActionType
     */
    constructor(doVisiblePopup: boolean, exceptionActionType: enums.ExceptionActionType) {
        super(action.Source.View, actionType.EXCEPTION_POPUP_VISIBILITY_ACTION);
        this._doVisiblePopup = doVisiblePopup;
        this._exceptionActionType = exceptionActionType;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, doVisiblePopup.toString());
    }

    /**
     * popup visibility status.
     */
    public get doVisiblePopup(): boolean {
        return this._doVisiblePopup;
    }

    /**
     * exception action type.
     */
    public get exceptionActionType(): enums.ExceptionActionType {
        return this._exceptionActionType;
    }
}

export = ActionExceptionPopupVisibilityAction;
