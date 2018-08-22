import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class ZoomUpdatedAction extends action {

    private _zoomPercentage: number;

    /**
     * Constructor ZoomUpdatedAction
     * @param zoomPercentage
     */
    constructor(zoomPercentage: number) {
        super(action.Source.View, actionType.ZOOM_UPDATED_ACTION);
        this._zoomPercentage = zoomPercentage;
    }

    /**
     * Get the zoom percentage.
     * @returns updated zoom percentage
     */
    public get zoomPercentage(): number {
        return this._zoomPercentage;
    }
}
export = ZoomUpdatedAction;