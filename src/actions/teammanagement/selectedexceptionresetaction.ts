import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for reset the selected exception.
 */
class SelectedExceptionResetAction extends action {

    private _isResetSelection: boolean;

    /**
     * constructor.
     * @param isResetSelection
     */
    constructor(isResetSelection: boolean) {
        super(action.Source.View, actionType.SELECTED_EXCEPTION_RESET_ACTION);
        this._isResetSelection = isResetSelection;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ resetstatus}/g, isResetSelection.toString());
    }

    /**
     * Reset exception selection.
     */
    public get isResetSelection(): boolean {
        return this._isResetSelection;
    }

}

export = SelectedExceptionResetAction;
