import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action for getting mark check requested examiners
 */
class GetMarkCheckExaminersAction extends dataRetrievalAction {

    private _markCheckExaminersData: MarkingCheckExaminersList;

  /**
   * Constructor for Getting mark check requested examiners
   */
    constructor(success: boolean, markCheckExaminersData: MarkingCheckExaminersList) {
        super(action.Source.View, actionType.GET_MARK_CHECK_EXAMINERS , success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._markCheckExaminersData = markCheckExaminersData;
    }

  /**
   * Gets mark check requested examiners
   */
  public get markCheckExaminersData(): MarkingCheckExaminersList {
     return this._markCheckExaminersData;
    }

}

export = GetMarkCheckExaminersAction;
