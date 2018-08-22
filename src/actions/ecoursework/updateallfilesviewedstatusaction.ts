import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

 /**
  * Action class for updating all files viewed status
  */
class UpdateAllFilesViewedStatusAction extends action {

  /**
   * constructor
   */
  constructor() {
    super(action.Source.View, actionType.UPDATE_ALL_FILES_VIEWED_STATUS);
  }
}

export = UpdateAllFilesViewedStatusAction;
