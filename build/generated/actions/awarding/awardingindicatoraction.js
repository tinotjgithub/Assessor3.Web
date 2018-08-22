"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var DataRetrievalAction = require('../base/dataretrievalaction');
/**
 *  Action class for awarding action
 */
var AwardingIndicatorAction = (function (_super) {
    __extends(AwardingIndicatorAction, _super);
    /**
     * Constructor for the leftpanel toggle action
     * @param isLeftPanelCollapsed boolean value indicating whether the panel is in collapsed state or not.
     */
    function AwardingIndicatorAction(success, json) {
        _super.call(this, action.Source.View, actionType.GET_AWARDING_ACCESS_DETAILS, success);
        this._awardingAccessDetailsData = json;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }
    Object.defineProperty(AwardingIndicatorAction.prototype, "awardingAccessDetailsData", {
        /**
         * Returns the awarding access details data
         */
        get: function () {
            return this._awardingAccessDetailsData;
        },
        enumerable: true,
        configurable: true
    });
    return AwardingIndicatorAction;
}(DataRetrievalAction));
module.exports = AwardingIndicatorAction;
//# sourceMappingURL=awardingindicatoraction.js.map