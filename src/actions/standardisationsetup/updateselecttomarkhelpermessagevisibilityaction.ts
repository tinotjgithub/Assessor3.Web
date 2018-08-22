import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class UpdateSelectToMarkHelperMessageVisibilityAction extends action {

    private _isVisible: boolean;

    /**
     * Constructore.
     * @param success
     * @param isVisible
     */
    constructor(isVisible: boolean) {
        super(action.Source.View, actionType.UPDATE_SELECTTOMARK_HELPER_MESSAGE_VISIBILITY);
        this._isVisible = isVisible;
    }

    public get isHelperMessageVisible() {
        return this._isVisible;
    }
}
export = UpdateSelectToMarkHelperMessageVisibilityAction;
