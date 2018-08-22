import storeBase = require('../base/storebase');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import qigSelectorDataFetchAction = require('../../actions/qigselector/qigselectordatafetchaction');
import qigSelectorAction = require('../../actions/qigselector/qigselectoraction');
import dispatcher = require('../../app/dispatcher');
import overviewData = require('./typings/overviewdata');
import groupHelper = require('../../utility/grouping/grouphelper');
import grouperList = require('../../utility/grouping/groupingbase/grouperlist');
import enums = require('../../components/utility/enums');
import qigSummary = require('./typings/qigsummary');
import worklistStore = require('../worklist/workliststore');
import markingTargetSummary = require('../../stores/worklist/typings/markingtargetsummary');
import responseAllocateAction = require('../../actions/response/responseallocateaction');
import submitResponseCompletedAction = require('../../actions/submit/submitresponsecompletedaction');
import backgroundPulseAction = require('../../actions/backgroundpulse/backgroundpulseaction');
import markingTarget = require('./typings/markingtarget');
import saveMarksAndAnnotationsAction = require('../../actions/response/savemarksandannotationsaction');
import acceptQualityFeedbackAction = require('../../actions/response/acceptqualityfeedbackaction');
import responseDataGetAction = require('../../actions/response/responsedatagetaction');
import showHeaderIconsAction = require('../../actions/qigselector/showheadericonsaction');
import markerOperationModeChangedAction = require('../../actions/userinfo/markeroperationmodechangedaction');
import teamManagementHistoryInfoAction = require('../../actions/teammanagement/teammanagementhistoryinfoaction');
import warningMessageNavigationAction = require('../../actions/teammanagement/warningmessagenavigationaction');
import getLocksInQigsAction = require('../../actions/qigselector/getlocksinqigsaction');
import locksInQigDetailsList = require('./typings/locksinqigdetailslist');
import showLocksInQigPopupAction = require('../../actions/qigselector/showlocksinqigpopupaction');
import openQigFromLockedListAction = require('../../actions/qigselector/openqigfromlockedlistaction');
import Immutable = require('immutable');
import stringHelper = require('../../utility/stringformat/stringformathelper');
import getSimulationModeExitedQigsAction = require('../../actions/qigselector/getsimulationmodeexitedqigsaction');
import simulationModeExitedQigList = require('./typings/simulationmodeexitedqiglist');
import getSimulationExitedAndLockInQigsAction = require('../../actions/qigselector/getsimulationexitedandlockinqigsaction');
import simulationTargetCompletedAction = require('../../actions/qigselector/simulationtargetcompletedaction');
import standardisationSetupCompletedAction = require('../../actions/qigselector/standardisationsetupcompletedaction');
import loadAcetatesDataAction = require('../../actions/acetates/loadacetatesdataaction');
import addOrUpdateAcetateAction = require('../../actions/acetates/addorupdateacetateaction');
import saveAcetatesDataAction = require('../../actions/acetates/saveacetatesdataaction');
import removeAcetateDataaction = require('../../actions/acetates/removeacetatedataaction');
import acetateMovingAction = require('../../actions/acetates/acetatemovingaction');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import acetateInGreyAreaAction = require('../../actions/acetates/acetateingreyareaaction');
import acetateContextMenuData = require('../../components/utility/contextmenu/acetatecontextmenudata');
import constants = require('../../components/utility/constants');
import shareAcetateDataaction = require('../../actions/acetates/shareacetatedataaction');
import shareconfirmationpopupaction = require('../../actions/acetates/shareconfirmationpopupaction');
import addPointToMultilineAction = require('../../actions/acetates/addpointtomultilineaction');
import multilineStyleUpdateAction = require('../../actions/acetates/multilinestyleupdateaction');
import resetAcetateSaveInProgressAction = require('../../actions/acetates/resetacetatesaveinprogressstatusaction');
import stdSetupPermissionHelper = require('../../utility/standardisationsetup/standardisationsetuppermissionhelper');
import standardisationSetupCCData = require('../standardisationsetup/typings/standardisationsetupccdata');
import completeStandardisationSetupCompletedAction = require('../../actions/standardisationsetup/completestandardisationsetupaction');
import aggregatedQigExpandorCollapseAction = require('../../actions/qigselector/aggregatedqigexpandorcollapseaction');
import awardingCandidateDetailsGetAction = require('../../actions/awarding/awardingcandidatedetailsgetaction');
import setSelectedCandidateDataAction = require('../../actions/awarding/setselectedcandidatedataaction');
import concurrentSaveFailInStmPopupAction = require('../../actions/standardisationsetup/concurrentsavefailinstmpopupaction');

class QigStore extends storeBase {
    public static QIG_LIST_LOADED_EVENT = 'qiglistloadedevent';
    public static QIG_SELECTED_EVENT = 'qigselectedevent';

    public static ACCEPT_QUALITY_ACTION_COMPLETED = 'AcceptQualityFeedbackActionCompleted';
    public static SHOW_HEADER_ICONS = 'ShowHeaderIconsOnTopBar';

    public static NAVIGATE_TO_WORKLIST_FROM_QIG_SELECTOR_EVENT = 'NavigateToWorklistFromQigSelectorEvent';

    public static QIG_SELECTED_FROM_HISTORY_EVENT = 'qigselectedfromhistoryevent';

    public static SHOW_LOCKS_IN_QIG_POPUP = 'showlocksinqigpopup';
    public static LOCKS_IN_QIG_DATA_RETRIEVED = 'locksinqigdataretrieved';
    public static QIG_SELECTED_FROM_LOCKED_LIST = 'qigselectedfromlockedlist';
    public static SIMULATION_EXITED_QIGS_RETRIEVED = 'simulationexitedqigsretrieved';
    public static SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS_RETRIEVED = 'getsimulationexitedandlocksinqigsaction';
    public static SIMULATION_TARGET_COMPLETED = 'simulationtargetcompleted';
    public static STANDARDISATION_SETUP_COMPLETED_EVENT = 'standardisationsetupcompletedevent';
    public static ACETATES_DATA_LOADED_EVENT = 'acetatesdataloadedevent';
    public static ACETATES_ADDED_OR_UPDATED_EVENT = 'acetatesaddedorupdatedevent';
    public static ACETATES_REMOVED_EVENT = 'acetateremovedevent';
    public static ACETATES_MOVING = 'acetatesbordershowing';
    public static ACETATE_IN_GREY_AREA = 'acetateingreyarea';
    public static MULTILINE_REMOVED_EVENT = 'multilineremovedevent';
    public static ACETATES_SHARED_EVENT = 'acetatesharedevent';
    public static ADD_POINT_TO_MULTILINE_EVENT = 'addpointtomultiline';
    public static SAVE_ACETATES_DATA_ACTION_COMPLETED = 'saveacetatesdataactioncompleted';
    public static SHARE_CONFIRMATION_EVENT = 'shareconfirmationevent';
    public static MULTILINE_STYLE_UPDATE_EVENT = 'multilinestyleupdateevent';
    public static RESET_SHARED_ACETATES_COMPLETED = 'resetsharedacetatescompleted';
    public static RESET_ACETATE_SAVE_IN_PROGRESS_STATUS_COMPLETED = 'resetacetatesaveinprogressstatuscompleted';

    private isSuccess: boolean;
    private _qigOverviewData: overviewData;

    // This will hold the selected qig for Marking operation
    private _selectedQigForMarking: qigSummary;
    // This will hold the selected qig for Team Management operation
    private _selectedQigForTeamManagement: qigSummary;
    private _isQIGCollectionLoaded: boolean = false;
    private _markerOperationMode: enums.MarkerOperationMode = enums.MarkerOperationMode.Marking;

    /* Navigating from response to different view */
    private _navigatingTo: enums.SaveAndNavigate;

    private _locksInQigList: locksInQigDetailsList = undefined;
    private _doShowLocksInQigPopUp: boolean = false;

    private _isShowLocksFromLogout: boolean = false;
    private _simulationModeExitedQigList: simulationModeExitedQigList = undefined;
    private _doShowAllSimulationExitedQigs: boolean = false;
    private _isSimulationTargetCompleted: boolean = false;
    private _isStandardisationSetupCompleted: boolean = false;
    private _navigateFromBeforeStdSetupCheck: enums.PageContainers;
    private _navigateToAfterStdSetupCheck: enums.PageContainers;
    private _acetatesList: Immutable.List<Acetate>;
    private _multilineList: Immutable.List<AcetateData>;
    private _isAcetateMoving: boolean = false;
    private storageAdapterHelper = new storageAdapterHelper();
    private _previousSelectedQigId: number = 0;
    private _sharedAcetatesList: Immutable.List<Acetate>;
    private _candidateDetails: Immutable.List<AwardingCandidateDetails>;

    // To check if any of the qigs for the marker is in simulation
    private hasSimulationQigExists: boolean = true;
    private aggregatedQigGroupsInExapndedState: Array<number> = new Array<number>();

    // To keep the list of QIGS to be in hidden state.
    private _hiddenQigList: Array<number> = new Array<number>();

