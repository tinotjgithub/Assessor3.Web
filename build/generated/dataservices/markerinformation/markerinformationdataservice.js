"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var storageAdapterFactory = require('../storageadapters/storageadapterfactory');
/**
 *  Marker information data service
 * @param {((success} callback
 * @param {function} json
 */
var MarkerInformationDataService = (function (_super) {
    __extends(MarkerInformationDataService, _super);
    function MarkerInformationDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Determines whether to retrieve data from cache or needs a service call and returns the data.
     * @param {((success} callback
     * @param {function} json
     */
    MarkerInformationDataService.prototype.GetMarkerInformation = function (examinerRoleID, markSchemeGroupId, callback, useCache, currentApprovalStatus) {
        var that = this;
        if (useCache) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('marker', 'markerInformation_' + examinerRoleID, true, 0);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                if (callback) {
                    callback(true, jsonResult.value, true);
                }
            }).catch(function (jsonResult) {
                that.GetMarkerInformationOnline(examinerRoleID, markSchemeGroupId, callback);
            });
        }
        else {
            this.GetMarkerInformationOnline(examinerRoleID, markSchemeGroupId, callback);
        }
    };
    /**
     * Get profile information of the logged in examiner.
     */
    MarkerInformationDataService.prototype.GetMarkerInformationOnline = function (examinerRoleID, markSchemeGroupId, callback) {
        var url = urls.MARKER_INFO_URL
            .concat('/')
            .concat(examinerRoleID.toString())
            .concat('/')
            .concat(markSchemeGroupId.toString());
        var userInfoPromise = this.makeAJAXCall('GET', url);
        var that = this;
        userInfoPromise.then(function (json) {
            storageAdapterFactory.getInstance().storeData('marker', 'markerInformation_' + examinerRoleID, json, true).then().catch();
            callback(true, json, false);
        }).catch(function (json) {
            callback(false, undefined, false);
        });
    };
    return MarkerInformationDataService;
}(dataServiceBase));
var markerInformationDataService = new MarkerInformationDataService();
module.exports = markerInformationDataService;
//# sourceMappingURL=markerinformationdataservice.js.map