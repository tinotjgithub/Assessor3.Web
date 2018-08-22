import markerinformation = require('./typings/markerinformation');
import dispatcher = require('../../app/dispatcher');
import storeBase = require('../base/storebase');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import markerInformationAction = require('../../actions/markerinformation/markerinformationaction');
import stringFormatHelper = require('../../utility/stringformat/stringformathelper');
import backgroundPulseAction = require('../../actions/backgroundpulse/backgroundpulseaction');
import worklistinitialisationaction = require('../../actions/worklist/worklistinitialisationaction');
import enums = require('../../components/utility/enums');
import responseAllocateAction = require('../../actions/response/responseallocateaction');
import submitresponsecompletedaction = require('../../actions/submit/submitresponsecompletedaction');
import actionExaminerOnlineStatusInfo = require('../../actions/backgroundpulse/examineronlinestatus/actionexamineronlinestatusinfo');
import acceptQualityFeedbackAction = require('../../actions/response/acceptqualityfeedbackaction');
import markerOperationModeChangedAction = require('../../actions/userinfo/markeroperationmodechangedaction');
import Immutable = require('immutable');
import changeExaminerStatusAction = require('../../actions/teammanagement/changeexaminerstatusaction');
import provideSecondStandardisationAction = require('../../actions/teammanagement/providesecondstandardisationaction');
import responseDataGetAction = require('../../actions/response/responsedatagetaction');
import promoteToSeedCheckRemarkAction = require('../../actions/response/promotetoseedcheckremarkaction');
import validationAction = require('../../actions/teammanagement/validationaction');
import constants = require('../../components/utility/constants');

/**
 * Class for holding Marker's profile information.
 * @returns
 */
class ExaminerStore extends storeBase {

    // The examiner information.
    private markerInformation: markerinformation;
    private success: boolean = false;
    private _operationMode: enums.MarkerOperationMode = enums.MarkerOperationMode.Marking;
    // contains examinerRoleId: number, examinerApprovalStatus: examiner approval status
    private _examinerApprovalStatuses: Immutable.Map<number, enums.ExaminerApproval>;

    // Marker info updated event name.
    public static MARKER_INFO_UPDATED_EVENT = 'markerinfoupdated';

    // Online status updated event .
    public static ONLINE_STATUS_UPDATED_EVENT = 'onlinestatusupdated';

    // cheking for qig session is closed for the examiner
    public static QIG_SESSION_CLOSED_EVENT = 'qigsessionclosed';

