"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for updating remember qig details
 */
var SetRememberQigAction = (function (_super) {
    __extends(SetRememberQigAction, _super);
    /**
     * Constructor setRememberQigAction
     * @param {rememberQig} qigInfo
     */
    function SetRememberQigAction(rememberQig) {
        _super.call(this, action.Source.View, actionType.SET_REMEMBER_QIG);
        this._rememberQig = rememberQig;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{qigId}/g, rememberQig.qigId.toString());
    }
    Object.defineProperty(SetRememberQigAction.prototype, "rememberQig", {
        /**
         * for returning remember qig details.
         * @returns
         */
        get: function () {
            return this._rememberQig;
        },
        enumerable: true,
        configurable: true
    });
    return SetRememberQigAction;
}(action));
module.exports = SetRememberQigAction;
//# sourceMappingURL=setrememberqigaction.js.map