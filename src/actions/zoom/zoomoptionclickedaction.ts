import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class ZoomOptionClickedAction extends action {

    private _isZoomOptionOpen: boolean;

    /**
     * Constructor ZoomOptionClickedAction
     * @param isZoomOptionOpen
     */
    constructor(isZoomOptionOpen: boolean) {
        super(action.Source.View, actionType.ZOOM_OPTION_CLICKED_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', isZoomOptionOpen.toString());
        this._isZoomOptionOpen = isZoomOptionOpen;
    }

    /**
     * Get wether the zoom panel is open or closed.
     * @returns isZoomOptionOpen
     */
    public get isZoomOptionOpen(): boolean {
        return this._isZoomOptionOpen;
    }
}
export = ZoomOptionClickedAction;