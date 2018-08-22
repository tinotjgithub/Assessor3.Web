import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Class for Stamp Select Action
 */
class StampSelectAction extends action {

    private _selectedStampId: number;
    private _isStampSelected: boolean;

    /**
     * Constructor StampSelectAction
     * @param selectedStampId
     * @param isSelected
     */
    constructor(selectedStampId: number, isSelected: boolean) {
        super(action.Source.View, actionType.STAMP_SELECTED);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}',
            isSelected ? 'Selected stamp' : 'Deselected stamp' + selectedStampId.toString());
        this._selectedStampId = selectedStampId;
        this._isStampSelected = isSelected;
    }

    /**
     * This method will return the selected Stamp ID
     */
    public get selectedStampId(): number {
        return this._selectedStampId;
    }

    /**
     * This method will return if a stamp is selected or not
     */
    public get isStampSelected(): boolean {
        return this._isStampSelected;
    }
}

export = StampSelectAction;