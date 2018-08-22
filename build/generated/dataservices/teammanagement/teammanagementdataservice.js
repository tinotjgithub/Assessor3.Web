"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var storageAdapterFactory = require('../storageadapters/storageadapterfactory');
var enums = require('../../components/utility/enums');
var storageAdapterHelper = require('../storageadapters/storageadapterhelper');
/**
 * Team Management data service class
 */
var TeamManagementDataService = (function (_super) {
    __extends(TeamManagementDataService, _super);
    function TeamManagementDataService() {
        _super.apply(this, arguments);
        this.storageAdapterHelper = new storageAdapterHelper();
    }
    /**
     * getTeamManagementOverviewCounts
     *
     * @param {number} examinerRoleId
     * @param {number} markSchemeGroupId
     * @param {((success: boolean, myTeamData: any, isResultFromCache: boolean) => void)} callback
     * @param {boolean} useCache
     * @memberof TeamManagementDataService
     */
    TeamManagementDataService.prototype.getTeamManagementOverviewCounts = function (examinerRoleId, markSchemeGroupId, callback, useCache) {
        var that = this;
        if (useCache) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('team', 'teamOverviewCount_' + examinerRoleId + '_' + markSchemeGroupId, true, config.cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                if (callback) {
                    callback(true, JSON.parse(jsonResult.value), true);
                }
            }).catch(function (jsonResult) {
                that.getTeamManagementOverviewCountData(examinerRoleId, markSchemeGroupId, callback);
            });
        }
        else {
            this.getTeamManagementOverviewCountData(examinerRoleId, markSchemeGroupId, callback);
        }
    };
    /**
     * getTeamManagementOverviewCountData
     *
     * @private
     * @param {number} examinerRoleId
     * @param {number} markSchemeGroupId
     * @param {Function} callback
     * @memberof TeamManagementDataService
     */
    TeamManagementDataService.prototype.getTeamManagementOverviewCountData = function (examinerRoleId, markSchemeGroupId, callback) {
        var url = urls.GETTEAM_OVERVIEW_URL
            .concat('/')
            .concat(markSchemeGroupId.toString());
        var getTeamOverviewDetailsPromise = this.makeAJAXCall('GET', url);
        var that = this;
        getTeamOverviewDetailsPromise.then(function (json) {
            storageAdapterFactory.getInstance().storeData('team', 'teamOverviewCount_' + examinerRoleId + '_' + markSchemeGroupId, json, true).then().catch();
            callback(true, JSON.parse(json), false);
        }).catch(function (json) {
            callback(false, json, false);
        });
    };
    /**
     * Returns the my team grid data
     * @param examinerRoleID
     * @param markSchemeGroupId
     * @param callback
     * @param useCache
     */
    TeamManagementDataService.prototype.getMyTeamData = function (examinerRoleID, markSchemeGroupId, callback, useCache) {
        var that = this;
        if (useCache) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('team', 'myTeamData_' + examinerRoleID + '_' + markSchemeGroupId, true, config.cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                if (callback) {
                    callback(JSON.parse(jsonResult.value).success, JSON.parse(jsonResult.value).myTeam, true);
                }
            }).catch(function (jsonResult) {
                that.GetMyTeamDetails(examinerRoleID, markSchemeGroupId, callback);
            });
        }
        else {
            this.GetMyTeamDetails(examinerRoleID, markSchemeGroupId, callback);
        }
    };
    /**
     * Sets a response as reviewed
     * @param args
     * @param callBack
     */
    TeamManagementDataService.prototype.SetResonseAsReviewed = function (setAsReviewedArguments, callBack) {
        var url = urls.REVIEW_RESPONSE_URL;
        var arg = JSON.stringify(setAsReviewedArguments);
        var that = this;
        // Returns the promise object for the Ajax call
        var getSetAsReviewedPromise = this.makeAJAXCall('POST', url, arg);
        getSetAsReviewedPromise.then(function (json) {
            var reviewResult = JSON.parse(json);
            // Clear Cache
            var markerCacheKey = 'marker';
            var markerCacheValue = 'markerProgress_' + setAsReviewedArguments.selectedExaminerRoleId;
            that.storageAdapterHelper.clearCacheByKey(markerCacheKey, markerCacheValue);
            callBack(reviewResult, true);
        }).catch(function (json) {
            callBack(json, false);
        });
    };
    /**
     * Get the my team details
     * @param examinerRoleID
     * @param markSchemeGroupId
     * @param callback
     */
    TeamManagementDataService.prototype.GetMyTeamDetails = function (examinerRoleID, markSchemeGroupId, callback) {
        var url = urls.GET_MY_TEAM_URL
            .concat('/')
            .concat(examinerRoleID.toString())
            .concat('/')
            .concat(markSchemeGroupId.toString());
        var getMyTeamPromise = this.makeAJAXCall('GET', url);
        var that = this;
        getMyTeamPromise.then(function (json) {
            storageAdapterFactory.getInstance().storeData('team', 'myTeamData_' + examinerRoleID + '_' + markSchemeGroupId, json, true).then().catch();
            callback(JSON.parse(json).success, JSON.parse(json).myTeam, false);
        }).catch(function (json) {
            callback(false, undefined, false);
        });
    };
    /**
     * Change subordinate status.
     * @param arg
     * @param callback
     */
    TeamManagementDataService.prototype.changeExaminerStatus = function (arg, callback) {
        var url = urls.CHANGE_EXAMINER_STATUS_URL;
        var that = this;
        var changeExaminerStatusPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg));
        changeExaminerStatusPromise.then(function (json) {
            var examinerStatusReturn = JSON.parse(json);
            that.storageAdapterHelper.clearTeamDataCache(arg.loggedInExaminerRoleId, arg.markSchemeGroupId);
            var markerCacheKey = 'marker';
            var markerCacheValue = 'markerInformation_' + arg.examinerRoleId;
            that.storageAdapterHelper.clearCacheByKey(markerCacheKey, markerCacheValue);
            that.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
            callback(examinerStatusReturn.success, examinerStatusReturn);
        }).catch(function (json) {
            callback(false, json);
        });
    };
    /**
     * provide second standardisation.
     * @param arg
     * @param callback
     */
    TeamManagementDataService.prototype.provideSecondStandardisation = function (arg, callback) {
        var url = urls.PROVIDE_EXAMINER_SECOND_STANDARDISATION_URL;
        var that = this;
        var provideSecondStandardisationPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg));
        provideSecondStandardisationPromise.then(function (json) {
            var secondStandardisationReturn = JSON.parse(json);
            that.storageAdapterHelper.clearTeamDataCache(arg.loggedInExaminerRoleId, arg.markSchemeGroupId);
            var cacheKey = 'marker';
            var cacheValue = 'markerProgress_' + arg.examinerRoleId;
            that.storageAdapterHelper.clearCacheByKey(cacheKey, cacheValue);
            that.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
            callback(secondStandardisationReturn.success, secondStandardisationReturn);
        }).catch(function (json) {
            callback(false, json);
        });
    };
    /**
     * Get the Unactioned Exceptions
     */
    TeamManagementDataService.prototype.getUnActionedExceptions = function (markSchemeGroupId, callback, useCache) {
        var that = this;
        if (useCache) {
            // Load from Cache if the use Cache flag is specified
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('team', 'unActionedException_' + markSchemeGroupId, true, config.cacheconfig.TEAM_UNACTIONED_EXCEPTION_CACHE_IN_MINUTES);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                if (callback) {
                    // Call back with Cached Data
                    callback(true, JSON.parse(jsonResult.value).unActionedExcptions, true);
                }
            }).catch(function (jsonResult) {
                that.getUnActionedExceptionsData(markSchemeGroupId, callback);
            });
        }
        else {
            this.getUnActionedExceptionsData(markSchemeGroupId, callback);
        }
    };
    /**
     * getUnActioned Exceptions thats available to be actioned for the examiner
     * @param {number} markSchemeGroupId
     * @param {Function} callback
     */
    TeamManagementDataService.prototype.getUnActionedExceptionsData = function (markSchemeGroupId, callback) {
        // Exception Url
        var unActionedExceptionUrl = urls.GET_UNACTIONED_EXCEPTIONS + '/' + markSchemeGroupId;
        var getUnActionedExceptionPromise = this.makeAJAXCall('GET', unActionedExceptionUrl);
        var that = this;
        // Get the data from the cache
        getUnActionedExceptionPromise.then(function (json) {
            storageAdapterFactory.getInstance().storeData('team', 'unActionedException_' + markSchemeGroupId, json, true).then().catch();
            callback(true, JSON.parse(json).unActionedExcptions, false);
        }).catch(function (json) {
            callback(false, undefined, false);
        });
    };
    /**
     * Returns the Help Examiners grid data
     * @param examinerRoleID
     * @param markSchemeGroupId
     * @param callback
     * @param useCache
     */
    TeamManagementDataService.prototype.getHelpExminersData = function (examinerRoleID, markSchemeGroupId, callback, useCache) {
        var that = this;
        if (useCache) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('team', 'helpExaminersData_' + examinerRoleID + '_' + markSchemeGroupId, true, config.cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                if (callback) {
                    callback(true, JSON.parse(jsonResult.value).examiners, true);
                }
            }).catch(function (jsonResult) {
                that.getHelpExaminersDetails(examinerRoleID, markSchemeGroupId, callback);
            });
        }
        else {
            this.getHelpExaminersDetails(examinerRoleID, markSchemeGroupId, callback);
        }
    };
    /**
     * validates the team management examiner
     * @param markSchemeGroupId
     * @param subExaminerRoleId
     * @param subExaminerId
     * @param callback
     */
    TeamManagementDataService.prototype.teamManagementExaminerValidation = function (markSchemeGroupId, examinerRoleId, subExaminerRoleId, subExaminerId, examinerValidationArea, callback) {
        this.validateTeamManagementExaminer(markSchemeGroupId, examinerRoleId, subExaminerRoleId, subExaminerId, examinerValidationArea, callback);
    };
    /**
     * validates the team management examiner
     * @param markSchemeGroupId
     * @param subExaminerRoleId
     * @param subExaminerId
     * @param callback
     */
    TeamManagementDataService.prototype.validateTeamManagementExaminer = function (markSchemeGroupId, examinerRoleId, subExaminerRoleId, subExaminerId, examinerValidationArea, callback) {
        var url = urls.TEAMMANAGEMENT_EXAMINER_VALIDATION_URL
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
        var getMyTeamPromise = this.makeAJAXCall('GET', url);
        var that = this;
        getMyTeamPromise.then(function (json) {
            callback(true, JSON.parse(json));
        }).catch(function (json) {
            callback(false, json);
        });
    };
    /**
     * Get the Help Examiners Details
     * @param examinerRoleID
     * @param markSchemeGroupId
     * @param callback
     */
    TeamManagementDataService.prototype.getHelpExaminersDetails = function (examinerRoleID, markSchemeGroupId, callback) {
        var url = urls.GET_HELP_EXAMINERS_URL
            .concat('/')
            .concat(examinerRoleID.toString())
            .concat('/')
            .concat(markSchemeGroupId.toString());
        var getMyTeamPromise = this.makeAJAXCall('GET', url);
        var that = this;
        getMyTeamPromise.then(function (json) {
            storageAdapterFactory.getInstance().storeData('team', 'helpExaminersData_' + examinerRoleID + '_' + markSchemeGroupId, json, true).then().catch();
            that.clearTeamOverViewCache(examinerRoleID, markSchemeGroupId);
            callback(true, JSON.parse(json).examiners, false);
        }).catch(function (json) {
            callback(false, undefined, false);
        });
    };
    /**
     * Clear the team overview data in certain scenarios
     * @param examinerRoleId
     * @param markSchemeGroupId
     */
    TeamManagementDataService.prototype.clearTeamOverViewCache = function (examinerRoleId, markSchemeGroupId) {
        storageAdapterFactory.getInstance().deleteData('team', 'teamOverviewCount_' + examinerRoleId + '_' + markSchemeGroupId).catch();
    };
    /**
     * Excute the SEP Action
     * @param doSEPApprovalManagementActionArgument
     * @param callback
     */
    TeamManagementDataService.prototype.ExecuteApprovalManagementAction = function (doSEPApprovalManagementActionArgument, callback) {
        var url = urls.EXECUTE_APPROVAL_MANAGEMENT_URL;
        var that = this;
        var worklistPromise = this.makeAJAXCall('POST', url, JSON.stringify(doSEPApprovalManagementActionArgument), true, false);
        worklistPromise.then(function (json) {
            if (callback) {
                // Sep Actions can affect the permission to the display ID in messaging, SO delete the cache
                if (doSEPApprovalManagementActionArgument.actionIdentifier !== enums.SEPAction.SendMessage &&
                    doSEPApprovalManagementActionArgument.actionIdentifier !== enums.SEPAction.ViewResponse &&
                    doSEPApprovalManagementActionArgument.actionIdentifier !== enums.SEPAction.None) {
                    storageAdapterFactory.getInstance().deleteStorageArea('messaging');
                }
                if (doSEPApprovalManagementActionArgument.actionIdentifier === enums.SEPAction.Unlock) {
                    // clearing the team overview counts
                    var sepExaminer = doSEPApprovalManagementActionArgument.examiners.first();
                    that.clearTeamOverViewCache(sepExaminer.examinerRoleId, sepExaminer.markSchemeGroupId);
                }
                that.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                var result = JSON.parse(json);
                callback(result.success, result);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * updating supervisor Sampling Review Comments
     * @param supervisorSamplingCommentArguments
     * @param callback
     */
    TeamManagementDataService.prototype.updateSamplingReviewComments = function (supervisorSamplingCommentArguments, callback) {
        var url = urls.SAVE_SUPERVISOR_SAMPLING_COMMENT_URL;
        var that = this;
        var samplingStatusPromise = this.makeAJAXCall('POST', url, JSON.stringify(supervisorSamplingCommentArguments), true, false);
        samplingStatusPromise.then(function (json) {
            if (callback) {
                var result = JSON.parse(json);
                callback(result.success, JSON.parse(json));
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Get the Multi Qig Lock Examiners Details
     * @param logginedExaminerRoleID
     * @param markSchemeGroupId
     * @param selectedExaminerId
     * @param callback
     */
    TeamManagementDataService.prototype.getMultiQigLockExaminersDetails = function (logginedExaminerRoleID, markSchemeGroupId, selectedExaminerId, callback) {
        var url = urls.GET_MULTI_QIG_LOCK_EXAMINERS_URL
            .concat('/')
            .concat(logginedExaminerRoleID.toString())
            .concat('/')
            .concat(markSchemeGroupId.toString())
            .concat('/')
            .concat(selectedExaminerId.toString());
        var getMultiQigHelpExaminersPromise = this.makeAJAXCall('GET', url);
        var that = this;
        getMultiQigHelpExaminersPromise.then(function (json) {
            callback(true, JSON.parse(json).examiners);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    return TeamManagementDataService;
}(dataServiceBase));
var teamManagementDataService = new TeamManagementDataService();
module.exports = teamManagementDataService;
//# sourceMappingURL=teammanagementdataservice.js.map