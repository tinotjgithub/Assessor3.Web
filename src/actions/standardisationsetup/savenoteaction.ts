import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class SaveNoteAction extends action {
    private _esMarkGroupID: number;
    private _note: string;
    private _rowVersion: string;
    private _saveNoteErrorCode: string;

    constructor(esMarkGroupID: number, note: string, rowVersion: string, saveNoteErrorCode: string) {
        super(action.Source.View, actionType.SAVE_NOTE_ACTION);
        this._esMarkGroupID = esMarkGroupID;
        this._note = note;
        this._rowVersion = rowVersion;
        this._saveNoteErrorCode = saveNoteErrorCode;
    }

    /**
     * This method will returns es_mark_group_id
     */
    public get esMarkGroupID(): number {
        return this._esMarkGroupID;
    }

    /**
     * This method will returns corresponding note against response
     */
    public get note(): string {
        return this._note;
    }

    /**
     * This method will return rowVersion.
     */
    public get rowVersion(): string {
        return this._rowVersion;
    }

    /**
     * This method will return errorcode.
     */
    public get saveNoteErrorCode(): string {
        return this._saveNoteErrorCode;
    }
}
export = SaveNoteAction;
