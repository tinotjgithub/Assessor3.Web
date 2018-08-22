"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Complete Standardisation action
 */
var CompleteStandardisationSetupAction = (function (_super) {
    __extends(CompleteStandardisationSetupAction, _super);
    /**
     * Constructor
     * @param success
     * @param resultData
     */
    function CompleteStandardisationSetupAction(success, resultData) {
        _super.call(this, action.Source.View, actionType.COMPLETE_STANDARDISATION_SETUP);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._completeStandardisationSetupReturnDetails = resultData;
    }
    Object.defineProperty(CompleteStandardisationSetupAction.prototype, "completeStandardisationSetupReturnDetails", {
        /*
         Complete Standardisation return details
         */
        get: function () {
            return this._completeStandardisationSetupReturnDetails;
        },
        enumerable: true,
        configurable: true
    });
    return CompleteStandardisationSetupAction;
}(action));
module.exports = CompleteStandardisationSetupAction;
//# sourceMappingURL=completestandardisationsetupaction.js.map