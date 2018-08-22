import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class RigNotFoundAction extends action {

    private _showRigNotFoundPopup: boolean;

 /**
  * Constructor of RigNotFoundAction
  * @param success
  * @param documentId
  * @param readStatus
  */
  constructor(showRigNotFoundPopup: boolean) {
    super(action.Source.View, actionType.RIG_NOT_FOUND_ACTION);
    this._showRigNotFoundPopup = showRigNotFoundPopup;
    this.auditLog.logContent = this.auditLog.logContent.
        replace(/{showRigNotFoundPopup}/g, showRigNotFoundPopup.toString());
  }

 /**
  * Retrieves Show or Hide popup
  */
  public get showRigNotFoundPopup(): boolean {
     return this._showRigNotFoundPopup;
  }
}
export = RigNotFoundAction;
