"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var enums = require('../../components/utility/enums');
var storageAdapterHelper = require('../storageadapters/storageadapterhelper');
var SubmitResponseDataService = (function (_super) {
    __extends(SubmitResponseDataService, _super);
    function SubmitResponseDataService() {
        _super.apply(this, arguments);
        this.storageAdapterHelper = new storageAdapterHelper();
    }
    /**
     * Method which makes the AJAX call to submit responses
     * @param submitResponseArgument
     * @param markSchemeGroupId
     * @param remarkRequestType
     * @param callback
     */
    SubmitResponseDataService.prototype.submitResponses = function (submitResponseArgument, markSchemeGroupId, worklistType, remarkRequestType, examinerRoleIds, markSchemeGroupIds, callback) {
        /* Clear open/closed/pending cache */
        if (remarkRequestType === void 0) { remarkRequestType = enums.RemarkRequestType.Unknown; }
        if (examinerRoleIds === void 0) { examinerRoleIds = null; }
        if (markSchemeGroupIds === void 0) { markSchemeGroupIds = null; }
        this.storageAdapterHelper.clearCache(markSchemeGroupId, submitResponseArgument.markingMode, remarkRequestType, submitResponseArgument.examinerRoleId, worklistType);
        var url = urls.SUBMIT_RESPONSE;
        var that = this;
        var index = 0;
        //Clearing Cache for Whole Response
        if (markSchemeGroupIds && markSchemeGroupIds.length !== 0) {
            do {
                this.storageAdapterHelper.clearCache(markSchemeGroupIds[index], submitResponseArgument.markingMode, remarkRequestType, examinerRoleIds[index], worklistType);
                index++;
            } while (index < markSchemeGroupIds.length);
        }
        index = 0;
        /**  Making AJAX call to get the examiner progress fata */
        var worklistPromise = this.makeAJAXCall('POST', url, JSON.stringify(submitResponseArgument), true, false);
        worklistPromise.then(function (json) {
            if (callback) {
                var result = JSON.parse(json);
                that.storageAdapterHelper.clearCachePostSubmission(submitResponseArgument.examinerRoleId, submitResponseArgument.markingMode, result);
                //Clearing Cache for Whole Response
                if (examinerRoleIds && examinerRoleIds.length !== 0) {
                    do {
                        that.storageAdapterHelper.clearCachePostSubmission(examinerRoleIds[index], submitResponseArgument.markingMode, result);
                        index++;
                    } while (index < examinerRoleIds.length);
                }
                callback(result.success, result);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    return SubmitResponseDataService;
}(dataServiceBase));
var submitResponseDataService = new SubmitResponseDataService();
module.exports = submitResponseDataService;
//# sourceMappingURL=submitresponsedataservice.js.map