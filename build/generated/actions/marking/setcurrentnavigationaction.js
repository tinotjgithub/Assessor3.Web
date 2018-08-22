"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var SetCurrentNavigationAction = (function (_super) {
    __extends(SetCurrentNavigationAction, _super);
    /**
     * Constructor SetCurrentNavigationAction
     * @param success
     * @param isNavigationThroughMarkScheme
     */
    function SetCurrentNavigationAction(success, isNavigationThroughMarkScheme) {
        _super.call(this, action.Source.View, actionType.SET_CURRENT_NAVIGATION_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._isNavigationThroughMarkScheme = isNavigationThroughMarkScheme;
    }
    Object.defineProperty(SetCurrentNavigationAction.prototype, "isNavigationThroughMarkScheme", {
        /**
         * This will returns the current response navigation
         */
        get: function () {
            return this._isNavigationThroughMarkScheme;
        },
        enumerable: true,
        configurable: true
    });
    return SetCurrentNavigationAction;
}(dataRetrievalAction));
module.exports = SetCurrentNavigationAction;
//# sourceMappingURL=setcurrentnavigationaction.js.map