import action = require('../base/action');
import actionType = require('../base/actiontypes');

class MarkChangeReasonUpdateAction extends action {
    private _markChangeReason: string;

    /**
     * Constructor
     * @param markChangeReason
     */
    constructor(markChangeReason: string) {
        super(action.Source.View, actionType.MARK_CHANGE_REASON_UPDATE_ACTION);
        this._markChangeReason = markChangeReason;
        this.auditLog.logContent = this.auditLog.logContent
            .replace('{0}', markChangeReason);
    }

    /**
     * Get markChangeReason
     */
    public get markChangeReason(): string {
        return this._markChangeReason;
    }
}

export = MarkChangeReasonUpdateAction;