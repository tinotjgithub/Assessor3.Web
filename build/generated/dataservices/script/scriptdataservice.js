"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var Immutable = require('immutable');
var enums = require('../../components/utility/enums');
var ScriptDataService = (function (_super) {
    __extends(ScriptDataService, _super);
    function ScriptDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Method which converts the candidate response metadata collection to an Immutable List
     * @param data
     */
    ScriptDataService.prototype.getImmutable = function (data) {
        data.scriptImageList = Immutable.List(data.scriptImageList);
        return data;
    };
    /**
     * Method which converts the image zone collection to an Immutable collection
     * @param data
     */
    ScriptDataService.prototype.getImmutableImageZoneCollection = function (data) {
        data.candidateScriptImageZoneCollection = Immutable.List(data.candidateScriptImageZoneCollection);
        return data;
    };
    /**
     * Method to initiate the AJAX call to fetch the candidate responses' metadata
     * @param candidateResponseMetadataArgument
     * @param isMarkByCandidate
     * @param includeRelatedQigs
     * @param callback
     */
    ScriptDataService.prototype.fetchCandidateScriptMetadata = function (candidateResponseMetadataArgument, isMarkByCandidate, includeRelatedQigs, callback) {
        if (includeRelatedQigs === void 0) { includeRelatedQigs = false; }
        var url = isMarkByCandidate ? urls.CANDIDATE_RESPONSE_METADATA_BY_MBC_URL : urls.CANDIDATE_RESPONSE_METADATA_BY_MBQ_URL;
        var that = this;
        var candidateResponseMetadataArgumentJson = JSON.stringify(candidateResponseMetadataArgument);
        /**  Making AJAX call to get the candidate response metadata */
        var candidateResponseMetadataPromise = this.makeAJAXCall('POST', url, candidateResponseMetadataArgumentJson);
        candidateResponseMetadataPromise.then(function (json) {
            if (callback) {
                var candidateResponseMetadata = that.getImmutable(JSON.parse(json));
                callback(true, candidateResponseMetadata);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Get the images
     * @param imageURL
     * @param callback
     */
    ScriptDataService.prototype.getImage = function (imageURL, callback) {
        var promise = this.makeAJAXCallWithoutDatatype('GET', imageURL);
        promise.then(function () {
            callback(true, null);
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Method which converts the candidate e-course work file metadata collection to an Immutable List
     * @param data
     */
    ScriptDataService.prototype.getImmutableCourseFileList = function (data) {
        data.fileList = Immutable.List(data.fileList);
        return data;
    };
    /**
     * Method to initiate the AJAX call to fetch the candidate e-course work metadata
     * @param candidateECourseWorkMetaDataArgument
     * @param priority
     * @param callback
     */
    ScriptDataService.prototype.fetchCandidateECourseWorkMetadata = function (candidateECourseWorkMetaDataArgument, priority, callback) {
        if (priority === void 0) { priority = enums.Priority.First; }
        var url = urls.GET_ECOURSE_WORK_FILES_META_DATA;
        var that = this;
        var candidateECourseWorkMetadataArgumentJson = JSON.stringify(candidateECourseWorkMetaDataArgument);
        var candidateECourseWorkMetadataPromise = this.makeAJAXCall('POST', url, candidateECourseWorkMetadataArgumentJson, true, true, priority);
        candidateECourseWorkMetadataPromise.then(function (json) {
            if (callback) {
                var candidateECourseWorkMetadata = that.getImmutableCourseFileList(JSON.parse(json));
                callback(true, candidateECourseWorkMetadata);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Method to initiate the AJAX call to fetch the candidate's image zone details.
     * @param candidateScriptId
     * @param priority
     * @param callback
     */
    ScriptDataService.prototype.getCandidateScriptImageZones = function (candidateScriptId, priority, callback) {
        var url = urls.GET_CANDIDATE_SCRIPT_IMAGE_ZONES + '/' + candidateScriptId;
        var that = this;
        var candidateScriptImageZonesPromise = this.makeAJAXCall('GET', url, '', true, true);
        candidateScriptImageZonesPromise.then(function (json) {
            if (callback) {
                var candidateScriptImageZones = that.getImmutableImageZoneCollection(JSON.parse(json));
                callback(true, candidateScriptImageZones);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    return ScriptDataService;
}(dataServiceBase));
var scriptDataService = new ScriptDataService();
module.exports = scriptDataService;
//# sourceMappingURL=scriptdataservice.js.map