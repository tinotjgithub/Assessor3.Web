"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var worklistTypeAction = require('./worklisttypeaction');
var enums = require('../../components/utility/enums');
var worklistDataFetchAction = require('./worklistdatafetchaction');
var worklistDataService = require('../../dataservices/worklist/worklistdataservice');
var responseModeChangeAction = require('./responsemodechangeaction');
var responseCloseAction = require('./responsecloseaction');
var setScrollWorklistColumnsAction = require('./setscrollworklistcolumnsaction');
var Promise = require('es6-promise');
var base = require('../base/actioncreatorbase');
var sortAction = require('./sortaction');
var operationModeHelper = require('../../components/utility/userdetails/userinfo/operationmodehelper');
var worklistHistoryInfoAction = require('./worklisthistoryinfoaction');
var getMarkingCheckWorklistAccessStatusAction = require('./getmarkingcheckworklistaccessstatusaction');
var markingCheckWorklistFetchAction = require('./markingcheckworklistgetaction');
var worklistSeedFilterAction = require('./worklistseedfilteraction');
var ccValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var markingCheckCompleteAction = require('./markingcheckcompleteaction');
var removeResponseFromWorklist = require('./removeresponseaction');
/**
 * Marking mode helper action creator
 * @param {enums.MarkingMode} markingmode
 */
