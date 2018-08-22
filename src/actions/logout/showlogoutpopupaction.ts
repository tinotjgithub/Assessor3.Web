import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for displaying logout confirmation popup.
 */
class ShowLogoutPopupAction extends action {

    /**
     * @constructor
     */
    constructor() {
        super(action.Source.View, actionType.SHOW_LOGOUT_POPUP_ACTION);
    }
}

export = ShowLogoutPopupAction;
