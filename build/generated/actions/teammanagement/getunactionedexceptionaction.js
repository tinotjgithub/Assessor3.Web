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
 * Action class for getting exceptions
 */
var GetUnActionedExceptionAction = (function (_super) {
    __extends(GetUnActionedExceptionAction, _super);
    /**
     *
     * @param {boolean} success
     * @param {number} markSchemegroupId
     * @param {number} examinerID
     * @param {Immutable.List<UnActionedExceptionDetails>} unActionedExceptionList
     */
    function GetUnActionedExceptionAction(success, markSchemegroupId, examinerID, unActionedExceptionList, isFromResponse) {
        _super.call(this, action.Source.View, actionType.GET_UNACTIONED_EXCEPTION_ACTION, success);
        this._isFromBackToException = false;
        this.auditLog.logContent = this.auditLog.logContent.replace('{examinerId}', examinerID.toString()).replace('{markSchemeGroupId}', markSchemegroupId.toString());
        if (success) {
            this._exceptiondata = unActionedExceptionList;
        }
        else {
            this._exceptiondata = undefined;
        }
        this._isFromBackToException = isFromResponse;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', success.toString());
    }
    Object.defineProperty(GetUnActionedExceptionAction.prototype, "exceptiondata", {
        /**
         * return List of exceptions
         */
        get: function () {
            return this._exceptiondata;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetUnActionedExceptionAction.prototype, "isFromResponse", {
        get: function () {
            return this._isFromBackToException;
        },
        enumerable: true,
        configurable: true
    });
    return GetUnActionedExceptionAction;
}(dataRetrievalAction));
module.exports = GetUnActionedExceptionAction;
//# sourceMappingURL=getunactionedexceptionaction.js.map