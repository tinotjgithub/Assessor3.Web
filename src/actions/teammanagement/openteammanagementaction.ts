import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for Team Management Open
 */
class OpenTeamManagementAction extends action {

    private _examinerRoleId: number;
    private _markSchemeGroupId: number;
    private _isFromHistoryItem: boolean;
    private _emitEvent: boolean;
    private _isFromMultiQigDropDown: boolean;

    /**
     * constructor
     * @param examinerRoleId
     * @param markSchemeGroupId
     * @param isFromHistoryItem
     * @param emitEvent
     */
    constructor(
        examinerRoleId: number,
        markSchemeGroupId: number,
        isFromHistoryItem: boolean,
        emitEvent: boolean,
        isFromMultiQigDropDown: boolean) {
        super(action.Source.View, actionType.OPEN_TEAM_MANAGEMENT);
        this._examinerRoleId = examinerRoleId;
        this._markSchemeGroupId = markSchemeGroupId;
        this._isFromHistoryItem = isFromHistoryItem;
        this._emitEvent = emitEvent;
        this._isFromMultiQigDropDown = isFromMultiQigDropDown;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{examinerRoleId}/g, examinerRoleId.toString()).
            replace(/{markSchemeGroupId}/g, markSchemeGroupId.toString());
    }

    /**
     * Returns the examinerRoleId
     */
    public get examinerRoleId(): number {
        return this._examinerRoleId;
    }

    /**
     * Returns the markSchemeGroupId
     */
    public get markSchemeGroupId(): number {
        return this._markSchemeGroupId;
    }

   /**
    * Returns true if it is from history
    */
    public get isFromHistoryItem(): boolean {
        return this._isFromHistoryItem;
    }

    /**
     * Returns true if needs to be emited
     */
    public get canEmit(): boolean {
        return this._emitEvent;
    }

    /**
     * Returns true if it is from Multiqigdropdown
     */
    public get isFromMultiQigDropDown(): boolean {
        return this._isFromMultiQigDropDown;
    }
}

export = OpenTeamManagementAction;
