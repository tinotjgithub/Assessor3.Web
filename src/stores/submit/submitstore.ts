import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import submitResponseStartedAction = require('../../actions/submit/submitresponsestartedaction');
import submitresponsecompletedaction = require('../../actions/submit/submitresponsecompletedaction');
import shareAndClassifyCompletedaction = require('../../actions/submit/shareandclassifycompletedaction');
import enums = require('../../components/utility/enums');
import responseOpenAction = require('../../actions/response/responseopenaction');
import navigateAfterSubmitAction = require('../../actions/response/navigateaftersubmitaction');
import showSimulationResponseSubmitConfirmAction = require('../../actions/marking/showsimulationresponsesubmitconfirmationpopupaction');
import constants = require('../../components/utility/constants');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import shareAndClassifyReturn  = require('../../stores/submit/typings/shareAndClassifyReturn');

/* The submit store */
class SubmitStore extends storeBase {
    private markGroupId: number;
    public static SUBMIT_RESPONSE_STARTED = 'submitResponseStarted';
    public static SUBMIT_RESPONSE_COMPLETED = 'shareResponseCompleted';
    public static SHARE_AND_CLASSIFY_RESPONSE_COMPLETED = 'submitResponseCompleted';
    public static NAVIGATE_AFTER_SUBMIT = 'navigateAfterSubmit';
    public static SHOW_SIMULATION_RESPONSE_SUBMIT_CONFIRMATION_EVENT = 'ShowSimulationResponseSubmitConfirmationEvent';

    private isSuccess: boolean;
    private submitResponseReturn: SubmitResponseReturn;
    private shareAndClassifyResponseReturn: shareAndClassifyReturn;
    private worklistType: enums.WorklistType;
    private examinerApprovalStatusChanged: boolean;
    private isFromMarkScheme: boolean;
    private storageAdapterHelper = new storageAdapterHelper();

    /**
     * Constructor for Submit store
     */
    constructor() {
        super();
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.SINGLE_RESPONSE_SUBMIT_STARTED:
                    this.markGroupId = (action as submitResponseStartedAction).getMarkGroupId;
                    /* Show busy indicator when submit button is clicked */
                    this.emit(SubmitStore.SUBMIT_RESPONSE_STARTED);
                    break;
                case actionType.OPEN_RESPONSE:
                    let openAction: responseOpenAction = action as responseOpenAction;
                    this.markGroupId = openAction.selectedMarkGroupId;
                    break;
                case actionType.SUBMIT_RESPONSE_COMPLETED:
                    let submitresponsecompletedaction = (action as submitresponsecompletedaction);
                    this.isSuccess = submitresponsecompletedaction.success;
                    this.worklistType = submitresponsecompletedaction.getCurrentWorklistType;
                    this.submitResponseReturn = submitresponsecompletedaction.getSubmitResponseReturnDetails;
                    this.examinerApprovalStatusChanged = submitresponsecompletedaction.getExaminerApproval
                        !== this.submitResponseReturn.examinerApprovalStatus;
                    // checking session is closed for the examiner and blocking navigation
                    if (submitresponsecompletedaction.getSubmitResponseReturnDetails.responseSubmitErrorCode
                        === constants.QIG_SESSION_CLOSED) {
                        this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                        return;
                    }
                    /* When response submission is finished */
                    if (this.submitResponseReturn.examinerApprovalStatus !== enums.ExaminerApproval.Withdrawn) {
                        /* When response submission is finished */
                        this.emit(SubmitStore.SUBMIT_RESPONSE_COMPLETED,
                            submitresponsecompletedaction.isFromMarkScheme,
                            submitresponsecompletedaction.getSubmittedMarkGroupIds,
                            submitresponsecompletedaction.getSelectedDisplayId);
                    }
                    break;
                case actionType.SHARE_AND_CLASSIFY_COMPLETED:
                    let shareandclassifycompletedaction = (action as shareAndClassifyCompletedaction);
                    this.isSuccess = shareandclassifycompletedaction.success;
                    this.shareAndClassifyResponseReturn = shareandclassifycompletedaction.getShareAndClassifyResponseReturnDetails;

                    this.emit(SubmitStore.SHARE_AND_CLASSIFY_RESPONSE_COMPLETED,
                        shareandclassifycompletedaction.isFromMarkScheme);
                    break;
                case actionType.NAVIGATE_AFTER_SUBMIT_ACTION:
                    let navigateAfterSubmit = (action as navigateAfterSubmitAction);
                    if (navigateAfterSubmit.submittedMarkGroupIds.length > 0) {
                        this.emit(SubmitStore.NAVIGATE_AFTER_SUBMIT,
                            navigateAfterSubmit.submittedMarkGroupIds,
                            navigateAfterSubmit.selectedDisplayId,
                            navigateAfterSubmit.isFromMarkScheme);
                    }
                    break;
                case actionType.MARK:
                    this.resetSelectedSubmitDetails();
                    break;
                case actionType.SHOW_SIMULATION_RESPONSE_SUBMIT_CONFIRMATION_ACTION:
                    let showSimulationResponseSubmitConfirmAction = action as showSimulationResponseSubmitConfirmAction;
                    this.markGroupId = showSimulationResponseSubmitConfirmAction.markGroupId;
                    this.isFromMarkScheme = showSimulationResponseSubmitConfirmAction.isFromMarkScheme;
                    this.emit(SubmitStore.SHOW_SIMULATION_RESPONSE_SUBMIT_CONFIRMATION_EVENT);
                    break;
            }
        });
    }

    public get isSubmitFromMarkScheme(): boolean {
        return this.isFromMarkScheme;
    }
    /**
     * Returns the success status
     * @returns
     */
    public get getSuccess(): boolean {
        return this.isSuccess;
    }

    /**
     * Returns the error code
     * @returns
     */
    public get getErrorCode(): number {
        return this.submitResponseReturn.responseSubmitErrorCode;
    }

    /**
     * Returns whetger examiner approval status changed when submitting the response
     * @returns
     */
    public get isExaminerApprovalStatusChanged(): boolean {
        return this.examinerApprovalStatusChanged;
    }

    /**
     * Returns the mark group Id for a single response
     * @returns
     */
    public get getMarkGroupId(): number {
        return this.markGroupId;
    }

    /**
     * Returns the current worklist type
     * @returns
     */
    public get getCurrentWorklistType(): enums.WorklistType {
        return this.worklistType;
    }

    /**
     * Returns the submitted responses details.
     * @returns
     */
    public getSubmittedResponsesCount(): number {
        return this.submitResponseReturn.submittedResponseCount;
    }

    /**
     * Get the return object to the outside
     */
    public get getSubmitResponseReturn(): SubmitResponseReturn {
        return this.submitResponseReturn;
    }

    /**
     * Get the return object to the outside
     */
    public get getShareAndClassifyResponseReturn(): shareAndClassifyReturn {
        return this.shareAndClassifyResponseReturn;
    }

    /**
     * This will reset the selected submit details
     */
    private resetSelectedSubmitDetails(): void {
        this.submitResponseReturn = undefined;
    }
}

let instance = new SubmitStore();
export = { SubmitStore, instance };