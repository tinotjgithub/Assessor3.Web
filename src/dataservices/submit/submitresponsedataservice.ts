import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import Immutable = require('immutable');
declare let config: any;
import enums = require('../../components/utility/enums');
import storageAdapterHelper = require('../storageadapters/storageadapterhelper');
import ShareAndClassifyReturn  = require('../../stores/submit/typings/shareAndClassifyReturn');

class SubmitResponseDataService extends dataServiceBase {

    private storageAdapterHelper = new storageAdapterHelper();

    /**
     * Method which makes the AJAX call to submit responses
     * @param submitResponseArgument
     * @param markSchemeGroupId
     * @param remarkRequestType
     * @param callback
     */
    public submitResponses(submitResponseArgument: SubmitResponseArgument, markSchemeGroupId: number,
        worklistType: enums.WorklistType,
        remarkRequestType: enums.RemarkRequestType = enums.RemarkRequestType.Unknown,
        examinerRoleIds: Array<number> = null, markSchemeGroupIds: Array<number> = null,
        callback: ((success: boolean, submitResponseReturn: SubmitResponseReturn) => void)): void {
        /* Clear open/closed/pending cache */

        this.storageAdapterHelper.clearCache(markSchemeGroupId, submitResponseArgument.markingMode,
            remarkRequestType, submitResponseArgument.examinerRoleId, worklistType);
        let url = urls.SUBMIT_RESPONSE;
        let that = this;
        let index: number = 0;

        //Clearing Cache for Whole Response
        if (markSchemeGroupIds && markSchemeGroupIds.length !== 0) {
            do {
                this.storageAdapterHelper.clearCache(markSchemeGroupIds[index], submitResponseArgument.markingMode,
                    remarkRequestType, examinerRoleIds[index], worklistType);
                index++;
            } while (index < markSchemeGroupIds.length);
        }
        index = 0;
        /**  Making AJAX call to get the examiner progress fata */
        let worklistPromise = this.makeAJAXCall('POST', url, JSON.stringify(submitResponseArgument), true, false);
        worklistPromise.then(function (json: any) {
            if (callback) {
                let result: SubmitResponseReturn = JSON.parse(json);
                that.storageAdapterHelper.clearCachePostSubmission(submitResponseArgument.examinerRoleId,
                    submitResponseArgument.markingMode, result);
                //Clearing Cache for Whole Response
                if (examinerRoleIds && examinerRoleIds.length !== 0) {
                    do {
                        that.storageAdapterHelper.clearCachePostSubmission(examinerRoleIds[index],
                            submitResponseArgument.markingMode, result);
                        index++;
                    } while (index < examinerRoleIds.length);
                }
                callback(result.success, result);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * ShareAndClassifyResponse
     */
    public ShareAndClassifyResponse(
        submitResponseArgument: SubmitResponseArgument,
        callback: ((success: boolean, shareAndClassifyResponseReturn: ShareAndClassifyReturn) => void)): void {
            let url = urls.SHARE_AND_CLASSIFY_RESPONSE;
        let that = this;
        let index: number = 0;

        /**  Making AJAX call to get data */
        let worklistPromise = this.makeAJAXCall('POST', url, JSON.stringify(submitResponseArgument), true, false);
        worklistPromise.then(function (json: any) {
            if (callback) {
                let result: ShareAndClassifyReturn = JSON.parse(json);

                callback(true, result);
            }
        }).catch(function (json: any) {
            if (callback) {
                callback(false, json);
            }
        });
    }
}

let submitResponseDataService = new SubmitResponseDataService();
export = submitResponseDataService;