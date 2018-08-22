import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import enums = require('../../components/utility/enums');

/**
 * Class for Fit Response To Width/Height Action
 */
class FitResponseAction extends action {

    private _fitType: enums.ResponseViewSettings;
    private _zoomType: enums.ZoomType;

    /**
     * Constructor FitResponseAction
     * @param responseViewSettings
     * @param actionType
     * @param zoomType
     */
    constructor(responseViewSettings: enums.ResponseViewSettings, actionType: string, zoomType?: enums.ZoomType) {
        super(action.Source.View, actionType);
        this.auditLog.logContent = this.auditLog.logContent.replace('{position}', enums.ResponseViewSettings[responseViewSettings]);
        this._fitType = responseViewSettings;
        this._zoomType = zoomType;
    }

    /**
     * This method will return the Fit Type
     */
    public get fitType(): enums.ResponseViewSettings {
        return this._fitType;
    }

    /**
     * This method will return the Zoom Type
     */
    public get zoomType(): enums.ZoomType {
        return this._zoomType;
    }
}

export = FitResponseAction;