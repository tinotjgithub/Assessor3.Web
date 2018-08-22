import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action for updating message priority
 */
class UpdateMessagePriorityAction extends action {
    /**
     * constructor for the action object
     */
    constructor() {
        super(action.Source.View, actionType.UPDATE_MESSAGE_PRIORITY_ACTION);
    }
}

export = UpdateMessagePriorityAction;
