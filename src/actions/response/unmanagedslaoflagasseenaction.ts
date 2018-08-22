import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for un managed SLAO flag as seen action.
 */
class UnManagedSlaoFlagAsSeenAction extends action {

    private _selectedPage: number;
    /**
     * Constructor UnManagedSlaoFlagAsSeenAction
     * @param pageNumber
     */
    constructor(pageNumber: number) {
        super(action.Source.View, actionType.UNMANAGED_SLAO_FLAG_AS_SEEN_ACTION);
        this._selectedPage = pageNumber;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{pageNumber}/g, pageNumber.toString());
    }

    /**
     * returns page number for flag as seen click in unmanaged slao.
     */
    public get selectedPage(): number {
        return this._selectedPage;
    }
}

export = UnManagedSlaoFlagAsSeenAction;