"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to display Marke Change Reason Needed popup.
 */
var ShowMarkChangeReasonNeededMessageAction = (function (_super) {
    __extends(ShowMarkChangeReasonNeededMessageAction, _super);
    /**
     * Constructor
     * @param failureReason
     * @param navigateTo
     */
    function ShowMarkChangeReasonNeededMessageAction(failureReason, navigateTo) {
        _super.call(this, action.Source.View, actionType.SHOW_MARK_CHANGE_REASON_NEEDED_MESSAGE_ACTION);
        this._failureReason = failureReason;
        this._navigateTo = navigateTo;
        this.auditLog.logContent = this.auditLog.logContent;
    }
    Object.defineProperty(ShowMarkChangeReasonNeededMessageAction.prototype, "failureReason", {
        /**
         * Get failure reason
         */
        get: function () {
            return this._failureReason;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowMarkChangeReasonNeededMessageAction.prototype, "navigateTo", {
        /**
         *  get navigateTo
         */
        get: function () {
            return this._navigateTo;
        },
        enumerable: true,
        configurable: true
    });
    return ShowMarkChangeReasonNeededMessageAction;
}(action));
module.exports = ShowMarkChangeReasonNeededMessageAction;
//# sourceMappingURL=showmarkchangereasonneededmessageaction.js.map