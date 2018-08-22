import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class SetCommentVisibilityAction extends action {

  // Holds a value to hide/show comment container.
  private _isvisible: boolean;

	/**
	 * Constructor 
	 * @param isvisible
	 */
  constructor(isvisible: boolean) {
	  super(action.Source.View, actionType.SET_COMMENT_VISIBILITY_ACTION);
	  this._isvisible = isvisible;
  }

  /**
   * Gets a value indiacting whether the comment container is visible.
   */
  public get isvisible(): boolean {
     return this._isvisible;
  }
}
export = SetCommentVisibilityAction;
