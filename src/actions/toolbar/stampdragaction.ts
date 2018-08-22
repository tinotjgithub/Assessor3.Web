import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Class for Stamp Select Action
 */
class StampDragAction extends action {

    private _draggedStampId: number;
    private _isStampDragged: boolean;

    /**
     * Constructor StampDragAction
     * @param stampId
     * @param isDrag
     */
    constructor(stampId: number, isDrag: boolean) {
        super(action.Source.View, actionType.STAMP_DRAG);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', isDrag ? 'Drag stamp' : 'Drag end stamp' + stampId);
        this._draggedStampId = stampId;
        this._isStampDragged = isDrag;
    }

    /**
     * This method will return the Stamp ID
     */
    public get draggedStampId(): number {
        return this._draggedStampId;
    }

    /**
     * This method will return if a stamp is dragged or not
     */
    public get isStampDragged(): boolean {
        return this._isStampDragged;
    }
}

export = StampDragAction;