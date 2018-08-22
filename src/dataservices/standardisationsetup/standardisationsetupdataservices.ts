import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import standardisationTargetDetails = require('../../stores/standardisationsetup/typings/standardisationtargetdetails');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
import Immutable = require('immutable');
import enums = require('../../components/utility/enums');
import storageAdapterHelper = require('../storageadapters/storageadapterhelper');
import createStandardisationRIGArgument = require('../../stores/standardisationsetup/typings/createstandardisationrigarguments');
import createStandardisationRIGReturnData = require('../../stores/standardisationsetup/typings/createstandardisationrigreturndata');
import createStandardisationRIGReturn = require('../../stores/standardisationsetup/typings/createstandardisationrigreturn');
import updateESMarkGroupMarkingModeData = require('../../stores/standardisationsetup/typings/updateesmarkgroupmarkingmodedata');
import discardStandardisationResponseArgument = require('../../stores/standardisationsetup/typings/discardstandardisationresponseargument');
import discardStandardisationResponseReturn = require('../../stores/standardisationsetup/typings/discardstandardisationresponsereturn');
import updateESMarkingModeReturn = require('../../stores/standardisationsetup/typings/updateesmarkingmodereturn');
import reuseRIGActionArgument = require('../../stores/standardisationsetup/typings/reuserigactionarguments');
import reuseRIGActionReturn = require('../../stores/standardisationsetup/typings/reuserigactionreturn');
declare let config: any;

class StandardisationSetupDataServices extends dataServiceBase {

    private _storageAdapterHelper = new storageAdapterHelper();

