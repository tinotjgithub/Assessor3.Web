import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class ShowOrHideBookmarkNameBoxAction extends action {
    private _bookmarkText: string;
    private _clientToken: string;
    private _isVisible: boolean;
    private _rotatedAngle: enums.RotateAngle;

    constructor(bookmarkText: string, clientToken: string, isVisible: boolean, rotatedAngle?: enums.RotateAngle) {
        super(action.Source.View, actionType.SHOW_OR_HIDE_BOOKMARK_NAME_BOX);
        this._bookmarkText = bookmarkText;
        this._clientToken = clientToken;
        this._isVisible = isVisible;
        this._rotatedAngle = rotatedAngle;
    }

    /**
     * This method will return the bookmark name of the newly added bookmark
     */
    public get bookmarkText(): string {
        return this._bookmarkText;
    }

    public get clientToken(): string {
        return this._clientToken;
    }

    public get isVisible(): boolean {
        return this._isVisible;
    }

    public get rotatedAngle(): enums.RotateAngle {
        return this._rotatedAngle;
    }

}

export = ShowOrHideBookmarkNameBoxAction;