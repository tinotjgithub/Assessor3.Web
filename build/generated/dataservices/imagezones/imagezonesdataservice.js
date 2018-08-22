"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var storageAdapterFactory = require('../storageadapters/storageadapterfactory');
var Immutable = require('immutable');
/**
 * Class for Getting image zone details
 */
var ImagezonesDataService = (function (_super) {
    __extends(ImagezonesDataService, _super);
    function ImagezonesDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Get the imagezone details.
     * @param {((success} callback
     * @param {function} json
     * @param questionPaperId
     * @param useCache
     */
    ImagezonesDataService.prototype.getImageZoneDetails = function (callback, questionPaperId, markSchemeGroupId, useCache) {
        var that = this;
        if (useCache) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('imagezone', 'imagezonelist_' + questionPaperId, true, config.
                cacheconfig.THIRTY_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult) {
                that.getImageZoneDetailOnline(questionPaperId, markSchemeGroupId, callback);
            });
        }
        else {
            this.getImageZoneDetailOnline(questionPaperId, markSchemeGroupId, callback);
        }
    };
    /**
     * Call Api to get the data
     * @param {number} questionPaperId
     * @param callback?
     */
    ImagezonesDataService.prototype.getImageZoneDetailOnline = function (questionPaperId, markSchemeGroupId, callback) {
        var url = urls.IMAGE_ZONE_GET_URL + '/' + questionPaperId + '/' + markSchemeGroupId;
        var getImageZoneListPromise = this.makeAJAXCall('GET', url);
        var that = this;
        getImageZoneListPromise.then(function (jsonData) {
            if (callback) {
                var resultData = that.parseJsonResult(jsonData);
                storageAdapterFactory.getInstance().storeData('imagezone', 'imagezonelist_' + questionPaperId, resultData, true)
                    .then()
                    .catch();
                callback(resultData.success, resultData);
            }
        }).catch(function (jsonData) {
            if (callback) {
                callback(false, jsonData);
            }
        });
    };
    /**
     * Map the result JSON to the object.
     * @param {string} json
     * @returns The mapped result
     */
    ImagezonesDataService.prototype.parseJsonResult = function (json) {
        var result;
        result = JSON.parse(json);
        result.imageZones = Immutable.List(JSON.parse(json).imageZones);
        return result;
    };
    return ImagezonesDataService;
}(dataServiceBase));
var imagezonesDataService = new ImagezonesDataService();
module.exports = imagezonesDataService;
//# sourceMappingURL=imagezonesdataservice.js.map