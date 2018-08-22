import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * The Action class to notify Response id rendered in response screen header
 */
class ResponseIdRenderedAction extends action {

  /**
   * Initializing a new instance of response search action.
   */
  constructor() {
    super(action.Source.View, actionType.RESPONSE_ID_RENDERED_ACTION);
  }
}

export = ResponseIdRenderedAction;
