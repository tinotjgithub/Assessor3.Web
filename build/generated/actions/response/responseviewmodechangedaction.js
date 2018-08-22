"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * Class for Response View Mode changed action.
 */
var ResponseViewModeChangedAction = (function (_super) {
    __extends(ResponseViewModeChangedAction, _super);
    /**
     * Constructor ResponseViewModeChangedAction
     * @param success
     * @param responseViewMode
     * @param doResetFracs
     * @param isImageFile
     * @param pageNo
     */
    function ResponseViewModeChangedAction(success, responseViewMode, doResetFracs, isImageFile, pageNo) {
        _super.call(this, action.Source.View, actionType.RESPONSE_VIEW_MODE_CHANGED, success);
        this._pageNo = 0;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._responseViewMode = responseViewMode;
        this._doResetFracs = doResetFracs;
        this._isImageFile = isImageFile;
        this._pageNo = pageNo;
    }
    Object.defineProperty(ResponseViewModeChangedAction.prototype, "responseViewMode", {
        get: function () {
            return this._responseViewMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseViewModeChangedAction.prototype, "doResetFracs", {
        get: function () {
            return this._doResetFracs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseViewModeChangedAction.prototype, "isImageFile", {
        get: function () {
            return this._isImageFile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseViewModeChangedAction.prototype, "pageNo", {
        get: function () {
            return this._pageNo;
        },
        enumerable: true,
        configurable: true
    });
    return ResponseViewModeChangedAction;
}(dataRetrievalAction));
module.exports = ResponseViewModeChangedAction;
//# sourceMappingURL=responseviewmodechangedaction.js.map