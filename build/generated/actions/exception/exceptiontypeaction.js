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
 * Action class for getting exception types
 */
var GetExceptionTypeAction = (function (_super) {
    __extends(GetExceptionTypeAction, _super);
    /**
     * constructor
     * @param success
     * @param exceptionTypes
     */
    function GetExceptionTypeAction(success, exceptionTypes) {
        _super.call(this, action.Source.View, actionType.GET_EXCEPTION_TYPE_ACTION, success);
        if (success) {
            this._exceptionTypes = Immutable.List(exceptionTypes.exceptionTypes);
        }
        else {
            this._exceptionTypes = undefined;
        }
    }
    Object.defineProperty(GetExceptionTypeAction.prototype, "exceptionTypes", {
        /**
         * return List of exception types
         */
        get: function () {
            return this._exceptionTypes;
        },
        enumerable: true,
        configurable: true
    });
    return GetExceptionTypeAction;
}(dataRetrievalAction));
module.exports = GetExceptionTypeAction;
//# sourceMappingURL=exceptiontypeaction.js.map