    /**
     *  Intializing a new instance of examiner store.
     */
    constructor() {
        super();
        this._examinerApprovalStatuses = Immutable.Map<number, enums.ExaminerApproval>();
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {

                case actionType.MARKERINFO:
                    this.markerInformation = (action as markerInformationAction).markerInformation;
                    this.markerInformation.supervisorLoginStatus = this.supervisorLoginStatus();
                    this.markerInformation.formattedExaminerName = this.formattedExaminerName();
                    this.markerInformation.formattedSupervisorName = this.formattedSupervisorName;
                    this.markerInformation.formattedEsReviewerName = this.formattedEsReviewerName;
                    this.updateApprovalStatus();
                    this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                    break;
                case actionType.WORKLIST_INITIALISATION_STARTED:
                    let result = (action as worklistinitialisationaction).markerInformationData;
                    if (result) {
                        this.markerInformation = result as markerinformation;
                        this.markerInformation.supervisorLoginStatus = this.supervisorLoginStatus();
                        this.markerInformation.formattedExaminerName = this.formattedExaminerName();
                        this.markerInformation.formattedSupervisorName = this.formattedSupervisorName;
                        this.markerInformation.formattedEsReviewerName = this.formattedEsReviewerName;
                        this.updateApprovalStatus();
                    }
                    this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                    break;
                case actionType.RESPONSE_ALLOCATED:
                case actionType.ATYPICAL_SEARCH_MOVETOWORKLIST_ACTION:
                case actionType.ATYPICAL_SEARCH_MARK_NOW_ACTION:
                    let allocationAction: responseAllocateAction = action as responseAllocateAction;
                    /** Check the current approval status got changed, If so update the components */
                    if (allocationAction.allocatedResponseData.examinerApprovalStatus !== this.markerInformation.approvalStatus) {
                        this.markerInformation.approvalStatus = allocationAction.allocatedResponseData.examinerApprovalStatus;
                        this.updateApprovalStatus();
                        if (this.markerInformation.approvalStatus !== enums.ExaminerApproval.Withdrawn) {
                            this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                        }
                    }
                    break;
                case actionType.SUBMIT_RESPONSE_COMPLETED:
                    let submitActionCompleted = action as submitresponsecompletedaction;
                    //checking qig session is closed for the examiner
                    if (submitActionCompleted.getSubmitResponseReturnDetails.responseSubmitErrorCode
                        === constants.QIG_SESSION_CLOSED) {
                        this.emit(ExaminerStore.QIG_SESSION_CLOSED_EVENT);
                    } else if (this.markerInformation.approvalStatus !== enums.ExaminerApproval.Withdrawn) {
                        if (this.markerInformation.approvalStatus
                            !== submitActionCompleted.getSubmitResponseReturnDetails.examinerApprovalStatus ||
                            this.markerInformation.hasQualityFeedbackOutstanding
                            !== submitActionCompleted.getSubmitResponseReturnDetails.hasQualityFeedbackOutstanding) {
                            this.markerInformation.approvalStatus =
                                submitActionCompleted.getSubmitResponseReturnDetails.examinerApprovalStatus;
                            this.markerInformation.hasQualityFeedbackOutstanding =
                                submitActionCompleted.getSubmitResponseReturnDetails.hasQualityFeedbackOutstanding;
                            this.updateApprovalStatus();
                            this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                        }
                    }
                    break;
                case actionType.BACKGROUND_PULSE:
                    let success: boolean = (action as backgroundPulseAction).success;
                    if (success && this.markerInformation && this.markerInformation.approvalStatus !== enums.ExaminerApproval.Withdrawn
                        && this._operationMode === enums.MarkerOperationMode.Marking) {
                        let examinerOnlineStatusIndicatorData: actionExaminerOnlineStatusInfo =
                            (action as backgroundPulseAction).getOnlineStatusData;
                        this.markerInformation.isSupervisorLoggedOut = examinerOnlineStatusIndicatorData.isExaminerLoggedOut;
                        this.markerInformation.supervisorLogoutDiffInMinute =
                            examinerOnlineStatusIndicatorData.supervisorTimeSinceLastPingInMinutes;
                        this.markerInformation.approvalStatus = examinerOnlineStatusIndicatorData.examinerApprovalStatus;
                        this.markerInformation.markerRoleID = examinerOnlineStatusIndicatorData.role;
                        this.markerInformation.supervisorLoginStatus = this.supervisorLoginStatus();
                        // updating the examiner approval status collection on background pulse
                        this.updateApprovalStatus();
                        this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                    }
                    break;
                case actionType.ACCEPT_QUALITY_ACTION:
                    let acceptFeedbakAction = action as acceptQualityFeedbackAction;
                    if (acceptFeedbakAction.acceptQualityFeedbackActionData.success) {
                        this.markerInformation.hasQualityFeedbackOutstanding = false;
                        this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                    }
                    break;
                case actionType.CHANGE_EXAMINER_STATUS:
                    let changeExaminerStatus = (action as changeExaminerStatusAction);
                    if (changeExaminerStatus.examinerStatusReturn.success) {
                        this.markerInformation.approvalStatus =
                            changeExaminerStatus.examinerStatusReturn.examinerDetails.approval_Status;
                        this.updateApprovalStatus();
                    }
                    this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                    break;
                case actionType.PROVIDE_SECOND_STANDARDISATION:
                    let provideSecondStandardisation = (action as provideSecondStandardisationAction);
                    if (provideSecondStandardisation.secondStandardisationReturn.success) {
                        this.markerInformation.approvalStatus =
                            provideSecondStandardisation.secondStandardisationReturn.approvalStatus;
                        this.updateApprovalStatus();
                    }
                    this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    let markerOperationMode: markerOperationModeChangedAction = (action as markerOperationModeChangedAction);
                    this._operationMode = markerOperationMode.operationMode;
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    let responseDataGetAction = action as responseDataGetAction;

                    if (responseDataGetAction.searchedResponseData) {
                        // Set marking in case of Supervisor Remark navigation. Else set based on the team management access
                        if (responseDataGetAction.searchedResponseData.triggerPoint === enums.TriggerPoint.SupervisorRemark) {
                            this._operationMode = enums.MarkerOperationMode.Marking;
                        } else if (responseDataGetAction.searchedResponseData.isTeamManagement) {
                            this._operationMode = enums.MarkerOperationMode.TeamManagement;
                        }
                    }
                    break;
            }
        });
    }

    /**
     * This will returns the formatted the examiner name
     */
    private formattedExaminerName(): string {
        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', this.markerInformation.initials);
        formattedString = formattedString.replace('{surname}', this.markerInformation.surname);

        return formattedString;
    }

    /**
     * This will returns the formatted supervisor name
     */
    public get formattedSupervisorName(): string {
        if (this.markerInformation.supervisorSurname === '' || this.markerInformation.supervisorSurname === undefined) {
            return '';
        }

        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', this.markerInformation.supervisorInitials);
        formattedString = formattedString.replace('{surname}', this.markerInformation.supervisorSurname);

        return formattedString;
    }

    /**
     * This will returns the formatted es parent name
     */
    public get formattedEsReviewerName(): string {
        if (this.markerInformation.esReviewerSurname === '' || this.markerInformation.esReviewerSurname === undefined) {
            return '';
        }

        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', this.markerInformation.esReviewerInitials);
        formattedString = formattedString.replace('{surname}', this.markerInformation.esReviewerSurname);

        return formattedString;
    }

    /**
     * This method will return the supervisor online status.
     */
    private supervisorLoginStatus(): boolean {
        // if isLoggedOut field is true or logout date is -1 (not loggedin yet) then return false
        // or if last updated logout date is greater than 10 minutes - ( close browser without proper logout)
        if (this.markerInformation.isSupervisorLoggedOut || this.markerInformation.supervisorLogoutDiffInMinute === -1 ||
            this.markerInformation.supervisorLogoutDiffInMinute > 10) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * This will return the Marker information.
     * @returns markerInformation
     */
    public get getMarkerInformation(): markerinformation {
        return this.markerInformation;
    }

    /**
     * This method will return the parent examiner Id
     */
    public get parentExaminerId(): number {
        if (this.markerInformation !== undefined) {
            return this.markerInformation.supervisorExaminerId !== undefined ? this.markerInformation.supervisorExaminerId : 0;
        } else {
            return 0;
        }
    }

    /**
     * Return the approval status collection
     * @param examinerRoleId number
     */
    public examinerApprovalStatus(examinerRoleId: number): enums.ExaminerApproval {
        if (this._examinerApprovalStatuses) {
            // If examinerRoleId (key) not found in dictionary then return approval status None.
            return this._examinerApprovalStatuses.get(examinerRoleId, enums.ExaminerApproval.None);
        } else {
            return enums.ExaminerApproval.None;
        }
    }

    /**
     * Collection of approval status against examinerRoleId
     * @param examinerRoleId
     * @param approvalStatus
     */
    public updateExaminerApprovalStatus = (examinerRoleId: number, approvalStatus: enums.ExaminerApproval) => {
        // Dictionary already contains the key then update the value otherwise add a new entry.
        this._examinerApprovalStatuses = this._examinerApprovalStatuses.set(examinerRoleId, approvalStatus);
    };

    /**
     * This will update the examiner approval status.
     */
    private updateApprovalStatus = () => {
        this.updateExaminerApprovalStatus(this.markerInformation.examinerRoleId, this.markerInformation.approvalStatus);
    }

    /**
     * This will update the supervisor examiner approval status.
     */
    private updateSupervisorApprovalStatus = () => {
        this.updateExaminerApprovalStatus(this.markerInformation.supervisorExaminerRoleId,
            this.markerInformation.currentExaminerApprovalStatus);
    }
}

let instance = new ExaminerStore();
export = { ExaminerStore, instance };