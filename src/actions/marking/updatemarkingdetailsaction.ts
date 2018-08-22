import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * The Action class to update the marking details
 */
class UpdatemarkingdetailsAction extends action {

    private _markDetails: MarkDetails;
    private _isAllPagesAnnotated: boolean;
    private _markGroupId: number;

    /**
     * Initializing a new instance.
     */
    constructor(markDetails: MarkDetails, isAllPagesAnnotated: boolean, markGroupId?: number) {
        super(action.Source.View, actionType.UPDATE_MARKING_DETAILS);
        this._markDetails = markDetails;
        this._isAllPagesAnnotated = isAllPagesAnnotated;
        this._markGroupId = markGroupId;
    }

    /**
     * returns mark details.
     */
    public get markDetails(): MarkDetails {
        return this._markDetails;
    }

    /**
     * returns is All Pages Annotated flag.
     */
    public get isAllPagesAnnotated(): boolean {
        return this._isAllPagesAnnotated;
    }

    /**
     * returns markGroup identifier.
     */
    public get markGroupId(): number {
        return this._markGroupId;
    }
}
export = UpdatemarkingdetailsAction;
