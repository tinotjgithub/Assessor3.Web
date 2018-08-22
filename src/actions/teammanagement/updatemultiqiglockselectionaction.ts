import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class UpdateMultiQigLockSelectionAction extends action {

    private _markSchemeGroupId: number;
    private _isSelectedAll: boolean;

    constructor(markSchemeGroupId: number, isSelectedAll: boolean) {
        super(action.Source.View, actionType.UPDATE_MULTI_QIG_LOCK_SELECTION);
        this._markSchemeGroupId = markSchemeGroupId;
        this._isSelectedAll = isSelectedAll;
        this.auditLog.logContent = this.auditLog.logContent.
            replace(/{ markSchemeGroupId}/g, markSchemeGroupId.toString());
    }

    public get markSchemeGroupId(): number {
        return this._markSchemeGroupId;
    }
    public get isSelectedAll(): boolean {
        return this._isSelectedAll;
    }

}

export = UpdateMultiQigLockSelectionAction;
