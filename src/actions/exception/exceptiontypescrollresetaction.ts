import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class ExceptionTypeScrollResetAction extends action {

  /**
   * Constructor
   */
  constructor() {
      super(action.Source.View, actionType.EXCEPTION_TYPE_SCROLL_RESET_ACTION);
    }
}
export = ExceptionTypeScrollResetAction;
