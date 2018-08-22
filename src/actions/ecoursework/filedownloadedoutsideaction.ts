import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action class for file downloaded outside action
 */
class FileDownloadedOutsideAction extends action {

    /**
     * constructor
     */
    constructor() {
        super(action.Source.View, actionType.FILE_DOWNLOADED_OUTSIDE_ACTION);
    }
}
export = FileDownloadedOutsideAction;