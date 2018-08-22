"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var scriptDataService = require('../../dataservices/script/scriptdataservice');
var candidateScriptMetadataRetrievalAction = require('./candidatescriptmetadataretrievalaction');
var actionType = require('../base/actiontypes');
var candidateResponseMetadataArgument = require('../../dataservices/script/candidateresponsemetadataargument');
var additionalObjectFlagSaveAction = require('./additionalobjectflagsaveaction');
var Promise = require('es6-promise');
var base = require('../base/actioncreatorbase');
var candidateECourseWorkMetadataArgument = require('../../dataservices/script/candidateecourseworkmetadataargument');
var candidateECourseWorkMetadataRetrievalAction = require('./candidateecourseworkmetadataretrievalaction');
var enums = require('../../components/utility/enums');
var candidateEBookMarkImageZoneRetrievalAction = require('./candidateebookmarkimagezoneretrievalaction');
var ScriptActionCreator = (function (_super) {
    __extends(ScriptActionCreator, _super);
    function ScriptActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Method to fetch the candidate script metadata collection
     * @param candidateScriptInfoCollection
     * @param questionPaperId
     * @param markSchemeGroupId
     * @param isMarkByCandidate
     * @param includeRelatedQigs
     * @param isAutoRefreshCall
     * @param isECourseworkComponent
     * @param isMarkFromObject
     */
    ScriptActionCreator.prototype.fetchCandidateScriptMetadata = function (candidateScriptInfoCollection, questionPaperId, markSchemeGroupId, isMarkByCandidate, includeRelatedQigs, isAutoRefreshCall, isECourseworkComponent, isEBookMarkingComponent, selectedWorklist, isAwarding, suppressPagesInAwarding, isMarkFromObject) {
        if (selectedWorklist === void 0) { selectedWorklist = enums.StandardisationSetup.None; }
        if (isAwarding === void 0) { isAwarding = false; }
        if (suppressPagesInAwarding === void 0) { suppressPagesInAwarding = false; }
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            var candidateResponseMetadataArg = new candidateResponseMetadataArgument(candidateScriptInfoCollection, markSchemeGroupId, questionPaperId, isECourseworkComponent, isEBookMarkingComponent, isAwarding, suppressPagesInAwarding, isMarkFromObject);
            scriptDataService.fetchCandidateScriptMetadata(candidateResponseMetadataArg, isMarkByCandidate, includeRelatedQigs, function (success, candidateResponseMetadata) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(candidateResponseMetadata)) {
                    if (!success) {
                        candidateResponseMetadata = undefined;
                    }
                    dispatcher.dispatch(new candidateScriptMetadataRetrievalAction(actionType.CANDIDATE_SCRIPT_METADATA_RETRIEVED, markSchemeGroupId, questionPaperId, candidateResponseMetadata, isAutoRefreshCall, selectedWorklist));
                    resolve(candidateResponseMetadata);
                }
                else {
                    reject(null);
                }
            });
        });
    };
    /**
     * Refresh the images.
     * @param images
     */
    ScriptActionCreator.prototype.getImages = function (images) {
        var that = this;
        var promises = images.map(function (image) {
            var promise = new Promise.Promise(function (resolve, reject) {
                scriptDataService.getImage(image, function (success, json) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(json, true, true)) {
                        /* tslint:disable:no-console */
                        // console.log('image promise completed for url - ' + image + ' Call status-' + success);
                        /* tslint:enable:no-console */
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            });
            return promise;
        });
        return promises;
    };
    /**
     * saves additional object flag collection to store.
     * @param collection
     * @param displayId
     */
    ScriptActionCreator.prototype.saveAdditionalObjectFlagCollection = function (collection, displayId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new additionalObjectFlagSaveAction(collection, displayId));
        }).catch();
    };
    /**
     * method to fetch candidates e-course work files metadata
     * @param candidateScriptInfoCollection
     * @param examinerId
     * @param priority
     */
    ScriptActionCreator.prototype.fetchECourseWorkCandidateScriptMetadata = function (candidateScriptInfoCollection, examinerId, examinerRoleId, priority, isStandardisationSetupMode) {
        if (priority === void 0) { priority = enums.Priority.First; }
        if (isStandardisationSetupMode === void 0) { isStandardisationSetupMode = false; }
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            var candidateECourseWorkMetadataArg = new candidateECourseWorkMetadataArgument(candidateScriptInfoCollection, examinerId, examinerRoleId, isStandardisationSetupMode);
            scriptDataService.fetchCandidateECourseWorkMetadata(candidateECourseWorkMetadataArg, priority, function (success, candidateECourseWorkMetadata) {
                if (that.validateCall(candidateECourseWorkMetadata, false, true)) {
                    if (!success) {
                        candidateECourseWorkMetadata = undefined;
                    }
                    dispatcher.dispatch(new candidateECourseWorkMetadataRetrievalAction(actionType.CANDIDATE_ECOURSE_WORK_METADATA_RETRIEVED, candidateECourseWorkMetadata));
                    resolve(candidateECourseWorkMetadata);
                }
                else {
                    reject(null);
                }
            });
        });
    };
    /**
     * Get ebookmarking image zones against a particular script.
     * @param candidateScriptId
     * @param priority
     */
    ScriptActionCreator.prototype.getCandidateScriptImageZones = function (candidateScriptId, priority) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            // Call data service method.
            scriptDataService.getCandidateScriptImageZones(candidateScriptId, priority, function (success, imageZoneCollection) {
                if (that.validateCall(imageZoneCollection)) {
                    if (!success) {
                        imageZoneCollection = undefined;
                    }
                    // dispatch Ebookmark Image zone get action to load the store.
                    dispatcher.dispatch(new candidateEBookMarkImageZoneRetrievalAction(actionType.GET_EBOOKMARK_IMAGE_ZONE, imageZoneCollection));
                    resolve(imageZoneCollection);
                }
                else {
                    reject(null);
                }
            });
        });
    };
    return ScriptActionCreator;
}(base));
var scriptActionCreator = new ScriptActionCreator();
module.exports = scriptActionCreator;
//# sourceMappingURL=scriptactioncreator.js.map