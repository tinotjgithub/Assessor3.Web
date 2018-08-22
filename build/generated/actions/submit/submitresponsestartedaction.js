"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action to start submit single response
 */
var SubmitResponseStartedAction = (function (_super) {
    __extends(SubmitResponseStartedAction, _super);
    /**
     * Constructor for ResponseSubmitStarted
     * @param markGroupId The mark group id
     */
    function SubmitResponseStartedAction(markGroupId) {
        _super.call(this, action.Source.View, actionType.SINGLE_RESPONSE_SUBMIT_STARTED);
        this._markGroupId = markGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markGroupId}/g, markGroupId.toString());
    }
    Object.defineProperty(SubmitResponseStartedAction.prototype, "getMarkGroupId", {
        /**
         * Gets the mark group id
         */
        get: function () {
            return this._markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    return SubmitResponseStartedAction;
}(action));
module.exports = SubmitResponseStartedAction;
//# sourceMappingURL=submitresponsestartedaction.js.map