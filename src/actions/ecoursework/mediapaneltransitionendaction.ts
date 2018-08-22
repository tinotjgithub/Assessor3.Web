import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for file list panel transition end event
 */
class MediaPanelTransitionEndAction extends action {

    /**
     * Constructor for FileList Panel Transition End Action     
     */
    constructor() {
        super(action.Source.View, actionType.MEDIA_PANEL_TRANSITION_END_ACTION);
    }
}
export = MediaPanelTransitionEndAction;