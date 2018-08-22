import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * The Action class to display Marke Change Reason Needed popup.
 */
class SetMarkChangeReasonVisibilityAction extends action {
    private _isMarkChangeReasonVisible: boolean;

    /**
     * Constructor
     * @param isMarkChangeReasonVisible
     */
    constructor(isMarkChangeReasonVisible: boolean) {
        super(action.Source.View, actionType.SET_MARK_CHANGE_REASON_VISIBILITY_ACTION);
        this._isMarkChangeReasonVisible = isMarkChangeReasonVisible;
        this.auditLog.logContent = this.auditLog.logContent;
    }

    /**
     * mark change reason visibility
     */
    public get isMarkChangeReasonVisible(): boolean {
        return this._isMarkChangeReasonVisible;
    }
}

export = SetMarkChangeReasonVisibilityAction;