import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * action class for pinch to zoom
 */
class PinchZoomAction extends action {

    private _isPinchZooming: boolean;

    /**
     * Constructor PinchZoomAction
     * @param isPinchZooming
     */
    constructor(isPinchZooming: boolean) {
        super(action.Source.View, actionType.PINCH_ZOOM);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', isPinchZooming.toString());
        this._isPinchZooming = isPinchZooming;
    }

    /*pinch to zoom enabled or not*/
    public get isPinchZooming(): boolean {
        return this._isPinchZooming;
    }
}
export = PinchZoomAction;