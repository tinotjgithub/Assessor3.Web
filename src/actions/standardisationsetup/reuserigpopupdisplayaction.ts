import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action class for display popup when ReuseRIG action triggered
 */
class ReuseRigPopupDisplayAction extends action {

    private _displayId: string;

    /**
     * Constructor for ReuseRigpopup action 
     * @param displayId Selected DisplayId
     */
    constructor(displayId: string) {
        super(action.Source.View, actionType.REUSE_RIG_POPUP_DISPLAY_ACTION);
        this._displayId = displayId;
    }

    /**
     * Get DisplayID bind in this action
     */
    public get getDisplayId() {
        return this._displayId;
    }
}
export = ReuseRigPopupDisplayAction;