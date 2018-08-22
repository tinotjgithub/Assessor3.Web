import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
/**
 * Action class for updating zoom on file list panel toggle
 */
class UpdateZoomOnToggleFileListPanelAction extends action {

   /**
    * Constructor for UpdateZoomOnToggleFileListPanelAction
    */
  constructor() {
    super(action.Source.View, actionType.UPDATE_ZOOM_ON_TOGGLE_FILE_LIST_PANEL);
  }
}
export = UpdateZoomOnToggleFileListPanelAction;
