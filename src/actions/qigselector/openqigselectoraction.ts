import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

class OpenQigSelectorAction extends action {

    private selectedQigId: number;

    /**
     * Constructor
     * @param userActionType
     */
    constructor(userActionType: string) {
        super(action.Source.View, userActionType);
    }
}

export = OpenQigSelectorAction;