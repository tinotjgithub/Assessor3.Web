import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ToggleRequestMarkingCheckButtonAction extends action {

    private _doDisable: boolean;

    /**
     * Constructor for toggle request mark check button
     */
    constructor(doDisable: boolean) {
        super(action.Source.View, actionType.TOGGLE_REQUEST_MARKING_CHECK_BUTTON_ACTION);
        this._doDisable = doDisable;
    }

    /**
     * Gets the disable status
     */
    public get doDisable(): boolean {
        return this._doDisable;
    }

}

export = ToggleRequestMarkingCheckButtonAction;
