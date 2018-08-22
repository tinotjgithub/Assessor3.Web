"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var dataRetrievalAction = require('../base/dataretrievalaction');
/**
 * Action when responses are submitted
 */
var SubmitResponseCompletedAction = (function (_super) {
    __extends(SubmitResponseCompletedAction, _super);
    /**
     * Constructor for SubmitResponseCompletedAction
     * @param submitResponseReturn The return values after response submission
     */
    function SubmitResponseCompletedAction(success, submitResponseReturn, worklistType, fromMarkScheme, examinerApproval, markGroupIds, selectedDisplayId) {
        _super.call(this, action.Source.View, actionType.SUBMIT_RESPONSE_COMPLETED, success, submitResponseReturn);
        this._submitResponseReturn = submitResponseReturn;
        this.worklistType = worklistType;
        this.fromMarkScheme = fromMarkScheme;
        this.examinerApproval = examinerApproval;
        this.markGroupIds = markGroupIds;
        this._selectedDisplayId = selectedDisplayId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString()).replace(/{errorCode}/g, submitResponseReturn.responseSubmitErrorCode.toString());
    }
    Object.defineProperty(SubmitResponseCompletedAction.prototype, "getExaminerApproval", {
        /**
         * Gets the approval status of examiner while submitting the response
         */
        get: function () {
            return this.examinerApproval;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubmitResponseCompletedAction.prototype, "getSubmitResponseReturnDetails", {
        /**
         * Gets the submit response return details
         */
        get: function () {
            return this._submitResponseReturn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubmitResponseCompletedAction.prototype, "getCurrentWorklistType", {
        /**
         * Gets the current worklist type.
         */
        get: function () {
            return this.worklistType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubmitResponseCompletedAction.prototype, "isFromMarkScheme", {
        /**
         * Gets whether the response has been submitted from markscheme
         */
        get: function () {
            return this.fromMarkScheme;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubmitResponseCompletedAction.prototype, "getSubmittedMarkGroupIds", {
        /**
         * Getsthe list of submitted Markgroupids
         */
        get: function () {
            return this.markGroupIds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubmitResponseCompletedAction.prototype, "getSelectedDisplayId", {
        /**
         * Gets the  selectedDisplayId
         */
        get: function () {
            return this._selectedDisplayId;
        },
        enumerable: true,
        configurable: true
    });
    return SubmitResponseCompletedAction;
}(dataRetrievalAction));
module.exports = SubmitResponseCompletedAction;
//# sourceMappingURL=submitresponsecompletedaction.js.map