    /**
     * @constructor
     */
    constructor() {
        super();

        this._dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.QIGSELECTOR:
                    let _qigSelectorDataFetchAction: qigSelectorDataFetchAction = action as qigSelectorDataFetchAction;
                    this.isSuccess = _qigSelectorDataFetchAction.getOverviewData.success;
                    if (this.isSuccess) {
                        if (_qigSelectorDataFetchAction.getOverviewData.qigSummary.count() > 0) {
                            this.hasSimulationQigExists =
                                _qigSelectorDataFetchAction.getOverviewData.qigSummary
                                    .filter(
                                        (x: qigSummary) =>
                                            x.currentMarkingTarget.markingMode === enums.MarkingMode.Simulation
                                    )
                                    .count() > 0;
                        }
                        if (_qigSelectorDataFetchAction.getQigToBeFetched === 0) {
                            this._isQIGCollectionLoaded = true;
                            this._qigOverviewData = _qigSelectorDataFetchAction.getOverviewData;
                            this.addHiddenQIGs();
                            if (_qigSelectorDataFetchAction.doEmit) {
                                this.emit(QigStore.QIG_LIST_LOADED_EVENT);
                            }
                        } else {
                            this._isQIGCollectionLoaded = false;

                            // In Remember QIG functionality, Related QIG Collection is getting populated by SP for the Whole Response.
                            // Should be keep in the collection for the QIG Name, while creating Exception for other QIGs [Whole Response].
                            if (this._qigOverviewData === undefined) {
                                // handled only in Remember QIg
                                this._qigOverviewData = _qigSelectorDataFetchAction.getOverviewData;
                            }

                            this.setSelectedQIGForMarkerOperation(
                                _qigSelectorDataFetchAction.getOverviewData.qigSummary
                                    .filter(
                                        (x: qigSummary) =>
                                            x.markSchemeGroupId === _qigSelectorDataFetchAction.getQigToBeFetched
                                    )
                                    .first(),
                                _qigSelectorDataFetchAction.isDataForTheLoggedInUser
                            );
                            if (_qigSelectorDataFetchAction.doEmit) {
                                this.emit(
                                    QigStore.QIG_SELECTED_EVENT,
                                    _qigSelectorDataFetchAction.isDataFromSearch,
                                    _qigSelectorDataFetchAction.isDataFromHistory,
                                    _qigSelectorDataFetchAction.isFromLocksInPopUp
                                );
                                if (_qigSelectorDataFetchAction.isDataFromHistory) {
                                    this.emit(QigStore.QIG_SELECTED_FROM_HISTORY_EVENT);
                                }
                            }
                        }
                    } else {
                        // If not successfull incase of n/w error, dont prevent to load any page, eg:worklist
                        _qigSelectorDataFetchAction.getQigToBeFetched === 0
                            ? this.emit(QigStore.QIG_LIST_LOADED_EVENT)
                            : this.emit(QigStore.QIG_SELECTED_EVENT);
                    }
                    break;
                case actionType.MARK:
                    this.setSelectedQIGForMarkerOperation(
                        this._qigOverviewData.qigSummary
                            .filter(
                                (x: qigSummary) =>
                                    x.markSchemeGroupId === (action as qigSelectorAction).getSelectedQigId()
                            )
                            .first(),
                        true
                    );
                    if ((action as qigSelectorAction).dispatchEvent) {
                        this.emit(QigStore.QIG_SELECTED_EVENT);
                    } else if ((action as qigSelectorAction).isFromHistory) {
                        this.emit(QigStore.QIG_SELECTED_FROM_HISTORY_EVENT);
                    }
                    break;
                case actionType.RESPONSE_ALLOCATED:
                    /** Check the current approval status is withdrawn, If so remove the QIG. from the list */
                    let responseAllocation = action as responseAllocateAction;
                    if (
                        responseAllocation.allocatedResponseData.examinerApprovalStatus ===
                        enums.ExaminerApproval.Withdrawn
                    ) {
                        this.removeSelectedQIGFromCollection();
                    }

                    /** For whole response download, clear the qig cache so that all the qigs get reflected of the change. */
                    if (
                        responseAllocation.allocatedResponseData &&
                        responseAllocation.allocatedResponseData.allocatedResponseItems &&
                        responseAllocation.allocatedResponseData.allocatedResponseItems.length > 0 &&
                        responseAllocation.allocatedResponseData.allocatedResponseItems[0].isWholeResponse
                    ) {
                        this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                    }
                    this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                    break;
                case actionType.ATYPICAL_SEARCH_MOVETOWORKLIST_ACTION:
                    this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                    break;
                case actionType.SUBMIT_RESPONSE_COMPLETED:
                    /** Check the current approval status is withdrawn, If so remove the QIG. from the list */
                    let submitResponseCompletedAction: submitResponseCompletedAction = action as submitResponseCompletedAction;

                    if (
                        submitResponseCompletedAction.getSubmitResponseReturnDetails.responseSubmitErrorCode ===
                        constants.QIG_SESSION_CLOSED
                    ) {
                        return;
                    }
                    if (
                        submitResponseCompletedAction.getSubmitResponseReturnDetails.examinerApprovalStatus ===
                        enums.ExaminerApproval.Withdrawn
                    ) {
                        this.removeSelectedQIGFromCollection();
                        return;
                    }

                    /** getting thequality feedback flag */
                    if (this.selectedQIGForMarkerOperation) {
                        this.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding =
                            submitResponseCompletedAction.getSubmitResponseReturnDetails.hasQualityFeedbackOutstanding;
                        this.selectedQIGForMarkerOperation.qualityFeedbackOutstandingSeedTypeId =
                            submitResponseCompletedAction.getSubmitResponseReturnDetails.seedTypeId;
                    }
                    /** Submitted Info needs to be updated in all QIGS while for Atypical and WholeResponses */
                    this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                    break;
                case actionType.BACKGROUND_PULSE:
                    let success: boolean = (action as backgroundPulseAction).success;
                    if (
                        (action as backgroundPulseAction).getOnlineStatusData.examinerApprovalStatus ===
                        enums.ExaminerApproval.Withdrawn
                    ) {
                        this.removeSelectedQIGFromCollection();
                    }
                    break;
                case actionType.SAVE_MARKS_AND_ANNOTATIONS:
                    /** Check the current approval status is withdrawn, If so remove the QIG. from the list */
                    let saveAction: saveMarksAndAnnotationsAction = action as saveMarksAndAnnotationsAction;
                    if (
                        saveAction.saveMarksAndAnnotationsData &&
                        saveAction.saveMarksAndAnnotationsData.saveMarksErrorCode ===
                        enums.SaveMarksAndAnnotationErrorCode.WithdrawnResponse
                    ) {
                        this.removeSelectedQIGFromCollection();
                    }
                    break;
                case actionType.ACCEPT_QUALITY_ACTION:
                    let acceptFeedbakAction = action as acceptQualityFeedbackAction;
                    if (acceptFeedbakAction.acceptQualityFeedbackActionData.success) {
                        if (this.selectedQIGForMarkerOperation) {
                            this.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding = false;
                            this.selectedQIGForMarkerOperation.qualityFeedbackOutstandingSeedTypeId =
                                enums.SeedType.None;
                        }
                        this.emit(QigStore.ACCEPT_QUALITY_ACTION_COMPLETED, enums.SaveAndNavigate.toWorklist);
                    }
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    let responseDataGetAction = action as responseDataGetAction;

                    if (responseDataGetAction.searchedResponseData) {
                        // While opening a response from message, MARKER_OPERATION_MODE_CHANGED_ACTION is not fired,
                        // So set the operation mode . Set marking in case of Supervisor Remark navigation
                        if (
                            responseDataGetAction.searchedResponseData.triggerPoint === enums.TriggerPoint.SupervisorRemark
                        ) {
                            this._markerOperationMode = enums.MarkerOperationMode.Marking;
                        } else if (responseDataGetAction.searchedResponseData.isTeamManagement) {
                            this._markerOperationMode = enums.MarkerOperationMode.TeamManagement;
                        } else if (responseDataGetAction.searchedResponseData.isStandardisationSetup) {
                            this._markerOperationMode = enums.MarkerOperationMode.StandardisationSetup;
                        }

                        if (this.selectedQIGForMarkerOperation !== undefined) {
                            // Clear the data If the Selected QIG and searching display Id belongs to another QIG
                            if (
                                this.selectedQIGForMarkerOperation &&
                                this.selectedQIGForMarkerOperation.markSchemeGroupId !==
                                responseDataGetAction.searchedResponseData.markSchemeGroupId
                            ) {
                                this.setSelectedQIGForMarkerOperation(undefined, true);
                            }
                        }
                    }
                    break;
                case actionType.SHOW_HEADER_ICONS:
                    let displayIconsAction = action as showHeaderIconsAction;
                    this.emit(QigStore.SHOW_HEADER_ICONS, displayIconsAction.showHeaderIcons);
                    break;
                case actionType.NAVIGATE_TO_WORKLIST_FROM_QIG_SELECTOR_ACTION:
                    this.emit(QigStore.NAVIGATE_TO_WORKLIST_FROM_QIG_SELECTOR_EVENT);
                    break;
                case actionType.UPDATE_EXAMINER_DRILL_DOWN_DATA:
                    // clear selected qig data for waiting for subordinates selected qig data.
                    this.setSelectedQIGForMarkerOperation(undefined, false);
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    // setting marker operation mode for changing selected qig data
                    this._markerOperationMode = (action as markerOperationModeChangedAction).operationMode;
                    break;
                case actionType.WARNING_MESSAGE_NAVIGATION_ACTION:
                    let navigationAction = action as warningMessageNavigationAction;
                    let isPEorAPE =
                        this._selectedQigForMarking.role === enums.ExaminerRole.principalExaminer ||
                        this._selectedQigForMarking.role === enums.ExaminerRole.assistantPrincipalExaminer;
                    if (navigationAction.failureCode === enums.FailureCode.NotApproved) {
                        this._selectedQigForMarking.examinerApprovalStatus = enums.ExaminerApproval.NotApproved;
                    } else if (navigationAction.failureCode === enums.FailureCode.Suspended) {
                        this._selectedQigForMarking.examinerApprovalStatus = enums.ExaminerApproval.Suspended;
                    } else if (navigationAction.failureCode === enums.FailureCode.Withdrawn) {
                        this.setSelectedQIGForMarkerOperation(undefined, true);
                        this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                    }
                    break;
                case actionType.TEAM_MANAGEMENT_HISTORY_INFO_ACTION:
                    let _setTeamManagementHistoryInfoAction = action as teamManagementHistoryInfoAction;
                    if (
                        _setTeamManagementHistoryInfoAction.markingMode === enums.MarkerOperationMode.TeamManagement &&
                        _setTeamManagementHistoryInfoAction.historyItem.team.currentContainer !==
                        enums.PageContainers.TeamManagement &&
                        _setTeamManagementHistoryInfoAction.failureCode === enums.FailureCode.None
                    ) {
                        // clear selected qig data for waiting for subordinates selected qig data.
                        this.setSelectedQIGForMarkerOperation(undefined, false);
                    }
                    break;
                case actionType.GET_LOCKS_IN_QIGS:
                    let _getLocksInQigsAction = action as getLocksInQigsAction;
                    this._locksInQigList = _getLocksInQigsAction.locksInQigDetailsList;
                    this.emit(
                        QigStore.LOCKS_IN_QIG_DATA_RETRIEVED,
                        _getLocksInQigsAction.isFromLogout,
                        _getLocksInQigsAction.locksInQigDetailsList
                    );
                    break;
                case actionType.SHOW_LOCKS_IN_QIG_POPUP:
                    let _showLocksInQigPopupAction = action as showLocksInQigPopupAction;
                    this._doShowLocksInQigPopUp = _showLocksInQigPopupAction.doShowLocksInQigPopup;
                    this._isShowLocksFromLogout = _showLocksInQigPopupAction.isShowLocksFromLogout;
                    this.emit(QigStore.SHOW_LOCKS_IN_QIG_POPUP, this.getLocksInQigList);
                    break;
                case actionType.OPEN_QIG_FROM_LOCKED_LIST:
                    let _openQigFromLockedListAction = action as openQigFromLockedListAction;
                    this._doShowLocksInQigPopUp = false;
                    this.emit(QigStore.QIG_SELECTED_FROM_LOCKED_LIST, _openQigFromLockedListAction.qigId);
                    break;
                case actionType.GET_SIMULATION_MODE_EXITED_QIGS:
                    let _getSimulationModeExitedQigsAction = action as getSimulationModeExitedQigsAction;
                    this._simulationModeExitedQigList = _getSimulationModeExitedQigsAction.simulationModeExitedQigList;
                    this.emit(
                        QigStore.SIMULATION_EXITED_QIGS_RETRIEVED,
                        _getSimulationModeExitedQigsAction.simulationModeExitedQigList
                    );
                    break;
                case actionType.GET_SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS:
                    let _getSimulationExitedAndLockInQigsAction = action as getSimulationExitedAndLockInQigsAction;
                    this._simulationModeExitedQigList =
                        _getSimulationExitedAndLockInQigsAction.simulationModeExitedQigList;
                    this._locksInQigList = _getSimulationExitedAndLockInQigsAction.locksInQigDetailsList;
                    this.emit(
                        QigStore.SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS_RETRIEVED,
                        _getSimulationExitedAndLockInQigsAction.isFromLogout
                    );
                    break;
                case actionType.SIMULATION_TARGET_COMPLETED:
                    let _simulationTargetCompleted = action as simulationTargetCompletedAction;
                    this._isSimulationTargetCompleted = _simulationTargetCompleted.isTargetCompleted;
                    this._simulationModeExitedQigList.qigList = Immutable.List<SimulationModeExitedQig>();
                    // Updating the qig overview data on completing simulation target
                    if (this._qigOverviewData) {
                        // Updating the marking mode of all simulation exited qigs.
                        _simulationTargetCompleted.simulationExitedExaminerRoleIds.map((examinerRoleId: number) => {
                            let filteredQigs = this._qigOverviewData.qigSummary.filter(
                                (x: qigSummary) =>
                                    x.examinerRoleId === examinerRoleId &&
                                    x.currentMarkingTarget.markingMode === enums.MarkingMode.Simulation
                            );
                            if (filteredQigs.count() > 0) {
                                filteredQigs.first().currentMarkingTarget.markingMode = undefined;
                            }
                        });
                    }
                    this.emit(QigStore.SIMULATION_TARGET_COMPLETED, _simulationTargetCompleted.isTargetCompleted);
                    break;
                case actionType.STANDARDISATION_SETUP_COMPLETED:
                    let _standardisationSetupCompletedAction = action as standardisationSetupCompletedAction;
                    this.selectedQIGForMarkerOperation.standardisationSetupComplete =
                        _standardisationSetupCompletedAction.isStandardisationSetupCompleted;
                    // Updating the qig overview data on completing standardisation setup.
                    if (this._qigOverviewData) {
                        this._qigOverviewData.qigSummary
                            .filter(
                                (x: qigSummary) =>
                                    x.examinerRoleId === this.selectedQIGForMarkerOperation.examinerRoleId &&
                                    x.currentMarkingTarget.markingMode === enums.MarkingMode.Simulation
                            )
                            .first().standardisationSetupComplete =
                            _standardisationSetupCompletedAction.isStandardisationSetupCompleted;
                    }
                    this._isStandardisationSetupCompleted =
                        _standardisationSetupCompletedAction.isStandardisationSetupCompleted;
                    this._navigateFromBeforeStdSetupCheck = _standardisationSetupCompletedAction.navigatedFrom;
                    this._navigateToAfterStdSetupCheck = _standardisationSetupCompletedAction.navigatedTo;
                    if (this._navigateFromBeforeStdSetupCheck !== enums.PageContainers.None) {
                        this.emit(
                            QigStore.STANDARDISATION_SETUP_COMPLETED_EVENT,
                            _standardisationSetupCompletedAction.isStandardisationSetupCompleted
                        );
                    }
                    break;
                case actionType.LOAD_ACETATES_DATA_ACTION:
                    let _loadAcetatesDataAction = action as loadAcetatesDataAction;
                    this._acetatesList = _loadAcetatesDataAction.acetatesData;
                    /* Filter shared acetates from the acetate list collection.
                       It is used for resetting the shared acetate changes done by the team member other than PE */
                    this._sharedAcetatesList = Immutable.List<Acetate>(
                        JSON.parse(JSON.stringify(this._acetatesList.filter((x: Acetate) => x.shared === true)))
                    );
                    this._previousSelectedQigId = this.selectedQIGForMarkerOperation.markSchemeGroupId;
                    this.emit(QigStore.ACETATES_DATA_LOADED_EVENT);
                    break;
                case actionType.ADD_OR_UPDATE_ACETATE_ACTION:
                    let _addOrUpdateAcetateAction = action as addOrUpdateAcetateAction;
                    let acetate = _addOrUpdateAcetateAction.acetate;
                    let _clientToken = _addOrUpdateAcetateAction.clientToken;
                    let _acetateContextMenuData = _addOrUpdateAcetateAction.acetateContextMenuData;
                    let _markingOperation = _addOrUpdateAcetateAction.markingOperation;
                    this.addOrUpdateAcetate(acetate, _clientToken, _acetateContextMenuData, _markingOperation);
                    this.emit(QigStore.ACETATES_ADDED_OR_UPDATED_EVENT, _clientToken, acetate);
                    break;
                case actionType.SAVE_ACETATES_DATA_ACTION:
                    let _saveAcetateListAction = action as saveAcetatesDataAction;
                    let savedAcetatesList = _saveAcetateListAction.acetatesData;
                    this.ResetAcetatesDetails(savedAcetatesList);
                    this.emit(QigStore.SAVE_ACETATES_DATA_ACTION_COMPLETED);
                    break;
                case actionType.REMOVE_ACETATE_DATA_ACTION:
                    let _removeAcetateDataAction = action as removeAcetateDataaction;
                    let removeAcetateClientToken: string = _removeAcetateDataAction.clienToken;
                    let multilineItem: enums.MultiLineItems = _removeAcetateDataAction.multilineItem;
                    let acetateContextMenuData: acetateContextMenuData =
                        _removeAcetateDataAction.acetateContextMenuData;
                    switch (multilineItem) {
                        case enums.MultiLineItems.line:
                            this.removeMultilineFromCollection(removeAcetateClientToken, acetateContextMenuData);
                            break;
                        case enums.MultiLineItems.point:
                            this.removePointFromCollection(removeAcetateClientToken, acetateContextMenuData);
                            break;
                        default:
                            this.removeAcetateFromCollection(removeAcetateClientToken);
                            break;
                    }
                    this.emit(QigStore.ACETATES_REMOVED_EVENT);
                    break;
                case actionType.ACETATE_MOVING_ACTION:
                    let isAcetateMovingAction = action as acetateMovingAction;
                    this._isAcetateMoving = isAcetateMovingAction.isMoving;
                    this.emit(QigStore.ACETATES_MOVING, this._isAcetateMoving);
                    break;
                case actionType.ACETATE_IN_GREY_AREA_ACTION:
                    let acetateInGreyAreaAction = action as acetateInGreyAreaAction;
                    this.emit(QigStore.ACETATE_IN_GREY_AREA, acetateInGreyAreaAction.isInGreyArea);
                    break;
                case actionType.SHARE_ACETATE_DATA_ACTION:
                    let _shareAcetateDataAction = action as shareAcetateDataaction;
                    let shareAcetateClientToken: string = _shareAcetateDataAction.clienToken;
                    let isShared: boolean = this.shareAcetateFromCollection(shareAcetateClientToken);
                    this.emit(QigStore.ACETATES_SHARED_EVENT, isShared);
                    break;
                case actionType.ADD_POINT_TO_MULTILINE:
                    let _addPointToMultilineAction: addPointToMultilineAction = action as addPointToMultilineAction;
                    this.emit(
                        QigStore.ADD_POINT_TO_MULTILINE_EVENT,
                        _addPointToMultilineAction.clientToken,
                        _addPointToMultilineAction.x,
                        _addPointToMultilineAction.y,
                        _addPointToMultilineAction.acetateContextMenuData,
                        _addPointToMultilineAction.multilineItems
                    );
                    break;
                case actionType.SHARE_CONFIRMATION_POPUP_ACTION:
                    let _shareConfirmationPopupAction = action as shareconfirmationpopupaction;
                    this.emit(
                        QigStore.SHARE_CONFIRMATION_EVENT,
                        _shareConfirmationPopupAction.clienToken,
                        _shareConfirmationPopupAction.ShareMultiline
                    );
                    break;
                case actionType.MULTILINE_STYLE_UPDATE:
                    let _multilineStyleUpdateAction: multilineStyleUpdateAction = action as multilineStyleUpdateAction;
                    this.emit(
                        QigStore.MULTILINE_STYLE_UPDATE_EVENT,
                        _multilineStyleUpdateAction.clientToken,
                        _multilineStyleUpdateAction.clientX,
                        _multilineStyleUpdateAction.clientY,
                        _multilineStyleUpdateAction.acetateContextMenuData,
                        _multilineStyleUpdateAction.multiLineItems
                    );
                    break;
                case actionType.RESET_SHARED_ACETATES_ACTION:
                    this.resetSharedAcetates();
                    this.emit(QigStore.RESET_SHARED_ACETATES_COMPLETED);
                    break;
                case actionType.RESET_ACETATE_SAVE_IN_PROGRESS_STATUS_ACTION:
                    let _resetAcetateSaveInProgressAction = action as resetAcetateSaveInProgressAction;
                    let modifiedAcetatesList: Immutable.List<Acetate> = Immutable.List<Acetate>();
                    modifiedAcetatesList = this.ResetSaveInProgressFlag(_resetAcetateSaveInProgressAction.acetatesList);
                    if (modifiedAcetatesList && modifiedAcetatesList.size > 0) {
                        this.emit(QigStore.RESET_ACETATE_SAVE_IN_PROGRESS_STATUS_COMPLETED, modifiedAcetatesList);
                    }
                    break;
                case actionType.COMPLETE_STANDARDISATION_SETUP:
                    let _completestandardisationsetupaction = (action as completeStandardisationSetupCompletedAction);
                    if (_completestandardisationsetupaction.
                        completeStandardisationSetupReturnDetails.completeStandardisationValidation
                        !== enums.CompleteStandardisationErrorCode.StandardisationNotComplete) {
                        this.selectedQIGForMarkerOperation.standardisationSetupComplete = true;
                        // Updating the qig overview data on completing standardisation setup.
                        if (this._qigOverviewData) {
                            this._qigOverviewData.qigSummary
                                .filter(
                                    (x: qigSummary) =>
                                        x.markSchemeGroupId === this.selectedQIGForMarkerOperation.markSchemeGroupId
                                )
                                .first().standardisationSetupComplete = true;
                        }
                    }
                    break;
                case actionType.AGGREGATED_QIG_EXPAND_OR_COLLAPSE:
                    let _aggregatedqigExpandorCollapseAction = (action as aggregatedQigExpandorCollapseAction);
                    this.isAggregatedQigInExpandedState(_aggregatedqigExpandorCollapseAction.getGroupIdofSelectedQig);
                    break;
                case actionType.CANDIDATE_DETAILS_GET:
                    let _candidateDetailsGetAction = (action as awardingCandidateDetailsGetAction);
                    this._candidateDetails = Immutable.List<AwardingCandidateDetails>
                        (_candidateDetailsGetAction.candidateDetailsList.awardingCandidateList);
					break;
				case actionType.CONCURRENT_SAVE_FAILED:
					let _concurrentsavefailedaction = (action as concurrentSaveFailInStmPopupAction);
					if (_concurrentsavefailedaction.isStandardisationSetupCompleted) {
						this.selectedQIGForMarkerOperation.standardisationSetupComplete = true;
					}
					break;
                case actionType.SET_SELECTED_CANDIDATE_DATA:
                    let _selectedCandidateDataAction = (action as setSelectedCandidateDataAction);
                    let qigSummaryList = Immutable.List<qigSummary>();
                    let qigSummary: qigSummary;
                    let selectedCandidateData = this._candidateDetails.filter
                        (x => x.awardingCandidateID === _selectedCandidateDataAction.awardingCandidateId).first();

                    selectedCandidateData.responseItemGroups.map((y: ResponseItemGroup, index) => {
                        qigSummary = this.generateQigSummaryObj();
                        qigSummary.examinerRoleId = y.examinerRoleId;
                        qigSummary.markSchemeGroupId = y.markSchemeGroupId;
                        qigSummary.questionPaperPartId = y.questionPaperId;
                        qigSummary.role = y.role;
                        qigSummary.relatedQIGCount = selectedCandidateData.responseItemGroups.size;
                        qigSummary.markingMethod = selectedCandidateData.markingMethodID;
                        qigSummary.examSessionId = selectedCandidateData.examSessionID;
                        qigSummaryList = qigSummaryList.push(qigSummary);

                        if (qigSummary.markSchemeGroupId === selectedCandidateData.responseItemGroups[0].markSchemeGroupId) {
                            this.setSelectedQIGForMarkerOperation(
                                qigSummary,
                                false
                            );
                        }
                    });
                    let qigData = this._qigOverviewData.qigSummary.concat(qigSummaryList);
                    this._qigOverviewData.qigSummary = Immutable.List(qigData);
                    break;
            }
        });
    }

    /**
     *  to generate the qig summary object
     */
    private generateQigSummaryObj(): qigSummary {
        let qigSummary: qigSummary = {
            examinerRoleId: null,
            role: null,
            markSchemeGroupId: null,
            markSchemeGroupName: null,
            questionPaperName: null,
            examinerApprovalStatus: null,
            questionPaperPartId: null,
            assessmentCode: null,
            assessmentName: null,
            componentId: null,
            componentName: null,
            sessionId: null,
            sessionName: null,
            isestdEnabled: null,
            standardisationSetupComplete: null,
            isElectronicStandardisationTeamMember: null,
            hasQualityFeedbackOutstanding: null,
            isOpenForMarking: null,
            hasSimulationMode: null,
            hasSTMSimulationMode: null,
            newMessageCount: null,
            isMarkFromPaper: null,
            examinerQigStatus: null,
            currentMarkingTarget: null,
            markingTargets: null,
            markingMethod: null,
            standardisationSetupCompletedDate: null,
            hasGracePeriod: null,
            examSessionId: null,
            qualityFeedbackOutstandingSeedTypeId: null,
            isMarkingEnabled: null,
            isTeamManagementEnabled: null,
            hasSecondStandardisationResponseClassified: null,
            isForAdminRemark: null,
            hasMarkingInstructions: null,
            hasAnyStuckExaminers: null,
            hasAnyLockedExaminers: null,
            hasPermissionInRelatedQIGs: null,
            relatedQIGCount: null,
            centreScriptAvaliabityCount: null,
            isStandardisationSetupAvaliable: null,
            zonedScriptAvailabilityCount: null,
            isMarkedAsProvisional: null,
            standardisationSetupPermissionCCValue: null,
            isAggregateQIGTargetsON: null,
            groupId: null,
            isstmInAnyRelatedQIGs: null,
            hasOpenMessageOrException: null,
            isStandardisationSetupLinkVisible: null,
            hasBrowsePermissionOnly: null,
            isStandardisationSetupButtonVisible: null,
            isHideInOverviewWhenNoWorkCCON: null
        };

        return qigSummary;
    }

    /**
     * Get the simulation QIGs exists or not
     */
    public get hasAnySimulationQigs(): boolean {
        return this.hasSimulationQigExists;
    }

    /**
     * Get the locks in qig details
     */
    public get getLocksInQigList(): locksInQigDetailsList {
        return this._locksInQigList;
    }

    /**
     * Get the Overview Data
     */
    public get getOverviewData(): overviewData {
        return this._qigOverviewData;
    }

    /**
     * Get the Previous selected qig id 
     */
    public get getPreviousSelectedQigId(): number {
        return this._previousSelectedQigId;
    }

    /**
     * Get Qigs GroupedBy
     * @param groupBy
     */
    public getQigsGroupedBy(groupBy: enums.GroupByField, isSelectedExaminerSTM: boolean) {
        this.updateQigsWithChangedResponseCount(isSelectedExaminerSTM);
        let hiddenOIGFilteredList: any = this._qigOverviewData.qigSummary.filter(q => !this.isQIGHidden(q.markSchemeGroupId));
        return groupHelper.group(hiddenOIGFilteredList, grouperList.QigSelectorGrouper, groupBy);
    }

    /**
     * Updating the closed response count in the _qigOverviewData collection
     * If the qig related data changed after loading qig selector, it will update
     * with correct data
     */
    private updateQigsWithChangedResponseCount(isSelectedExaminerSTM: boolean): void {
        // If the selected QIG is undefined return, otherwise this method will be throwing error below.
        if (!this.selectedQIGForMarkerOperation) {
            return;
        }

        let markingTargetsSummary: Immutable.List<markingTargetSummary>;
        let filteredMarkingTargetsSummary: Immutable.List<markingTargetSummary>;
        /** Getting  markingTargetsSummary from worklist store,
         * it is a locally updated list based on the worklist response collection changes
         */
        markingTargetsSummary = worklistStore.instance.getExaminerMarkingTargetProgress(isSelectedExaminerSTM);

        if (markingTargetsSummary) {
            let that = this;

            this._qigOverviewData.qigSummary.map(function (qigSummaryItem: qigSummary) {
                // Select the particular QIG that needs to be updated
                if (qigSummaryItem.examinerRoleId === that.selectedQIGForMarkerOperation.examinerRoleId) {
                    // Get live, directed and pooled remarking marking targets
                    filteredMarkingTargetsSummary = markingTargetsSummary.filter(
                        (x: markingTargetSummary) =>
                            (x.markingModeID === enums.MarkingMode.LiveMarking ||
                                x.markingModeID === enums.MarkingMode.Remarking) &&
                            x.examinerRoleID === that.selectedQIGForMarkerOperation.examinerRoleId
                    ) as Immutable.List<markingTargetSummary>;

                    filteredMarkingTargetsSummary.map(function (markingTargetSummaryItem: markingTargetSummary) {
                        // Update response count for current target of the selected QIG
                        if (
                            qigSummaryItem.currentMarkingTarget.markingMode === markingTargetSummaryItem.markingModeID
                        ) {
                            if (
                                qigSummaryItem.currentMarkingTarget.openResponsesCount !==
                                markingTargetSummaryItem.examinerProgress.openResponsesCount
                            ) {
                                qigSummaryItem.currentMarkingTarget.openResponsesCount =
                                    markingTargetSummaryItem.examinerProgress.openResponsesCount;
                            }

                            if (
                                qigSummaryItem.currentMarkingTarget.pendingResponsesCount !==
                                markingTargetSummaryItem.examinerProgress.pendingResponsesCount
                            ) {
                                qigSummaryItem.currentMarkingTarget.pendingResponsesCount =
                                    markingTargetSummaryItem.examinerProgress.pendingResponsesCount;
                            }

                            if (
                                qigSummaryItem.currentMarkingTarget.closedResponsesCount !==
                                markingTargetSummaryItem.examinerProgress.closedResponsesCount
                            ) {
                                qigSummaryItem.currentMarkingTarget.closedResponsesCount =
                                    markingTargetSummaryItem.examinerProgress.closedResponsesCount;
                            }
                            qigSummaryItem.currentMarkingTarget.openAtypicalResponsesCount =
                                markingTargetSummaryItem.examinerProgress.atypicalOpenResponsesCount;
                            qigSummaryItem.currentMarkingTarget.pendingAtypicalResponsesCount =
                                markingTargetSummaryItem.examinerProgress.atypicalPendingResponsesCount;
                            qigSummaryItem.currentMarkingTarget.closedAtypicalResponsesCount =
                                markingTargetSummaryItem.examinerProgress.atypicalClosedResponsesCount;
                        }

                        // If filtered count is greater than 1 that means it has more than live responses
                        if (filteredMarkingTargetsSummary.count() > 1) {
                            // Update response count for all marking targets of the selected QIG
                            qigSummaryItem.markingTargets.map(function (qigMarkingTargetItem: markingTarget) {
                                // Update remark count
                                if (
                                    qigMarkingTargetItem.markingMode === markingTargetSummaryItem.markingModeID &&
                                    qigMarkingTargetItem.remarkRequestType ===
                                    markingTargetSummaryItem.remarkRequestTypeID
                                ) {
                                    if (
                                        qigMarkingTargetItem.openResponsesCount !==
                                        markingTargetSummaryItem.examinerProgress.openResponsesCount
                                    ) {
                                        qigMarkingTargetItem.openResponsesCount =
                                            markingTargetSummaryItem.examinerProgress.openResponsesCount;
                                    }

                                    if (
                                        qigMarkingTargetItem.pendingResponsesCount !==
                                        markingTargetSummaryItem.examinerProgress.pendingResponsesCount
                                    ) {
                                        qigMarkingTargetItem.pendingResponsesCount =
                                            markingTargetSummaryItem.examinerProgress.pendingResponsesCount;
                                    }

                                    if (
                                        qigMarkingTargetItem.closedResponsesCount !==
                                        markingTargetSummaryItem.examinerProgress.closedResponsesCount
                                    ) {
                                        qigMarkingTargetItem.closedResponsesCount =
                                            markingTargetSummaryItem.examinerProgress.closedResponsesCount;
                                    }
                                }

                                qigMarkingTargetItem.openAtypicalResponsesCount =
                                    markingTargetSummaryItem.examinerProgress.atypicalOpenResponsesCount;
                                qigMarkingTargetItem.pendingAtypicalResponsesCount =
                                    markingTargetSummaryItem.examinerProgress.atypicalPendingResponsesCount;
                                qigMarkingTargetItem.closedAtypicalResponsesCount =
                                    markingTargetSummaryItem.examinerProgress.atypicalClosedResponsesCount;
                            });
                        }
                    });
                }
            });
        }
    }

    /**
     * get the collection of Added/Modified acetates list for save to the database.
     */
    public getModifiedAcetatesList(): Immutable.List<Acetate> {
        let modifiedAcetatesList: Immutable.List<Acetate> = Immutable.List<Acetate>();
        if (this._acetatesList && this._acetatesList.size > 0) {
            modifiedAcetatesList = Immutable.List<Acetate>(
                this._acetatesList.filter(
                    (x: Acetate) => x.markingOperation !== enums.MarkingOperation.none && x.isSaveInProgress === false
                )
            );
        }
        return modifiedAcetatesList;
    }

    /**
     * get the collection of  acetate list  which is in saveprogress mode.
     */
    public getSaveProgressAcetataeList(): Immutable.List<Acetate> {
        let saveProgressAcetataeList: Immutable.List<Acetate> = Immutable.List<Acetate>();
        if (this._acetatesList && this._acetatesList.size > 0) {
            saveProgressAcetataeList = Immutable.List<Acetate>(
                this._acetatesList.filter((x: Acetate) => x.isSaveInProgress === true)
            );
        }
        return saveProgressAcetataeList;
    }

    /**
     * Looping on the each acetate list for resetings the isSaveInProgress flag in the collection.
     */
    public ResetSaveInProgressFlag(modifiedAcetatesList: Immutable.List<Acetate>) {
        let that = this;
        modifiedAcetatesList.map((x: Acetate) => {
            this._acetatesList.map(function (y: Acetate, index: number, arr: any) {
                that.updateSaveInProgressOnTheAcetateItem(x, y, arr, index);
            });
        });

        return modifiedAcetatesList;
    }

    /**
     * This particular method set isSaveInProgress flag as true before save trigger.
     * For identifying save is in progreess or not.
     */

    private updateSaveInProgressOnTheAcetateItem(
        modifiedAcetatesList: Acetate,
        acetateInClient: Acetate,
        arr: any,
        index: number
    ) {
        if (modifiedAcetatesList.clientToken === acetateInClient.clientToken) {
            acetateInClient.isSaveInProgress = true;
        }
    }

    /**
     * Looping on the each acetate list for resetings the flag in the collection.
     */
    public ResetAcetatesDetails(savedAcetatesList: Immutable.List<Acetate>) {
        let that = this;
        savedAcetatesList.map((x: Acetate) => {
            that._acetatesList.map(function (y: Acetate, index: number, arr: Immutable.List<Acetate>) {
                that.resetFlagsOnTheAcetateItem(x, y, arr, index);
            });
        });
    }

    /**
     * This particular method resets the flag on the acetate item based on the scenarios after save trigger.
     */

    private resetFlagsOnTheAcetateItem(
        savedAcetatesList: Acetate,
        acetateInClient: Acetate,
        arr: Immutable.List<Acetate>,
        index: number
    ) {
        if (savedAcetatesList.clientToken === acetateInClient.clientToken) {
            acetateInClient.acetateId = savedAcetatesList.acetateId;
            acetateInClient.isSaveInProgress = false;
            if (savedAcetatesList.updateOn === acetateInClient.updateOn) {
                if (acetateInClient.markingOperation === enums.MarkingOperation.deleted) {
                    this._acetatesList = this._acetatesList.delete(index);
                } else {
                    acetateInClient.markingOperation = enums.MarkingOperation.none;
                }
            }
        }
    }

    /**
     * Updating the acetate flags accordingly  when we remove any acetate.
     */

    private removeAcetateFromCollection(removeAcetateClientToken: string) {
        this._acetatesList.map((x: Acetate) => {
            if (x.clientToken === removeAcetateClientToken) {
                x.markingOperation = enums.MarkingOperation.deleted;
                x.isSaveInProgress = false;
                x.updateOn = Date.now();
            }
        });
    }

    /**
     * Updating the multiline flags accordingly  when we remove any multiline.
     */
    private removeMultilineFromCollection(
        removeMultilineClientToken: string,
        acetateContextMenuData: acetateContextMenuData
    ) {
        this._acetatesList.map((x: Acetate) => {
            if (x.clientToken === removeMultilineClientToken) {
                if (acetateContextMenuData.multilinearguments.noOfLines === 1) {
                    x.markingOperation = enums.MarkingOperation.deleted;
                } else {
                    x.acetateData.acetateLines.splice(acetateContextMenuData.multilinearguments.LineIndex, 1);
                    x.markingOperation = enums.MarkingOperation.updated;
                }
                x.isSaveInProgress = false;
            }
        });
    }

    /**
     * update Multiline Style.
     */
    private updateMultilineStyle(clientToken: string, acetateContextMenuData: acetateContextMenuData) {
        this._acetatesList.map((x: Acetate) => {
            if (x.clientToken === clientToken) {
                x.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].lineType =
                    acetateContextMenuData.multilinearguments.LineType;
                x.markingOperation = enums.MarkingOperation.updated;
                x.isSaveInProgress = false;
            }
        });
    }

    /**
     * update Multiline Color
     * @param clientToken
     * @param acetateContextMenuData
     */
    private updateMultilineColor(clientToken: string, acetateContextMenuData: acetateContextMenuData) {
        this._acetatesList.map((x: Acetate) => {
            if (x.clientToken === clientToken) {
                x.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].colour =
                    acetateContextMenuData.multilinearguments.LineColor;
                x.markingOperation = enums.MarkingOperation.updated;
                x.isSaveInProgress = false;
            }
        });
    }

    /**
     * Updating acetate data
     */
    private addOrUpdateAcetate(
        acetate: Acetate,
        clientToken: string,
        acetateContextMenuData: acetateContextMenuData,
        markingOperation: enums.MarkingOperation
    ) {
        if (acetateContextMenuData) {
            this.addOrUpdateMultiLine(clientToken, acetateContextMenuData);
        } else {
            if (markingOperation === enums.MarkingOperation.added) {
                acetate.isSaveInProgress = false;
                let item = this._acetatesList.filter((item) => item.clientToken === acetate.clientToken);
                acetate.markingOperation = enums.MarkingOperation.added;
                if (item.count() > 0) {
                    this.updateAcetateData(acetate);
                } else if (acetate.acetateData.acetateLines && acetate.acetateData.acetateLines[0].points !== null) {
                    this._acetatesList = this._acetatesList.push(acetate);
                }
            } else if (markingOperation === enums.MarkingOperation.updated) {
                acetate.isSaveInProgress = false;
                acetate.markingOperation = enums.MarkingOperation.updated;
                this.updateAcetateData(acetate);
            }
        }
    }

    /**
     * Updating the multiline data.
     */
    private addOrUpdateMultiLine(clientToken: string, acetateContextMenuData: acetateContextMenuData) {
        switch (acetateContextMenuData.menuAction) {
            case enums.MenuAction.AddMultilineLine:
                let lineAcetate = this._acetatesList.filter((item) => item.clientToken === clientToken);
                if (lineAcetate.count() > 0) {
                    this.updateMultilineData(clientToken, acetateContextMenuData);
                }
                break;
            case enums.MenuAction.AddMultilinePoint:
                let pointAcetate = this._acetatesList.filter((item) => item.clientToken === clientToken);
                if (pointAcetate.count() > 0) {
                    this.updateMultilinePointData(clientToken, acetateContextMenuData);
                }
                break;
            case enums.MenuAction.LineStyleOverlay:
                this.updateMultilineStyle(clientToken, acetateContextMenuData);
                break;
            case enums.MenuAction.ChangeColorOverlay:
                this.updateMultilineColor(clientToken, acetateContextMenuData);
                break;
        }
    }

    /**
     * Remove point from collection
     * @param removeMultilineClientToken
     * @param acetateContextMenuData
     */
    private removePointFromCollection(
        removeMultilineClientToken: string,
        acetateContextMenuData: acetateContextMenuData
    ) {
        this._acetatesList.map((x: Acetate) => {
            if (x.clientToken === removeMultilineClientToken) {
                if (acetateContextMenuData.multilinearguments.noOfPoints === 2) {
                    //In case when one line with two points exist in collection of multiline remove that perticular line
                    x.acetateData.acetateLines.splice(acetateContextMenuData.multilinearguments.LineIndex, 1);
                    if (acetateContextMenuData.multilinearguments.noOfLines === 1) {
                        // if only one line with two points exist and no other lines in collection exist remove the entire
                        // multiline collection
                        x.markingOperation = enums.MarkingOperation.deleted;
                    } else {
                        x.markingOperation = enums.MarkingOperation.updated;
                    }
                } else {
                    x.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].points.splice(
                        acetateContextMenuData.multilinearguments.PointIndex,
                        1
                    );
                    x.markingOperation = enums.MarkingOperation.updated;
                }
                x.isSaveInProgress = false;
            }
        });
    }

    /**
     * Updating the shared status of multiline.
     */

    private shareAcetateFromCollection(shareAcetateClientToken: string): boolean {
        let isShared: boolean = false;
        this._acetatesList.map((x: Acetate) => {
            if (x.clientToken === shareAcetateClientToken) {
                x.shared = isShared = !x.shared;
                x.isSaveInProgress = false;
                if (x.acetateId === undefined) {
                    x.markingOperation = enums.MarkingOperation.added;
                } else {
                    x.markingOperation = enums.MarkingOperation.updated;
                }
            }
        });
        return isShared;
    }

    /**
     * Set the selected QIG for marker operation
     */
    private setSelectedQIGForMarkerOperation(selectedQig: qigSummary, isForTheLoggedInUser: boolean) {
        if (!selectedQig) {
            // reseting both selected qig items
            if (isForTheLoggedInUser) {
                this._selectedQigForMarking = undefined;
            }

            this._selectedQigForTeamManagement = undefined;
        } else if (this._markerOperationMode === enums.MarkerOperationMode.Marking
            || this._markerOperationMode === enums.MarkerOperationMode.StandardisationSetup
            || this._markerOperationMode === enums.MarkerOperationMode.Awarding) {
            this._selectedQigForMarking = selectedQig;
        } else {
            this._selectedQigForTeamManagement = selectedQig;
        }

        if (isForTheLoggedInUser) {
            this._selectedQigForMarking = selectedQig;
        }
    }

    /**
     * Retrieves a value indicating whole response is available or not
     */
    public get isWholeResponseAvailable(): boolean {
        let isWholeResponseAvailable: boolean = false;
        if (this._selectedQigForMarking && this._selectedQigForMarking.hasPermissionInRelatedQIGs) {
            if (this._qigOverviewData !== undefined) {
                let relatedQigList = this._qigOverviewData.qigSummary.filter(
                    (x: qigSummary) => x.questionPaperPartId === this.selectedQIGForMarkerOperation.questionPaperPartId
                );

                let availableQigs = relatedQigList.filter(
                    (x: qigSummary) =>
                        (x.role === enums.ExaminerRole.principalExaminer ||
                            x.role === enums.ExaminerRole.assistantPrincipalExaminer) &&
                        x.standardisationSetupComplete &&
                        x.examinerApprovalStatus === enums.ExaminerApproval.Approved
                );
                isWholeResponseAvailable = relatedQigList.count() === availableQigs.count();
            }
        }
        return isWholeResponseAvailable;
    }

	/**
	 * Returns the relatedQigList
	 */
    public get relatedQigList(): Immutable.Iterable<number, qigSummary> {
        let hasPermissionInRelatedQIGs: boolean = this.isWholeResponseAvailable ? this.isWholeResponseAvailable : true;
        let relatedQigList: Immutable.Iterable<number, qigSummary>;

        if (this._selectedQigForMarking && hasPermissionInRelatedQIGs) {
            if (this._qigOverviewData !== undefined) {
                relatedQigList = this._qigOverviewData.qigSummary.filter((x: qigSummary) =>
                    x.questionPaperPartId === this.selectedQIGForMarkerOperation.questionPaperPartId
                );
            }
        }
        return relatedQigList;
    }

    /**
     * Retrieves a value indicating atypical response is available or not
     */
    public get isAtypicalAvailable(): boolean {
        let isAtypicalAvailable: boolean = false;

        if (this._qigOverviewData !== undefined) {
            if (this._selectedQigForMarking.relatedQIGCount === 0) {
                isAtypicalAvailable =
                    this._qigOverviewData.qigSummary
                        .filter(
                            (x: qigSummary) =>
                                x.questionPaperPartId === this.selectedQIGForMarkerOperation.questionPaperPartId
                        )
                        .first().examinerApprovalStatus === enums.ExaminerApproval.Approved;
            } else {
                let relatedQigList = this._qigOverviewData.qigSummary.filter(
                    (x: qigSummary) => x.questionPaperPartId === this.selectedQIGForMarkerOperation.questionPaperPartId
                );

                let availableQigs = relatedQigList.filter(
                    (x: qigSummary) =>
                        x.standardisationSetupComplete && x.examinerApprovalStatus === enums.ExaminerApproval.Approved
                );

                isAtypicalAvailable =
                    this._selectedQigForMarking.hasPermissionInRelatedQIGs &&
                    relatedQigList.count() === availableQigs.count();
            }
        }
        return isAtypicalAvailable;
    }

    /**
     * Retrieves approval statuses in all related qigs for the current examiner.
     * QIG : Approval Status pair
     */
    public get examinerApprovalStatusInRelatedQigs(): Immutable.Map<number, enums.ExaminerApproval> {
        let examinerApprovalDetailsForWholeResponse: Immutable.Map<number, enums.ExaminerApproval> = Immutable.Map<
            number,
            enums.ExaminerApproval
            >();

        let relatedQigList: Immutable.List<qigSummary>;

        if (this._qigOverviewData !== undefined) {
            relatedQigList = this._qigOverviewData.qigSummary
                .filter(
                    (x: qigSummary) => x.questionPaperPartId === this.selectedQIGForMarkerOperation.questionPaperPartId
                )
                .toList();

            if (relatedQigList && relatedQigList.count() > 0) {
                relatedQigList.map((qig: qigSummary) => {
                    examinerApprovalDetailsForWholeResponse = examinerApprovalDetailsForWholeResponse.set(
                        qig.markSchemeGroupId,
                        qig.examinerApprovalStatus
                    );
                });
            }
        }

        return examinerApprovalDetailsForWholeResponse;
    }

    /**
     * Get's the selected QIG based on the marker operation If Marker Operation is Marking then
     * this will return the selectedQIGForMarking object or this will return selectedQigForTeamManagement
     */
    public get selectedQIGForMarkerOperation(): qigSummary {
        if (this._markerOperationMode === enums.MarkerOperationMode.Marking
            || this._markerOperationMode === enums.MarkerOperationMode.StandardisationSetup
            || this._markerOperationMode === enums.MarkerOperationMode.Awarding
            || worklistStore.instance.isMarkingCheckMode) {
            return this._selectedQigForMarking;
        } else {
            return this._selectedQigForTeamManagement;
        }
    }

    /**
     * Retrieves a value indicating if the QIG Collection is loaded
     */
    public get isQIGCollectionLoaded() {
        return this._isQIGCollectionLoaded;
    }

    /**
     * Remove the selected QIG from the collection
     */
    private removeSelectedQIGFromCollection() {
        if (this._qigOverviewData) {
            this._qigOverviewData.qigSummary = this._qigOverviewData.qigSummary
                .filter((x: qigSummary) => x.markSchemeGroupId !== this.selectedQIGForMarkerOperation.markSchemeGroupId)
                .toList();
        }
        this.setSelectedQIGForMarkerOperation(undefined, true);
    }

    /**
     * Get the Logged in User QIG details
     */
    public get getSelectedQIGForTheLoggedInUser() {
        return this._selectedQigForMarking;
    }

    /**
     * Get doShowLocksInQigPopUp
     */
    public get doShowLocksInQigPopUp(): boolean {
        return this._doShowLocksInQigPopUp;
    }

    public get isShowLocksFromLogout(): boolean {
        return this._isShowLocksFromLogout;
    }

    // Gets a value indicating the current qig name.
    public get qigName(): string {
        let qigName: string = '';
        if (this._markerOperationMode === enums.MarkerOperationMode.Marking && this._selectedQigForMarking) {
            qigName = stringHelper.formatAwardingBodyQIG(
                this._selectedQigForMarking.markSchemeGroupName,
                this._selectedQigForMarking.assessmentCode,
                this._selectedQigForMarking.sessionName,
                this._selectedQigForMarking.componentId,
                this._selectedQigForMarking.questionPaperName,
                this._selectedQigForMarking.assessmentName,
                this._selectedQigForMarking.componentName,
                stringHelper.getOverviewQIGNameFormat()
            );
        } else if (this._selectedQigForTeamManagement) {
            qigName = stringHelper.formatAwardingBodyQIG(
                this._selectedQigForTeamManagement.markSchemeGroupName,
                this._selectedQigForTeamManagement.assessmentCode,
                this._selectedQigForTeamManagement.sessionName,
                this._selectedQigForTeamManagement.componentId,
                this._selectedQigForTeamManagement.questionPaperName,
                this._selectedQigForMarking.assessmentName,
                this._selectedQigForMarking.componentName,
                stringHelper.getOverviewQIGNameFormat()
            );
        }
        return qigName;
    }

    // Gets a value indicating whether the current screen is team management.
    public get isTeamManagemement(): boolean {
        return this._markerOperationMode === enums.MarkerOperationMode.TeamManagement;
    }

    /**
     * Gets the simulation mode exited qiglist
     */
    public get getSimulationModeExitedQigList(): simulationModeExitedQigList {
        return this._simulationModeExitedQigList;
    }

    /**
     * Check if standardisation setup for the qig is completed.
     */
    public get isStandardisationsetupCompletedForTheQig(): boolean {
        return this._isStandardisationSetupCompleted;
    }

    /**
     * Gets the container to navigate to aftercheck
     */
    public get navigateToAfterStdSetupCheck(): enums.PageContainers {
        return this._navigateToAfterStdSetupCheck;
    }

    /**
     * Gets the container to navigate to aftercheck
     */
    public get acetatesList(): Immutable.List<Acetate> {
        // JSON.stringify() added to remove reference for items in the store.
        if (this._acetatesList) {
            return Immutable.List<Acetate>(JSON.parse(JSON.stringify(this._acetatesList)));
        }
    }

    /**
     * update the acetate collection
     * @param acetateData
     */
    private updateAcetateData(acetateData: Acetate) {
        this._acetatesList.forEach((item: Acetate) => {
            if (item.clientToken === acetateData.clientToken) {
                if (item.acetateId === undefined) {
                    item.markingOperation = enums.MarkingOperation.added;
                } else {
                    item.markingOperation = enums.MarkingOperation.updated;
                }
                item.acetateData = acetateData.acetateData;
                item.isSaveInProgress = false;
                item.updateOn = Date.now();
            }
        });
    }

    /**
     * update the acetate collection
     * @param clientToken
     * @param acetateContextMenuData
     */
    private updateMultilineData(clientToken: string, acetateContextMenuData: acetateContextMenuData) {
        this._acetatesList.forEach((item: Acetate) => {
            if (item.clientToken === clientToken) {
                if (item.acetateId === undefined) {
                    item.markingOperation = enums.MarkingOperation.added;
                } else {
                    item.markingOperation = enums.MarkingOperation.updated;
                }

                let acetateLine = {
                    colour: constants.LINE_COLOR,
                    lineType: acetateContextMenuData.multilinearguments.LineType,
                    points: acetateContextMenuData.multilinearguments.DefaultAcetatePoints
                };

                item.acetateData.acetateLines.push(acetateLine);
                item.isSaveInProgress = false;
            }
        });
    }

    /**
     * update the acetate collection
     * @param clientToken
     * @param acetateContextMenuData
     */
    private updateMultilinePointData(clientToken: string, acetateContextMenuData: acetateContextMenuData) {
        this._acetatesList.forEach((item: Acetate) => {
            if (item.clientToken === clientToken) {
                if (item.acetateId === undefined) {
                    item.markingOperation = enums.MarkingOperation.added;
                } else {
                    item.markingOperation = enums.MarkingOperation.updated;
                }

                item.acetateData.acetateLines[
                    acetateContextMenuData.multilinearguments.LineIndex
                ].points.splice(acetateContextMenuData.multilinearguments.PointIndex, 0, {
                    x: acetateContextMenuData.multilinearguments.Xcordinate,
                    y: acetateContextMenuData.multilinearguments.Ycordinate
                });
                item.isSaveInProgress = false;
            }
        });
    }

    /* return true if border is showing for acetates */
    public get isAcetateMoving(): boolean {
        return this._isAcetateMoving;
    }

    /**
     * Reset shared acetates
     */
    private resetSharedAcetates() {
        /* For a team member other than PE should be able to edit or remove the shared overlay.
           But it should be reappear next the response navigation.
           And also the overlay changes should not be saved in the database.*/
        if (
            this._acetatesList &&
            this._acetatesList.size > 0 &&
            this.getSelectedQIGForTheLoggedInUser &&
            this.getSelectedQIGForTheLoggedInUser.role !== enums.ExaminerRole.principalExaminer
        ) {
            let sharedAcetatesList: Immutable.List<Acetate> = Immutable.List<Acetate>(
                JSON.parse(JSON.stringify(this._sharedAcetatesList))
            );
            /* Remove shared overlay from the acetate list.
               Add previously selected shared overlays in the acetate list.
               So the shared overlay changes done by the team member should not reflect the acetate list collection.*/
            this._acetatesList = Immutable.List<Acetate>(this.acetatesList.filter((x: Acetate) => x.shared === false));
            let that = this;
            sharedAcetatesList.map(function (sharedItem: Acetate) {
                that._acetatesList = that._acetatesList.push(sharedItem);
            });
        }
    }

    /**
     * Get the markscheme group name
     */

    public getMarkSchemeGroupName(markSchemeGroupId: number): string {
        let returnqiglist = this.getOverviewData.qigSummary
            .filter((x: qigSummary) => x.markSchemeGroupId === markSchemeGroupId)
            .toList();
        return returnqiglist.first().markSchemeGroupName;
    }

    /**
     * Get the is Marked As Provisional value
     */
    public isMarkedAsProvisional(markSchemeGroupId: number): boolean {
        if (this._qigOverviewData) {
            let filteredQigList = this._qigOverviewData.qigSummary
                .filter((x: qigSummary) => x.markSchemeGroupId === markSchemeGroupId)
                .toList();
            return filteredQigList.first().isMarkedAsProvisional;
        } else {
            return false;
        }
    }

    /**
     * Get the Standardisation Setup Permissions
     */
    public getSSUPermissionsData(markSchemeGroupId: number): standardisationSetupCCData {
        let sSUPermissionCCValue = null;
        let stdSetupPremissionsData: standardisationSetupCCData = null;
        if (this._qigOverviewData) {
            let filteredQigList = this._qigOverviewData.qigSummary
                .filter((x: qigSummary) => x.markSchemeGroupId === markSchemeGroupId)
                .toList();
            sSUPermissionCCValue = filteredQigList.first().standardisationSetupPermissionCCValue;
            stdSetupPremissionsData =
                stdSetupPermissionHelper.generateSTDSetupPermissionData(sSUPermissionCCValue, filteredQigList.first().role);
        }
        return stdSetupPremissionsData;
    }

    /**
     * Update GroupId Collection of Aggregated Qig for expanded/collapsed state
     */
    public isAggregatedQigInExpandedState(groupId: number): void {
        let index = this.aggregatedQigGroupsInExapndedState.indexOf(groupId);
        if (index === -1) {
            this.aggregatedQigGroupsInExapndedState.push(groupId);
        } else {
            this.aggregatedQigGroupsInExapndedState.splice(index, 1);
        }
    }

    /**
     * On expand/collapse qigs
     */
    public qigStatus = (groupId: number): boolean => {
        let index = this.aggregatedQigGroupsInExapndedState.indexOf(groupId);
        return index > -1;
    }

    /**
     * Checks if the AggregateQig CC is enabled for the current qig.
     */
    public get isAggregatedQigCCEnabledForCurrentQig(): boolean {
        return this.selectedQIGForMarkerOperation && this.selectedQIGForMarkerOperation.isAggregateQIGTargetsON;
    }

    /**
     * Conditions for 'My Marking' button visibility.
     */
    private setMyMarkingVisibility(qigSummaryItem: qigSummary): void {
        if (qigSummaryItem.isForAdminRemark && qigSummaryItem.examinerQigStatus !== enums.ExaminerQIGStatus.Suspended) {
            qigSummaryItem.examinerQigStatus = enums.ExaminerQIGStatus.AdminRemark;
        }
        // Existing logic.
        qigSummaryItem.isMarkingEnabled = qigSummaryItem.isMarkingEnabled
            && qigSummaryItem.examinerQigStatus !== enums.ExaminerQIGStatus.WaitingStandardisation
            && qigSummaryItem.examinerQigStatus !== enums.ExaminerQIGStatus.AwaitingScripts
            && (qigSummaryItem.currentMarkingTarget != null || qigSummaryItem.isForAdminRemark);

        // If Hide In Overview When No Work CC is ON, recalculate the logic
        if (qigSummaryItem.isHideInOverviewWhenNoWorkCCON && qigSummaryItem.isMarkingEnabled) {
            qigSummaryItem.isMarkingEnabled =
                qigSummaryItem.isStandardisationSetupAvaliable && qigSummaryItem.standardisationSetupComplete
                && (
                    qigSummaryItem.examinerQigStatus === enums.ExaminerQIGStatus.Practice
                    || qigSummaryItem.examinerQigStatus === enums.ExaminerQIGStatus.StandardisationMarking
                    || qigSummaryItem.examinerQigStatus === enums.ExaminerQIGStatus.STMStandardisationMarking
                    || qigSummaryItem.hasOpenMessageOrException
                    || this.hasAnyOpenOrPendingResponses(qigSummaryItem))
                || qigSummaryItem.examinerQigStatus === enums.ExaminerQIGStatus.Simulation;
        }
    }

    /**
     * Gets whether any pooled, Open or Pending response to download.
     * @param qigSummaryItem
     */
    private hasAnyOpenOrPendingResponses(qig: qigSummary): boolean {
        let hasAnyOpenOrPendingResponses: boolean = false;

        // The examiner is on their live marking target and there are open or pending live or directed re- mark responses in their worklist
        // Or there are some live responses available to download.
        if (qig.currentMarkingTarget.markingMode === enums.MarkingMode.LiveMarking) {
            // Get the live marking targets.
            let targets = qig.markingTargets.filter(x => x.markingMode === enums.MarkingMode.LiveMarking || x.isDirectedRemark);

            targets.forEach(x => {
                // Check any of the target, has pending action
                if (!hasAnyOpenOrPendingResponses) {
                    hasAnyOpenOrPendingResponses = x.openResponsesCount > 0
                        || x.pendingResponsesCount > 0
                        || (x.areResponsesAvailableToBeDownloaded
                            && (qig.examinerQigStatus !== enums.ExaminerQIGStatus.LiveComplete || qig.hasPermissionInRelatedQIGs));
                }
            });
        }

        // If user does not anything to action in Live, Check anything pending for pooled Remark targets
        if (hasAnyOpenOrPendingResponses === false) {

            // Get the pooled remarking targets for the user.
            let remarkingTargets = qig.markingTargets.filter(x => x.remarkRequestType > 0 && !x.isDirectedRemark);

            remarkingTargets.forEach(x => {
                // Check any of the target, has pending action
                if (!hasAnyOpenOrPendingResponses) {
                    hasAnyOpenOrPendingResponses = x.openResponsesCount > 0
                        || x.pendingResponsesCount > 0
                        || x.areResponsesAvailableToBeDownloaded;
                }
            });
        }

        return hasAnyOpenOrPendingResponses;
    }

    /**
     * To get whether the qig is visible based on button visibility and cc for the given markSchemeGroupId.
     */
    private isQIGVisible(qigItem: qigSummary): boolean {
        // AggregatedTargets CC is OFF and HideInOverviewWhenNoWork CC is ON - Story 64901
        if (!qigItem.isAggregateQIGTargetsON && this._qigOverviewData.hasAnyQigWithHideInOverviewWhenNoWorkCCOn) {
            return qigItem.isMarkingEnabled
                || qigItem.isTeamManagementEnabled
                || qigItem.isStandardisationSetupButtonVisible
                || qigItem.isStandardisationSetupLinkVisible
                || qigItem.hasOpenMessageOrException;
        }

        return true;
    }

    /**
     * To get whether the qig is visible for the given markSchemeGroupId.
     */
    public isQIGHidden(markSchemeGroupId: number): boolean {
        return this._hiddenQigList.some((m: number) => m === markSchemeGroupId);
    }

    /**
     * Get the qig summary by mark scheme group id
     */
    public getQigSummary(markSchemeGroupId: number): qigSummary {
        let returnqiglist = this.getOverviewData.qigSummary
            .filter((x: qigSummary) => x.markSchemeGroupId === markSchemeGroupId)
            .toList();
        return returnqiglist.first();
    }

    /**
     * Loop through the list and find the QIGs which is to be hidden in the Home page
     */
    public addHiddenQIGs(): void {
        this._qigOverviewData.qigSummary.map((qigItem) => {
            this.setMyMarkingVisibility(qigItem);
            qigItem.isStandardisationSetupLinkVisible = this.isStandardisationSetupLinkVisible(qigItem);
            qigItem.isStandardisationSetupButtonVisible = this.isStandardisationSetupButtonVisible(qigItem);
            if (!this.isQIGVisible(qigItem)) {
                this._hiddenQigList.push(qigItem.markSchemeGroupId); // Add to array if qig needs to be hide.
            }
        });
    }

    /**
     * Returns whether standardisation setup button is visible or not.
     */
    public isStandardisationSetupButtonVisible(qig: qigSummary) {
        return (qig.isElectronicStandardisationTeamMember && qig.isStandardisationSetupAvaliable
            && (qig.centreScriptAvaliabityCount > 0 || qig.zonedScriptAvailabilityCount > 0)
            && (qig.examinerQigStatus === enums.ExaminerQIGStatus.WaitingStandardisation
                || qig.examinerQigStatus === enums.ExaminerQIGStatus.Simulation)
            && !this.isQigHasBrowseScriptPermissionOnly(qig));
    }

    /**
     * Returns whether standardisation setup link is visible or not.
     */
    public isStandardisationSetupLinkVisible(qig: qigSummary) {
        return (qig.isElectronicStandardisationTeamMember && qig.standardisationSetupComplete
            && qig.isestdEnabled && qig.isStandardisationSetupAvaliable)
            || (qig.isStandardisationSetupAvaliable && qig.isestdEnabled &&
                this.isQigHasBrowseScriptPermissionOnly(qig));
    }

    /**
     * Checking whether the qig is loaded with browse script link
     * It will check if the user has browse permission only / or he has BM permission (ESteam Member), then it will
     * additionaly check whether he has no viewdefinitive and editdefinitive permission (In this scenario as well user should have
     * the browse permission). 
     */
    public isQigHasBrowseScriptPermissionOnly(qig: qigSummary): boolean {
        let stdSetupPermissionData = this.getSSUPermissionsData(qig.markSchemeGroupId);
        let isCCDataPresent = stdSetupPermissionData && stdSetupPermissionData.isLoggedInExaminerRolePresentInCC;

        // If the user has browse permission only : return true
        // Else if the user is STM member and No CC Data and BM permission : return false
        // Else if the user is STM member CC Data Present and BM permisson : return false
        // Else if the user is STM , B permission Only, CC Data Not present : return true

        if (qig.hasBrowsePermissionOnly) {
            return true;
        } else if (qig.isElectronicStandardisationTeamMember && !isCCDataPresent) {
            return false;
        } else if (qig.isElectronicStandardisationTeamMember && isCCDataPresent &&
            !stdSetupPermissionData.role.permissions.viewDefinitives && !stdSetupPermissionData.role.permissions.editDefinitives) {
            return true;
        } else {
            return false;
        }
    }

    /* To get whether the qig is visible for the given markSchemeGroupId. */
    public get HiddenQIGs(): Array<number> {
        return this._hiddenQigList;
    }
}

let instance = new QigStore();

export = { QigStore, instance };
