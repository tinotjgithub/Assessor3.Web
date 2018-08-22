import action = require('../base/action');
import actionType = require('../base/actiontypes');

class UpdateOffPageVisibilityAction extends action {

    /**
     * Constructor UpdateOffPageVisibility
     *
     */
    constructor(){
        super(action.Source.View, actionType.UPDATE_OFFPAGE_VISIBILITY_STATUS_ACTION);
    }
}
export = UpdateOffPageVisibilityAction;