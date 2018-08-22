import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action class for clearing the courseworkfile data
 */
class ClearEcourseworkDataAction extends action {
    constructor() {
        super(action.Source.View, actionType.CLEAR_COURSEWORK_DATA_ACTION);
    }
}

export = ClearEcourseworkDataAction;