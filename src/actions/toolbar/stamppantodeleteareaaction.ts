import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Class for StampPanToDeleteAreaAction
 */
class StampPanToDeleteAreaAction extends action {

    private _canDelete: boolean;
    private _xPos: number;
    private _yPos: number;

    /**
     * Constructor StampPanToDeleteAreaAction
     * @param canDelete
     * @param xPos
     * @param yPos
     */
    constructor(canDelete: boolean, xPos: number, yPos: number) {
        super(action.Source.View, actionType.PAN_STAMP_TO_DELETED_AREA);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}',
            canDelete ? 'inside' : 'outside');
        this._canDelete = canDelete;
        this._xPos = xPos;
        this._yPos = yPos;
    }

    /**
     * This will return if the annotation can be deleted or not
     */
    public get canDelete(): boolean {
        return this._canDelete;
    }

    /**
     * This will return the X-Coordinate position of the cursor
     */
    public get xPos(): number {
        return this._xPos;
    }

    /**
     * This will return the Y-Coordinate position of the cursor
     */
    public get yPos(): number {
        return this._yPos;
    }
}

export = StampPanToDeleteAreaAction;