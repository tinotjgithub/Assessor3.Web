import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class RemoveMarkEntrySelectionAction extends action {

    /**
     * Constructor
     */
    constructor() {
        super(action.Source.View, actionType.REMOVE_MARK_ENTRY_SELECTION);
    }
}

export = RemoveMarkEntrySelectionAction;
