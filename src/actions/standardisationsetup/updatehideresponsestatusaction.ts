import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class UpdateHideResponseStatusAction extends action {

    private _displayID: string;
    private _isActiveStatus: boolean;

    /**
     * Constructore.
     * @param success
     * @param isHideStatusCompleted
     * @param displayId
     * @param isActiveStatus
     */
    constructor(success: boolean, isHideStatusCompleted: boolean, displayId: string, isActiveStatus: boolean) {
        super(action.Source.View, actionType.UPDATE_HIDE_RESPONSE_STATUS);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());

        this._displayID = displayId;
        this._isActiveStatus = isActiveStatus;
    }

    /**
     * returns the UpdatedResponseDisplayId
     */
    public get UpdatedResponseDisplayId(): string {
        return this._displayID;
    }

    /**
     * returns the UpdatedResponseHiddenStatus
     */
    public get UpdatedResponseHiddenStatus(): boolean {
        return !this._isActiveStatus;
    }
}
export = UpdateHideResponseStatusAction;
