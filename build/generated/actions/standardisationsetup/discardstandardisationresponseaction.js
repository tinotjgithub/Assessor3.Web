"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Discard provisional response action
 */
var DiscardStandardisationResponseAction = (function (_super) {
    __extends(DiscardStandardisationResponseAction, _super);
    /**
     * Constructor
     * @param success
     * @param resultData
     */
    function DiscardStandardisationResponseAction(esMarkGroupIds, provDisplayId, success, resultData) {
        _super.call(this, action.Source.View, actionType.DISCARD_STANDARDISATION_RESPONSE);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._discardStandardisationResponseReturn = resultData;
        this.esMarkGroupId = esMarkGroupIds[0];
        this.displayId = provDisplayId;
    }
    Object.defineProperty(DiscardStandardisationResponseAction.prototype, "discardStandardisationResponseReturnDetails", {
        /*
         Discard standardisation response return details
         */
        get: function () {
            return this._discardStandardisationResponseReturn;
        },
        enumerable: true,
        configurable: true
    });
    return DiscardStandardisationResponseAction;
}(action));
module.exports = DiscardStandardisationResponseAction;
//# sourceMappingURL=discardstandardisationresponseaction.js.map