import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import enums = require('../../components/utility/enums');

/**
 * Class for Fit Response To Width/Height Action
 */
class SetFracsDataForZoomAction extends action {

    private _zoomType: enums.ResponseViewSettings;

    /**
     * Constructor SetFracsDataForZoomAction
     * @param responseViewSettings
     * @param actionType
     */
    constructor(responseViewSettings: enums.ResponseViewSettings, actionType: string) {
        super(action.Source.View, actionType);
        this.auditLog.logContent = this.auditLog.logContent;
        this._zoomType = responseViewSettings;
    }

    /**
     * This method will return the Fit Type
     */
    public get zoomType(): enums.ResponseViewSettings {
        return this._zoomType;
    }
}

export = SetFracsDataForZoomAction;