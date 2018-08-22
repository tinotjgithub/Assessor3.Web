"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var dispatcher = require('../../app/dispatcher');
var actionType = require('../../actions/base/actiontypes');
var sortHelper = require('../../utility/sorting/sorthelper');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
var Immutable = require('immutable');
var enums = require('../../components/utility/enums');
var examinerStore = require('../markerinformation/examinerstore');
var teamManagementTabHelper = require('./../../utility/teammanagement/helpers/teammanagementtabhelper');
var TargetSummaryStore = (function (_super) {
    __extends(TargetSummaryStore, _super);
    /**
     * Constructor for targetsummary store
     */
    function TargetSummaryStore() {
        var _this = this;
        _super.call(this);
        this._supervisorRemarkResponseCreated = false;
        this.success = false;
        this.markerProgressData = null;
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.WORKLIST_DATA_GET:
                    _this.success = action.success;
                    if (_this.success) {
                        _this.setMarkingTargetResult(action.getExaminerProgressData());
                    }
                    _this.emit(TargetSummaryStore.MARKING_PROGRESS_EVENT);
                    _this._supervisorRemarkResponseCreated = false;
                    break;
                case actionType.WORKLIST_INITIALISATION_STARTED:
                    var resultData = action.markerProgressData;
                    if (resultData !== undefined && resultData.success) {
                        _this.setMarkingTargetResult(resultData);
                    }
                    // This event should send because to load the target information on the left side for Live worklist.
                    // This is to set the stare after marking progress data has been loaded.
                    _this.emit(TargetSummaryStore.MARKING_PROGRESS_EVENT);
                    // This will let the qigselector know that worklist intialisation has been completed and can continue
                    // response allocation(in case of practice/std response) or select the default target.
                    _this.emit(TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED);
                    break;
                case actionType.CREATE_SUPERVISOR_REMARK_ACTION:
                    //Setting a variable when the supervisor response is created to avoid taking data from cache
                    _this._supervisorRemarkResponseCreated = true;
                    break;
            }
        });
    }
    /**
     * To get the examiners target progress
     */
    TargetSummaryStore.prototype.getExaminerMarkingTargetProgress = function () {
        var examinerMarkingTargetProgress = this.markerProgressData != null ?
            // If maximumMarkingLimit is 0 it is not used. So filter those targets here for avoiding issues.
            Immutable.List(this.markerProgressData.markingTargets.filter(function (x) { return x.markingModeID !== enums.MarkingMode.Practice || x.maximumMarkingLimit > 0; })) :
            undefined;
        // Only Qualification responses are displaying from help examiners.
        // Filter the targets, If there are any responses [Standardisation / Seed]
        if (examinerMarkingTargetProgress &&
            teamManagementTabHelper.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) {
            // Live marking target has to be shown only when the marker has been approved for live marking
            return Immutable.List(examinerMarkingTargetProgress.filter(function (x) {
                return (((x.markingModeID === enums.MarkingMode.Approval ||
                    x.markingModeID === enums.MarkingMode.ES_TeamApproval) && x.isTargetCompleted) ||
                    (x.isCurrentTarget && x.markingModeID === enums.MarkingMode.LiveMarking &&
                        examinerStore.instance.getMarkerInformation.approvalStatus !== enums.ExaminerApproval.NotApproved));
            }));
        }
        return examinerMarkingTargetProgress;
    };
    /**
     * Sort the marking target summary list
     * @param markingTargetsSummary
     */
    TargetSummaryStore.prototype.sortMarkingTargets = function (markingTargets) {
        // If same date exist in the list then sort by marking mode id
        if (this.isSameTargetDateExist(markingTargets) === true) {
            markingTargets = Immutable.List(sortHelper.sort(markingTargets.toArray(), comparerList.MarkingTargetComparer));
        }
        return markingTargets;
    };
    /**
     * Sort the marking target summary list on completed date
     * @param markingTargetsSummary
     */
    TargetSummaryStore.prototype.sortMarkingTargetsOnCompletedDate = function (markingTargets) {
        markingTargets = Immutable.List(sortHelper.sort(markingTargets.toArray(), comparerList.markingTargetCompletedDateComparer));
        return markingTargets;
    };
    /**
     * Check whether same date exist in the list
     * @param markingTargets
     */
    TargetSummaryStore.prototype.isSameTargetDateExist = function (markingTargets) {
        // Get target date only from the list
        var targetDateList = markingTargets.map(function (t) { return t.markingTargetDate; }).toArray();
        // Filter same date to the list
        var uniqueTargetDateList = targetDateList.filter(function (elem, pos) {
            return targetDateList.indexOf(elem) === pos;
        });
        // If marking target collection has the following
        // Live marking - 22/03/2016, Practise marking - 22/03/2016, Standardisation marking - 22/03/2016
        // then targetDateList will have 22/03/2016, 22/03/2016, 22/03/2016 and
        // uniqueTargetDateList will have only 22/03/2016. Comparing the length will let us know duplicates
        // exist or not
        if (targetDateList.length !== uniqueTargetDateList.length) {
            return true;
        }
        return false;
    };
    /**
     * Returns the current marking mode which the examiner is in now.
     * @returns markingModeId
     */
    TargetSummaryStore.prototype.getCurrentMarkingMode = function () {
        var markingModeId = 0;
        this.markerProgressData.markingTargets.map(function (targets) {
            if (targets.isCurrentTarget === true) {
                markingModeId = targets.markingModeID;
                return markingModeId;
            }
        });
        return markingModeId;
    };
    /**
     * Returns the current target which the examiner is in now.
     * @returns target
     */
    TargetSummaryStore.prototype.getCurrentTarget = function () {
        var currentTarget = undefined;
        this.markerProgressData.markingTargets.map(function (targets) {
            if (targets.isCurrentTarget === true) {
                currentTarget = targets;
                return currentTarget;
            }
        });
        return currentTarget;
    };
    /**
     * return the requested remark targets
     * @param remarkRequestType remark request typoe
     */
    TargetSummaryStore.prototype.getRemarkTarget = function (remarkRequestType) {
        var target = undefined;
        this.markerProgressData.markingTargets.map(function (targets) {
            if (targets.markingModeID === enums.MarkingMode.Remarking && targets.remarkRequestTypeID === remarkRequestType) {
                target = targets;
                return target;
            }
        });
        return target;
    };
    /**
     * Updates the marking target data with a sorted List of Targets
     * @param {markerProgressData} resultData
     */
    TargetSummaryStore.prototype.setMarkingTargetResult = function (resultData) {
        this.markerProgressData = resultData;
        /** Modified sorting logic w.r.t User Story 29636 requirement-Pooled re-mark worklist shall be sorted by
         * target date (earliest target date displayed first, below Live marking)- sorting list of pooled remarks
         * and the remaining worklists as seperate lists and sorting the lists and finally concatenating the lists
         */
        var pooledRemarkMarkerProgressData = Immutable.List();
        var excludePooledRemarkMarkerProgressData = Immutable.List();
        excludePooledRemarkMarkerProgressData = this.sortMarkingTargets(Immutable.List(this.markerProgressData.markingTargets.filter(function (x) { return x.markingModeID !== enums.MarkingMode.Remarking; })));
        pooledRemarkMarkerProgressData = this.sortMarkingTargets(Immutable.List(this.markerProgressData.markingTargets.filter(function (x) { return x.markingModeID === enums.MarkingMode.Remarking; })));
        this.markerProgressData.markingTargets = Immutable.List(excludePooledRemarkMarkerProgressData.concat(pooledRemarkMarkerProgressData));
    };
    /**
     * Returns the current response mode which the examiner is in now.
     * @returns markingModeId
     */
    TargetSummaryStore.prototype.getCurrentResponseMode = function (markingMode, worklistType, currentMarkingMode) {
        var responseMode = enums.ResponseMode.none;
        this.markerProgressData.markingTargets.map(function (targets) {
            if (targets.markingModeID === markingMode) {
                // If the target is completed and marker is still in Not Approved status
                // (scenario: completed standardisation inacurately), then marker should be in open worklist
                if (worklistType === enums.WorklistType.atypical) {
                    responseMode = enums.ResponseMode.open;
                }
                else if (targets.isTargetCompleted === true
                    && examinerStore.instance.getMarkerInformation.approvalStatus !== enums.ExaminerApproval.NotApproved) {
                    if (targets.examinerProgress.openResponsesCount >= 0 && worklistType === enums.WorklistType.live) {
                        responseMode = enums.ResponseMode.open;
                    }
                    else {
                        if (targets.examinerProgress.pendingResponsesCount > 0) {
                            responseMode = enums.ResponseMode.pending;
                        }
                        else if (targets.examinerProgress.closedResponsesCount > 0) {
                            responseMode = enums.ResponseMode.closed;
                        }
                        else {
                            responseMode = enums.ResponseMode.open;
                        }
                    }
                }
                else if (targets.isTargetCompleted === true
                    && (worklistType === enums.WorklistType.practice || worklistType === enums.WorklistType.standardisation)
                    && currentMarkingMode !== markingMode
                    && examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.NotApproved) {
                    responseMode = enums.ResponseMode.closed;
                }
                else {
                    responseMode = enums.ResponseMode.open;
                }
            }
        });
        return responseMode;
    };
    Object.defineProperty(TargetSummaryStore.prototype, "currentResponseModeForMarkingCheck", {
        /**
         * Gets the current response mode which the worklist should be for marking check
         */
        get: function () {
            var responseMode = enums.ResponseMode.none;
            this.markerProgressData.markingTargets.map(function (targets) {
                if (targets.markingModeID === enums.MarkingMode.LiveMarking) {
                    if (targets.examinerProgress.closedResponsesCount > 0) {
                        responseMode = enums.ResponseMode.closed;
                    }
                    else if (targets.examinerProgress.pendingResponsesCount > 0) {
                        responseMode = enums.ResponseMode.pending;
                    }
                    else if (targets.examinerProgress.openResponsesCount > 0) {
                        responseMode = enums.ResponseMode.open;
                    }
                    else {
                        responseMode = enums.ResponseMode.closed;
                    }
                }
            });
            return responseMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TargetSummaryStore.prototype, "isSupervisorRemarkCreated", {
        /**
         * Returns whether a supervisor remark is created or not
         * @returns
         */
        get: function () {
            return this._supervisorRemarkResponseCreated;
        },
        enumerable: true,
        configurable: true
    });
    TargetSummaryStore.MARKING_PROGRESS_EVENT = 'marking_Target_Data_Recieved';
    TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED = 'worklist_initialisation_completed';
    return TargetSummaryStore;
}(storeBase));
var instance = new TargetSummaryStore();
module.exports = { TargetSummaryStore: TargetSummaryStore, instance: instance };
//# sourceMappingURL=targetsummarystore.js.map