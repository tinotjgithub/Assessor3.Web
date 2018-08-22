import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

class ToggleMarkingCheckModeAction extends action {

    /**
     * The value for marking check mode
     */
    private _markingCheckModeValue: boolean;

    /**
     * Constructor for toggling the marking check mode action
     */
    constructor(markingCheckModeValue: boolean) {
        super(action.Source.View, actionType.TOGGLE_MARKING_CHECK_MODE);
        this._markingCheckModeValue = markingCheckModeValue;
    }

    /**
     * Gets a value to set the marking check mode
     */
    public get MarkingCheckModeValue(): boolean {

        return this._markingCheckModeValue;
    }
}

export = ToggleMarkingCheckModeAction;