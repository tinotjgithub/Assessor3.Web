import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for exception panel actions
 */
class StopNavigateResponseAction extends action {

    /**
     * initialize instance for the donavigateresponseaction
     */
    constructor() {
        super(action.Source.View, actionType.EXCEPTION_STOP_NAVIGATE_RESPONSE);
    }
}

export = StopNavigateResponseAction;