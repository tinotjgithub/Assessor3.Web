"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var actionType = require('../../actions/base/actiontypes');
var Immutable = require('immutable');
var enums = require('../../components/utility/enums');
var comparerList = require('./../../utility/sorting/sortbase/comparerlist');
/**
 * Team management store
 */
var TeamManagementStore = (function (_super) {
    __extends(TeamManagementStore, _super);
    /**
     * @constructor
     */
    function TeamManagementStore() {
        var _this = this;
        _super.call(this);
        this._isMyTeamRefreshRequired = false;
        this._isHelpExaminersDataChanged = false;
        this._isRedirectFromException = false;
        this._forceExpandMyTeamData = false;
        this.success = false;
        this._isFirstTimeTeamManagementAccessed = false;
        this._selectedSubordinateExaminerRoleId = 0;
        this._multiQigSelectedDetail = undefined;
        this._multiLockSelectedExaminerQigId = 0;
        /**
         * Expand or collapse examiner node
         * @param examinerRoleId
         * @param isExpanded
         */
        this.updateExpandOrCollapseNodeStatus = function (examinerRoleId, isExpanded) {
            // Dictionary already contains the key then update the value otherwise add a new entry.
            _this._expandOrCollapseDetails = _this._expandOrCollapseDetails.set(examinerRoleId, isExpanded);
        };
        /**
         * Expand or collapse examiner node for the required members
         * @param examinerRoleId
         * @param teamList
         */
        this.expandNodeStatusForMyTeam = function (examinerRoleId, teamList) {
            var selectedTeam = teamList.filter(function (x) { return x.examinerRoleId === examinerRoleId; })[0];
            if (!selectedTeam) {
                var parentExaminerRoleId = _this.getExaminerParentRoleId(teamList, examinerRoleId);
                if (parentExaminerRoleId) {
                    _this.updateExpandOrCollapseNodeStatus(parentExaminerRoleId, true);
                    _this.expandNodeStatusForMyTeam(parentExaminerRoleId, teamList);
                }
            }
        };
        this._expandOrCollapseDetails = Immutable.Map();
        this._sortDetails = new Array();
        this._visitedQigs = new Array();
        this._dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.OPEN_TEAM_MANAGEMENT:
                    var _openTeamManagementAction = action;
                    _this._selectedExaminerRoleId = _openTeamManagementAction.examinerRoleId;
                    _this._selectedMarkSchemeGroupId = _openTeamManagementAction.markSchemeGroupId;
                    // Check the Team Management got open forcefully, Then set variable for expanding list.
                    _this._forceExpandMyTeamData = !_openTeamManagementAction.canEmit;
                    // emits the my team data loaded event.
                    if (_openTeamManagementAction.canEmit) {
                        _this.emit(TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT, _openTeamManagementAction.isFromHistoryItem);
                        _this.addToVisitedList(_this._selectedMarkSchemeGroupId);
                    }
                    break;
                case actionType.MY_TEAM_DATA_FETCH:
                    _this.success = action.success;
                    if (_this.success) {
                        _this._selectedTeamManagementTab = enums.TeamManagement.MyTeam;
                        _this._myTeamDataList = action.myTeamData;
                        _this._isMyTeamRefreshRequired = false;
                        if (_this._forceExpandMyTeamData && _this._selectedSubordinateExaminerRoleId !== 0 && !_this.multiQigSelectedDetail) {
                            _this._forceExpandMyTeamData = false;
                            _this.expandNodeStatusForMyTeam(_this._selectedSubordinateExaminerRoleId, _this._myTeamDataList);
                        }
                        // emits the my team data loaded event.
                        _this.emit(TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT, action.isFromHistory);
                        if (!action.isFromHistory) {
                            _this.emit(TeamManagementStore.ADD_TO_HISTORY_EVENT);
                        }
                    }
                    break;
                case actionType.EXPAND_OR_COLLAPSE_NODE:
                    var examinerRoleId = action.examinerRoleId;
                    var isExpanded = action.isExpanded;
                    // update the dictionary
                    _this.updateExpandOrCollapseNodeStatus(examinerRoleId, isExpanded);
                    _this.emit(TeamManagementStore.EXPAND_OR_COLLAPSE_NODE_EVENT);
                    break;
                case actionType.TEAM_MANAGEMENT_LEFT_PANEL_TOGGLE:
                    _this._isLeftPanelCollapsed = action.isLeftPanelCollapsed;
                    _this.emit(TeamManagementStore.SET_PANEL_STATE);
                    break;
                case actionType.UPDATE_EXAMINER_DRILL_DOWN_DATA:
                    _this._examinerDrillDownData = action.examinerDrillDownData;
                    if (_this._selectedTeamManagementTab && _this._selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) {
                        _this._isHelpExaminersDataChanged = true;
                    }
                    _this.emit(TeamManagementStore.EXAMINER_DRILL_DOWN_DATA_UPDATED, _this.selectedMarkSchemeGroupId, action.isFromHistory);
                    if (!action.isFromHistory) {
                        _this.emit(TeamManagementStore.ADD_TO_HISTORY_EVENT);
                    }
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    _this._selectedTeamManagementTab = undefined;
                    var markerOperationMode = action;
                    if (markerOperationMode.operationMode === enums.MarkerOperationMode.Marking) {
                        _this._selectedMarkSchemeGroupId = undefined;
                        _this._selectedExaminerRoleId = undefined;
                    }
                    break;
                case actionType.TEAM_MANAGEMENT_TAB_CLICK_ACTION:
                    if (_this._selectedTeamManagementTab !== action.selectedTab) {
                        _this._selectedTeamManagementTab = action.selectedTab;
                        _this.updateTeamManagementSortCollection(_this.selectedMarkSchemeGroupId, _this.selectedTeamManagementTab);
                        _this._isFirstTimeTeamManagementAccessed = false;
                        _this.emit(TeamManagementStore.TEAM_MANAGEMENT_SELECTED_TAB, _this.selectedTeamManagementTab);
                        _this.emit(TeamManagementStore.ADD_TO_HISTORY_EVENT);
                    }
                    break;
                case actionType.SET_CHANGE_STATUS_BUTTON_BUSY_ACTION:
                    _this.emit(TeamManagementStore.SET_EXAMINER_CHANGE_STATUS_BUTTON_AS_BUSY);
                    break;
                case actionType.CHANGE_EXAMINER_STATUS:
                    var changeExaminerStatus = action;
                    _this._examinerStatusReturn = changeExaminerStatus.examinerStatusReturn;
                    if (_this._examinerStatusReturn.success) {
                        _this.emit(TeamManagementStore.CHANGE_EXAMINER_STATUS_UPDATED);
                    }
                    break;
                case actionType.PROVIDE_SECOND_STANDARDISATION:
                    var provideSecondStandardisation = action;
                    _this._secondStandardisationReturn = provideSecondStandardisation.secondStandardisationReturn;
                    if (_this._secondStandardisationReturn.success) {
                        _this.emit(TeamManagementStore.PROVIDE_SECOND_STANDARDISATION_UPDATED);
                    }
                    break;
                case actionType.CHANGE_STATUS_POPUP_VISIBILITY_ACTION:
                    var changeStatusPopupVisibility = action;
                    _this.emit(TeamManagementStore.CHANGE_STATUS_POPUP_VISIBILITY_UPDATED, changeStatusPopupVisibility.doVisiblePopup);
                    break;
                case actionType.GET_UNACTIONED_EXCEPTION_ACTION:
                    var _getUnActionedExceptionAction = action;
                    _this._exceptionList = Immutable.List(_getUnActionedExceptionAction.exceptiondata);
                    _this.emit(TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT, _this._exceptionList);
                    _this.emit(TeamManagementStore.ADD_TO_HISTORY_EVENT);
                    break;
                case actionType.HELP_EXAMINERS_DATA_FETCH_ACTION:
                    _this.success = action.success;
                    if (_this.success) {
                        var helpExaminersAction = action;
                        _this._examinersForHelpExaminers = helpExaminersAction.helpExaminersData;
                        _this._selectedTeamManagementTab = enums.TeamManagement.HelpExaminers;
                        _this._isHelpExaminersDataChanged = false;
                        if (!helpExaminersAction.isFromHistory) {
                            _this.emit(TeamManagementStore.ADD_TO_HISTORY_EVENT);
                            _this.emit(TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED, false);
                        }
                    }
                    break;
                case actionType.CAN_EXECUTE_SEP_ACTION:
                    _this.emit(TeamManagementStore.CAN_EXECUTE_APPROVAL_MANAGEMENT_ACTION, action.doSEPApprovalManagementActionArgument);
                    break;
                case actionType.EXECUTE_SEP_ACTION:
                    var executeApprovalManagementAction_1 = action;
                    _this._isHelpExaminersDataChanged = true;
                    if (!executeApprovalManagementAction_1.isMultiLock) {
                        if (executeApprovalManagementAction_1.SEPApprovalManagementActionResult &&
                            executeApprovalManagementAction_1.SEPApprovalManagementActionResult.count() > 0) {
                            var sepApprovalManagementActionResult = void 0;
                            sepApprovalManagementActionResult = executeApprovalManagementAction_1.SEPApprovalManagementActionResult.first();
                            var actionIdentifier = executeApprovalManagementAction_1.SEPApprovalManagementActionReturn.actionIdentifier;
                            // Lock column exists in My team grid as well. Refresh flag.
                            _this._isMyTeamRefreshRequired = true;
                            if (sepApprovalManagementActionResult.failureCode === enums.SEPActionFailureCode.None) {
                                if (actionIdentifier === enums.SEPAction.Re_approve ||
                                    actionIdentifier === enums.SEPAction.ProvideSecondStandardisation ||
                                    actionIdentifier === enums.SEPAction.Approve) {
                                    _this._examinersForHelpExaminers = undefined;
                                }
                                _this.emit(TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, actionIdentifier, executeApprovalManagementAction_1.SEPApprovalManagementActionResult, executeApprovalManagementAction_1.isMultiLock);
                            }
                        }
                    }
                    else {
                        _this.emit(TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, executeApprovalManagementAction_1.SEPApprovalManagementActionReturn.actionIdentifier, executeApprovalManagementAction_1.SEPApprovalManagementActionResult, executeApprovalManagementAction_1.isMultiLock);
                    }
                    break;
                case actionType.GET_TEAM_OVERVIEW_DATA_FETCH_ACTION:
                    var teamOverviewAction = action;
                    _this._teamOverviewCountData = teamOverviewAction.teamOverviewCountData;
                    if (teamOverviewAction.isFromRememberQig) {
                        _this.emit(TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED_REMEMBER_QIG_EVENT);
                    }
                    else {
                        _this.emit(TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED, teamOverviewAction.isHelpExaminersDataRefreshRequired);
                    }
                    break;
                case actionType.SELECTED_EXCEPTION_ACTION:
                    var getSelectedExceptionAction_1 = action;
                    if (_this._exceptionList) {
                        _this._selectedException = _this._exceptionList.
                            filter(function (x) { return x.exceptionId
                            === getSelectedExceptionAction_1.exceptionId; }).first();
                    }
                    _this._isRedirectFromException = true;
                    _this.emit(TeamManagementStore.SELECTED_EXCEPTION_ACTION_RECEIVED);
                    break;
                case actionType.SELECTED_EXCEPTION_RESET_ACTION:
                    var exceptionSelectionResetAction = action;
                    _this._isRedirectFromException = !exceptionSelectionResetAction.isResetSelection;
                    break;
                case actionType.TEAM_MANAGEMENT_HISTORY_INFO_ACTION:
                    var _setTeamManagementHistoryInfoAction = action;
                    var _historyItem = _setTeamManagementHistoryInfoAction.historyItem;
                    var _markingMode = _setTeamManagementHistoryInfoAction.markingMode;
                    if (_markingMode === enums.MarkerOperationMode.TeamManagement && _historyItem.team) {
                        _this._myTeamDataList = undefined;
                        //Reset Data in HelpExaminerTab Defect#52006
                        if (_historyItem.team.selectedTab === enums.TeamManagement.HelpExaminers) {
                            _this._examinersForHelpExaminers = undefined;
                        }
                        _this._exceptionList = undefined;
                        _this._selectedTeamManagementTab =
                            (_historyItem.team.currentContainer === enums.PageContainers.WorkList &&
                                _historyItem.team.selectedTab !== enums.TeamManagement.HelpExaminers) ?
                                enums.TeamManagement.MyTeam :
                                _historyItem.team.selectedTab;
                        _this._selectedExaminerRoleId = _historyItem.team.supervisorExaminerRoleID;
                        _this._selectedMarkSchemeGroupId = _historyItem.qigId;
                        var doOpenTeamManagementScreen = false;
                        switch (_setTeamManagementHistoryInfoAction.failureCode) {
                            case enums.FailureCode.SubordinateExaminerWithdrawn:
                            case enums.FailureCode.HierarchyChanged:
                                doOpenTeamManagementScreen = true;
                                break;
                        }
                        if (doOpenTeamManagementScreen || _historyItem.team.currentContainer === enums.PageContainers.TeamManagement) {
                            _this.emit(TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT);
                            _this.addToVisitedList(_this._selectedMarkSchemeGroupId);
                        }
                        else {
                            var _examinerDrillDownData_1 = {
                                examinerId: _historyItem.team.subordinateExaminerID,
                                examinerRoleId: _historyItem.team.subordinateExaminerRoleID
                            };
                            _this._examinerDrillDownData = _examinerDrillDownData_1;
                            if (_this._selectedTeamManagementTab && _this._selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) {
                                _this._isHelpExaminersDataChanged = true;
                            }
                        }
                    }
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    var responseDataGetAction_1 = action;
                    if (responseDataGetAction_1.searchedResponseData.loggedInExaminerId !==
                        responseDataGetAction_1.searchedResponseData.examinerId) {
                        // Set the sub examiner details, which needs to access the worklist details.
                        _this._examinerDrillDownData = {
                            examinerId: responseDataGetAction_1.searchedResponseData.examinerId,
                            examinerRoleId: responseDataGetAction_1.searchedResponseData.examinerRoleId
                        };
                        if (responseDataGetAction_1.searchedResponseData.navigateToHelpExaminer) {
                            _this._selectedTeamManagementTab = enums.TeamManagement.HelpExaminers;
                        }
                        else {
                            _this._selectedTeamManagementTab = enums.TeamManagement.MyTeam;
                        }
                    }
                    break;
                case actionType.SAMPLING_STATUS_CHANGE_ACTION:
                    var _samplingStatusChangeAction = action;
                    _this.emit(TeamManagementStore.SAMPLING_STATUS_CHANGED_EVENT, _samplingStatusChangeAction.supervisorSamplingCommentReturn);
                    break;
                case actionType.SET_REMEMBER_QIG:
                    var _setRememberQigAction = action;
                    _this._selectedTeamManagementTab = undefined;
                    if (_setRememberQigAction.rememberQig.area === enums.QigArea.TeamManagement) {
                        _this._selectedExaminerRoleId = _setRememberQigAction.rememberQig.examinerRoleId;
                        _this._selectedMarkSchemeGroupId = _setRememberQigAction.rememberQig.qigId;
                    }
                    if (_setRememberQigAction.rememberQig.area === enums.QigArea.TeamManagement
                        && _setRememberQigAction.rememberQig.subordinateExaminerID > 0) {
                        _this.addToVisitedList(_this._selectedMarkSchemeGroupId);
                        _this._selectedTeamManagementTab = (_this.getSelectedQig
                            && _this.getSelectedQig.examinerStuckCount > 0
                            && _this.getSelectedQig.approvalStatusId === enums.ExaminerApproval.Approved) ?
                            enums.TeamManagement.HelpExaminers :
                            _setRememberQigAction.rememberQig.tab;
                        _this._examinerDrillDownData = {
                            examinerId: _setRememberQigAction.rememberQig.subordinateExaminerID,
                            examinerRoleId: _setRememberQigAction.rememberQig.subordinateExaminerRoleID
                        };
                    }
                    break;
                case actionType.QIGSELECTOR:
                    var _qigSelectorDataFetchAction = action;
                    if (!_qigSelectorDataFetchAction.success
                        && _qigSelectorDataFetchAction.getOverviewData.failureCode) {
                        switch (_qigSelectorDataFetchAction.getOverviewData.failureCode) {
                            case enums.FailureCode.HierarchyChanged:
                            case enums.FailureCode.SubordinateExaminerWithdrawn:
                                _this._examinerDrillDownData = undefined;
                                break;
                        }
                    }
                    if (!_qigSelectorDataFetchAction.isFromMultiQigDropDown) {
                        _this._multiQigSelectedDetail = undefined;
                    }
                    break;
                case actionType.VALIDATE_TEAM_MANAGEMENT_EXAMINER_ACTION:
                    var _validateTeamManagementExaminerAction = action;
                    var _examinerDrillDownData = {
                        examinerId: _validateTeamManagementExaminerAction.examinerId,
                        examinerRoleId: _validateTeamManagementExaminerAction.examinerRoleId
                    };
                    if (_this.doShowErrorNavigation(_validateTeamManagementExaminerAction.failureCode)) {
                        if (_validateTeamManagementExaminerAction.isFromRememberQig) {
                            _this.emit(TeamManagementStore.
                                FAILURE_WHILE_FETCHING_TEAM_DATA_ON_REMEMBER_QIG_EVENT, _validateTeamManagementExaminerAction.failureCode, _validateTeamManagementExaminerAction.markSchemeGroupId);
                        }
                        else {
                            _this.emit(TeamManagementStore.TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT, _validateTeamManagementExaminerAction.failureCode);
                        }
                    }
                    else {
                        if (_validateTeamManagementExaminerAction.isFromRememberQig) {
                            _this.emit(TeamManagementStore.EXAMINER_VALIDATED_EVENT);
                        }
                        else if (_validateTeamManagementExaminerAction.examinerValidationArea
                            === enums.ExaminerValidationArea.MarkCheckWorklist) {
                            _this.emit(TeamManagementStore.EXAMINER_VALIDATED_OPEN_RESPONSE_EVENT, _validateTeamManagementExaminerAction.displayId, _validateTeamManagementExaminerAction.markingMode);
                        }
                        else if (_validateTeamManagementExaminerAction.isTeamManagementTabSelect) {
                            _this.emit(TeamManagementStore.MY_TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT, enums.FailureCode.None, _examinerDrillDownData, _validateTeamManagementExaminerAction.examinerValidationArea);
                        }
                        else if (_validateTeamManagementExaminerAction.examinerValidationArea
                            === enums.ExaminerValidationArea.ExceptionAction) {
                            _this.emit(TeamManagementStore.EXAMINER_VALIDATED_OPEN_EXCEPTION_EVENT, _validateTeamManagementExaminerAction.exceptionId);
                        }
                        else {
                            _this.emit(TeamManagementStore.TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT, enums.FailureCode.None);
                        }
                    }
                    break;
                case actionType.WARNING_MESSAGE_NAVIGATION_ACTION:
                    var navigationAction = action;
                    if (navigationAction.failureCode !== enums.FailureCode.None &&
                        (navigationAction.warningMessageAction === enums.WarningMessageAction.PromoteToSeed ||
                            (navigationAction.warningMessageAction === enums.WarningMessageAction.SuperVisorRemarkCheck ||
                                navigationAction.warningMessageAction === enums.WarningMessageAction.MyTeamAction
                                    && (navigationAction.failureCode === enums.FailureCode.HierarchyChanged
                                        || navigationAction.failureCode === enums.FailureCode.SubordinateExaminerWithdrawn)))) {
                        _this._isMyTeamRefreshRequired = true;
                    }
                    if (navigationAction.failureCode !== enums.FailureCode.None &&
                        navigationAction.warningMessageAction === enums.WarningMessageAction.SEPAction) {
                        _this._isHelpExaminersDataChanged = true;
                    }
                    break;
                case actionType.TEAM_SORT_ACTION:
                    var sortAction = action;
                    var sortItem = sortAction.sortDetails;
                    _this.updateTeamManagementSortCollection(sortItem.qig, sortItem.tab, sortItem.comparerName, sortItem.sortDirection);
                    break;
                case actionType.CONTAINER_CHANGE_ACTION:
                    var _loadContainerAction = action;
                    // if the examiner navigated back from drill down worklist to Team management
                    if (_loadContainerAction.containerPage === enums.PageContainers.TeamManagement) {
                        if (_this._examinerDrillDownData) {
                            // clear the drill down data which needs to be present only on subordinate screens
                            _this._selectedSubordinateExaminerRoleId = _this._examinerDrillDownData.examinerRoleId;
                            _this._examinerDrillDownData = undefined;
                        }
                    }
                    break;
                case actionType.MULTI_QIG_LOCK_DATA_FETCH_ACTION:
                    var multiQigLockGetAction = action;
                    var selectedQigName = void 0;
                    _this._multiLockDataList = multiQigLockGetAction.MultiQigLockData;
                    if (_this._multiLockDataList) {
                        _this._multiLockDataList.map(function (item) {
                            item.isChecked = false;
                            item.qigName = _this.getQigName(item.markSchemeGroupId);
                        });
                    }
                    selectedQigName = _this.getQigName(multiQigLockGetAction.selectedQigId);
                    _this._multiLockSelectedExaminerQigId = multiQigLockGetAction.selectedQigId;
                    var _multiLockSelectedExaminer = {
                        examinerId: multiQigLockGetAction.selectedExaminerId,
                        examinerRoleId: multiQigLockGetAction.selectedExaminerRoleId
                    };
                    _this._multiLockExaminerDrillDownData = _multiLockSelectedExaminer;
                    _this.emit(TeamManagementStore.MULTI_QIG_LOCK_DATA_RECEIVED, multiQigLockGetAction.selectedExaminerId, multiQigLockGetAction.selectedQigId, multiQigLockGetAction.selectedExaminerRoleId, selectedQigName);
                    break;
                case actionType.UPDATE_MULTI_QIG_LOCK_SELECTION:
                    var updateMultiQigLockSelection_1 = action;
                    if (updateMultiQigLockSelection_1.isSelectedAll) {
                        // If select all option clicked then all Qigs in the list are set to true or checked.
                        if (_this._multiLockDataList) {
                            _this._multiLockDataList.map(function (item) {
                                item.isChecked = true;
                            });
                        }
                    }
                    else {
                        if (_this._multiLockDataList) {
                            _this._multiLockDataList.map(function (item) {
                                if (item.markSchemeGroupId === updateMultiQigLockSelection_1.markSchemeGroupId) {
                                    item.isChecked = !item.isChecked;
                                }
                                else if (updateMultiQigLockSelection_1.markSchemeGroupId === 0) {
                                    // If select all option deselected then all Qigs in the list are set to false or unchecked.
                                    item.isChecked = false;
                                }
                            });
                        }
                    }
                    _this.emit(TeamManagementStore.UPDATE_MULTI_QIG_LOCK_SELECTION_RECEIVED);
                    break;
                case actionType.MULTI_LOCK_DATA_RESET:
                    // Reset the multi Qig lock list.
                    _this._multiLockDataList = undefined;
                    _this._multiLockExaminerDrillDownData = undefined;
                    _this._multiLockResults = undefined;
                    _this._multiLockSelectedExaminerQigId = 0;
                    break;
                case actionType.QIG_SELECTED_FROM_MULI_QIG_DROP_DOWN:
                    var _qigSelectedFromMultiQigDropDownAction = action;
                    _this._multiQigSelectedDetail = _qigSelectedFromMultiQigDropDownAction.selectedQigDetail;
                    _this._myTeamDataList = undefined;
                    _this.emit(TeamManagementStore.QIG_SELECTED_FROM_MULTI_QIG_DROP_DOWN);
                    break;
                case actionType.MULTI_QIG_LOCK_RESULT:
                    var multiQigLockResultAction_1 = (action);
                    _this._multiLockResults = multiQigLockResultAction_1.multiQigLockResult;
                    if (_this._multiLockResults) {
                        _this._multiLockResults.map(function (item) {
                            item.qigName = _this.getQigName(item.markSchemeGroupId);
                        });
                    }
                    _this.emit(TeamManagementStore.MULTI_QIG_LOCK_RESULT_RECEIVED);
                    break;
            }
        });
    }
    /**
     * Returns doShowErrorNavigation
     */
    TeamManagementStore.prototype.doShowErrorNavigation = function (_failureCode) {
        switch (_failureCode) {
            case enums.FailureCode.SubordinateExaminerWithdrawn:
            case enums.FailureCode.HierarchyChanged:
            case enums.FailureCode.NotPEOrAPE:
            case enums.FailureCode.NotTeamLead:
            case enums.FailureCode.Withdrawn:
                return true;
            default: return false;
        }
    };
    Object.defineProperty(TeamManagementStore.prototype, "myTeamData", {
        /**
         * Returns my team data
         */
        get: function () {
            return Immutable.List(this._myTeamDataList);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get Parent Examiner Role Id for the examiner role id
     * @param teamList
     * @param examinerRoleId
     */
    TeamManagementStore.prototype.getExaminerParentRoleId = function (teamList, examinerRoleId) {
        for (var index = 0; index < teamList.length; index++) {
            var examier = teamList[index];
            if (examier.examinerRoleId === examinerRoleId) {
                return examier.parentExaminerRoleId;
            }
            else if (examier.subordinates.length > 0) {
                var parentExaminerRoleId = this.getExaminerParentRoleId(examier.subordinates, examinerRoleId);
                if (parentExaminerRoleId) {
                    return parentExaminerRoleId;
                }
            }
        }
    };
    Object.defineProperty(TeamManagementStore.prototype, "expandOrCollapseDetails", {
        /**
         * Return the expand or collapse details collection
         */
        get: function () {
            return this._expandOrCollapseDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "selectedExaminerRoleId", {
        /**
         * Returns the logged in user examinerRoleId
         */
        get: function () {
            return this._selectedExaminerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "selectedMarkSchemeGroupId", {
        /**
         *  Returns the selected MarkSchemeGroupId
         */
        get: function () {
            return this._selectedMarkSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "isLeftPanelCollapsed", {
        /**
         * Returns a value indicating whether the Team Management left panel is collapsed or not
         */
        get: function () {
            return this._isLeftPanelCollapsed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "examinerDrillDownData", {
        /**
         * Returns the current examiner drill down data.
         */
        get: function () {
            return this._examinerDrillDownData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "selectedTeamManagementTab", {
        /**
         * Returns the current selected Team management Left Link.
         */
        get: function () {
            return this._selectedTeamManagementTab;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "examinerStatusDetails", {
        /**
         * Returns the examiner status details.
         */
        get: function () {
            return this._examinerStatusReturn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "secondStandardisationReturn", {
        /**
         * Returns the second standardisation return.
         */
        get: function () {
            return this._secondStandardisationReturn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "exceptionList", {
        /**
         * Returns the list of UnActionedExceptionDetails
         */
        get: function () {
            return this._exceptionList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "examinersForHelpExaminers", {
        /**
         * Returns the Examiners list in the Help Examiner
         */
        get: function () {
            return this._examinersForHelpExaminers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "isHelpExaminersDataChanged", {
        /**
         * Get the status of Help Examiners Data changed or not
         */
        get: function () {
            return this._isHelpExaminersDataChanged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "isMyTeamRefreshRequired", {
        /**
         * Get the status of My Team Data changed or not
         */
        get: function () {
            return this._isMyTeamRefreshRequired;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "teamOverviewCountData", {
        /**
         * Returns the Examiners team overview Data
         */
        get: function () {
            return this._teamOverviewCountData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "getSelectedQig", {
        /**
         * Get the selected qig
         */
        get: function () {
            var _this = this;
            if (!this._teamOverviewCountData) {
                return null;
            }
            var qigDetails = this._teamOverviewCountData.qigDetails;
            if (qigDetails && qigDetails.length > 1) {
                return qigDetails.filter(function (x) {
                    return x.qigId === _this._selectedMarkSchemeGroupId;
                })[0];
            }
            else if (qigDetails) {
                return qigDetails[0];
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "selectedException", {
        /**
         * Returns the Examiners team overview Data
         */
        get: function () {
            return this._selectedException;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "isRedirectFromException", {
        /**
         * Get the reponse redirect from the exception
         */
        get: function () {
            return this._isRedirectFromException;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "sortDetails", {
        /**
         * This method will return the sort details
         */
        get: function () {
            return this._sortDetails;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * set default sort details
     * @param qigId
     * @param teamManagementTab
     */
    TeamManagementStore.prototype.updateTeamManagementSortCollection = function (qigId, teamManagementTab, comparerName, sortDirection) {
        var entry = this.sortDetails.filter(function (x) { return x.tab === teamManagementTab && x.qig === qigId; });
        // if item is not present in sort collection then update the collection with default details
        if (entry.length === 0) {
            if (comparerName === undefined && sortDirection === undefined) {
                var defaultSortValues = this.getDefaultSortDetails(teamManagementTab);
                comparerName = defaultSortValues.compareName;
                sortDirection = defaultSortValues.sortDirection;
            }
            var sortDetails = {
                qig: qigId,
                tab: teamManagementTab,
                comparerName: comparerName,
                sortDirection: sortDirection,
            };
            this._sortDetails.push(sortDetails);
        }
        else if (comparerName !== undefined && sortDirection !== undefined) {
            this.sortDetails.filter(function (x) { return x.tab === teamManagementTab &&
                x.qig === qigId; })[0].comparerName = comparerName;
            this.sortDetails.filter(function (x) { return x.tab === teamManagementTab &&
                x.qig === qigId; })[0].sortDirection = sortDirection;
        }
    };
    /**
     * Get the comparer for the current team mangement tab
     * @param teamManagementTab
     */
    TeamManagementStore.prototype.getDefaultSortDetails = function (teamManagementTab) {
        var comparerName;
        var sortDirection;
        switch (teamManagementTab) {
            case enums.TeamManagement.HelpExaminers:
                comparerName = comparerList.helpExaminerComparer;
                sortDirection = enums.SortDirection.Ascending;
                break;
            default:
                comparerName = comparerList.examinerDataComparer;
                sortDirection = enums.SortDirection.Ascending;
                break;
        }
        return { compareName: comparerName, sortDirection: sortDirection };
    };
    /**
     * Add to visited qig list
     * @param qigid
     */
    TeamManagementStore.prototype.addToVisitedList = function (qigid) {
        if (this._visitedQigs.filter(function (x) { return x === qigid; }).length > 0) {
            this._isFirstTimeTeamManagementAccessed = false;
        }
        else {
            this._isFirstTimeTeamManagementAccessed = true;
            this._visitedQigs.push(qigid);
        }
    };
    /**
     * Get Qig name from team overview count data.
     */
    TeamManagementStore.prototype.getQigName = function (markSchemeGroupId) {
        var qigName = '';
        if (this._teamOverviewCountData && this._teamOverviewCountData.qigDetails) {
            this._teamOverviewCountData.qigDetails.map(function (qigDetail) {
                if (qigDetail.qigId === markSchemeGroupId) {
                    qigName = qigDetail.qigName;
                }
            });
        }
        return qigName;
    };
    Object.defineProperty(TeamManagementStore.prototype, "isFirstTimeTeamManagementAccessed", {
        /**
         * This method will return true if team management of particular qig not yet accessed
         */
        get: function () {
            return this._isFirstTimeTeamManagementAccessed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "multiQigSelectedDetail", {
        get: function () {
            return this._multiQigSelectedDetail;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "multiLockDataList", {
        /**
         * Returns the Examiners list in the Help Examiner
         */
        get: function () {
            return this._multiLockDataList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "multiLockExaminerDrillDownData", {
        /**
         * Returns the multi qig selected examiner drill down data.
         */
        get: function () {
            return this._multiLockExaminerDrillDownData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "multiLockResults", {
        /**
         * Returns the multi lock result list
         */
        get: function () {
            return this._multiLockResults;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamManagementStore.prototype, "multiLockSelectedExaminerQigId", {
        /**
         * Returns the multi lock selected examiner qig id
         */
        get: function () {
            return this._multiLockSelectedExaminerQigId;
        },
        enumerable: true,
        configurable: true
    });
    TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT = 'myTeamDataLoadedEvent';
    TeamManagementStore.EXPAND_OR_COLLAPSE_NODE_EVENT = 'expandOrCollapseExaminerNodeEvent';
    TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT = 'openTeamManagementEvent';
    TeamManagementStore.SET_PANEL_STATE = 'setTeamManagementLeftPanelState';
    TeamManagementStore.EXAMINER_DRILL_DOWN_DATA_UPDATED = 'examinerDrillDownDataUpdated';
    TeamManagementStore.TEAM_MANAGEMENT_SELECTED_TAB = 'teamManagementSelectedTab';
    TeamManagementStore.CHANGE_EXAMINER_STATUS_UPDATED = 'changeExaminerStatusUpdated';
    TeamManagementStore.PROVIDE_SECOND_STANDARDISATION_UPDATED = 'provideSecondStandardisationUpdated';
    TeamManagementStore.CHANGE_STATUS_POPUP_VISIBILITY_UPDATED = 'changestatuspopupvisibilityupdated';
    TeamManagementStore.SET_EXAMINER_CHANGE_STATUS_BUTTON_AS_BUSY = 'setexaminerchangestatusbuttonasbusy';
    TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT = 'teamExceptonsDataLoadedEvent';
    TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED = 'helpExaminersDataReceived';
    TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED = 'executeapprovalmanagementaction';
    TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED = 'teamOverviewDataReceived';
    TeamManagementStore.TEAM_OVERVIEW_DATA_RECEIVED_REMEMBER_QIG_EVENT = 'teamoverviewdatareceivedrememberqigevent';
    TeamManagementStore.CAN_EXECUTE_APPROVAL_MANAGEMENT_ACTION = 'canExecuteApprovalManagementAction';
    TeamManagementStore.SELECTED_EXCEPTION_ACTION_RECEIVED = 'selectedexceptionactionreceived';
    TeamManagementStore.TEAM_MANAGEMENT_HISTORY_INFO_UPDATED_EVENT = 'teammanagementhistoryinfoupdatedevent';
    TeamManagementStore.ADD_TO_HISTORY_EVENT = 'addtohistoryevent';
    TeamManagementStore.SAMPLING_STATUS_CHANGED_EVENT = 'samplingstatuschangedevent';
    TeamManagementStore.WORKLIST_DATA_UPDATED_EVENT = 'worklistdataupdatedevent';
    TeamManagementStore.FAILURE_WHILE_FETCHING_TEAM_DATA_EVENT = 'failurewhilefetchingteamdataevent';
    TeamManagementStore.TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT = 'teammanagementexaminervalidatedevent';
    TeamManagementStore.FAILURE_WHILE_FETCHING_TEAM_DATA_ON_REMEMBER_QIG_EVENT = 'failurewhilefetchingteamdataonrememberqigevent';
    TeamManagementStore.EXAMINER_VALIDATED_EVENT = 'examinervalidatedevent';
    TeamManagementStore.EXAMINER_VALIDATED_OPEN_RESPONSE_EVENT = 'examinervalidatedopenresponseevent';
    TeamManagementStore.EXAMINER_VALIDATED_OPEN_EXCEPTION_EVENT = 'examinervalidatedopenexceptionevent';
    TeamManagementStore.MY_TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT = 'myteammanagementexaminervalidatedevent';
    TeamManagementStore.QIG_SELECTED_FROM_MULTI_QIG_DROP_DOWN = 'qigselectedfrommultiqigdropdown';
    TeamManagementStore.SHOW_MULTI_QIG_HELP_EXAMINER_NAVIGATION_MESSAGE = 'showmultiqighelpexaminernavigationmessage';
    TeamManagementStore.MULTI_QIG_LOCK_DATA_RECEIVED = 'multiqiglockdatareceived';
    TeamManagementStore.UPDATE_MULTI_QIG_LOCK_SELECTION_RECEIVED = 'updatemultiqiglockselectionreceived';
    TeamManagementStore.MULTI_QIG_LOCK_RESULT_RECEIVED = 'multiqiglockresultreceived';
    return TeamManagementStore;
}(storeBase));
var instance = new TeamManagementStore();
module.exports = { TeamManagementStore: TeamManagementStore, instance: instance };
//# sourceMappingURL=teammanagementstore.js.map