    /**
     * initiate the tags API call and returns the left panel target details.
     * @param callback
     */
    public getStandardisationTargetDetails(markSchemeGroupId: number, examinerRoleId: number,
        callback: ((success: boolean, json: standardisationTargetDetails) => void)): void {
        let url = urls.GET_STANDARDISATION_TARGET_DETAILS;
        let getStdTargetsPromise = this.makeAJAXCall('GET', url + '/' + markSchemeGroupId + '/' + examinerRoleId);
        let that = this;
        getStdTargetsPromise.then(function (json: any) {
            let standardisationTargetDetailsData: standardisationTargetDetails =
                that.getImmutableStandardisationTargetDetails(JSON.parse(json));
            callback(true, standardisationTargetDetailsData);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }

    /**
     * API call to get getReuseRigDetails
     * @param examinerRoleId
     * @param markSchemeGroupID
     * @param isReUsableResponsesSelected
     * @param isHideResponsesSelected
     * @param callback
     */
    public getReuseRigDetails(examinerRoleId: number, markSchemeGroupID: number, isReUsableResponsesSelected:
        boolean, isHideResponsesSelected: boolean, useCache: boolean,
        callback: (success: boolean, json: Immutable.List<StandardisationResponseDetails>) => void): void {
        let that: this;
        if (useCache) {
            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('standardisationSetup',
                'getReuseRigDetails_' + examinerRoleId + '_' + markSchemeGroupID + '_' +
                isReUsableResponsesSelected + '_' + isHideResponsesSelected,
                true,
                config.cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                callback(jsonResult.success, jsonResult.value);
            }).catch(function (jsonResult: any) {
                that.getReuseRigDetailsFromServer(examinerRoleId, markSchemeGroupID,
                    isReUsableResponsesSelected, isHideResponsesSelected, callback);
            });
        } else {
            this.getReuseRigDetailsFromServer(examinerRoleId, markSchemeGroupID,
                isReUsableResponsesSelected, isHideResponsesSelected, callback);
        }
    }

    /**
     * Server Call to get ReuseRigDetails
     * @param examinerRoleId
     * @param markSchemeGroupID
     * @param isReUsableResponsesSelected
     * @param isHideResponsesSelected
     * @param callback
     */
    private getReuseRigDetailsFromServer(examinerRoleId: number, markSchemeGroupID: number,
        isReUsableResponsesSelected: boolean, isHideResponsesSelected: boolean,
        callback: (success: boolean, json: Immutable.List<StandardisationResponseDetails>) => void): void {
        let that = this;
        let url = urls.GET_REUSE_RIG_DETAILS;
        let standardisationSetupReusableDetailsList: Immutable.List<StandardisationResponseDetails>;
        let reuseRigPromise = this.makeAJAXCall('GET', url
            + '/' + examinerRoleId
            + '/' + markSchemeGroupID
            + '/' + isReUsableResponsesSelected
            + '/' + isHideResponsesSelected);
        reuseRigPromise.then(function (json: any) {
            let result: Immutable.List<StandardisationResponseDetails>;
            result = (JSON.parse(json));
            callback(true, result);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }

    /**
     * Server Call to update the isActive Status to hide a Reuse RIG
     * @param isActiveStatus
     * @param dislayId
     * @param callback
     */
    public updateHideResponseStatus(displayId: string, isActiveStatus: boolean,
        callback: (success: boolean, json: boolean) => void): void {
        let that = this;
        let url = urls.UPDATE_REUSE_HIDE_RESPONSE_STATUS;
        let isHideStatusCompleted: boolean = false;
        let updateHideStatusPromise = this.makeAJAXCall('POST', url
            + '/' + displayId
            + '/' + isActiveStatus);
        updateHideStatusPromise.then(function (json: any) {
            isHideStatusCompleted = (JSON.parse(json));
            callback(true, isHideStatusCompleted);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }

    /**
     * Gets the standardisation centre details from the API
     * @param questionPaperId 
     * @param specialNeed 
     * @param isMarkFromPaper 
     * @param examinerRoleId 
     * @param useCache 
     * @param callback 
     */
    public getStandardisationCentresDetails(questionPaperId: number,
        specialNeed: boolean,
        isMarkFromPaper: boolean,
        examinerRoleId: number,
        useCache: boolean,
        callback: ((success: boolean, json: StandardisationCentreDetailsList) => void)
    ): void {

        let that = this;

        if (useCache) {
            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('standardisationSetup',
                'centreList_' + questionPaperId + '_' + examinerRoleId,
                true,
                config.cacheconfig.TWO_MINUTES_CACHE_TIME);

            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                /* if the data ahs been received from storage adapter, return the result */
                callback(jsonResult.success, jsonResult.value);
            }).catch(function (jsonResult: any) {
                that.getStandardisationCentresDetailsFromServer(questionPaperId, specialNeed, isMarkFromPaper, examinerRoleId, callback);
            });
        } else {
            this.getStandardisationCentresDetailsFromServer(questionPaperId, specialNeed, isMarkFromPaper, examinerRoleId, callback);
        }
    }

    /**
     * Get the standardisation setup centre list detailS from server
     * @param questionPaperId 
     * @param specialNeed 
     * @param isMarkFromPaper 
     * @param examinerRoleId 
     * @param callback 
     */
    private getStandardisationCentresDetailsFromServer(questionPaperId: number,
        specialNeed: boolean,
        isMarkFromPaper: boolean,
        examinerRoleId: number,
        callback: ((success: boolean, json: StandardisationCentreDetailsList) => void)): void {

        let that = this;
        let centreList: StandardisationCentreDetailsList;
        let url = urls.GET_STANDARDISATION_CENTRE_LIST +
            '/' + questionPaperId +
            '/' + specialNeed +
            '/' + isMarkFromPaper +
            '/' + examinerRoleId;

        // Make an ajax call to retrieve data and store the same in storage adapter.
        let standardisationCentreListPromise = that.makeAJAXCall('GET', url);

        // Store the data in in-memory storage adapter.
        standardisationCentreListPromise.then(function (json: any) {
            centreList = JSON.parse(json);
            if (callback) {
                storageAdapterFactory.getInstance().storeData('standardisationSetup',
                    'centreList_' + questionPaperId + '_' + examinerRoleId, centreList, true).then(function () {
                        callback(true, that.getImmutableCentreDetailsList(centreList));
                    }).catch();
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * retrives the script details, for the selected centre.
     * @param markSchemeGroupId
     * @param questionPaperID
     * @param centreID
     * @param considerAtypical
     * @param examinerRoleId
     * @param callback
     */
    public GetScriptDetailsOfSelectedCentre(markSchemeGroupId: number,
        questionPaperID: number,
        centrePartID: number,
        considerAtypical: boolean,
        examinerRoleId: number,
        callback: ((success: boolean, json: StandardisationScriptDetailsList) => void)): void {
        let url = urls.GET_SCRIPTLIST_OF_SELECT_CENTRE;
        let that = this;
        let centreScriptListPromise = this.makeAJAXCall('GET', url + '/' + markSchemeGroupId
            + '/' + questionPaperID
            + '/' + centrePartID
            + '/' + considerAtypical
            + '/' + examinerRoleId);

        centreScriptListPromise.then(function (json: any) {
            let result: StandardisationScriptDetailsList;
            result = that.getImmutableScriptDetailsList(JSON.parse(json));
            callback(true, result);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }

    /**
     * Change json object to immutable list
     * @param data
     */
    private getImmutableCentreDetailsList(data: StandardisationCentreDetailsList): StandardisationCentreDetailsList {
        let immutableList: Immutable.List<StandardisationCentreDetails> = Immutable.List(data.centreList);
        data.centreList = immutableList;
        return data;
    }

    /**
     * Change json object to immutable list
     * @param data
     */
    private getImmutableScriptDetailsList(data: StandardisationScriptDetailsList): StandardisationScriptDetailsList {
        let immutableList: Immutable.List<StandardisationScriptDetails> = Immutable.List(data.centreScriptList);
        data.centreScriptList = immutableList;
        return data;
    }

	/**
	 * Initiate the Standardisation API call and returns the classified response details.
	 * @param examinerRoleID
	 * @param examinerId
	 * @param markSchemeGroupId
	 * @param isViewMCQRIGMarks
	 * @param worklistViewType
	 * @param callback
	 */
    public GetClassifiedResponseDetails(examinerRoleID: number, examinerId: number,
        markSchemeGroupId: number, isViewMCQRIGMarks: boolean,
        worklistViewType: enums.STDWorklistViewType, isOnline,
        callback: ((success: boolean, json: StandardisationSetupResponsedetailsList) => void)): void {
        let that = this;
        let memoryStorageKey: string = enums.StandardisationSetup.ClassifiedResponse.toString() + '_'
            + enums.getEnumString(enums.STDWorklistViewType, worklistViewType) + '_'
            + examinerRoleID;
        let url = urls.GET_CLASSIFIED_WORKLIST_DETAILS;
        that.makeAjaxCallToGetSTDResponseDetails(examinerRoleID,
            examinerId,
            markSchemeGroupId,
            isViewMCQRIGMarks,
            worklistViewType,
            memoryStorageKey,
            callback,
            enums.PageContainers.StandardisationSetup,
            url,
            enums.StandardisationSetup.ClassifiedResponse);
    }

    /**
     * initiate the tags API call and returns the Unclassified response details.
     * @param examinerRoleID
     * @param examinerId
     * @param markSchemeGroupId
     * @param isViewMCQRIGMarks
     * @param worklistViewType
     * @param doUseCache
     * @param callback
     */
    public GetUnClassifiedResponseDetails(examinerRoleID: number, examinerId: number,
        markSchemeGroupId: number, isViewMCQRIGMarks: boolean,
        worklistViewType: enums.STDWorklistViewType,
        callback: ((success: boolean, json: StandardisationSetupResponsedetailsList) => void)): void {
        let that = this;
        let memoryStorageKey: string = enums.StandardisationSetup.UnClassifiedResponse.toString() + '_'
            + enums.getEnumString(enums.STDWorklistViewType, worklistViewType) + '_'
            + examinerRoleID;
        let url = urls.GET_UNCLASSIFIED_WORKLIST_DETAILS;
        that.makeAjaxCallToGetSTDResponseDetails(examinerRoleID,
            examinerId,
            markSchemeGroupId,
            isViewMCQRIGMarks,
            worklistViewType,
            memoryStorageKey,
            callback,
            enums.PageContainers.StandardisationSetup,
            url,
            enums.StandardisationSetup.UnClassifiedResponse);
    }

    /**
     * Make ajax call to get std response details.
     * @param examinerRoleID 
     * @param examinerId 
     * @param markSchemeGroupId 
     * @param isViewMCQRIGMarks 
     * @param worklistViewType 
     * @param memoryStorageKey 
     * @param callback 
     * @param pageContainer 
     * @param url 
     */
    private makeAjaxCallToGetSTDResponseDetails(examinerRoleID: number,
        examinerId: number,
        markSchemeGroupId: number,
        isViewMCQRIGMarks: boolean,
        worklistViewType: enums.STDWorklistViewType,
        memoryStorageKey: string,
        callback: ((success: boolean, json: StandardisationSetupResponsedetailsList) => void),
        pageContainer: enums.PageContainers,
        url: string,
        standardisationSetupWorklist: enums.StandardisationSetup) {
        let that = this;
        let getSTDResponseDetailsPromise =
            this.makeAJAXCall('GET', url + '/' + examinerRoleID + '/' + examinerId + '/'
                + markSchemeGroupId + '/' + isViewMCQRIGMarks + '/' + worklistViewType);
        getSTDResponseDetailsPromise.then(function (json: any) {
            let result: StandardisationSetupResponsedetailsList;
            result = that.getImmutableSTDResponseDetailsList(JSON.parse(json));
            callback(true, result);
        }).catch(function (json: any) {
            callback(false, undefined);

        });
    }

    /**
     * Change json object to immutable list
     * @param data
     */
    private getImmutableSTDResponseDetailsList(data: StandardisationSetupResponsedetailsList): StandardisationSetupResponsedetailsList {
        let immutableList: Immutable.List<StandardisationResponseDetails> = Immutable.List(data.standardisationResponses);
        data.standardisationResponses = immutableList;
        return data;
    }

    /**
     * Initiate the Standardisation API call and returns the provisional response details.
     * @param examinerRoleID 
     * @param examinerId 
     * @param markSchemeGroupId 
     * @param isViewMCQRIGMarks 
     * @param worklistViewType 
     * @param doUseCache 
     * @param isOnline 
     * @param callback 
     */
    public GetProvisionalResponseDetails(examinerRoleID: number,
        examinerId: number,
        markSchemeGroupId: number,
        isViewMCQRIGMarks: boolean,
        worklistViewType: enums.STDWorklistViewType,
        doUseCache,
        isOnline,
        callback: ((success: boolean, json: StandardisationSetupResponsedetailsList) => void)): void {
        let that = this;
        let memoryStorageKey: string = enums.StandardisationSetup.ProvisionalResponse.toString() + '_'
            + enums.getEnumString(enums.STDWorklistViewType, worklistViewType) + '_'
            + examinerRoleID;
        let url = urls.GET_PROVISIONAL_WORKLIST_DETAILS;
        that.makeAjaxCallToGetSTDResponseDetails(examinerRoleID,
            examinerId,
            markSchemeGroupId,
            isViewMCQRIGMarks,
            worklistViewType,
            memoryStorageKey,
            callback,
            enums.PageContainers.StandardisationSetup,
            url,
            enums.StandardisationSetup.ProvisionalResponse);
    }

    /**
     * Create Standardisation Rig for provisional
     * @param arg Create argument
     */
    public createStandardisationRig(arg: createStandardisationRIGArgument,
        callback: (success: boolean, returnData: createStandardisationRIGReturn) => void) {
        let url = urls.STANDARDISATION_CREATE_RIG;
        let that = this;
        let standardisationPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg), true, false);
        standardisationPromise.then(function (json: any) {
            if (callback) {
                let result = that.getImmutable(json);

                callback(true, result);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Complete Standardisation Setup for component
     * @param arg Create argument
     */
    public completeStandardisation(arg: CompleteStandardisationSetupDetail,
        callback: (success: boolean, returnData: CompleteStandardisationSetupReturn) => void) {
        let url = urls.COMPLETE_STANDARDISATION_SETUP;
        let that = this;
        let standardisationPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg), true, false);
        standardisationPromise.then(function (json: any) {
            if (callback) {
                let result: CompleteStandardisationSetupReturn;
                result = JSON.parse(json);
                callback(true, result);
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
    private getImmutable(dataToParse: string): createStandardisationRIGReturn {
        let data: createStandardisationRIGReturn = JSON.parse(dataToParse);
        let immutableList: Immutable.List<createStandardisationRIGReturnData> =
            Immutable.List(data.createStandardisationRIGReturnDetails);
        data.createStandardisationRIGReturnDetails = immutableList;
        return data;
    }

    /**
     *  Method which converts the standardisationTargetDetails to immutable list
     * @param data
     */
    private getImmutableStandardisationTargetDetails(data: standardisationTargetDetails): standardisationTargetDetails {
        data.standardisationTargetDetails = Immutable.List(data.standardisationTargetDetails);
        return data;
    }

	/**
	 * Declassify the script based on the parameters
	 * @param candidateScriptId
	 * @param markSchemeGroupId
	 * @param markingModeId
	 * @param examinerId
	 * @param esCandidateScriptMarkSchemeGroupId
	 * @param callback
	 */
    public updateESMarkGroupMarkingMode(arg: updateESMarkGroupMarkingModeData,
        callback: ((success: boolean, updateESMarkingModeReturn?: updateESMarkingModeReturn) => void)) {

        let url = urls.UPDATE_ES_MARK_GROUP_MARKING_MODE;
        let updateESMarkGroupMarkingModePromise =
            this.makeAJAXCall('POST', url, JSON.stringify(arg));
        updateESMarkGroupMarkingModePromise.then(function (json: any) {
            let result: updateESMarkingModeReturn = JSON.parse(json);
            if (result.success) {
                callback(true, result);
            } else {

                // Handle concurrency scenarios.
                if (result.updateESMarkingModeErrorCode === enums.UpdateESMarkingModeErrorCode.ConcurrencyIssue ||
                    result.updateESMarkingModeErrorCode ===
                    enums.UpdateESMarkingModeErrorCode.ConcurrencyIssueDueToStandardisationComplete) {
                    callback(false, result);
                }
            }

        }).catch(function (json: any) {
            callback(false);
        });
    }

	/**
	 * Method to save standardistation response notes
	 * @param esMarkGrupId
	 * @param callback
	 */
    public saveNotes(arg: StandardisationNotesData,
        callback: ((success: boolean, newStandardisationNotesData: StandardisationNotesData) => void)) {

        let url = urls.SAVE_NOTES;
        let saveNoteResponsePromise =
            this.makeAJAXCall('POST', url, JSON.stringify(arg));
        saveNoteResponsePromise.then(function (json: any) {
            let result: StandardisationNotesData;
            result = JSON.parse(json);
            callback(true, result);
        }).catch(function (json: any) {
            callback(false, json);
        });
    }

    /**
     * Discard Standardisation response
     */
    public discardStandardisationResponse(arg: discardStandardisationResponseArgument,
        callback: (success: boolean, returnData: discardStandardisationResponseReturn) => void) {
        let url = urls.DISCARD_STANDARDISATION_RESPONSE;
        let that = this;
        let discardStandardisationResponsePromise = this.makeAJAXCall('POST', url, JSON.stringify(arg), true, false);
        discardStandardisationResponsePromise.then(function (json: any) {
            if (callback) {
                let result: discardStandardisationResponseReturn;
                result = JSON.parse(json);
                callback(true, result);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Classify the response from unclassified worklist
     * @param arg
     * @param callback
     */
    public classifyProvisionalRIG(arg: updateESMarkGroupMarkingModeData,
        callback: ((success: boolean, updateESMarkingModeReturn?: updateESMarkingModeReturn) => void)) {

        let url = urls.CLASSIFY_PROVISIONAL_RIG;
        let classifyResponsePromise =
            this.makeAJAXCall('POST', url, JSON.stringify(arg));
        classifyResponsePromise.then(function (json: any) {
            let result: updateESMarkingModeReturn = JSON.parse(json);
            if (result.success) {
                callback(true, result);
            } else {
                // Handle concurrency scenarios.
                if (result.updateESMarkingModeErrorCode === enums.UpdateESMarkingModeErrorCode.ConcurrencyIssue ||
                    result.updateESMarkingModeErrorCode ===
                    enums.UpdateESMarkingModeErrorCode.ConcurrencyIssueDueToStandardisationComplete) {
                    callback(false, result);
                }
            }

        }).catch(function (json: any) {
            callback(false);
        });
    }

    /**
     * Reuse response from previous session
     */
    public reuseRIGAction(arg: reuseRIGActionArgument,
        callback: (success: boolean, returnData: reuseRIGActionReturn) => void) {

        let url = urls.REUSE_RIG_ACTION;
        let reuseRIGActionPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg));
        reuseRIGActionPromise.then(function (json: any) {
            let result: reuseRIGActionReturn;
            result = JSON.parse(json);
            callback(true, result);
        }).catch(function (json: any) {
            callback(false, json);
        });
    }

    /**
     * Server Call to get ProvisionalQIGDetails
     * @param candidateScriptId 
     * @param callback
     */
    public getProvisionalQIGDetails(candidateScriptId: number,
        callback: (success: boolean, json: Immutable.List<ProvisionalQIGDetailsReturn>) => void): void {
        let that = this;
        let url = urls.GET_PROVISIONAL_QIG_DETAILS;
        let provisionalQigDetailsPromise = this.makeAJAXCall('GET', url
            + '/' + candidateScriptId);
        provisionalQigDetailsPromise.then(function (json: any) {
            let result: Immutable.List<ProvisionalQIGDetailsReturn>;
            result = (JSON.parse(json));
            callback(true, result);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }
}
let standardisationSetupDataServices = new StandardisationSetupDataServices();
export =  standardisationSetupDataServices;