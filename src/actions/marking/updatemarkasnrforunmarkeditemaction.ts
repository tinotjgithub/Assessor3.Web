import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * The Action class to upadate mark as NR for unmarked mark scheme.
 */
class UpdateMarkAsNRForUnmarkedItemAction extends action {

    /**
     * Initializing a new instance.
     */
    constructor() {
        super(action.Source.View, actionType.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS);
    }

}

export = UpdateMarkAsNRForUnmarkedItemAction;