import storeBase = require('../base/storebase');
import loginStore = require('../login/loginstore');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import worklistTypeAction = require('../../actions/worklist/worklisttypeaction');
import candidateScriptInfo = require('../../dataservices/script/typings/candidatescriptinfo');
import enums = require('../../components/utility/enums');
import responseModeChangeAction = require('../../actions/worklist/responsemodechangeaction');
import responseCloseAction = require('../../actions/worklist/responsecloseaction');
import targetSummaryStore = require('./targetsummarystore');
import markingTargetSummary = require('./typings/markingtargetsummary');
import examinerProgress = require('./typings/examinerprogress');
import submitResponseCompletedAction = require('../../actions/submit/submitresponsecompletedaction');
import responseOpenAction = require('../../actions/response/responseopenaction');
import responseDataGetAction = require('../../actions/response/responsedatagetaction');
import qigSelectorAction = require('../../actions/qigselector/qigselectoraction');
import qigSelectorDataFetchAction = require('../../actions/qigselector/qigselectordatafetchaction');
import qigSummary = require('../qigselector/typings/qigsummary');
import acceptQualityFeedbackAction = require('../../actions/response/acceptqualityfeedbackaction');
import sendMessageAction = require('../../actions/messaging/sendmessageaction');
import overviewData = require('../qigselector/typings/overviewdata');
import responsesortdetails = require('../../components/utility/grid/responsesortdetails');
import comparerlist = require('../../utility/sorting/sortbase/comparerlist');
import sortClickAction = require('../../actions/worklist/sortaction');
import setSelectedQuestionItemAction = require('../../actions/marking/setselectedquestionitemaction');
import markerOperationModeChangedAction = require('../../actions/userinfo/markeroperationmodechangedaction');
import isLastNodeSelectedAction = require('../../actions/marking/islastnodeselectedaction');
import setResponseAsReviewedAction = require('../../actions/teammanagement/setasreviewedaction');
import markingCheckInfoFetchAction = require('../../actions/markingcheck/markingcheckinformationfetchaction');
import markingCheckRecipientFetchAction = require('../../actions/markingcheck/markingcheckrecipientsfetchaction');
import toggleMarkingCheckModeAction = require('../../actions/markingcheck/togglemarkingcheckmodeaction');
import worklistHistoryInfoAction = require('../../actions/worklist/worklisthistoryinfoaction');
import getMarkingCheckWorklistAccessStatusAction = require('../../actions/worklist/getmarkingcheckworklistaccessstatusaction');
import worklistSeedFilterAction = require('../../actions/worklist/worklistseedfilteraction');
import Immutable = require('immutable');
import stringFormatHelper = require('../../utility/stringformat/stringformathelper');
import sortHelper = require('../../utility/sorting/sorthelper');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import popupDisplayAction = require('../../actions/popupdisplay/popupdisplayaction');
import markingCheckWorklistGetAction = require('../../actions/worklist/markingcheckworklistgetaction');
import getMarkCheckExaminersAction = require('../../actions/markingcheck/getmarkcheckexaminersaction');
import constants = require('../../components/utility/constants');
import updateResponseAction = require('../../actions/response/updateresponseaction');
import teamManagementHistoryInfoAction = require('../../actions/teammanagement/teammanagementhistoryinfoaction');
import markingCheckCompleteAction = require('../../actions/worklist/markingcheckcompleteaction');
import promoteToSeedAction = require('../../actions/response/promotetoseedaction');
import setRememberQigAction = require('../../actions/useroption/setrememberqigaction');
import samplingStatusChangeAction = require('../../actions/sampling/samplingstatuschangeaction');
import supervisorRemarkDecision = require('../../dataservices/response/supervisorremarkdecision');
import removeResponseAction = require('./../../actions/worklist/removeresponseaction');
import ccValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import tagUpdateAction = require('../../actions/tag/tagupdateaction');
import tagListClickAction = require('../../actions/tag/taglistclickaction');
import backgroundPulseAction = require('../../actions/backgroundpulse/backgroundpulseaction');
import promoteToReusBucketAction = require('../../actions/response/promotetoreusebucketaction');
import getUnActionedExceptionAction = require('./../../actions/teammanagement/getunactionedexceptionaction');
import updateExceptionStatusAction = require('../../actions/exception/updateexceptionstatusaction');
import raiseExceptionAction = require('../../actions/exception/raiseexceptionaction');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');

class WorkListStore extends storeBase {
    private workListType: enums.WorklistType;
    private responseMode: enums.ResponseMode;
    private remarkRequestType: enums.RemarkRequestType;
    private liveOpenWorklistDetails: LiveOpenWorklist;
    private simulationOpenWorklistDetails: SimulationOpenWorklist;
    private liveClosedWorklistDetails: LiveClosedWorklist;
    private liveClosedFilteredWorklistDetails: LiveClosedWorklist;
    private pendingWorkListDetails: PendingWorklist;
    private practiceOpenWorkList: PracticeOpenWorklist;
    private practiceClosedWorkList: PracticeClosedWorklist;
    private isSuccess: boolean;
    public static WORKLIST_MARKING_MODE_CHANGE = 'GetLiveWorklist';
    public static DO_GET_MARKING_CHECK_INFO = 'MarkCheckUpdatedEvent';
    public static MARKING_CHECK_COMPLETED_EVENT = 'MarkingCheckCompletedEvent';
    public static MARKING_CHECK_FAILURE_EVENT = 'MarkingCheckFailureEvent';
    public static WORKLIST_COUNT_CHANGE = 'WorklistCountChange';
    public static SETSCROLL_WORKLIST_COLUMNS = 'SetScrollWorklistColumns';
    public static RESPONSE_CLOSED = 'ResponseClosed';
    public static SUPERVISOR_SAMPLING_FAILURE_EVENT = 'SupervisorSamplingFailureEvent';
    private isResponseClose: boolean;
    private standardisationOpenWorklistDetails: StandardisationOpenWorklist;
    private standardisationClosedWorklistDetails: StandardisationClosedWorklist;
    private secondStandardisationOpenWorklistDetails: StandardisationOpenWorklist;
    private secondStandardisationClosedWorklistDetails: StandardisationClosedWorklist;
    private candidateScriptInfoCollection: Immutable.List<candidateScriptInfo>;
    private isAutoRefreshCallForMetaDataLoad: boolean;
    private markingTargetsSummary: Immutable.List<markingTargetSummary>;
    private directedRemarkOpenWorkList: DirectedRemarkOpenWorklist;
    private directedRemarkClosedWorkList: DirectedRemarkClosedWorklist;
    private directedRemarkPendingWorklist: DirectedRemarkPendingWorkList;
    private pooledRemarkOpenWorkList: PooledRemarkOpenWorklist;
    private pooledRemarkClosedWorkList: PooledRemarkClosedWorklist;
    private pooledRemarkPendingWorklist: PooledRemarkPendingWorkList;
    private atypicalOpenWorklistDetails: DirectedRemarkOpenWorklist;
    private atypicalPendingWorklistDetails: DirectedRemarkPendingWorkList;
    private atypicalClosedWorklistDetails: DirectedRemarkClosedWorklist;
    private _isWorklistRefreshRequired: boolean = false;
    public _responseSortDetails: Array<responsesortdetails>;
    private _selectedQig: qigSummary;
    private _qigOverviewData: overviewData;
    private _isDirectedRemark: boolean;
	private _selectedQuestionItemBIndex: number = 0;
	private _selectedQuestionItemUniqueId: number = 0;
    private _isLastNodeSelected: boolean = false;
    private _markingCheckStatus: enums.MarkingCheckStatus;
    private _markingCheckRecipientList: Immutable.List<MarkingCheckRecipient>;
    private _isMarkingCheckAvailable: boolean = false;
    // contains examinerRoleId: number, selectedFilter: enums.WorklistSeedFilter collections
    private _selectedFilterDetails: Immutable.Map<number, enums.WorklistSeedFilter> = Immutable.Map<number, enums.WorklistSeedFilter>();
    private allowBackGroundPulseEventEmission: boolean = true;

    public static SHOW_RETURN_TO_WORKLIST_CONFIRMATION = 'ShowReturnToWorklistConfirmation';
    public static RESPONSE_REVIEWED = 'ResponseReviewed';
    public static WORKLIST_HISTORY_INFO_UPDATED = 'WorklistHistoryInfoUpdated';
    public static MARKING_CHECK_RECIPIENT_LIST_UPDATED = 'MarkingCheckRecipientListUpdated';
    public static MARKING_CHECK_STATUS_UPDATED = 'MarkingCheckStatusUpdated';
    public static MARKING_CHECK_WORKLIST_ACCESS_STATUS_UPDATED = 'MarkingCheckWorklistAccessStatusUpdated';
    public static NO_MARKING_CHECK_AVAILABLE_MESSAGE = 'NoMarkingCheckAvailableMessage';
    public static WORKLIST_FILTER_CHANGED = 'WorklistFilterChanged';
    public static MARKING_CHECK_EXAMINER_SELECTION_UPDATED = 'MarkingCheckExaminerSelectionUpdated';
    public static MARK_CHECK_EXAMINERS_DATA_RETRIVED = 'MarkCheckExaminersDataRetrived';

    private _isMarkingCheckWorklistAccessPresent: boolean = false;
    public static TOGGLE_REQUEST_MARKING_CHECK_BUTTON_EVENT = 'ToggleRequestMarkingCheckButtonEvent';
    private _sortedMarkingCheckExaminerList: Immutable.List<MarkingCheckExaminerInfo>;
    public static MARKING_CHECK_COMPLETE_BUTTON_EVENT = 'MarkingCheckCompleteButtonEvent';
    private _markCheckExaminersList: MarkingCheckExaminersList;
    private _markingCheckFailureCode: enums.FailureCode = enums.FailureCode.None;
    private _comparerName: string;
    private _sortDirection: enums.SortDirection;
    private _isMarkingCheckMode: boolean;
    private _markingCheckResponseMode: enums.ResponseMode;
    public static TAG_UPDATED_EVENT = 'TagUpdatedEvent';
    public static TAG_LIST_CLICKED = 'TagListClickedEvent';
    public static STANDARDISATION_SETUP_COMPLETED_IN_BACKGROUND = 'StandardisationSetupCompletedInBackgroundEvent';
    public static SIMULATION_TARGET_COMPLETED_EVENT = 'SimulationTargetCompletedEvent';
    private storageAdapterHelper = new storageAdapterHelper();

