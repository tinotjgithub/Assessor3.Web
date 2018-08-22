import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for expand or collapase examiner node
 */
class ExpandOrCollapseNodeAction extends action {

    private _isExpanded: boolean;
    private _examinerRoleId: number;

    /**
     * constructor
     * @param examinerRoleId
     * @param isExpanded
     */
    constructor(examinerRoleId: number, isExpanded: boolean) {
        super(action.Source.View, actionType.EXPAND_OR_COLLAPSE_NODE);
        this._examinerRoleId = examinerRoleId;
        this._isExpanded = isExpanded;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{examinerRoleId}/g, examinerRoleId.toString()).
            replace(/{isExpanded}/g, isExpanded.toString());
    }

    /**
     *  Return the examiner roleId
     */
    public get examinerRoleId(): number {
        return this._examinerRoleId;
    }

    /**
     * Return true while expanding a node
     * Return false while closing a node
     */
    public get isExpanded(): boolean {
        return this._isExpanded;
    }

}

export = ExpandOrCollapseNodeAction;
