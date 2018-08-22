import expandOrCollapseNodeAction = require('../../actions/teammanagement/expandorcollapsenodeaction');
import myTeamDataFetchAction = require('../../actions/teammanagement/myteamdatafetchaction');
import openTeamManagementAction = require('../../actions/teammanagement/openteammanagementaction');
import leftPanelToggleAction = require('../../actions/teammanagement/leftpaneltoggleaction');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import storeBase = require('../base/storebase');
import actionType = require('../../actions/base/actiontypes');
import Immutable = require('immutable');
import updateExaminerDrillDownDataAction = require('../../actions/teammanagement/updateexaminerdrilldowndataaction');
import markerOperationModeChangedAction = require('../../actions/userinfo/markeroperationmodechangedaction');
import enums = require('../../components/utility/enums');
import teammanagementTabSelectaAction = require('../../actions/teammanagement/teammanagementtabselectaction');
import changeExaminerStatusAction = require('../../actions/teammanagement/changeexaminerstatusaction');
import setExaminerStatusReturn = require('../../dataservices/teammanagement/typings/setexaminerstatusreturn');
import provideSecondStandardisationAction = require('../../actions/teammanagement/providesecondstandardisationaction');
import setSecondStandardisationReturn = require('../../dataservices/teammanagement/typings/setsecondstandardisationreturn');
import changeStatusPopupVisibilityAction = require('../../actions/teammanagement/changestatuspopupvisibilityaction');
import getUnActionedExceptionAction = require('../../actions/teammanagement/getunactionedexceptionaction');
import helpExaminersDataFetchAction = require('../../actions/teammanagement/helpexaminersdatafetchaction');
import validateTeamManagementExaminerAction = require('../../actions/teammanagement/validateteammanagementexamineraction');
import executeApprovalManagementAction = require('../../actions/teammanagement/executeapprovalmanagementaction');
import getTeamOverviewDataAction = require('../../actions/teammanagement/getteamoverviewdataaction');
import canExecuteApprovalManagementAction = require('../../actions/teammanagement/canexecuteapprovalmanagementaction');
import selectedExceptionAction = require('../../actions/teammanagement/selectedexceptionaction');
import selectedExceptionResetAction = require('../../actions/teammanagement/selectedexceptionresetaction');
import historyItem = require('../../utility/breadcrumb/historyitem');
import teamManagementHistoryInfoAction = require('../../actions/teammanagement/teammanagementhistoryinfoaction');
import promoteToSeedCheckRemarkAction = require('../../actions/response/promotetoseedcheckremarkaction');
import responseDataGetAction = require('../../actions/response/responsedatagetaction');
import samplingStatusChangeAction = require('../../actions/sampling/samplingstatuschangeaction');
import worklistTypeAction = require('../../actions/worklist/worklisttypeaction');
import setRememberQigAction = require('../../actions/useroption/setrememberqigaction');
import qigSelectorDataFetchAction = require('../../actions/qigselector/qigselectordatafetchaction');
import warningMessageNavigationAction = require('../../actions/teammanagement/warningmessagenavigationaction');
import teamSortAction = require('./../../actions/teammanagement/teamsortaction');
import comparerList = require('./../../utility/sorting/sortbase/comparerlist');
import loadContainerAction = require('./../../actions/navigation/loadcontaineraction');
// new type for default sort
type DefaultSort = { compareName: comparerList, sortDirection: enums.SortDirection };
import teamOverViewDetails = require('../../dataservices/teammanagement/typings/teamoverviewdetails');
import qigDetails = require('../../dataservices/teammanagement/typings/qigdetails');
import popUpDisplayAction = require('../../actions/popupdisplay/popupdisplayaction');
import qigSelectedFromMultiQigDropDownAction = require('../../actions/teammanagement/qigselectedfrommultiqigdropdownaction');
import multiQigLockDataFetchAction = require('../../actions/teammanagement/multiQigLockDataFetchAction');
import updateMultiQigLockSelectionAction = require('../../actions/teammanagement/updatemultiqiglockselectionaction');
import multiQigLockResultAction = require('../../actions/teammanagement/multiqiglockresultaction');
import responseReturnedToWorklistAction = require('../../actions/teammanagement/responsereturnedtoworklistaction');

/**
 * Team management store
 */
class TeamManagementStore extends storeBase {

    // my team data collection
    private _myTeamData: ExaminerData;
    private _myTeamDataList: Immutable.List<ExaminerData>;
    private _selectedMarkSchemeGroupId: number;
    private _selectedExaminerRoleId: number;
    private _isLeftPanelCollapsed: boolean;
    private _examinerDrillDownData: ExaminerDrillDownData;
    private _selectedTeamManagementTab: enums.TeamManagement;
    private _examinerStatusReturn: setExaminerStatusReturn;
    private _secondStandardisationReturn: setSecondStandardisationReturn;
    private _exceptionList: Immutable.List<UnActionedExceptionDetails>;
    private _examinersForHelpExaminers: Immutable.List<ExaminerDataForHelpExaminer>;
    private _isMyTeamRefreshRequired: boolean = false;
    private _isHelpExaminersDataChanged: boolean = false;
    private _teamOverviewCountData: teamOverViewDetails;
    private _selectedException: UnActionedExceptionDetails;
    private _isRedirectFromException: boolean = false;
    private _forceExpandMyTeamData: boolean = false;
    private success: boolean = false;
    private _visitedQigs: Array<number>;
    private _isFirstTimeTeamManagementAccessed: boolean = false;
    private _selectedSubordinateExaminerRoleId: number = 0;

