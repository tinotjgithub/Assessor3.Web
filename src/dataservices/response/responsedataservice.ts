import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import allocateArgument = require('./allocateargument');
import retrieveMarksArgument = require('../../dataservices/response/retrievemarksargument');
import allocatedResponseData = require('../../stores/response/typings/allocatedresponsedata');
import examinerMarkData = require('../../stores/response/typings/examinermarkdata');
import enums = require('../../components/utility/enums');
import saveMarksAndAnnotationsArgument = require('./savemarksandannotationsargument');
import acceptQualityFeedbackArguments = require('./acceptqualityfeedbackarguments');
import acceptQualityFeedbackReturn = require('../../stores/response/typings/acceptqualityfeedbackreturn');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
import qigStore = require('../../stores/qigselector/qigstore');
import storageAdapterHelper = require('../storageadapters/storageadapterhelper');
import worklistStore = require('../../stores/worklist/workliststore');
import promoteToSeedReturn = require('../../stores/response/typings/promotetoseedreturn');
import examinerRoleMarkGroupDetails = require('../../stores/response/typings/examinerrolemarkgroupdetails');
import Immutable = require('immutable');
import saveMarksAndAnnotationsReturn = require('../../stores/marking/typings/savemarksandannotationsreturn');

class ResponseDataService extends dataServiceBase {

    private _retrieveMarksAndAnnotationsRequestsQueue: number[] = new Array<number>();
    private _storageAdapterHelper = new storageAdapterHelper();
    /**
     * Method which makes the AJAX call to allocate new responses
     * @param allocateargs
     * @param callback
     */
    public allocateResponse(allocateargs: allocateArgument, callback: ((data: allocatedResponseData, success: boolean) => void)): void {

        let url = urls.RESPONSE_ALLOCATION_GET_URL;
        let allocateJson = JSON.stringify(allocateargs);

        /**  Making AJAX call to get the allocated response */
        let responseAllocationPromise = this.makeAJAXCall('POST', url, allocateJson);

        responseAllocationPromise.then(function (data: any) {
            if (callback) {
                callback(JSON.parse(data), true);
            }
        }).catch(function (data: any) {
            if (callback) {
                callback(data, false);
            }
        });
    }

