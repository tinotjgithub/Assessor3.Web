import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
/**
 * Action class for display file name
 */
class DisplayFileNameAction extends action {

    //Holds file name
    private _fileName: string;

    /**
     * Constructor for Display File Name Action
     * @param {string} fileName
     */
    constructor(fileName: string) {
        super(action.Source.View, actionType.DISPLAY_FILE_NAME_ACTION);
        this._fileName = fileName;
    }

    /**
     * Returns file name of selected file
     * @returns
     */
    public get fileName(): string {
        return this._fileName;
    }
}

export = DisplayFileNameAction;
