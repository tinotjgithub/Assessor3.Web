import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class HideZoomPanelAction extends action {
    /**
     * Constructor HideZoomPanelAction
     */
    constructor() {
        super(action.Source.View, actionType.HIDE_ZOOM_PANEL);
    }
}

export = HideZoomPanelAction;
