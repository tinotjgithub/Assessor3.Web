"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var GetStandardisationTargetDetailsListAction = (function (_super) {
    __extends(GetStandardisationTargetDetailsListAction, _super);
    /**
     * Constructor
     * @param success
     * @param json
     */
    function GetStandardisationTargetDetailsListAction(success, markSchemeGroupId, examinerRoleId, json) {
        _super.call(this, action.Source.View, actionType.GET_STANDARDISATION_TARGET_DETAILS_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._markSchemeGroupId = markSchemeGroupId;
        this._examinerRoleId = examinerRoleId;
        this._standardisationTargetDetails = json;
    }
    Object.defineProperty(GetStandardisationTargetDetailsListAction.prototype, "StandardisationTargetDetailsList", {
        /**
         * returns the StandardisationTargetDetails
         */
        get: function () {
            return this._standardisationTargetDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetStandardisationTargetDetailsListAction.prototype, "markSchemeGroupId", {
        /**
         * mark scheme group id
         */
        get: function () {
            return this._markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetStandardisationTargetDetailsListAction.prototype, "examinerRoleId", {
        /**
         * examiner role id
         */
        get: function () {
            return this._examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    return GetStandardisationTargetDetailsListAction;
}(dataRetrievalAction));
module.exports = GetStandardisationTargetDetailsListAction;
//# sourceMappingURL=getstandardisationsetuptargetdetailsaction.js.map