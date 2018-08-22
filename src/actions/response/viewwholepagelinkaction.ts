import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
class ViewWholePageLinkAction extends action {
    private _isCursorInsideScript: boolean;
    private _activeImageZone: ImageZone;

    constructor(isCursorInsideScript: boolean, activeImageZone: ImageZone) {
        super(action.Source.View, actionType.VIEW_WHOLE_PAGE_LINK);
        this._isCursorInsideScript = isCursorInsideScript;
        this._activeImageZone = activeImageZone;
    }

    /**
     * This method will returns supervisor sampling Comment Return details
     */
    public get isCursorInsideScript(): boolean {
        return this._isCursorInsideScript;
    }

    public get activeImageZone(): ImageZone {
        return this._activeImageZone;
    }
}
export = ViewWholePageLinkAction;
