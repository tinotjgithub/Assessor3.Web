"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var Immutable = require('immutable');
/**
 * Action class for getting exceptions
 */
var GetExceptionAction = (function (_super) {
    __extends(GetExceptionAction, _super);
    /**
     * constructor
     * @param success
     * @param getExceptionsReturn
     */
    function GetExceptionAction(success, exceptionList) {
        _super.call(this, action.Source.View, actionType.GET_EXCEPTION_ACTION, success);
        if (success) {
            this._exceptions = Immutable.List(exceptionList.exceptions);
        }
        else {
            this._exceptions = undefined;
        }
    }
    Object.defineProperty(GetExceptionAction.prototype, "exceptions", {
        /**
         * return List of exceptions
         */
        get: function () {
            return this._exceptions;
        },
        enumerable: true,
        configurable: true
    });
    return GetExceptionAction;
}(dataRetrievalAction));
module.exports = GetExceptionAction;
//# sourceMappingURL=getexceptionaction.js.map