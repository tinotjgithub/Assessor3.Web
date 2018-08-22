import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action class for setting change examiner status button busy
 */
class ChangeExaminerStatusButtonBusyStatusUpdateAction extends action {

    /**
     * constructor
     */
    constructor() {
        super(action.Source.View, actionType.SET_CHANGE_STATUS_BUTTON_BUSY_ACTION);
    }
}

export = ChangeExaminerStatusButtonBusyStatusUpdateAction;
