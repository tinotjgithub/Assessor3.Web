import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * action class using for switching between comments from mark scheme dropdown
 * @class SwitchEnhancedOffPageCommentsAction
 * @extends {action}
 */
class SwitchEnhancedOffPageCommentsAction extends action {

  /**
   * action for showing discard message
   * @private
   * @type {boolean}
   * @memberof SwitchEnhancedOffPageCommentsAction
   */
  private _showDiscardPopup: boolean;

  /**
   * Creates an instance of SwitchEnhancedOffPageCommentsAction.
   * @param {boolean} isCommentEdited 
   * @memberof SwitchEnhancedOffPageCommentsAction
   */
    constructor(showDiscardPopup: boolean) {
        super(action.Source.View, actionType.SWITCH_ENHANCED_OFF_PAGE_COMMENTS);
        this._showDiscardPopup = showDiscardPopup;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{showDiscardPopup}/g, showDiscardPopup.toString());
    }

    /**
     * show discard popup
     * @readonly
     * @type {boolean}
     * @memberof SwitchEnhancedOffPageCommentsAction
     */
    public get showDiscardPopup(): boolean {
      return this._showDiscardPopup;
    }

}

export = SwitchEnhancedOffPageCommentsAction;
