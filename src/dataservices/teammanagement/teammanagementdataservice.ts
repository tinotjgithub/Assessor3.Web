import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
import enums = require('../../components/utility/enums');
declare let config: any;
import setExaminerStatuseArguments = require('./typings/setexaminerstatusearguments');
import setExaminerStatusReturn = require('./typings/setexaminerstatusreturn');
import setSecondStandardisationArguments = require('./typings/setsecondStandardisationarguments');
import setSecondStandardisationReturn = require('./typings/setsecondstandardisationreturn');
import storageAdapterHelper = require('../storageadapters/storageadapterhelper');
import supervisorSamplingCommentArguments = require('./typings/supervisorsamplingcommentarguments');
import returnToMarkerArguments = require('./typings/returntomarkerarguments');
import returnToMarkerReturn = require('./typings/returntomarkerreturn');

/**
 * Team Management data service class
 */
class TeamManagementDataService extends dataServiceBase {

    private storageAdapterHelper = new storageAdapterHelper();


    /**
     * getTeamManagementOverviewCounts
     * 
     * @param {number} examinerRoleId 
     * @param {number} markSchemeGroupId 
     * @param {((success: boolean, myTeamData: any, isResultFromCache: boolean) => void)} callback 
     * @param {boolean} useCache 
     * @memberof TeamManagementDataService
     */
    public getTeamManagementOverviewCounts(examinerRoleId: number,
        markSchemeGroupId: number,
        callback: ((success: boolean, myTeamData: any, isResultFromCache: boolean) => void),
        useCache: boolean) {
        let that = this;

        if (useCache) {
            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('team',
                'teamOverviewCount_' + examinerRoleId + '_' + markSchemeGroupId,
                true,
                config.cacheconfig.TWO_MINUTES_CACHE_TIME);


            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                if (callback) {
                    callback(true, JSON.parse(jsonResult.value), true);
                }
            }).catch(function (jsonResult: any) {
                that.getTeamManagementOverviewCountData(examinerRoleId, markSchemeGroupId, callback);
            });

        } else {
            this.getTeamManagementOverviewCountData(examinerRoleId, markSchemeGroupId, callback);
        }
    }

    /**
     * getTeamManagementOverviewCountData
     * 
     * @private
     * @param {number} examinerRoleId 
     * @param {number} markSchemeGroupId 
     * @param {Function} callback 
     * @memberof TeamManagementDataService
     */
    private getTeamManagementOverviewCountData(examinerRoleId: number, markSchemeGroupId: number, callback: Function) {
        let url = urls.GETTEAM_OVERVIEW_URL
            .concat('/')
            .concat(markSchemeGroupId.toString());

        let getTeamOverviewDetailsPromise = this.makeAJAXCall('GET', url);

        let that = this;

        getTeamOverviewDetailsPromise.then(function (json: any) {
            storageAdapterFactory.getInstance().storeData('team',
                'teamOverviewCount_' + examinerRoleId + '_' + markSchemeGroupId,
                json, true).then().catch();
            callback(true, JSON.parse(json), false);
        }).catch(function (json: any) {
            callback(false, json, false);
        });
    }

    /**
     * Returns the my team grid data
     * @param examinerRoleID
     * @param markSchemeGroupId
     * @param callback
     * @param useCache
     */
    public getMyTeamData(
        examinerRoleID: number,
        markSchemeGroupId: number,
        callback: ((success: boolean, myTeamData: any, isResultFromCache: boolean) => void),
        useCache: boolean): void {

        let that = this;

        if (useCache) {
            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('team',
                'myTeamData_' + examinerRoleID + '_' + markSchemeGroupId,
                true,
                config.cacheconfig.TWO_MINUTES_CACHE_TIME);

            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                if (callback) {
                    callback(JSON.parse(jsonResult.value).success,
                        JSON.parse(jsonResult.value).myTeam,
                        true);
                }
            }).catch(function (jsonResult: any) {
                that.GetMyTeamDetails(examinerRoleID, markSchemeGroupId, callback);
            });
        } else {
            this.GetMyTeamDetails(examinerRoleID, markSchemeGroupId, callback);
        }
    }

    /**
     * Sets a response as reviewed
     * @param args
     * @param callBack
     */
    public SetResonseAsReviewed(
        setAsReviewedArguments: ReviewResponseArguments,
        callBack: Function) {

        let url = urls.REVIEW_RESPONSE_URL;
        let arg = JSON.stringify(setAsReviewedArguments);
        let that = this;

        // Returns the promise object for the Ajax call
        let getSetAsReviewedPromise = this.makeAJAXCall('POST', url, arg);

        getSetAsReviewedPromise.then(function (json: any) {
            let reviewResult = JSON.parse(json);

            // Clear Cache
            let markerCacheKey = 'marker';
            let markerCacheValue = 'markerProgress_' + setAsReviewedArguments.selectedExaminerRoleId;
            that.storageAdapterHelper.clearCacheByKey(
                markerCacheKey,
                markerCacheValue);

            callBack(reviewResult, true);
        }).catch(function (json: any) {
            callBack(json, false);
        });
    }

    /**
     * Get the my team details
     * @param examinerRoleID
     * @param markSchemeGroupId
     * @param callback
     */
    private GetMyTeamDetails(examinerRoleID: number, markSchemeGroupId: number, callback: Function) {
        let url = urls.GET_MY_TEAM_URL
            .concat('/')
            .concat(examinerRoleID.toString())
            .concat('/')
            .concat(markSchemeGroupId.toString());

        let getMyTeamPromise = this.makeAJAXCall('GET', url);
        let that = this;
        getMyTeamPromise.then(function (json: any) {
            storageAdapterFactory.getInstance().storeData('team', 'myTeamData_' + examinerRoleID + '_' + markSchemeGroupId,
                json, true).then().catch();
            callback(JSON.parse(json).success, JSON.parse(json).myTeam, false);
        }).catch(function (json: any) {
            callback(false, undefined, false);
        });
    }

    /**
     * Change subordinate status.
     * @param arg
     * @param callback
     */
    public changeExaminerStatus(arg: setExaminerStatuseArguments, callback: Function) {
        let url = urls.CHANGE_EXAMINER_STATUS_URL;
        let that = this;
        let changeExaminerStatusPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg));
        changeExaminerStatusPromise.then(function (json: any) {
            let examinerStatusReturn: setExaminerStatusReturn = JSON.parse(json);
            that.storageAdapterHelper.clearTeamDataCache(arg.loggedInExaminerRoleId,
                arg.markSchemeGroupId);
            let markerCacheKey = 'marker';
            let markerCacheValue = 'markerInformation_' + arg.examinerRoleId;
            that.storageAdapterHelper.clearCacheByKey(
                markerCacheKey,
                markerCacheValue);
            that.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
            callback(examinerStatusReturn.success, examinerStatusReturn);
        }).catch(function (json: any) {
            callback(false, json);
        });
    }

    /**
     * provide second standardisation.
     * @param arg
     * @param callback
     */
    public provideSecondStandardisation(arg: setSecondStandardisationArguments, callback: Function) {
        let url = urls.PROVIDE_EXAMINER_SECOND_STANDARDISATION_URL;
        let that = this;
        let provideSecondStandardisationPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg));
        provideSecondStandardisationPromise.then(function (json: any) {
            let secondStandardisationReturn: setSecondStandardisationReturn = JSON.parse(json);
            that.storageAdapterHelper.clearTeamDataCache(arg.loggedInExaminerRoleId,
                arg.markSchemeGroupId);
            let cacheKey = 'marker';
            let cacheValue = 'markerProgress_' + arg.examinerRoleId;
            that.storageAdapterHelper.clearCacheByKey(
                cacheKey,
                cacheValue);
            that.storageAdapterHelper.clearCacheByKey(
                'qigselector',
                'overviewdata');
            callback(secondStandardisationReturn.success, secondStandardisationReturn);
        }).catch(function (json: any) {
            callback(false, json);
        });
    }

    /**
     * Get the Unactioned Exceptions
     */
    public getUnActionedExceptions(markSchemeGroupId: number,
        callback: ((success: boolean, unActionedException: any, isResultFromCache: boolean) => void),
        useCache: boolean): void {
        let that = this;

        if (useCache) {
            // Load from Cache if the use Cache flag is specified
            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('team',
                'unActionedException_' + markSchemeGroupId,
                true,
                config.cacheconfig.TEAM_UNACTIONED_EXCEPTION_CACHE_IN_MINUTES);

            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                if (callback) {
                    // Call back with Cached Data
                    callback(true, JSON.parse(jsonResult.value).unActionedExcptions, true);
                }
            }).catch(function (jsonResult: any) {
                that.getUnActionedExceptionsData(markSchemeGroupId, callback);
            });
        } else {
            this.getUnActionedExceptionsData(markSchemeGroupId, callback);
        }
    }

    /**
     * getUnActioned Exceptions thats available to be actioned for the examiner
     * @param {number} markSchemeGroupId
     * @param {Function} callback
     */
    private getUnActionedExceptionsData(markSchemeGroupId: number, callback: Function) {
        // Exception Url
        let unActionedExceptionUrl = urls.GET_UNACTIONED_EXCEPTIONS + '/' + markSchemeGroupId;
        let getUnActionedExceptionPromise = this.makeAJAXCall('GET', unActionedExceptionUrl);
        let that = this;

        // Get the data from the cache
        getUnActionedExceptionPromise.then(function (json: any) {
            storageAdapterFactory.getInstance().storeData('team', 'unActionedException_' + markSchemeGroupId,
                json, true).then().catch();
            callback(true, JSON.parse(json).unActionedExcptions, false);
        }).catch(function (json: any) {
            callback(false, undefined, false);
        });
    }

    /**
     * Returns the Help Examiners grid data
     * @param examinerRoleID
     * @param markSchemeGroupId
     * @param callback
     * @param useCache
     */
    public getHelpExminersData(
        examinerRoleID: number,
        markSchemeGroupId: number,
        callback: ((success: boolean, myTeamData: any, isResultFromCache: boolean) => void),
        useCache: boolean): void {

        let that = this;

        if (useCache) {
            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('team',
                'helpExaminersData_' + examinerRoleID + '_' + markSchemeGroupId,
                true,
                config.cacheconfig.TWO_MINUTES_CACHE_TIME);

            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                if (callback) {
                    callback(true, JSON.parse(jsonResult.value).examiners, true);
                }
            }).catch(function (jsonResult: any) {
                that.getHelpExaminersDetails(examinerRoleID, markSchemeGroupId, callback);
            });
        } else {
            this.getHelpExaminersDetails(examinerRoleID, markSchemeGroupId, callback);
        }
    }

    /**
     * validates the team management examiner
     * @param markSchemeGroupId
     * @param subExaminerRoleId
     * @param subExaminerId
     * @param callback
     */
    public teamManagementExaminerValidation(markSchemeGroupId: number,
        examinerRoleId: number,
        subExaminerRoleId: number,
        subExaminerId: number,
        examinerValidationArea: enums.ExaminerValidationArea,
        callback: ((success: boolean, result: ValidateExaminerReturn) => void)): void {
        this.validateTeamManagementExaminer(markSchemeGroupId,
            examinerRoleId,
            subExaminerRoleId,
            subExaminerId,
            examinerValidationArea,
            callback);
    }

    /**
     * validates the team management examiner
     * @param markSchemeGroupId
     * @param subExaminerRoleId
     * @param subExaminerId
     * @param callback
     */
    public validateTeamManagementExaminer(markSchemeGroupId: number,
        examinerRoleId: number,
        subExaminerRoleId: number,
        subExaminerId: number,
        examinerValidationArea: enums.ExaminerValidationArea,
        callback: Function) {
        let url = urls.TEAMMANAGEMENT_EXAMINER_VALIDATION_URL
            .concat('/')
            .concat(markSchemeGroupId.toString())
            .concat('/')
            .concat(examinerRoleId.toString())
            .concat('/')
            .concat(subExaminerRoleId.toString())
            .concat('/')
            .concat(subExaminerId.toString())
            .concat('/')
            .concat(examinerValidationArea.toString());

        let getMyTeamPromise = this.makeAJAXCall('GET', url);
        let that = this;
        getMyTeamPromise.then(function (json: any) {
            callback(true, JSON.parse(json));
        }).catch(function (json: any) {
            callback(false, json);
        });
    }

    /**
     * Get the Help Examiners Details
     * @param examinerRoleID
     * @param markSchemeGroupId
     * @param callback
     */
    private getHelpExaminersDetails(examinerRoleID: number, markSchemeGroupId: number, callback: Function) {
        let url = urls.GET_HELP_EXAMINERS_URL
            .concat('/')
            .concat(examinerRoleID.toString())
            .concat('/')
            .concat(markSchemeGroupId.toString());
        let getMyTeamPromise = this.makeAJAXCall('GET', url);
        let that = this;
        getMyTeamPromise.then(function (json: any) {
            storageAdapterFactory.getInstance().storeData('team', 'helpExaminersData_' + examinerRoleID + '_' + markSchemeGroupId,
                json, true).then().catch();
            that.clearTeamOverViewCache(examinerRoleID, markSchemeGroupId);
            callback(true, JSON.parse(json).examiners, false);
        }).catch(function (json: any) {
            callback(false, undefined, false);
        });
    }

   /**
    * Clear the team overview data in certain scenarios
    * @param examinerRoleId
    * @param markSchemeGroupId
    */
    private clearTeamOverViewCache(
        examinerRoleId: number, markSchemeGroupId: number) {
        storageAdapterFactory.getInstance().deleteData('team', 'teamOverviewCount_' + examinerRoleId + '_' + markSchemeGroupId).catch();
    }

    /**
     * Excute the SEP Action
     * @param doSEPApprovalManagementActionArgument
     * @param callback
     */
    public ExecuteApprovalManagementAction(
        doSEPApprovalManagementActionArgument: DoSEPApprovalManagementActionArgument,
        callback: ((success: boolean, doSEPApprovalManagementActionReturn: DoSEPApprovalManagementActionReturn) => void)): void {

        let url = urls.EXECUTE_APPROVAL_MANAGEMENT_URL;
        let that = this;

        let worklistPromise = this.makeAJAXCall('POST', url, JSON.stringify(doSEPApprovalManagementActionArgument), true, false);
        worklistPromise.then(function (json: any) {
            if (callback) {

                // Sep Actions can affect the permission to the display ID in messaging, SO delete the cache
                if (doSEPApprovalManagementActionArgument.actionIdentifier !== enums.SEPAction.SendMessage &&
                    doSEPApprovalManagementActionArgument.actionIdentifier !== enums.SEPAction.ViewResponse &&
                    doSEPApprovalManagementActionArgument.actionIdentifier !== enums.SEPAction.None) {
                    storageAdapterFactory.getInstance().deleteStorageArea('messaging');
                }

                if (doSEPApprovalManagementActionArgument.actionIdentifier === enums.SEPAction.Unlock) {
                    // clearing the team overview counts
                    let sepExaminer: ExaminerForSEPAction = doSEPApprovalManagementActionArgument.examiners.first();
                    that.clearTeamOverViewCache(sepExaminer.examinerRoleId,
                        sepExaminer.markSchemeGroupId);
                }

                that.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                let result: DoSEPApprovalManagementActionReturn = JSON.parse(json);
                callback(result.success, result);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * updating supervisor Sampling Review Comments
     * @param supervisorSamplingCommentArguments
     * @param callback
     */
    public updateSamplingReviewComments(
        supervisorSamplingCommentArguments: supervisorSamplingCommentArguments,
        callback: ((success: boolean, supervisorSamplingCommentReturn: SupervisorSamplingCommentReturn) => void)): void {

        let url = urls.SAVE_SUPERVISOR_SAMPLING_COMMENT_URL;
        let that = this;

        let samplingStatusPromise = this.makeAJAXCall('POST',
            url,
            JSON.stringify(supervisorSamplingCommentArguments),
            true,
            false);

        samplingStatusPromise.then(function (json: any) {
            if (callback) {
                let result: SupervisorSamplingCommentReturn = JSON.parse(json);
                callback(result.success, JSON.parse(json));
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Get the Multi Qig Lock Examiners Details
     * @param logginedExaminerRoleID
     * @param markSchemeGroupId
     * @param selectedExaminerId
     * @param callback
     */
    public getMultiQigLockExaminersDetails(logginedExaminerRoleID: number, markSchemeGroupId: number,
        selectedExaminerId: number, callback: ((success: boolean,
            examinersDataForMultiQigHelpExaminer: Immutable.List<MultiQigLockExaminer>) => void)): void {
        let url = urls.GET_MULTI_QIG_LOCK_EXAMINERS_URL
            .concat('/')
            .concat(logginedExaminerRoleID.toString())
            .concat('/')
            .concat(markSchemeGroupId.toString())
            .concat('/')
            .concat(selectedExaminerId.toString());
        let getMultiQigHelpExaminersPromise = this.makeAJAXCall('GET', url);
        let that = this;
        getMultiQigHelpExaminersPromise.then(function (json: any) {
            callback(true, JSON.parse(json).examiners);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }

    /**
     * returns the response to marker worklist
     * @param returnToMarkerArgs
     * @param callback
     */
    public returnResponseToMarker(returnToMarkerArgs: returnToMarkerArguments,
        callback: ((success: boolean, returnToMarkerReturn: returnToMarkerReturn) => void)) {
        let url = urls.RETURN_RESPONSE_URL;
        let returnResponseToMarkerPromise = this.makeAJAXCall('POST',
            url,
            JSON.stringify(returnToMarkerArgs),
            true,
            false);
        let that = this;

        returnResponseToMarkerPromise.then(function (json: any) {
            callback(true, JSON.parse(json));
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }
}

let teamManagementDataService = new TeamManagementDataService();
export = teamManagementDataService;