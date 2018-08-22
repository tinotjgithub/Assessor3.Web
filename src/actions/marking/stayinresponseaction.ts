import action = require('../base/action');
import actionType = require('../base/actiontypes');
/**
 * The Action class for disabling mbq popup.
 */
class StayInResponseAction extends action {
    constructor() {
        super(action.Source.View, actionType.STAY_IN_RESPONSE_ACTION);
    }
}
export = StayInResponseAction;
