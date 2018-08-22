import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import bookmark = require('../../stores/response/typings/bookmark');

class BookmarkAddedAction extends action {
    private _bookmarkToAdd: bookmark;

    /**
     * Constructor BookmarkAddedAction
     * @param bookmark
     */
    constructor(bookmark: bookmark) {
        super(action.Source.View, actionType.BOOKMARK_ADDED_ACTION);
        this._bookmarkToAdd = bookmark;
    }

    /**
     * This method will return the bookmark
     */
    public get bookmarkToAdd(): bookmark {
        return this._bookmarkToAdd;
    }
}

export = BookmarkAddedAction;
