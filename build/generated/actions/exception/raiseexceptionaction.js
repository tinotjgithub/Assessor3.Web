"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var localeStore = require('../../stores/locale/localestore');
/**
 * Action class for getting exceptions
 */
var RaiseExceptionAction = (function (_super) {
    __extends(RaiseExceptionAction, _super);
    /**
     * constructor
     * @param success
     * @param raiseExceptionResponse
     */
    function RaiseExceptionAction(success, raiseExceptionResponse) {
        _super.call(this, action.Source.View, actionType.RAISE_EXCEPTION_ACTION, success);
        var exceptionType = localeStore.instance.TranslateText('generic.exception-types.' +
            raiseExceptionResponse.exceptionType + '.name');
        this.auditLog.logContent = this.auditLog.logContent.replace('{exceptionType}', exceptionType);
        if (success) {
            this._raiseExceptionResponse = raiseExceptionResponse;
        }
        else {
            this._raiseExceptionResponse = undefined;
        }
    }
    Object.defineProperty(RaiseExceptionAction.prototype, "raiseExceptionResponse", {
        /**
         * return List of raiseExceptionResponse
         */
        get: function () {
            return this._raiseExceptionResponse;
        },
        enumerable: true,
        configurable: true
    });
    return RaiseExceptionAction;
}(dataRetrievalAction));
module.exports = RaiseExceptionAction;
//# sourceMappingURL=raiseexceptionaction.js.map