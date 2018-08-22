import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class BookmarkPanelClickAction extends action {
    private _isBookmarkPanelOpen: boolean;

    constructor(isBookmarkPanelOpen: boolean) {
        super(action.Source.View, actionType.BOOKMARK_PANEL_CLICK_ACTION);
        this._isBookmarkPanelOpen = isBookmarkPanelOpen;
    }

    /**
     * returns bookmark panel open status.
     */
    public get isBookmarkPanelOpen(): boolean {
        return this._isBookmarkPanelOpen;
    }
}
export = BookmarkPanelClickAction;
