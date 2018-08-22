"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
/**
 *  initiate the Awarding API call and returns the awarding access details along with callback.
 * @param callback
 */
var AwardingDataService = (function (_super) {
    __extends(AwardingDataService, _super);
    function AwardingDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Ajax call for getting the awarding access details
     * @param callback
     */
    AwardingDataService.prototype.getAwardingAccessDetails = function (callback) {
        var url = urls.GET_AWARDING_ACCESS_DETAILS;
        var getAwardingAccessDetails = this.makeAJAXCall('GET', url);
        getAwardingAccessDetails.then(function (json) {
            var result;
            result = JSON.parse(json);
            callback(true, result);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    /**
     * Ajax call for getting the awarding access details
     * @param callback
     */
    AwardingDataService.prototype.getComponentAndSessionDetails = function (callback) {
        var url = urls.GET_AWARDING_COMPONENT_SESSION_DETAILS;
        var componentDetailsPromise = this.makeAJAXCall('GET', url);
        componentDetailsPromise.then(function (json) {
            var result;
            result = JSON.parse(json);
            callback(true, result);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    /**
     * Ajax call for getting the awarding candidate details for selected exam session
     * @param callback
     * @param examSessionID
     */
    AwardingDataService.prototype.getAwardingCandidateDetails = function (callback, examSessionID) {
        var url = urls.GET_AWARDING_CANDIDATE_DETAILS + '/' + examSessionID;
        var awardingcandidateDetailsPromise = this.makeAJAXCall('GET', url);
        awardingcandidateDetailsPromise.then(function (json) {
            var result;
            result = JSON.parse(json);
            callback(true, result);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    return AwardingDataService;
}(dataServiceBase));
var awardingDataService = new AwardingDataService();
module.exports = awardingDataService;
//# sourceMappingURL=awardingdataservice.js.map