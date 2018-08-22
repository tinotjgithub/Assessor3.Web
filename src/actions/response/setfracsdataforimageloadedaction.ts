import action = require('../base/action');
import actionType = require('../base/actiontypes');
/**
 * Class for setting fracs data for response image loaded
 */
class SetFracsDataForImageLoadedAction extends action {
    /**
     * Initializing a new instance of set fracs data for image loaded action.
     */
    constructor() {
        super(action.Source.View, actionType.SET_FRACS_DATA_IMAGE_LOADED_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
}
export = SetFracsDataForImageLoadedAction;