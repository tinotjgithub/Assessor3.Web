import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * The Action class for notifying mark updated event.
 */
class MarkEditedAction extends action {

    /* flag is to indicate whether the current mark is updated or not */
    private _isEdited: boolean;

    /**
     * Constructor
     */
    constructor(isEdited: boolean) {
        super(action.Source.View, actionType.MARK_EDITED);
        this._isEdited = isEdited;
        this.auditLog.logContent = this.auditLog.logContent;
    }

    /**
     * returns true if mark updated
     * @returns
     */
    public get isEdited(): boolean {
        return this._isEdited;
    }
}

export = MarkEditedAction;