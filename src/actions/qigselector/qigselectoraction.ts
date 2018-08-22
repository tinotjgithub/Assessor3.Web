import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import enums = require('../../components/utility/enums');
import actionType = require('../base/actiontypes');

class QigSelectorAction extends action {

    private _selectedQigId: number;
    private _dispatchEvent: boolean;
    private _isFromHistory: boolean;

    /**
     * Constructor QigSelectorAction
     * @param qigId
     * @param dispatchEvent
     * @param isFromHistory
     */
    constructor(qigId: number, dispatchEvent: boolean, isFromHistory: boolean) {
        super(action.Source.View, actionType.MARK);
        this._selectedQigId = qigId;
        this._dispatchEvent = dispatchEvent;
        this._isFromHistory = isFromHistory;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{selectedQIG}/g, this.getSelectedQigId.toString());
    }

    /**
     * Retruns the selected Qig ID
     */
    public getSelectedQigId(): number {
        return this._selectedQigId;
    }

   /**
    * Returns true if event emit required else return false
    */
    public get dispatchEvent(): boolean {
        return this._dispatchEvent;
    }

   /**
    * Returns true if it is from history
    */
    public get isFromHistory(): boolean {
        return this._isFromHistory;
    }
}

export = QigSelectorAction;