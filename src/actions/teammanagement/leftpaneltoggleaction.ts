import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

/**
 * Action for Team Management Left Panel Toggle Save
 */
class LeftPanelToggleAction extends action {

    private _isLeftPanelCollapsed: boolean;

    /**
     * Constructor for the leftpanel toggle action
     * @param isLeftPanelCollapsed boolean value indicating whether the panel is in collapsed state or not.
     */
    constructor(isLeftPanelCollapsed: boolean) {
        super(action.Source.View, actionType.TEAM_MANAGEMENT_LEFT_PANEL_TOGGLE);
        this._isLeftPanelCollapsed = isLeftPanelCollapsed;
        this.auditLog.logContent = this.auditLog.logContent.replace('{UserAction}', isLeftPanelCollapsed ? 'Hide Panel' : 'Show Panel');
    }

    /**
     * Gets the left panel collapsed status
     */
    public get isLeftPanelCollapsed(): boolean {

        return this._isLeftPanelCollapsed;
    }
}
export = LeftPanelToggleAction;