import action = require('../base/action');
import actionType = require('../base/actiontypes');

class NotifyConcurrentSessionActive extends action {

    /**
     * constructor
     */
    constructor() {
        super(action.Source.View, actionType.NOTIFY_CONCURRENT_SESSION_ACTIVE);
    }
}
export = NotifyConcurrentSessionActive;
