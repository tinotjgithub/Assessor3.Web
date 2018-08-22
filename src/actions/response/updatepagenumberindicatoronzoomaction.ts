import action = require('../base/action');
import actionType = require('../base/actiontypes');

/** Refreshing pagenoindicator UI while user changes zoom settings */
class UpdatePageNumberIndicatorOnZoomAction extends action {

    /**
     * Constructor UpdatePageNumberIndicatorOnZoomAction
     */
    constructor() {
        super(action.Source.View, actionType.REFRESH_PAGE_NO_INDICATOR);
    }
}

export = UpdatePageNumberIndicatorOnZoomAction;