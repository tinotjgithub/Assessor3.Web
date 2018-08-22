import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class BookmarkSelectedAction extends action {
    private _clientToken: string;

    /**
     * Constructor BookmarkSelectedAction
     */
    constructor(clientToken: string) {
        super(action.Source.View, actionType.BOOKMARK_SELECTED_ACTION);
        this._clientToken = clientToken;
    }

    /**
     * This method will return the Selected bookmark Item
     */
    public get clientToken(): string {
        return this._clientToken;
    }
}

export = BookmarkSelectedAction;
