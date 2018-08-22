"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var actionType = require('../../actions/base/actiontypes');
var stringFormatHelper = require('../../utility/stringformat/stringformathelper');
var enums = require('../../components/utility/enums');
var Immutable = require('immutable');
var constants = require('../../components/utility/constants');
/**
 * Class for holding Marker's profile information.
 * @returns
 */
var ExaminerStore = (function (_super) {
    __extends(ExaminerStore, _super);
    /**
     *  Intializing a new instance of examiner store.
     */
    function ExaminerStore() {
        var _this = this;
        _super.call(this);
        this.success = false;
        this._operationMode = enums.MarkerOperationMode.Marking;
        /**
         * Collection of approval status against examinerRoleId
         * @param examinerRoleId
         * @param approvalStatus
         */
        this.updateExaminerApprovalStatus = function (examinerRoleId, approvalStatus) {
            // Dictionary already contains the key then update the value otherwise add a new entry.
            _this._examinerApprovalStatuses = _this._examinerApprovalStatuses.set(examinerRoleId, approvalStatus);
        };
        /**
         * This will update the examiner approval status.
         */
        this.updateApprovalStatus = function () {
            _this.updateExaminerApprovalStatus(_this.markerInformation.examinerRoleId, _this.markerInformation.approvalStatus);
        };
        /**
         * This will update the supervisor examiner approval status.
         */
        this.updateSupervisorApprovalStatus = function () {
            _this.updateExaminerApprovalStatus(_this.markerInformation.supervisorExaminerRoleId, _this.markerInformation.currentExaminerApprovalStatus);
        };
        this._examinerApprovalStatuses = Immutable.Map();
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.MARKERINFO:
                    _this.markerInformation = action.markerInformation;
                    _this.markerInformation.supervisorLoginStatus = _this.supervisorLoginStatus();
                    _this.markerInformation.formattedExaminerName = _this.formattedExaminerName();
                    _this.markerInformation.formattedSupervisorName = _this.formattedSupervisorName;
                    _this.markerInformation.formattedEsReviewerName = _this.formattedEsReviewerName;
                    _this.updateApprovalStatus();
                    _this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                    break;
                case actionType.WORKLIST_INITIALISATION_STARTED:
                    var result = action.markerInformationData;
                    if (result) {
                        _this.markerInformation = result;
                        _this.markerInformation.supervisorLoginStatus = _this.supervisorLoginStatus();
                        _this.markerInformation.formattedExaminerName = _this.formattedExaminerName();
                        _this.markerInformation.formattedSupervisorName = _this.formattedSupervisorName;
                        _this.markerInformation.formattedEsReviewerName = _this.formattedEsReviewerName;
                        _this.updateApprovalStatus();
                    }
                    _this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                    break;
                case actionType.RESPONSE_ALLOCATED:
                case actionType.ATYPICAL_SEARCH_MOVETOWORKLIST_ACTION:
                case actionType.ATYPICAL_SEARCH_MARK_NOW_ACTION:
                    var allocationAction = action;
                    /** Check the current approval status got changed, If so update the components */
                    if (allocationAction.allocatedResponseData.examinerApprovalStatus !== _this.markerInformation.approvalStatus) {
                        _this.markerInformation.approvalStatus = allocationAction.allocatedResponseData.examinerApprovalStatus;
                        _this.updateApprovalStatus();
                        if (_this.markerInformation.approvalStatus !== enums.ExaminerApproval.Withdrawn) {
                            _this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                        }
                    }
                    break;
                case actionType.SUBMIT_RESPONSE_COMPLETED:
                    var submitActionCompleted = action;
                    //checking qig session is closed for the examiner
                    if (submitActionCompleted.getSubmitResponseReturnDetails.responseSubmitErrorCode
                        === constants.QIG_SESSION_CLOSED) {
                        _this.emit(ExaminerStore.QIG_SESSION_CLOSED_EVENT);
                    }
                    else if (_this.markerInformation.approvalStatus !== enums.ExaminerApproval.Withdrawn) {
                        if (_this.markerInformation.approvalStatus
                            !== submitActionCompleted.getSubmitResponseReturnDetails.examinerApprovalStatus ||
                            _this.markerInformation.hasQualityFeedbackOutstanding
                                !== submitActionCompleted.getSubmitResponseReturnDetails.hasQualityFeedbackOutstanding) {
                            _this.markerInformation.approvalStatus =
                                submitActionCompleted.getSubmitResponseReturnDetails.examinerApprovalStatus;
                            _this.markerInformation.hasQualityFeedbackOutstanding =
                                submitActionCompleted.getSubmitResponseReturnDetails.hasQualityFeedbackOutstanding;
                            _this.updateApprovalStatus();
                            _this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                        }
                    }
                    break;
                case actionType.BACKGROUND_PULSE:
                    var success = action.success;
                    if (success && _this.markerInformation && _this.markerInformation.approvalStatus !== enums.ExaminerApproval.Withdrawn
                        && _this._operationMode === enums.MarkerOperationMode.Marking) {
                        var examinerOnlineStatusIndicatorData = action.getOnlineStatusData;
                        _this.markerInformation.isSupervisorLoggedOut = examinerOnlineStatusIndicatorData.isExaminerLoggedOut;
                        _this.markerInformation.supervisorLogoutDiffInMinute =
                            examinerOnlineStatusIndicatorData.supervisorTimeSinceLastPingInMinutes;
                        _this.markerInformation.approvalStatus = examinerOnlineStatusIndicatorData.examinerApprovalStatus;
                        _this.markerInformation.markerRoleID = examinerOnlineStatusIndicatorData.role;
                        _this.markerInformation.supervisorLoginStatus = _this.supervisorLoginStatus();
                        // updating the examiner approval status collection on background pulse
                        _this.updateApprovalStatus();
                        _this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                    }
                    break;
                case actionType.ACCEPT_QUALITY_ACTION:
                    var acceptFeedbakAction = action;
                    if (acceptFeedbakAction.acceptQualityFeedbackActionData.success) {
                        _this.markerInformation.hasQualityFeedbackOutstanding = false;
                        _this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                    }
                    break;
                case actionType.CHANGE_EXAMINER_STATUS:
                    var changeExaminerStatus = action;
                    if (changeExaminerStatus.examinerStatusReturn.success) {
                        _this.markerInformation.approvalStatus =
                            changeExaminerStatus.examinerStatusReturn.examinerDetails.approval_Status;
                        _this.updateApprovalStatus();
                    }
                    _this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                    break;
                case actionType.PROVIDE_SECOND_STANDARDISATION:
                    var provideSecondStandardisation = action;
                    if (provideSecondStandardisation.secondStandardisationReturn.success) {
                        _this.markerInformation.approvalStatus =
                            provideSecondStandardisation.secondStandardisationReturn.approvalStatus;
                        _this.updateApprovalStatus();
                    }
                    _this.emit(ExaminerStore.MARKER_INFO_UPDATED_EVENT);
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    var markerOperationMode = action;
                    _this._operationMode = markerOperationMode.operationMode;
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    var responseDataGetAction_1 = action;
                    // Set marking in case of Supervisor Remark navigation. Else set based on the team management access
                    if (responseDataGetAction_1.searchedResponseData.triggerPoint === enums.TriggerPoint.SupervisorRemark) {
                        _this._operationMode = enums.MarkerOperationMode.Marking;
                    }
                    else if (responseDataGetAction_1.searchedResponseData.isTeamManagement) {
                        _this._operationMode = enums.MarkerOperationMode.TeamManagement;
                    }
                    break;
            }
        });
    }
    /**
     * This will returns the formatted the examiner name
     */
    ExaminerStore.prototype.formattedExaminerName = function () {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', this.markerInformation.initials);
        formattedString = formattedString.replace('{surname}', this.markerInformation.surname);
        return formattedString;
    };
    Object.defineProperty(ExaminerStore.prototype, "formattedSupervisorName", {
        /**
         * This will returns the formatted supervisor name
         */
        get: function () {
            if (this.markerInformation.supervisorSurname === '' || this.markerInformation.supervisorSurname === undefined) {
                return '';
            }
            var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
            formattedString = formattedString.replace('{initials}', this.markerInformation.supervisorInitials);
            formattedString = formattedString.replace('{surname}', this.markerInformation.supervisorSurname);
            return formattedString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExaminerStore.prototype, "formattedEsReviewerName", {
        /**
         * This will returns the formatted es parent name
         */
        get: function () {
            if (this.markerInformation.esReviewerSurname === '' || this.markerInformation.esReviewerSurname === undefined) {
                return '';
            }
            var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
            formattedString = formattedString.replace('{initials}', this.markerInformation.esReviewerInitials);
            formattedString = formattedString.replace('{surname}', this.markerInformation.esReviewerSurname);
            return formattedString;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method will return the supervisor online status.
     */
    ExaminerStore.prototype.supervisorLoginStatus = function () {
        // if isLoggedOut field is true or logout date is -1 (not loggedin yet) then return false
        // or if last updated logout date is greater than 10 minutes - ( close browser without proper logout)
        if (this.markerInformation.isSupervisorLoggedOut || this.markerInformation.supervisorLogoutDiffInMinute === -1 ||
            this.markerInformation.supervisorLogoutDiffInMinute > 10) {
            return false;
        }
        else {
            return true;
        }
    };
    Object.defineProperty(ExaminerStore.prototype, "getMarkerInformation", {
        /**
         * This will return the Marker information.
         * @returns markerInformation
         */
        get: function () {
            return this.markerInformation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExaminerStore.prototype, "parentExaminerId", {
        /**
         * This method will return the parent examiner Id
         */
        get: function () {
            if (this.markerInformation !== undefined) {
                return this.markerInformation.supervisorExaminerId !== undefined ? this.markerInformation.supervisorExaminerId : 0;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return the approval status collection
     * @param examinerRoleId number
     */
    ExaminerStore.prototype.examinerApprovalStatus = function (examinerRoleId) {
        if (this._examinerApprovalStatuses) {
            // If examinerRoleId (key) not found in dictionary then return approval status None.
            return this._examinerApprovalStatuses.get(examinerRoleId, enums.ExaminerApproval.None);
        }
        else {
            return enums.ExaminerApproval.None;
        }
    };
    // Marker info updated event name.
    ExaminerStore.MARKER_INFO_UPDATED_EVENT = 'markerinfoupdated';
    // Online status updated event .
    ExaminerStore.ONLINE_STATUS_UPDATED_EVENT = 'onlinestatusupdated';
    // cheking for qig session is closed for the examiner
    ExaminerStore.QIG_SESSION_CLOSED_EVENT = 'qigsessionclosed';
    return ExaminerStore;
}(storeBase));
var instance = new ExaminerStore();
module.exports = { ExaminerStore: ExaminerStore, instance: instance };
//# sourceMappingURL=examinerstore.js.map