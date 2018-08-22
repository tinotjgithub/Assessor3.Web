import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for setting LHS exception panel open status.
 */
class ExceptionPanelClickedAction extends action {

    private _exceptionPanelOpen: boolean;

    /**
     * Constructor Exception panel open status.
     * @param panelStatus 
     */
    constructor(panelStatus: boolean) {
        super(action.Source.View, actionType.EXCEPTION_PANEL_CLICKED_ACTION);
        this._exceptionPanelOpen = panelStatus;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', panelStatus.toString());
    }

    /**
     * returns exception panel open status.
     */
    public get isExceptionSidePanelOpen(): boolean {
        return this._exceptionPanelOpen;
    }
}

export = ExceptionPanelClickedAction;