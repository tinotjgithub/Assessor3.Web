import action = require('../base/action');
import actionType = require('../base/actiontypes');

class MarkByOptionClickedAction extends action {

    private _isMarkByOptionOpen: boolean;

    /**
     * Constructor MarkByOptionClickedAction
     * @param isMarkByOptionOpen
     */
    constructor(isMarkByOptionOpen: boolean) {
        super(action.Source.View, actionType.MARK_BY_OPTION_CLICKED_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', isMarkByOptionOpen.toString());
        this._isMarkByOptionOpen = isMarkByOptionOpen;
    }

    /**
     * Get wether the mark by panel is open or closed.
     * @returns isMarkByOptionOpen
     */
    public get isMarkByOptionOpen(): boolean {
        return this._isMarkByOptionOpen;
    }
}
export = MarkByOptionClickedAction;