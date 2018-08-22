import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class FileReadStatusChangeAction extends action {

    // Holds Page id.
    private _pageId: number;

    // Check whether the file read status change is in progress or not.
    private _isChangeInProgress: boolean;

    // Check whether the save file read status is completed or not.
    private _isSaveCompleted: boolean;

    // Holds mark group Id.
    private _markGroupId: number;

    /**
     * Constructor for Change File Read Status Action.
     * @param {number} pageId
     * @param {number} markGroupId
     */
    constructor(pageId: number, markGroupId: number, isInProgress: boolean, isSaveCompleted: boolean) {
        super(action.Source.View, actionType.FILE_READ_STATUS_CHANGE_ACTION);
        this._pageId = pageId;
        this._isChangeInProgress = isInProgress;
        this._isSaveCompleted = isSaveCompleted;
        this._markGroupId = markGroupId;
    }

    /**
     * Returns page id of selected file.
     * @returns
     */
    public get pageId(): number {
        return this._pageId;
    }

    /**
     * Returns the file read status change is in progress or not.
     * @returns
     */
    public get isChangeInProgress(): boolean {
        return this._isChangeInProgress;
    }

    /**
     * Returns the file read status save is completed or not.
     * @returns
     */
    public get isSaveCompleted(): boolean {
        return this._isSaveCompleted;
    }

    /**
     * Returns mark group id.
     * @returns
     */
    public get markGroupId(): number {
        return this._markGroupId;
    }
}

export = FileReadStatusChangeAction;
