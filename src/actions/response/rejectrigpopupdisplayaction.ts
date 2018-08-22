import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action class for Reject rig popup display action.
 */
class RejectRigPopUpDisplayAction extends action {

    /**
     * Constructor RejectRig pop up display action
     */
    constructor() {
        super(action.Source.View, actionType.REJECT_RIG_POPUP_DISPLAY_ACTION);
    }
}

export = RejectRigPopUpDisplayAction;