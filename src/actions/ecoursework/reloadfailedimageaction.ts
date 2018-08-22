import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ReloadFailedImageAction extends action {

    /**
     * Constructor
     */
  constructor() {
    super(action.Source.View, actionType.RELOAD_FAILED_IMAGE);
  }
}

export = ReloadFailedImageAction;
