import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class SetBookmarkPreviousScrollDataAction extends action {
    private _bookmarkPreviousScrollData: BookmarkPreviousScrollData;
    /**
     * Constructor SetBookmarkPreviousScrollDataAction
     */
    constructor(bookmarkPreviousScrollData: BookmarkPreviousScrollData) {
        super(action.Source.View, actionType.SET_BOOKMARK_PREVIOUS_SCROLL_DATA_ACTION);
        this._bookmarkPreviousScrollData = bookmarkPreviousScrollData;
    }

    /**
     * This method will return the previous scroll Data
     */
    public get getBookmarkPreviousScrollData(): BookmarkPreviousScrollData {
        return this._bookmarkPreviousScrollData;
    }
}

export = SetBookmarkPreviousScrollDataAction;
