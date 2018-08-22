"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
/**
 * Action class for exception panel actions
 */
var ExceptionWindowAction = (function (_super) {
    __extends(ExceptionWindowAction, _super);
    /**
     * constructor
     * @param exceptionAction
     * @param exceptionId
     * @param navigateTo
     */
    function ExceptionWindowAction(exceptionAction, exceptionId, navigateTo, navigateFrom, responseNavigationFrom) {
        if (navigateFrom === void 0) { navigateFrom = enums.SaveAndNavigate.none; }
        _super.call(this, action.Source.View, actionType.EXCEPTION_ACTION);
        this._exceptionId = exceptionId;
        this._exceptionAction = exceptionAction;
        this._navigateTo = navigateTo;
        this._navigateFrom = navigateFrom;
        this._responseNavigationFrom = responseNavigationFrom;
        this.auditLog.logContent = this.auditLog.logContent.replace('{windowaction}', enums.ExceptionViewAction[exceptionAction]);
    }
    Object.defineProperty(ExceptionWindowAction.prototype, "exceptionId", {
        /**
         * return exception id
         */
        get: function () {
            return this._exceptionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionWindowAction.prototype, "exceptionAction", {
        /*
         *Return view type
         */
        get: function () {
            return this._exceptionAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionWindowAction.prototype, "navigateTo", {
        /**
         * returns navigate to value
         */
        get: function () {
            return this._navigateTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionWindowAction.prototype, "navigateFrom", {
        /**
         * Returns navigate from value
         */
        get: function () {
            return this._navigateFrom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExceptionWindowAction.prototype, "responseNavigationFrom", {
        /* returns from where the response navigation happened */
        get: function () {
            return this._responseNavigationFrom;
        },
        enumerable: true,
        configurable: true
    });
    return ExceptionWindowAction;
}(action));
module.exports = ExceptionWindowAction;
//# sourceMappingURL=exceptionwindowaction.js.map