    // contains examinerRoleId: number, isExpanded: number collections
    private _expandOrCollapseDetails: Immutable.Map<number, boolean>;
    // hold the sort details
    private _sortDetails: Array<TeamManagementSortDetails>;
    private _multiQigSelectedDetail: qigDetails = undefined;
    private _multiLockDataList: Immutable.List<MultiQigLockExaminer>;
    private _multiLockResults: Immutable.List<MultiLockResult>;
    private _multiLockExaminerDrillDownData: ExaminerDrillDownData;
    private _multiLockSelectedExaminerQigId: number = 0;

    public static MY_TEAM_DATA_LOADED_EVENT = 'myTeamDataLoadedEvent';
    public static EXPAND_OR_COLLAPSE_NODE_EVENT = 'expandOrCollapseExaminerNodeEvent';
    public static OPEN_TEAM_MANAGEMENT_EVENT = 'openTeamManagementEvent';
    public static SET_PANEL_STATE = 'setTeamManagementLeftPanelState';
    public static EXAMINER_DRILL_DOWN_DATA_UPDATED = 'examinerDrillDownDataUpdated';
    public static TEAM_MANAGEMENT_SELECTED_TAB = 'teamManagementSelectedTab';
    public static CHANGE_EXAMINER_STATUS_UPDATED = 'changeExaminerStatusUpdated';
    public static PROVIDE_SECOND_STANDARDISATION_UPDATED = 'provideSecondStandardisationUpdated';
    public static CHANGE_STATUS_POPUP_VISIBILITY_UPDATED = 'changestatuspopupvisibilityupdated';
    public static SET_EXAMINER_CHANGE_STATUS_BUTTON_AS_BUSY = 'setexaminerchangestatusbuttonasbusy';
    public static TEAM_EXCEPTIONS_DATA_LOADED_EVENT = 'teamExceptonsDataLoadedEvent';
    public static HELP_EXAMINERS_DATA_RECEIVED = 'helpExaminersDataReceived';
    public static APPROVAL_MANAGEMENT_ACTION_EXECUTED = 'executeapprovalmanagementaction';
    public static TEAM_OVERVIEW_DATA_RECEIVED = 'teamOverviewDataReceived';
    public static TEAM_OVERVIEW_DATA_RECEIVED_REMEMBER_QIG_EVENT = 'teamoverviewdatareceivedrememberqigevent';
    public static CAN_EXECUTE_APPROVAL_MANAGEMENT_ACTION = 'canExecuteApprovalManagementAction';
    public static SELECTED_EXCEPTION_ACTION_RECEIVED = 'selectedexceptionactionreceived';
    public static TEAM_MANAGEMENT_HISTORY_INFO_UPDATED_EVENT = 'teammanagementhistoryinfoupdatedevent';
    public static ADD_TO_HISTORY_EVENT = 'addtohistoryevent';
    public static SAMPLING_STATUS_CHANGED_EVENT = 'samplingstatuschangedevent';
    public static WORKLIST_DATA_UPDATED_EVENT = 'worklistdataupdatedevent';
    public static FAILURE_WHILE_FETCHING_TEAM_DATA_EVENT = 'failurewhilefetchingteamdataevent';
    public static TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT = 'teammanagementexaminervalidatedevent';
    public static FAILURE_WHILE_FETCHING_TEAM_DATA_ON_REMEMBER_QIG_EVENT = 'failurewhilefetchingteamdataonrememberqigevent';
    public static EXAMINER_VALIDATED_EVENT = 'examinervalidatedevent';
    public static EXAMINER_VALIDATED_OPEN_RESPONSE_EVENT = 'examinervalidatedopenresponseevent';
    public static EXAMINER_VALIDATED_OPEN_EXCEPTION_EVENT = 'examinervalidatedopenexceptionevent';
    public static MY_TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT = 'myteammanagementexaminervalidatedevent';
    public static QIG_SELECTED_FROM_MULTI_QIG_DROP_DOWN = 'qigselectedfrommultiqigdropdown';
    public static SHOW_MULTI_QIG_HELP_EXAMINER_NAVIGATION_MESSAGE = 'showmultiqighelpexaminernavigationmessage';

    public static MULTI_QIG_LOCK_DATA_RECEIVED = 'multiqiglockdatareceived';
    public static UPDATE_MULTI_QIG_LOCK_SELECTION_RECEIVED = 'updatemultiqiglockselectionreceived';
    public static MULTI_QIG_LOCK_RESULT_RECEIVED = 'multiqiglockresultreceived';

