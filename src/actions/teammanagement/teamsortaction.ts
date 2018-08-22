import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class TeamSortAction extends action {

  /**
   * sort details
   */
  private _sortDetails : TeamManagementSortDetails;

 /**
  * Consturctor
  * @param sortDetails
  */
  constructor(sortDetails : TeamManagementSortDetails) {
    super(action.Source.View, actionType.TEAM_SORT_ACTION);
    this._sortDetails = sortDetails;
  }

  /**
   * returns the sort details
   */
  public get sortDetails() : TeamManagementSortDetails {
    return this._sortDetails;
  }

}

export = TeamSortAction;
