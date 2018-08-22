import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import getExceptionTypeArguments = require('./getexceptiontypesarguments');
import storageAdapterHelper = require('../storageadapters/storageadapterhelper');
import enums = require('../../components/utility/enums');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
declare let config: any;

class ExceptionDataService extends dataServiceBase {

    private storageAdapterHelper = new storageAdapterHelper();

    /**
     * Getting Exception of a response
     * @param candidateScriptId
     * @param markschemeGroupId
     * @param callback
     */
    public getExceptionsForResponse(candidateScriptId: number, markGroupId: number,
        markschemeGroupId: number, isTeamManagementMode: boolean, callback: Function) {

        let that = this;
        let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('ExceptionForResponse',
            'Exception-Data-' + candidateScriptId + markGroupId + markschemeGroupId + isTeamManagementMode,
            true,
            config.cacheconfig.TWO_MINUTES_CACHE_TIME);

        inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
            if (callback) {
                callback(true, jsonResult.value, true);
            }
        }).catch(function (jsonResult: any) {
            that.getResponseExceptionsFromServer(candidateScriptId, markGroupId,
                markschemeGroupId, isTeamManagementMode, callback);
        });

    }

    /**
     * Getting Exception of a response
     * @param candidateScriptId
     * @param markschemeGroupId
     * @param callback
     */
    public getResponseExceptionsFromServer(candidateScriptId: number, markGroupId: number,
        markschemeGroupId: number, isTeamManagementMode: boolean, callback: Function) {
        let url = urls.GET_EXCEPTIONS_FOR_RESPONSE + '/' + candidateScriptId + '/' +
            markGroupId + '/' + markschemeGroupId + '/' + isTeamManagementMode;
        let getExceptionDetailsPromise = this.makeAJAXCall('GET', url);
        getExceptionDetailsPromise.then(function (json: any) {
            storageAdapterFactory.getInstance().storeData('ExceptionForResponse',
                'Exception-Data-' + candidateScriptId + markGroupId + markschemeGroupId + isTeamManagementMode,
                JSON.parse(json), true).then().catch();
            let exceptionData = JSON.parse(json);

            callback(true, exceptionData);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }

    /**
     * Get exception types of a particular Qig
     * @param exceptionTypeArg
     * @param callback
     */
    public getExceptionTypes(exceptionTypeArg: getExceptionTypeArguments, callback: Function) {
        let url = urls.GET_EXCEPTION_TYPES;
        let getExceptionDetailsPromise = this.makeAJAXCall('POST', url, JSON.stringify(exceptionTypeArg));
        getExceptionDetailsPromise.then(function (json: any) {
            let exceptionData = JSON.parse(json);
            callback(true, exceptionData);
        }).catch(function (json: any) {
            callback(false, undefined);
        });
    }

    /**
     * Raise New Exception
     * @param saveExceptionArg
     * @param callback
     * @param currentMarkGroupId
     * @param currentMarkSchemeGroupId
     */
    public raiseException(saveExceptionArg: RaiseExceptionParams, callback: Function,
        currentMarkGroupId: number, currentMarkSchemeGroupId: number) {
        let url = urls.CREATE_EXCEPTION;

        let getsaveExceptionPromise = this.makeAJAXCall('POST', url, JSON.stringify({ 'Exception': saveExceptionArg }));
        let that = this;
        getsaveExceptionPromise.then(function (json: any) {
            let responseData = JSON.parse(json);

            // 'false' is hardcoded to clear the exception data of response 
            let cacheKey = 'ExceptionForResponse';
            let cacheValue = 'Exception-Data-' +
                saveExceptionArg.candidateScriptID +
                currentMarkGroupId +
                currentMarkSchemeGroupId +
                false;
            that.storageAdapterHelper.clearCacheByKey(
                cacheKey,
                cacheValue);

            callback(true, responseData);
        }).catch(function (json: any) {
            callback(false, json);
        });
    }

    /**
     * Update exception status
     * @param exceptionActionArg
     * @param callback
     */
    public updateExceptionStatus(exceptionActionArg: ExceptionActionParams, callback: Function) {
        let url = urls.UPDATE_EXCEPTION_STATUS;
        let getcloseExceptionPromise = this.makeAJAXCall('POST', url, JSON.stringify(exceptionActionArg));
        let that = this;
        let cacheKey = '';
        let cacheValue = '';
        getcloseExceptionPromise.then(function (json: any) {
            if (exceptionActionArg.actionType === enums.ExceptionActionType.Escalate ||
                exceptionActionArg.actionType === enums.ExceptionActionType.Resolve) {
                /* If exception action (Escalate or Resolve) successfully completed then
                 clear unactioned exception cache for getting the refreshed exception list */
                cacheKey = 'team';
                cacheValue = 'unActionedException_' + exceptionActionArg.qigId;
                that.storageAdapterHelper.clearCacheByKey(
                    cacheKey,
                    cacheValue);

                // Clear cache for team overview
                cacheValue = 'teamOverviewCount_' + exceptionActionArg.requestedByExaminerRoleId + '_' +
                        exceptionActionArg.qigId;
                that.storageAdapterHelper.clearCacheByKey(
                    cacheKey,
                    cacheValue);

                cacheKey = 'ExceptionForResponse';
                cacheValue = 'Exception-Data-' +
                    exceptionActionArg.exception.candidateScriptID +
                    exceptionActionArg.exception.markGroupId +
                    exceptionActionArg.qigId +
                    true;
                that.storageAdapterHelper.clearCacheByKey(
                    cacheKey,
                    cacheValue);
            }
            if (exceptionActionArg.actionType === enums.ExceptionActionType.Close) {
                /* If exception action 'Close' successfully completed then
                 clear the worklist cache for getting the refreshed data */
                that.storageAdapterHelper.clearCacheByKey('worklist',
                    that.storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                        exceptionActionArg.worklistType,
                        exceptionActionArg.responseMode,
                        exceptionActionArg.remarkRequestType,
                        exceptionActionArg.requestedByExaminerRoleId));

                // 'false' is hardcoded to clear the exception data of response 
                cacheKey = 'ExceptionForResponse';
                cacheValue = 'Exception-Data-' +
                    exceptionActionArg.exception.candidateScriptID +
                    exceptionActionArg.exception.markGroupId +
                    exceptionActionArg.qigId +
                    false;
                that.storageAdapterHelper.clearCacheByKey(
                    cacheKey,
                    cacheValue);
            }
            let responseData = JSON.parse(json);
            callback(responseData.success, responseData.exceptionId, responseData, exceptionActionArg.actionType);
        }).catch(function (json: any) {
            callback(false, undefined, json);
        });
    }
}

let exceptionDataService = new ExceptionDataService();
export = exceptionDataService;