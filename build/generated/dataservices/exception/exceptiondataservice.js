"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var storageAdapterHelper = require('../storageadapters/storageadapterhelper');
var enums = require('../../components/utility/enums');
var storageAdapterFactory = require('../storageadapters/storageadapterfactory');
var ExceptionDataService = (function (_super) {
    __extends(ExceptionDataService, _super);
    function ExceptionDataService() {
        _super.apply(this, arguments);
        this.storageAdapterHelper = new storageAdapterHelper();
    }
    /**
     * Getting Exception of a response
     * @param candidateScriptId
     * @param markschemeGroupId
     * @param callback
     */
    ExceptionDataService.prototype.getExceptionsForResponse = function (candidateScriptId, markGroupId, markschemeGroupId, isTeamManagementMode, callback) {
        var that = this;
        var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('ExceptionForResponse', 'Exception-Data-' + candidateScriptId + markGroupId + markschemeGroupId + isTeamManagementMode, true, config.cacheconfig.TWO_MINUTES_CACHE_TIME);
        inMemoryStorageAdapterPromise.then(function (jsonResult) {
            if (callback) {
                callback(true, jsonResult.value, true);
            }
        }).catch(function (jsonResult) {
            that.getResponseExceptionsFromServer(candidateScriptId, markGroupId, markschemeGroupId, isTeamManagementMode, callback);
        });
    };
    /**
     * Getting Exception of a response
     * @param candidateScriptId
     * @param markschemeGroupId
     * @param callback
     */
    ExceptionDataService.prototype.getResponseExceptionsFromServer = function (candidateScriptId, markGroupId, markschemeGroupId, isTeamManagementMode, callback) {
        var url = urls.GET_EXCEPTIONS_FOR_RESPONSE + '/' + candidateScriptId + '/' +
            markGroupId + '/' + markschemeGroupId + '/' + isTeamManagementMode;
        var getExceptionDetailsPromise = this.makeAJAXCall('GET', url);
        getExceptionDetailsPromise.then(function (json) {
            storageAdapterFactory.getInstance().storeData('ExceptionForResponse', 'Exception-Data-' + candidateScriptId + markGroupId + markschemeGroupId + isTeamManagementMode, JSON.parse(json), true).then().catch();
            var exceptionData = JSON.parse(json);
            callback(true, exceptionData);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    /**
     * Get exception types of a particular Qig
     * @param exceptionTypeArg
     * @param callback
     */
    ExceptionDataService.prototype.getExceptionTypes = function (exceptionTypeArg, callback) {
        var url = urls.GET_EXCEPTION_TYPES;
        var getExceptionDetailsPromise = this.makeAJAXCall('POST', url, JSON.stringify(exceptionTypeArg));
        getExceptionDetailsPromise.then(function (json) {
            var exceptionData = JSON.parse(json);
            callback(true, exceptionData);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    /**
     * Raise New Exception
     * @param saveExceptionArg
     * @param callback
     * @param currentMarkGroupId
     * @param currentMarkSchemeGroupId
     */
    ExceptionDataService.prototype.raiseException = function (saveExceptionArg, callback, currentMarkGroupId, currentMarkSchemeGroupId) {
        var url = urls.CREATE_EXCEPTION;
        var getsaveExceptionPromise = this.makeAJAXCall('POST', url, JSON.stringify({ 'Exception': saveExceptionArg }));
        var that = this;
        getsaveExceptionPromise.then(function (json) {
            var responseData = JSON.parse(json);
            // 'false' is hardcoded to clear the exception data of response 
            var cacheKey = 'ExceptionForResponse';
            var cacheValue = 'Exception-Data-' +
                saveExceptionArg.candidateScriptID +
                currentMarkGroupId +
                currentMarkSchemeGroupId +
                false;
            that.storageAdapterHelper.clearCacheByKey(cacheKey, cacheValue);
            callback(true, responseData);
        }).catch(function (json) {
            callback(false, json);
        });
    };
    /**
     * Update exception status
     * @param exceptionActionArg
     * @param callback
     */
    ExceptionDataService.prototype.updateExceptionStatus = function (exceptionActionArg, callback) {
        var url = urls.UPDATE_EXCEPTION_STATUS;
        var getcloseExceptionPromise = this.makeAJAXCall('POST', url, JSON.stringify(exceptionActionArg));
        var that = this;
        var cacheKey = '';
        var cacheValue = '';
        getcloseExceptionPromise.then(function (json) {
            if (exceptionActionArg.actionType === enums.ExceptionActionType.Escalate ||
                exceptionActionArg.actionType === enums.ExceptionActionType.Resolve) {
                /* If exception action (Escalate or Resolve) successfully completed then
                 clear unactioned exception cache for getting the refreshed exception list */
                cacheKey = 'team';
                cacheValue = 'unActionedException_' + exceptionActionArg.qigId;
                that.storageAdapterHelper.clearCacheByKey(cacheKey, cacheValue);
                // Clear cache for team overview
                cacheValue = 'teamOverviewCount_' + exceptionActionArg.requestedByExaminerRoleId + '_' +
                    exceptionActionArg.qigId;
                that.storageAdapterHelper.clearCacheByKey(cacheKey, cacheValue);
                cacheKey = 'ExceptionForResponse';
                cacheValue = 'Exception-Data-' +
                    exceptionActionArg.exception.candidateScriptID +
                    exceptionActionArg.exception.markGroupId +
                    exceptionActionArg.exception.markSchemeGroupID +
                    true;
                that.storageAdapterHelper.clearCacheByKey(cacheKey, cacheValue);
            }
            if (exceptionActionArg.actionType === enums.ExceptionActionType.Close) {
                /* If exception action 'Close' successfully completed then
                 clear the worklist cache for getting the refreshed data */
                that.storageAdapterHelper.clearCacheByKey('worklist', that.storageAdapterHelper.getMemoryStorageKeyForWorklistData(exceptionActionArg.worklistType, exceptionActionArg.responseMode, exceptionActionArg.remarkRequestType, exceptionActionArg.requestedByExaminerRoleId));
                // 'false' is hardcoded to clear the exception data of response 
                cacheKey = 'ExceptionForResponse';
                cacheValue = 'Exception-Data-' +
                    exceptionActionArg.exception.candidateScriptID +
                    exceptionActionArg.exception.markGroupId +
                    exceptionActionArg.exception.markSchemeGroupID +
                    false;
                that.storageAdapterHelper.clearCacheByKey(cacheKey, cacheValue);
            }
            var responseData = JSON.parse(json);
            callback(responseData.success, responseData.exceptionId, responseData, exceptionActionArg.actionType);
        }).catch(function (json) {
            callback(false, undefined, json);
        });
    };
    return ExceptionDataService;
}(dataServiceBase));
var exceptionDataService = new ExceptionDataService();
module.exports = exceptionDataService;
//# sourceMappingURL=exceptiondataservice.js.map