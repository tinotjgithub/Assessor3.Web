import action = require('../base/action');
import actionType = require('../base/actiontypes');
/**
 * action class for storing Mark This Page number
 */
class SetMarkThisPageNumberAction extends action {
    private _markThisPageNumber: number;
    /**
     * Initializing a new instance of Set Mark This Page Number action.
     * @param markThisPageNumber
     */
    constructor(markThisPageNumber: number) {
        super(action.Source.View, actionType.MARK_THIS_PAGE_NUMBER);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', markThisPageNumber.toString());
        this._markThisPageNumber = markThisPageNumber;
    }

    /**
     * Get the number of Mark This Page
     */
    public get markThisPageNumber(): number {
        return this._markThisPageNumber;
    }
}
export = SetMarkThisPageNumberAction;