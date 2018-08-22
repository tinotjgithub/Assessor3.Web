import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class RemoveHistoryItemAction extends action {

    private _qigId: number;
    private _doRemoveTeamObject: boolean;

    /**
     * Constructor
     * @param qigId
     * @param doRemoveTeamObject
     */
    constructor(qigId: number, doRemoveTeamObject: boolean) {
        super(action.Source.View, actionType.REMOVE_HISTORY_ITEM_ACTION);
        this._qigId = qigId;
        this._doRemoveTeamObject = doRemoveTeamObject;
    }

    /**
     * Returns the qig id
     */
    public get qigId(): number {
        return this._qigId;
    }

    /**
     * indicates whether team object needs to be removed
     */
    public get doRemoveTeamObject(): boolean {
        return this._doRemoveTeamObject;
    }

}

export = RemoveHistoryItemAction;