    /**
     * accept quality feedback arguments
     * @param acceptQualityFeedbackArguments
     * @param callback
     */
    public acceptQualityFeedback(acceptQualityFeedbackArguments: acceptQualityFeedbackArguments,
        callback: ((data: acceptQualityFeedbackReturn, success: boolean) => void)): void {
        let url = urls.ACCEPT_QUALITY_FEEDBACK_URL;
        let acceptQualityJson = JSON.stringify(acceptQualityFeedbackArguments);
        let that = this;
        /**  Making AJAX call to accept the quality */
        let acceptQualityPromise = this.makeAJAXCall('POST', url, acceptQualityJson);

        acceptQualityPromise.then(function (data: any) {
            if (callback) {
                let jsonData = JSON.parse(data);
                that.clearMarkerCache(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                callback(jsonData, true);
            }
        }).catch(function (data: any) {
            if (callback) {
                callback(data, false);
            }
        });
    }

    /**
     * Clear the marker information data in certain scenarios
     * @param examinerRoleId
     * @param submissionResult
     */
    private clearMarkerCache(
        examinerRoleId: number) {
        storageAdapterFactory.getInstance().deleteData('marker', 'markerInformation_' + examinerRoleId).catch();
    }

    /**
     * Retreive marks and annotations
     * @param retrieveMarksArg
     * @param markGroupId
     * @param priority
     * @param callback
     */
    public retrieveMarksAndAnnotations(retrieveMarksArg: retrieveMarksArgument, markGroupId: number,
        priority: enums.Priority, callback: ((data: examinerMarkData, success: boolean) => void)): void {
        let that = this;
        // if mark and annotation loading for markGroupId is not in progress make a call.
        if (this._retrieveMarksAndAnnotationsRequestsQueue.indexOf(markGroupId) === -1) {
            let url = urls.RETRIEVE_MARKS_AND_ANNOTATIONS_URL;
            let retrieveMarksJSON = JSON.stringify(retrieveMarksArg);

            /**  Making AJAX call to get the marks and annotations */
            let retrieveMarksAndAnnotationsPromise = this.makeAJAXCall('POST', url, retrieveMarksJSON, true, true, priority);

            if (retrieveMarksAndAnnotationsPromise !== undefined && retrieveMarksAndAnnotationsPromise != null &&
                that._retrieveMarksAndAnnotationsRequestsQueue.indexOf(markGroupId) === -1) {
                that._retrieveMarksAndAnnotationsRequestsQueue.push(markGroupId);
            }

            retrieveMarksAndAnnotationsPromise.then(function (data: any) {
                if (callback) {
                    let jsonData = that.getImmutableInRetrieveMarksData(JSON.parse(data));
                    callback(jsonData, true);

                    // call executed successfully remove the entry
                    that.removeMarksAndAnnotationsRequestsQueueItem(markGroupId);
                }
            }).catch(function (data: any) {
                // if call is not executed remove the added entry
                that.removeMarksAndAnnotationsRequestsQueueItem(markGroupId);

                if (callback) {
                    callback(data, false);
                }
            });
        }
    }

    /**
     * This method will remove items from Marks and Annotations requests queue.
     * @param markGroupId
     */
    public removeMarksAndAnnotationsRequestsQueueItem(markGroupId: number) {
        let index = this._retrieveMarksAndAnnotationsRequestsQueue.indexOf(markGroupId);
        if (index !== -1) {
            this._retrieveMarksAndAnnotationsRequestsQueue.splice(index, 1);
        }
    }

    /**
     * Save marks and Annotations
     * @param saveMarksAndAnnotationsArgs
     * @param callback
     */
    public saveMarksAndAnnotations(saveMarksAndAnnotationsArgs: saveMarksAndAnnotationsArgument, priority: enums.Priority,
        successCallback: ((data: saveMarksAndAnnotationsReturn, success: boolean) => void),
        failureCallback: ((data: saveMarksAndAnnotationsReturn, success: boolean,
            dataServiceRequestErrorType: enums.DataServiceRequestErrorType) => void)): void {

        let url = urls.SAVE_MARKS_AND_ANNOTATIONS_URL;
        let marksAndAnnotationsJson = JSON.stringify(saveMarksAndAnnotationsArgs);

        /**  Making AJAX call to save the marks and annotations */
        let saveMarksAndAnnotationsPromise = this.makeAJAXCall('POST', url, marksAndAnnotationsJson, false, false, priority);
        let that = this;
        saveMarksAndAnnotationsPromise.then(function (data: any) {
            if (successCallback) {
                let formattedData: saveMarksAndAnnotationsReturn = that.getImmutableInSaveMarksData(JSON.parse(data));
                successCallback(formattedData, true);
            }
        }).catch(function (data: any) {
            if (failureCallback) {
                failureCallback(data, false, data.errorType);
            }
        });
    }

    /**
     * Get the Response Related Data for Opening the response
     * @param displayId
     * @param markGroupId
     * @param esMarkGroupId
     * @param callback
     */
    public getResponseDetails(
        displayId: string,
        markGroupId: number,
        esMarkGroupId: number,
        candidateScriptId: number,
        callback: (data: any, success: boolean) => void) {

        let url = urls.RESPONSE_DATA_GET_URL;

        let arg = { displayId: displayId, markGroupId: markGroupId, esMarkGroupId: esMarkGroupId, candidateScriptId: candidateScriptId };

        let saveMarksAndAnnotationsPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg), true, false);

