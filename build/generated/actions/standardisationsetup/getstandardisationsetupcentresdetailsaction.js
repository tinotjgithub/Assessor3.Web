"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
var GetStandardisationSetupCentresDetailsAction = (function (_super) {
    __extends(GetStandardisationSetupCentresDetailsAction, _super);
    /**
     * Constructor
     * @param success
     * @param json
     */
    function GetStandardisationSetupCentresDetailsAction(success, stdWorklistViewType, json) {
        _super.call(this, action.Source.View, actionType.GET_STANDARDISATION_CENTRE_DETAILS_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._standardisationCentreDetails = json;
        this._isTotalMarksViewSelected =
            stdWorklistViewType === enums.STDWorklistViewType.ViewTotalMarks ? true : false;
    }
    Object.defineProperty(GetStandardisationSetupCentresDetailsAction.prototype, "StandardisationCentreDetailsList", {
        /**
         * returns the Standardisation Centre Details
         */
        get: function () {
            return this._standardisationCentreDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetStandardisationSetupCentresDetailsAction.prototype, "isTotaMarksViewSelected", {
        /**
         * Returns the worklist view type
         * @readonly
         * @type {boolean}
         * @memberof GetStandardisationSetupCentresDetailsAction
         */
        get: function () {
            return this._isTotalMarksViewSelected;
        },
        enumerable: true,
        configurable: true
    });
    return GetStandardisationSetupCentresDetailsAction;
}(dataRetrievalAction));
module.exports = GetStandardisationSetupCentresDetailsAction;
//# sourceMappingURL=getstandardisationsetupcentresdetailsaction.js.map