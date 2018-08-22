import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import candidateResponseMetadataArgument = require('./candidateresponsemetadataargument');
import candidateResponseMetadata = require('../../stores/script/typings/candidateresponsemetadata');
import Immutable = require('immutable');
import candidateECourseWorkMetaDataArgument = require('./candidateecourseworkmetadataargument');
import candidateECourseWorkMetadata = require('../../stores/script/typings/candidateecourseworkmetadata');
import enums = require('../../components/utility/enums');
import candidateEbookMarkImageZoneCollection = require('../../stores/script/typings/candidateebookmarkimagezonecollection');

class ScriptDataService extends dataServiceBase {
    /**
     * Method which converts the candidate response metadata collection to an Immutable List
     * @param data
     */
    private getImmutable(data: candidateResponseMetadata): candidateResponseMetadata {
        data.scriptImageList = Immutable.List(data.scriptImageList);
        return data;
    }

    /**
     * Method which converts the image zone collection to an Immutable collection
     * @param data
     */
    private getImmutableImageZoneCollection(data: candidateEbookMarkImageZoneCollection): candidateEbookMarkImageZoneCollection {
        data.candidateScriptImageZoneCollection = Immutable.List<ImageZone>(data.candidateScriptImageZoneCollection);
        return data;
    }

    /**
     * Method to initiate the AJAX call to fetch the candidate responses' metadata
     * @param candidateResponseMetadataArgument
     * @param isMarkByCandidate
     * @param includeRelatedQigs
     * @param callback
     */
    public fetchCandidateScriptMetadata(
        candidateResponseMetadataArgument: candidateResponseMetadataArgument,
        isMarkByCandidate: boolean,
        includeRelatedQigs: boolean = false,
        callback: ((success: boolean, json: candidateResponseMetadata) => void)
    ) {
        let url = isMarkByCandidate ? urls.CANDIDATE_RESPONSE_METADATA_BY_MBC_URL : urls.CANDIDATE_RESPONSE_METADATA_BY_MBQ_URL;

        let that = this;
        let candidateResponseMetadataArgumentJson = JSON.stringify(candidateResponseMetadataArgument);
        /**  Making AJAX call to get the candidate response metadata */
        let candidateResponseMetadataPromise = this.makeAJAXCall('POST', url, candidateResponseMetadataArgumentJson);
        candidateResponseMetadataPromise.then(function (json: any) {
            if (callback) {
                let candidateResponseMetadata = that.getImmutable(JSON.parse(json));
                callback(true, candidateResponseMetadata);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Get the images
     * @param imageURL
     * @param callback
     */
    public getImage(imageURL: string, callback: ((success: boolean, json: any) => void)) {
        let promise = this.makeAJAXCallWithoutDatatype('GET', imageURL);
        promise.then(() => {
            callback(true, null);
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Method which converts the candidate e-course work file metadata collection to an Immutable List
     * @param data
     */
    private getImmutableCourseFileList(data: candidateECourseWorkMetadata): candidateECourseWorkMetadata {
        data.fileList = Immutable.List(data.fileList);
        return data;
    }

    /**
     * Method to initiate the AJAX call to fetch the candidate e-course work metadata
     * @param candidateECourseWorkMetaDataArgument
     * @param priority
     * @param callback
     */
    public fetchCandidateECourseWorkMetadata(candidateECourseWorkMetaDataArgument: candidateECourseWorkMetaDataArgument,
        priority: enums.Priority = enums.Priority.First, callback: ((success: boolean, json: candidateECourseWorkMetadata) => void)) {
        let url = urls.GET_ECOURSE_WORK_FILES_META_DATA;
        let that = this;
        let candidateECourseWorkMetadataArgumentJson = JSON.stringify(candidateECourseWorkMetaDataArgument);
        let candidateECourseWorkMetadataPromise = this.makeAJAXCall('POST', url,
            candidateECourseWorkMetadataArgumentJson, true, true, priority);
        candidateECourseWorkMetadataPromise.then(function (json: any) {
            if (callback) {
                let candidateECourseWorkMetadata = that.getImmutableCourseFileList(JSON.parse(json));
                callback(true, candidateECourseWorkMetadata);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Method to initiate the AJAX call to fetch the candidate's image zone details.
     * @param candidateScriptId
     * @param priority
     * @param callback
     */
    public getCandidateScriptImageZones(candidateScriptId: number, priority: enums.Priority,
        callback: ((success: boolean, json: candidateEbookMarkImageZoneCollection) => void)) {

        let url = urls.GET_CANDIDATE_SCRIPT_IMAGE_ZONES + '/' + candidateScriptId;
        let that = this;

        let candidateScriptImageZonesPromise = this.makeAJAXCall('GET', url, '', true, true);
        candidateScriptImageZonesPromise.then(function (json: any) {
            if (callback) {
                let candidateScriptImageZones = that.getImmutableImageZoneCollection(JSON.parse(json));
                callback(true, candidateScriptImageZones);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }
}

let scriptDataService = new ScriptDataService();
export = scriptDataService;