"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var loginStore = require('../login/loginstore');
var dispatcher = require('../../app/dispatcher');
var actionType = require('../../actions/base/actiontypes');
var enums = require('../../components/utility/enums');
var targetSummaryStore = require('./targetsummarystore');
var comparerlist = require('../../utility/sorting/sortbase/comparerlist');
var Immutable = require('immutable');
var stringFormatHelper = require('../../utility/stringformat/stringformathelper');
var sortHelper = require('../../utility/sorting/sorthelper');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
var constants = require('../../components/utility/constants');
var supervisorRemarkDecision = require('../../dataservices/response/supervisorremarkdecision');
var ccValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
var WorkListStore = (function (_super) {
    __extends(WorkListStore, _super);
    /**
     * Constructor for worklist store
     */
    function WorkListStore() {
        var _this = this;
        _super.call(this);
        this._isWorklistRefreshRequired = false;
        this._selectedQuestionItemBIndex = 0;
        this._selectedQuestionItemUniqueId = 0;
        this._isLastNodeSelected = false;
        this._isMarkingCheckAvailable = false;
        // contains examinerRoleId: number, selectedFilter: enums.WorklistSeedFilter collections
        this._selectedFilterDetails = Immutable.Map();
        this.allowBackGroundPulseEventEmission = true;
        this._isMarkingCheckWorklistAccessPresent = false;
        this._markingCheckFailureCode = enums.FailureCode.None;
        this.storageAdapterHelper = new storageAdapterHelper();
        /**
         * Updates selected examiner in marking check requester collection
         * @param examinerId : Selected Examiner
         */
        this.updateMarkingCheckSelectedExaminer = function (examinerId) {
            if (_this._sortedMarkingCheckExaminerList) {
                _this._sortedMarkingCheckExaminerList.forEach(function (examiner) {
                    if (examiner.fromExaminerID === examinerId) {
                        examiner.isSelected = true;
                    }
                    else {
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
        this.updateFilterStatus = function (examinerRoleId, selectedFilter) {
            _this._selectedFilterDetails = _this._selectedFilterDetails.set(examinerRoleId, selectedFilter);
        };
        /** Emitting after clicking live list */
        this._responseSortDetails = new Array();
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.WORKLIST_MARKING_MODE_CHANGE:
                    var worklistTypeActionOnMarkingModeChange = action;
                    _this.isSuccess = worklistTypeActionOnMarkingModeChange.success;
                    if (_this.isSuccess) {
                        /* setting the marking mode */
                        _this.workListType = worklistTypeActionOnMarkingModeChange.getWorklistType;
                        if (_this.isMarkingCheckMode) {
                            _this._markingCheckResponseMode = worklistTypeActionOnMarkingModeChange.getResponseMode;
                        }
                        else {
                            _this.responseMode = worklistTypeActionOnMarkingModeChange.getResponseMode;
                        }
                        _this.remarkRequestType = worklistTypeActionOnMarkingModeChange.getRemarkRequestType;
                        _this._isDirectedRemark = worklistTypeActionOnMarkingModeChange.getIsDirectedRemark;
                        _this.setWorklistDetails(worklistTypeActionOnMarkingModeChange.getWorklistData, worklistTypeActionOnMarkingModeChange.getselectedExaminerRoleId);
                    }
                    // reset response opened from linked message link flag
                    _this._isWorklistRefreshRequired = false;
                    _this.emit(WorkListStore.WORKLIST_MARKING_MODE_CHANGE, worklistTypeActionOnMarkingModeChange.getMarkSchemeGroupId, worklistTypeActionOnMarkingModeChange.getQuestionPaperId);
                    _this.updateResponseSortCollection(_this.workListType, _this.getResponseMode, _this.remarkRequestType, worklistTypeActionOnMarkingModeChange.getMarkSchemeGroupId);
                    break;
                case actionType.RESPONSE_MODE_CHANGED:
                    var responseModeChangeAction_1 = action;
                    /* setting the response mode */
                    if (_this.isMarkingCheckMode) {
                        _this._markingCheckResponseMode = responseModeChangeAction_1.getResponseMode;
                    }
                    else {
                        _this.responseMode = responseModeChangeAction_1.getResponseMode;
                    }
                    if (_this._sortedMarkingCheckExaminerList && responseModeChangeAction_1.isMarkingCheckMode) {
                        _this._sortedMarkingCheckExaminerList.filter(function (marker) {
                            return marker.isSelected;
                        }).first().selectedTab = _this.getResponseMode;
                    }
                    break;
                case actionType.RESPONSE_CLOSE:
                    /* setting the response close flag, this is to differentiate that the worklist is loading after response close event */
                    _this.isResponseClose = action.getIsResponseClose;
                    // reset the selected question item when the response is closed
                    _this._selectedQuestionItemBIndex = 0;
                    _this._selectedQuestionItemUniqueId = 0;
                    _this.emit(WorkListStore.RESPONSE_CLOSED);
                    break;
                case actionType.SUBMIT_RESPONSE_COMPLETED:
                    var submitResponseCompletedAction_1 = action;
                    if (submitResponseCompletedAction_1.getSubmitResponseReturnDetails.hasQualityFeedbackOutstanding) {
                        _this.responseMode = enums.ResponseMode.closed;
                    }
                    break;
                case actionType.SETSCROLL_WORKLISTCOLUMNS_ACTION:
                    _this.emit(WorkListStore.SETSCROLL_WORKLIST_COLUMNS);
                    break;
                case actionType.MESSAGE_STATUS_UPDATE_ACTION:
                    // if message status is updated then we have to refresh the worklist to reflect the linked messages count
                    _this._isWorklistRefreshRequired = true;
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    var responseDataGetAction_1 = action;
                    _this.setWorklistDetails(undefined, 0);
                    _this.workListType = undefined;
                    _this.responseMode = responseDataGetAction_1.searchedResponseData.responseMode;
                    _this._isDirectedRemark = responseDataGetAction_1.searchedResponseData.isDirectedRemark;
                    if (responseDataGetAction_1.searchedResponseData.triggerPoint !== enums.TriggerPoint.SupervisorRemark &&
                        !responseDataGetAction_1.searchedResponseData.isTeamManagement &&
                        responseDataGetAction_1.searchedResponseData.loggedInExaminerId !==
                            responseDataGetAction_1.searchedResponseData.examinerId) {
                        _this._isMarkingCheckMode = true;
                    }
                    break;
                case actionType.QIGSELECTOR:
                    // marking checks needs to be re evaluated based on approval status and role in each QIG
                    _this._isMarkingCheckAvailable = false;
                    var qigSelectorDataFetchAction_1 = action;
                    _this.isSuccess = qigSelectorDataFetchAction_1.success;
                    if (_this.isSuccess) {
                        _this._qigOverviewData = qigSelectorDataFetchAction_1.getOverviewData;
                        if (qigSelectorDataFetchAction_1.getQigToBeFetched !== 0) {
                            _this._selectedQig = qigSelectorDataFetchAction_1.getOverviewData.qigSummary.filter(function (x) {
                                return x.markSchemeGroupId === qigSelectorDataFetchAction_1.getQigToBeFetched;
                            }).first();
                            if (_this._selectedQig && _this._selectedQig.hasQualityFeedbackOutstanding &&
                                _this._selectedQig.qualityFeedbackOutstandingSeedTypeId === enums.SeedType.EUR) {
                                _this.remarkRequestType = enums.RemarkRequestType.EnquiryUponResult;
                                _this.workListType = enums.WorklistType.directedRemark;
                            }
                        }
                    }
                    break;
                case actionType.SEND_MESSAGE_ACTION:
                    var sendMessageReturnAction = action;
                    var success = sendMessageReturnAction.success;
                    var messagePriority = sendMessageReturnAction.messagePriority;
                    var examBodyTypeId = sendMessageReturnAction.examBodyTypeId;
                    _this._markingCheckFailureCode = sendMessageReturnAction.failureCode;
                    if (success) {
                        _this._isWorklistRefreshRequired = true;
                        if (messagePriority === constants.SYSTEM_MESSAGE && examBodyTypeId === enums.SystemMessage.CheckMyMarks) {
                            _this.emit(WorkListStore.DO_GET_MARKING_CHECK_INFO);
                        }
                        else if (messagePriority === constants.SYSTEM_MESSAGE && examBodyTypeId === enums.SystemMessage.MarksChecked) {
                            _this.emit(WorkListStore.MARKING_CHECK_COMPLETED_EVENT);
                        }
                    }
                    break;
                case actionType.CLOSE_EXCEPTION:
                    _this._isWorklistRefreshRequired = true;
                    break;
                case actionType.MARK:
                    _this._selectedQig = _this._qigOverviewData.qigSummary.filter(function (x) {
                        return x.markSchemeGroupId === action.getSelectedQigId();
                    }).first();
                    if (_this._selectedQig && _this._selectedQig.hasQualityFeedbackOutstanding &&
                        _this._selectedQig.qualityFeedbackOutstandingSeedTypeId === enums.SeedType.EUR) {
                        _this.remarkRequestType = enums.RemarkRequestType.EnquiryUponResult;
                        _this.workListType = enums.WorklistType.directedRemark;
                    }
                    else if (loginStore.instance.isAdminRemarker) {
                        _this.remarkRequestType = enums.RemarkRequestType.PooledAdminRemark;
                        _this.workListType = enums.WorklistType.pooledRemark;
                    }
                    else {
                        _this.remarkRequestType = enums.RemarkRequestType.Unknown;
                        _this.workListType = enums.WorklistType.none;
                    }
                    break;
                case actionType.RAISE_EXCEPTION_ACTION:
                    _this._isWorklistRefreshRequired = true;
                    break;
                case actionType.SORT_ACTION:
                    var _sortClickAction = action;
                    var _sortDetails = _sortClickAction.getResponseSortDetails;
                    for (var i = 0; i < _this._responseSortDetails.length; i++) {
                        if (_this._responseSortDetails[i].qig === _sortDetails.qig &&
                            _this._responseSortDetails[i].responseMode === _sortDetails.responseMode
                            && _this._responseSortDetails[i].worklistType === _sortDetails.worklistType
                            && _this._responseSortDetails[i].remarkRequestType === _sortDetails.remarkRequestType) {
                            if (_sortDetails.comparerName) {
                                _this._responseSortDetails[i].comparerName = _sortDetails.comparerName;
                                _this._responseSortDetails[i].sortDirection = _sortDetails.sortDirection;
                            }
                        }
                    }
                    break;
                case actionType.SET_SELECTED_QUESTION_ITEM_ACTION:
                    var selectedQuestionItemAction = action;
                    _this._selectedQuestionItemBIndex = selectedQuestionItemAction.getSelectedQuestionItemIndex;
                    _this._selectedQuestionItemUniqueId = selectedQuestionItemAction.getSelectedQuestionItemUniqueId;
                    break;
                case actionType.UPDATE_EXAMINER_DRILL_DOWN_DATA:
                    // we need to clear the worklist type while loading teammanagement worklist
                    _this.workListType = undefined;
                    break;
                case actionType.IS_LAST_NODE_SELECTED_ACTION:
                    var isLastNodeSelectedAction_1 = action;
                    _this._isLastNodeSelected = isLastNodeSelectedAction_1.isLastNodeSelected;
                    break;
                case actionType.SHOW_RETURN_TO_WORKLIST_CONFIRMATION_ACTION:
                    _this.emit(WorkListStore.SHOW_RETURN_TO_WORKLIST_CONFIRMATION);
                    break;
                case actionType.SET_RESPONSE_AS_REVIEWED_ACTION:
                    var reviewedResponseDetails = action;
                    _this.setCurrentResponseAsReviewed(reviewedResponseDetails.ReviewedResponseDetails);
                    _this.emit(WorkListStore.RESPONSE_REVIEWED, reviewedResponseDetails.ReviewedResponseDetails);
                    break;
                case actionType.SAMPLING_STATUS_CHANGE_ACTION:
                    var _samplingStatusChangeAction = action;
                    if (_samplingStatusChangeAction.success) {
                        _this.setCurrentResponseAsSampled(_samplingStatusChangeAction.supervisorSamplingCommentReturn, _samplingStatusChangeAction.displayId);
                    }
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    //The default tab for team management should be closed. Hence removing the tab selected while in marking
                    // If the action is fired from Menu- need not reset the responsemode to undefined.
                    var markerOperationModeChangedAction_1 = action;
                    _this.responseMode = undefined;
                    _this.workListType = undefined;
                    _this._isMarkingCheckWorklistAccessPresent = undefined;
                    break;
                case actionType.GET_MARKING_CHECK_INFORMATION:
                    var markingCheckInfoFetchAction_1 = action;
                    _this._markingCheckStatus = markingCheckInfoFetchAction_1.MarkingCheckInfo.markingCheckStatus;
                    _this._isMarkingCheckAvailable = markingCheckInfoFetchAction_1.MarkingCheckInfo.isMarkingCheckAvailable;
                    _this.emit(WorkListStore.MARKING_CHECK_STATUS_UPDATED);
                    break;
                case actionType.GET_MARKING_CHECK_RECIPIENTS:
                    _this._markingCheckRecipientList = null;
                    var markingCheckRecipientInfo = action;
                    _this.setMarkingCheckPopupData((markingCheckRecipientInfo.MarkingCheckRecipientList));
                    _this.emit(WorkListStore.MARKING_CHECK_RECIPIENT_LIST_UPDATED);
                    break;
                case actionType.WORKLIST_HISTORY_INFO:
                    var _setWorklistHistoryInfoAction = action;
                    var _historyItem = _setWorklistHistoryInfoAction.historyItem;
                    var _markingMode = _setWorklistHistoryInfoAction.markingMode;
                    if (_markingMode === enums.MarkerOperationMode.Marking) {
                        _this.responseMode = _historyItem.myMarking.responseMode;
                        _this.workListType = _historyItem.myMarking.worklistType;
                        _this.remarkRequestType = _historyItem.myMarking.remarkRequestType;
                    }
                    else if (_markingMode === enums.MarkerOperationMode.TeamManagement) {
                        _this.responseMode = _historyItem.team.responseMode;
                        _this.workListType = _historyItem.team.worklistType;
                        _this.remarkRequestType = _historyItem.team.remarkRequestType;
                        _this.emit(WorkListStore.WORKLIST_HISTORY_INFO_UPDATED, _historyItem, _markingMode);
                    }
                    break;
                case actionType.MARKING_CHECK_WORKLIST_ACCESS_ACTION:
                    var _getMarkingCheckWorklistAccessStatusAction = action;
                    _this._isMarkingCheckWorklistAccessPresent =
                        _getMarkingCheckWorklistAccessStatusAction.isMarkingCheckWorklistAccessPresent;
                    _this.emit(WorkListStore.MARKING_CHECK_WORKLIST_ACCESS_STATUS_UPDATED);
                    break;
                case actionType.POPUPDISPLAY_ACTION:
                    var popUpDisplayAction = action;
                    var popupType = popUpDisplayAction.getPopUpType;
                    var popupActionType = popUpDisplayAction.getPopUpActionType;
                    var navigatingFrom = popUpDisplayAction.navigateFrom;
                    var popUpData = popUpDisplayAction.getPopUpData;
                    _this.emit(WorkListStore.NO_MARKING_CHECK_AVAILABLE_MESSAGE, popupType, popupActionType, popUpData);
                    break;
                case actionType.WORKLIST_FILTER_SELECTED:
                    var seedFilterAction = action;
                    _this.updateFilterStatus(seedFilterAction.getExaminerRoleId, seedFilterAction.getSelectedFilter);
                    _this.setFilteredResponses(_this.liveClosedWorklistDetails, seedFilterAction.getExaminerRoleId);
                    _this.emit(WorkListStore.WORKLIST_FILTER_CHANGED, seedFilterAction.getSelectedFilter);
                    break;
                case actionType.MARKING_CHECK_EXAMINER_WORKLIST_GET:
                    var markingCheckWorklistFetchAction = action;
                    _this.updateMarkingCheckSelectedExaminer(markingCheckWorklistFetchAction.examinerId);
                    _this.emit(WorkListStore.MARKING_CHECK_EXAMINER_SELECTION_UPDATED);
                    break;
                case actionType.GET_MARK_CHECK_EXAMINERS:
                    var _getMarkingCheckExaminersAction = action;
                    if (_getMarkingCheckExaminersAction.success &&
                        _getMarkingCheckExaminersAction.markCheckExaminersData) {
                        var markingCheckExaminersData = void 0;
                        markingCheckExaminersData = _getMarkingCheckExaminersAction.markCheckExaminersData;
                        if (markingCheckExaminersData.markCheckRequestedExaminersDetails &&
                            markingCheckExaminersData.markCheckRequestedExaminersDetails.length > 0) {
                            _this._sortedMarkingCheckExaminerList = Immutable.List(sortHelper.sort(markingCheckExaminersData.markCheckRequestedExaminersDetails, comparerList.MarkCheckExaminersComparer));
                            _this._sortedMarkingCheckExaminerList.first().isSelected = true;
                            _this._isMarkingCheckMode = true;
                            _this.workListType = enums.WorklistType.live;
                        }
                        else {
                            _this._sortedMarkingCheckExaminerList = undefined;
                            _this._isMarkingCheckMode = false;
                        }
                        _this.emit(WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED);
                    }
                    break;
                case actionType.TOGGLE_MARKING_CHECK_MODE:
                    var _markingCheckModeToggleAction = action;
                    _this._isMarkingCheckMode = _markingCheckModeToggleAction.MarkingCheckModeValue;
                    break;
                case actionType.TOGGLE_REQUEST_MARKING_CHECK_BUTTON_ACTION:
                    _this.emit(WorkListStore.TOGGLE_REQUEST_MARKING_CHECK_BUTTON_EVENT);
                    break;
                case actionType.TEAM_MANAGEMENT_HISTORY_INFO_ACTION:
                    var _setTeamManagementHistoryInfoAction = action;
                    if (_setTeamManagementHistoryInfoAction.markingMode === enums.MarkerOperationMode.TeamManagement) {
                        _this.responseMode = _setTeamManagementHistoryInfoAction.historyItem.team.responseMode;
                        _this.workListType = _setTeamManagementHistoryInfoAction.historyItem.team.worklistType;
                        _this.remarkRequestType = _setTeamManagementHistoryInfoAction.historyItem.team.remarkRequestType;
                    }
                    break;
                case actionType.REJECT_RIG_REMOVE_RESPONSE_ACTION:
                    var updateResponseAction_1 = action;
                    _this.clearResponseDetailsByMarkGroupId(updateResponseAction_1.markGroupID, updateResponseAction_1.worklistType);
                    break;
                case actionType.MARKING_CHECK_COMPLETE_ACTION:
                    _this.emit(WorkListStore.MARKING_CHECK_COMPLETE_BUTTON_EVENT);
                    break;
                case actionType.SET_REMEMBER_QIG:
                    var _setRememberQigAction = action;
                    _this.workListType = _setRememberQigAction.rememberQig.worklistType;
                    _this.remarkRequestType = _setRememberQigAction.rememberQig.remarkRequestType;
                    break;
                case actionType.PROMOTE_TO_SEED:
                    var promoteToSeedAction_1 = action;
                    if (promoteToSeedAction_1.promoteToSeedReturn.promoteToSeedError === enums.PromoteToSeedErrorCode.None
                        && _this.getResponseMode === enums.ResponseMode.closed) {
                        _this.updateResponseCollectionAfterPromoteSeed(promoteToSeedAction_1.promoteToSeedReturn.promotedSeedMarkGroupIds[0]);
                    }
                    break;
                case actionType.REMOVE_RESPONSE:
                    var removeResponseAction_1 = action;
                    _this.removeResponseFromWorklistDetails(removeResponseAction_1.worklistType, removeResponseAction_1.responseMode, removeResponseAction_1.displayId);
                    break;
                case actionType.TAG_UPDATE:
                    var tagUpdateAction_1 = action;
                    if (tagUpdateAction_1.success) {
                        _this.emit(WorkListStore.TAG_UPDATED_EVENT, tagUpdateAction_1.tagId, tagUpdateAction_1.markGroupId);
                        _this.updateTagId(tagUpdateAction_1.tagId, tagUpdateAction_1.tagOrder, tagUpdateAction_1.markGroupId);
                        _this.storageAdapterHelper.clearStorageArea('worklist');
                    }
                    break;
                case actionType.TAG_LIST_CLICK:
                    // Logic to hide any tag list which is expanded(other than the clicked one.)
                    var tagListClickAction_1 = action;
                    _this.emit(WorkListStore.TAG_LIST_CLICKED, tagListClickAction_1.markGroupId);
                    break;
                case actionType.SIMULATION_TARGET_COMPLETED:
                    _this.workListType = undefined;
                    _this.emit(WorkListStore.SIMULATION_TARGET_COMPLETED_EVENT);
                    break;
                case actionType.BACKGROUND_PULSE:
                    var backgroundPulse = action;
                    if (backgroundPulse.getNotificationData.getCoordinationCompleteBit && _this.allowBackGroundPulseEventEmission
                        && _this.workListType === enums.WorklistType.simulation) {
                        _this.emit(WorkListStore.STANDARDISATION_SETUP_COMPLETED_IN_BACKGROUND);
                        _this.allowBackGroundPulseEventEmission = false;
                    }
                    break;
                case actionType.PROMOTE_TO_REUSE_BUCKET_ACTION:
                    var promoteToReuseBucketAction = action;
                    if (_this.getResponseMode === enums.ResponseMode.closed && promoteToReuseBucketAction.isPromotedToReuseBucketSuccess) {
                        _this.updateResponseCollectionAfterPromoteReuseBucket(promoteToReuseBucketAction.markGroupId);
                    }
                    break;
                case actionType.GET_UNACTIONED_EXCEPTION_ACTION:
                    if (action.isFromResponse) {
                        _this.responseMode = undefined;
                        _this.workListType = undefined;
                    }
                    break;
                case actionType.UPDATE_EXCEPTION_STATUS:
                    var updatedExceptionStatus = action;
                    var exceptionActionType = updatedExceptionStatus.exceptionActionType;
                    if (updatedExceptionStatus.exceptionId !== undefined &&
                        (exceptionActionType === enums.ExceptionActionType.Close)) {
                        _this.updateResolvedExceptionCount(updatedExceptionStatus.displayId);
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
    WorkListStore.prototype.updateResponseCollectionAfterPromoteReuseBucket = function (selectedMarkGroupId) {
        if (this.workListType === enums.WorklistType.live) {
            this.liveClosedWorklistDetails.responses.find(function (x) {
                return x.markGroupId === selectedMarkGroupId;
            }).isPromotedToReuseBucket = true;
        }
        else if (this.workListType === enums.WorklistType.directedRemark) {
            this.directedRemarkClosedWorkList.responses.find(function (x) {
                return x.markGroupId === selectedMarkGroupId;
            }).isPromotedToReuseBucket = true;
        }
        else if (this.workListType === enums.WorklistType.pooledRemark) {
            this.pooledRemarkClosedWorkList.responses.find(function (x) {
                return x.markGroupId === selectedMarkGroupId;
            }).isPromotedToReuseBucket = true;
        }
    };
    Object.defineProperty(WorkListStore.prototype, "getSelectedFilterDetails", {
        get: function () {
            return this._selectedFilterDetails;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set the Filtered Responses for closed
     * @param worklist
     * @param selectedExaminerRoleId
     */
    WorkListStore.prototype.setFilteredResponses = function (worklist, selectedExaminerRoleId) {
        var selectedFilter = this._selectedFilterDetails.get(selectedExaminerRoleId, enums.WorklistSeedFilter.All);
        var worklistBaseCloned = {
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
                worklistBaseCloned.responses = Immutable.List(worklist.responses.filter(function (x) {
                    return x.seedTypeId === enums.SeedType.Gold && x.reviewedById < 1;
                }));
                this.liveClosedFilteredWorklistDetails = worklistBaseCloned;
                break;
            case enums.WorklistSeedFilter.SeedsOnly:
                worklistBaseCloned.responses = Immutable.List(worklist.responses.filter(function (x) {
                    return x.seedTypeId === enums.SeedType.Gold;
                }));
                this.liveClosedFilteredWorklistDetails = worklistBaseCloned;
                break;
        }
    };
    /**
     * set the data for marking check popup
     * @param markingCheckRecipientList
     */
    WorkListStore.prototype.setMarkingCheckPopupData = function (markingCheckRecipientList) {
        if (markingCheckRecipientList && markingCheckRecipientList.length > 0) {
            for (var _i = 0, markingCheckRecipientList_1 = markingCheckRecipientList; _i < markingCheckRecipientList_1.length; _i++) {
                var marker = markingCheckRecipientList_1[_i];
                marker.fullname = WorkListStore.getFormattedExaminerName(marker.initials, marker.surname);
                marker.isChecked = false;
            }
            this._markingCheckRecipientList = Immutable.List(sortHelper.sort(markingCheckRecipientList, comparerList.examinerDataComparer));
        }
    };
    /**
     * Returns the formatted examiner name
     * @param initials
     * @param surname
     */
    WorkListStore.getFormattedExaminerName = function (initials, surname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    /**
     * Updates the reviewed details for the response
     * @param reviewedResponse
     */
    WorkListStore.prototype.setCurrentResponseAsReviewed = function (reviewedResponse) {
        if (reviewedResponse.reviewResponseResult === enums.SetAsReviewResult.Success ||
            reviewedResponse.reviewResponseResult === enums.SetAsReviewResult.AlreadyReviewedBySomeone) {
            var currentWorklistResponseBaseDetails = this.getCurrentWorklistResponseBaseDetails().filter(function (response) {
                return response.markGroupId === reviewedResponse.markGroupId;
            }).first();
            currentWorklistResponseBaseDetails.isReviewed = true;
            currentWorklistResponseBaseDetails.setAsReviewedCommentId = reviewedResponse.setAsReviewedCommentId;
        }
    };
    /**
     * Updates the supervisor sampled details for the response
     * @param supervisorSamplingCommentReturn
     */
    WorkListStore.prototype.setCurrentResponseAsSampled = function (supervisorSamplingCommentReturn, displayId) {
        var _currentResponse = this.getCurrentWorklistResponseBaseDetails().filter(function (response) {
            return response.displayId === displayId.toString();
        }).first();
        if (supervisorSamplingCommentReturn.success && _currentResponse) {
            _currentResponse.sampleReviewCommentId = supervisorSamplingCommentReturn.updatedSamplingCommentId;
            _currentResponse.sampleReviewCommentCreatedBy = supervisorSamplingCommentReturn.supervisorCommentCreatedBy;
        }
    };
    /**
     * set worklist details
     * @param worklistDetails
     */
    WorkListStore.prototype.setWorklistDetails = function (worklistDetails, selectedExaminerRoleId) {
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
    };
    /**
     * set default sort order
     * @param worklistType
     * @param responseMode
     */
    WorkListStore.prototype.setDefaultSortOrder = function (worklistType, responseMode) {
        if (worklistType === enums.WorklistType.practice
            || worklistType === enums.WorklistType.standardisation
            || worklistType === enums.WorklistType.secondstandardisation) {
            return comparerlist.responseIdComparer; //"responseidcomparer";//Response ID (lowest first)
        }
        else if (worklistType === enums.WorklistType.live
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
    };
    /**
     * update Response Sort Collection with the default sort order.
     * @param worklistType
     * @param responseMode
     */
    WorkListStore.prototype.updateResponseSortCollection = function (worklistType, responseMode, remarkRequestType, markSchemeGroupId) {
        var defaultSortDetail = this.setDefaultSortOrder(worklistType, responseMode);
        var sortDetails = {
            worklistType: worklistType,
            responseMode: responseMode,
            qig: markSchemeGroupId,
            comparerName: defaultSortDetail,
            sortDirection: (defaultSortDetail === comparerlist.submittedDateComparer) ?
                enums.SortDirection.Descending : enums.SortDirection.Ascending,
            remarkRequestType: remarkRequestType
        };
        var entry = this._responseSortDetails.filter(function (x) {
            return x.worklistType === worklistType && x.responseMode === responseMode
                && x.qig === markSchemeGroupId && x.remarkRequestType === remarkRequestType;
        });
        if (entry.length === 0) {
            this._responseSortDetails.push(sortDetails);
        }
    };
    /**
     * set live worklist details
     * @param worklistDetails
     */
    WorkListStore.prototype.setLiveWorklistDetails = function (worklistDetails, selectedExaminerRoleId) {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.liveOpenWorklistDetails = worklistDetails;
                break;
            case enums.ResponseMode.closed:
                this.liveClosedWorklistDetails = worklistDetails;
                this.setFilteredResponses(this.liveClosedWorklistDetails, selectedExaminerRoleId);
                break;
            case enums.ResponseMode.pending:
                this.pendingWorkListDetails = worklistDetails;
                break;
        }
    };
    /**
     * set simulation worklist details
     * @param worklistDetails
     */
    WorkListStore.prototype.setSimulationWorklistDetails = function (worklistDetails) {
        this.simulationOpenWorklistDetails = worklistDetails;
    };
    /**
     * set atypical worklist details
     * @param worklistDetails
     */
    WorkListStore.prototype.setAtypicalWorklistDetails = function (worklistDetails) {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.atypicalOpenWorklistDetails = worklistDetails;
                break;
            case enums.ResponseMode.closed:
                this.atypicalClosedWorklistDetails = worklistDetails;
                break;
            case enums.ResponseMode.pending:
                this.atypicalPendingWorklistDetails = worklistDetails;
                break;
        }
    };
    /**
     * Set practice worklist details.
     * @param {WorklistBase} workListDetails
     */
    WorkListStore.prototype.setPracticeWorkListDetails = function (workListDetails) {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.practiceOpenWorkList = workListDetails;
                break;
            case enums.ResponseMode.closed:
                this.practiceClosedWorkList = workListDetails;
                break;
        }
    };
    /**
     * set standardisation worklist details
     * @param worklistDetails
     */
    WorkListStore.prototype.setStandardisationWorklistDetails = function (worklistDetails) {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.standardisationOpenWorklistDetails =
                    worklistDetails;
                break;
            case enums.ResponseMode.closed:
                this.standardisationClosedWorklistDetails =
                    worklistDetails;
                break;
        }
    };
    /**
     * set second standardisation worklist details
     * @param worklistDetails
     */
    WorkListStore.prototype.setSecondStandardisationWorklistDetails = function (worklistDetails) {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.secondStandardisationOpenWorklistDetails =
                    worklistDetails;
                break;
            case enums.ResponseMode.closed:
                this.secondStandardisationClosedWorklistDetails =
                    worklistDetails;
                break;
        }
    };
    /**
     * Set directed remark worklist details.
     * @param {WorklistBase} workListDetails
     */
    WorkListStore.prototype.setDirectedRemarkListDetails = function (workListDetails) {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.directedRemarkOpenWorkList = workListDetails;
                break;
            case enums.ResponseMode.closed:
                this.directedRemarkClosedWorkList = workListDetails;
                break;
            case enums.ResponseMode.pending:
                this.directedRemarkPendingWorklist = workListDetails;
                break;
        }
    };
    /**
     * Set pooled remark worklist details.
     * @param {WorklistBase} workListDetails
     */
    WorkListStore.prototype.setPooledRemarkListDetails = function (workListDetails) {
        switch (this.getResponseMode) {
            case enums.ResponseMode.open:
                this.pooledRemarkOpenWorkList = workListDetails;
                break;
            case enums.ResponseMode.closed:
                this.pooledRemarkClosedWorkList = workListDetails;
                break;
            case enums.ResponseMode.pending:
                this.pooledRemarkPendingWorklist = workListDetails;
                break;
        }
    };
    Object.defineProperty(WorkListStore.prototype, "currentWorklistType", {
        /**
         * Returns the marking mode
         * @returns
         */
        get: function () {
            return this.workListType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getResponseMode", {
        /**
         * Returns the response mode
         * @returns
         */
        get: function () {
            if (this.isMarkingCheckMode) {
                return this._markingCheckResponseMode;
            }
            else {
                return this.responseMode;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "markingCheckStatus", {
        /**
         * Gets the current marking check status
         */
        get: function () {
            return this._markingCheckStatus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "markingCheckRecipientList", {
        /**
         * Get the list of recipients to whom marking check operation is done and their details
         */
        get: function () {
            return this._markingCheckRecipientList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "isMarkingCheckAvailable", {
        /**
         * Get a value indicating whether marking check is available
         */
        get: function () {
            return this._isMarkingCheckAvailable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getRemarkRequestType", {
        /**
         * Returns the remark request type
         * @returns
         */
        get: function () {
            return this.remarkRequestType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getLiveOpenWorklistDetails", {
        /**
         * Returns the live open worklist details
         * @returns
         */
        get: function () {
            return this.liveOpenWorklistDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getSimulationOpenWorklistDetails", {
        /**
         * Returns the simulation open worklist details
         * @returns
         */
        get: function () {
            return this.simulationOpenWorklistDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getLivePendingWorklistDetails", {
        /**
         * Returns the live pending worklist details
         * @returns
         */
        get: function () {
            return this.pendingWorkListDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getAtypicalOpenWorklistDetails", {
        /**
         * Returns the atypical open worklist details
         * @returns
         */
        get: function () {
            return this.atypicalOpenWorklistDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getAtypicalPendingWorklistDetails", {
        /**
         * Returns the atypical pending worklist details
         * @returns
         */
        get: function () {
            return this.atypicalPendingWorklistDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getAtypicalClosedWorklistDetails", {
        /**
         * Returns the atypical closed worklist details
         * @returns
         */
        get: function () {
            return this.atypicalClosedWorklistDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getSuccess", {
        /**
         * Returns whether the call was success or not
         * @returns
         */
        get: function () {
            return this.isSuccess;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getLiveClosedWorklistDetails", {
        /**
         * Returns the live closed worklist details
         * @returns
         */
        get: function () {
            return this.liveClosedFilteredWorklistDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getIsResponseClose", {
        /**
         * Returns the response mode
         * @returns
         */
        get: function () {
            return this.isResponseClose;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Find the Response details for the display id
     * @param displayID
     */
    WorkListStore.prototype.getResponseDetails = function (displayID) {
        // Check the display Id exists in the list
        if (this.getCurrentWorklistResponseBaseDetails()) {
            var response = this.getCurrentWorklistResponseBaseDetails().filter(function (response) { return response.displayId === displayID; });
            if (response != null && response !== undefined && response.count() === 1) {
                // If response is found in collection, return the base values.
                return response.first();
            }
        }
        // no data found for the disply id.
        return null;
    };
    /**
     * Find the Response details for the mark group Id
     * @param markGroupId
     */
    WorkListStore.prototype.getResponseDetailsByMarkGroupId = function (markGroupId) {
        // Check the mark group Id exists in the list
        var response = this.getCurrentWorklistResponseBaseDetails().filter(function (response) { return response.markGroupId === markGroupId; });
        if (response != null && response !== undefined && response.count() === 1) {
            // If response is found in collection, return the base values.
            return response.first();
        }
        // no data found for the mark group id.
        return null;
    };
    Object.defineProperty(WorkListStore.prototype, "getSecondStandardisationOpenWorklistDetails", {
        /**
         * Returns the standardisation open worklist details
         */
        get: function () {
            return this.secondStandardisationOpenWorklistDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getSecondStandardisationClosedWorklistDetails", {
        /**
         * Returns the standardisation closed worklist details
         */
        get: function () {
            return this.secondStandardisationClosedWorklistDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getStandardisationOpenWorklistDetails", {
        /**
         * Returns the standardisation open worklist details
         */
        get: function () {
            return this.standardisationOpenWorklistDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getStandardisationClosedWorklistDetails", {
        /**
         * Returns the standardisation closed worklist details
         */
        get: function () {
            return this.standardisationClosedWorklistDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getPracticeOpenWorklistDetails", {
        /**
         * Returns the practice open worklist details
         * @returns
         */
        get: function () {
            return this.practiceOpenWorkList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getPracticeClosedWorklistDetails", {
        /**
         * Returns the live closed worklist details
         * @returns
         */
        get: function () {
            return this.practiceClosedWorkList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getDirectedRemarkOpenWorklistDetails", {
        /**
         * Returns the directed remark open worklist details
         * @returns
         */
        get: function () {
            return this.directedRemarkOpenWorkList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getDirectedRemarkClosedWorklistDetails", {
        /**
         * Returns the directed remark closed worklist details
         * @returns
         */
        get: function () {
            return this.directedRemarkClosedWorkList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getDirectedRemarkPendingWorklistDetails", {
        /**
         * Returns the directed remark pending worklist data
         */
        get: function () {
            return this.directedRemarkPendingWorklist;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getPooledRemarkOpenWorklistDetails", {
        /**
         * Returns the pooled remark open worklist details
         * @returns
         */
        get: function () {
            return this.pooledRemarkOpenWorkList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getPooledRemarkClosedWorklistDetails", {
        /**
         * Returns the pooled remark closed worklist details
         * @returns
         */
        get: function () {
            return this.pooledRemarkClosedWorkList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getPooledRemarkPendingWorklistDetails", {
        /**
         * Returns the pooled remark pending worklist data
         */
        get: function () {
            return this.pooledRemarkPendingWorklist;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the current worklists Response details in sorted order.
     * @param worklistDetails
     */
    WorkListStore.prototype.getCurrentWorklistResponseBaseDetailsInSortOrder = function () {
        var workListDetails = this.getWorklistDetails(this.workListType, this.getResponseMode);
        if (workListDetails !== undefined) {
            this.setDefaultComparer();
            var _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';
            // Prevent sorting of worklist response collection if comparer is "Tag" from the response screen.
            if (this.isSortingRequired()) {
                workListDetails.responses = Immutable.List(sortHelper.sort(workListDetails.responses.toArray(), comparerList[_comparerName]));
            }
            return workListDetails ? workListDetails.responses : undefined;
        }
    };
    /**
     * Check whether sorting required for this current comparer.
     */
    WorkListStore.prototype.isSortingRequired = function () {
        return this.comparerName !== comparerlist[comparerList.tagComparer];
    };
    /**
     * Get the current worklists Response details
     * @param worklistDetails
     */
    WorkListStore.prototype.getCurrentWorklistResponseBaseDetails = function () {
        var workListDetails = this.getWorklistDetails(this.workListType, this.getResponseMode);
        return workListDetails ? workListDetails.responses : undefined;
    };
    /**
     * Get the related markGroupIds for a whole response
     * @param currentMarkGroupId : returns related mgIds of the currentMarkGroupId
     */
    WorkListStore.prototype.getRelatedMarkGroupIdsForWholeResponse = function (currentMarkGroupId) {
        var currentResponse;
        var relatedRIGDetails;
        var markGroupIds = [];
        var currentWorklistResponseDetails = this.getCurrentWorklistResponseBaseDetails();
        if (currentWorklistResponseDetails) {
            currentResponse = currentWorklistResponseDetails.filter(function (x) { return x.markGroupId === currentMarkGroupId; }).first();
            if (currentResponse && currentResponse.relatedRIGDetails) {
                currentResponse.relatedRIGDetails.map(function (x) {
                    markGroupIds.push(x.markGroupId);
                });
            }
        }
        return markGroupIds;
    };
    /**
     * Set the comparer for the current worklist based on the worklisttype,qigId and responseMode
     */
    WorkListStore.prototype.setDefaultComparer = function () {
        var _this = this;
        this._comparerName = undefined;
        this._sortDirection = undefined;
        var defaultComparers = this.responseSortDetails;
        var worklistType = this.workListType;
        var responseMode = this.getResponseMode;
        var qigId = this._selectedQig.markSchemeGroupId;
        var entry = defaultComparers.filter(function (x) {
            return x.worklistType === worklistType && x.responseMode === responseMode
                && x.qig === qigId && x.remarkRequestType === _this.remarkRequestType;
        });
        if (entry.length > 0 && this.isSortingRequired()) {
            this._comparerName = comparerList[entry[0].comparerName];
            this._sortDirection = entry[0].sortDirection;
        }
    };
    /**
     * Gets the worklist details based on the worklist type and response mode
     * @param {enums.WorklistType} workListType
     * @param {enums.ResponseMode} responseMode
     * @returns worklist Details
     */
    WorkListStore.prototype.getWorklistDetails = function (workListType, responseMode) {
        var workListDetails;
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
    };
    Object.defineProperty(WorkListStore.prototype, "getCandidateScriptInfoCollection", {
        /**
         * Get candidate script info collection
         * @returns candidate script collection
         */
        get: function () {
            return this.candidateScriptInfoCollection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "setCandidateScriptInfoCollection", {
        /**
         * Set candidate script info collection
         * @param {Immutable.List<candidateScriptInfo>} candidateScriptInfo
         */
        set: function (candidateScriptInfo) {
            this.candidateScriptInfoCollection = candidateScriptInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "currentWorklistResponseCount", {
        /*
        * This will return the current worklist response count
        */
        get: function () {
            return this.getCurrentWorklistResponseBaseDetails().size;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To get the next response id
     * @param {string} displayId
     * @returns
     */
    WorkListStore.prototype.nextResponseId = function (displayId) {
        var position = this.getResponsePosition(displayId);
        var response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().toArray()[position];
        if (response != null) {
            return response.displayId;
        }
    };
    /**
     * To get the previous response id
     * @param {string} displayId
     * @returns
     */
    WorkListStore.prototype.previousResponseId = function (displayId) {
        var position = this.getResponsePosition(displayId);
        var response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().toArray()[position - 2];
        if (response != null) {
            return response.displayId;
        }
    };
    /**
     * Get response position based on responseId
     * @param displayId
     */
    WorkListStore.prototype.getResponsePosition = function (displayId) {
        var response = this.getCurrentWorklistResponseBaseDetails().find(function (x) { return x.displayId === displayId; });
        if (response != null || response !== undefined) {
            return this.getCurrentWorklistResponseBaseDetailsInSortOrder().indexOf(response) + 1;
        }
    };
    /**
     * This will check whether the next response is exists or not
     */
    WorkListStore.prototype.isNextResponseAvailable = function (displayId) {
        return this.getResponsePosition(displayId) < this.currentWorklistResponseCount;
    };
    /**
     * This will check whether the previous response is exists or not
     */
    WorkListStore.prototype.isPreviousResponseAvailable = function (displayId) {
        return this.getResponsePosition(displayId) > 1;
    };
    /**
     * This will check the response count difference with markingTargetsSummary collection
     * if any change found, update the collection accordingly. This check is for syncing
     * the response count across the application
     * @returns
     */
    WorkListStore.prototype.getExaminerMarkingTargetProgress = function (isSelectedExaminerSTM) {
        var responseCount;
        var isChanged = false;
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
        }
        else if ((this.workListType === enums.WorklistType.live) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.liveClosedWorklistDetails !== undefined)
            && (this.liveClosedWorklistDetails.responses !== undefined)) {
            if (ccValues.examinerCentreExclusivity && isSelectedExaminerSTM) {
                responseCount = this.liveClosedWorklistDetails.responses.filter(function (x) { return ((x.isPromotedSeed && !x.isCurrentMarkGroupPromotedAsSeed) || !x.hasDefinitiveMarks); }).count();
            }
            else {
                responseCount = this.liveClosedWorklistDetails.responses.count();
            }
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount, true);
        }
        else if ((this.workListType === enums.WorklistType.live) && (this.getResponseMode === enums.ResponseMode.pending)
            && (this.pendingWorkListDetails !== undefined)
            && (this.pendingWorkListDetails.responses !== undefined)) {
            responseCount = this.pendingWorkListDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.pending, responseCount, true);
        }
        else if ((this.workListType === enums.WorklistType.atypical) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.atypicalOpenWorklistDetails !== undefined) && (this.atypicalOpenWorklistDetails.responses !== undefined)) {
            responseCount = this.atypicalOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount, true);
        }
        else if ((this.workListType === enums.WorklistType.atypical) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.atypicalClosedWorklistDetails !== undefined)
            && (this.atypicalClosedWorklistDetails.responses !== undefined)) {
            responseCount = this.atypicalClosedWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount, true);
        }
        else if ((this.workListType === enums.WorklistType.atypical) && (this.getResponseMode === enums.ResponseMode.pending)
            && (this.atypicalPendingWorklistDetails !== undefined)
            && (this.atypicalPendingWorklistDetails.responses !== undefined)) {
            responseCount = this.atypicalPendingWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.pending, responseCount, true);
        }
        else if ((this.workListType === enums.WorklistType.practice) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.practiceOpenWorkList !== undefined)
            && (this.practiceOpenWorkList.responses !== undefined)) {
            responseCount = this.practiceOpenWorkList.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount);
        }
        else if ((this.workListType === enums.WorklistType.practice) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.practiceClosedWorkList !== undefined)
            && (this.practiceClosedWorkList.responses !== undefined)) {
            responseCount = this.practiceClosedWorkList.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount);
        }
        else if ((this.workListType === enums.WorklistType.standardisation) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.standardisationOpenWorklistDetails !== undefined)
            && (this.standardisationOpenWorklistDetails.responses !== undefined)) {
            responseCount = this.standardisationOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount);
        }
        else if ((this.workListType === enums.WorklistType.standardisation) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.standardisationClosedWorklistDetails !== undefined)
            && (this.standardisationClosedWorklistDetails.responses !== undefined)) {
            responseCount = this.standardisationClosedWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount);
        }
        else if ((this.workListType === enums.WorklistType.secondstandardisation) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.secondStandardisationOpenWorklistDetails !== undefined)
            && (this.secondStandardisationOpenWorklistDetails.responses !== undefined)) {
            responseCount = this.secondStandardisationOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount);
        }
        else if ((this.workListType === enums.WorklistType.secondstandardisation) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.secondStandardisationClosedWorklistDetails !== undefined)
            && (this.secondStandardisationClosedWorklistDetails.responses !== undefined)) {
            responseCount = this.secondStandardisationClosedWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount);
        }
        else if ((this.workListType === enums.WorklistType.directedRemark) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.getDirectedRemarkOpenWorklistDetails !== undefined
                && (this.getDirectedRemarkOpenWorklistDetails.responses !== undefined))) {
            responseCount = this.getDirectedRemarkOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount, true);
        }
        else if ((this.workListType === enums.WorklistType.directedRemark) && (this.getResponseMode === enums.ResponseMode.pending)
            && (this.getDirectedRemarkPendingWorklistDetails !== undefined
                && (this.getDirectedRemarkPendingWorklistDetails.responses !== undefined))) {
            responseCount = this.getDirectedRemarkPendingWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.pending, responseCount, true);
        }
        else if ((this.workListType === enums.WorklistType.directedRemark) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.getDirectedRemarkClosedWorklistDetails !== undefined
                && (this.getDirectedRemarkClosedWorklistDetails.responses !== undefined))) {
            responseCount = this.getDirectedRemarkClosedWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount, true);
        }
        else if ((this.workListType === enums.WorklistType.pooledRemark) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.getPooledRemarkOpenWorklistDetails !== undefined
                && (this.getPooledRemarkOpenWorklistDetails.responses !== undefined))) {
            responseCount = this.getPooledRemarkOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount, true);
        }
        else if ((this.workListType === enums.WorklistType.pooledRemark) && (this.getResponseMode === enums.ResponseMode.pending)
            && (this.getPooledRemarkPendingWorklistDetails !== undefined
                && (this.getPooledRemarkPendingWorklistDetails.responses !== undefined))) {
            responseCount = this.getPooledRemarkPendingWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.pending, responseCount, true);
        }
        else if ((this.workListType === enums.WorklistType.pooledRemark) && (this.getResponseMode === enums.ResponseMode.closed)
            && (this.getPooledRemarkClosedWorklistDetails !== undefined
                && (this.getPooledRemarkClosedWorklistDetails.responses !== undefined))) {
            responseCount = this.getPooledRemarkClosedWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.closed, responseCount, true);
        }
        else if ((this.workListType === enums.WorklistType.simulation) && (this.getResponseMode === enums.ResponseMode.open)
            && (this.simulationOpenWorklistDetails !== undefined) && (this.simulationOpenWorklistDetails.responses !== undefined)) {
            responseCount = this.simulationOpenWorklistDetails.responses.count();
            this.updateMarkingTargetsSummary(enums.ResponseMode.open, responseCount, true);
        }
        return this.markingTargetsSummary;
    };
    /**
     * This will check for any difference in markingTargetsSummary count with responses in corresponding worklist
     * any mismatch found, it will update with response count in worklist.
     * @param {enums.ResponseMode} responseMode
     * @param responseCount
     * @returns
     */
    WorkListStore.prototype.updateMarkingTargetsSummary = function (responseMode, responseCount, doNotify) {
        var _this = this;
        if (doNotify === void 0) { doNotify = false; }
        var isChanged = false;
        var targetSummary = this.markingTargetsSummary.
            filter(function (x) { return x.remarkRequestTypeID === _this.remarkRequestType
            && x.markingModeID === _this.getMarkingModeByWorkListType(_this.workListType); }).first();
        if (this.workListType === enums.WorklistType.atypical) {
            var progress = targetSummary.examinerProgress ? targetSummary.examinerProgress : null;
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
        }
        else {
            var progress = targetSummary.examinerProgress ? targetSummary.examinerProgress : null;
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
    };
    /**
     * returns the worklist type based on the marking mode
     */
    WorkListStore.prototype.getMarkingModeByWorkListType = function (workListType) {
        var markingMode;
        /* set the worklist type from  the marking mode */
        switch (workListType) {
            case enums.WorklistType.atypical:
            case enums.WorklistType.live:
                markingMode = enums.MarkingMode.LiveMarking;
                break;
            case enums.WorklistType.practice:
                markingMode = enums.MarkingMode.Practice;
                break;
            case enums.WorklistType.standardisation:
                markingMode = enums.MarkingMode.Approval;
                break;
            case enums.WorklistType.secondstandardisation:
                markingMode = enums.MarkingMode.ES_TeamApproval;
                break;
            case enums.WorklistType.directedRemark:
                markingMode = enums.MarkingMode.Remarking;
                break;
            case enums.WorklistType.pooledRemark:
                markingMode = enums.MarkingMode.Remarking;
                break;
            case enums.WorklistType.simulation:
                markingMode = enums.MarkingMode.Simulation;
                break;
        }
        return markingMode;
    };
    /**
     * check whether a response in grace period or not
     * @param markGroupId
     */
    WorkListStore.prototype.isResponseInGracePeriod = function (markGroupId) {
        var pendingWorklists = this.getLivePendingWorklistDetails;
        if (pendingWorklists) {
            var filteredPendingWorklist = pendingWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
            return filteredPendingWorklist ? filteredPendingWorklist.size > 0 : false;
        }
        return false;
    };
    /**
     * retrieve the base colour for directed remark and pooled remark
     * @param markGroupId
     * @param responseMode
     */
    WorkListStore.prototype.getRemarkBaseColour = function (markGroupId, responseMode, worklistType) {
        var color = null;
        if (worklistType === enums.WorklistType.directedRemark) {
            var filteredDirectedWorklist = void 0;
            switch (responseMode) {
                case enums.ResponseMode.open:
                    var directedOpenWorklists = this.getDirectedRemarkOpenWorklistDetails;
                    if (directedOpenWorklists) {
                        filteredDirectedWorklist = directedOpenWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                    }
                    break;
                case enums.ResponseMode.pending:
                    var directedPendingWorklists = this.getDirectedRemarkPendingWorklistDetails;
                    if (directedPendingWorklists) {
                        filteredDirectedWorklist = directedPendingWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                    }
                    break;
            }
            color = (filteredDirectedWorklist) ? filteredDirectedWorklist.first().baseColor : null;
        }
        else if (worklistType === enums.WorklistType.pooledRemark) {
            var filteredpooledWorklist = void 0;
            switch (responseMode) {
                case enums.ResponseMode.open:
                    var pooledOpenWorklists = this.getPooledRemarkOpenWorklistDetails;
                    if (pooledOpenWorklists) {
                        filteredpooledWorklist = pooledOpenWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                    }
                    break;
                case enums.ResponseMode.pending:
                    var pooledPendingWorklists = this.getPooledRemarkPendingWorklistDetails;
                    if (pooledPendingWorklists) {
                        filteredpooledWorklist = pooledPendingWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                    }
                    break;
            }
            color = (filteredpooledWorklist) ? filteredpooledWorklist.first().baseColor : null;
        }
        return color;
    };
    /**
     * retrieve the base colour for directed remark
     * @param markGroupId
     * @param responseMode
     */
    WorkListStore.prototype.isMarkChangeReasonVisible = function (markGroupId, responseMode) {
        if (this.currentWorklistType === enums.WorklistType.directedRemark) {
            switch (responseMode) {
                case enums.ResponseMode.open:
                    var directedOpenWorklists = this.getDirectedRemarkOpenWorklistDetails;
                    if (directedOpenWorklists) {
                        var filteredDirectedWorklist = directedOpenWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                        return filteredDirectedWorklist.first().markChangeReasonVisible;
                    }
                    break;
                case enums.ResponseMode.pending:
                    var directedPendingWorklists = this.getDirectedRemarkPendingWorklistDetails;
                    if (directedPendingWorklists) {
                        var filteredDirectedWorklistPending = directedPendingWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                        return filteredDirectedWorklistPending.first().markChangeReasonVisible;
                    }
                    break;
                case enums.ResponseMode.closed:
                    var directedClosedWorklists = this.getDirectedRemarkClosedWorklistDetails;
                    if (directedClosedWorklists) {
                        var filteredDirectedWorklistClosed = directedClosedWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                        return filteredDirectedWorklistClosed.first().markChangeReasonVisible;
                    }
                    break;
            }
        }
        return null;
    };
    /**
     * To get the mark change reason
     * @param {number} markGroupId
     * @param {enums.ResponseMode} responseMode
     * @returns
     */
    WorkListStore.prototype.getMarkChangeReason = function (markGroupId, responseMode) {
        if (this.currentWorklistType === enums.WorklistType.directedRemark) {
            switch (responseMode) {
                case enums.ResponseMode.open:
                    var directedOpenWorklists = this.getDirectedRemarkOpenWorklistDetails;
                    if (directedOpenWorklists) {
                        var filteredDirectedWorklistOpen = directedOpenWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                        return filteredDirectedWorklistOpen.first().markChangeReason;
                    }
                    break;
                case enums.ResponseMode.pending:
                    var directedPendingWorklists = this.getDirectedRemarkPendingWorklistDetails;
                    if (directedPendingWorklists) {
                        var filteredDirectedWorklistPending = directedPendingWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                        return filteredDirectedWorklistPending.first().markChangeReason;
                    }
                    break;
                case enums.ResponseMode.closed:
                    var directedClosedWorklists = this.getDirectedRemarkClosedWorklistDetails;
                    if (directedClosedWorklists) {
                        var filteredDirectedWorklistClosed = directedClosedWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                        return filteredDirectedWorklistClosed.first().markChangeReason;
                    }
                    break;
            }
        }
        return null;
    };
    /**
     * To get the supervisor remark decision details
     * @param {number} markGroupId
     * @param {enums.ResponseMode} responseMode
     * @returns
     */
    WorkListStore.prototype.getSupervisorRemarkDecision = function (markGroupId, responseMode) {
        if (this.currentWorklistType === enums.WorklistType.directedRemark) {
            switch (responseMode) {
                case enums.ResponseMode.open:
                    var directedOpenWorkLists = this.getDirectedRemarkOpenWorklistDetails;
                    if (directedOpenWorkLists) {
                        var filteredDirectedWorklistOpen = directedOpenWorkLists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                        var _supervisorRemarkDecision = new supervisorRemarkDecision;
                        _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = filteredDirectedWorklistOpen.first().
                            supervisorRemarkMarkChangeReasonID;
                        _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = filteredDirectedWorklistOpen.first().
                            supervisorRemarkFinalMarkSetID;
                        _supervisorRemarkDecision.isSRDReasonUpdated = false;
                        return _supervisorRemarkDecision;
                    }
                    break;
                case enums.ResponseMode.pending:
                    var directedPendingWorklists = this.getDirectedRemarkPendingWorklistDetails;
                    if (directedPendingWorklists) {
                        var filteredDirectedWorklistPending = directedPendingWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                        var _supervisorRemarkDecision = new supervisorRemarkDecision;
                        _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = filteredDirectedWorklistPending.first().
                            supervisorRemarkFinalMarkSetID;
                        _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = filteredDirectedWorklistPending.first().
                            supervisorRemarkMarkChangeReasonID;
                        _supervisorRemarkDecision.isSRDReasonUpdated = false;
                        return _supervisorRemarkDecision;
                    }
                    break;
                case enums.ResponseMode.closed:
                    var directedRemarkClosedWorklists = this.getDirectedRemarkClosedWorklistDetails;
                    if (directedRemarkClosedWorklists) {
                        var filteredDirectedRemarkWorklistClosed = directedRemarkClosedWorklists.responses.filter(function (x) { return x.markGroupId === markGroupId; });
                        var _supervisorRemarkDecision = new supervisorRemarkDecision;
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
    };
    /**
     * get the tag id of given response
     * @param displayId
     */
    WorkListStore.prototype.getTagId = function (displayId) {
        var tagId = 0;
        //Tag should not be visible when in marking check mode.
        if (this.isMarkingCheckMode) {
            return undefined;
        }
        switch (this.currentWorklistType) {
            case enums.WorklistType.live:
                switch (this.responseMode) {
                    case enums.ResponseMode.open:
                        tagId = this.liveOpenWorklistDetails.responses.
                            filter(function (item) { return item.displayId === displayId; }).first().tagId;
                        break;
                    case enums.ResponseMode.pending:
                        tagId = this.pendingWorkListDetails.responses.
                            filter(function (item) { return item.displayId === displayId; }).first().tagId;
                        break;
                    case enums.ResponseMode.closed:
                        tagId = this.liveClosedWorklistDetails.responses.
                            filter(function (item) { return item.displayId === displayId; }).first().tagId;
                        break;
                }
                break;
            case enums.WorklistType.directedRemark:
                switch (this.responseMode) {
                    case enums.ResponseMode.open:
                        tagId = this.directedRemarkOpenWorkList.responses.
                            filter(function (item) { return item.displayId === displayId; }).first().tagId;
                        break;
                    case enums.ResponseMode.pending:
                        tagId = this.directedRemarkPendingWorklist.responses.
                            filter(function (item) { return item.displayId === displayId; }).first().tagId;
                        break;
                    case enums.ResponseMode.closed:
                        tagId = this.directedRemarkClosedWorkList.responses.
                            filter(function (item) { return item.displayId === displayId; }).first().tagId;
                        break;
                }
                break;
            case enums.WorklistType.pooledRemark:
                switch (this.responseMode) {
                    case enums.ResponseMode.open:
                        tagId = this.pooledRemarkOpenWorkList.responses.
                            filter(function (item) { return item.displayId === displayId; }).first().tagId;
                        break;
                    case enums.ResponseMode.pending:
                        tagId = this.pooledRemarkPendingWorklist.responses.
                            filter(function (item) { return item.displayId === displayId; }).first().tagId;
                        break;
                    case enums.ResponseMode.closed:
                        tagId = this.pooledRemarkClosedWorkList.responses.
                            filter(function (item) { return item.displayId === displayId; }).first().tagId;
                        break;
                }
                break;
            default:
                tagId = undefined;
        }
        return tagId;
    };
    Object.defineProperty(WorkListStore.prototype, "isMessageStatusChanged", {
        /**
         * Using this value we will reload worklist data for reflecting unread linked message details
         */
        get: function () {
            return this._isWorklistRefreshRequired;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "isExceptionStatusChanged", {
        /**
         * Using this value we will reload worklist data for reflecting exception status change
         * @returns isWorklistRefreshRequired
         */
        get: function () {
            return this._isWorklistRefreshRequired;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "responseSortDetails", {
        /**
         * retrieve the response sort details for all the worklist and response mode.
         * @returns responseSortDetails
         */
        get: function () {
            return this._responseSortDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "isDirectedRemark", {
        /**
         * get isDirectedRemark
         * @returns isDirectedRemark
         */
        get: function () {
            return this._isDirectedRemark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "selectedQuestionItemBIndex", {
        /* return the selected question item index */
        get: function () {
            return this._selectedQuestionItemBIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "selectedQuestionItemUniqueId", {
        /**
         * uniqueId for the selected Question
         */
        get: function () {
            return this._selectedQuestionItemUniqueId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "getIfOfFirstResponse", {
        /**
         * Get response position based on responseId
         * @param displayId
         */
        get: function () {
            var response = this.getCurrentWorklistResponseBaseDetails().first();
            if (response != null || response !== undefined) {
                return response.displayId;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "isLastNodeSelected", {
        get: function () {
            return this._isLastNodeSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "isMarkingCheckWorklistAccessPresent", {
        /**
         * The marking check worklist status
         * @returns
         */
        get: function () {
            return this._isMarkingCheckWorklistAccessPresent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "sortDirection", {
        /**
         * The sort direction
         * @returns
         */
        get: function () {
            return this._sortDirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "comparerName", {
        /**
         * The comparerName
         * @returns
         */
        get: function () {
            return this._comparerName;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Remove a particular response item from local collection
     * @param {enums.WorklistType} workListType
     * @param {enums.ResponseMode} responseMode
     * @param {string} displayId
     * @returns worklist Details
     */
    WorkListStore.prototype.removeResponseFromWorklistDetails = function (workListType, responseMode, displayId) {
        var response;
        var indexOfResponse;
        switch (workListType) {
            case enums.WorklistType.live:
                switch (responseMode) {
                    case enums.ResponseMode.closed:
                        response = this.liveClosedWorklistDetails.responses.find(function (x) { return x.displayId === displayId; });
                        indexOfResponse = this.liveClosedWorklistDetails.responses.indexOf(response);
                        this.liveClosedWorklistDetails.responses = this.liveClosedWorklistDetails.responses.remove(indexOfResponse);
                        break;
                    case enums.ResponseMode.pending:
                        response = this.pendingWorkListDetails.responses.find(function (x) { return x.displayId === displayId; });
                        indexOfResponse = this.pendingWorkListDetails.responses.indexOf(response);
                        this.pendingWorkListDetails.responses = this.pendingWorkListDetails.responses.remove(indexOfResponse);
                        break;
                }
                break;
            case enums.WorklistType.directedRemark:
                switch (responseMode) {
                    case enums.ResponseMode.closed:
                        response = this.directedRemarkClosedWorkList.responses.find(function (x) {
                            return x.displayId === displayId;
                        });
                        indexOfResponse = this.directedRemarkClosedWorkList.responses.indexOf(response);
                        this.directedRemarkClosedWorkList.responses = this.directedRemarkClosedWorkList.responses.remove(indexOfResponse);
                        break;
                    case enums.ResponseMode.pending:
                        response = this.directedRemarkPendingWorklist.responses.find(function (x) {
                            return x.displayId === displayId;
                        });
                        indexOfResponse = this.directedRemarkPendingWorklist.responses.indexOf(response);
                        this.directedRemarkPendingWorklist.responses = this.directedRemarkPendingWorklist.responses.remove(indexOfResponse);
                        break;
                }
                break;
            case enums.WorklistType.pooledRemark:
                switch (responseMode) {
                    case enums.ResponseMode.closed:
                        response =
                            this.pooledRemarkClosedWorkList.responses.find(function (x) { return x.displayId === displayId; });
                        indexOfResponse = this.pooledRemarkClosedWorkList.responses.indexOf(response);
                        this.pooledRemarkClosedWorkList.responses = this.pooledRemarkClosedWorkList.responses.remove(indexOfResponse);
                        break;
                    case enums.ResponseMode.pending:
                        response =
                            this.pooledRemarkPendingWorklist.responses.find(function (x) { return x.displayId === displayId; });
                        indexOfResponse = this.pooledRemarkPendingWorklist.responses.indexOf(response);
                        this.pooledRemarkPendingWorklist.responses = this.pooledRemarkPendingWorklist.responses.remove(indexOfResponse);
                        break;
                }
                break;
        }
    };
    /**
     * Update a all responses item under same candidatescriptid from local collection and set isPromotedSeed true
     * @param {enums.WorklistType} selectedMarkGroupId
     * @returns updated collection
     */
    WorkListStore.prototype.updateResponseCollectionAfterPromoteSeed = function (selectedMarkGroupId) {
        var candidateScriptID = 0;
        if (this.workListType === enums.WorklistType.live) {
            candidateScriptID =
                this.liveClosedWorklistDetails.responses.filter(function (item) { return item.markGroupId
                    === selectedMarkGroupId; }).get(0).candidateScriptId;
            this.liveClosedWorklistDetails.responses.map(function (x) {
                if ((x.candidateScriptId === candidateScriptID)) {
                    x.isPromotedSeed = true;
                }
            });
        }
        else if (this.workListType === enums.WorklistType.directedRemark) {
            candidateScriptID =
                this.directedRemarkClosedWorkList.responses.filter(function (item) { return item.markGroupId
                    === selectedMarkGroupId; }).get(0).candidateScriptId;
            this.directedRemarkClosedWorkList.responses.map(function (x) {
                if ((x.candidateScriptId === candidateScriptID)) {
                    x.isPromotedSeed = true;
                }
            });
        }
        else if (this.workListType === enums.WorklistType.pooledRemark) {
            candidateScriptID =
                this.pooledRemarkClosedWorkList.responses.filter(function (item) { return item.markGroupId
                    === selectedMarkGroupId; }).get(0).candidateScriptId;
            this.pooledRemarkClosedWorkList.responses.map(function (x) {
                if ((x.candidateScriptId === candidateScriptID)) {
                    x.isPromotedSeed = true;
                }
            });
        }
    };
    Object.defineProperty(WorkListStore.prototype, "isMarkingCheckMode", {
        /**
         * Returns a value indicating whether we are in MarkingCheckMode.
         */
        get: function () {
            return this._isMarkingCheckMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "selectedMarkingCheckExaminer", {
        /**
         * Fetches the currently selected examiner in marking check worklist
         */
        get: function () {
            return this._sortedMarkingCheckExaminerList.filter(function (examiner) { return examiner.isSelected; }).first();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "markingCheckExaminersList", {
        /**
         * Fetches the sorted marking check requesters examiner list
         */
        get: function () {
            return this._sortedMarkingCheckExaminerList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "markingCheckFailureCode", {
        /**
         * Get Marking Check Failure Code
         */
        get: function () {
            return this._markingCheckFailureCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkListStore.prototype, "hasSeedTargets", {
        /**
         * Returns whether we can promote a response as seed or not based on seed targets.
         */
        get: function () {
            var workListDetails = this.getWorklistDetails(this.workListType, this.getResponseMode);
            return workListDetails.hasSeedTargets;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * clear response from worklist collection
     * @param markGroupId
     * @param worklistType
     */
    WorkListStore.prototype.clearResponseDetailsByMarkGroupId = function (markGroupId, worklistType) {
        var index = 0;
        var responseCollection;
        switch (worklistType) {
            case enums.WorklistType.live:
                responseCollection = this.liveOpenWorklistDetails.responses;
                break;
            case enums.WorklistType.atypical:
                responseCollection = this.atypicalOpenWorklistDetails.responses;
                break;
        }
        //removing response from collection.
        responseCollection.map(function (response) {
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
    };
    /**
     * to update the worklist data with tag id once the tag is updated/deleted
     * @param displayId
     * @param tagId
     */
    WorkListStore.prototype.updateTagId = function (tagId, tagOrder, markGroupId) {
        switch (this.currentWorklistType) {
            case enums.WorklistType.live:
                switch (this.responseMode) {
                    case enums.ResponseMode.open:
                        this.liveOpenWorklistDetails.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagId = tagId;
                        this.liveOpenWorklistDetails.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagOrder = tagOrder;
                        break;
                    case enums.ResponseMode.pending:
                        this.pendingWorkListDetails.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagId = tagId;
                        this.pendingWorkListDetails.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagOrder = tagOrder;
                        break;
                    case enums.ResponseMode.closed:
                        this.liveClosedWorklistDetails.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagId = tagId;
                        this.liveClosedWorklistDetails.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagOrder = tagOrder;
                        break;
                }
                break;
            case enums.WorklistType.directedRemark:
                switch (this.responseMode) {
                    case enums.ResponseMode.open:
                        this.directedRemarkOpenWorkList.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagId = tagId;
                        this.directedRemarkOpenWorkList.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagOrder = tagOrder;
                        break;
                    case enums.ResponseMode.pending:
                        this.directedRemarkPendingWorklist.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagId = tagId;
                        this.directedRemarkPendingWorklist.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagOrder = tagOrder;
                        break;
                    case enums.ResponseMode.closed:
                        this.directedRemarkClosedWorkList.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagId = tagId;
                        this.directedRemarkClosedWorkList.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagOrder = tagOrder;
                        break;
                }
                break;
            case enums.WorklistType.pooledRemark:
                switch (this.responseMode) {
                    case enums.ResponseMode.open:
                        this.pooledRemarkOpenWorkList.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagId = tagId;
                        this.pooledRemarkOpenWorkList.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagOrder = tagOrder;
                        break;
                    case enums.ResponseMode.pending:
                        this.pooledRemarkPendingWorklist.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagId = tagId;
                        this.pooledRemarkPendingWorklist.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagOrder = tagOrder;
                        break;
                    case enums.ResponseMode.closed:
                        this.pooledRemarkClosedWorkList.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagId = tagId;
                        this.pooledRemarkClosedWorkList.responses.
                            filter(function (item) { return item.markGroupId === markGroupId; }).first().tagOrder = tagOrder;
                        break;
                }
                break;
        }
    };
    /**
     * Get the Display Id for the mark group
     * @param markGroupId
     */
    WorkListStore.prototype.displayIdOfMarkGroup = function (markGroupId) {
        var currentWorklistResponseBaseDetails = this.getCurrentWorklistResponseBaseDetails();
        var displayId;
        currentWorklistResponseBaseDetails.every(function (x) {
            if (x.markGroupId === markGroupId) {
                displayId = x.displayId;
                return false;
            }
            return true;
        });
        return displayId;
    };
    /**
     * update ResolvedExceptionCount in worklist in worklist store.
     * @param displayID
     */
    WorkListStore.prototype.updateResolvedExceptionCount = function (displayID) {
        // Check the display Id exists in the list
        if (this.getCurrentWorklistResponseBaseDetails()) {
            var response = this.getCurrentWorklistResponseBaseDetails().filter(function (response) { return response.displayId === displayID; });
            if (response != null && response !== undefined && response.count() === 1) {
                response.map(function (x) {
                    x.resolvedExceptionsCount = x.resolvedExceptionsCount - 1;
                });
            }
        }
    };
    WorkListStore.WORKLIST_MARKING_MODE_CHANGE = 'GetLiveWorklist';
    WorkListStore.DO_GET_MARKING_CHECK_INFO = 'MarkCheckUpdatedEvent';
    WorkListStore.MARKING_CHECK_COMPLETED_EVENT = 'MarkingCheckCompletedEvent';
    WorkListStore.MARKING_CHECK_FAILURE_EVENT = 'MarkingCheckFailureEvent';
    WorkListStore.WORKLIST_COUNT_CHANGE = 'WorklistCountChange';
    WorkListStore.SETSCROLL_WORKLIST_COLUMNS = 'SetScrollWorklistColumns';
    WorkListStore.RESPONSE_CLOSED = 'ResponseClosed';
    WorkListStore.SUPERVISOR_SAMPLING_FAILURE_EVENT = 'SupervisorSamplingFailureEvent';
    WorkListStore.SHOW_RETURN_TO_WORKLIST_CONFIRMATION = 'ShowReturnToWorklistConfirmation';
    WorkListStore.RESPONSE_REVIEWED = 'ResponseReviewed';
    WorkListStore.WORKLIST_HISTORY_INFO_UPDATED = 'WorklistHistoryInfoUpdated';
    WorkListStore.MARKING_CHECK_RECIPIENT_LIST_UPDATED = 'MarkingCheckRecipientListUpdated';
    WorkListStore.MARKING_CHECK_STATUS_UPDATED = 'MarkingCheckStatusUpdated';
    WorkListStore.MARKING_CHECK_WORKLIST_ACCESS_STATUS_UPDATED = 'MarkingCheckWorklistAccessStatusUpdated';
    WorkListStore.NO_MARKING_CHECK_AVAILABLE_MESSAGE = 'NoMarkingCheckAvailableMessage';
    WorkListStore.WORKLIST_FILTER_CHANGED = 'WorklistFilterChanged';
    WorkListStore.MARKING_CHECK_EXAMINER_SELECTION_UPDATED = 'MarkingCheckExaminerSelectionUpdated';
    WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED = 'MarkCheckExaminersDataRetrived';
    WorkListStore.TOGGLE_REQUEST_MARKING_CHECK_BUTTON_EVENT = 'ToggleRequestMarkingCheckButtonEvent';
    WorkListStore.MARKING_CHECK_COMPLETE_BUTTON_EVENT = 'MarkingCheckCompleteButtonEvent';
    WorkListStore.TAG_UPDATED_EVENT = 'TagUpdatedEvent';
    WorkListStore.TAG_LIST_CLICKED = 'TagListClickedEvent';
    WorkListStore.STANDARDISATION_SETUP_COMPLETED_IN_BACKGROUND = 'StandardisationSetupCompletedInBackgroundEvent';
    WorkListStore.SIMULATION_TARGET_COMPLETED_EVENT = 'SimulationTargetCompletedEvent';
    return WorkListStore;
}(storeBase));
var instance = new WorkListStore();
module.exports = { WorkListStore: WorkListStore, instance: instance };
//# sourceMappingURL=workliststore.js.map