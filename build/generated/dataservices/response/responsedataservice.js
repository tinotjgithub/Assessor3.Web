"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var enums = require('../../components/utility/enums');
var storageAdapterFactory = require('../storageadapters/storageadapterfactory');
var qigStore = require('../../stores/qigselector/qigstore');
var storageAdapterHelper = require('../storageadapters/storageadapterhelper');
var worklistStore = require('../../stores/worklist/workliststore');
var Immutable = require('immutable');
var ResponseDataService = (function (_super) {
    __extends(ResponseDataService, _super);
    function ResponseDataService() {
        _super.apply(this, arguments);
        this._retrieveMarksAndAnnotationsRequestsQueue = new Array();
        this._storageAdapterHelper = new storageAdapterHelper();
    }
    /**
     * Method which makes the AJAX call to allocate new responses
     * @param allocateargs
     * @param callback
     */
    ResponseDataService.prototype.allocateResponse = function (allocateargs, callback) {
        var url = urls.RESPONSE_ALLOCATION_GET_URL;
        var allocateJson = JSON.stringify(allocateargs);
        /**  Making AJAX call to get the allocated response */
        var responseAllocationPromise = this.makeAJAXCall('POST', url, allocateJson);
        responseAllocationPromise.then(function (data) {
            if (callback) {
                callback(JSON.parse(data), true);
            }
        }).catch(function (data) {
            if (callback) {
                callback(data, false);
            }
        });
    };
    /**
     * accept quality feedback arguments
     * @param acceptQualityFeedbackArguments
     * @param callback
     */
    ResponseDataService.prototype.acceptQualityFeedback = function (acceptQualityFeedbackArguments, callback) {
        var url = urls.ACCEPT_QUALITY_FEEDBACK_URL;
        var acceptQualityJson = JSON.stringify(acceptQualityFeedbackArguments);
        var that = this;
        /**  Making AJAX call to accept the quality */
        var acceptQualityPromise = this.makeAJAXCall('POST', url, acceptQualityJson);
        acceptQualityPromise.then(function (data) {
            if (callback) {
                var jsonData = JSON.parse(data);
                that.clearMarkerCache(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                callback(jsonData, true);
            }
        }).catch(function (data) {
            if (callback) {
                callback(data, false);
            }
        });
    };
    /**
     * Clear the marker information data in certain scenarios
     * @param examinerRoleId
     * @param submissionResult
     */
    ResponseDataService.prototype.clearMarkerCache = function (examinerRoleId) {
        storageAdapterFactory.getInstance().deleteData('marker', 'markerInformation_' + examinerRoleId).catch();
    };
    /**
     * Retreive marks and annotations
     * @param retrieveMarksArg
     * @param markGroupId
     * @param priority
     * @param callback
     */
    ResponseDataService.prototype.retrieveMarksAndAnnotations = function (retrieveMarksArg, markGroupId, priority, callback) {
        var that = this;
        // if mark and annotation loading for markGroupId is not in progress make a call.
        if (this._retrieveMarksAndAnnotationsRequestsQueue.indexOf(markGroupId) === -1) {
            var url = urls.RETRIEVE_MARKS_AND_ANNOTATIONS_URL;
            var retrieveMarksJSON = JSON.stringify(retrieveMarksArg);
            /**  Making AJAX call to get the marks and annotations */
            var retrieveMarksAndAnnotationsPromise = this.makeAJAXCall('POST', url, retrieveMarksJSON, true, true, priority);
            if (retrieveMarksAndAnnotationsPromise !== undefined && retrieveMarksAndAnnotationsPromise != null &&
                that._retrieveMarksAndAnnotationsRequestsQueue.indexOf(markGroupId) === -1) {
                that._retrieveMarksAndAnnotationsRequestsQueue.push(markGroupId);
            }
            retrieveMarksAndAnnotationsPromise.then(function (data) {
                if (callback) {
                    var jsonData = that.getImmutableInRetrieveMarksData(JSON.parse(data));
                    callback(jsonData, true);
                    // call executed successfully remove the entry
                    that.removeMarksAndAnnotationsRequestsQueueItem(markGroupId);
                }
            }).catch(function (data) {
                // if call is not executed remove the added entry
                that.removeMarksAndAnnotationsRequestsQueueItem(markGroupId);
                if (callback) {
                    callback(data, false);
                }
            });
        }
    };
    /**
     * This method will remove items from Marks and Annotations requests queue.
     * @param markGroupId
     */
    ResponseDataService.prototype.removeMarksAndAnnotationsRequestsQueueItem = function (markGroupId) {
        var index = this._retrieveMarksAndAnnotationsRequestsQueue.indexOf(markGroupId);
        if (index !== -1) {
            this._retrieveMarksAndAnnotationsRequestsQueue.splice(index, 1);
        }
    };
    /**
     * Save marks and Annotations
     * @param saveMarksAndAnnotationsArgs
     * @param callback
     */
    ResponseDataService.prototype.saveMarksAndAnnotations = function (saveMarksAndAnnotationsArgs, priority, successCallback, failureCallback) {
        var url = urls.SAVE_MARKS_AND_ANNOTATIONS_URL;
        var marksAndAnnotationsJson = JSON.stringify(saveMarksAndAnnotationsArgs);
        /**  Making AJAX call to save the marks and annotations */
        var saveMarksAndAnnotationsPromise = this.makeAJAXCall('POST', url, marksAndAnnotationsJson, false, false, priority);
        var that = this;
        saveMarksAndAnnotationsPromise.then(function (data) {
            if (successCallback) {
                var formattedData = that.getImmutableInSaveMarksData(JSON.parse(data));
                successCallback(formattedData, true);
            }
        }).catch(function (data) {
            if (failureCallback) {
                failureCallback(data, false, data.errorType);
            }
        });
    };
    /**
     * Get the Response Related Data for Opening the response
     * @param displayId
     * @param markGroupId
     * @param esMarkGroupId
     * @param callback
     */
    ResponseDataService.prototype.getResponseDetails = function (displayId, markGroupId, esMarkGroupId, candidateScriptId, callback) {
        var url = urls.RESPONSE_DATA_GET_URL;
        var arg = { displayId: displayId, markGroupId: markGroupId, esMarkGroupId: esMarkGroupId, candidateScriptId: candidateScriptId };
        var saveMarksAndAnnotationsPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg), true, false);
        saveMarksAndAnnotationsPromise.then(function (data) {
            callback(JSON.parse(data), true);
        }).catch(function (data) {
            callback(data, false);
        });
    };
    /**
     * Get the supervisor remark data to check if remark already raised for the response.
     * @param displayId
     * @param markGroupId
     * @param esMarkGroupId
     * @param callback
     */
    ResponseDataService.prototype.getResponseDetailsForSupervisorRemark = function (candidateScriptId, markSchemeGroupId, selectedExaminerId, isWholeResponse, callback) {
        var url = urls.SUPERVISOR_REMARK_DATA_GET_URL;
        var arg = {
            candidateScriptId: candidateScriptId,
            markSchemeGroupId: markSchemeGroupId,
            selectedExaminerId: selectedExaminerId,
            isWholeResponse: isWholeResponse
        };
        var supervisorRemarkPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg), true, false);
        supervisorRemarkPromise.then(function (data) {
            callback(JSON.parse(data), true);
        }).catch(function (data) {
            callback(data, false);
        });
    };
    /**
     * Method which makes the AJAX call to create the supervisor remark.
     * @param requestRemarkArguments
     * @param callback
     */
    ResponseDataService.prototype.createSupervisorRemark = function (requestRemarkArguments, callback) {
        var url = urls.SUPERISOR_REMARK_CREATE_URL;
        var that = this;
        ////  Making AJAX call to get the data
        var remarkPromise = this.makeAJAXCall('POST', url, JSON.stringify(requestRemarkArguments), true, false);
        remarkPromise.then(function (json) {
            if (callback) {
                var result = JSON.parse(json);
                // If remark created succesfully, clear the data in the storage to get the latest details.
                if (result.remarkRequestCreatedCount > 0 && requestRemarkArguments.responseMode === enums.ResponseMode.pending) {
                    that._storageAdapterHelper.clearCacheByKey('worklist', that._storageAdapterHelper.getMemoryStorageKeyForWorklistData(requestRemarkArguments.worklistType, enums.ResponseMode.pending, requestRemarkArguments.remarkRequestType, requestRemarkArguments.examinerRoleId));
                    that._storageAdapterHelper.clearCacheByKey('worklist', that._storageAdapterHelper.getMemoryStorageKeyForWorklistData(requestRemarkArguments.worklistType, enums.ResponseMode.closed, requestRemarkArguments.remarkRequestType, requestRemarkArguments.examinerRoleId));
                    that._storageAdapterHelper.clearCacheByKey('marker', 'markerProgress_' + requestRemarkArguments.examinerRoleId);
                }
                callback(true, result);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Method which makes the AJAX call to promote a response to seed.
     * @param promoteToSeedArguments
     * @param callback
     */
    ResponseDataService.prototype.promoteToSeed = function (promoteToSeedArguments, callback) {
        var url = urls.PROMOTE_TO_SEED_URL;
        var that = this;
        ////  Making AJAX call to get the data
        var remarkPromise = this.makeAJAXCall('POST', url, JSON.stringify(promoteToSeedArguments), true, false);
        remarkPromise.then(function (json) {
            if (callback) {
                var result = JSON.parse(json);
                // If remark created succesfully, clear the data in the storage to get the latest details.
                if (promoteToSeedArguments.responseMode !== enums.ResponseMode.open) {
                    that._storageAdapterHelper.clearCacheByKey('worklist', that._storageAdapterHelper.getMemoryStorageKeyForWorklistData(worklistStore.instance.currentWorklistType, enums.ResponseMode.pending, worklistStore.instance.getRemarkRequestType, promoteToSeedArguments.examinerRoleId));
                    that._storageAdapterHelper.clearCacheByKey('worklist', that._storageAdapterHelper.getMemoryStorageKeyForWorklistData(worklistStore.instance.currentWorklistType, enums.ResponseMode.closed, worklistStore.instance.getRemarkRequestType, promoteToSeedArguments.examinerRoleId));
                    that._storageAdapterHelper.clearCacheByKey('marker', 'markerProgress_' + promoteToSeedArguments.examinerRoleId);
                }
                callback(true, result);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Search Atypical Response
     */
    ResponseDataService.prototype.SearchAtypicalResponse = function (searchAtypicalResponseArgument, callback) {
        var url = urls.SEARCH_ATYPICAL_RESPONSE;
        var searchAtypicalResponse = this.makeAJAXCall('POST', url, JSON.stringify(searchAtypicalResponseArgument));
        searchAtypicalResponse.then(function (json) {
            callback(JSON.parse(json), true);
        }).catch(function (json) {
            callback(undefined, false);
        });
    };
    /**
     * method for reject rig ajax call.
     * @param callback
     * @param rejectRigArguments
     */
    ResponseDataService.prototype.RejectRig = function (rejectRigArguments, callback) {
        var workListType = worklistStore.instance.currentWorklistType;
        var markingMode = worklistStore.instance.getMarkingModeByWorkListType(workListType);
        var remarkRequestType = worklistStore.instance.getRemarkRequestType;
        var url = urls.REJECT_RIG_URL;
        var that = this;
        //Method to make ajax call.
        var rejectRigPromise = this.makeAJAXCall('POST', url, JSON.stringify(rejectRigArguments), true, false);
        rejectRigPromise.then(function (json) {
            if (callback) {
                var result = JSON.parse(json);
                callback(result.success, result);
                if (result.success) {
                    that._storageAdapterHelper.clearStorageArea('messaging');
                    that._storageAdapterHelper.clearCache(rejectRigArguments.markSchemeGroupId, markingMode, remarkRequestType, rejectRigArguments.examinerRoleId, workListType);
                }
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Method which makes the AJAX call to check if remarks raised against the response.
     * @param promoteToSeedArguments
     * @param callback
     */
    ResponseDataService.prototype.promoteToSeedCheckRemark = function (promoteToSeedArguments, callback) {
        var url = urls.PROMOTE_TO_SEED_VALIDATION_URL;
        var that = this;
        ////  Making AJAX call to get the data
        var remarkPromise = this.makeAJAXCall('POST', url, JSON.stringify(promoteToSeedArguments), true, false);
        remarkPromise.then(function (json) {
            if (callback) {
                var result = JSON.parse(json);
                callback(true, result);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Method which makes the AJAX call to promote response to reuse bucket.
     * @param promoteToSeedArguments
     * @param callback
     */
    ResponseDataService.prototype.promoteToReuseBucket = function (promoteToReuseBucketArguments, callback) {
        var url = urls.PROMOTE_TO_REUSE_BUCKET_URL;
        var that = this;
        var promoteReusePromise = this.makeAJAXCall('POST', url, JSON.stringify(promoteToReuseBucketArguments), true, false);
        promoteReusePromise.then(function (json) {
            if (callback) {
                var result = JSON.parse(json);
                callback(true, result);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Method which makes the AJAX call to validate the response(if the response is withdrwan or not)
     * @param markGroupId
     * @param callback
     */
    ResponseDataService.prototype.validateResponse = function (markGroupId, markSchemeGroupId, examinerRoleId, callback) {
        var url = urls.VALIDATE_RESPONSE_URL + '/' + markGroupId + '/' + markSchemeGroupId + '/' + examinerRoleId;
        var that = this;
        var validateResponsePromise = this.makeAJAXCall('POST', url, JSON.stringify(markGroupId), true, false);
        validateResponsePromise.then(function (json) {
            if (callback) {
                var result = JSON.parse(json);
                callback(true, result);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Method which makes the AJAX call to validate the script(if itswithdrwan or not)
     * @param candidateScriptId
     * @param markSchemeGroupId
     * @param callback
     */
    ResponseDataService.prototype.validateCentreScriptResponse = function (candidateScriptId, markSchemeGroupId, callback) {
        var url = urls.VALIDATE_CENTRESCRIPT_RESPONSE_URL + '/' + candidateScriptId + '/' + markSchemeGroupId;
        var that = this;
        var validateResponsePromise = this.makeAJAXCall('POST', url, '', true, false);
        validateResponsePromise.then(function (json) {
            if (callback) {
                var result = JSON.parse(json);
                callback(true, result);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Change json object to immutable Map for Retrieve marks
     * @param data examinerMarkData
     */
    ResponseDataService.prototype.getImmutableInRetrieveMarksData = function (data) {
        var immutableMap = Immutable.Map(data.wholeResponseQIGToRIGMapping);
        data.wholeResponseQIGToRIGMapping = immutableMap;
        return data;
    };
    /**
     * Change json object to immutable list in Save marks and annotations return
     * @param data saveMarksAndAnnotationsReturn
     */
    ResponseDataService.prototype.getImmutableInSaveMarksData = function (data) {
        var updatedMarkAnnotationDetails = data.updatedMarkAnnotationDetails ? Immutable.Map(data.updatedMarkAnnotationDetails) : null;
        var updatedMarkGroupVersions = Immutable.Map(data.updatedMarkGroupVersions);
        var marksAndAnnotationsMismatch = Immutable.Map(data.marksAndAnnotationsMismatch);
        var markSchemesHavingAnnotationsMismatch = Immutable.List(data.markSchemesHavingAnnotationsMismatch);
        data.updatedMarkAnnotationDetails = updatedMarkAnnotationDetails;
        data.updatedMarkGroupVersions = updatedMarkGroupVersions;
        data.marksAndAnnotationsMismatch = marksAndAnnotationsMismatch;
        data.markSchemesHavingAnnotationsMismatch = markSchemesHavingAnnotationsMismatch;
        return data;
    };
    return ResponseDataService;
}(dataServiceBase));
var responseDataService = new ResponseDataService();
module.exports = responseDataService;
//# sourceMappingURL=responsedataservice.js.map