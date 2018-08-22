import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import bookmark = require('../../stores/response/typings/bookmark');

class UpdateBookmarkNameAction extends action {
    private _bookmarkNameToSave: string;
    private _bookmarkClientToken: string;

    /**
     * Constructor UpdateBookmarkNameAction
     * @param bookmark
     */
    constructor(bookmarkName: string, clientToken: string) {
        super(action.Source.View, actionType.UPDATE_BOOKMARK_NAME_ACTION);
        this._bookmarkNameToSave = bookmarkName;
        this._bookmarkClientToken = clientToken;
    }

    /**
     * This method will return the bookmark name of the newly added bookmark
     */
    public get bookmarkNameToSave(): string {
        return this._bookmarkNameToSave;
    }

    /**
     * This method will return the client token of the newly added bookmark
     */
    public get bookmarkClientToken(): string {
        return this._bookmarkClientToken;
    }
}

export = UpdateBookmarkNameAction;
