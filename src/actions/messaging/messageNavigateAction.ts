import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
/**
 * Action class for navigation from message panel
 */

class MessageNavigateAction extends action {

    private _messageNavigationArguments: MessageNavigationArguments;

    /**
     * constructor
     */
    constructor(messageNavigationArgument: MessageNavigationArguments) {
        super(action.Source.View, actionType.MESSAGE_NAVIGATE_ACTION);
            this._messageNavigationArguments = messageNavigationArgument;
    }

    /**
     * return the navigation arguments needed
     */
    public get messageNavigationArguments() {
        return this._messageNavigationArguments;
    }
}

export = MessageNavigateAction;