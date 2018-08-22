import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
/**
 * Class for inform the submit navigation
 */
class NavigateAfterSubmitAction extends action {

    /**
     * Holds the submitted mark group id's
     * 
     * @private
     * @type {Array<number>}
     * @memberof NavigateAfterSubmitAction
     */
    private _submittedMarkGroupIds: Array<number>;

    private _selectedDisplayId: string;

    private _fromMarkScheme: boolean;

    /**
     * Initializing a new instance of NavigateAfterSubmitAction class
     */
    constructor(submittedMarkGroupIds: Array<number>, selectedDisplayId: string, fromMarkScheme: boolean) {
        super(action.Source.View, actionType.NAVIGATE_AFTER_SUBMIT_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
        this._submittedMarkGroupIds = submittedMarkGroupIds;
        this._selectedDisplayId = selectedDisplayId;
        this._fromMarkScheme = fromMarkScheme;
    }

    /**
     * Submitted mark group Ids.
     * 
     * @readonly
     * @memberof NavigateAfterSubmitAction
     */
    public get submittedMarkGroupIds() {
        return this._submittedMarkGroupIds;
    }

    /**
     * selectedDisplayId
     * 
     * @readonly
     */
    public get selectedDisplayId() {
        return this._selectedDisplayId;
    }

    /**
     * is from markscheme
     * 
     * @readonly
     */
    public get isFromMarkScheme() {
        return this._fromMarkScheme;
    }
}
export = NavigateAfterSubmitAction;
