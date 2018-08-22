import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class SwitchUserButtonClickAction extends action {

    /**
     * Constructor SwitchUserButtonClickAction
     * @param userInfoPanelOpen
     */
    constructor() {
        super(action.Source.View, actionType.SWITCH_USER_BUTTON_CLICK);
    }
}
export = SwitchUserButtonClickAction;