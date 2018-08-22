import action = require('../base/action');
import actionType = require('../base/actiontypes');

class SetMarkEntryTextboxFocusAction extends action {

    /**
     * Constructor SetMarkEntryTextboxFocusAction
     */
    constructor() {
        super(action.Source.View, actionType.SET_MARKENTRY_TEXTBOX_FOCUS_ACTION);
    }
}

export = SetMarkEntryTextboxFocusAction;