"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var dispatcher = require('../../app/dispatcher');
var actionType = require('../../actions/base/actiontypes');
var enums = require('../../components/utility/enums');
var constants = require('../../components/utility/constants');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
/* The submit store */
var SubmitStore = (function (_super) {
    __extends(SubmitStore, _super);
    /**
     * Constructor for Submit store
     */
    function SubmitStore() {
        var _this = this;
        _super.call(this);
        this.storageAdapterHelper = new storageAdapterHelper();
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.SINGLE_RESPONSE_SUBMIT_STARTED:
                    _this.markGroupId = action.getMarkGroupId;
                    /* Show busy indicator when submit button is clicked */
                    _this.emit(SubmitStore.SUBMIT_RESPONSE_STARTED);
                    break;
                case actionType.OPEN_RESPONSE:
                    var openAction = action;
                    _this.markGroupId = openAction.selectedMarkGroupId;
                    break;
                case actionType.SUBMIT_RESPONSE_COMPLETED:
                    var submitresponsecompletedaction_1 = action;
                    _this.isSuccess = submitresponsecompletedaction_1.success;
                    _this.worklistType = submitresponsecompletedaction_1.getCurrentWorklistType;
                    _this.submitResponseReturn = submitresponsecompletedaction_1.getSubmitResponseReturnDetails;
                    _this.examinerApprovalStatusChanged = submitresponsecompletedaction_1.getExaminerApproval
                        !== _this.submitResponseReturn.examinerApprovalStatus;
                    // checking session is closed for the examiner and blocking navigation
                    if (submitresponsecompletedaction_1.getSubmitResponseReturnDetails.responseSubmitErrorCode
                        === constants.QIG_SESSION_CLOSED) {
                        _this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                        return;
                    }
                    /* When response submission is finished */
                    if (_this.submitResponseReturn.examinerApprovalStatus !== enums.ExaminerApproval.Withdrawn) {
                        /* When response submission is finished */
                        _this.emit(SubmitStore.SUBMIT_RESPONSE_COMPLETED, submitresponsecompletedaction_1.isFromMarkScheme, submitresponsecompletedaction_1.getSubmittedMarkGroupIds, submitresponsecompletedaction_1.getSelectedDisplayId);
                    }
                    break;
                case actionType.NAVIGATE_AFTER_SUBMIT_ACTION:
                    var navigateAfterSubmit = action;
                    if (navigateAfterSubmit.submittedMarkGroupIds.length > 0) {
                        _this.emit(SubmitStore.NAVIGATE_AFTER_SUBMIT, navigateAfterSubmit.submittedMarkGroupIds, navigateAfterSubmit.selectedDisplayId, navigateAfterSubmit.isFromMarkScheme);
                    }
                    break;
                case actionType.MARK:
                    _this.resetSelectedSubmitDetails();
                    break;
                case actionType.SHOW_SIMULATION_RESPONSE_SUBMIT_CONFIRMATION_ACTION:
                    var showSimulationResponseSubmitConfirmAction_1 = action;
                    _this.markGroupId = showSimulationResponseSubmitConfirmAction_1.markGroupId;
                    _this.isFromMarkScheme = showSimulationResponseSubmitConfirmAction_1.isFromMarkScheme;
                    _this.emit(SubmitStore.SHOW_SIMULATION_RESPONSE_SUBMIT_CONFIRMATION_EVENT);
                    break;
            }
        });
    }
    Object.defineProperty(SubmitStore.prototype, "isSubmitFromMarkScheme", {
        get: function () {
            return this.isFromMarkScheme;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubmitStore.prototype, "getSuccess", {
        /**
         * Returns the success status
         * @returns
         */
        get: function () {
            return this.isSuccess;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubmitStore.prototype, "getErrorCode", {
        /**
         * Returns the error code
         * @returns
         */
        get: function () {
            return this.submitResponseReturn.responseSubmitErrorCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubmitStore.prototype, "isExaminerApprovalStatusChanged", {
        /**
         * Returns whetger examiner approval status changed when submitting the response
         * @returns
         */
        get: function () {
            return this.examinerApprovalStatusChanged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubmitStore.prototype, "getMarkGroupId", {
        /**
         * Returns the mark group Id for a single response
         * @returns
         */
        get: function () {
            return this.markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubmitStore.prototype, "getCurrentWorklistType", {
        /**
         * Returns the current worklist type
         * @returns
         */
        get: function () {
            return this.worklistType;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the submitted responses details.
     * @returns
     */
    SubmitStore.prototype.getSubmittedResponsesCount = function () {
        return this.submitResponseReturn.submittedResponseCount;
    };
    Object.defineProperty(SubmitStore.prototype, "getSubmitResponseReturn", {
        /**
         * Get the return object to the outside
         */
        get: function () {
            return this.submitResponseReturn;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This will reset the selected submit details
     */
    SubmitStore.prototype.resetSelectedSubmitDetails = function () {
        this.submitResponseReturn = undefined;
    };
    SubmitStore.SUBMIT_RESPONSE_STARTED = 'submitResponseStarted';
    SubmitStore.SUBMIT_RESPONSE_COMPLETED = 'submitResponseCompleted';
    SubmitStore.NAVIGATE_AFTER_SUBMIT = 'navigateAfterSubmit';
    SubmitStore.SHOW_SIMULATION_RESPONSE_SUBMIT_CONFIRMATION_EVENT = 'ShowSimulationResponseSubmitConfirmationEvent';
    return SubmitStore;
}(storeBase));
var instance = new SubmitStore();
module.exports = { SubmitStore: SubmitStore, instance: instance };
//# sourceMappingURL=submitstore.js.map