        saveMarksAndAnnotationsPromise.then(function (data: any) {
            callback(JSON.parse(data), true);
        }).catch(function (data: any) {
            callback(data, false);
        });
    }

    /**
     * Get the supervisor remark data to check if remark already raised for the response.
     * @param displayId
     * @param markGroupId
     * @param esMarkGroupId
     * @param callback
     */
    public getResponseDetailsForSupervisorRemark(
        candidateScriptId: number,
        markSchemeGroupId: number,
        selectedExaminerId: number,
        isWholeResponse: boolean,
        callback: (data: any, success: boolean) => void) {

        let url = urls.SUPERVISOR_REMARK_DATA_GET_URL;

        let arg = {
            candidateScriptId: candidateScriptId,
            markSchemeGroupId: markSchemeGroupId,
            selectedExaminerId: selectedExaminerId,
            isWholeResponse: isWholeResponse
        };

        let supervisorRemarkPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg), true, false);

        supervisorRemarkPromise.then(function (data: any) {
            callback(JSON.parse(data), true);
        }).catch(function (data: any) {
            callback(data, false);
        });
    }

    /**
     * Method which makes the AJAX call to create the supervisor remark.
     * @param requestRemarkArguments
     * @param callback
     */
    public createSupervisorRemark(requestRemarkArguments: RequestRemarkArguments,
        callback: ((success: boolean, requestRemarkReturn: RequestRemarkReturn) => void)) {
        let url = urls.SUPERISOR_REMARK_CREATE_URL;
        let that = this;
        ////  Making AJAX call to get the data
        let remarkPromise = this.makeAJAXCall('POST', url, JSON.stringify(requestRemarkArguments), true, false);
        remarkPromise.then(function (json: any) {
            if (callback) {
                let result: RequestRemarkReturn = JSON.parse(json);
                // If remark created succesfully, clear the data in the storage to get the latest details.
                if (result.remarkRequestCreatedCount > 0 && requestRemarkArguments.responseMode === enums.ResponseMode.pending) {
                    that._storageAdapterHelper.clearCacheByKey('worklist',
                        that._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                            requestRemarkArguments.worklistType,
                            enums.ResponseMode.pending,
                            requestRemarkArguments.remarkRequestType,
                            requestRemarkArguments.examinerRoleId));
                    that._storageAdapterHelper.clearCacheByKey('worklist',
                        that._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                            requestRemarkArguments.worklistType,
                            enums.ResponseMode.closed,
                            requestRemarkArguments.remarkRequestType,
                            requestRemarkArguments.examinerRoleId));
                    that._storageAdapterHelper.clearCacheByKey('marker', 'markerProgress_' + requestRemarkArguments.examinerRoleId);
                }
                callback(true, result);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Method which makes the AJAX call to promote a response to seed.
     * @param promoteToSeedArguments
     * @param callback
     */
    public promoteToSeed(promoteToSeedArguments: PromoteToSeedArguments,
        callback: ((success: boolean, promoteToSeedReturn: promoteToSeedReturn) => void)) {
        let url = urls.PROMOTE_TO_SEED_URL;
        let that = this;
        ////  Making AJAX call to get the data
        let remarkPromise = this.makeAJAXCall('POST', url, JSON.stringify(promoteToSeedArguments), true, false);
        remarkPromise.then(function (json: any) {
            if (callback) {
                let result: promoteToSeedReturn = JSON.parse(json);
                // If remark created succesfully, clear the data in the storage to get the latest details.
                if (promoteToSeedArguments.responseMode !== enums.ResponseMode.open) {
                    that._storageAdapterHelper.clearCacheByKey('worklist',
                        that._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                            worklistStore.instance.currentWorklistType,
                            enums.ResponseMode.pending,
                            worklistStore.instance.getRemarkRequestType,
                            promoteToSeedArguments.examinerRoleId));
                    that._storageAdapterHelper.clearCacheByKey('worklist',
                        that._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                            worklistStore.instance.currentWorklistType,
                            enums.ResponseMode.closed,
                            worklistStore.instance.getRemarkRequestType,
                            promoteToSeedArguments.examinerRoleId));
                    that._storageAdapterHelper.clearCacheByKey('marker', 'markerProgress_' + promoteToSeedArguments.examinerRoleId);
                }
                callback(true, result);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Search Atypical Response
     */
    public SearchAtypicalResponse(searchAtypicalResponseArgument: SearchAtypicalResponseArgument, callback: Function) {
        let url: string = urls.SEARCH_ATYPICAL_RESPONSE;
        let searchAtypicalResponse = this.makeAJAXCall('POST', url, JSON.stringify(searchAtypicalResponseArgument));
        searchAtypicalResponse.then(function (json: any) {
            callback(JSON.parse(json), true);
        }).catch(function (json: any) {
            callback(undefined, false);
        });
    }

    /**
     * method for reject rig ajax call.
     * @param callback
     * @param rejectRigArguments
     */
    public RejectRig(rejectRigArguments: RejectRigArgument,
        callback: ((success: boolean, rejectRigReturn: RejectRigReturn) => void)) {
        let workListType = worklistStore.instance.currentWorklistType;
        let markingMode = worklistStore.instance.getMarkingModeByWorkListType(workListType);
        let remarkRequestType = worklistStore.instance.getRemarkRequestType;
        let url = urls.REJECT_RIG_URL;
        let that = this;

        //Method to make ajax call.
        let rejectRigPromise = this.makeAJAXCall('POST', url, JSON.stringify(rejectRigArguments), true, false);
        rejectRigPromise.then(function (json: any) {
            if (callback) {
                let result = JSON.parse(json);
                callback(result.success, result);
                if (result.success) {
                    that._storageAdapterHelper.clearStorageArea('messaging');
                    that._storageAdapterHelper.clearCache(rejectRigArguments.markSchemeGroupId,
                        markingMode,
                        remarkRequestType,
                        rejectRigArguments.examinerRoleId,
                        workListType);
                }
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Method which makes the AJAX call to check if remarks raised against the response.
     * @param promoteToSeedArguments
     * @param callback
     */
    public promoteToSeedCheckRemark(promoteToSeedArguments: PromoteToSeedArguments,
        callback: ((success: boolean, promoteToSeedReturn: promoteToSeedReturn) => void)) {
        let url = urls.PROMOTE_TO_SEED_VALIDATION_URL;
        let that = this;
        ////  Making AJAX call to get the data
        let remarkPromise = this.makeAJAXCall('POST', url, JSON.stringify(promoteToSeedArguments), true, false);
        remarkPromise.then(function (json: any) {
            if (callback) {
                let result: promoteToSeedReturn = JSON.parse(json);
                callback(true, result);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Method which makes the AJAX call to promote response to reuse bucket.
     * @param promoteToSeedArguments
     * @param callback
     */
    public promoteToReuseBucket(promoteToReuseBucketArguments: PromoteToReuseBucketArguments,
        callback: ((success: boolean, isResponsePromotedToReuseBucket: boolean) => void)) {
        let url = urls.PROMOTE_TO_REUSE_BUCKET_URL;
        let that = this;
        let promoteReusePromise = this.makeAJAXCall('POST', url, JSON.stringify(promoteToReuseBucketArguments), true, false);
        promoteReusePromise.then(function (json: any) {
            if (callback) {
                let result: boolean = JSON.parse(json);
                callback(true, result);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }
    /**
     * Method which makes the AJAX call to validate the response(if the response is withdrwan or not)
     * @param markGroupId
     * @param callback
     */
    public validateResponse(markGroupId: number,
        markSchemeGroupId: number,
        examinerRoleId: number,
        callback: ((success: boolean , validateResponseReturnData: ValidateResponseReturnData) => void)) {
        let url = urls.VALIDATE_RESPONSE_URL + '/' + markGroupId + '/' + markSchemeGroupId + '/' + examinerRoleId;
        let that = this;
        let validateResponsePromise = this.makeAJAXCall('POST', url, JSON.stringify(markGroupId), true, false);
        validateResponsePromise.then(function (json: any) {
            if (callback) {
                let result: ValidateResponseReturnData = JSON.parse(json);
                callback(true, result);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Method which makes the AJAX call to validate the script(if itswithdrwan or not)
     * @param candidateScriptId
     * @param markSchemeGroupId
     * @param callback
     */
    public validateCentreScriptResponse(candidateScriptId: number, markSchemeGroupId: number,
        callback: ((success: boolean, validateResponseReturnData: ValidateResponseReturnData) => void)) {
		let url = urls.VALIDATE_CENTRESCRIPT_RESPONSE_URL + '/' + candidateScriptId + '/' + markSchemeGroupId;
        let that = this;
        let validateResponsePromise = this.makeAJAXCall('POST', url, '', true, false);
        validateResponsePromise.then(function (json: any) {
            if (callback) {
                let result: ValidateResponseReturnData = JSON.parse(json);
                callback(true, result);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Change json object to immutable Map for Retrieve marks
     * @param data examinerMarkData
     */
    private getImmutableInRetrieveMarksData(data: examinerMarkData): examinerMarkData {
        let immutableMap: Immutable.Map<number, examinerRoleMarkGroupDetails> = Immutable.Map(data.wholeResponseQIGToRIGMapping);
        data.wholeResponseQIGToRIGMapping = immutableMap;
        return data;
    }

    /**
     * Change json object to immutable list in Save marks and annotations return
     * @param data saveMarksAndAnnotationsReturn
     */
    private getImmutableInSaveMarksData(data: saveMarksAndAnnotationsReturn): saveMarksAndAnnotationsReturn {
        let updatedMarkAnnotationDetails: Immutable.Map<number, MarksAndAnnotationsToReturn> =
            data.updatedMarkAnnotationDetails ? Immutable.Map(data.updatedMarkAnnotationDetails) : null;
        let updatedMarkGroupVersions: Immutable.Map<number, number> = Immutable.Map(data.updatedMarkGroupVersions);
        let marksAndAnnotationsMismatch: Immutable.Map<number, MarkAnnotationMismatch> = Immutable.Map(data.marksAndAnnotationsMismatch);
        let markSchemesHavingAnnotationsMismatch: Immutable.List<number> = Immutable.List(data.markSchemesHavingAnnotationsMismatch);
        let unUsedMarkschemeIds: Immutable.List<number> = Immutable.List(data.unUsedMarkschemeIds);
        data.updatedMarkAnnotationDetails = updatedMarkAnnotationDetails;
        data.updatedMarkGroupVersions = updatedMarkGroupVersions;
        data.marksAndAnnotationsMismatch = marksAndAnnotationsMismatch;
        data.markSchemesHavingAnnotationsMismatch = markSchemesHavingAnnotationsMismatch;
        data.unUsedMarkschemeIds = unUsedMarkschemeIds;
        return data;
    }

    /**
     * Method which makes the AJAX call to validate the script(if its markingMode got changed)
     * @param esMarkGroupId
     * @param markSchemeGroupId
     * @param markingModeId
     * @param callback
     */
    public validateProvisionalResponse(esMarkGroupId: number, markingModeId: number,
        callback: ((success: boolean, validateResponseReturnData: ValidateResponseReturnData) => void)) {
        let url = urls.VALIDATE_PROVISIONAL_RESPONSE_URL + '/' + esMarkGroupId + '/' + markingModeId;
        let that = this;
        let validateResponsePromise = this.makeAJAXCall('POST', url, '', true, false);
        validateResponsePromise.then(function (json: any) {
            if (callback) {
                let result: ValidateResponseReturnData = JSON.parse(json);
                callback(true, result);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }
}

let responseDataService = new ResponseDataService();
export = responseDataService;