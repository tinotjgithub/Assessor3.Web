import dispatcher = require('../../app/dispatcher');
import Immutable = require('immutable');
import scriptDataService = require('../../dataservices/script/scriptdataservice');
import candidateScriptMetadataRetrievalAction = require('./candidatescriptmetadataretrievalaction');
import refreshScriptAction = require('./refreshscriptaction');
import actionType = require('../base/actiontypes');
import candidateScriptInfo = require('../../dataservices/script/typings/candidatescriptinfo');
import candidateResponseMetadataArgument = require('../../dataservices/script/candidateresponsemetadataargument');
import candidateResponseMetadata = require('../../stores/script/typings/candidateresponsemetadata');
import additionalObjectFlagSaveAction = require('./additionalobjectflagsaveaction');
import Promise = require('es6-promise');
import base = require('../base/actioncreatorbase');
import candidateECourseWorkMetadataArgument = require('../../dataservices/script/candidateecourseworkmetadataargument');
import candidateECourseWorkMetadataRetrievalAction = require('./candidateecourseworkmetadataretrievalaction');
import candidateECourseWorkMetadata = require('../../stores/script/typings/candidateecourseworkmetadata');
import eCourseworkArgument = require('../../dataservices/script/typings/ecourseworkarguments');
import enums = require('../../components/utility/enums');
import candidateEBookMarkImageZoneRetrievalAction = require('./candidateebookmarkimagezoneretrievalaction');
import candidateEbookMarkImageZoneCollection = require('../../stores/script/typings/candidateebookmarkimagezonecollection');

class ScriptActionCreator extends base {
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
    public fetchCandidateScriptMetadata(
        candidateScriptInfoCollection: Immutable.List<candidateScriptInfo>,
        questionPaperId: number,
        markSchemeGroupId: number,
        isMarkByCandidate: boolean,
        includeRelatedQigs: boolean,
        isAutoRefreshCall: boolean,
        isECourseworkComponent: boolean,
        isEBookMarkingComponent: boolean,
        selectedWorklist: enums.StandardisationSetup = enums.StandardisationSetup.None,
        isAwarding: boolean = false,
        suppressPagesInAwarding: boolean = false,
        isMarkFromObject: boolean) {

        let that = this;

        let candidateResponseMetadataArg = new candidateResponseMetadataArgument(
            candidateScriptInfoCollection,
            markSchemeGroupId,
            questionPaperId,
            isECourseworkComponent,
            isEBookMarkingComponent,
            isAwarding,
            suppressPagesInAwarding,
            isMarkFromObject
        );
        return new Promise.Promise(function (resolve: any, reject: any) {
            scriptDataService.fetchCandidateScriptMetadata(
                candidateResponseMetadataArg,
                isMarkByCandidate,
                includeRelatedQigs,
                function (
                    success: boolean,
                    candidateResponseMetadata: candidateResponseMetadata
                ) {

                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(candidateResponseMetadata)) {
                        if (!success) {
                            candidateResponseMetadata = undefined;
                        }

                        dispatcher.dispatch(new candidateScriptMetadataRetrievalAction(actionType.CANDIDATE_SCRIPT_METADATA_RETRIEVED,
                            markSchemeGroupId,
                            questionPaperId,
                            candidateResponseMetadata,
                            isAutoRefreshCall,
                            selectedWorklist
                        ));
                        resolve(candidateResponseMetadata);
                    } else {
                        reject(null);
                    }
                });
        });
    }

    /**
     * Refresh the images.
     * @param images
     */
    public getImages(images: string[]): Promise<any>[] {
        let that = this;
        let promises = images.map((image: string) => {
            let promise = new Promise.Promise(function (resolve: any, reject: any) {
                scriptDataService.getImage(image, function (success: boolean, json: any) {

                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(json, true, true)) {

                        /* tslint:disable:no-console */
                        // console.log('image promise completed for url - ' + image + ' Call status-' + success);
                        /* tslint:enable:no-console */
                        resolve();
                    } else {
                        reject();
                    }
                });
            });

            return promise;
        });
        return promises;
    }

    /**
     * saves additional object flag collection to store.
     * @param collection
     * @param displayId
     */
    public saveAdditionalObjectFlagCollection(collection: Immutable.Map<number, boolean>, displayId: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new additionalObjectFlagSaveAction(collection, displayId));
        }).catch();
    }

    /**
     * method to fetch candidates e-course work files metadata
     * @param candidateScriptInfoCollection
     * @param examinerId
     * @param priority
     */
    public fetchECourseWorkCandidateScriptMetadata(candidateScriptInfoCollection: Immutable.List<eCourseworkArgument>,
        examinerId: number, examinerRoleId: number, priority: enums.Priority = enums.Priority.First,
        isStandardisationSetupMode: boolean = false, isSelectResponsesWorklist: boolean) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            let candidateECourseWorkMetadataArg = new candidateECourseWorkMetadataArgument(
                candidateScriptInfoCollection, examinerId, examinerRoleId, isStandardisationSetupMode);
            scriptDataService.fetchCandidateECourseWorkMetadata(candidateECourseWorkMetadataArg, priority,
                function (success: boolean, candidateECourseWorkMetadata: candidateECourseWorkMetadata) {
                    if (that.validateCall(candidateECourseWorkMetadata, false, true)) {
                        if (!success) {
                            candidateECourseWorkMetadata = undefined;
                        }
                        dispatcher.dispatch(new candidateECourseWorkMetadataRetrievalAction(
                            actionType.CANDIDATE_ECOURSE_WORK_METADATA_RETRIEVED,
                            candidateECourseWorkMetadata,
                            isSelectResponsesWorklist));
                        resolve(candidateECourseWorkMetadata);
                    } else {
                        reject(null);
                    }
                });
        });
    }

    /**
     * Get ebookmarking image zones against a particular script.
     * @param candidateScriptId
     * @param priority
     */
    public getCandidateScriptImageZones(candidateScriptId: number, priority: enums.Priority, questionPaperId: number) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {

            // Call data service method.
            scriptDataService.getCandidateScriptImageZones(candidateScriptId, priority,
                function (success: boolean, imageZoneCollection: candidateEbookMarkImageZoneCollection) {
                    if (that.validateCall(imageZoneCollection)) {
                        if (!success) {
                            imageZoneCollection = undefined;
                        }

                        // dispatch Ebookmark Image zone get action to load the store.
                        dispatcher.dispatch(new candidateEBookMarkImageZoneRetrievalAction(
                            actionType.GET_EBOOKMARK_IMAGE_ZONE,
                            imageZoneCollection,
                        questionPaperId));
                        resolve(imageZoneCollection);
                    } else {
                        reject(null);
                    }
                });
        });
    }
}

let scriptActionCreator = new ScriptActionCreator();
export = scriptActionCreator;