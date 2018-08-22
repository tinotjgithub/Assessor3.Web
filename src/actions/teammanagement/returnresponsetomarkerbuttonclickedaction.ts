import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for show the returnresponsetomarkerworklist confirmation popup.
 */
class ReturnResponseToMarkerButtonClickedAction extends action {

    constructor() {
        super(action.Source.View, actionType.RETURN_RESPONSE_TO_MARKER_BUTTON_CLICKED_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
}

export = ReturnResponseToMarkerButtonClickedAction;