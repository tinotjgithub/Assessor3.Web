import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class IsLastNodeSelectedAction extends action {

    private _isLastNodeSelected: boolean;

    /**
     * Constructor
     * @param isLastNodeSelected
     */
    constructor(isLastNodeSelected: boolean) {
        super(action.Source.View, actionType.IS_LAST_NODE_SELECTED_ACTION);

        this._isLastNodeSelected = isLastNodeSelected;
    }

    public get isLastNodeSelected(): boolean {
        return this._isLastNodeSelected;
    }
}

export = IsLastNodeSelectedAction;