import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Class for Response View Mode changed action.
 */
class ResponseViewModeChangedAction extends dataRetrievalAction {

    private _responseViewMode: enums.ResponseViewMode;
    private _doResetFracs: boolean;
    private _isImageFile: boolean;
    private _pageNo: number = 0;

    /**
     * Constructor ResponseViewModeChangedAction
     * @param success
     * @param responseViewMode
     * @param doResetFracs
     * @param isImageFile
     * @param pageNo
     */
    constructor(success: boolean, responseViewMode: enums.ResponseViewMode, doResetFracs: boolean,
        isImageFile: boolean, pageNo: number) {
        super(action.Source.View, actionType.RESPONSE_VIEW_MODE_CHANGED, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._responseViewMode = responseViewMode;
        this._doResetFracs = doResetFracs;
        this._isImageFile = isImageFile;
        this._pageNo = pageNo;
    }

    public get responseViewMode(): enums.ResponseViewMode {
        return this._responseViewMode;
    }

    public get doResetFracs(): boolean {
        return this._doResetFracs;
    }

    public get isImageFile(): boolean {
        return this._isImageFile;
    }

    public get pageNo(): number {
        return this._pageNo;
    }
}

export = ResponseViewModeChangedAction;