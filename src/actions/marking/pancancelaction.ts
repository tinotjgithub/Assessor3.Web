import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class PanCancelAction extends action {
  constructor() {
    super(action.Source.View, actionType.PAN_CANCEL_ACTION);
  }
}

export = PanCancelAction;
