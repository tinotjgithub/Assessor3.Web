import action = require('../base/action');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import dataRetrievalAction = require('../base/dataretrievalaction');
import enums = require('../../components/utility/enums');

/**
 * Action when responses are submitted
 */
class SubmitResponseCompletedAction extends dataRetrievalAction {

    private _submitResponseReturn: SubmitResponseReturn;
    private worklistType: enums.WorklistType;
    private fromMarkScheme: boolean;
    private examinerApproval: enums.ExaminerApproval;
    private markGroupIds: Array<Number>;
    private _selectedDisplayId: string;
    private _isStdSetupMode: boolean;

    /**
     * Constructor for SubmitResponseCompletedAction
     * @param submitResponseReturn The return values after response submission
     */
    constructor(success: boolean, submitResponseReturn: SubmitResponseReturn, worklistType: enums.WorklistType,
        fromMarkScheme: boolean, examinerApproval: enums.ExaminerApproval, markGroupIds: Array<Number>,
        selectedDisplayId?: string, isStdSetupMode?: boolean) {
        super(action.Source.View, actionType.SUBMIT_RESPONSE_COMPLETED, success, submitResponseReturn);
        this._submitResponseReturn = submitResponseReturn;
        this.worklistType = worklistType;
        this.fromMarkScheme = fromMarkScheme;
        this.examinerApproval = examinerApproval;
        this.markGroupIds = markGroupIds;
        this._selectedDisplayId = selectedDisplayId;
        this._isStdSetupMode = isStdSetupMode;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g,
            success.toString()).replace(/{errorCode}/g, submitResponseReturn.responseSubmitErrorCode.toString());
    }

    /**
     * Gets the approval status of examiner while submitting the response
     */
    get getExaminerApproval() {
        return this.examinerApproval;
    }

    /**
     * Gets the submit response return details
     */
    get getSubmitResponseReturnDetails() {
        return this._submitResponseReturn;
    }

    /**
     * Gets the current worklist type.
     */
    get getCurrentWorklistType() {
        return this.worklistType;
    }

    /**
     * Gets whether the response has been submitted from markscheme
     */
    get isFromMarkScheme() {
        return this.fromMarkScheme;
    }

    /**
     * Getsthe list of submitted Markgroupids
     */
    get getSubmittedMarkGroupIds() {
        return this.markGroupIds;
    }

    /**
     * Gets the  selectedDisplayId
     */
    get getSelectedDisplayId() {
        return this._selectedDisplayId;
    }

    /**
     * Gets whether submitted from Standardisation Setup Worklist
     */
    get isStdSetupMode() {
        return this._isStdSetupMode;
    }
}
export = SubmitResponseCompletedAction;