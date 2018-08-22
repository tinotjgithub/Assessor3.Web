import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ResetSearchResponseAction extends action {
  constructor() {
    super(action.Source.View, actionType.RESET_SEARCH_RESPONSE_ACTION);
  }
}

export = ResetSearchResponseAction;