    public static RETURN_RESPONSE_TO_MARKER_BUTTON_CLCIKED = 'showreturnresponseconfirmationPopupevent';
    public static RETURNED_RESPONSE_TO_WORKLIST_EVENT = 'returnedresponsetoworklistevent';
    /**
     * @constructor
     */
    constructor() {
        super();
        this._expandOrCollapseDetails = Immutable.Map<number, boolean>();
        this._sortDetails = new Array<TeamManagementSortDetails>();
        this._visitedQigs = new Array<number>();

        this._dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.OPEN_TEAM_MANAGEMENT:
                    let _openTeamManagementAction = (action as openTeamManagementAction);
                    this._selectedExaminerRoleId = _openTeamManagementAction.examinerRoleId;
                    this._selectedMarkSchemeGroupId = _openTeamManagementAction.markSchemeGroupId;

                    // Check the Team Management got open forcefully, Then set variable for expanding list.
                    this._forceExpandMyTeamData = !_openTeamManagementAction.canEmit;
                    // emits the my team data loaded event.
                    if (_openTeamManagementAction.canEmit) {
                        this.emit(TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT, _openTeamManagementAction.isFromHistoryItem);
                        this.addToVisitedList(this._selectedMarkSchemeGroupId);
                    }
                    break;
                case actionType.MY_TEAM_DATA_FETCH:
                    this.success = (action as myTeamDataFetchAction).success;
                    if (this.success) {
                        this._selectedTeamManagementTab = enums.TeamManagement.MyTeam;
                        this._myTeamDataList = (action as myTeamDataFetchAction).myTeamData;
                        this._isMyTeamRefreshRequired = false;
                        if (this._forceExpandMyTeamData && this._selectedSubordinateExaminerRoleId !== 0 && !this.multiQigSelectedDetail) {
                            this._forceExpandMyTeamData = false;
                            this.expandNodeStatusForMyTeam(this._selectedSubordinateExaminerRoleId, this._myTeamDataList);
                        }
                        // emits the my team data loaded event.
                        this.emit(TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT, (action as myTeamDataFetchAction).isFromHistory);
                        if (!(action as myTeamDataFetchAction).isFromHistory) {
                            this.emit(TeamManagementStore.ADD_TO_HISTORY_EVENT);
                        }
                    }
                    break;
                case actionType.EXPAND_OR_COLLAPSE_NODE:
                    let examinerRoleId: number = (action as expandOrCollapseNodeAction).examinerRoleId;
                    let isExpanded: boolean = (action as expandOrCollapseNodeAction).isExpanded;
                    // update the dictionary
                    this.updateExpandOrCollapseNodeStatus(examinerRoleId, isExpanded);
                    this.emit(TeamManagementStore.EXPAND_OR_COLLAPSE_NODE_EVENT);
                    break;
                case actionType.TEAM_MANAGEMENT_LEFT_PANEL_TOGGLE:
                    this._isLeftPanelCollapsed = (action as leftPanelToggleAction).isLeftPanelCollapsed;
                    this.emit(TeamManagementStore.SET_PANEL_STATE);
                    break;
                case actionType.UPDATE_EXAMINER_DRILL_DOWN_DATA:
                    this._examinerDrillDownData = (action as updateExaminerDrillDownDataAction).examinerDrillDownData;
                    if (this._selectedTeamManagementTab && this._selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) {
                        this._isHelpExaminersDataChanged = true;
                    }
                    this.emit(TeamManagementStore.EXAMINER_DRILL_DOWN_DATA_UPDATED,
                        this.selectedMarkSchemeGroupId,
                        (action as updateExaminerDrillDownDataAction).isFromHistory);
                    if (!(action as updateExaminerDrillDownDataAction).isFromHistory) {
                        this.emit(TeamManagementStore.ADD_TO_HISTORY_EVENT);
                    }
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    this._selectedTeamManagementTab = undefined;
                    let markerOperationMode: markerOperationModeChangedAction = (action as markerOperationModeChangedAction);
                    if (markerOperationMode.operationMode === enums.MarkerOperationMode.Marking) {
                        this._selectedMarkSchemeGroupId = undefined;
                        this._selectedExaminerRoleId = undefined;
                    }
                    break;
                case actionType.TEAM_MANAGEMENT_TAB_CLICK_ACTION:
                    if (this._selectedTeamManagementTab !== (action as teammanagementTabSelectaAction).selectedTab) {
                        this._selectedTeamManagementTab = (action as teammanagementTabSelectaAction).selectedTab;
                        this.updateTeamManagementSortCollection(this.selectedMarkSchemeGroupId, this.selectedTeamManagementTab);
                        this._isFirstTimeTeamManagementAccessed = false;
                        this.emit(TeamManagementStore.TEAM_MANAGEMENT_SELECTED_TAB, this.selectedTeamManagementTab);
                        this.emit(TeamManagementStore.ADD_TO_HISTORY_EVENT);
                    }
                    break;
                case actionType.SET_CHANGE_STATUS_BUTTON_BUSY_ACTION:
                    this.emit(TeamManagementStore.SET_EXAMINER_CHANGE_STATUS_BUTTON_AS_BUSY);
                    break;
                case actionType.CHANGE_EXAMINER_STATUS:
                    let changeExaminerStatus = (action as changeExaminerStatusAction);
                    this._examinerStatusReturn = changeExaminerStatus.examinerStatusReturn;
                    if (this._examinerStatusReturn.success) {
                        this.emit(TeamManagementStore.CHANGE_EXAMINER_STATUS_UPDATED);
                    }
                    break;
                case actionType.PROVIDE_SECOND_STANDARDISATION:
                    let provideSecondStandardisation = (action as provideSecondStandardisationAction);
                    this._secondStandardisationReturn = provideSecondStandardisation.secondStandardisationReturn;
                    if (this._secondStandardisationReturn.success) {
                        this.emit(TeamManagementStore.PROVIDE_SECOND_STANDARDISATION_UPDATED);
                    }
                    break;
                case actionType.CHANGE_STATUS_POPUP_VISIBILITY_ACTION:
                    let changeStatusPopupVisibility = (action as changeStatusPopupVisibilityAction);
                    this.emit(TeamManagementStore.CHANGE_STATUS_POPUP_VISIBILITY_UPDATED,
                        changeStatusPopupVisibility.doVisiblePopup);
                    break;
                case actionType.GET_UNACTIONED_EXCEPTION_ACTION:
                    let _getUnActionedExceptionAction: getUnActionedExceptionAction = action as getUnActionedExceptionAction;
                    this._exceptionList = Immutable.List(_getUnActionedExceptionAction.exceptiondata);
                    this.emit(TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT, this._exceptionList);
                    this.emit(TeamManagementStore.ADD_TO_HISTORY_EVENT);
                    break;
                case actionType.HELP_EXAMINERS_DATA_FETCH_ACTION:
                    this.success = (action as helpExaminersDataFetchAction).success;
                    if (this.success) {
                        let helpExaminersAction = (action as helpExaminersDataFetchAction);
                        this._examinersForHelpExaminers = helpExaminersAction.helpExaminersData;
                        this._selectedTeamManagementTab = enums.TeamManagement.HelpExaminers;
                        this._isHelpExaminersDataChanged = false;
                        if (!helpExaminersAction.isFromHistory) {
                            this.emit(TeamManagementStore.ADD_TO_HISTORY_EVENT);
                            this.emit(TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED, false);
                        }
                    }
                    break;
                case actionType.CAN_EXECUTE_SEP_ACTION:
                    this.emit(TeamManagementStore.CAN_EXECUTE_APPROVAL_MANAGEMENT_ACTION,
                        (action as canExecuteApprovalManagementAction).doSEPApprovalManagementActionArgument);
                    break;
                case actionType.EXECUTE_SEP_ACTION:
                    let executeApprovalManagementAction = (action as executeApprovalManagementAction);
                    this._isHelpExaminersDataChanged = true;
                    if (!executeApprovalManagementAction.isMultiLock) {
                        if (executeApprovalManagementAction.SEPApprovalManagementActionResult &&
                            executeApprovalManagementAction.SEPApprovalManagementActionResult.count() > 0) {
                            let sepApprovalManagementActionResult: DoSEPApprovalManagementActionResult;
                            sepApprovalManagementActionResult = executeApprovalManagementAction.SEPApprovalManagementActionResult.first();
                            let actionIdentifier = executeApprovalManagementAction.SEPApprovalManagementActionReturn.actionIdentifier;
                            // Lock column exists in My team grid as well. Refresh flag.
                            this._isMyTeamRefreshRequired = true;
                            if (sepApprovalManagementActionResult.failureCode === enums.SEPActionFailureCode.None) {
                                if (actionIdentifier === enums.SEPAction.Re_approve ||
                                    actionIdentifier === enums.SEPAction.ProvideSecondStandardisation ||
                                    actionIdentifier === enums.SEPAction.Approve) {
                                    this._examinersForHelpExaminers = undefined;
                                }
                                this.emit(TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED,
                                    actionIdentifier,
                                    executeApprovalManagementAction.SEPApprovalManagementActionResult,
                                    executeApprovalManagementAction.isMultiLock);
                            }
                        }
                    } else {
                        this.emit(TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED,
                            executeApprovalManagementAction.SEPApprovalManagementActionReturn.actionIdentifier,
                            executeApprovalManagementAction.SEPApprovalManagementActionResult,
                            executeApprovalManagementAction.isMultiLock);
                    }
                    break;
                case actionType.GET_TEAM_OVERVIEW_DATA_FETCH_ACTION:
                    let teamOverviewAction = (action as getTeamOverviewDataAction);
                    this._teamOverviewCountData = teamOverviewAction.teamOverviewCountData;
                    if (teamOverviewAction.isFromRememberQig) {
                        this.emit(TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED_REMEMBER_QIG_EVENT);
                    } else {
                        this.emit(TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED, teamOverviewAction.isHelpExaminersDataRefreshRequired);
                    }
                    break;
                case actionType.SELECTED_EXCEPTION_ACTION:
                    let getSelectedExceptionAction = (action as selectedExceptionAction);
                    if (this._exceptionList) {
                        this._selectedException = this._exceptionList.
                            filter((x: UnActionedExceptionDetails) => x.exceptionId
                                === getSelectedExceptionAction.exceptionId).first();
                    }
                    this._isRedirectFromException = true;
                    this.emit(TeamManagementStore.SELECTED_EXCEPTION_ACTION_RECEIVED);
                    break;
                case actionType.SELECTED_EXCEPTION_RESET_ACTION:
                    let exceptionSelectionResetAction = (action as selectedExceptionResetAction);
                    this._isRedirectFromException = !exceptionSelectionResetAction.isResetSelection;
                    break;
                case actionType.TEAM_MANAGEMENT_HISTORY_INFO_ACTION:
                    let _setTeamManagementHistoryInfoAction = action as teamManagementHistoryInfoAction;
                    let _historyItem = _setTeamManagementHistoryInfoAction.historyItem;
                    let _markingMode = _setTeamManagementHistoryInfoAction.markingMode;
                    if (_markingMode === enums.MarkerOperationMode.TeamManagement && _historyItem.team) {
                        this._myTeamDataList = undefined;
                        //Reset Data in HelpExaminerTab Defect#52006
                        if (_historyItem.team.selectedTab === enums.TeamManagement.HelpExaminers) {
                            this._examinersForHelpExaminers = undefined;
                        }
                        this._exceptionList = undefined;
                        this._selectedTeamManagementTab =
                            (_historyItem.team.currentContainer === enums.PageContainers.WorkList &&
                                _historyItem.team.selectedTab !== enums.TeamManagement.HelpExaminers) ?
                                enums.TeamManagement.MyTeam :
                                _historyItem.team.selectedTab;
                        this._selectedExaminerRoleId = _historyItem.team.supervisorExaminerRoleID;
                        this._selectedMarkSchemeGroupId = _historyItem.qigId;
                        let doOpenTeamManagementScreen: boolean = false;
                        switch (_setTeamManagementHistoryInfoAction.failureCode) {
                            case enums.FailureCode.SubordinateExaminerWithdrawn:
                            case enums.FailureCode.HierarchyChanged:
                                doOpenTeamManagementScreen = true;
                                break;
                        }
                        if (doOpenTeamManagementScreen || _historyItem.team.currentContainer === enums.PageContainers.TeamManagement) {
                            this.emit(TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT);
                            this.addToVisitedList(this._selectedMarkSchemeGroupId);
                        } else {
                            let _examinerDrillDownData: ExaminerDrillDownData = {
                                examinerId: _historyItem.team.subordinateExaminerID,
                                examinerRoleId: _historyItem.team.subordinateExaminerRoleID
                            };
                            this._examinerDrillDownData = _examinerDrillDownData;
                            if (this._selectedTeamManagementTab && this._selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) {
                                this._isHelpExaminersDataChanged = true;
                            }
                        }
                    }
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    let responseDataGetAction = action as responseDataGetAction;
                    if (responseDataGetAction.searchedResponseData &&
                        responseDataGetAction.searchedResponseData.loggedInExaminerId !==
                        responseDataGetAction.searchedResponseData.examinerId) {

                        // Set the sub examiner details, which needs to access the worklist details.
                        this._examinerDrillDownData = {
                            examinerId: responseDataGetAction.searchedResponseData.examinerId,
                            examinerRoleId: responseDataGetAction.searchedResponseData.examinerRoleId
                        };

                        if (responseDataGetAction.searchedResponseData.navigateToHelpExaminer) {
                            this._selectedTeamManagementTab = enums.TeamManagement.HelpExaminers;
                        } else {
                            this._selectedTeamManagementTab = enums.TeamManagement.MyTeam;
                        }
                    }
                    break;
                case actionType.SAMPLING_STATUS_CHANGE_ACTION:
                    let _samplingStatusChangeAction = action as samplingStatusChangeAction;
                    this.emit(TeamManagementStore.SAMPLING_STATUS_CHANGED_EVENT,
                        _samplingStatusChangeAction.supervisorSamplingCommentReturn);
                    break;
                case actionType.SET_REMEMBER_QIG:
                    let _setRememberQigAction = action as setRememberQigAction;
                    this._selectedTeamManagementTab = undefined;
                    if (_setRememberQigAction.rememberQig.area === enums.QigArea.TeamManagement) {
                        this._selectedExaminerRoleId = _setRememberQigAction.rememberQig.examinerRoleId;
                        this._selectedMarkSchemeGroupId = _setRememberQigAction.rememberQig.qigId;
                    }
                    if (_setRememberQigAction.rememberQig.area === enums.QigArea.TeamManagement
                        && _setRememberQigAction.rememberQig.subordinateExaminerID > 0) {
                        this.addToVisitedList(this._selectedMarkSchemeGroupId);

                        this._selectedTeamManagementTab = (this.getSelectedQig
                            && this.getSelectedQig.examinerStuckCount > 0
                            && this.getSelectedQig.approvalStatusId === enums.ExaminerApproval.Approved) ?
                            enums.TeamManagement.HelpExaminers :
                            _setRememberQigAction.rememberQig.tab;

                        this._examinerDrillDownData = {
                            examinerId: _setRememberQigAction.rememberQig.subordinateExaminerID,
                            examinerRoleId: _setRememberQigAction.rememberQig.subordinateExaminerRoleID
                        };
                    }
                    break;
                case actionType.QIGSELECTOR:
                    let _qigSelectorDataFetchAction: qigSelectorDataFetchAction = action as qigSelectorDataFetchAction;
                    if (!_qigSelectorDataFetchAction.success
                        && _qigSelectorDataFetchAction.getOverviewData.failureCode) {
                        switch (_qigSelectorDataFetchAction.getOverviewData.failureCode) {
                            case enums.FailureCode.HierarchyChanged:
                            case enums.FailureCode.SubordinateExaminerWithdrawn:
                                this._examinerDrillDownData = undefined;
                                break;
                        }
                    }

                    if (!_qigSelectorDataFetchAction.isFromMultiQigDropDown) {
                        this._multiQigSelectedDetail = undefined;
                    }
                    break;
                case actionType.VALIDATE_TEAM_MANAGEMENT_EXAMINER_ACTION:
                    let _validateTeamManagementExaminerAction:
                        validateTeamManagementExaminerAction = action as validateTeamManagementExaminerAction;
                    let _examinerDrillDownData = {
                        examinerId: _validateTeamManagementExaminerAction.examinerId,
                        examinerRoleId: _validateTeamManagementExaminerAction.examinerRoleId
                    };
                    if (this.doShowErrorNavigation(_validateTeamManagementExaminerAction.failureCode)) {
                        if (_validateTeamManagementExaminerAction.isFromRememberQig) {
                            this.emit(TeamManagementStore.
                                FAILURE_WHILE_FETCHING_TEAM_DATA_ON_REMEMBER_QIG_EVENT,
                                _validateTeamManagementExaminerAction.failureCode,
                                _validateTeamManagementExaminerAction.markSchemeGroupId);
                        } else {
                            this.emit(TeamManagementStore.TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT,
                                _validateTeamManagementExaminerAction.failureCode);
                        }
                    } else {
                        if (_validateTeamManagementExaminerAction.isFromRememberQig) {
                            this.emit(TeamManagementStore.EXAMINER_VALIDATED_EVENT);
                        } else if (_validateTeamManagementExaminerAction.examinerValidationArea
                            === enums.ExaminerValidationArea.MarkCheckWorklist) {
                            this.emit(TeamManagementStore.EXAMINER_VALIDATED_OPEN_RESPONSE_EVENT,
                                _validateTeamManagementExaminerAction.displayId,
                                _validateTeamManagementExaminerAction.markingMode);
                        } else if (_validateTeamManagementExaminerAction.isTeamManagementTabSelect) {
                            this.emit(TeamManagementStore.MY_TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT,
                                enums.FailureCode.None, _examinerDrillDownData,
                                _validateTeamManagementExaminerAction.examinerValidationArea);
                        } else if (_validateTeamManagementExaminerAction.examinerValidationArea
                            === enums.ExaminerValidationArea.ExceptionAction) {
                            this.emit(TeamManagementStore.EXAMINER_VALIDATED_OPEN_EXCEPTION_EVENT,
                                _validateTeamManagementExaminerAction.exceptionId);
                        } else {
                            this.emit(TeamManagementStore.TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT,
                                enums.FailureCode.None);
                        }
                    }
                    break;
                case actionType.WARNING_MESSAGE_NAVIGATION_ACTION:
                    let navigationAction = (action as warningMessageNavigationAction);
                    if (navigationAction.failureCode !== enums.FailureCode.None &&
                        (navigationAction.warningMessageAction === enums.WarningMessageAction.PromoteToSeed ||
                            (navigationAction.warningMessageAction === enums.WarningMessageAction.SuperVisorRemarkCheck ||
                                navigationAction.warningMessageAction === enums.WarningMessageAction.MyTeamAction
                                && (navigationAction.failureCode === enums.FailureCode.HierarchyChanged
                                    || navigationAction.failureCode === enums.FailureCode.SubordinateExaminerWithdrawn)))) {
                        this._isMyTeamRefreshRequired = true;
                    }
                    if (navigationAction.failureCode !== enums.FailureCode.None &&
                        navigationAction.warningMessageAction === enums.WarningMessageAction.SEPAction) {
                        this._isHelpExaminersDataChanged = true;
                    }
                    break;
                case actionType.TEAM_SORT_ACTION:
                    let sortAction: teamSortAction = (action as teamSortAction);
                    let sortItem: TeamManagementSortDetails = sortAction.sortDetails;
                    this.updateTeamManagementSortCollection(sortItem.qig, sortItem.tab, sortItem.comparerName, sortItem.sortDirection);
                    break;
                case actionType.CONTAINER_CHANGE_ACTION:
                    let _loadContainerAction = (action as loadContainerAction);
                    // if the examiner navigated back from drill down worklist to Team management
                    if (_loadContainerAction.containerPage === enums.PageContainers.TeamManagement) {
                        if (this._examinerDrillDownData) {
                            // clear the drill down data which needs to be present only on subordinate screens
                            this._selectedSubordinateExaminerRoleId = this._examinerDrillDownData.examinerRoleId;
                            this._examinerDrillDownData = undefined;
                        }
                    }
                    break;
                case actionType.MULTI_QIG_LOCK_DATA_FETCH_ACTION:
                    let multiQigLockGetAction = (action as multiQigLockDataFetchAction);
                    let selectedQigName: string;
                    this._multiLockDataList = multiQigLockGetAction.MultiQigLockData;
                    if (this._multiLockDataList) {
                        this._multiLockDataList.map((item: MultiQigLockExaminer) => {
                            item.isChecked = false;
                            item.qigName = this.getQigName(item.markSchemeGroupId);
                        });
                    }
                    selectedQigName = this.getQigName(multiQigLockGetAction.selectedQigId);
                    this._multiLockSelectedExaminerQigId = multiQigLockGetAction.selectedQigId;
                    let _multiLockSelectedExaminer: ExaminerDrillDownData = {
                        examinerId: multiQigLockGetAction.selectedExaminerId,
                        examinerRoleId: multiQigLockGetAction.selectedExaminerRoleId
                    };
                    this._multiLockExaminerDrillDownData = _multiLockSelectedExaminer;
                    this.emit(TeamManagementStore.MULTI_QIG_LOCK_DATA_RECEIVED,
                        multiQigLockGetAction.selectedExaminerId, multiQigLockGetAction.selectedQigId,
                        multiQigLockGetAction.selectedExaminerRoleId, selectedQigName);
                    break;
                case actionType.UPDATE_MULTI_QIG_LOCK_SELECTION:
                    let updateMultiQigLockSelection = (action as updateMultiQigLockSelectionAction);
                    if (updateMultiQigLockSelection.isSelectedAll) {
                        // If select all option clicked then all Qigs in the list are set to true or checked.
                        if (this._multiLockDataList) {
                            this._multiLockDataList.map((item: MultiQigLockExaminer) => {
                                item.isChecked = true;
                            });
                        }
                    } else {
                        if (this._multiLockDataList) {
                            this._multiLockDataList.map((item: MultiQigLockExaminer) => {
                                if (item.markSchemeGroupId === updateMultiQigLockSelection.markSchemeGroupId) {
                                    item.isChecked = !item.isChecked;
                                } else if (updateMultiQigLockSelection.markSchemeGroupId === 0) {
                                    // If select all option deselected then all Qigs in the list are set to false or unchecked.
                                    item.isChecked = false;
                                }
                            });
                        }
                    }
                    this.emit(TeamManagementStore.UPDATE_MULTI_QIG_LOCK_SELECTION_RECEIVED);
                    break;
                case actionType.MULTI_LOCK_DATA_RESET:
                    // Reset the multi Qig lock list.
                    this._multiLockDataList = undefined;
                    this._multiLockExaminerDrillDownData = undefined;
                    this._multiLockResults = undefined;
                    this._multiLockSelectedExaminerQigId = 0;
                    break;
                case actionType.QIG_SELECTED_FROM_MULI_QIG_DROP_DOWN:
                    let _qigSelectedFromMultiQigDropDownAction = (action as qigSelectedFromMultiQigDropDownAction);
                    this._multiQigSelectedDetail = _qigSelectedFromMultiQigDropDownAction.selectedQigDetail;
                    this._myTeamDataList = undefined;
                    this.emit(TeamManagementStore.QIG_SELECTED_FROM_MULTI_QIG_DROP_DOWN);
                    break;
                case actionType.MULTI_QIG_LOCK_RESULT:
                    let multiQigLockResultAction = (action) as multiQigLockResultAction;
                    this._multiLockResults = multiQigLockResultAction.multiQigLockResult;
                    if (this._multiLockResults) {
                        this._multiLockResults.map((item: MultiLockResult) => {
                            item.qigName = this.getQigName(item.markSchemeGroupId);
                        });
                    }
                    this.emit(TeamManagementStore.MULTI_QIG_LOCK_RESULT_RECEIVED);
                    break;
                case actionType.RETURN_RESPONSE_TO_MARKER_BUTTON_CLICKED_ACTION:
                    this.emit(TeamManagementStore.RETURN_RESPONSE_TO_MARKER_BUTTON_CLCIKED);
                    break;
                case actionType.RETURNED_RESPONSE_TO_WORKLIST_ACTION:
                    this.emit(TeamManagementStore.RETURNED_RESPONSE_TO_WORKLIST_EVENT,
                        (action as responseReturnedToWorklistAction).returnResponseResult);
                    break;
            }
        });
    }

    /**
     * Returns doShowErrorNavigation
     */
    private doShowErrorNavigation(_failureCode: enums.FailureCode): boolean {
        switch (_failureCode) {
            case enums.FailureCode.SubordinateExaminerWithdrawn:
            case enums.FailureCode.HierarchyChanged:
            case enums.FailureCode.NotPEOrAPE:
            case enums.FailureCode.NotTeamLead:
            case enums.FailureCode.Withdrawn:
                return true;
            default: return false;
        }
    }

    /**
     * Returns my team data
     */
    public get myTeamData(): Immutable.List<ExaminerData> {
        return Immutable.List<ExaminerData>(this._myTeamDataList);
    }

    /**
     * Expand or collapse examiner node
     * @param examinerRoleId
     * @param isExpanded
     */
    private updateExpandOrCollapseNodeStatus = (examinerRoleId: number, isExpanded: boolean) => {
        // Dictionary already contains the key then update the value otherwise add a new entry.
        this._expandOrCollapseDetails = this._expandOrCollapseDetails.set(examinerRoleId, isExpanded);
    };

    /**
     * Expand or collapse examiner node for the required members
     * @param examinerRoleId
     * @param teamList
     */
    private expandNodeStatusForMyTeam = (examinerRoleId: number, teamList) => {
        let selectedTeam = teamList.filter(x => x.examinerRoleId === examinerRoleId)[0];

        if (!selectedTeam) {
            let parentExaminerRoleId = this.getExaminerParentRoleId(teamList, examinerRoleId);
            if (parentExaminerRoleId) {
                this.updateExpandOrCollapseNodeStatus(parentExaminerRoleId, true);
                this.expandNodeStatusForMyTeam(parentExaminerRoleId, teamList);
            }
        }
    };

    /**
     * Get Parent Examiner Role Id for the examiner role id
     * @param teamList
     * @param examinerRoleId
     */
    private getExaminerParentRoleId(teamList: Array<ExaminerData>, examinerRoleId: number) {
        for (let index = 0; index < teamList.length; index++) {
            let examier: ExaminerData = teamList[index];
            if (examier.examinerRoleId === examinerRoleId) {
                return examier.parentExaminerRoleId;
            } else if (examier.subordinates.length > 0) {
                let parentExaminerRoleId = this.getExaminerParentRoleId(examier.subordinates, examinerRoleId);
                if (parentExaminerRoleId) {
                    return parentExaminerRoleId;
                }
            }
        }
    }

    /**
     * Return the expand or collapse details collection
     */
    public get expandOrCollapseDetails(): Immutable.Map<number, boolean> {
        return this._expandOrCollapseDetails;
    }

    /**
     * Returns the logged in user examinerRoleId
     */
    public get selectedExaminerRoleId(): number {
        return this._selectedExaminerRoleId;
    }

    /**
     *  Returns the selected MarkSchemeGroupId
     */
    public get selectedMarkSchemeGroupId(): number {
        return this._selectedMarkSchemeGroupId;
    }

    /**
     * Returns a value indicating whether the Team Management left panel is collapsed or not
     */
    public get isLeftPanelCollapsed(): boolean {
        return this._isLeftPanelCollapsed;
    }

    /**
     * Returns the current examiner drill down data.
     */
    public get examinerDrillDownData(): ExaminerDrillDownData {
        return this._examinerDrillDownData;
    }

    /**
     * Returns the current selected Team management Left Link.
     */
    public get selectedTeamManagementTab(): enums.TeamManagement {
        return this._selectedTeamManagementTab;
    }

    /**
     * Returns the examiner status details.
     */
    public get examinerStatusDetails(): setExaminerStatusReturn {
        return this._examinerStatusReturn;
    }

    /**
     * Returns the second standardisation return.
     */
    public get secondStandardisationReturn(): setSecondStandardisationReturn {
        return this._secondStandardisationReturn;
    }

    /**
     * Returns the list of UnActionedExceptionDetails
     */
    public get exceptionList(): Immutable.List<UnActionedExceptionDetails> {
        return this._exceptionList;
    }

    /**
     * Returns the Examiners list in the Help Examiner
     */
    public get examinersForHelpExaminers(): Immutable.List<ExaminerDataForHelpExaminer> {
        return this._examinersForHelpExaminers;
    }

    /**
     * Get the status of Help Examiners Data changed or not
     */
    public get isHelpExaminersDataChanged(): boolean {
        return this._isHelpExaminersDataChanged;
    }

    /**
     * Get the status of My Team Data changed or not
     */
    public get isMyTeamRefreshRequired(): boolean {
        return this._isMyTeamRefreshRequired;
    }

    /**
     * Returns the Examiners team overview Data
     */
    public get teamOverviewCountData(): teamOverViewDetails {
        return this._teamOverviewCountData;
    }

    /**
     * Get the selected qig
     */
    public get getSelectedQig(): qigDetails {
        if (!this._teamOverviewCountData) {
            return null;
        }
        let qigDetails: any = this._teamOverviewCountData.qigDetails;
        if (qigDetails && qigDetails.length > 1) {
            return qigDetails.filter((x: qigDetails) =>
                x.qigId === this._selectedMarkSchemeGroupId)[0];
        } else if (qigDetails) {
            return qigDetails[0];
        } else {
            return null;
        }
    }

    /**
     * Returns the Examiners team overview Data
     */
    public get selectedException(): UnActionedExceptionDetails {
        return this._selectedException;
    }

    /**
     * Get the reponse redirect from the exception
     */
    public get isRedirectFromException(): boolean {
        return this._isRedirectFromException;
    }

    /**
     * This method will return the sort details
     */
    public get sortDetails(): Array<TeamManagementSortDetails> {
        return this._sortDetails;
    }

    /**
     * set default sort details
     * @param qigId
     * @param teamManagementTab
     */
    private updateTeamManagementSortCollection(qigId: number, teamManagementTab: enums.TeamManagement,
        comparerName?: comparerList, sortDirection?: enums.SortDirection) {
        let entry = this.sortDetails.filter((x: TeamManagementSortDetails) => x.tab === teamManagementTab && x.qig === qigId);
        // if item is not present in sort collection then update the collection with default details
        if (entry.length === 0) {
            if (comparerName === undefined && sortDirection === undefined) {
                let defaultSortValues: DefaultSort = this.getDefaultSortDetails(teamManagementTab);
                comparerName = defaultSortValues.compareName;
                sortDirection = defaultSortValues.sortDirection;
            }
            let sortDetails: TeamManagementSortDetails = {
                qig: qigId,
                tab: teamManagementTab,
                comparerName: comparerName,
                sortDirection: sortDirection,
            };

            this._sortDetails.push(sortDetails);
        } else if (comparerName !== undefined && sortDirection !== undefined) {
            this.sortDetails.filter((x: TeamManagementSortDetails) => x.tab === teamManagementTab &&
                x.qig === qigId)[0].comparerName = comparerName;
            this.sortDetails.filter((x: TeamManagementSortDetails) => x.tab === teamManagementTab &&
                x.qig === qigId)[0].sortDirection = sortDirection;
        }
    }

    /**
     * Get the comparer for the current team mangement tab
     * @param teamManagementTab
     */
    public getDefaultSortDetails(teamManagementTab: enums.TeamManagement): DefaultSort {
        let comparerName: comparerList;
        let sortDirection: enums.SortDirection;
        switch (teamManagementTab) {
            case enums.TeamManagement.HelpExaminers:
                comparerName = comparerList.helpExaminerComparer;
                sortDirection = enums.SortDirection.Ascending;
                break;
            default:  // enums.TeamManagement.MyTeam:
                comparerName = comparerList.examinerDataComparer;
                sortDirection = enums.SortDirection.Ascending;
                break;
        }

        return { compareName: comparerName, sortDirection: sortDirection };
    }

    /**
     * Add to visited qig list
     * @param qigid
     */
    private addToVisitedList(qigid: number): void {
        if (this._visitedQigs.filter((x: number) => x === qigid).length > 0) {
            this._isFirstTimeTeamManagementAccessed = false;
        } else {
            this._isFirstTimeTeamManagementAccessed = true;
            this._visitedQigs.push(qigid);
        }
    }

    /**
     * Get Qig name from team overview count data.
     */
    private getQigName(markSchemeGroupId): string {
        let qigName: string = '';
        if (this._teamOverviewCountData && this._teamOverviewCountData.qigDetails) {
            this._teamOverviewCountData.qigDetails.map(function (qigDetail: qigDetails) {
                if (qigDetail.qigId === markSchemeGroupId) {
                    qigName = qigDetail.qigName;
                }
            });
        }

        return qigName;
    }

    /**
     * This method will return true if team management of particular qig not yet accessed
     */
    public get isFirstTimeTeamManagementAccessed(): boolean {
        return this._isFirstTimeTeamManagementAccessed;
    }

    public get multiQigSelectedDetail(): qigDetails {
        return this._multiQigSelectedDetail;
    }

    /**
     * Returns the Examiners list in the Help Examiner
     */
    public get multiLockDataList(): Immutable.List<MultiQigLockExaminer> {
        return this._multiLockDataList;
    }

    /**
     * Returns the multi qig selected examiner drill down data.
     */
    public get multiLockExaminerDrillDownData(): ExaminerDrillDownData {
        return this._multiLockExaminerDrillDownData;
    }

    /**
     * Returns the multi lock result list
     */
    public get multiLockResults(): Immutable.List<MultiLockResult> {
        return this._multiLockResults;
    }

    /**
     * Returns the multi lock selected examiner qig id
     */
    public get multiLockSelectedExaminerQigId(): number {
        return this._multiLockSelectedExaminerQigId;
    }
}

let instance = new TeamManagementStore();
export = { TeamManagementStore, instance };
