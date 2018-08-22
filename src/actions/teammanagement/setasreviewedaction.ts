import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import dataRetrievalAction = require('../base/dataretrievalaction');

/**
 * Action for setting the responses as reviewed
 */
class SetAsReviewedAction extends dataRetrievalAction {

    private _reviewedResponseDetails: ReviewedResponseDetails;

    /**
     * Constructor for set as reviewed action
     */
    constructor(reviewedResponseDetails: ReviewedResponseDetails, success: boolean) {
        super(action.Source.View, actionType.SET_RESPONSE_AS_REVIEWED_ACTION, success);

        this._reviewedResponseDetails = reviewedResponseDetails;

        this.auditLog.logContent = this.auditLog.logContent.replace(/{Mark_Group_Id}/g, reviewedResponseDetails.markGroupId.toString());
    }

    /**
     * Gets the reviewed response details
     */
    public get ReviewedResponseDetails(): ReviewedResponseDetails {

        return this._reviewedResponseDetails;
    }
}

export = SetAsReviewedAction;