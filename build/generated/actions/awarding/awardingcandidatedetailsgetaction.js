"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var AwardingCandidateDetailsGetAction = (function (_super) {
    __extends(AwardingCandidateDetailsGetAction, _super);
    function AwardingCandidateDetailsGetAction(success, candidateDetailsList, examSessionId) {
        _super.call(this, action.Source.View, actionType.CANDIDATE_DETAILS_GET, success);
        this._candidateDetailsList = candidateDetailsList;
        this._examSessionId = examSessionId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }
    Object.defineProperty(AwardingCandidateDetailsGetAction.prototype, "isSuccess", {
        get: function () {
            return this._candidateDetailsList.success;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingCandidateDetailsGetAction.prototype, "candidateDetailsList", {
        get: function () {
            return this._candidateDetailsList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingCandidateDetailsGetAction.prototype, "selectedExamSessionId", {
        get: function () {
            return this._examSessionId;
        },
        enumerable: true,
        configurable: true
    });
    return AwardingCandidateDetailsGetAction;
}(dataRetrievalAction));
module.exports = AwardingCandidateDetailsGetAction;
//# sourceMappingURL=awardingcandidatedetailsgetaction.js.map