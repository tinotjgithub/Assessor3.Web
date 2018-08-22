"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for second standardisation.
 */
var ProvideSecondStandardisationAction = (function (_super) {
    __extends(ProvideSecondStandardisationAction, _super);
    /**
     * constructor
     * @param success
     * @param secondStandardisationReturn
     */
    function ProvideSecondStandardisationAction(success, secondStandardisationReturn) {
        _super.call(this, action.Source.View, actionType.PROVIDE_SECOND_STANDARDISATION);
        this._success = success;
        this._secondStandardisationReturn = secondStandardisationReturn;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', success.toString());
    }
    Object.defineProperty(ProvideSecondStandardisationAction.prototype, "success", {
        /**
         * Success status
         */
        get: function () {
            return this._success;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProvideSecondStandardisationAction.prototype, "secondStandardisationReturn", {
        /**
         * Examiner status return
         */
        get: function () {
            return this._secondStandardisationReturn;
        },
        enumerable: true,
        configurable: true
    });
    return ProvideSecondStandardisationAction;
}(action));
module.exports = ProvideSecondStandardisationAction;
//# sourceMappingURL=providesecondstandardisationaction.js.map