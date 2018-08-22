import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class BookmarkGoBackButtonClickAction extends action {
    /**
     * Constructor BookmarkGoBackButtonClickAction
     */
    constructor() {
        super(action.Source.View, actionType.BOOKMARK_GO_BACK_BUTTON_CLICK_ACTION);
    }
}

export = BookmarkGoBackButtonClickAction;
