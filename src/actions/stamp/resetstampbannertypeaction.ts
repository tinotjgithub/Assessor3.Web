import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

// Reset stamp banner type
class ResetStampBannerTypeAction extends action {
  /**
   * Constructor
   */
  constructor() {
    super(action.Source.View, actionType.RESET_STAMP_BANNER_TYPE_ACTION);
  }
}

export = ResetStampBannerTypeAction;