    /**
     * Constructor for worklist store
     */
    constructor() {
        super();
        /** Emitting after clicking live list */
        this._responseSortDetails = new Array<responsesortdetails>();
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.WORKLIST_MARKING_MODE_CHANGE:
                    let worklistTypeActionOnMarkingModeChange = (action as worklistTypeAction);
                    this.isSuccess = worklistTypeActionOnMarkingModeChange.success;
                    if (this.isSuccess) {
                        /* setting the marking mode */
                        this.workListType = worklistTypeActionOnMarkingModeChange.getWorklistType;
                        if (this.isMarkingCheckMode) {
                            this._markingCheckResponseMode = worklistTypeActionOnMarkingModeChange.getResponseMode;
                        } else {
                            this.responseMode = worklistTypeActionOnMarkingModeChange.getResponseMode;
                        }
                        this.remarkRequestType = worklistTypeActionOnMarkingModeChange.getRemarkRequestType;
                        this._isDirectedRemark = worklistTypeActionOnMarkingModeChange.getIsDirectedRemark;
                        this.setWorklistDetails(
                            worklistTypeActionOnMarkingModeChange.getWorklistData,
                            worklistTypeActionOnMarkingModeChange.getselectedExaminerRoleId,
                            worklistTypeActionOnMarkingModeChange.gethasComplexOptionality);
                    }
                    // reset response opened from linked message link flag
                    this._isWorklistRefreshRequired = false;
                        this.emit(WorkListStore.WORKLIST_MARKING_MODE_CHANGE,
                            worklistTypeActionOnMarkingModeChange.getMarkSchemeGroupId,
                            worklistTypeActionOnMarkingModeChange.getQuestionPaperId);
                    this.updateResponseSortCollection(
                        this.workListType,
                        this.getResponseMode,
                        this.remarkRequestType,
                        worklistTypeActionOnMarkingModeChange.getMarkSchemeGroupId);
                    break;
                case actionType.RESPONSE_MODE_CHANGED:
                    let responseModeChangeAction = (action as responseModeChangeAction);

                    /* setting the response mode */
                    if (this.isMarkingCheckMode) {
                        this._markingCheckResponseMode = responseModeChangeAction.getResponseMode;
                    } else{
                        this.responseMode = responseModeChangeAction.getResponseMode;
                    }

                    if (this._sortedMarkingCheckExaminerList && responseModeChangeAction.isMarkingCheckMode) {
                        this._sortedMarkingCheckExaminerList.filter((marker: MarkingCheckExaminerInfo) =>
                            marker.isSelected).first().selectedTab = this.getResponseMode;
                    }
                    break;
                case actionType.RESPONSE_CLOSE:
                    /* setting the response close flag, this is to differentiate that the worklist is loading after response close event */
                    this.isResponseClose = (action as responseCloseAction).getIsResponseClose;
                    // reset the selected question item when the response is closed
                    this._selectedQuestionItemBIndex = 0;
                    this._selectedQuestionItemUniqueId = 0;
                    this.emit(WorkListStore.RESPONSE_CLOSED);
                    break;
                case actionType.SUBMIT_RESPONSE_COMPLETED:
                    let submitResponseCompletedAction: submitResponseCompletedAction = action as submitResponseCompletedAction;
                    if (submitResponseCompletedAction.getSubmitResponseReturnDetails.hasQualityFeedbackOutstanding) {
                        this.responseMode = enums.ResponseMode.closed;
                    }
                    break;
                case actionType.SETSCROLL_WORKLISTCOLUMNS_ACTION:
                    this.emit(WorkListStore.SETSCROLL_WORKLIST_COLUMNS);
                    break;
                case actionType.MESSAGE_STATUS_UPDATE_ACTION:
                    // if message status is updated then we have to refresh the worklist to reflect the linked messages count
                    this._isWorklistRefreshRequired = true;
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    let responseDataGetAction = action as responseDataGetAction;
                    if (responseDataGetAction.searchedResponseData) {
                        if (responseDataGetAction.searchedResponseData.triggerPoint !== enums.TriggerPoint.DisplayIdSearch) {
                            this.setWorklistDetails(undefined, 0);
                            this.workListType = undefined;
                            this.responseMode = responseDataGetAction.searchedResponseData.responseMode;
                        }
                        this._isDirectedRemark = responseDataGetAction.searchedResponseData.isDirectedRemark;
                        this._isMarkingCheckMode = false;
                        if (responseDataGetAction.searchedResponseData.triggerPoint !== enums.TriggerPoint.SupervisorRemark
                            && !responseDataGetAction.searchedResponseData.isTeamManagement
                            && !responseDataGetAction.searchedResponseData.isStandardisationSetup
                            && responseDataGetAction.searchedResponseData.loggedInExaminerId !==
                            responseDataGetAction.searchedResponseData.examinerId) {
                            this._isMarkingCheckMode = true;
                        }
                    }
                    break;
                case actionType.QIGSELECTOR:
                    // marking checks needs to be re evaluated based on approval status and role in each QIG
                    this._isMarkingCheckAvailable = false;
                    let qigSelectorDataFetchAction: qigSelectorDataFetchAction = (action as qigSelectorDataFetchAction);
                    this.isSuccess = qigSelectorDataFetchAction.success;
                    if (this.isSuccess) {
                        this._qigOverviewData = qigSelectorDataFetchAction.getOverviewData;
                        if (qigSelectorDataFetchAction.getQigToBeFetched !== 0) {
                            this._selectedQig = qigSelectorDataFetchAction.getOverviewData.qigSummary.filter((x: qigSummary) =>
                                x.markSchemeGroupId === qigSelectorDataFetchAction.getQigToBeFetched).first();
                            if (this._selectedQig && this._selectedQig.hasQualityFeedbackOutstanding &&
                                this._selectedQig.qualityFeedbackOutstandingSeedTypeId === enums.SeedType.EUR) {
                                this.remarkRequestType = enums.RemarkRequestType.EnquiryUponResult;
                                this.workListType = enums.WorklistType.directedRemark;
                            }
                        }
                    }
                    break;
                case actionType.SEND_MESSAGE_ACTION:
                    let sendMessageReturnAction: sendMessageAction = (action as sendMessageAction);
                    let success: boolean = sendMessageReturnAction.success;
                    let messagePriority: number = sendMessageReturnAction.messagePriority;
                    let examBodyTypeId: enums.SystemMessage = sendMessageReturnAction.examBodyTypeId;
                    this._markingCheckFailureCode = sendMessageReturnAction.failureCode;
                    if (success) {
                        this._isWorklistRefreshRequired = true;
                        if (messagePriority === constants.SYSTEM_MESSAGE && examBodyTypeId === enums.SystemMessage.CheckMyMarks) {
                            this.emit(WorkListStore.DO_GET_MARKING_CHECK_INFO);
                        } else if (messagePriority === constants.SYSTEM_MESSAGE && examBodyTypeId === enums.SystemMessage.MarksChecked) {
                            this.emit(WorkListStore.MARKING_CHECK_COMPLETED_EVENT);
                        }
                    }
                    break;

                case actionType.CLOSE_EXCEPTION:
                    this._isWorklistRefreshRequired = true;
                    break;
                case actionType.MARK:
                    this._selectedQig = this._qigOverviewData.qigSummary.filter((x: qigSummary) =>
                        x.markSchemeGroupId === (action as qigSelectorAction).getSelectedQigId()).first();
                    if (this._selectedQig && this._selectedQig.hasQualityFeedbackOutstanding &&
                        this._selectedQig.qualityFeedbackOutstandingSeedTypeId === enums.SeedType.EUR) {
                        this.remarkRequestType = enums.RemarkRequestType.EnquiryUponResult;
                        this.workListType = enums.WorklistType.directedRemark;
                    } else if (loginStore.instance.isAdminRemarker) {
                        this.remarkRequestType = enums.RemarkRequestType.PooledAdminRemark;
                        this.workListType = enums.WorklistType.pooledRemark;
                    } else {
                        this.remarkRequestType = enums.RemarkRequestType.Unknown;
                        this.workListType = enums.WorklistType.none;
                    }
                    break;
                case actionType.RAISE_EXCEPTION_ACTION:
                    this._isWorklistRefreshRequired = true;
                    break;
                case actionType.SORT_ACTION:
                    let _sortClickAction: sortClickAction = (action as sortClickAction);
                    let _sortDetails: responsesortdetails = _sortClickAction.getResponseSortDetails;
                    for (var i = 0; i < this._responseSortDetails.length; i++) {

                        if (this._responseSortDetails[i].qig === _sortDetails.qig &&
                            this._responseSortDetails[i].responseMode === _sortDetails.responseMode
                            && this._responseSortDetails[i].worklistType === _sortDetails.worklistType
                            && this._responseSortDetails[i].remarkRequestType === _sortDetails.remarkRequestType) {

                            if (_sortDetails.comparerName) {
                                this._responseSortDetails[i].comparerName = _sortDetails.comparerName;
                                this._responseSortDetails[i].sortDirection = _sortDetails.sortDirection;
                            }
                        }
                    }
                    break;
                case actionType.SET_SELECTED_QUESTION_ITEM_ACTION:
                    let selectedQuestionItemAction = action as setSelectedQuestionItemAction;
                    this._selectedQuestionItemBIndex = selectedQuestionItemAction.getSelectedQuestionItemIndex;
                    this._selectedQuestionItemUniqueId = selectedQuestionItemAction.getSelectedQuestionItemUniqueId;
                    break;
                case actionType.UPDATE_EXAMINER_DRILL_DOWN_DATA:
                    // we need to clear the worklist type while loading teammanagement worklist
                    this.workListType = undefined;
                    break;
                case actionType.IS_LAST_NODE_SELECTED_ACTION:
                    let isLastNodeSelectedAction = action as isLastNodeSelectedAction;
                    this._isLastNodeSelected = isLastNodeSelectedAction.isLastNodeSelected;
                    break;
                case actionType.SHOW_RETURN_TO_WORKLIST_CONFIRMATION_ACTION:
                    this.emit(WorkListStore.SHOW_RETURN_TO_WORKLIST_CONFIRMATION);
                    break;
                case actionType.SET_RESPONSE_AS_REVIEWED_ACTION:
                    let reviewedResponseDetails = action as setResponseAsReviewedAction;
                    this.setCurrentResponseAsReviewed(reviewedResponseDetails.ReviewedResponseDetails);
                    this.emit(WorkListStore.RESPONSE_REVIEWED, reviewedResponseDetails.ReviewedResponseDetails);
                    break;
                case actionType.SAMPLING_STATUS_CHANGE_ACTION:
                    let _samplingStatusChangeAction = action as samplingStatusChangeAction;
                    if (_samplingStatusChangeAction.success) {
                        this.setCurrentResponseAsSampled(_samplingStatusChangeAction.supervisorSamplingCommentReturn,
                            _samplingStatusChangeAction.displayId);
                    }
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    //The default tab for team management should be closed. Hence removing the tab selected while in marking
                    // If the action is fired from Menu- need not reset the responsemode to undefined.
                    let markerOperationModeChangedAction = (action as markerOperationModeChangedAction);
                    this.responseMode = undefined;
                    this.workListType = undefined;
                    this._isMarkingCheckWorklistAccessPresent = undefined;
                    break;
                case actionType.GET_MARKING_CHECK_INFORMATION:
                    let markingCheckInfoFetchAction = (action as markingCheckInfoFetchAction);
                    this._markingCheckStatus = markingCheckInfoFetchAction.MarkingCheckInfo.markingCheckStatus;
                    this._isMarkingCheckAvailable = markingCheckInfoFetchAction.MarkingCheckInfo.isMarkingCheckAvailable;
                    this.emit(WorkListStore.MARKING_CHECK_STATUS_UPDATED);
                    break;
                case actionType.GET_MARKING_CHECK_RECIPIENTS:
                    this._markingCheckRecipientList = null;
                    let markingCheckRecipientInfo = (action as markingCheckRecipientFetchAction);
                    this.setMarkingCheckPopupData((markingCheckRecipientInfo.MarkingCheckRecipientList) as Array<MarkingCheckRecipient>);
                    this.emit(WorkListStore.MARKING_CHECK_RECIPIENT_LIST_UPDATED);
                    break;
                case actionType.WORKLIST_HISTORY_INFO:
                    let _setWorklistHistoryInfoAction = action as worklistHistoryInfoAction;
                    let _historyItem = _setWorklistHistoryInfoAction.historyItem;
                    let _markingMode = _setWorklistHistoryInfoAction.markingMode;
                    if (_markingMode === enums.MarkerOperationMode.Marking) {
                        this.responseMode = _historyItem.myMarking.responseMode;
                        this.workListType = _historyItem.myMarking.worklistType;
                        this.remarkRequestType = _historyItem.myMarking.remarkRequestType;
                    } else if (_markingMode === enums.MarkerOperationMode.TeamManagement) {

                        this.responseMode = _historyItem.team.responseMode;
                        this.workListType = _historyItem.team.worklistType;
                        this.remarkRequestType = _historyItem.team.remarkRequestType;
                        this.emit(WorkListStore.WORKLIST_HISTORY_INFO_UPDATED, _historyItem, _markingMode);
                    }
                    break;
                case actionType.MARKING_CHECK_WORKLIST_ACCESS_ACTION:
                    let _getMarkingCheckWorklistAccessStatusAction = action as getMarkingCheckWorklistAccessStatusAction;
                    this._isMarkingCheckWorklistAccessPresent =
                        _getMarkingCheckWorklistAccessStatusAction.isMarkingCheckWorklistAccessPresent;
                    this.emit(WorkListStore.MARKING_CHECK_WORKLIST_ACCESS_STATUS_UPDATED);
                    break;
                case actionType.POPUPDISPLAY_ACTION:
                    let popUpDisplayAction = (action as popupDisplayAction);
                    let popupType = popUpDisplayAction.getPopUpType;
                    let popupActionType = popUpDisplayAction.getPopUpActionType;
                    let navigatingFrom = popUpDisplayAction.navigateFrom;
                    let popUpData = popUpDisplayAction.getPopUpData;
                    this.emit(WorkListStore.NO_MARKING_CHECK_AVAILABLE_MESSAGE, popupType, popupActionType, popUpData);
                    break;
                case actionType.WORKLIST_FILTER_SELECTED:
                    let seedFilterAction = (action as worklistSeedFilterAction);
                    this.updateFilterStatus(seedFilterAction.getExaminerRoleId, seedFilterAction.getSelectedFilter);
                    this.setFilteredResponses(this.liveClosedWorklistDetails, seedFilterAction.getExaminerRoleId);
                    this.emit(WorkListStore.WORKLIST_FILTER_CHANGED, seedFilterAction.getSelectedFilter);
                    break;
                case actionType.MARKING_CHECK_EXAMINER_WORKLIST_GET:
                    let markingCheckWorklistFetchAction = (action as markingCheckWorklistGetAction);
                    this.updateMarkingCheckSelectedExaminer(markingCheckWorklistFetchAction.examinerId);
                    this.emit(WorkListStore.MARKING_CHECK_EXAMINER_SELECTION_UPDATED);
                    break;
                case actionType.GET_MARK_CHECK_EXAMINERS:

                    let _getMarkingCheckExaminersAction = action as getMarkCheckExaminersAction;
                    if (_getMarkingCheckExaminersAction.success &&
                        _getMarkingCheckExaminersAction.markCheckExaminersData) {

                        let markingCheckExaminersData: MarkingCheckExaminersList;
                        markingCheckExaminersData = _getMarkingCheckExaminersAction.markCheckExaminersData;

                        if (markingCheckExaminersData.markCheckRequestedExaminersDetails &&
                            markingCheckExaminersData.markCheckRequestedExaminersDetails.length > 0) {
                            this._sortedMarkingCheckExaminerList = Immutable.List<MarkingCheckExaminerInfo>(sortHelper.sort(
                                markingCheckExaminersData.markCheckRequestedExaminersDetails,
                                comparerList.MarkCheckExaminersComparer));

                            this._sortedMarkingCheckExaminerList.first().isSelected = true;
                            this._isMarkingCheckMode = true;
                            this.workListType = enums.WorklistType.live;
                        } else {
                            this._sortedMarkingCheckExaminerList = undefined;
                            this._isMarkingCheckMode = false;
                        }

                        this.emit(WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED);
                    }
                    break;
                case actionType.TOGGLE_MARKING_CHECK_MODE:
                    let _markingCheckModeToggleAction = action as toggleMarkingCheckModeAction;
                    this._isMarkingCheckMode = _markingCheckModeToggleAction.MarkingCheckModeValue;
                    break;
                case actionType.TOGGLE_REQUEST_MARKING_CHECK_BUTTON_ACTION:
                    this.emit(WorkListStore.TOGGLE_REQUEST_MARKING_CHECK_BUTTON_EVENT);
                    break;
                case actionType.TEAM_MANAGEMENT_HISTORY_INFO_ACTION:
                    let _setTeamManagementHistoryInfoAction = action as teamManagementHistoryInfoAction;
                    if (_setTeamManagementHistoryInfoAction.markingMode === enums.MarkerOperationMode.TeamManagement) {
                        this.responseMode = _setTeamManagementHistoryInfoAction.historyItem.team.responseMode;
                        this.workListType = _setTeamManagementHistoryInfoAction.historyItem.team.worklistType;
                        this.remarkRequestType = _setTeamManagementHistoryInfoAction.historyItem.team.remarkRequestType;
                    }
                    break;
                case actionType.REJECT_RIG_REMOVE_RESPONSE_ACTION:
                    let updateResponseAction = action as updateResponseAction;
                    this.clearResponseDetailsByMarkGroupId(updateResponseAction.markGroupID, updateResponseAction.worklistType);
                    break;
                case actionType.MARKING_CHECK_COMPLETE_ACTION:
                    this.emit(WorkListStore.MARKING_CHECK_COMPLETE_BUTTON_EVENT);
                    break;
                case actionType.SET_REMEMBER_QIG:
                    let _setRememberQigAction = action as setRememberQigAction;
                    this.workListType = _setRememberQigAction.rememberQig.worklistType;
                    this.remarkRequestType = _setRememberQigAction.rememberQig.remarkRequestType;
                    break;
                case actionType.PROMOTE_TO_SEED:
                    let promoteToSeedAction = action as promoteToSeedAction;
                    if (promoteToSeedAction.promoteToSeedReturn.promoteToSeedError === enums.PromoteToSeedErrorCode.None
                        && this.getResponseMode === enums.ResponseMode.closed) {
                        this.updateResponseCollectionAfterPromoteSeed(promoteToSeedAction.promoteToSeedReturn.promotedSeedMarkGroupIds[0]);
                    }
                    break;
                case actionType.REMOVE_RESPONSE:
                    let removeResponseAction = action as removeResponseAction;
                    this.removeResponseFromWorklistDetails(removeResponseAction.worklistType, removeResponseAction.responseMode,
                        removeResponseAction.displayId);
                    break;
                case actionType.TAG_UPDATE:
                    let tagUpdateAction = (action as tagUpdateAction);
                    if (tagUpdateAction.success) {
                        this.emit(WorkListStore.TAG_UPDATED_EVENT, tagUpdateAction.tagId, tagUpdateAction.markGroupId);
                        this.updateTagId(tagUpdateAction.tagId, tagUpdateAction.tagOrder, tagUpdateAction.markGroupId);
                        this.storageAdapterHelper.clearStorageArea('worklist');
                    }
                    break;
                case actionType.TAG_LIST_CLICK:
                    // Logic to hide any tag list which is expanded(other than the clicked one.)
                    let tagListClickAction = (action as tagListClickAction);
                    this.emit(WorkListStore.TAG_LIST_CLICKED, tagListClickAction.markGroupId);
                    break;
                case actionType.SIMULATION_TARGET_COMPLETED:
                    this.workListType = undefined;
                    this.emit(WorkListStore.SIMULATION_TARGET_COMPLETED_EVENT);
                    break;
                case actionType.BACKGROUND_PULSE:
                    let backgroundPulse = action as backgroundPulseAction;
                    if (backgroundPulse.getNotificationData.getCoordinationCompleteBit && this.allowBackGroundPulseEventEmission
                        && this.workListType === enums.WorklistType.simulation) {
                        this.emit(WorkListStore.STANDARDISATION_SETUP_COMPLETED_IN_BACKGROUND);
                        this.allowBackGroundPulseEventEmission = false;
                    }
                    break;
                case actionType.PROMOTE_TO_REUSE_BUCKET_ACTION:
                    let promoteToReuseBucketAction = action as promoteToReusBucketAction;
                    if (this.getResponseMode === enums.ResponseMode.closed && promoteToReuseBucketAction.isPromotedToReuseBucketSuccess) {
                        this.updateResponseCollectionAfterPromoteReuseBucket
                            (promoteToReuseBucketAction.markGroupId);
                    }
                    break;
                case actionType.GET_UNACTIONED_EXCEPTION_ACTION:
                    if ((action as getUnActionedExceptionAction).isFromResponse) {
                        this.responseMode = undefined;
                        this.workListType = undefined;
                    }
                    break;
                case actionType.UPDATE_EXCEPTION_STATUS:
                    let updatedExceptionStatus = (action as updateExceptionStatusAction);
                    let exceptionActionType = updatedExceptionStatus.exceptionActionType;
                    if (updatedExceptionStatus.exceptionId !== undefined &&
                        (exceptionActionType === enums.ExceptionActionType.Close)) {
                        this.updateResolvedExceptionCount(updatedExceptionStatus.displayId);
                    }
                    break;
            }
        });
    }

    /**
     * Update a particular response item from local collection and set isPromoteToReusebucket true
     * @param {enums.WorklistType} selectedMarkGroupId
     * @returns updated collection
     */
    public updateResponseCollectionAfterPromoteReuseBucket(selectedMarkGroupId) {
        if (this.workListType === enums.WorklistType.live) {
            this.liveClosedWorklistDetails.responses.find((x: any) =>
                x.markGroupId === selectedMarkGroupId).isPromotedToReuseBucket = true;
        } else if (this.workListType === enums.WorklistType.directedRemark) {
            this.directedRemarkClosedWorkList.responses.find((x: any) =>
                x.markGroupId === selectedMarkGroupId).isPromotedToReuseBucket = true;
        } else if (this.workListType === enums.WorklistType.pooledRemark) {
            this.pooledRemarkClosedWorkList.responses.find((x: any) =>
                x.markGroupId === selectedMarkGroupId).isPromotedToReuseBucket = true;
        }
    }

    /**
     * Updates selected examiner in marking check requester collection
     * @param examinerId : Selected Examiner
     */
    private updateMarkingCheckSelectedExaminer = (examinerId: number) => {
        if (this._sortedMarkingCheckExaminerList) {
            this._sortedMarkingCheckExaminerList.forEach(function (examiner) {
                if (examiner.fromExaminerID === examinerId) {
                    examiner.isSelected = true;
                } else {
                    examiner.isSelected = false;
                }
            });
        }
    };

    /**
     * Filter Changed
     * @param examinerRoleId
     * @param selectedFilter
     */
    private updateFilterStatus = (examinerRoleId: number, selectedFilter: enums.WorklistSeedFilter) => {
        this._selectedFilterDetails = this._selectedFilterDetails.set(examinerRoleId, selectedFilter);
    };

    public get getSelectedFilterDetails() {
        return this._selectedFilterDetails;
    }

    /**
     * Set the Filtered Responses for closed
     * @param worklist
     * @param selectedExaminerRoleId
     */
    private setFilteredResponses(worklist: WorklistBase, selectedExaminerRoleId: number) {
        let selectedFilter: enums.WorklistSeedFilter =
            this._selectedFilterDetails.get(selectedExaminerRoleId, enums.WorklistSeedFilter.All);
        let worklistBaseCloned: WorklistBase = {
            hasNumericMark: worklist.hasNumericMark,
            hasSeedTargets: worklist.hasSeedTargets,
            maximumMark: worklist.maximumMark,
            responses: undefined
        };

        switch (selectedFilter) {
            case enums.WorklistSeedFilter.All:
                this.liveClosedFilteredWorklistDetails = this.liveClosedWorklistDetails;
                break;
            case enums.WorklistSeedFilter.UnreviewedSeedsOnly:
                worklistBaseCloned.responses = Immutable.List<ResponseBase>(worklist.responses.filter((x: LiveClosedResponse) =>
                    x.seedTypeId === enums.SeedType.Gold && x.reviewedById < 1));
                this.liveClosedFilteredWorklistDetails = worklistBaseCloned;
                break;
            case enums.WorklistSeedFilter.SeedsOnly:
                worklistBaseCloned.responses = Immutable.List<ResponseBase>(worklist.responses.filter((x: LiveClosedResponse) =>
                    x.seedTypeId === enums.SeedType.Gold));
                this.liveClosedFilteredWorklistDetails = worklistBaseCloned;
                break;
        }
    }

    /**
     * set the data for marking check popup
     * @param markingCheckRecipientList
     */
    private setMarkingCheckPopupData(markingCheckRecipientList: Array<MarkingCheckRecipient>) {
        if (markingCheckRecipientList && markingCheckRecipientList.length > 0) {
            for (let marker of markingCheckRecipientList) {
                marker.fullname = WorkListStore.getFormattedExaminerName(marker.initials, marker.surname);
                marker.isChecked = false;
            }

            this._markingCheckRecipientList = Immutable.List<MarkingCheckRecipient>(
                sortHelper.sort(markingCheckRecipientList, comparerList.examinerDataComparer));
        }
    }

    /**
     * Returns the formatted examiner name
     * @param initials
     * @param surname
     */
    private static getFormattedExaminerName(initials: string, surname: string): string {
        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    }

    /**
     * Updates the reviewed details for the response
     * @param reviewedResponse
     */
    private setCurrentResponseAsReviewed(reviewedResponse: ReviewedResponseDetails) {

        if (reviewedResponse.reviewResponseResult === enums.SetAsReviewResult.Success ||
            reviewedResponse.reviewResponseResult === enums.SetAsReviewResult.AlreadyReviewedBySomeone) {
            let currentWorklistResponseBaseDetails: ResponseBase =
                                        this.getCurrentWorklistResponseBaseDetails().filter((response: ResponseBase) =>
                            response.markGroupId === reviewedResponse.markGroupId).first();

            currentWorklistResponseBaseDetails.isReviewed = true;
            currentWorklistResponseBaseDetails.setAsReviewedCommentId = reviewedResponse.setAsReviewedCommentId;
        }
    }

    /**
     * Updates the supervisor sampled details for the response
     * @param supervisorSamplingCommentReturn
     */
    private setCurrentResponseAsSampled(supervisorSamplingCommentReturn: SupervisorSamplingCommentReturn,
        displayId: number) {

        let _currentResponse = this.getCurrentWorklistResponseBaseDetails().filter((response: ResponseBase) =>
            response.displayId === displayId.toString()).first();

        if (supervisorSamplingCommentReturn.success && _currentResponse) {
            _currentResponse.sampleReviewCommentId = supervisorSamplingCommentReturn.updatedSamplingCommentId;
            _currentResponse.sampleReviewCommentCreatedBy = supervisorSamplingCommentReturn.supervisorCommentCreatedBy;
        }
    }

    /**
     * set worklist details
     * @param worklistDetails
     */
    private setWorklistDetails(worklistDetails: WorklistBase, selectedExaminerRoleId: number,
        hasComplexOptionality: boolean = false): void {
            //set totalMarkValue based on markingProgress and cc value.
            if (hasComplexOptionality) {
                worklistDetails.responses.map((x: any) => {
                 if (x.markingProgress < 100 && x.markingProgress > 0) {
                    x.totalMarkValue = null;
                    } else if (x.markingProgress === 0) {
                    x.totalMarkValue = null;
                    }
                });
            }
            switch (this.workListType) {
            case enums.WorklistType.live:
                this.setLiveWorklistDetails(worklistDetails, selectedExaminerRoleId);
                break;
            case enums.WorklistType.atypical:
                this.setAtypicalWorklistDetails(worklistDetails);
                break;
            case enums.WorklistType.secondstandardisation:
                this.setSecondStandardisationWorklistDetails(worklistDetails);
                break;
            case enums.WorklistType.standardisation:
                this.setStandardisationWorklistDetails(worklistDetails);
                break;
            case enums.WorklistType.practice:
                this.setPracticeWorkListDetails(worklistDetails);
                break;
            case enums.WorklistType.directedRemark:
                this.setDirectedRemarkListDetails(worklistDetails);
                break;
            case enums.WorklistType.pooledRemark:
                this.setPooledRemarkListDetails(worklistDetails);
                break;
            case enums.WorklistType.simulation:
                this.setSimulationWorklistDetails(worklistDetails);
                break;
        }
    }

    /**
     * set default sort order
     * @param worklistType
     * @param responseMode
     */
    private setDefaultSortOrder(worklistType: enums.WorklistType, responseMode: enums.ResponseMode): comparerlist {
        if (worklistType === enums.WorklistType.practice
            || worklistType === enums.WorklistType.standardisation
            || worklistType === enums.WorklistType.secondstandardisation) {
            return comparerlist.responseIdComparer; //"responseidcomparer";//Response ID (lowest first)
        } else if (worklistType === enums.WorklistType.live
            || worklistType === enums.WorklistType.atypical
            || worklistType === enums.WorklistType.directedRemark
            || worklistType === enums.WorklistType.pooledRemark
            || worklistType === enums.WorklistType.simulation) {
            switch (responseMode) {
                case enums.ResponseMode.open:
                    return comparerlist.allocatedDateComparer; //Allocated Date (oldest first)
                case enums.ResponseMode.pending:
                    return comparerlist.timeToEndGracePeriodComparer; //Time to end Grace Period (shortest time first)
                case enums.ResponseMode.closed:
                    return comparerlist.submittedDateComparer; //Submitted Date (most recent first) desc
            }
        }
    }

    /**
     * update Response Sort Collection with the default sort order.
     * @param worklistType
     * @param responseMode
     */
    private updateResponseSortCollection(worklistType: enums.WorklistType, responseMode: enums.ResponseMode,
        remarkRequestType: enums.RemarkRequestType, markSchemeGroupId: number): void {

        let defaultSortDetail: comparerlist = this.setDefaultSortOrder(worklistType, responseMode);

        let sortDetails: responsesortdetails = {
            worklistType: worklistType,
            responseMode: responseMode,
            qig: markSchemeGroupId,
            comparerName: defaultSortDetail,
            sortDirection: (defaultSortDetail === comparerlist.submittedDateComparer) ?
                enums.SortDirection.Descending : enums.SortDirection.Ascending,
            remarkRequestType: remarkRequestType
        };

        let entry = this._responseSortDetails.filter((x: responsesortdetails) =>
            x.worklistType === worklistType && x.responseMode === responseMode
            && x.qig === markSchemeGroupId && x.remarkRequestType === remarkRequestType);
        if (entry.length === 0) {
            this._responseSortDetails.push(sortDetails);
        }
    }

    /**
     * set live worklist details
     * @param worklistDetails
     */
    private setLiveWorklistDetails(worklistDetails: WorklistBase, selectedExaminerRoleId: number): void {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.liveOpenWorklistDetails = worklistDetails as LiveOpenWorklist;
                break;
            case enums.ResponseMode.closed:
                this.liveClosedWorklistDetails = worklistDetails as LiveClosedWorklist;
                this.setFilteredResponses(this.liveClosedWorklistDetails, selectedExaminerRoleId);
                break;
            case enums.ResponseMode.pending:
                this.pendingWorkListDetails = worklistDetails as PendingWorklist;
                break;
        }
    }

    /**
     * set simulation worklist details
     * @param worklistDetails
     */
    private setSimulationWorklistDetails(worklistDetails: WorklistBase): void {
        this.simulationOpenWorklistDetails = worklistDetails as SimulationOpenWorklist;
    }

    /**
     * set atypical worklist details
     * @param worklistDetails
     */
    private setAtypicalWorklistDetails(worklistDetails: WorklistBase): void {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.atypicalOpenWorklistDetails = worklistDetails as DirectedRemarkOpenWorklist;
                break;
            case enums.ResponseMode.closed:
                this.atypicalClosedWorklistDetails = worklistDetails as DirectedRemarkClosedWorklist;
                break;
            case enums.ResponseMode.pending:
                this.atypicalPendingWorklistDetails = worklistDetails as DirectedRemarkPendingWorkList;
                break;
        }
    }

    /**
     * Set practice worklist details.
     * @param {WorklistBase} workListDetails
     */
    private setPracticeWorkListDetails(workListDetails: WorklistBase): void {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.practiceOpenWorkList = workListDetails as PracticeOpenWorklist;
                break;
            case enums.ResponseMode.closed:
                this.practiceClosedWorkList = workListDetails as PracticeOpenWorklist;
                break;
        }

    }

    /**
     * set standardisation worklist details
     * @param worklistDetails
     */
    private setStandardisationWorklistDetails(worklistDetails: WorklistBase): void {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.standardisationOpenWorklistDetails =
                    worklistDetails as StandardisationOpenWorklist;
                break;
            case enums.ResponseMode.closed:
                this.standardisationClosedWorklistDetails =
                    worklistDetails as StandardisationClosedWorklist;
                break;
        }
    }

    /**
     * set second standardisation worklist details
     * @param worklistDetails
     */
    private setSecondStandardisationWorklistDetails(worklistDetails: WorklistBase): void {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.secondStandardisationOpenWorklistDetails =
                    worklistDetails as StandardisationOpenWorklist;
                break;
            case enums.ResponseMode.closed:
                this.secondStandardisationClosedWorklistDetails =
                    worklistDetails as StandardisationClosedWorklist;
                break;
        }
    }

    /**
     * Set directed remark worklist details.
     * @param {WorklistBase} workListDetails
     */
    private setDirectedRemarkListDetails(workListDetails: WorklistBase): void {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.directedRemarkOpenWorkList = workListDetails as DirectedRemarkOpenWorklist;
                break;
            case enums.ResponseMode.closed:
                this.directedRemarkClosedWorkList = workListDetails as DirectedRemarkClosedWorklist;
                break;
            case enums.ResponseMode.pending:
                this.directedRemarkPendingWorklist = workListDetails as DirectedRemarkPendingWorkList;
                break;
        }
    }

    /**
     * Set pooled remark worklist details.
     * @param {WorklistBase} workListDetails
     */
    private setPooledRemarkListDetails(workListDetails: WorklistBase): void {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.pooledRemarkOpenWorkList = workListDetails as PooledRemarkOpenWorklist;
                break;
            case enums.ResponseMode.closed:
                this.pooledRemarkClosedWorkList = workListDetails as PooledRemarkClosedWorklist;
                break;
            case enums.ResponseMode.pending:
                this.pooledRemarkPendingWorklist = workListDetails as PooledRemarkPendingWorkList;
                break;
        }
    }

    /**
     * Returns the marking mode
     * @returns
     */
    public get currentWorklistType(): enums.WorklistType {
        return this.workListType;
    }

    /**
     * Returns the response mode
     * @returns
     */
    public get getResponseMode(): enums.ResponseMode {
        if (this.isMarkingCheckMode) {
            return this._markingCheckResponseMode;
        } else {
            return this.responseMode;
        }
    }

    /**
     * Gets the current marking check status
     */
    public get markingCheckStatus(): enums.MarkingCheckStatus {

        return this._markingCheckStatus;
    }

    /**
     * Get the list of recipients to whom marking check operation is done and their details
     */
    public get markingCheckRecipientList(): Immutable.List<MarkingCheckRecipient> {

        return this._markingCheckRecipientList;
    }

    /**
     * Get a value indicating whether marking check is available
     */
    public get isMarkingCheckAvailable(): boolean {
        return this._isMarkingCheckAvailable;
    }

    /**
     * Returns the remark request type
     * @returns
     */
    public get getRemarkRequestType(): enums.RemarkRequestType {
        return this.remarkRequestType;
    }

    /**
     * Returns the live open worklist details
     * @returns
     */
    public get getLiveOpenWorklistDetails(): LiveOpenWorklist {
        return this.liveOpenWorklistDetails;
    }

    /**
     * Returns the simulation open worklist details
     * @returns
     */
    public get getSimulationOpenWorklistDetails(): SimulationOpenWorklist {
        return this.simulationOpenWorklistDetails;
    }

    /**
     * Returns the live pending worklist details
     * @returns
     */
    public get getLivePendingWorklistDetails(): PendingWorklist {
        return this.pendingWorkListDetails;
    }

    /**
     * Returns the atypical open worklist details
     * @returns
     */
    public get getAtypicalOpenWorklistDetails(): DirectedRemarkOpenWorklist {
        return this.atypicalOpenWorklistDetails;
    }

    /**
     * Returns the atypical pending worklist details
     * @returns
     */
    public get getAtypicalPendingWorklistDetails(): DirectedRemarkPendingWorkList {
        return this.atypicalPendingWorklistDetails;
    }

    /**
     * Returns the atypical closed worklist details
     * @returns
     */
    public get getAtypicalClosedWorklistDetails(): DirectedRemarkClosedWorklist {
        return this.atypicalClosedWorklistDetails;
    }

    /**
     * Returns whether the call was success or not
     * @returns
     */
    public get getSuccess(): boolean {
        return this.isSuccess;
    }

    /**
     * Returns the live closed worklist details
     * @returns
     */
    public get getLiveClosedWorklistDetails(): LiveClosedWorklist {
        return this.liveClosedFilteredWorklistDetails;
    }

    /**
     * Returns the response mode
     * @returns
     */
    public get getIsResponseClose(): boolean {
        return this.isResponseClose;
    }

    /**
     * Find the Response details for the display id
     * @param displayID
     */
    public getResponseDetails(displayID: string): ResponseBase {
        // Check the display Id exists in the list
        if (this.getCurrentWorklistResponseBaseDetails()) {
            let response = this.getCurrentWorklistResponseBaseDetails().filter(
                (response: ResponseBase) => response.displayId === displayID);
            if (response != null && response !== undefined && response.count() === 1) {
                // If response is found in collection, return the base values.
                return (response.first() as ResponseBase);
            }
        }
        // no data found for the disply id.
        return null;
    }

    /**
     * Find the Response details for the mark group Id
     * @param markGroupId
     */
    public getResponseDetailsByMarkGroupId(markGroupId: number) {
        // Check the mark group Id exists in the list
        let response = this.getCurrentWorklistResponseBaseDetails().filter(
            (response: ResponseBase) => response.markGroupId === markGroupId
        );
        if (response != null && response !== undefined && response.count() === 1) {
            // If response is found in collection, return the base values.
            return (response.first() as ResponseBase);
        }

        // no data found for the mark group id.
        return null;
    }

    /**
     * Returns the standardisation open worklist details
     */
    public get getSecondStandardisationOpenWorklistDetails(): StandardisationOpenWorklist {
        return this.secondStandardisationOpenWorklistDetails;
    }

    /**
     * Returns the standardisation closed worklist details
     */
    public get getSecondStandardisationClosedWorklistDetails():
        StandardisationClosedWorklist {
        return this.secondStandardisationClosedWorklistDetails;
    }

    /**
     * Returns the standardisation open worklist details
     */
    public get getStandardisationOpenWorklistDetails(): StandardisationOpenWorklist {
        return this.standardisationOpenWorklistDetails;
    }

    /**
     * Returns the standardisation closed worklist details
     */
    public get getStandardisationClosedWorklistDetails():
        StandardisationClosedWorklist {
        return this.standardisationClosedWorklistDetails;
    }

    /**
     * Returns the practice open worklist details
     * @returns
     */
    public get getPracticeOpenWorklistDetails(): PracticeOpenWorklist {
        return this.practiceOpenWorkList;
    }

    /**
     * Returns the live closed worklist details
     * @returns
     */
    public get getPracticeClosedWorklistDetails(): PracticeClosedWorklist {
        return this.practiceClosedWorkList;
    }

    /**
     * Returns the directed remark open worklist details
     * @returns
     */
    public get getDirectedRemarkOpenWorklistDetails(): DirectedRemarkOpenWorklist {
        return this.directedRemarkOpenWorkList;
    }

    /**
     * Returns the directed remark closed worklist details
     * @returns
     */
    public get getDirectedRemarkClosedWorklistDetails(): DirectedRemarkClosedWorklist {
        return this.directedRemarkClosedWorkList;
    }

    /**
     * Returns the directed remark pending worklist data
     */
    public get getDirectedRemarkPendingWorklistDetails(): DirectedRemarkPendingWorkList {
        return this.directedRemarkPendingWorklist;
    }

    /**
     * Returns the pooled remark open worklist details
     * @returns
     */
    public get getPooledRemarkOpenWorklistDetails(): PooledRemarkOpenWorklist {
        return this.pooledRemarkOpenWorkList;
    }

    /**
     * Returns the pooled remark closed worklist details
     * @returns
     */
    public get getPooledRemarkClosedWorklistDetails(): PooledRemarkClosedWorklist {
        return this.pooledRemarkClosedWorkList;
    }

    /**
     * Returns the pooled remark pending worklist data
     */
    public get getPooledRemarkPendingWorklistDetails(): PooledRemarkPendingWorkList {
        return this.pooledRemarkPendingWorklist;
    }


    /**
     * Get the current worklists Response details in sorted order.
     * @param worklistDetails
     */
    public getCurrentWorklistResponseBaseDetailsInSortOrder(): Immutable.List<ResponseBase> {
        let workListDetails: WorklistBase = this.getWorklistDetails(this.workListType, this.getResponseMode);
        if (workListDetails !== undefined) {
            this.setDefaultComparer();
            let _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';

            // Prevent sorting of worklist response collection if comparer is "Tag" from the response screen.
            if (this.isSortingRequired()) {
                workListDetails.responses = Immutable.List<any>(sortHelper.sort
                    (workListDetails.responses.toArray(), comparerList[_comparerName]));
            }
            return workListDetails ? workListDetails.responses : undefined;
        }
    }

    /**
     * Check whether sorting required for this current comparer.
     */
    private isSortingRequired(): boolean {
        return this.comparerName !== comparerlist[comparerList.tagComparer];
    }



    /**
     * Get the current worklists Response details
     * @param worklistDetails
     */
    public getCurrentWorklistResponseBaseDetails(): Immutable.List<ResponseBase> {
        let workListDetails: WorklistBase = this.getWorklistDetails(this.workListType, this.getResponseMode);
        return workListDetails ? workListDetails.responses : undefined;
    }

    /**
     * Get the related markGroupIds for a whole response
     * @param currentMarkGroupId : returns related mgIds of the currentMarkGroupId
     */
    public getRelatedMarkGroupIdsForWholeResponse(currentMarkGroupId: number): number[] {

        let currentResponse: ResponseBase;
        let relatedRIGDetails: Immutable.List<RelatedRIGDetails>;
        let markGroupIds: number[] = [];
        let currentWorklistResponseDetails: Immutable.List<ResponseBase> = this.getCurrentWorklistResponseBaseDetails();

        if (currentWorklistResponseDetails) {

            currentResponse = currentWorklistResponseDetails.filter(x => x.markGroupId === currentMarkGroupId).first();

            if (currentResponse && currentResponse.relatedRIGDetails) {

                currentResponse.relatedRIGDetails.map((x: RelatedRIGDetails) => {

                    markGroupIds.push(x.markGroupId);

                });
            }
        }
        return markGroupIds;
    }

    /**
     * Set the comparer for the current worklist based on the worklisttype,qigId and responseMode
     */
    public setDefaultComparer() {
        this._comparerName = undefined;
        this._sortDirection = undefined;
        let defaultComparers = this.responseSortDetails;
        let worklistType: enums.WorklistType = this.workListType;
        let responseMode: enums.ResponseMode = this.getResponseMode;
        let qigId: number = this._selectedQig.markSchemeGroupId;

        let entry: responsesortdetails[] = defaultComparers.filter((x: responsesortdetails) =>
            x.worklistType === worklistType && x.responseMode === responseMode
            && x.qig === qigId && x.remarkRequestType === this.remarkRequestType);

        if (entry.length > 0 && this.isSortingRequired()) {
            this._comparerName = comparerList[entry[0].comparerName];
            this._sortDirection = entry[0].sortDirection;
        }

    }

    /**
     * Gets the worklist details based on the worklist type and response mode
     * @param {enums.WorklistType} workListType
     * @param {enums.ResponseMode} responseMode
     * @returns worklist Details
     */
    public getWorklistDetails(workListType: enums.WorklistType, responseMode: enums.ResponseMode): WorklistBase {
        let workListDetails: WorklistBase;
        switch (workListType) {
            case enums.WorklistType.live:
                switch (responseMode) {
                    case enums.ResponseMode.open:
                        workListDetails = this.getLiveOpenWorklistDetails;
                        break;
                    case enums.ResponseMode.closed:
                        workListDetails = this.getLiveClosedWorklistDetails;
                        break;
                    case enums.ResponseMode.pending:
                        workListDetails = this.getLivePendingWorklistDetails;
                        break;
                }
                break;
            case enums.WorklistType.atypical:
                switch (responseMode) {
                    case enums.ResponseMode.open:
                        workListDetails = this.getAtypicalOpenWorklistDetails;
                        break;
                    case enums.ResponseMode.closed:
                        workListDetails = this.getAtypicalClosedWorklistDetails;
                        break;
                    case enums.ResponseMode.pending:
                        workListDetails = this.getAtypicalPendingWorklistDetails;
                        break;
                }
                break;
            case enums.WorklistType.secondstandardisation:
                switch (responseMode) {
                    case enums.ResponseMode.open:
                        workListDetails = this.getSecondStandardisationOpenWorklistDetails;
                        break;
                    case enums.ResponseMode.closed:
                        workListDetails = this.getSecondStandardisationClosedWorklistDetails;
                        break;
                }
                break;
            case enums.WorklistType.standardisation:
                switch (responseMode) {
                    case enums.ResponseMode.open:
                        workListDetails = this.getStandardisationOpenWorklistDetails;
                        break;
                    case enums.ResponseMode.closed:
                        workListDetails = this.getStandardisationClosedWorklistDetails;
                        break;
                }
                break;
            case enums.WorklistType.practice:
                switch (responseMode) {
                    case enums.ResponseMode.open:
                        workListDetails = this.getPracticeOpenWorklistDetails;
                        break;
                    case enums.ResponseMode.closed:
                        workListDetails = this.getPracticeClosedWorklistDetails;
                        break;
                }
                break;
            case enums.WorklistType.directedRemark:
                switch (responseMode) {
                    case enums.ResponseMode.open:
                        workListDetails = this.getDirectedRemarkOpenWorklistDetails;
                        break;
                    case enums.ResponseMode.closed:
                        workListDetails = this.getDirectedRemarkClosedWorklistDetails;
                        break;
                    case enums.ResponseMode.pending:
                        workListDetails = this.getDirectedRemarkPendingWorklistDetails;
                        break;
                }
                break;
            case enums.WorklistType.pooledRemark:
                switch (responseMode) {
                    case enums.ResponseMode.open:
                        workListDetails = this.getPooledRemarkOpenWorklistDetails;
                        break;
                    case enums.ResponseMode.closed:
                        workListDetails = this.getPooledRemarkClosedWorklistDetails;
                        break;
                    case enums.ResponseMode.pending:
                        workListDetails = this.getPooledRemarkPendingWorklistDetails;
                        break;
                }
                break;
            case enums.WorklistType.simulation:
                workListDetails = this.getSimulationOpenWorklistDetails;
                break;
        }
        return workListDetails;
    }

    /**
     * Get candidate script info collection
     * @returns candidate script collection
     */
    public get getCandidateScriptInfoCollection(): Immutable.List<candidateScriptInfo> {
        return this.candidateScriptInfoCollection;
    }

    /**
     * Set candidate script info collection
     * @param {Immutable.List<candidateScriptInfo>} candidateScriptInfo
     */
    public set setCandidateScriptInfoCollection(candidateScriptInfo: Immutable.List<candidateScriptInfo>) {
        this.candidateScriptInfoCollection = candidateScriptInfo;
    }

    /*
    * This will return the current worklist response count
    */
    public get currentWorklistResponseCount(): number {
        return this.getCurrentWorklistResponseBaseDetails().size;
    }

    /**
     * To get the next response id
     * @param {string} displayId
     * @returns
     */
    public nextResponseId(displayId: string): string {
        let position = this.getResponsePosition(displayId);
        let response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().toArray()[position];
        if (response != null) {
            return response.displayId;
        }
    }

    /**
     * To get the previous response id
     * @param {string} displayId
     * @returns
     */
    public previousResponseId(displayId: string): string {
        let position = this.getResponsePosition(displayId);
        let response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().toArray()[position - 2];
        if (response != null) {
            return response.displayId;
        }
    }

    /**
     * Get response position based on responseId
     * @param displayId
     */
    public getResponsePosition(displayId: string): number {
        let response: ResponseBase = this.getCurrentWorklistResponseBaseDetails().find((x: ResponseBase) => x.displayId === displayId);
        if (response != null || response !== undefined) {
            return this.getCurrentWorklistResponseBaseDetailsInSortOrder().indexOf(response) + 1;
        }
    }

    /**
     * This will check whether the next response is exists or not
     */
    public isNextResponseAvailable(displayId: string): boolean {
        return this.getResponsePosition(displayId) < this.currentWorklistResponseCount;
    }

    /**
     * This will check whether the previous response is exists or not
     */
    public isPreviousResponseAvailable(displayId: string): boolean {
        return this.getResponsePosition(displayId) > 1;
    }

    /**
     * This will check the response count difference with markingTargetsSummary collection
     * if any change found, update the collection accordingly. This check is for syncing
     * the response count across the application
     * @returns
     */
    public getExaminerMarkingTargetProgress(isSelectedExaminerSTM: boolean) {

        let responseCount: number;
        let isChanged: boolean = false;
        this.markingTargetsSummary = targetSummaryStore.instance.getExaminerMarkingTargetProgress();

        /** If markingTargetsSummary is empty returns from methd */
        if (this.markingTargetsSummary === undefined) {
            return;
        }

        /** Checking count difference for Live Open responses */
        if ((this.workListType === enums.WorklistType.live) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.liveOpenWorklistDetails !== undefined) && (this.liveOpenWorklistDetails.responses !== undefined)) {

            responseCount = this.liveOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount, true);

            /** Checking count difference for Live closed responses */
        } else if ((this.workListType === enums.WorklistType.live) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.liveClosedWorklistDetails !== undefined)
            && (this.liveClosedWorklistDetails.responses !== undefined)) {
            if (ccValues.examinerCentreExclusivity && isSelectedExaminerSTM) {
                responseCount = this.liveClosedWorklistDetails.responses.filter
                    (x => ((x.isPromotedSeed && !x.isCurrentMarkGroupPromotedAsSeed) || !x.hasDefinitiveMarks)).count();
            } else {
                responseCount = this.liveClosedWorklistDetails.responses.count();
            }
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount, true);

            /** Checking count difference for Live pending responses */
        } else if ((this.workListType === enums.WorklistType.live) && (this.getResponseMode === enums.ResponseMode.pending)
            && (this.pendingWorkListDetails !== undefined)
            && (this.pendingWorkListDetails.responses !== undefined)) {

            responseCount = this.pendingWorkListDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.pending, responseCount, true);

            /** Checking count difference for practice open responses */
        } else if ((this.workListType === enums.WorklistType.atypical) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.atypicalOpenWorklistDetails !== undefined) && (this.atypicalOpenWorklistDetails.responses !== undefined)) {

            responseCount = this.atypicalOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount, true);
            /** Checking count difference for Live closed responses */
        } else if ((this.workListType === enums.WorklistType.atypical) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.atypicalClosedWorklistDetails !== undefined)
            && (this.atypicalClosedWorklistDetails.responses !== undefined)) {

            responseCount = this.atypicalClosedWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount, true);

            /** Checking count difference for Live pending responses */
        } else if ((this.workListType === enums.WorklistType.atypical) && (this.getResponseMode === enums.ResponseMode.pending)
            && (this.atypicalPendingWorklistDetails !== undefined)
            && (this.atypicalPendingWorklistDetails.responses !== undefined)) {

            responseCount = this.atypicalPendingWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.pending, responseCount, true);

            /** Checking count difference for practice open responses */
        } else if ((this.workListType === enums.WorklistType.practice) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.practiceOpenWorkList !== undefined)
            && (this.practiceOpenWorkList.responses !== undefined)) {

            responseCount = this.practiceOpenWorkList.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount);

            /** Checking count difference for practice closed responses */
        } else if ((this.workListType === enums.WorklistType.practice) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.practiceClosedWorkList !== undefined)
            && (this.practiceClosedWorkList.responses !== undefined)) {

            responseCount = this.practiceClosedWorkList.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount);

            /** Checking count difference for standardization open responses */
        } else if ((this.workListType === enums.WorklistType.standardisation) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.standardisationOpenWorklistDetails !== undefined)
            && (this.standardisationOpenWorklistDetails.responses !== undefined)) {

            responseCount = this.standardisationOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount);

            /** Checking count difference for standardization closed responses */
        } else if ((this.workListType === enums.WorklistType.standardisation) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.standardisationClosedWorklistDetails !== undefined)
            && (this.standardisationClosedWorklistDetails.responses !== undefined)) {

            responseCount = this.standardisationClosedWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount);

            /** Checking count difference for secondStandardisation open responses */
        } else if ((this.workListType === enums.WorklistType.secondstandardisation) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.secondStandardisationOpenWorklistDetails !== undefined)
            && (this.secondStandardisationOpenWorklistDetails.responses !== undefined)) {

            responseCount = this.secondStandardisationOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount);

            /** Checking count difference for secondStandardisation closed responses */
        } else if ((this.workListType === enums.WorklistType.secondstandardisation) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.secondStandardisationClosedWorklistDetails !== undefined)
            && (this.secondStandardisationClosedWorklistDetails.responses !== undefined)) {

            responseCount = this.secondStandardisationClosedWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount);
        } else if ((this.workListType === enums.WorklistType.directedRemark) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.getDirectedRemarkOpenWorklistDetails !== undefined
                && (this.getDirectedRemarkOpenWorklistDetails.responses !== undefined))) {

            responseCount = this.getDirectedRemarkOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount, true);
        } else if ((this.workListType === enums.WorklistType.directedRemark) && (this.getResponseMode === enums.ResponseMode.pending)
            && (this.getDirectedRemarkPendingWorklistDetails !== undefined
                && (this.getDirectedRemarkPendingWorklistDetails.responses !== undefined))) {

            responseCount = this.getDirectedRemarkPendingWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.pending, responseCount, true);
        } else if ((this.workListType === enums.WorklistType.directedRemark) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.getDirectedRemarkClosedWorklistDetails !== undefined
                && (this.getDirectedRemarkClosedWorklistDetails.responses !== undefined))) {

            responseCount = this.getDirectedRemarkClosedWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount, true);
        }  else if ((this.workListType === enums.WorklistType.pooledRemark) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.getPooledRemarkOpenWorklistDetails !== undefined
                && (this.getPooledRemarkOpenWorklistDetails.responses !== undefined))) {

            responseCount = this.getPooledRemarkOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount, true);
        } else if ((this.workListType === enums.WorklistType.pooledRemark) && (this.getResponseMode === enums.ResponseMode.pending)
            && (this.getPooledRemarkPendingWorklistDetails !== undefined
                && (this.getPooledRemarkPendingWorklistDetails.responses !== undefined))) {

            responseCount = this.getPooledRemarkPendingWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.pending, responseCount, true);
        } else if ((this.workListType === enums.WorklistType.pooledRemark) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.getPooledRemarkClosedWorklistDetails !== undefined
                && (this.getPooledRemarkClosedWorklistDetails.responses !== undefined))) {

            responseCount = this.getPooledRemarkClosedWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount, true);
        } else if ((this.workListType === enums.WorklistType.simulation) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.simulationOpenWorklistDetails !== undefined) && (this.simulationOpenWorklistDetails.responses !== undefined)) {

            responseCount = this.simulationOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount, true);
        }
        return this.markingTargetsSummary;
    }

    /**
     * This will check for any difference in markingTargetsSummary count with responses in corresponding worklist
     * any mismatch found, it will update with response count in worklist.
     * @param {enums.ResponseMode} responseMode
     * @param responseCount
     * @returns
     */
    private updateMarkingTargetsSummary(responseMode: enums.ResponseMode, responseCount: number, doNotify: boolean = false) {
        let isChanged: boolean = false;
        let targetSummary: markingTargetSummary = this.markingTargetsSummary.
            filter((x: markingTargetSummary) => x.remarkRequestTypeID === this.remarkRequestType
                && x.markingModeID === this.getMarkingModeByWorkListType(this.workListType)).first();
        if (this.workListType === enums.WorklistType.atypical) {
            let progress: examinerProgress = targetSummary.examinerProgress ? targetSummary.examinerProgress : null;
            switch (responseMode) {
                case enums.ResponseMode.open:
                    if (progress.atypicalOpenResponsesCount !== responseCount) {
                        progress.atypicalOpenResponsesCount = responseCount;
                        isChanged = true;
                    }
                    break;
                case enums.ResponseMode.pending:
                    if (progress.atypicalPendingResponsesCount !== responseCount) {
                        progress.atypicalPendingResponsesCount = responseCount;
                        isChanged = true;
                    }
                    break;
                case enums.ResponseMode.closed:
                    if (progress.atypicalClosedResponsesCount !== responseCount) {
                        progress.atypicalClosedResponsesCount = responseCount;
                        isChanged = true;
                    }
                    break;
            }
        } else {
            let progress: examinerProgress = targetSummary.examinerProgress ? targetSummary.examinerProgress : null;
            switch (responseMode) {
                case enums.ResponseMode.open:
                    if (progress.openResponsesCount !== responseCount) {
                        progress.openResponsesCount = responseCount;
                        isChanged = true;
                    }
                    break;
                case enums.ResponseMode.pending:
                    if (progress.pendingResponsesCount !== responseCount) {
                        progress.pendingResponsesCount = responseCount;
                        isChanged = true;
                    }
                    break;
                case enums.ResponseMode.closed:
                    if (progress.closedResponsesCount !== responseCount) {
                        progress.closedResponsesCount = responseCount;
                        isChanged = true;
                    }
                    break;
            }
        }

        /** If collection changed and doNotify
         * (need to to re-render left panel in worklist) is true emit event
         */
        if (isChanged && doNotify) {
            this.emit(WorkListStore.WORKLIST_COUNT_CHANGE);
        }
    }

    /**
     * returns the worklist type based on the marking mode
     */
    public getMarkingModeByWorkListType(workListType: enums.WorklistType): any {
        let markingMode: enums.MarkingMode;

        /* set the worklist type from  the marking mode */
        switch (workListType) {
            case enums.WorklistType.atypical:
            case enums.WorklistType.live: markingMode = enums.MarkingMode.LiveMarking; break;
            case enums.WorklistType.practice: markingMode = enums.MarkingMode.Practice; break;
            case enums.WorklistType.standardisation: markingMode = enums.MarkingMode.Approval; break;
            case enums.WorklistType.secondstandardisation: markingMode = enums.MarkingMode.ES_TeamApproval; break;
            case enums.WorklistType.directedRemark: markingMode = enums.MarkingMode.Remarking; break;
            case enums.WorklistType.pooledRemark: markingMode = enums.MarkingMode.Remarking; break;
            case enums.WorklistType.simulation: markingMode = enums.MarkingMode.Simulation; break;
        }

        return markingMode;
    }

    /**
     * check whether a response in grace period or not
     * @param markGroupId
     */
    public isResponseInGracePeriod(markGroupId: number): boolean {
        let pendingWorklists: PendingWorklist = this.getLivePendingWorklistDetails;
        if (pendingWorklists) {
            let filteredPendingWorklist = pendingWorklists.responses.filter((x: PendingResponse) => x.markGroupId === markGroupId);
            return filteredPendingWorklist ? filteredPendingWorklist.size > 0 : false;
        }

        return false;
    }

    /**
     * retrieve the base colour for directed remark and pooled remark
     * @param markGroupId
     * @param responseMode
     */
    public getRemarkBaseColour(markGroupId: number, responseMode: enums.ResponseMode, worklistType: enums.WorklistType) {

        let color: string = null;
        if (worklistType === enums.WorklistType.directedRemark) {
            let filteredDirectedWorklist;
            switch (responseMode) {
                case enums.ResponseMode.open:
                    let directedOpenWorklists: DirectedRemarkOpenWorklist = this.getDirectedRemarkOpenWorklistDetails;
                    if (directedOpenWorklists) {
                        filteredDirectedWorklist = directedOpenWorklists.responses.filter(
                            (x: DirectedRemarkOpenResponse) => x.markGroupId === markGroupId);
                    }
                    break;
                case enums.ResponseMode.pending:
                    let directedPendingWorklists: DirectedRemarkPendingWorkList = this.getDirectedRemarkPendingWorklistDetails;
                    if (directedPendingWorklists) {
                        filteredDirectedWorklist = directedPendingWorklists.responses.filter(
                            (x: DirectedRemarkPendingResponse) => x.markGroupId === markGroupId);
                    }
                    break;
            }
            color = (filteredDirectedWorklist) ? filteredDirectedWorklist.first().baseColor : null;
            //Added the condition to return the pooled remark base color as well
        } else if (worklistType === enums.WorklistType.pooledRemark) {
            let filteredpooledWorklist;
            switch (responseMode) {
                case enums.ResponseMode.open:
                    let pooledOpenWorklists: PooledRemarkOpenWorklist = this.getPooledRemarkOpenWorklistDetails;
                    if (pooledOpenWorklists) {
                        filteredpooledWorklist = pooledOpenWorklists.responses.filter(
                            (x: PooledRemarkOpenResponse) => x.markGroupId === markGroupId);
                    }
                    break;
                case enums.ResponseMode.pending:
                    let pooledPendingWorklists: PooledRemarkPendingWorkList = this.getPooledRemarkPendingWorklistDetails;
                    if (pooledPendingWorklists) {
                        filteredpooledWorklist = pooledPendingWorklists.responses.filter(
                            (x: PooledRemarkPendingResponse) => x.markGroupId === markGroupId);
                    }
                    break;
            }
            color = (filteredpooledWorklist) ? filteredpooledWorklist.first().baseColor : null;
        }
        return color;
    }

    /**
     * retrieve the base colour for directed remark
     * @param markGroupId
     * @param responseMode
     */
    public isMarkChangeReasonVisible(markGroupId: number, responseMode: enums.ResponseMode): boolean {
        if (this.currentWorklistType === enums.WorklistType.directedRemark) {
            switch (responseMode) {
                case enums.ResponseMode.open:
                    let directedOpenWorklists: DirectedRemarkOpenWorklist = this.getDirectedRemarkOpenWorklistDetails;
                    if (directedOpenWorklists) {
                        let filteredDirectedWorklist = directedOpenWorklists.responses.filter(
                            (x: DirectedRemarkOpenResponse) => x.markGroupId === markGroupId);
                        return filteredDirectedWorklist.first().markChangeReasonVisible;
                    }
                    break;
                case enums.ResponseMode.pending:
                    let directedPendingWorklists: DirectedRemarkPendingWorkList = this.getDirectedRemarkPendingWorklistDetails;
                    if (directedPendingWorklists) {
                        let filteredDirectedWorklistPending = directedPendingWorklists.responses.filter(
                            (x: DirectedRemarkPendingResponse) => x.markGroupId === markGroupId);
                        return filteredDirectedWorklistPending.first().markChangeReasonVisible;
                    }
                    break;
                case enums.ResponseMode.closed:
                    let directedClosedWorklists: DirectedRemarkClosedWorklist = this.getDirectedRemarkClosedWorklistDetails;
                    if (directedClosedWorklists) {
                        let filteredDirectedWorklistClosed = directedClosedWorklists.responses.filter(
                            (x: DirectedRemarkClosedResponse) => x.markGroupId === markGroupId);
                        return filteredDirectedWorklistClosed.first().markChangeReasonVisible;
                    }
                    break;
            }
        }
        return null;
    }

    /**
     * To get the mark change reason
     * @param {number} markGroupId
     * @param {enums.ResponseMode} responseMode
     * @returns
     */
    public getMarkChangeReason(markGroupId: number, responseMode: enums.ResponseMode): string {
        if (this.currentWorklistType === enums.WorklistType.directedRemark) {
            switch (responseMode) {
                case enums.ResponseMode.open:
                    let directedOpenWorklists: DirectedRemarkOpenWorklist = this.getDirectedRemarkOpenWorklistDetails;
                    if (directedOpenWorklists) {
                        let filteredDirectedWorklistOpen = directedOpenWorklists.responses.filter(
                            (x: DirectedRemarkOpenResponse) => x.markGroupId === markGroupId);
                        return filteredDirectedWorklistOpen.first().markChangeReason;
                    }
                    break;
                case enums.ResponseMode.pending:
                    let directedPendingWorklists: DirectedRemarkPendingWorkList = this.getDirectedRemarkPendingWorklistDetails;
                    if (directedPendingWorklists) {
                        let filteredDirectedWorklistPending = directedPendingWorklists.responses.filter(
                            (x: DirectedRemarkPendingResponse) => x.markGroupId === markGroupId);
                        return filteredDirectedWorklistPending.first().markChangeReason;
                    }
                    break;
                case enums.ResponseMode.closed:
                    let directedClosedWorklists: DirectedRemarkClosedWorklist = this.getDirectedRemarkClosedWorklistDetails;
                    if (directedClosedWorklists) {
                        let filteredDirectedWorklistClosed = directedClosedWorklists.responses.filter(
                            (x: DirectedRemarkClosedResponse) => x.markGroupId === markGroupId);
                        return filteredDirectedWorklistClosed.first().markChangeReason;
                    }
                    break;
            }
        }
        return null;
    }

    /**
     * To get the supervisor remark decision details
     * @param {number} markGroupId
     * @param {enums.ResponseMode} responseMode
     * @returns
     */
    public getSupervisorRemarkDecision(markGroupId: number, responseMode: enums.ResponseMode): supervisorRemarkDecision {
        if (this.currentWorklistType === enums.WorklistType.directedRemark) {
            switch (responseMode) {
                case enums.ResponseMode.open:
                    let directedOpenWorkLists: DirectedRemarkOpenWorklist = this.getDirectedRemarkOpenWorklistDetails;
                    if (directedOpenWorkLists) {
                        let filteredDirectedWorklistOpen = directedOpenWorkLists.responses.filter(
                            (x: DirectedRemarkOpenResponse) => x.markGroupId === markGroupId);

                        let _supervisorRemarkDecision = new supervisorRemarkDecision;

                        _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = filteredDirectedWorklistOpen.first().
                            supervisorRemarkMarkChangeReasonID;
                        _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = filteredDirectedWorklistOpen.first().
                            supervisorRemarkFinalMarkSetID;
                        _supervisorRemarkDecision.isSRDReasonUpdated = false;

                        return _supervisorRemarkDecision;
                    }
                    break;
                case enums.ResponseMode.pending:
                    let directedPendingWorklists: DirectedRemarkPendingWorkList = this.getDirectedRemarkPendingWorklistDetails;
                    if (directedPendingWorklists) {
                        let filteredDirectedWorklistPending = directedPendingWorklists.responses.filter(
                            (x: DirectedRemarkPendingResponse) => x.markGroupId === markGroupId);
                        let _supervisorRemarkDecision = new supervisorRemarkDecision;

                        _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = filteredDirectedWorklistPending.first().
                            supervisorRemarkFinalMarkSetID;
                        _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = filteredDirectedWorklistPending.first().
                            supervisorRemarkMarkChangeReasonID;
                        _supervisorRemarkDecision.isSRDReasonUpdated = false;

                        return _supervisorRemarkDecision;
                    }
                    break;
                case enums.ResponseMode.closed:
                    let directedRemarkClosedWorklists: DirectedRemarkClosedWorklist = this.getDirectedRemarkClosedWorklistDetails;
                    if (directedRemarkClosedWorklists) {
                        let filteredDirectedRemarkWorklistClosed = directedRemarkClosedWorklists.responses.filter(
                            (x: DirectedRemarkClosedResponse) => x.markGroupId === markGroupId);
                        let _supervisorRemarkDecision = new supervisorRemarkDecision;

                        _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = filteredDirectedRemarkWorklistClosed.first().
                            supervisorRemarkFinalMarkSetID;
                        _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = filteredDirectedRemarkWorklistClosed.first().
                            supervisorRemarkMarkChangeReasonID;
                        _supervisorRemarkDecision.isSRDReasonUpdated = false;

                        return _supervisorRemarkDecision;
                    }
                    break;
            }
        }
        return null;
    }

    /**
     * get the tag id of given response
     * @param displayId
     */
    public getTagId(displayId: string): number {
        let tagId: number = 0;

        //Tag should not be visible when in marking check mode.
        if (this.isMarkingCheckMode) {
            return undefined;
        }

        switch (this.currentWorklistType) {
            case enums.WorklistType.live:
                switch (this.responseMode) {
                    case enums.ResponseMode.open:
                        tagId = this.liveOpenWorklistDetails.responses.
                            filter((item: ResponseBase) => item.displayId === displayId).first().tagId;
                        break;
                    case enums.ResponseMode.pending:
                        tagId = this.pendingWorkListDetails.responses.
                            filter((item: ResponseBase) => item.displayId === displayId).first().tagId;
                        break;
                    case enums.ResponseMode.closed:
                        tagId = this.liveClosedWorklistDetails.responses.
                            filter((item: ResponseBase) => item.displayId === displayId).first().tagId;
                        break;
                }
                break;
            case enums.WorklistType.directedRemark:
                switch (this.responseMode) {
                    case enums.ResponseMode.open:
                        tagId = this.directedRemarkOpenWorkList.responses.
                            filter((item: ResponseBase) => item.displayId === displayId).first().tagId;
                        break;
                    case enums.ResponseMode.pending:
                        tagId = this.directedRemarkPendingWorklist.responses.
                            filter((item: ResponseBase) => item.displayId === displayId).first().tagId;
                        break;
                    case enums.ResponseMode.closed:
                        tagId = this.directedRemarkClosedWorkList.responses.
                            filter((item: ResponseBase) => item.displayId === displayId).first().tagId;
                        break;
                }
                break;
            case enums.WorklistType.pooledRemark:
                switch (this.responseMode) {
                    case enums.ResponseMode.open:
                        tagId = this.pooledRemarkOpenWorkList.responses.
                            filter((item: ResponseBase) => item.displayId === displayId).first().tagId;
                        break;
                    case enums.ResponseMode.pending:
                        tagId = this.pooledRemarkPendingWorklist.responses.
                            filter((item: ResponseBase) => item.displayId === displayId).first().tagId;
                        break;
                    case enums.ResponseMode.closed:
                        tagId = this.pooledRemarkClosedWorkList.responses.
                            filter((item: ResponseBase) => item.displayId === displayId).first().tagId;
                        break;
                }
                break;
            default:
                tagId = undefined;
        }

        return tagId;
    }

    /**
     * Using this value we will reload worklist data for reflecting unread linked message details
     */
    public get isMessageStatusChanged(): boolean {
        return this._isWorklistRefreshRequired;
    }

    /**
     * Using this value we will reload worklist data for reflecting exception status change
     * @returns isWorklistRefreshRequired
     */
    public get isExceptionStatusChanged(): boolean {
        return this._isWorklistRefreshRequired;
    }

    /**
     * retrieve the response sort details for all the worklist and response mode.
     * @returns responseSortDetails
     */
    public get responseSortDetails() {
        return this._responseSortDetails;
    }

    /**
     * get isDirectedRemark
     * @returns isDirectedRemark
     */
    public get isDirectedRemark(): boolean {
        return this._isDirectedRemark;
    }

    /* return the selected question item index */
    public get selectedQuestionItemBIndex(): number {
        return this._selectedQuestionItemBIndex;
	}

    /**
     * uniqueId for the selected Question
     */
	public get selectedQuestionItemUniqueId(): number {
		return this._selectedQuestionItemUniqueId;
	}

    /**
     * Get response position based on responseId
     * @param displayId
     */
    public get getIfOfFirstResponse(): string {
        let response: ResponseBase = this.getCurrentWorklistResponseBaseDetails().first();
        if (response != null || response !== undefined) {
            return response.displayId;
        }
    }

    public get isLastNodeSelected(): boolean {
        return this._isLastNodeSelected;
    }

    /**
     * The marking check worklist status
     * @returns
     */
    public get isMarkingCheckWorklistAccessPresent(): boolean {
        return this._isMarkingCheckWorklistAccessPresent;
    }

    /**
     * The sort direction
     * @returns
     */
    public get sortDirection(): enums.SortDirection {
        return this._sortDirection;
    }

    /**
     * The comparerName
     * @returns
     */
    public get comparerName(): string {
        return this._comparerName;
    }

    /**
     * Remove a particular response item from local collection
     * @param {enums.WorklistType} workListType
     * @param {enums.ResponseMode} responseMode
     * @param {string} displayId
     * @returns worklist Details
     */
    public removeResponseFromWorklistDetails(workListType: enums.WorklistType, responseMode: enums.ResponseMode, displayId: string) {
        let response: any;
        let indexOfResponse: number;
        switch (workListType) {
            case enums.WorklistType.live:
                switch (responseMode) {
                    case enums.ResponseMode.closed:
                        response = this.liveClosedWorklistDetails.responses.find((x: LiveClosedResponse) => x.displayId === displayId);
                        indexOfResponse = this.liveClosedWorklistDetails.responses.indexOf(response);
                        this.liveClosedWorklistDetails.responses = this.liveClosedWorklistDetails.responses.remove(indexOfResponse);
                        break;
                    case enums.ResponseMode.pending:
                        response = this.pendingWorkListDetails.responses.find((x: PendingResponse) => x.displayId === displayId);
                        indexOfResponse = this.pendingWorkListDetails.responses.indexOf(response);
                        this.pendingWorkListDetails.responses = this.pendingWorkListDetails.responses.remove(indexOfResponse);
                        break;
                }
                break;
            case enums.WorklistType.directedRemark:
                switch (responseMode) {
                    case enums.ResponseMode.closed:
                        response = this.directedRemarkClosedWorkList.responses.find((x: DirectedRemarkClosedResponse) =>
                            x.displayId === displayId);
                        indexOfResponse = this.directedRemarkClosedWorkList.responses.indexOf(response);
                        this.directedRemarkClosedWorkList.responses = this.directedRemarkClosedWorkList.responses.remove(indexOfResponse);
                        break;
                    case enums.ResponseMode.pending:
                        response = this.directedRemarkPendingWorklist.responses.find((x: DirectedRemarkPendingResponse) =>
                            x.displayId === displayId);
                        indexOfResponse = this.directedRemarkPendingWorklist.responses.indexOf(response);
                        this.directedRemarkPendingWorklist.responses = this.directedRemarkPendingWorklist.responses.remove(indexOfResponse);
                        break;
                }
                break;
            case enums.WorklistType.pooledRemark:
                switch (responseMode) {
                    case enums.ResponseMode.closed:
                        response =
                            this.pooledRemarkClosedWorkList.responses.find((x: PooledRemarkClosedResponse) => x.displayId === displayId);
                        indexOfResponse = this.pooledRemarkClosedWorkList.responses.indexOf(response);
                        this.pooledRemarkClosedWorkList.responses = this.pooledRemarkClosedWorkList.responses.remove(indexOfResponse);
                        break;
                    case enums.ResponseMode.pending:
                        response =
                            this.pooledRemarkPendingWorklist.responses.find((x: PooledRemarkPendingResponse) => x.displayId === displayId);
                        indexOfResponse = this.pooledRemarkPendingWorklist.responses.indexOf(response);
                        this.pooledRemarkPendingWorklist.responses = this.pooledRemarkPendingWorklist.responses.remove(indexOfResponse);
                        break;
                }
                break;
        }

    }

    /**
     * Update a all responses item under same candidatescriptid from local collection and set isPromotedSeed true
     * @param {enums.WorklistType} selectedMarkGroupId
     * @returns updated collection
     */
    public updateResponseCollectionAfterPromoteSeed(selectedMarkGroupId) {
        let candidateScriptID: number = 0;
        if (this.workListType === enums.WorklistType.live) {
            candidateScriptID =
                this.liveClosedWorklistDetails.responses.filter((item: LiveClosedResponse) => item.markGroupId
                    === selectedMarkGroupId).get(0).candidateScriptId;

            this.liveClosedWorklistDetails.responses.map((x: LiveClosedResponse) => {
                if ((x.candidateScriptId === candidateScriptID)) {
                    x.isPromotedSeed = true;
                }
            });
        } else if (this.workListType === enums.WorklistType.directedRemark) {
            candidateScriptID =
                this.directedRemarkClosedWorkList.responses.filter((item: DirectedRemarkClosedResponse) => item.markGroupId
                    === selectedMarkGroupId).get(0).candidateScriptId;

            this.directedRemarkClosedWorkList.responses.map((x: DirectedRemarkClosedResponse) => {
                if ((x.candidateScriptId === candidateScriptID)) {
                    x.isPromotedSeed = true;
                }
            });

        } else if (this.workListType === enums.WorklistType.pooledRemark) {
            candidateScriptID =
                this.pooledRemarkClosedWorkList.responses.filter((item: PooledRemarkClosedResponse) => item.markGroupId
                    === selectedMarkGroupId).get(0).candidateScriptId;

            this.pooledRemarkClosedWorkList.responses.map((x: PooledRemarkClosedResponse) => {
                if ((x.candidateScriptId === candidateScriptID)) {
                    x.isPromotedSeed = true;
                }
            });
        }
    }

    /**
     * Returns a value indicating whether we are in MarkingCheckMode.
     */
    public get isMarkingCheckMode(): boolean {
        return this._isMarkingCheckMode;
    }

    /**
     * Fetches the currently selected examiner in marking check worklist
     */
    public get selectedMarkingCheckExaminer(): MarkingCheckExaminerInfo {
        return this._sortedMarkingCheckExaminerList.filter((examiner: MarkingCheckExaminerInfo) => examiner.isSelected).first();
    }

    /**
     * Fetches the sorted marking check requesters examiner list
     */
    public get markingCheckExaminersList(): Immutable.List<MarkingCheckExaminerInfo> {

        return this._sortedMarkingCheckExaminerList;
    }

    /**
     * Get Marking Check Failure Code
     */
    public get markingCheckFailureCode(): enums.FailureCode {
        return this._markingCheckFailureCode;
    }

    /**
     * Returns whether we can promote a response as seed or not based on seed targets.
     */
    public get hasSeedTargets(): boolean {
        let workListDetails: WorklistBase = this.getWorklistDetails(this.workListType, this.getResponseMode);
        return workListDetails.hasSeedTargets;
    }

    /**
     * clear response from worklist collection
     * @param markGroupId
     * @param worklistType
     */
    public clearResponseDetailsByMarkGroupId(markGroupId: number, worklistType: enums.WorklistType) {
        let index = 0;
        let responseCollection: any;
        switch (worklistType) {
            case enums.WorklistType.live:
                responseCollection = this.liveOpenWorklistDetails.responses;
                break;
            case enums.WorklistType.atypical:
                responseCollection = this.atypicalOpenWorklistDetails.responses;
                break;
        }

        //removing response from collection.
        responseCollection.map((response: ResponseBase) => {
            if (response.markGroupId === markGroupId) {
                responseCollection = responseCollection.remove(index);
            }
            index++;
        });

        switch (worklistType) {
            case enums.WorklistType.live:
                this.liveOpenWorklistDetails.responses = responseCollection;
                break;
            case enums.WorklistType.atypical:
                this.atypicalOpenWorklistDetails.responses = responseCollection;
                break;
        }
    }

    /**
     * to update the worklist data with tag id once the tag is updated/deleted
     * @param displayId
     * @param tagId
     */
    private updateTagId(tagId: number, tagOrder: number, markGroupId: number): void {

        switch (this.currentWorklistType) {
            case enums.WorklistType.live:
                switch (this.responseMode) {
                    case enums.ResponseMode.open:
                        this.liveOpenWorklistDetails.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagId = tagId;
                        this.liveOpenWorklistDetails.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagOrder = tagOrder;
                        break;
                    case enums.ResponseMode.pending:
                        this.pendingWorkListDetails.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagId = tagId;
                        this.pendingWorkListDetails.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagOrder = tagOrder;
                        break;
                    case enums.ResponseMode.closed:
                        this.liveClosedWorklistDetails.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagId = tagId;
                        this.liveClosedWorklistDetails.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagOrder = tagOrder;
                        break;
                }
                break;
            case enums.WorklistType.directedRemark:
                switch (this.responseMode) {
                    case enums.ResponseMode.open:
                        this.directedRemarkOpenWorkList.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagId = tagId;
                        this.directedRemarkOpenWorkList.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagOrder = tagOrder;
                        break;
                    case enums.ResponseMode.pending:
                        this.directedRemarkPendingWorklist.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagId = tagId;
                        this.directedRemarkPendingWorklist.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagOrder = tagOrder;
                        break;
                    case enums.ResponseMode.closed:
                        this.directedRemarkClosedWorkList.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagId = tagId;
                        this.directedRemarkClosedWorkList.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagOrder = tagOrder;
                        break;
                }
                break;
            case enums.WorklistType.pooledRemark:
                switch (this.responseMode) {
                    case enums.ResponseMode.open:
                        this.pooledRemarkOpenWorkList.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagId = tagId;
                        this.pooledRemarkOpenWorkList.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagOrder = tagOrder;
                        break;
                    case enums.ResponseMode.pending:
                        this.pooledRemarkPendingWorklist.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagId = tagId;
                        this.pooledRemarkPendingWorklist.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagOrder = tagOrder;
                        break;
                    case enums.ResponseMode.closed:
                        this.pooledRemarkClosedWorkList.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagId = tagId;
                        this.pooledRemarkClosedWorkList.responses.
                            filter((item: ResponseBase) => item.markGroupId === markGroupId).first().tagOrder = tagOrder;
                        break;
                }
                break;
        }
    }

    /**
     * Get the Display Id for the mark group
     * @param markGroupId
     */
    public displayIdOfMarkGroup(markGroupId: number) {
        let currentWorklistResponseBaseDetails: Immutable.List<ResponseBase> =
            this.getCurrentWorklistResponseBaseDetails();

        let displayId: string;
        currentWorklistResponseBaseDetails.every((x: ResponseBase) => {
            if (x.markGroupId === markGroupId) {
                displayId = x.displayId;
                return false;
            }

            return true;
        });
        return displayId;
    }

    /**
     * update ResolvedExceptionCount in worklist in worklist store.
     * @param displayID
     */
    public updateResolvedExceptionCount(displayID : string) {
        // Check the display Id exists in the list
        if (this.getCurrentWorklistResponseBaseDetails()) {
            let response = this.getCurrentWorklistResponseBaseDetails().filter(
                (response: ResponseBase) => response.displayId === displayID);
            if (response != null && response !== undefined && response.count() === 1) {
                response.map((x: ResponseBase) => {
                    x.resolvedExceptionsCount = x.resolvedExceptionsCount - 1;
                });
            }
        }
    }
}

let instance = new WorkListStore();
export = { WorkListStore, instance };