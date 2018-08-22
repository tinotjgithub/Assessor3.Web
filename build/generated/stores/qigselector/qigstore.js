"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var actionType = require('../../actions/base/actiontypes');
var dispatcher = require('../../app/dispatcher');
var groupHelper = require('../../utility/grouping/grouphelper');
var grouperList = require('../../utility/grouping/groupingbase/grouperlist');
var enums = require('../../components/utility/enums');
var worklistStore = require('../worklist/workliststore');
var Immutable = require('immutable');
var stringHelper = require('../../utility/stringformat/stringformathelper');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
var constants = require('../../components/utility/constants');
var stdSetupPermissionHelper = require('../../utility/standardisationsetup/standardisationsetuppermissionhelper');
var QigStore = (function (_super) {
    __extends(QigStore, _super);
    /**
     * @constructor
     */
    function QigStore() {
        var _this = this;
        _super.call(this);
        this._isQIGCollectionLoaded = false;
        this._markerOperationMode = enums.MarkerOperationMode.Marking;
        this._locksInQigList = undefined;
        this._doShowLocksInQigPopUp = false;
        this._isShowLocksFromLogout = false;
        this._simulationModeExitedQigList = undefined;
        this._doShowAllSimulationExitedQigs = false;
        this._isSimulationTargetCompleted = false;
        this._isStandardisationSetupCompleted = false;
        this._isAcetateMoving = false;
        this.storageAdapterHelper = new storageAdapterHelper();
        this._previousSelectedQigId = 0;
        // To check if any of the qigs for the marker is in simulation
        this.hasSimulationQigExists = true;
        this._dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.QIGSELECTOR:
                    var _qigSelectorDataFetchAction_1 = action;
                    _this.isSuccess = _qigSelectorDataFetchAction_1.getOverviewData.success;
                    if (_this.isSuccess) {
                        if (_qigSelectorDataFetchAction_1.getOverviewData.qigSummary.count() > 0) {
                            _this.hasSimulationQigExists =
                                _qigSelectorDataFetchAction_1.getOverviewData.qigSummary
                                    .filter(function (x) {
                                    return x.currentMarkingTarget.markingMode === enums.MarkingMode.Simulation;
                                })
                                    .count() > 0;
                        }
                        if (_qigSelectorDataFetchAction_1.getQigToBeFetched === 0) {
                            _this._isQIGCollectionLoaded = true;
                            _this._qigOverviewData = _qigSelectorDataFetchAction_1.getOverviewData;
                            _this.emit(QigStore.QIG_LIST_LOADED_EVENT);
                        }
                        else {
                            _this._isQIGCollectionLoaded = false;
                            // In Remember QIG functionality, Related QIG Collection is getting populated by SP for the Whole Response.
                            // Should be keep in the collection for the QIG Name, while creating Exception for other QIGs [Whole Response].
                            if (_this._qigOverviewData === undefined) {
                                // handled only in Remember QIg
                                _this._qigOverviewData = _qigSelectorDataFetchAction_1.getOverviewData;
                            }
                            _this.setSelectedQIGForMarkerOperation(_qigSelectorDataFetchAction_1.getOverviewData.qigSummary
                                .filter(function (x) {
                                return x.markSchemeGroupId === _qigSelectorDataFetchAction_1.getQigToBeFetched;
                            })
                                .first(), _qigSelectorDataFetchAction_1.isDataForTheLoggedInUser);
                            if (_qigSelectorDataFetchAction_1.doEmit) {
                                _this.emit(QigStore.QIG_SELECTED_EVENT, _qigSelectorDataFetchAction_1.isDataFromSearch, _qigSelectorDataFetchAction_1.isDataFromHistory, _qigSelectorDataFetchAction_1.isFromLocksInPopUp);
                                if (_qigSelectorDataFetchAction_1.isDataFromHistory) {
                                    _this.emit(QigStore.QIG_SELECTED_FROM_HISTORY_EVENT);
                                }
                            }
                        }
                    }
                    else {
                        // If not successfull incase of n/w error, dont prevent to load any page, eg:worklist
                        _qigSelectorDataFetchAction_1.getQigToBeFetched === 0
                            ? _this.emit(QigStore.QIG_LIST_LOADED_EVENT)
                            : _this.emit(QigStore.QIG_SELECTED_EVENT);
                    }
                    break;
                case actionType.MARK:
                    _this.setSelectedQIGForMarkerOperation(_this._qigOverviewData.qigSummary
                        .filter(function (x) {
                        return x.markSchemeGroupId === action.getSelectedQigId();
                    })
                        .first(), true);
                    if (action.dispatchEvent) {
                        _this.emit(QigStore.QIG_SELECTED_EVENT);
                    }
                    else if (action.isFromHistory) {
                        _this.emit(QigStore.QIG_SELECTED_FROM_HISTORY_EVENT);
                    }
                    break;
                case actionType.RESPONSE_ALLOCATED:
                    /** Check the current approval status is withdrawn, If so remove the QIG. from the list */
                    var responseAllocation = action;
                    if (responseAllocation.allocatedResponseData.examinerApprovalStatus ===
                        enums.ExaminerApproval.Withdrawn) {
                        _this.removeSelectedQIGFromCollection();
                    }
                    /** For whole response download, clear the qig cache so that all the qigs get reflected of the change. */
                    if (responseAllocation.allocatedResponseData &&
                        responseAllocation.allocatedResponseData.allocatedResponseItems &&
                        responseAllocation.allocatedResponseData.allocatedResponseItems.length > 0 &&
                        responseAllocation.allocatedResponseData.allocatedResponseItems[0].isWholeResponse) {
                        _this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                    }
                    _this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                    break;
                case actionType.ATYPICAL_SEARCH_MOVETOWORKLIST_ACTION:
                    _this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                    break;
                case actionType.SUBMIT_RESPONSE_COMPLETED:
                    /** Check the current approval status is withdrawn, If so remove the QIG. from the list */
                    var submitResponseCompletedAction_1 = action;
                    if (submitResponseCompletedAction_1.getSubmitResponseReturnDetails.responseSubmitErrorCode ===
                        constants.QIG_SESSION_CLOSED) {
                        return;
                    }
                    if (submitResponseCompletedAction_1.getSubmitResponseReturnDetails.examinerApprovalStatus ===
                        enums.ExaminerApproval.Withdrawn) {
                        _this.removeSelectedQIGFromCollection();
                        return;
                    }
                    /** getting thequality feedback flag */
                    if (_this.selectedQIGForMarkerOperation) {
                        _this.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding =
                            submitResponseCompletedAction_1.getSubmitResponseReturnDetails.hasQualityFeedbackOutstanding;
                        _this.selectedQIGForMarkerOperation.qualityFeedbackOutstandingSeedTypeId =
                            submitResponseCompletedAction_1.getSubmitResponseReturnDetails.seedTypeId;
                    }
                    /** Submitted Info needs to be updated in all QIGS while for Atypical and WholeResponses */
                    _this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                    break;
                case actionType.BACKGROUND_PULSE:
                    var success = action.success;
                    if (action.getOnlineStatusData.examinerApprovalStatus ===
                        enums.ExaminerApproval.Withdrawn) {
                        _this.removeSelectedQIGFromCollection();
                    }
                    break;
                case actionType.SAVE_MARKS_AND_ANNOTATIONS:
                    /** Check the current approval status is withdrawn, If so remove the QIG. from the list */
                    var saveAction = action;
                    if (saveAction.saveMarksAndAnnotationsData &&
                        saveAction.saveMarksAndAnnotationsData.saveMarksErrorCode ===
                            enums.SaveMarksAndAnnotationErrorCode.WithdrawnResponse) {
                        _this.removeSelectedQIGFromCollection();
                    }
                    break;
                case actionType.ACCEPT_QUALITY_ACTION:
                    var acceptFeedbakAction = action;
                    if (acceptFeedbakAction.acceptQualityFeedbackActionData.success) {
                        if (_this.selectedQIGForMarkerOperation) {
                            _this.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding = false;
                            _this.selectedQIGForMarkerOperation.qualityFeedbackOutstandingSeedTypeId =
                                enums.SeedType.None;
                        }
                        _this.emit(QigStore.ACCEPT_QUALITY_ACTION_COMPLETED, enums.SaveAndNavigate.toWorklist);
                    }
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    var responseDataGetAction_1 = action;
                    // While opening a response from message, MARKER_OPERATION_MODE_CHANGED_ACTION is not fired,
                    // So set the operation mode . Set marking in case of Supervisor Remark navigation
                    if (responseDataGetAction_1.searchedResponseData.triggerPoint === enums.TriggerPoint.SupervisorRemark) {
                        _this._markerOperationMode = enums.MarkerOperationMode.Marking;
                    }
                    else if (responseDataGetAction_1.searchedResponseData.isTeamManagement) {
                        _this._markerOperationMode = enums.MarkerOperationMode.TeamManagement;
                    }
                    if (_this.selectedQIGForMarkerOperation !== undefined) {
                        // Clear the data If the Selected QIG and searching display Id belongs to another QIG
                        if (_this.selectedQIGForMarkerOperation &&
                            _this.selectedQIGForMarkerOperation.markSchemeGroupId !==
                                responseDataGetAction_1.searchedResponseData.markSchemeGroupId) {
                            _this.setSelectedQIGForMarkerOperation(undefined, true);
                        }
                    }
                    break;
                case actionType.SHOW_HEADER_ICONS:
                    var displayIconsAction = action;
                    _this.emit(QigStore.SHOW_HEADER_ICONS, displayIconsAction.showHeaderIcons);
                    break;
                case actionType.NAVIGATE_TO_WORKLIST_FROM_QIG_SELECTOR_ACTION:
                    _this.emit(QigStore.NAVIGATE_TO_WORKLIST_FROM_QIG_SELECTOR_EVENT);
                    break;
                case actionType.UPDATE_EXAMINER_DRILL_DOWN_DATA:
                    // clear selected qig data for waiting for subordinates selected qig data.
                    _this.setSelectedQIGForMarkerOperation(undefined, false);
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    // setting marker operation mode for changing selected qig data
                    _this._markerOperationMode = action.operationMode;
                    break;
                case actionType.WARNING_MESSAGE_NAVIGATION_ACTION:
                    var navigationAction = action;
                    var isPEorAPE = _this._selectedQigForMarking.role === enums.ExaminerRole.principalExaminer ||
                        _this._selectedQigForMarking.role === enums.ExaminerRole.assistantPrincipalExaminer;
                    if (navigationAction.failureCode === enums.FailureCode.NotApproved) {
                        _this._selectedQigForMarking.examinerApprovalStatus = enums.ExaminerApproval.NotApproved;
                    }
                    else if (navigationAction.failureCode === enums.FailureCode.Suspended) {
                        _this._selectedQigForMarking.examinerApprovalStatus = enums.ExaminerApproval.Suspended;
                    }
                    else if (navigationAction.failureCode === enums.FailureCode.Withdrawn) {
                        _this.setSelectedQIGForMarkerOperation(undefined, true);
                        _this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                    }
                    break;
                case actionType.TEAM_MANAGEMENT_HISTORY_INFO_ACTION:
                    var _setTeamManagementHistoryInfoAction = action;
                    if (_setTeamManagementHistoryInfoAction.markingMode === enums.MarkerOperationMode.TeamManagement &&
                        _setTeamManagementHistoryInfoAction.historyItem.team.currentContainer !==
                            enums.PageContainers.TeamManagement &&
                        _setTeamManagementHistoryInfoAction.failureCode === enums.FailureCode.None) {
                        // clear selected qig data for waiting for subordinates selected qig data.
                        _this.setSelectedQIGForMarkerOperation(undefined, false);
                    }
                    break;
                case actionType.GET_LOCKS_IN_QIGS:
                    var _getLocksInQigsAction = action;
                    _this._locksInQigList = _getLocksInQigsAction.locksInQigDetailsList;
                    _this.emit(QigStore.LOCKS_IN_QIG_DATA_RETRIEVED, _getLocksInQigsAction.isFromLogout, _getLocksInQigsAction.locksInQigDetailsList);
                    break;
                case actionType.SHOW_LOCKS_IN_QIG_POPUP:
                    var _showLocksInQigPopupAction = action;
                    _this._doShowLocksInQigPopUp = _showLocksInQigPopupAction.doShowLocksInQigPopup;
                    _this._isShowLocksFromLogout = _showLocksInQigPopupAction.isShowLocksFromLogout;
                    _this.emit(QigStore.SHOW_LOCKS_IN_QIG_POPUP, _this.getLocksInQigList);
                    break;
                case actionType.OPEN_QIG_FROM_LOCKED_LIST:
                    var _openQigFromLockedListAction = action;
                    _this._doShowLocksInQigPopUp = false;
                    _this.emit(QigStore.QIG_SELECTED_FROM_LOCKED_LIST, _openQigFromLockedListAction.qigId);
                    break;
                case actionType.GET_SIMULATION_MODE_EXITED_QIGS:
                    var _getSimulationModeExitedQigsAction = action;
                    _this._simulationModeExitedQigList = _getSimulationModeExitedQigsAction.simulationModeExitedQigList;
                    _this.emit(QigStore.SIMULATION_EXITED_QIGS_RETRIEVED, _getSimulationModeExitedQigsAction.simulationModeExitedQigList);
                    break;
                case actionType.GET_SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS:
                    var _getSimulationExitedAndLockInQigsAction = action;
                    _this._simulationModeExitedQigList =
                        _getSimulationExitedAndLockInQigsAction.simulationModeExitedQigList;
                    _this._locksInQigList = _getSimulationExitedAndLockInQigsAction.locksInQigDetailsList;
                    _this.emit(QigStore.SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS_RETRIEVED, _getSimulationExitedAndLockInQigsAction.isFromLogout);
                    break;
                case actionType.SIMULATION_TARGET_COMPLETED:
                    var _simulationTargetCompleted = action;
                    _this._isSimulationTargetCompleted = _simulationTargetCompleted.isTargetCompleted;
                    _this._simulationModeExitedQigList.qigList = Immutable.List();
                    // Updating the qig overview data on completing simulation target
                    if (_this._qigOverviewData) {
                        // Updating the marking mode of all simulation exited qigs.
                        _simulationTargetCompleted.simulationExitedExaminerRoleIds.map(function (examinerRoleId) {
                            var filteredQigs = _this._qigOverviewData.qigSummary.filter(function (x) {
                                return x.examinerRoleId === examinerRoleId &&
                                    x.currentMarkingTarget.markingMode === enums.MarkingMode.Simulation;
                            });
                            if (filteredQigs.count() > 0) {
                                filteredQigs.first().currentMarkingTarget.markingMode = undefined;
                            }
                        });
                    }
                    _this.emit(QigStore.SIMULATION_TARGET_COMPLETED, _simulationTargetCompleted.isTargetCompleted);
                    break;
                case actionType.STANDARDISATION_SETUP_COMPLETED:
                    var _standardisationSetupCompletedAction = action;
                    _this.selectedQIGForMarkerOperation.standardisationSetupComplete =
                        _standardisationSetupCompletedAction.isStandardisationSetupCompleted;
                    // Updating the qig overview data on completing standardisation setup.
                    if (_this._qigOverviewData) {
                        _this._qigOverviewData.qigSummary
                            .filter(function (x) {
                            return x.examinerRoleId === _this.selectedQIGForMarkerOperation.examinerRoleId &&
                                x.currentMarkingTarget.markingMode === enums.MarkingMode.Simulation;
                        })
                            .first().standardisationSetupComplete =
                            _standardisationSetupCompletedAction.isStandardisationSetupCompleted;
                    }
                    _this._isStandardisationSetupCompleted =
                        _standardisationSetupCompletedAction.isStandardisationSetupCompleted;
                    _this._navigateFromBeforeStdSetupCheck = _standardisationSetupCompletedAction.navigatedFrom;
                    _this._navigateToAfterStdSetupCheck = _standardisationSetupCompletedAction.navigatedTo;
                    if (_this._navigateFromBeforeStdSetupCheck !== enums.PageContainers.None) {
                        _this.emit(QigStore.STANDARDISATION_SETUP_COMPLETED_EVENT, _standardisationSetupCompletedAction.isStandardisationSetupCompleted);
                    }
                    break;
                case actionType.LOAD_ACETATES_DATA_ACTION:
                    var _loadAcetatesDataAction = action;
                    _this._acetatesList = _loadAcetatesDataAction.acetatesData;
                    /* Filter shared acetates from the acetate list collection.
                       It is used for resetting the shared acetate changes done by the team member other than PE */
                    _this._sharedAcetatesList = Immutable.List(JSON.parse(JSON.stringify(_this._acetatesList.filter(function (x) { return x.shared === true; }))));
                    _this._previousSelectedQigId = _this.selectedQIGForMarkerOperation.markSchemeGroupId;
                    _this.emit(QigStore.ACETATES_DATA_LOADED_EVENT);
                    break;
                case actionType.ADD_OR_UPDATE_ACETATE_ACTION:
                    var _addOrUpdateAcetateAction = action;
                    var acetate = _addOrUpdateAcetateAction.acetate;
                    var _clientToken = _addOrUpdateAcetateAction.clientToken;
                    var _acetateContextMenuData = _addOrUpdateAcetateAction.acetateContextMenuData;
                    var _markingOperation = _addOrUpdateAcetateAction.markingOperation;
                    _this.addOrUpdateAcetate(acetate, _clientToken, _acetateContextMenuData, _markingOperation);
                    _this.emit(QigStore.ACETATES_ADDED_OR_UPDATED_EVENT, _clientToken, acetate);
                    break;
                case actionType.SAVE_ACETATES_DATA_ACTION:
                    var _saveAcetateListAction = action;
                    var savedAcetatesList = _saveAcetateListAction.acetatesData;
                    _this.ResetAcetatesDetails(savedAcetatesList);
                    _this.emit(QigStore.SAVE_ACETATES_DATA_ACTION_COMPLETED);
                    break;
                case actionType.REMOVE_ACETATE_DATA_ACTION:
                    var _removeAcetateDataAction = action;
                    var removeAcetateClientToken = _removeAcetateDataAction.clienToken;
                    var multilineItem = _removeAcetateDataAction.multilineItem;
                    var acetateContextMenuData_1 = _removeAcetateDataAction.acetateContextMenuData;
                    switch (multilineItem) {
                        case enums.MultiLineItems.line:
                            _this.removeMultilineFromCollection(removeAcetateClientToken, acetateContextMenuData_1);
                            break;
                        case enums.MultiLineItems.point:
                            _this.removePointFromCollection(removeAcetateClientToken, acetateContextMenuData_1);
                            break;
                        default:
                            _this.removeAcetateFromCollection(removeAcetateClientToken);
                            break;
                    }
                    _this.emit(QigStore.ACETATES_REMOVED_EVENT);
                    break;
                case actionType.ACETATE_MOVING_ACTION:
                    var isAcetateMovingAction = action;
                    _this._isAcetateMoving = isAcetateMovingAction.isMoving;
                    _this.emit(QigStore.ACETATES_MOVING, _this._isAcetateMoving);
                    break;
                case actionType.ACETATE_IN_GREY_AREA_ACTION:
                    var acetateInGreyAreaAction_1 = action;
                    _this.emit(QigStore.ACETATE_IN_GREY_AREA, acetateInGreyAreaAction_1.isInGreyArea);
                    break;
                case actionType.SHARE_ACETATE_DATA_ACTION:
                    var _shareAcetateDataAction = action;
                    var shareAcetateClientToken = _shareAcetateDataAction.clienToken;
                    var isShared = _this.shareAcetateFromCollection(shareAcetateClientToken);
                    _this.emit(QigStore.ACETATES_SHARED_EVENT, isShared);
                    break;
                case actionType.ADD_POINT_TO_MULTILINE:
                    var _addPointToMultilineAction = action;
                    _this.emit(QigStore.ADD_POINT_TO_MULTILINE_EVENT, _addPointToMultilineAction.clientToken, _addPointToMultilineAction.x, _addPointToMultilineAction.y, _addPointToMultilineAction.acetateContextMenuData, _addPointToMultilineAction.multilineItems);
                    break;
                case actionType.SHARE_CONFIRMATION_POPUP_ACTION:
                    var _shareConfirmationPopupAction = action;
                    _this.emit(QigStore.SHARE_CONFIRMATION_EVENT, _shareConfirmationPopupAction.clienToken, _shareConfirmationPopupAction.ShareMultiline);
                    break;
                case actionType.MULTILINE_STYLE_UPDATE:
                    var _multilineStyleUpdateAction = action;
                    _this.emit(QigStore.MULTILINE_STYLE_UPDATE_EVENT, _multilineStyleUpdateAction.clientToken, _multilineStyleUpdateAction.clientX, _multilineStyleUpdateAction.clientY, _multilineStyleUpdateAction.acetateContextMenuData, _multilineStyleUpdateAction.multiLineItems);
                    break;
                case actionType.RESET_SHARED_ACETATES_ACTION:
                    _this.resetSharedAcetates();
                    _this.emit(QigStore.RESET_SHARED_ACETATES_COMPLETED);
                    break;
                case actionType.RESET_ACETATE_SAVE_IN_PROGRESS_STATUS_ACTION:
                    var _resetAcetateSaveInProgressAction = action;
                    var modifiedAcetatesList = Immutable.List();
                    modifiedAcetatesList = _this.ResetSaveInProgressFlag(_resetAcetateSaveInProgressAction.acetatesList);
                    if (modifiedAcetatesList && modifiedAcetatesList.size > 0) {
                        _this.emit(QigStore.RESET_ACETATE_SAVE_IN_PROGRESS_STATUS_COMPLETED, modifiedAcetatesList);
                    }
                    break;
                case actionType.COMPLETE_STANDARDISATION_SETUP:
                    var _completestandardisationsetupaction = action;
                    if (_completestandardisationsetupaction.
                        completeStandardisationSetupReturnDetails.completeStandardisationValidation
                        !== enums.CompleteStandardisationErrorCode.StandardisationNotComplete) {
                        _this.selectedQIGForMarkerOperation.standardisationSetupComplete = true;
                    }
                    break;
            }
        });
    }
    Object.defineProperty(QigStore.prototype, "hasAnySimulationQigs", {
        /**
         * Get the simulation QIGs exists or not
         */
        get: function () {
            return this.hasSimulationQigExists;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "getLocksInQigList", {
        /**
         * Get the locks in qig details
         */
        get: function () {
            return this._locksInQigList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "getOverviewData", {
        /**
         * Get the Overview Data
         */
        get: function () {
            return this._qigOverviewData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "getPreviousSelectedQigId", {
        /**
         * Get the Previous selected qig id
         */
        get: function () {
            return this._previousSelectedQigId;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get Qigs GroupedBy
     * @param groupBy
     */
    QigStore.prototype.getQigsGroupedBy = function (groupBy, isSelectedExaminerSTM) {
        this.updateQigsWithChangedResponseCount(isSelectedExaminerSTM);
        return groupHelper.group(this._qigOverviewData.qigSummary, grouperList.QigSelectorGrouper, groupBy);
    };
    /**
     * Updating the closed response count in the _qigOverviewData collection
     * If the qig related data changed after loading qig selector, it will update
     * with correct data
     */
    QigStore.prototype.updateQigsWithChangedResponseCount = function (isSelectedExaminerSTM) {
        // If the selected QIG is undefined return, otherwise this method will be throwing error below.
        if (!this.selectedQIGForMarkerOperation) {
            return;
        }
        var markingTargetsSummary;
        var filteredMarkingTargetsSummary;
        /** Getting  markingTargetsSummary from worklist store,
         * it is a locally updated list based on the worklist response collection changes
         */
        markingTargetsSummary = worklistStore.instance.getExaminerMarkingTargetProgress(isSelectedExaminerSTM);
        if (markingTargetsSummary) {
            var that_1 = this;
            this._qigOverviewData.qigSummary.map(function (qigSummaryItem) {
                // Select the particular QIG that needs to be updated
                if (qigSummaryItem.examinerRoleId === that_1.selectedQIGForMarkerOperation.examinerRoleId) {
                    // Get live, directed and pooled remarking marking targets
                    filteredMarkingTargetsSummary = markingTargetsSummary.filter(function (x) {
                        return (x.markingModeID === enums.MarkingMode.LiveMarking ||
                            x.markingModeID === enums.MarkingMode.Remarking) &&
                            x.examinerRoleID === that_1.selectedQIGForMarkerOperation.examinerRoleId;
                    });
                    filteredMarkingTargetsSummary.map(function (markingTargetSummaryItem) {
                        // Update response count for current target of the selected QIG
                        if (qigSummaryItem.currentMarkingTarget.markingMode === markingTargetSummaryItem.markingModeID) {
                            if (qigSummaryItem.currentMarkingTarget.openResponsesCount !==
                                markingTargetSummaryItem.examinerProgress.openResponsesCount) {
                                qigSummaryItem.currentMarkingTarget.openResponsesCount =
                                    markingTargetSummaryItem.examinerProgress.openResponsesCount;
                            }
                            if (qigSummaryItem.currentMarkingTarget.pendingResponsesCount !==
                                markingTargetSummaryItem.examinerProgress.pendingResponsesCount) {
                                qigSummaryItem.currentMarkingTarget.pendingResponsesCount =
                                    markingTargetSummaryItem.examinerProgress.pendingResponsesCount;
                            }
                            if (qigSummaryItem.currentMarkingTarget.closedResponsesCount !==
                                markingTargetSummaryItem.examinerProgress.closedResponsesCount) {
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
                            qigSummaryItem.markingTargets.map(function (qigMarkingTargetItem) {
                                // Update remark count
                                if (qigMarkingTargetItem.markingMode === markingTargetSummaryItem.markingModeID &&
                                    qigMarkingTargetItem.remarkRequestType ===
                                        markingTargetSummaryItem.remarkRequestTypeID) {
                                    if (qigMarkingTargetItem.openResponsesCount !==
                                        markingTargetSummaryItem.examinerProgress.openResponsesCount) {
                                        qigMarkingTargetItem.openResponsesCount =
                                            markingTargetSummaryItem.examinerProgress.openResponsesCount;
                                    }
                                    if (qigMarkingTargetItem.pendingResponsesCount !==
                                        markingTargetSummaryItem.examinerProgress.pendingResponsesCount) {
                                        qigMarkingTargetItem.pendingResponsesCount =
                                            markingTargetSummaryItem.examinerProgress.pendingResponsesCount;
                                    }
                                    if (qigMarkingTargetItem.closedResponsesCount !==
                                        markingTargetSummaryItem.examinerProgress.closedResponsesCount) {
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
    };
    /**
     * get the collection of Added/Modified acetates list for save to the database.
     */
    QigStore.prototype.getModifiedAcetatesList = function () {
        var modifiedAcetatesList = Immutable.List();
        if (this._acetatesList && this._acetatesList.size > 0) {
            modifiedAcetatesList = Immutable.List(this._acetatesList.filter(function (x) { return x.markingOperation !== enums.MarkingOperation.none && x.isSaveInProgress === false; }));
        }
        return modifiedAcetatesList;
    };
    /**
     * get the collection of  acetate list  which is in saveprogress mode.
     */
    QigStore.prototype.getSaveProgressAcetataeList = function () {
        var saveProgressAcetataeList = Immutable.List();
        if (this._acetatesList && this._acetatesList.size > 0) {
            saveProgressAcetataeList = Immutable.List(this._acetatesList.filter(function (x) { return x.isSaveInProgress === true; }));
        }
        return saveProgressAcetataeList;
    };
    /**
     * Looping on the each acetate list for resetings the isSaveInProgress flag in the collection.
     */
    QigStore.prototype.ResetSaveInProgressFlag = function (modifiedAcetatesList) {
        var _this = this;
        var that = this;
        modifiedAcetatesList.map(function (x) {
            _this._acetatesList.map(function (y, index, arr) {
                that.updateSaveInProgressOnTheAcetateItem(x, y, arr, index);
            });
        });
        return modifiedAcetatesList;
    };
    /**
     * This particular method set isSaveInProgress flag as true before save trigger.
     * For identifying save is in progreess or not.
     */
    QigStore.prototype.updateSaveInProgressOnTheAcetateItem = function (modifiedAcetatesList, acetateInClient, arr, index) {
        if (modifiedAcetatesList.clientToken === acetateInClient.clientToken) {
            acetateInClient.isSaveInProgress = true;
        }
    };
    /**
     * Looping on the each acetate list for resetings the flag in the collection.
     */
    QigStore.prototype.ResetAcetatesDetails = function (savedAcetatesList) {
        var that = this;
        savedAcetatesList.map(function (x) {
            that._acetatesList.map(function (y, index, arr) {
                that.resetFlagsOnTheAcetateItem(x, y, arr, index);
            });
        });
    };
    /**
     * This particular method resets the flag on the acetate item based on the scenarios after save trigger.
     */
    QigStore.prototype.resetFlagsOnTheAcetateItem = function (savedAcetatesList, acetateInClient, arr, index) {
        if (savedAcetatesList.clientToken === acetateInClient.clientToken) {
            acetateInClient.acetateId = savedAcetatesList.acetateId;
            acetateInClient.isSaveInProgress = false;
            if (savedAcetatesList.updateOn === acetateInClient.updateOn) {
                if (acetateInClient.markingOperation === enums.MarkingOperation.deleted) {
                    this._acetatesList = this._acetatesList.delete(index);
                }
                else {
                    acetateInClient.markingOperation = enums.MarkingOperation.none;
                }
            }
        }
    };
    /**
     * Updating the acetate flags accordingly  when we remove any acetate.
     */
    QigStore.prototype.removeAcetateFromCollection = function (removeAcetateClientToken) {
        this._acetatesList.map(function (x) {
            if (x.clientToken === removeAcetateClientToken) {
                x.markingOperation = enums.MarkingOperation.deleted;
                x.isSaveInProgress = false;
                x.updateOn = Date.now();
            }
        });
    };
    /**
     * Updating the multiline flags accordingly  when we remove any multiline.
     */
    QigStore.prototype.removeMultilineFromCollection = function (removeMultilineClientToken, acetateContextMenuData) {
        this._acetatesList.map(function (x) {
            if (x.clientToken === removeMultilineClientToken) {
                if (acetateContextMenuData.multilinearguments.noOfLines === 1) {
                    x.markingOperation = enums.MarkingOperation.deleted;
                }
                else {
                    x.acetateData.acetateLines.splice(acetateContextMenuData.multilinearguments.LineIndex, 1);
                    x.markingOperation = enums.MarkingOperation.updated;
                }
                x.isSaveInProgress = false;
            }
        });
    };
    /**
     * update Multiline Style.
     */
    QigStore.prototype.updateMultilineStyle = function (clientToken, acetateContextMenuData) {
        this._acetatesList.map(function (x) {
            if (x.clientToken === clientToken) {
                x.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].lineType =
                    acetateContextMenuData.multilinearguments.LineType;
                x.markingOperation = enums.MarkingOperation.updated;
                x.isSaveInProgress = false;
            }
        });
    };
    /**
     * update Multiline Color
     * @param clientToken
     * @param acetateContextMenuData
     */
    QigStore.prototype.updateMultilineColor = function (clientToken, acetateContextMenuData) {
        this._acetatesList.map(function (x) {
            if (x.clientToken === clientToken) {
                x.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].colour =
                    acetateContextMenuData.multilinearguments.LineColor;
                x.markingOperation = enums.MarkingOperation.updated;
                x.isSaveInProgress = false;
            }
        });
    };
    /**
     * Updating acetate data
     */
    QigStore.prototype.addOrUpdateAcetate = function (acetate, clientToken, acetateContextMenuData, markingOperation) {
        if (acetateContextMenuData) {
            this.addOrUpdateMultiLine(clientToken, acetateContextMenuData);
        }
        else {
            if (markingOperation === enums.MarkingOperation.added) {
                acetate.isSaveInProgress = false;
                var item = this._acetatesList.filter(function (item) { return item.clientToken === acetate.clientToken; });
                acetate.markingOperation = enums.MarkingOperation.added;
                if (item.count() > 0) {
                    this.updateAcetateData(acetate);
                }
                else if (acetate.acetateData.acetateLines && acetate.acetateData.acetateLines[0].points !== null) {
                    this._acetatesList = this._acetatesList.push(acetate);
                }
            }
            else if (markingOperation === enums.MarkingOperation.updated) {
                acetate.isSaveInProgress = false;
                acetate.markingOperation = enums.MarkingOperation.updated;
                this.updateAcetateData(acetate);
            }
        }
    };
    /**
     * Updating the multiline data.
     */
    QigStore.prototype.addOrUpdateMultiLine = function (clientToken, acetateContextMenuData) {
        switch (acetateContextMenuData.menuAction) {
            case enums.MenuAction.AddMultilineLine:
                var lineAcetate = this._acetatesList.filter(function (item) { return item.clientToken === clientToken; });
                if (lineAcetate.count() > 0) {
                    this.updateMultilineData(clientToken, acetateContextMenuData);
                }
                break;
            case enums.MenuAction.AddMultilinePoint:
                var pointAcetate = this._acetatesList.filter(function (item) { return item.clientToken === clientToken; });
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
    };
    /**
     * Remove point from collection
     * @param removeMultilineClientToken
     * @param acetateContextMenuData
     */
    QigStore.prototype.removePointFromCollection = function (removeMultilineClientToken, acetateContextMenuData) {
        this._acetatesList.map(function (x) {
            if (x.clientToken === removeMultilineClientToken) {
                if (acetateContextMenuData.multilinearguments.noOfPoints === 2) {
                    //In case when one line with two points exist in collection of multiline remove that perticular line
                    x.acetateData.acetateLines.splice(acetateContextMenuData.multilinearguments.LineIndex, 1);
                    if (acetateContextMenuData.multilinearguments.noOfLines === 1) {
                        // if only one line with two points exist and no other lines in collection exist remove the entire
                        // multiline collection
                        x.markingOperation = enums.MarkingOperation.deleted;
                    }
                    else {
                        x.markingOperation = enums.MarkingOperation.updated;
                    }
                }
                else {
                    x.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].points.splice(acetateContextMenuData.multilinearguments.PointIndex, 1);
                    x.markingOperation = enums.MarkingOperation.updated;
                }
                x.isSaveInProgress = false;
            }
        });
    };
    /**
     * Updating the shared status of multiline.
     */
    QigStore.prototype.shareAcetateFromCollection = function (shareAcetateClientToken) {
        var isShared = false;
        this._acetatesList.map(function (x) {
            if (x.clientToken === shareAcetateClientToken) {
                x.shared = isShared = !x.shared;
                x.isSaveInProgress = false;
                if (x.acetateId === undefined) {
                    x.markingOperation = enums.MarkingOperation.added;
                }
                else {
                    x.markingOperation = enums.MarkingOperation.updated;
                }
            }
        });
        return isShared;
    };
    /**
     * Set the selected QIG for marker operation
     */
    QigStore.prototype.setSelectedQIGForMarkerOperation = function (selectedQig, isForTheLoggedInUser) {
        if (!selectedQig) {
            // reseting both selected qig items
            if (isForTheLoggedInUser) {
                this._selectedQigForMarking = undefined;
            }
            this._selectedQigForTeamManagement = undefined;
        }
        else if (this._markerOperationMode === enums.MarkerOperationMode.Marking) {
            this._selectedQigForMarking = selectedQig;
        }
        else {
            this._selectedQigForTeamManagement = selectedQig;
        }
        if (isForTheLoggedInUser) {
            this._selectedQigForMarking = selectedQig;
        }
    };
    Object.defineProperty(QigStore.prototype, "isWholeResponseAvailable", {
        /**
         * Retrieves a value indicating whole response is available or not
         */
        get: function () {
            var _this = this;
            var isWholeResponseAvailable = false;
            if (this._selectedQigForMarking && this._selectedQigForMarking.hasPermissionInRelatedQIGs) {
                if (this._qigOverviewData !== undefined) {
                    var relatedQigList = this._qigOverviewData.qigSummary.filter(function (x) { return x.questionPaperPartId === _this.selectedQIGForMarkerOperation.questionPaperPartId; });
                    var availableQigs = relatedQigList.filter(function (x) {
                        return (x.role === enums.ExaminerRole.principalExaminer ||
                            x.role === enums.ExaminerRole.assistantPrincipalExaminer) &&
                            x.standardisationSetupComplete &&
                            x.examinerApprovalStatus === enums.ExaminerApproval.Approved;
                    });
                    isWholeResponseAvailable = relatedQigList.count() === availableQigs.count();
                }
            }
            return isWholeResponseAvailable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "relatedQigList", {
        /**
         * Returns the relatedQigList
         */
        get: function () {
            var _this = this;
            var hasPermissionInRelatedQIGs = this.isWholeResponseAvailable ? this.isWholeResponseAvailable : true;
            var relatedQigList;
            if (this._selectedQigForMarking && hasPermissionInRelatedQIGs) {
                if (this._qigOverviewData !== undefined) {
                    relatedQigList = this._qigOverviewData.qigSummary.filter(function (x) {
                        return x.questionPaperPartId === _this.selectedQIGForMarkerOperation.questionPaperPartId;
                    });
                }
            }
            return relatedQigList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "isAtypicalAvailable", {
        /**
         * Retrieves a value indicating atypical response is available or not
         */
        get: function () {
            var _this = this;
            var isAtypicalAvailable = false;
            if (this._qigOverviewData !== undefined) {
                if (this._selectedQigForMarking.relatedQIGCount === 0) {
                    isAtypicalAvailable =
                        this._qigOverviewData.qigSummary
                            .filter(function (x) {
                            return x.questionPaperPartId === _this.selectedQIGForMarkerOperation.questionPaperPartId;
                        })
                            .first().examinerApprovalStatus === enums.ExaminerApproval.Approved;
                }
                else {
                    var relatedQigList = this._qigOverviewData.qigSummary.filter(function (x) { return x.questionPaperPartId === _this.selectedQIGForMarkerOperation.questionPaperPartId; });
                    var availableQigs = relatedQigList.filter(function (x) {
                        return x.standardisationSetupComplete && x.examinerApprovalStatus === enums.ExaminerApproval.Approved;
                    });
                    isAtypicalAvailable =
                        this._selectedQigForMarking.hasPermissionInRelatedQIGs &&
                            relatedQigList.count() === availableQigs.count();
                }
            }
            return isAtypicalAvailable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "examinerApprovalStatusInRelatedQigs", {
        /**
         * Retrieves approval statuses in all related qigs for the current examiner.
         * QIG : Approval Status pair
         */
        get: function () {
            var _this = this;
            var examinerApprovalDetailsForWholeResponse = Immutable.Map();
            var relatedQigList;
            if (this._qigOverviewData !== undefined) {
                relatedQigList = this._qigOverviewData.qigSummary
                    .filter(function (x) { return x.questionPaperPartId === _this.selectedQIGForMarkerOperation.questionPaperPartId; })
                    .toList();
                if (relatedQigList && relatedQigList.count() > 0) {
                    relatedQigList.map(function (qig) {
                        examinerApprovalDetailsForWholeResponse = examinerApprovalDetailsForWholeResponse.set(qig.markSchemeGroupId, qig.examinerApprovalStatus);
                    });
                }
            }
            return examinerApprovalDetailsForWholeResponse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "selectedQIGForMarkerOperation", {
        /**
         * Get's the selected QIG based on the marker operation If Marker Operation is Marking then
         * this will return the selectedQIGForMarking object or this will return selectedQigForTeamManagement
         */
        get: function () {
            if (this._markerOperationMode === enums.MarkerOperationMode.Marking ||
                worklistStore.instance.isMarkingCheckMode) {
                return this._selectedQigForMarking;
            }
            else {
                return this._selectedQigForTeamManagement;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "isQIGCollectionLoaded", {
        /**
         * Retrieves a value indicating if the QIG Collection is loaded
         */
        get: function () {
            return this._isQIGCollectionLoaded;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Remove the selected QIG from the collection
     */
    QigStore.prototype.removeSelectedQIGFromCollection = function () {
        var _this = this;
        if (this._qigOverviewData) {
            this._qigOverviewData.qigSummary = this._qigOverviewData.qigSummary
                .filter(function (x) { return x.markSchemeGroupId !== _this.selectedQIGForMarkerOperation.markSchemeGroupId; })
                .toList();
        }
        this.setSelectedQIGForMarkerOperation(undefined, true);
    };
    Object.defineProperty(QigStore.prototype, "getSelectedQIGForTheLoggedInUser", {
        /**
         * Get the Logged in User QIG details
         */
        get: function () {
            return this._selectedQigForMarking;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "doShowLocksInQigPopUp", {
        /**
         * Get doShowLocksInQigPopUp
         */
        get: function () {
            return this._doShowLocksInQigPopUp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "isShowLocksFromLogout", {
        get: function () {
            return this._isShowLocksFromLogout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "qigName", {
        // Gets a value indicating the current qig name.
        get: function () {
            var qigName = '';
            if (this._markerOperationMode === enums.MarkerOperationMode.Marking && this._selectedQigForMarking) {
                qigName = stringHelper.formatAwardingBodyQIG(this._selectedQigForMarking.markSchemeGroupName, this._selectedQigForMarking.assessmentCode, this._selectedQigForMarking.sessionName, this._selectedQigForMarking.componentId, this._selectedQigForMarking.questionPaperName, this._selectedQigForMarking.assessmentName, this._selectedQigForMarking.componentName, stringHelper.getOverviewQIGNameFormat());
            }
            else if (this._selectedQigForTeamManagement) {
                qigName = stringHelper.formatAwardingBodyQIG(this._selectedQigForTeamManagement.markSchemeGroupName, this._selectedQigForTeamManagement.assessmentCode, this._selectedQigForTeamManagement.sessionName, this._selectedQigForTeamManagement.componentId, this._selectedQigForTeamManagement.questionPaperName, this._selectedQigForMarking.assessmentName, this._selectedQigForMarking.componentName, stringHelper.getOverviewQIGNameFormat());
            }
            return qigName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "isTeamManagemement", {
        // Gets a value indicating whether the current screen is team management.
        get: function () {
            return this._markerOperationMode === enums.MarkerOperationMode.TeamManagement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "getSimulationModeExitedQigList", {
        /**
         * Gets the simulation mode exited qiglist
         */
        get: function () {
            return this._simulationModeExitedQigList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "isStandardisationsetupCompletedForTheQig", {
        /**
         * Check if standardisation setup for the qig is completed.
         */
        get: function () {
            return this._isStandardisationSetupCompleted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "navigateToAfterStdSetupCheck", {
        /**
         * Gets the container to navigate to aftercheck
         */
        get: function () {
            return this._navigateToAfterStdSetupCheck;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigStore.prototype, "acetatesList", {
        /**
         * Gets the container to navigate to aftercheck
         */
        get: function () {
            // JSON.stringify() added to remove reference for items in the store.
            if (this._acetatesList) {
                return Immutable.List(JSON.parse(JSON.stringify(this._acetatesList)));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * update the acetate collection
     * @param acetateData
     */
    QigStore.prototype.updateAcetateData = function (acetateData) {
        this._acetatesList.forEach(function (item) {
            if (item.clientToken === acetateData.clientToken) {
                if (item.acetateId === undefined) {
                    item.markingOperation = enums.MarkingOperation.added;
                }
                else {
                    item.markingOperation = enums.MarkingOperation.updated;
                }
                item.acetateData = acetateData.acetateData;
                item.isSaveInProgress = false;
                item.updateOn = Date.now();
            }
        });
    };
    /**
     * update the acetate collection
     * @param clientToken
     * @param acetateContextMenuData
     */
    QigStore.prototype.updateMultilineData = function (clientToken, acetateContextMenuData) {
        this._acetatesList.forEach(function (item) {
            if (item.clientToken === clientToken) {
                if (item.acetateId === undefined) {
                    item.markingOperation = enums.MarkingOperation.added;
                }
                else {
                    item.markingOperation = enums.MarkingOperation.updated;
                }
                var acetateLine = {
                    colour: constants.LINE_COLOR,
                    lineType: acetateContextMenuData.multilinearguments.LineType,
                    points: acetateContextMenuData.multilinearguments.DefaultAcetatePoints
                };
                item.acetateData.acetateLines.push(acetateLine);
                item.isSaveInProgress = false;
            }
        });
    };
    /**
     * update the acetate collection
     * @param clientToken
     * @param acetateContextMenuData
     */
    QigStore.prototype.updateMultilinePointData = function (clientToken, acetateContextMenuData) {
        this._acetatesList.forEach(function (item) {
            if (item.clientToken === clientToken) {
                if (item.acetateId === undefined) {
                    item.markingOperation = enums.MarkingOperation.added;
                }
                else {
                    item.markingOperation = enums.MarkingOperation.updated;
                }
                item.acetateData.acetateLines[acetateContextMenuData.multilinearguments.LineIndex].points.splice(acetateContextMenuData.multilinearguments.PointIndex, 0, {
                    x: acetateContextMenuData.multilinearguments.Xcordinate,
                    y: acetateContextMenuData.multilinearguments.Ycordinate
                });
                item.isSaveInProgress = false;
            }
        });
    };
    Object.defineProperty(QigStore.prototype, "isAcetateMoving", {
        /* return true if border is showing for acetates */
        get: function () {
            return this._isAcetateMoving;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Reset shared acetates
     */
    QigStore.prototype.resetSharedAcetates = function () {
        /* For a team member other than PE should be able to edit or remove the shared overlay.
           But it should be reappear next the response navigation.
           And also the overlay changes should not be saved in the database.*/
        if (this._acetatesList &&
            this._acetatesList.size > 0 &&
            this.getSelectedQIGForTheLoggedInUser &&
            this.getSelectedQIGForTheLoggedInUser.role !== enums.ExaminerRole.principalExaminer) {
            var sharedAcetatesList = Immutable.List(JSON.parse(JSON.stringify(this._sharedAcetatesList)));
            /* Remove shared overlay from the acetate list.
               Add previously selected shared overlays in the acetate list.
               So the shared overlay changes done by the team member should not reflect the acetate list collection.*/
            this._acetatesList = Immutable.List(this.acetatesList.filter(function (x) { return x.shared === false; }));
            var that_2 = this;
            sharedAcetatesList.map(function (sharedItem) {
                that_2._acetatesList = that_2._acetatesList.push(sharedItem);
            });
        }
    };
    /**
     * Get the markscheme group name
     */
    QigStore.prototype.getMarkSchemeGroupName = function (markSchemeGroupId) {
        var returnqiglist = this.getOverviewData.qigSummary
            .filter(function (x) { return x.markSchemeGroupId === markSchemeGroupId; })
            .toList();
        return returnqiglist.first().markSchemeGroupName;
    };
    /**
     * Get the is Marked As Provisional value
     */
    QigStore.prototype.isMarkedAsProvisional = function (markSchemeGroupId) {
        if (this._qigOverviewData) {
            var filteredQigList = this._qigOverviewData.qigSummary
                .filter(function (x) { return x.markSchemeGroupId === markSchemeGroupId; })
                .toList();
            return filteredQigList.first().isMarkedAsProvisional;
        }
        else {
            return false;
        }
    };
    /**
     * Get the Standardisation Setup Permissions
     */
    QigStore.prototype.getSSUPermissionsData = function (markSchemeGroupId) {
        var sSUPermissionCCValue = null;
        var stdSetupPremissionsData = null;
        if (this._qigOverviewData) {
            var filteredQigList = this._qigOverviewData.qigSummary
                .filter(function (x) { return x.markSchemeGroupId === markSchemeGroupId; })
                .toList();
            sSUPermissionCCValue = filteredQigList.first().standardisationSetupPermissionCCValue;
            stdSetupPremissionsData =
                stdSetupPermissionHelper.generateSTDSetupPermissionData(sSUPermissionCCValue, filteredQigList.first().role);
        }
        return stdSetupPremissionsData;
    };
    QigStore.QIG_LIST_LOADED_EVENT = 'qiglistloadedevent';
    QigStore.QIG_SELECTED_EVENT = 'qigselectedevent';
    QigStore.ACCEPT_QUALITY_ACTION_COMPLETED = 'AcceptQualityFeedbackActionCompleted';
    QigStore.SHOW_HEADER_ICONS = 'ShowHeaderIconsOnTopBar';
    QigStore.NAVIGATE_TO_WORKLIST_FROM_QIG_SELECTOR_EVENT = 'NavigateToWorklistFromQigSelectorEvent';
    QigStore.QIG_SELECTED_FROM_HISTORY_EVENT = 'qigselectedfromhistoryevent';
    QigStore.SHOW_LOCKS_IN_QIG_POPUP = 'showlocksinqigpopup';
    QigStore.LOCKS_IN_QIG_DATA_RETRIEVED = 'locksinqigdataretrieved';
    QigStore.QIG_SELECTED_FROM_LOCKED_LIST = 'qigselectedfromlockedlist';
    QigStore.SIMULATION_EXITED_QIGS_RETRIEVED = 'simulationexitedqigsretrieved';
    QigStore.SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS_RETRIEVED = 'getsimulationexitedandlocksinqigsaction';
    QigStore.SIMULATION_TARGET_COMPLETED = 'simulationtargetcompleted';
    QigStore.STANDARDISATION_SETUP_COMPLETED_EVENT = 'standardisationsetupcompletedevent';
    QigStore.ACETATES_DATA_LOADED_EVENT = 'acetatesdataloadedevent';
    QigStore.ACETATES_ADDED_OR_UPDATED_EVENT = 'acetatesaddedorupdatedevent';
    QigStore.ACETATES_REMOVED_EVENT = 'acetateremovedevent';
    QigStore.ACETATES_MOVING = 'acetatesbordershowing';
    QigStore.ACETATE_IN_GREY_AREA = 'acetateingreyarea';
    QigStore.MULTILINE_REMOVED_EVENT = 'multilineremovedevent';
    QigStore.ACETATES_SHARED_EVENT = 'acetatesharedevent';
    QigStore.ADD_POINT_TO_MULTILINE_EVENT = 'addpointtomultiline';
    QigStore.SAVE_ACETATES_DATA_ACTION_COMPLETED = 'saveacetatesdataactioncompleted';
    QigStore.SHARE_CONFIRMATION_EVENT = 'shareconfirmationevent';
    QigStore.MULTILINE_STYLE_UPDATE_EVENT = 'multilinestyleupdateevent';
    QigStore.RESET_SHARED_ACETATES_COMPLETED = 'resetsharedacetatescompleted';
    QigStore.RESET_ACETATE_SAVE_IN_PROGRESS_STATUS_COMPLETED = 'resetacetatesaveinprogressstatuscompleted';
    return QigStore;
}(storeBase));
var instance = new QigStore();
module.exports = { QigStore: QigStore, instance: instance };
//# sourceMappingURL=qigstore.js.map