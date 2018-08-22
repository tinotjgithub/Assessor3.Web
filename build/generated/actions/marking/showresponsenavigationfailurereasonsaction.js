"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for setting marking in progress.
 */
var ShowResponseNavigationFailureReasonsAction = (function (_super) {
    __extends(ShowResponseNavigationFailureReasonsAction, _super);
    /**
     * constructor
     * @param isMarkingInProgress
     */
    function ShowResponseNavigationFailureReasonsAction(navigatingTo, warningMessages, navigatingFrom) {
        _super.call(this, action.Source.View, actionType.SHOW_RESPONSE_NAVIGATION_FAILURE_REASON_ACTION);
        this._combinedWarningMessage = warningMessages;
        this._navigatingTo = navigatingTo;
        this._navigatingFrom = navigatingFrom;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', navigatingTo.toString());
    }
    Object.defineProperty(ShowResponseNavigationFailureReasonsAction.prototype, "combinedWarningMessage", {
        /**
         * Get all response navigation failure reasons
         */
        get: function () {
            return this._combinedWarningMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowResponseNavigationFailureReasonsAction.prototype, "navigatingTo", {
        /**
         * get navigating to
         */
        get: function () {
            return this._navigatingTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowResponseNavigationFailureReasonsAction.prototype, "navigatingFrom", {
        /**
         * get navigating from
         */
        get: function () {
            return this._navigatingFrom;
        },
        enumerable: true,
        configurable: true
    });
    return ShowResponseNavigationFailureReasonsAction;
}(action));
module.exports = ShowResponseNavigationFailureReasonsAction;
//# sourceMappingURL=showresponsenavigationfailurereasonsaction.js.map