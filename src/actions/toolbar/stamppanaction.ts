import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Class for Stamp Touch Action
 */
class StampPanAction extends action {

    private _stampId: number;
    private _draggedAnnotationClientToken: string;

    /**
     * Constructor StampPanAction
     * @param stampId
     * @param draggedAnnotationClientToken
     */
    constructor(stampId: number, draggedAnnotationClientToken?: string) {
        super(action.Source.View, actionType.STAMP_PAN);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', stampId.toString());
        this._stampId = stampId;
        this._draggedAnnotationClientToken = draggedAnnotationClientToken;
    }

    /**
     * This method will return the Stamp ID
     */
    public get panStampId(): number {
        return this._stampId;
    }

    /**
     * Get currently dragged annotation client token
     */
    public get draggedAnnotationClientToken(): string {
        return this._draggedAnnotationClientToken;
    }
}

export = StampPanAction;