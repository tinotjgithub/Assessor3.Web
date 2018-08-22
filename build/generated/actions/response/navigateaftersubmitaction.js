"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for inform the submit navigation
 */
var NavigateAfterSubmitAction = (function (_super) {
    __extends(NavigateAfterSubmitAction, _super);
    /**
     * Initializing a new instance of NavigateAfterSubmitAction class
     */
    function NavigateAfterSubmitAction(submittedMarkGroupIds, selectedDisplayId, fromMarkScheme) {
        _super.call(this, action.Source.View, actionType.NAVIGATE_AFTER_SUBMIT_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
        this._submittedMarkGroupIds = submittedMarkGroupIds;
        this._selectedDisplayId = selectedDisplayId;
        this._fromMarkScheme = fromMarkScheme;
    }
    Object.defineProperty(NavigateAfterSubmitAction.prototype, "submittedMarkGroupIds", {
        /**
         * Submitted mark group Ids.
         *
         * @readonly
         * @memberof NavigateAfterSubmitAction
         */
        get: function () {
            return this._submittedMarkGroupIds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigateAfterSubmitAction.prototype, "selectedDisplayId", {
        /**
         * selectedDisplayId
         *
         * @readonly
         */
        get: function () {
            return this._selectedDisplayId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigateAfterSubmitAction.prototype, "isFromMarkScheme", {
        /**
         * is from markscheme
         *
         * @readonly
         */
        get: function () {
            return this._fromMarkScheme;
        },
        enumerable: true,
        configurable: true
    });
    return NavigateAfterSubmitAction;
}(action));
module.exports = NavigateAfterSubmitAction;
//# sourceMappingURL=navigateaftersubmitaction.js.map