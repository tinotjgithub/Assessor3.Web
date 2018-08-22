import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class OpenQigFromLockedListAction extends action {

    private _qigId: number;

    /**
     * Constructor for OpenQigFromLockedListAction
     * @param qigId
     */
    constructor(qigId: number) {
        super(action.Source.View, actionType.OPEN_QIG_FROM_LOCKED_LIST);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ qigId}/g,
            qigId.toString());
        this._qigId = qigId;
    }

    /**
     * Retrieves qig id
     */
    public get qigId(): number {
        return this._qigId;
    }

}

export = OpenQigFromLockedListAction;
