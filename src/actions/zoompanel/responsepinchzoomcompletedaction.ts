import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class ResponsePinchZoomCompletedAction extends action {

    private _zoomedWidth: number;

    /**
     * Intitializing a new instance of response pinch zoom completed action
     * @param {number} zoomedWidth
     */
    constructor(zoomedWidth: number) {
        super(action.Source.View, actionType.RESPONSEPINCHZOOMCOMPLETED);
        this._zoomedWidth = zoomedWidth;
    }

    /**
     * Gets a value indicating the zoomed width of the marksheet-view-holder
     * after pinch.
     * @returns pinched zoom
     */
    public get zoomedWidth(): number {
        return this._zoomedWidth;
    }
}
export = ResponsePinchZoomCompletedAction;
