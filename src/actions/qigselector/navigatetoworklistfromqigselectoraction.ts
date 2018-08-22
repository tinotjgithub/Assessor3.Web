import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class NavigateToWorklistFromQigSelectorAction extends action {
    /**
     * Constructor of NavigateToWorklistFromQigSelectorAction
     */
  constructor() {
    super(action.Source.View, actionType.NAVIGATE_TO_WORKLIST_FROM_QIG_SELECTOR_ACTION);
  }
}
export = NavigateToWorklistFromQigSelectorAction;
