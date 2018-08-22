import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import markerProgressData = require('../../stores/worklist/typings/markerprogressdata');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
import Immutable = require('immutable');
declare let config: any;
import enums = require('../../components/utility/enums');
import storageAdapterHelper = require('../storageadapters/storageadapterhelper');

class WorklistDataService extends dataServiceBase {

    private _storageAdapterHelper = new storageAdapterHelper();

    /**
     * Method which makes the AJAX call to fetch the marker progress data to be shown on the
     * left side Worklist navigation panel
     * @param examinerRoleID
     * @param markSchemeGroupId
     * @param includePromotedAsSeedResponses
     * @param callback
     */
    public getWorklistMarkerProgressData(examinerRoleID: number,
        markSchemeGroupId: number,
        includePromotedAsSeedResponses: boolean,
        callback: ((success: boolean, json: markerProgressData) => void),
        useCache: boolean = false): void {

        let that = this;

        if (useCache) {

            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('marker',
                'markerProgress_' + examinerRoleID,
                true,
                config.cacheconfig.TWO_MINUTES_CACHE_TIME);

            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult: any) {
                that.getWorklistMarkerProgressDataFromServer(examinerRoleID, markSchemeGroupId, includePromotedAsSeedResponses, callback);
            });
        } else {
            this.getWorklistMarkerProgressDataFromServer(examinerRoleID, markSchemeGroupId, includePromotedAsSeedResponses, callback);
        }
    }

    /**
     * get the status whether the examiner has marking check worklist available
     */
    public getMarkingCheckWorklistAccessStatus(markSchemeGroupId: number, callback: Function) {
        let url: string = urls.MARKING_CHECK_ACCESS_STATUS_URL;
        let getMarkingCheckWorklistAccessStatusPromise = this.makeAJAXCall('GET', url + '/' + markSchemeGroupId);
        getMarkingCheckWorklistAccessStatusPromise.then(function (json: any) {
            let data = JSON.parse(json);
            callback(true, data.isMarkingCheckPresent);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }

    /**
     * Get the Worklist Marker Progress Data From Server
     * @param examinerRoleID
     * @param markSchemeGroupId
     * @param callback
     */
    private getWorklistMarkerProgressDataFromServer(
        examinerRoleID: number,
        markSchemeGroupId: number,
        includePromotedAsSeedResponses: boolean,
        callback: Function) {

        let url = urls.MARKER_PROGRESS_GET_URL;

        /**  Making AJAX call to get the examiner progress data */
        let worklistPromise =
            this.makeAJAXCall('GET', url + '/' + examinerRoleID + '/' + markSchemeGroupId + '/' + includePromotedAsSeedResponses);

        let that = this;

        worklistPromise.then(function (json: any) {
            if (callback) {
                storageAdapterFactory.getInstance().storeData('marker', 'markerProgress_' + examinerRoleID,
                    JSON.parse(json), true).then().catch();

                callback(true, JSON.parse(json));
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Change json object to immutable list
     * @param data
     */
    private getImmutable(data: WorklistBase): WorklistBase {
        let immutableList: Immutable.List<ResponseBase> = Immutable.List(data.responses);
        immutableList.map((x: ResponseBase) => {
            if (x.relatedRIGDetails){
                x.relatedRIGDetails = Immutable.List(x.relatedRIGDetails);
            }
        });
        data.responses = immutableList;
        return data;
    }

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
    private makeAjaxCallToGetResponseDetails(examinerRoleId: number,
        markSchemeGroupId: number,
        questionPaperId: number,
        remarkRequestType: enums.RemarkRequestType,
        worklistType: enums.WorklistType,
        responseMode: enums.ResponseMode,
        memoryStorageKey: string,
        isOnline: boolean,
        subExaminerId: number,
        isHelpExaminersView: boolean,
        isMarkCheckWorklist: boolean,
        includePromotedAsSeedResponses: boolean,
        callback: ((success: boolean,
            isCached: boolean,
            responseData: WorklistBase) => void)): void {

        let _responseList: WorklistBase;
        let that = this;
        /* Make an ajax call to retrieve data and store the same in storage adapter.*/
        let url = urls.WORKLIST_GET_URL
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
        let getMarkingListPromise = that.makeAJAXCall('GET', url, '', isOnline, isOnline);

        getMarkingListPromise.then(function (json: any) {
            _responseList = that.getImmutable(JSON.parse(json));

            if (callback) {
                storageAdapterFactory.getInstance().storeData('worklist', memoryStorageKey, _responseList, true).then(function () {
                    callback(true, false, _responseList);
                }).catch();
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, false, json);
            }
        });
    }

    /**
     * Getting worlist details
     * @param examinerRoleId
     * @param questionPaperId
     * @param markingmode
     * @param responseMode
     * @param subExaminerId
     * @param callback
     */
    public GetWorklistDetails(markSchemeGroupId: number,
        examinerRoleId: number,
        questionPaperId: number,
        remarkRequestType: enums.RemarkRequestType,
        markingmode: enums.WorklistType,
        responseMode: enums.ResponseMode,
        doUseCache: boolean = true,
        isOnline: boolean,
        subExaminerId: number,
        isHelpExaminerView: boolean,
        isMarkCheckWorklist: boolean,
        includePromotedAsSeedResponses: boolean,
        callback: ((success: boolean, isCached: boolean, cachedData: WorklistBase) => void)) {

        switch (markingmode) {
            case enums.WorklistType.live:
                this.GetLiveWorklistDetails(markSchemeGroupId, examinerRoleId,
                    questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, isHelpExaminerView, isMarkCheckWorklist,
                    includePromotedAsSeedResponses, callback);
                break;
            case enums.WorklistType.atypical:
                this.GetAtypicalWorklistDetails(markSchemeGroupId, examinerRoleId,
                    questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, callback);
                break;
            case enums.WorklistType.secondstandardisation:
                this.GetSecondStandardisationWorklistDetails(markSchemeGroupId, examinerRoleId, questionPaperId,
                    responseMode, doUseCache, isOnline, subExaminerId, callback);
                break;
            case enums.WorklistType.standardisation:
                this.GetStandardisationWorklistDetails(markSchemeGroupId, examinerRoleId, questionPaperId,
                    responseMode, doUseCache, isOnline, subExaminerId, callback);
                break;
            case enums.WorklistType.practice:
                this.GetPracticeWorkListDetails(markSchemeGroupId, examinerRoleId, questionPaperId, responseMode, doUseCache,
                    isOnline, subExaminerId, callback);
                break;
            case enums.WorklistType.directedRemark:
                this.GetDirectedRemarkWorklistDetails(markSchemeGroupId, examinerRoleId, questionPaperId, remarkRequestType,
                    responseMode, doUseCache, isOnline, subExaminerId, includePromotedAsSeedResponses, callback);
                break;
            case enums.WorklistType.pooledRemark:
                this.GetRemarkWorklistDetails(markSchemeGroupId, examinerRoleId, questionPaperId, remarkRequestType,
                    responseMode, doUseCache, isOnline, subExaminerId, includePromotedAsSeedResponses, callback);
                break;
            case enums.WorklistType.simulation:
                this.GetSimulationWorklistDetails(markSchemeGroupId, examinerRoleId,
                    questionPaperId, responseMode, doUseCache, isOnline, subExaminerId, isHelpExaminerView, isMarkCheckWorklist,
                    includePromotedAsSeedResponses, callback);
                break;
            default:
                break;
        }
    }

    /**
     * Getting live worklist details
     * @param shouldCache
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param includePromotedAsSeedResponses
     * @param callback
     */
    private GetLiveWorklistDetails(markSchemeGroupId: number,
        examinerRoleId: number,
        questionPaperId: number,
        responseMode: enums.ResponseMode,
        doUseCache: boolean = true,
        isOnline: boolean,
        subExaminerId: number,
        isHelpExaminerView: boolean,
        isMarkCheckWorklist: boolean,
        includePromotedAsSeedResponses: boolean,
        callback: ((success: boolean, isCached: boolean, cachedData: WorklistBase) => void)) {

        switch (responseMode) {
            case enums.ResponseMode.open:
                this.GetWorklistDetailsFromServer(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    enums.RemarkRequestType.Unknown,
                    enums.WorklistType.live,
                    enums.ResponseMode.open,
                    this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                        enums.WorklistType.live, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
                    doUseCache,
                    isOnline,
                    callback,
                    subExaminerId,
                    isMarkCheckWorklist);
                break;
            case enums.ResponseMode.closed:
                this.GetWorklistDetailsFromServer(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    enums.RemarkRequestType.Unknown,
                    enums.WorklistType.live,
                    enums.ResponseMode.closed,
                    this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                        enums.WorklistType.live, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
                    doUseCache,
                    isOnline,
                    callback,
                    subExaminerId,
                    isMarkCheckWorklist,
                    isHelpExaminerView,
                    includePromotedAsSeedResponses);
                break;
            case enums.ResponseMode.pending:
                this.GetWorklistDetailsFromServer(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    enums.RemarkRequestType.Unknown,
                    enums.WorklistType.live,
                    enums.ResponseMode.pending,
                    this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                        enums.WorklistType.live, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
                    doUseCache,
                    isOnline,
                    callback,
                    subExaminerId,
                    isMarkCheckWorklist);
                break;

            default:
                break;
        }
    }

    /**
     * Getting atypical worklist details
     * @param shouldCache
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param callback
     */
    private GetAtypicalWorklistDetails(markSchemeGroupId: number,
        examinerRoleId: number,
        questionPaperId: number,
        responseMode: enums.ResponseMode,
        doUseCache: boolean = true,
        isOnline: boolean,
        subExaminerId: number,
        callback: ((success: boolean, isCached: boolean, cachedData: WorklistBase) => void)) {

        switch (responseMode) {
            case enums.ResponseMode.open:
                this.GetWorklistDetailsFromServer(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    enums.RemarkRequestType.Unknown,
                    enums.WorklistType.atypical,
                    enums.ResponseMode.open,
                    this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                        enums.WorklistType.atypical, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
                    doUseCache,
                    isOnline,
                    callback,
                    subExaminerId);
                break;
            case enums.ResponseMode.closed:
                this.GetWorklistDetailsFromServer(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    enums.RemarkRequestType.Unknown,
                    enums.WorklistType.atypical,
                    enums.ResponseMode.closed,
                    this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                        enums.WorklistType.atypical, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
                    doUseCache,
                    isOnline,
                    callback,
                    subExaminerId);
                break;
            case enums.ResponseMode.pending:
                this.GetWorklistDetailsFromServer(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    enums.RemarkRequestType.Unknown,
                    enums.WorklistType.atypical,
                    enums.ResponseMode.pending,
                    this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                        enums.WorklistType.atypical, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
                    doUseCache,
                    isOnline,
                    callback,
                    subExaminerId);
                break;

            default:
                break;
        }
    }
    /**
     * Getting practice worklist details
     * @param markSchemeGroupId
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param doUseCache
     * @param callback
     */
    private GetPracticeWorkListDetails(markSchemeGroupId: number,
        examinerRoleId: number,
        questionPaperId: number,
        responseMode: enums.ResponseMode,
        doUseCache: boolean = true,
        isOnline: boolean,
        subExaminerId: number,
        callback: ((success: boolean, isCached: boolean, cachedData: WorklistBase) => void)) {
        switch (responseMode) {
            case enums.ResponseMode.open:
                this.GetWorklistDetailsFromServer(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    enums.RemarkRequestType.Unknown,
                    enums.WorklistType.practice,
                    enums.ResponseMode.open,
                    this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                        enums.WorklistType.practice, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
                    doUseCache,
                    isOnline,
                    callback,
                    subExaminerId);
                break;
            case enums.ResponseMode.closed:
                this.GetWorklistDetailsFromServer(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    enums.RemarkRequestType.Unknown,
                    enums.WorklistType.practice,
                    enums.ResponseMode.closed,
                    this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                        enums.WorklistType.practice, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
                    doUseCache,
                    isOnline,
                    callback,
                    subExaminerId);
                break;

        }
    }

    /**
     * Getting standardisation worklist details
     * @param shouldCache
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param callback
     */
    private GetStandardisationWorklistDetails(markSchemeGroupId: number,
        examinerRoleId: number,
        questionPaperId: number,
        responseMode: enums.ResponseMode,
        doUseCache: boolean = true,
        isOnline: boolean,
        subExaminerId: number,
        callback: ((success: boolean, isCached: boolean, cachedData: WorklistBase) => void)) {

        switch (responseMode) {
            case enums.ResponseMode.open:
                this.GetWorklistDetailsFromServer(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    enums.RemarkRequestType.Unknown,
                    enums.WorklistType.standardisation,
                    enums.ResponseMode.open,
                    this._storageAdapterHelper.getMemoryStorageKeyForWorklistData
                        (enums.WorklistType.standardisation, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
                    doUseCache,
                    isOnline,
                    callback);
                break;
            case enums.ResponseMode.closed:
                this.GetWorklistDetailsFromServer(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    enums.RemarkRequestType.Unknown,
                    enums.WorklistType.standardisation,
                    enums.ResponseMode.closed,
                    this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                        enums.WorklistType.standardisation, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
                    doUseCache,
                    isOnline,
                    callback,
                    subExaminerId);
                break;
            default:
                break;
        }
    }


    /**
     * Getting second/stm standardisation worklist details
     * @param shouldCache
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param callback
     */
    private GetSecondStandardisationWorklistDetails(markSchemeGroupId: number,
        examinerRoleId: number,
        questionPaperId: number,
        responseMode: enums.ResponseMode,
        doUseCache: boolean = true,
        isOnline: boolean,
        subExaminerId: number,
        callback: ((success: boolean, isCached: boolean, cachedData: WorklistBase) => void)) {

        switch (responseMode) {
            case enums.ResponseMode.open:
                this.GetWorklistDetailsFromServer(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    enums.RemarkRequestType.Unknown,
                    enums.WorklistType.secondstandardisation,
                    enums.ResponseMode.open,
                    this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                        enums.WorklistType.secondstandardisation, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
                    doUseCache,
                    isOnline,
                    callback);
                break;
            case enums.ResponseMode.closed:
                this.GetWorklistDetailsFromServer(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    enums.RemarkRequestType.Unknown,
                    enums.WorklistType.secondstandardisation,
                    enums.ResponseMode.closed,
                    this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                        enums.WorklistType.secondstandardisation, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
                    doUseCache,
                    isOnline,
                    callback,
                    subExaminerId);
                break;
            default:
                break;
        }
    }

    /**
     * Get directed remark worklist details
     * @param markSchemeGroupId
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param doUseCache
     * @param callback
     */
    private GetDirectedRemarkWorklistDetails(markSchemeGroupId: number,
        examinerRoleId: number,
        questionPaperId: number,
        remarkRequestType: enums.RemarkRequestType,
        responseMode: enums.ResponseMode,
        doUseCache: boolean = true,
        isOnline: boolean,
        subExaminerId: number,
        includePromotedAsSeedResponses: boolean,
        callback: ((success: boolean, isCached: boolean, cachedData: WorklistBase) => void)) {
        this.GetWorklistDetailsFromServer(examinerRoleId,
            markSchemeGroupId,
            questionPaperId,
            remarkRequestType,
            enums.WorklistType.directedRemark,
            responseMode,
            this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                enums.WorklistType.directedRemark, responseMode, remarkRequestType, examinerRoleId),
            doUseCache,
            isOnline,
            callback,
            subExaminerId,
            undefined,
            undefined,
            includePromotedAsSeedResponses);
    }

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
    private GetWorklistDetailsFromServer(examinerRoleId: number,
        markSchemeGroupId: number,
        questionPaperId: number,
        remarkRequestType: enums.RemarkRequestType,
        worklistType: enums.WorklistType,
        responseMode: enums.ResponseMode,
        memoryStorageKey: string,
        doUseCache: boolean = true,
        isOnline: boolean = true,
        callback: ((success: boolean, isCached: boolean, cachedData: WorklistBase) => void),
        subExaminerId?: number,
        isMarkCheckWorklist: boolean = false,
        isHelpExaminersView: boolean = false,
        includePromotedAsSeedResponses: boolean = false) {
        let that = this;

        if (doUseCache) {
            /* Getting data from storage adapter using key */
            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('worklist',
                memoryStorageKey,
                true,
                config.
                    cacheconfig.TWO_MINUTES_CACHE_TIME);

            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                /* if the data ahs been received from storage adapter, return the result */
                callback(true, true, <WorklistBase>(jsonResult.value));
            }).catch(function (jsonResult: any) {
                that.makeAjaxCallToGetResponseDetails(examinerRoleId,
                    markSchemeGroupId,
                    questionPaperId,
                    remarkRequestType,
                    worklistType,
                    responseMode,
                    memoryStorageKey,
                    isOnline,
                    subExaminerId,
                    isHelpExaminersView,
                    isMarkCheckWorklist,
                    includePromotedAsSeedResponses,
                    callback);
            });
        } else {
            that.makeAjaxCallToGetResponseDetails(examinerRoleId,
                markSchemeGroupId,
                questionPaperId,
                remarkRequestType,
                worklistType,
                responseMode,
                memoryStorageKey,
                isOnline,
                subExaminerId,
                isHelpExaminersView,
                isMarkCheckWorklist,
                includePromotedAsSeedResponses,
                callback);
        }
    }

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
    private GetRemarkWorklistDetails(markSchemeGroupId: number,
        examinerRoleId: number,
        questionPaperId: number,
        remarkRequestType: enums.RemarkRequestType,
        responseMode: enums.ResponseMode,
        doUseCache: boolean = true,
        isOnline: boolean,
        subExaminerId: number,
        includePromotedAsSeedResponses: boolean,
        callback: ((success: boolean, isCached: boolean, cachedData: WorklistBase) => void)) {
        this.GetWorklistDetailsFromServer(examinerRoleId,
            markSchemeGroupId,
            questionPaperId,
            remarkRequestType,
            enums.WorklistType.pooledRemark,
            responseMode,
            this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                enums.WorklistType.pooledRemark, responseMode, remarkRequestType, examinerRoleId),
            doUseCache,
            isOnline,
            callback,
            subExaminerId,
            undefined,
            undefined,
            includePromotedAsSeedResponses);
    }

    /**
     * Getting live worklist details
     * @param shouldCache
     * @param examinerRoleId
     * @param questionPaperId
     * @param responseMode
     * @param includePromotedAsSeedResponses
     * @param callback
     */
    private GetSimulationWorklistDetails(markSchemeGroupId: number,
        examinerRoleId: number,
        questionPaperId: number,
        responseMode: enums.ResponseMode,
        doUseCache: boolean = true,
        isOnline: boolean,
        subExaminerId: number,
        isHelpExaminerView: boolean,
        isMarkCheckWorklist: boolean,
        includePromotedAsSeedResponses: boolean,
        callback: ((success: boolean, isCached: boolean, cachedData: WorklistBase) => void)) {

        this.GetWorklistDetailsFromServer(examinerRoleId,
            markSchemeGroupId,
            questionPaperId,
            enums.RemarkRequestType.Unknown,
            enums.WorklistType.simulation,
            enums.ResponseMode.open,
            this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                enums.WorklistType.simulation, responseMode, enums.RemarkRequestType.Unknown, examinerRoleId),
            doUseCache,
            isOnline,
            callback,
            subExaminerId,
            isMarkCheckWorklist);
    }
}

let worklistDataService = new WorklistDataService();
export = worklistDataService;