import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Class for setting marking overlay visiblity.
 */
class MarkingOverlayVisiblityAction extends action {

    private _isMarkingOverlayVisible: boolean;

    /**
     * Constructor MarkingOverlayVisiblityAction
     * @param isVisible 
     */
    constructor(isVisible: boolean) {
        super(action.Source.View, actionType.MARKING_OVERLAY_VISIBLITY_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', isVisible.toString());
        this._isMarkingOverlayVisible = isVisible;
    }

    /**
     * This method will return the overlay visiblity status.
     */
    public get isMarkingOverlayVisible(): boolean {
        return this._isMarkingOverlayVisible;
    }
}

export = MarkingOverlayVisiblityAction;