"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ShowSimulationResponseSubmitConfirmationPopupAction = (function (_super) {
    __extends(ShowSimulationResponseSubmitConfirmationPopupAction, _super);
    /**
     * Constructor
     */
    function ShowSimulationResponseSubmitConfirmationPopupAction(markGroupId, fromMarkScheme) {
        if (markGroupId === void 0) { markGroupId = 0; }
        if (fromMarkScheme === void 0) { fromMarkScheme = false; }
        _super.call(this, action.Source.View, actionType.SHOW_SIMULATION_RESPONSE_SUBMIT_CONFIRMATION_ACTION);
        this._markGroupId = markGroupId;
        this._isFromMarkScheme = fromMarkScheme;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markGroupId}/, markGroupId.toString())
            .replace(/{markScheme}/, fromMarkScheme.toString());
    }
    Object.defineProperty(ShowSimulationResponseSubmitConfirmationPopupAction.prototype, "markGroupId", {
        /**
         * return mark group id
         */
        get: function () {
            return this._markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowSimulationResponseSubmitConfirmationPopupAction.prototype, "isFromMarkScheme", {
        /**
         * returns is the response submitting from markschemepanle or not
         */
        get: function () {
            return this._isFromMarkScheme;
        },
        enumerable: true,
        configurable: true
    });
    return ShowSimulationResponseSubmitConfirmationPopupAction;
}(action));
module.exports = ShowSimulationResponseSubmitConfirmationPopupAction;
//# sourceMappingURL=showsimulationresponsesubmitconfirmationpopupaction.js.map