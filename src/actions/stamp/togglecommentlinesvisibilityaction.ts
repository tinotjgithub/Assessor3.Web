import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ToggleCommentLinesVisibilityAction extends action {
  private _hideLines: boolean = false;
  private _hideBoxes: boolean = false;
  /**
   * Creates an instance of ToggleCommentLinesVisibilityAction.
   *
   * @memberof ToggleCommentLinesVisibilityAction
   */
  constructor(hideLines: boolean, hideBoxes: boolean) {
    super(action.Source.View, actionType.TOGGLE_COMMENT_LINES_VISIBILITY);
    this._hideLines = hideLines;
	this._hideBoxes = hideBoxes;
  }

  /**
   * Flag to whether hide Lines or Not
   */
  public get hideLines(): boolean {
      return this._hideLines;
  }

  /**
   * Flag to whether hide Lines or Not
   */
  public get hideBoxes(): boolean {
      return this._hideBoxes;
  }
}

export = ToggleCommentLinesVisibilityAction;
