import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action for updating message priority
 */
class MandatoryMessageValidationPopupAction extends action {
    private _isDisplay: boolean;

    /**
     * constructor for the action object
     */
    constructor(isDisplay: boolean) {
        super(action.Source.View, actionType.MANDATORY_MESSAGE_VALIDATION_POPUP_ACTION);
        this._isDisplay = isDisplay;
    }

    /**
     * Get isDisplay value
     */
    public get isDisplay(): boolean {
        return this._isDisplay;
    }
}

export = MandatoryMessageValidationPopupAction;
