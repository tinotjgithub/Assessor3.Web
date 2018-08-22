import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Class for Enhanced offpage comment button action
 * @class EnhancedOffPageCommentButtonAction
 * @extends {action}
 */
class EnhancedOffPageCommentButtonAction extends action {

  private _enhancedOffPageCommentButtonAction: enums.EnhancedOffPageCommentAction;

  /**
   * Creates an instance of EnhancedOffPageCommentButtonAction.
   * @param {enums.EnhancedOffPageCommentButtonAction} enhancedOffPageCommentButtonAction 
   * @memberof EnhancedOffPageCommentButtonAction
   */
  constructor(enhancedOffPageCommentButtonAction: enums.EnhancedOffPageCommentAction) {
    super(action.Source.View, actionType.ENHANCED_OFF_PAGE_COMMENT_BUTTON_ACTION);
    this._enhancedOffPageCommentButtonAction = enhancedOffPageCommentButtonAction;
    this.auditLog.logContent = this.auditLog.logContent.replace(/{buttonAction}/g,
      enums.getEnumString(enums.EnhancedOffPageCommentAction, enhancedOffPageCommentButtonAction));
  }

  /**
   * Returns enhanced offpage comment button action
   * @readonly
   * @type {number}
   * @memberof EnhancedOffPageCommentButtonAction
   */
  public get EnhancedOffPageCommentButtonAction(): number {
     return this._enhancedOffPageCommentButtonAction;
  }

}

export = EnhancedOffPageCommentButtonAction;
