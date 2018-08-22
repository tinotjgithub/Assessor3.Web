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
 * Action class for update exception status
 */
var UpdateExceptionStatusAction = (function (_super) {
    __extends(UpdateExceptionStatusAction, _super);
    /**
     * constructor
     * @param success
     * @param exceptionId
     */
    function UpdateExceptionStatusAction(success, exceptionId, exceptionActionType, doNavigate, displayId, updateStatusExceptionReturnErrorCode) {
        _super.call(this, action.Source.View, actionType.UPDATE_EXCEPTION_STATUS, success);
        this._doNavigate = false;
        this.auditLog.logContent = this.auditLog.logContent.replace('{exceptionId}', exceptionId.toString());
        if (success) {
            this._exceptionId = exceptionId;
            this._exceptionActionType = exceptionActionType;
            this._displayId = displayId;
            this._updateStatusExceptionReturnErrorCode = updateStatusExceptionReturnErrorCode;
        }
        else {
            this._exceptionId = undefined;
        }
        this._doNavigate = doNavigate;
    }
    Object.defineProperty(UpdateExceptionStatusAction.prototype, "exceptionId", {
        /**
         * return exception id
         */
        get: function () {
            return this._exceptionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateExceptionStatusAction.prototype, "exceptionActionType", {
        /**
         * return exception action type
         */
        get: function () {
            return this._exceptionActionType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateExceptionStatusAction.prototype, "doNavigate", {
        /**
         * indicates whether the navigation has to be done
         */
        get: function () {
            return this._doNavigate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateExceptionStatusAction.prototype, "displayId", {
        /**
         * get displayId
         */
        get: function () {
            return this._displayId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateExceptionStatusAction.prototype, "updateStatusExceptionReturnErrorCode", {
        /**
         * get errorcode of exception updateStatus
         */
        get: function () {
            return this._updateStatusExceptionReturnErrorCode;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateExceptionStatusAction;
}(dataRetrievalAction));
module.exports = UpdateExceptionStatusAction;
//# sourceMappingURL=updateexceptionstatusaction.js.map