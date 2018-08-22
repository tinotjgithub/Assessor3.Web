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
 * Action class for setting non-recoverable error
 */
var SetNonRecoverableErrorAction = (function (_super) {
    __extends(SetNonRecoverableErrorAction, _super);
    /**
     * Constructor SetNonRecoverableErrorActions
     * @param markGroupId
     * @param success
     */
    function SetNonRecoverableErrorAction(markGroupId, success) {
        _super.call(this, action.Source.View, actionType.SET_NON_RECOVERABLE_ERROR, success);
        this._markGroupId = markGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markGroupId}/g, this.markGroupId.toString()).
            replace(/{success}/g, success.toString());
    }
    Object.defineProperty(SetNonRecoverableErrorAction.prototype, "markGroupId", {
        /**
         * returns the markGroupId
         */
        get: function () {
            return this._markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    return SetNonRecoverableErrorAction;
}(dataRetrievalAction));
module.exports = SetNonRecoverableErrorAction;
//# sourceMappingURL=setnonrecoverableerroraction.js.map