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
 * Action for setting the responses as reviewed
 */
var SetAsReviewedAction = (function (_super) {
    __extends(SetAsReviewedAction, _super);
    /**
     * Constructor for set as reviewed action
     */
    function SetAsReviewedAction(reviewedResponseDetails, success) {
        _super.call(this, action.Source.View, actionType.SET_RESPONSE_AS_REVIEWED_ACTION, success);
        this._reviewedResponseDetails = reviewedResponseDetails;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{Mark_Group_Id}/g, reviewedResponseDetails.markGroupId.toString());
    }
    Object.defineProperty(SetAsReviewedAction.prototype, "ReviewedResponseDetails", {
        /**
         * Gets the reviewed response details
         */
        get: function () {
            return this._reviewedResponseDetails;
        },
        enumerable: true,
        configurable: true
    });
    return SetAsReviewedAction;
}(dataRetrievalAction));
module.exports = SetAsReviewedAction;
//# sourceMappingURL=setasreviewedaction.js.map