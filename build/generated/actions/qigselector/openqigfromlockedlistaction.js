"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var OpenQigFromLockedListAction = (function (_super) {
    __extends(OpenQigFromLockedListAction, _super);
    /**
     * Constructor for OpenQigFromLockedListAction
     * @param qigId
     */
    function OpenQigFromLockedListAction(qigId) {
        _super.call(this, action.Source.View, actionType.OPEN_QIG_FROM_LOCKED_LIST);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ qigId}/g, qigId.toString());
        this._qigId = qigId;
    }
    Object.defineProperty(OpenQigFromLockedListAction.prototype, "qigId", {
        /**
         * Retrieves qig id
         */
        get: function () {
            return this._qigId;
        },
        enumerable: true,
        configurable: true
    });
    return OpenQigFromLockedListAction;
}(action));
module.exports = OpenQigFromLockedListAction;
//# sourceMappingURL=openqigfromlockedlistaction.js.map