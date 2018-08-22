import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Class for Stamp Panel Action
 */
class StampPanelAction extends action {

    private _isStampPanelExpanded: boolean;

    /**
     * Constructor StampPanelAction
     * @param isStampPanelExpanded
     */
    constructor(isStampPanelExpanded: boolean) {
        super(action.Source.View, actionType.STAMP_PANEL_MODE_CHANGED);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, 'true');
        this._isStampPanelExpanded = isStampPanelExpanded;
    }

    /**
     * This method will return whether the stamp panel is expanded/collapsed
     */
    public get isStampPanelExpanded(): boolean {
        return this._isStampPanelExpanded;
    }
}

export = StampPanelAction;