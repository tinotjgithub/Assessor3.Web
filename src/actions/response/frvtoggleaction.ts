import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * The Action class for FRV toggle button.
 */
class FullResponseViewToggleButtonAction extends action {


    /**
     * Initializing a new instance of FRV Toggle button action.
     */
    constructor() {
        super(action.Source.View, actionType.FRV_TOGGLE_BUTTON_ACTION);
    }
}
export = FullResponseViewToggleButtonAction;