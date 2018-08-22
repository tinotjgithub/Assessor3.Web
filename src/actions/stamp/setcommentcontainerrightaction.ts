import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class SetCommentContainerRightAction extends action {
  private _right: number;
  /**
   * Creates an instance of setCommentContainerRightAction.
   *
   * @memberof setCommentContainerRightAction
   */
  constructor(right: number) {
    super(action.Source.View, actionType.SET_COMMENT_CONTAINER_RIGHT);
    this._right = right;
  }

/**
 * comment container right attribute
 *
 * @readonly
 * @type {number}
 * @memberof SetCommentContainerRightAction
 */
  public get commentContainerRight(): number {
    return this._right;
  }
}

export = SetCommentContainerRightAction;
