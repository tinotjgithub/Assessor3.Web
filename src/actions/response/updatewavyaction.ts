import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Class for rerendering wavy annotations for maintaining uniformity in thickness.
 */
class UpdateWavyAction extends action {

    /**
     * Constructor UpdateWavyAction
     */
    constructor() {
        super(action.Source.View, actionType.UPDATE_WAVY_ANNOTATION_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
}

export = UpdateWavyAction;