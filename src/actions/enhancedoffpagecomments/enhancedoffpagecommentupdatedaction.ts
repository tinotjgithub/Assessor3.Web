import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class EnhancedOffPageCommentUpdatedAction extends action {

  private _isEnhancedOffPageCommentEdited: boolean;

  constructor(isEnhancedOffPageCommentEdited: boolean) {
    super(action.Source.View, actionType.ENHANCED_OFF_PAGE_COMMENT_UPDATED_ACTION);
      this._isEnhancedOffPageCommentEdited = isEnhancedOffPageCommentEdited;
  }

  /**
   * Returns whether the enhanced off page comment is edited or not
   * @readonly
   * @private
   * @type {boolean}
   * @memberof EnhancedOffPageCommentUpdatedAction
   */
  public get isEnhanedOffPageCommentEdited(): boolean {
    return this._isEnhancedOffPageCommentEdited;
  }

}
export = EnhancedOffPageCommentUpdatedAction;
