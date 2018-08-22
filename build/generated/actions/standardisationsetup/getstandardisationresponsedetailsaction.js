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
var GetStandardisationResponseDetailsAction = (function (_super) {
    __extends(GetStandardisationResponseDetailsAction, _super);
    /**
     * Constructor
     * @param success
     * @param json
     */
    function GetStandardisationResponseDetailsAction(success, worklistViewType, json, fromCache) {
        _super.call(this, action.Source.View, actionType.GET_STANDARDISATION_RESPONSE_DETAILS_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._standardisationResponseDetails = json;
        this._isTotalMarksViewSelected =
            worklistViewType === enums.STDWorklistViewType.ViewTotalMarks ? true : false;
    }
    Object.defineProperty(GetStandardisationResponseDetailsAction.prototype, "StandardisationResponseDetails", {
        /**
         * returns the ClassifiedResponseDetails
         */
        get: function () {
            return this._standardisationResponseDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetStandardisationResponseDetailsAction.prototype, "isTotalMarksViewSelected", {
        /**
         * returns whether is total marks view selected
         */
        get: function () {
            return this._isTotalMarksViewSelected;
        },
        enumerable: true,
        configurable: true
    });
    return GetStandardisationResponseDetailsAction;
}(dataRetrievalAction));
module.exports = GetStandardisationResponseDetailsAction;
//# sourceMappingURL=getstandardisationresponsedetailsaction.js.map