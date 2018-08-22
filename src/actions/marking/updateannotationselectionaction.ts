import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class UpdateAnnotationSelectionAction extends action {

    /**
     * 
     * variable for holding isSelected value.
     * @private
     * @type {boolean}
     * @memberof UpdateAnnotationSelectionAction
     */
    private _isSelected: boolean;

    /**
     * Creates an instance of UpdateAnnotationSelectionAction.
     * @param {boolean} isSelected 
     * @memberof UpdateAnnotationSelectionAction
     */
    constructor(isSelected: boolean) {
      super(action.Source.View, actionType.UPDATE_ANNOTATION_SELECTION);
      this._isSelected = isSelected;
      this.auditLog.logContent = this.auditLog.logContent.replace(/{isSelected}/g, isSelected.toString());
    }

    /**
     * Returns annotation needs to be selected or not
     * 
     * @readonly
     * @type {boolean}
     * @memberof UpdateAnnotationSelectionAction
     */
    public get isSelected(): boolean {
      return this._isSelected;
    }

}

export = UpdateAnnotationSelectionAction;