var WorklistActionCreator = (function (_super) {
    __extends(WorklistActionCreator, _super);
    function WorklistActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * fetches the worklist marker progress data
     * @param {number} examinerRoleID
     * @param {boolean = true} initiateDispatch
     */
    WorklistActionCreator.prototype.getWorklistMarkerProgressData = function (examinerRoleID, markSchemeGroupId, isElectronicStandardisationTeamMember, initiateDispatch, useCache) {
        if (initiateDispatch === void 0) { initiateDispatch = true; }
        if (useCache === void 0) { useCache = false; }
        var that = this;
        // include promoted as seed responses is applicable for live closed responses only, that logic will be handled in sp.
        var includePromotedAsSeedResponses = (ccValues.examinerCentreExclusivity ||
            !isElectronicStandardisationTeamMember);
        return new Promise.Promise(function (resolve, reject) {
            worklistDataService.getWorklistMarkerProgressData(examinerRoleID, markSchemeGroupId, includePromotedAsSeedResponses, function (success, json) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json)) {
                    if (!success) {
                        json = undefined;
                    }
                    if (initiateDispatch) {
                        dispatcher.dispatch(new worklistDataFetchAction(success, json));
                    }
                    resolve(json);
                }
                else {
                    reject();
                }
            }, useCache);
        });
    };
    /**
     * Get the markingCheckWorklist Access permission for the current user
     * @param markSchemeGroupId
     */
    WorklistActionCreator.prototype.getMarkingCheckWorklistAccessStatus = function (markSchemeGroupId) {
        worklistDataService.getMarkingCheckWorklistAccessStatus(markSchemeGroupId, function (success, isMarkingCheckPresent) {
            dispatcher.dispatch(new getMarkingCheckWorklistAccessStatusAction(true, isMarkingCheckPresent));
        });
    };
    /**
     * On Marking CHeck Complete
     * @param markSchemeGroupId
     */
    WorklistActionCreator.prototype.markingCheckComplete = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markingCheckCompleteAction());
        }).catch();
    };
    /**
     * notify the user has changed the worklist selection.
     * @param MarkSchemeGroupId The mark scheme group id
     * @param examinerRole The examiner role id
     * @param questionPaperPartId The question paper id
     * @param markingmode The marking mode
     * @param responseMode The response mode
     */
    WorklistActionCreator.prototype.notifyWorklistTypeChange = function (markSchemeGroupId, examinerRole, questionPaperPartId, worklistType, responseMode, remarkRequestType, isDirectedRemark, isElectronicStandardisationTeamMember, doUseCache, isMarkingCheckWorklist) {
        if (remarkRequestType === void 0) { remarkRequestType = enums.RemarkRequestType.Unknown; }
        if (isDirectedRemark === void 0) { isDirectedRemark = false; }
        if (doUseCache === void 0) { doUseCache = true; }
        if (isMarkingCheckWorklist === void 0) { isMarkingCheckWorklist = false; }
        var _subExaminerId = operationModeHelper.subExaminerId;
        var includePromotedAsSeedResponses = (ccValues.examinerCentreExclusivity ||
            !isElectronicStandardisationTeamMember) && (worklistType ===
            enums.WorklistType.live || worklistType === enums.WorklistType.directedRemark ||
            worklistType === enums.WorklistType.pooledRemark)
            && responseMode === enums.ResponseMode.closed;
        var that = this;
        /* Data service call to retrieve open live/ Pooled Remark response details */
        worklistDataService.GetWorklistDetails(markSchemeGroupId, examinerRole, questionPaperPartId, remarkRequestType, worklistType, responseMode, doUseCache, this.isOnline, _subExaminerId, operationModeHelper.isHelpExaminersView, isMarkingCheckWorklist, includePromotedAsSeedResponses, function (success, isCached, responseData) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(responseData, true, true)) {
                if (!success) {
                    responseData = undefined;
                }
                new Promise.Promise(function (resolve, reject) {
                    resolve();
                }).then(function () {
                    /* Dispatch the login action once the authentication call completes */
                    dispatcher.dispatch(new worklistTypeAction(worklistType, responseMode, remarkRequestType, isDirectedRemark, success, isCached, responseData, markSchemeGroupId, questionPaperPartId, operationModeHelper.examinerRoleId));
                }).catch();
            }
        });
    };
    /**
     * Handle worklist response mode change
     * @param responseMode The response mode
     */
    WorklistActionCreator.prototype.responseModeChanged = function (responseMode, isMarkingCheckMode) {
        if (isMarkingCheckMode === void 0) { isMarkingCheckMode = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new responseModeChangeAction(responseMode, isMarkingCheckMode));
        }).catch();
    };
    /**
     * Updates the store for selected examiner in workliststore and invokes call for worklist
     */
    WorklistActionCreator.prototype.onMarkingCheckRequesterExaminerSelected = function (examinerId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markingCheckWorklistFetchAction(examinerId));
        }).catch();
    };
    /**
     * Handle navigate to worklist on response close
     * @param responseMode The response mode
     */
    WorklistActionCreator.prototype.responseClosed = function (isResponseClose) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new responseCloseAction(isResponseClose));
        }).catch();
    };
    /**
     * setting the scroll for the worklist List View Tables
     */
    WorklistActionCreator.prototype.setScrollWorklistColumns = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setScrollWorklistColumnsAction());
        }).catch();
    };
    /**
     * Handle the sort order
     */
    WorklistActionCreator.prototype.onSortedClick = function (sortDetails) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new sortAction(sortDetails));
        }).catch();
    };
    /**
     * setting worklist history info
     */
    WorklistActionCreator.prototype.setWorklistHistoryInfo = function (_historyItem, _markingMode) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new worklistHistoryInfoAction(_historyItem, _markingMode));
        }).catch();
    };
    /**
     * Set the selected filter data
     * @param examinerRoleId
     * @param selectedWorklistFilter
     */
    WorklistActionCreator.prototype.setFilteredWorklistData = function (examinerRoleId, selectedWorklistFilter) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new worklistSeedFilterAction(examinerRoleId, selectedWorklistFilter));
        }).catch();
    };
    /**
     * This will remove a response from current store worklist collection
     * @param {enums.WorklistType} worklistType
     * @param {enums.ResponseMode} responseMode
     * @param {string} displayId
     *
     * @memberof WorklistActionCreator
     */
    WorklistActionCreator.prototype.removeResponseFromWorklist = function (worklistType, responseMode, displayId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new removeResponseFromWorklist(worklistType, responseMode, displayId));
        }).catch();
    };
    return WorklistActionCreator;
}(base));
var worklistActionCreator = new WorklistActionCreator();
module.exports = worklistActionCreator;
//# sourceMappingURL=worklistactioncreator.js.map