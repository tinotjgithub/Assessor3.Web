"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var storageAdapterFactory = require('../storageadapters/storageadapterfactory');
var Immutable = require('immutable');
var enums = require('../../components/utility/enums');
var storageAdapterHelper = require('../storageadapters/storageadapterhelper');
var WorklistDataService = (function (_super) {
    __extends(WorklistDataService, _super);
    function WorklistDataService() {
        _super.apply(this, arguments);
        this._storageAdapterHelper = new storageAdapterHelper();
    }
    /**
     * Method which makes the AJAX call to fetch the marker progress data to be shown on the
     * left side Worklist navigation panel
     * @param examinerRoleID
     * @param markSchemeGroupId
     * @param includePromotedAsSeedResponses
     * @param callback
     */
    WorklistDataService.prototype.getWorklistMarkerProgressData = function (examinerRoleID, markSchemeGroupId, includePromotedAsSeedResponses, callback, useCache) {
        if (useCache === void 0) { useCache = false; }
        var that = this;
        if (useCache) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('marker', 'markerProgress_' + examinerRoleID, true, config.cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult) {
                that.getWorklistMarkerProgressDataFromServer(examinerRoleID, markSchemeGroupId, includePromotedAsSeedResponses, callback);
            });
        }
        else {
            this.getWorklistMarkerProgressDataFromServer(examinerRoleID, markSchemeGroupId, includePromotedAsSeedResponses, callback);
        }
    };
    /**
     * get the status whether the examiner has marking check worklist available
     */
    WorklistDataService.prototype.getMarkingCheckWorklistAccessStatus = function (markSchemeGroupId, callback) {
        var url = urls.MARKING_CHECK_ACCESS_STATUS_URL;
        var getMarkingCheckWorklistAccessStatusPromise = this.makeAJAXCall('GET', url + '/' + markSchemeGroupId);
        getMarkingCheckWorklistAccessStatusPromise.then(function (json) {
            var data = JSON.parse(json);
            callback(true, data.isMarkingCheckPresent);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    /**
     * Get the Worklist Marker Progress Data From Server
     * @param examinerRoleID
     * @param markSchemeGroupId
     * @param callback
     */
    WorklistDataService.prototype.getWorklistMarkerProgressDataFromServer = function (examinerRoleID, markSchemeGroupId, includePromotedAsSeedResponses, callback) {
        var url = urls.MARKER_PROGRESS_GET_URL;
        /**  Making AJAX call to get the examiner progress data */
        var worklistPromise = this.makeAJAXCall('GET', url + '/' + examinerRoleID + '/' + markSchemeGroupId + '/' + includePromotedAsSeedResponses);
        var that = this;
        worklistPromise.then(function (json) {
            if (callback) {
                storageAdapterFactory.getInstance().storeData('marker', 'markerProgress_' + examinerRoleID, JSON.parse(json), true).then().catch();
                callback(true, JSON.parse(json));
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Change json object to immutable list
     * @param data
     */
    WorklistDataService.prototype.getImmutable = function (data) {
        var immutableList = Immutable.List(data.responses);
        immutableList.map(function (x) {
            if (x.relatedRIGDetails) {
                x.relatedRIGDetails = Immutable.List(x.relatedRIGDetails);
            }
        });
        data.responses = immutableList;
        return data;
    };
    /**
     * Make ajax call to retrieve response details
     * @param examinerRoleId
     * @param markSchemeGroupId
     * @param questionPaperId
     * @param remarkRequestType
     * @param worklistType
     * @param responseMode
     * @param memoryStorageKey
     * @param callback
     */
    WorklistDataService.prototype.makeAjaxCallToGetResponseDetails = function (examinerRoleId, markSchemeGroupId, questionPaperId, remarkRequestType, worklistType, responseMode, memoryStorageKey, isOnline, subExaminerId, isHelpExaminersView, isMarkCheckWorklist, includePromotedAsSeedResponses, callback) {
        var _responseList;
        var that = this;
        /* Make an ajax call to retrieve data and store the same in storage adapter.*/
        var url = urls.WORKLIST_GET_URL
            + '/' + examinerRoleId
            + '/' + markSchemeGroupId
            + '/' + questionPaperId
            + '/' + remarkRequestType
            + '/' + worklistType
            + '/' + responseMode
            + '/' + subExaminerId
            + '/' + isHelpExaminersView
            + '/' + isMarkCheckWorklist
            + '/' + includePromotedAsSeedResponses;
        var getMarkingListPromise = that.makeAJAXCall('GET', url, '', isOnline, isOnline);
        getMarkingListPromise.then(function (json) {
            _responseList = that.getImmutable(JSON.parse(json));
            if (callback) {
                storageAdapterFactory.getInstance().storeData('worklist', memoryStorageKey, _responseList, true).then(function () {
                    callback(true, false, _responseList);
                }).catch();
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, false, json);
            }
        });
    };
    /**
     * Getting worlist details
     * @param examinerRoleId
     * @param questionPaperId
     * @param markingmode
     * @param responseMode
     * @param subExaminerId
     * @param callback
     */
    WorklistDataService.prototype.GetWorklistDetails = function (markSchemeGroupId, examinerRoleId, questionPaperId, remarkRequestType, markingmode, responseMode, doUseCache, isOnline, subExaminerId, isHelpExaminerView, isMarkCheckWorklist, includePromotedAsSeedResponses, callback) {
        if (doUseCache === void 0) { doUseCache = true; }
        switch (markingmode) {
            case enums.WorklistType.live:
                this.GetLiveWorklistDetails(markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, isHelpExaminerView, isMarkCheckWorklist, includePromotedAsSeedResponses, callback);
                break;
            case enums.WorklistType.atypical:
                this.GetAtypicalWorklistDetails(markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, callback);
                break;
            case enums.WorklistType.secondstandardisation:
                this.GetSecondStandardisationWorklistDetails(markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, callback);
                break;
            case enums.WorklistType.standardisation:
                this.GetStandardisationWorklistDetails(markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, callback);
                break;
            case enums.WorklistType.practice:
                this.GetPracticeWorkListDetails(markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, callback);
                break;
            case enums.WorklistType.directedRemark:
                this.GetDirectedRemarkWorklistDetails(markSchemeGroupId, examinerRoleId, questionPaperId, remarkRequestType, responseMode, doUseCache, isOnline, subExaminerId, includePromotedAsSeedResponses, callback);
                break;
            case enums.WorklistType.pooledRemark:
                this.GetRemarkWorklistDetails(markSchemeGroupId, examinerRoleId, questionPaperId, remarkRequestType, responseMode, doUseCache, isOnline, subExaminerId, includePromotedAsSeedResponses, callback);
                break;
            case enums.WorklistType.simulation:
                this.GetSimulationWorklistDetails(markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, isHelpExaminerView, isMarkCheckWorklist, includePromotedAsSeedResponses, callback);
                break;
            default:
                break;
        }
    };
    /**
     * Getting live worklist details
     * @param shouldCache
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param includePromotedAsSeedResponses
     * @param callback
     */
    WorklistDataService.prototype.GetLiveWorklistDetails = function (markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, isHelpExaminerView, isMarkCheckWorklist, includePromotedAsSeedResponses, callback) {
        if (doUseCache === void 0) { doUseCache = true; }
        switch (responseMode) {
            case enums.ResponseMode.open:
                this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.live, enums.ResponseMode.open, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.live, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback, subExaminerId, isMarkCheckWorklist);
                break;
            case enums.ResponseMode.closed:
                this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.live, enums.ResponseMode.closed, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.live, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback, subExaminerId, isMarkCheckWorklist, isHelpExaminerView, includePromotedAsSeedResponses);
                break;
            case enums.ResponseMode.pending:
                this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.live, enums.ResponseMode.pending, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.live, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback, subExaminerId, isMarkCheckWorklist);
                break;
            default:
                break;
        }
    };
    /**
     * Getting atypical worklist details
     * @param shouldCache
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param callback
     */
    WorklistDataService.prototype.GetAtypicalWorklistDetails = function (markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, callback) {
        if (doUseCache === void 0) { doUseCache = true; }
        switch (responseMode) {
            case enums.ResponseMode.open:
                this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.atypical, enums.ResponseMode.open, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.atypical, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback, subExaminerId);
                break;
            case enums.ResponseMode.closed:
                this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.atypical, enums.ResponseMode.closed, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.atypical, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback, subExaminerId);
                break;
            case enums.ResponseMode.pending:
                this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.atypical, enums.ResponseMode.pending, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.atypical, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback, subExaminerId);
                break;
            default:
                break;
        }
    };
    /**
     * Getting practice worklist details
     * @param markSchemeGroupId
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param doUseCache
     * @param callback
     */
    WorklistDataService.prototype.GetPracticeWorkListDetails = function (markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, callback) {
        if (doUseCache === void 0) { doUseCache = true; }
        switch (responseMode) {
            case enums.ResponseMode.open:
                this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.practice, enums.ResponseMode.open, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.practice, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback, subExaminerId);
                break;
            case enums.ResponseMode.closed:
                this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.practice, enums.ResponseMode.closed, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.practice, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback, subExaminerId);
                break;
        }
    };
    /**
     * Getting standardisation worklist details
     * @param shouldCache
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param callback
     */
    WorklistDataService.prototype.GetStandardisationWorklistDetails = function (markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, callback) {
        if (doUseCache === void 0) { doUseCache = true; }
        switch (responseMode) {
            case enums.ResponseMode.open:
                this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.standardisation, enums.ResponseMode.open, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.standardisation, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback);
                break;
            case enums.ResponseMode.closed:
                this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.standardisation, enums.ResponseMode.closed, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.standardisation, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback, subExaminerId);
                break;
            default:
                break;
        }
    };
    /**
     * Getting second/stm standardisation worklist details
     * @param shouldCache
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param callback
     */
    WorklistDataService.prototype.GetSecondStandardisationWorklistDetails = function (markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, callback) {
        if (doUseCache === void 0) { doUseCache = true; }
        switch (responseMode) {
            case enums.ResponseMode.open:
                this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.secondstandardisation, enums.ResponseMode.open, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.secondstandardisation, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback);
                break;
            case enums.ResponseMode.closed:
                this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.secondstandardisation, enums.ResponseMode.closed, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.secondstandardisation, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback, subExaminerId);
                break;
            default:
                break;
        }
    };
    /**
     * Get directed remark worklist details
     * @param markSchemeGroupId
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param doUseCache
     * @param callback
     */
    WorklistDataService.prototype.GetDirectedRemarkWorklistDetails = function (markSchemeGroupId, examinerRoleId, questionPaperId, remarkRequestType, responseMode, doUseCache, isOnline, subExaminerId, includePromotedAsSeedResponses, callback) {
        if (doUseCache === void 0) { doUseCache = true; }
        this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, remarkRequestType, enums.WorklistType.directedRemark, responseMode, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.directedRemark, responseMode, remarkRequestType, examinerRoleId), doUseCache, isOnline, callback, subExaminerId, undefined, undefined, includePromotedAsSeedResponses);
    };
    /**
     * Make ajax call and return worklist details
     * @param examinerRoleId
     * @param markSchemeGroupId
     * @param questionPaperId
     * @param remarkRequestType
     * @param worklistType
     * @param responseMode
     * @param memoryStorageKey
     * @param doUseCache
     * @param isOnline
     * @param callback
     * @param subExaminerId
     * @param isHelpExaminersView
     * @param isMarkCheckWorklist
     * @param includePromotedAsSeedResponses
     */
    WorklistDataService.prototype.GetWorklistDetailsFromServer = function (examinerRoleId, markSchemeGroupId, questionPaperId, remarkRequestType, worklistType, responseMode, memoryStorageKey, doUseCache, isOnline, callback, subExaminerId, isMarkCheckWorklist, isHelpExaminersView, includePromotedAsSeedResponses) {
        if (doUseCache === void 0) { doUseCache = true; }
        if (isOnline === void 0) { isOnline = true; }
        if (isMarkCheckWorklist === void 0) { isMarkCheckWorklist = false; }
        if (isHelpExaminersView === void 0) { isHelpExaminersView = false; }
        if (includePromotedAsSeedResponses === void 0) { includePromotedAsSeedResponses = false; }
        var that = this;
        if (doUseCache) {
            /* Getting data from storage adapter using key */
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('worklist', memoryStorageKey, true, config.
                cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                /* if the data ahs been received from storage adapter, return the result */
                callback(true, true, (jsonResult.value));
            }).catch(function (jsonResult) {
                that.makeAjaxCallToGetResponseDetails(examinerRoleId, markSchemeGroupId, questionPaperId, remarkRequestType, worklistType, responseMode, memoryStorageKey, isOnline, subExaminerId, isHelpExaminersView, isMarkCheckWorklist, includePromotedAsSeedResponses, callback);
            });
        }
        else {
            that.makeAjaxCallToGetResponseDetails(examinerRoleId, markSchemeGroupId, questionPaperId, remarkRequestType, worklistType, responseMode, memoryStorageKey, isOnline, subExaminerId, isHelpExaminersView, isMarkCheckWorklist, includePromotedAsSeedResponses, callback);
        }
    };
    /**
     * Get directed remark worklist details
     * @param markSchemeGroupId
     * @param examinerRoleId
     * @param questionPaperId
     * @param remarkRequestType
     * @param responseMode
     * @param doUseCache
     * @param isOnline
     * @param callback
     */
    WorklistDataService.prototype.GetRemarkWorklistDetails = function (markSchemeGroupId, examinerRoleId, questionPaperId, remarkRequestType, responseMode, doUseCache, isOnline, subExaminerId, includePromotedAsSeedResponses, callback) {
        if (doUseCache === void 0) { doUseCache = true; }
        this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, remarkRequestType, enums.WorklistType.pooledRemark, responseMode, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.pooledRemark, responseMode, remarkRequestType, examinerRoleId), doUseCache, isOnline, callback, subExaminerId, undefined, undefined, includePromotedAsSeedResponses);
    };
    /**
     * Getting live worklist details
     * @param shouldCache
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param includePromotedAsSeedResponses
     * @param callback
     */
    WorklistDataService.prototype.GetSimulationWorklistDetails = function (markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, isHelpExaminerView, isMarkCheckWorklist, includePromotedAsSeedResponses, callback) {
        if (doUseCache === void 0) { doUseCache = true; }
        this.GetWorklistDetailsFromServer(examinerRoleId, markSchemeGroupId, questionPaperId, enums.RemarkRequestType.Unknown, enums.WorklistType.simulation, enums.ResponseMode.open, this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(enums.WorklistType.simulation, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId), doUseCache, isOnline, callback, subExaminerId, isMarkCheckWorklist);
    };
    return WorklistDataService;
}(dataServiceBase));
var worklistDataService = new WorklistDataService();
module.exports = worklistDataService;
//# sourceMappingURL=worklistdataservice.js.map