import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for setting LHS  message panel open status.
 */
class MessagePanelClickedAction extends action {

    private _messagePanelStatus: boolean;

    /**
     * Constructor Message panel open status.
     * @param panelStatus 
     */
    constructor(panelStatus: boolean) {
        super(action.Source.View, actionType.MESSAGE_PANEL_CLICKED_ACTION);
        this._messagePanelStatus = panelStatus;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', panelStatus.toString());
    }

    /**
     * returns message panel open status.
     */
    public get isMessageSidePanelOpen(): boolean {
        return this._messagePanelStatus;
    }
}

export = MessagePanelClickedAction;
