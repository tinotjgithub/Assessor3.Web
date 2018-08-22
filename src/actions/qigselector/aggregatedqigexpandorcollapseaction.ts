import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class AggregatedQigExpandOrCollapse extends action {
    private _groupid: number;
    /**
     * Constructor of NavigateToWorklistFromQigSelectorAction
     */
    constructor(groupid: number) {
      super(action.Source.View, actionType.AGGREGATED_QIG_EXPAND_OR_COLLAPSE);
      this._groupid = groupid;
    }

  // Returns the QIG ID of the QIG whose data are to be fetched
  public get getGroupIdofSelectedQig(): number {
      return this._groupid;
    }
}
export = AggregatedQigExpandOrCollapse;
