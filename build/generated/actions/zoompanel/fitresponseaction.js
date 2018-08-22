"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var enums = require('../../components/utility/enums');
/**
 * Class for Fit Response To Width/Height Action
 */
var FitResponseAction = (function (_super) {
    __extends(FitResponseAction, _super);
    /**
     * Constructor FitResponseAction
     * @param responseViewSettings
     * @param actionType
     * @param zoomType
     */
    function FitResponseAction(responseViewSettings, actionType, zoomType) {
        _super.call(this, action.Source.View, actionType);
        this.auditLog.logContent = this.auditLog.logContent.replace('{position}', enums.ResponseViewSettings[responseViewSettings]);
        this._fitType = responseViewSettings;
        this._zoomType = zoomType;
    }
    Object.defineProperty(FitResponseAction.prototype, "fitType", {
        /**
         * This method will return the Fit Type
         */
        get: function () {
            return this._fitType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FitResponseAction.prototype, "zoomType", {
        /**
         * This method will return the Zoom Type
         */
        get: function () {
            return this._zoomType;
        },
        enumerable: true,
        configurable: true
    });
    return FitResponseAction;
}(action));
module.exports = FitResponseAction;
//# sourceMappingURL=fitresponseaction.js.map