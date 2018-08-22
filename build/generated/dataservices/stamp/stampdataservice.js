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
var StampDataService = (function (_super) {
    __extends(StampDataService, _super);
    function StampDataService() {
        _super.apply(this, arguments);
    }
    /**
     * This method will load the defined stamps for the selected QIG
     * @param callback - callback function
     * @param markSchemeGroupId - selected markschemegroupId
     * @param stampIds - The stamp details already in store need not be fetched again from DB.
     * @param useCache - boolean field to decide whether we need to use cache or not
     */
    StampDataService.prototype.getStampList = function (callback, markSchemeGroupId, stampIds, markingMethod, includeRelatedQigs, useCache, isEbookmarking) {
        var that = this;
        if (useCache) {
            // Returns the Promise object for in-memory storage adapter.
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('stamp', 'stamplist_' + markSchemeGroupId, true, config.
                cacheconfig.THIRTY_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                // If retrieve from memory then simply invoke the callback
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult) {
                // If not found in memory, invoke the call to the server to retrieve stamp data.
                that.makeAJAXCallForStampData(true, markSchemeGroupId, stampIds, markingMethod, includeRelatedQigs, isEbookmarking, callback);
            });
        }
        else {
            // If we don't need to use cache, then stamp data will be directly fetch from server.
            this.makeAJAXCallForStampData(true, markSchemeGroupId, stampIds, markingMethod, includeRelatedQigs, isEbookmarking, callback);
        }
    };
    /**
     * This will make a ajax call for loading stamp data.
     * @param markSchemeGroupId - selected markschemegroupId
     * @param stampIds - available stamp Ids
     * @param callback - callback function
     */
    StampDataService.prototype.makeAJAXCallForStampData = function (doCacheData, markSchemeGroupId, stampIds, markingMethod, includeRelatedQigs, isEbookmarking, callback) {
        var url = urls.STAMPS_GET_URL;
        var arg = JSON.stringify({
            MarkSchemeGroupId: markSchemeGroupId, StampIds: stampIds,
            MarkingMethod: markingMethod, IncludeRelatedQigs: includeRelatedQigs,
            IsEbookMarking: isEbookmarking
        });
        // Returns the promise object for the Ajax call
        var getStampListPromise = this.makeAJAXCall('POST', url, arg);
        var that = this;
        getStampListPromise.then(function (jsonData) {
            if (callback) {
                var resultData = that.getImmutableListObject(JSON.parse(jsonData));
                // If data to be cached, then store it in in-memory storage adapter.
                if (doCacheData) {
                    // we don't need to keep stamps in in-memory storage because we are storing the entire stamps in store variable.
                    var dataToStore_1 = that.getImmutableListObject(JSON.parse(jsonData));
                    dataToStore_1.stampDataAgainstQig.forEach(function (item) {
                        item.stamps = null;
                        storageAdapterFactory.getInstance().storeData('stamp', 'stamplist_' + markSchemeGroupId, dataToStore_1, true)
                            .then()
                            .catch();
                    });
                }
                // If callback exists, invoke the same
                if (callback) {
                    callback(resultData.success, resultData);
                }
            }
        }).catch(function (jsonData) {
            // If callback exists, invoke the same with success value as false since Ajax call failed.
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
    StampDataService.prototype.getImmutableListObject = function (data) {
        data.stampDataAgainstQig.forEach(function (item) {
            item.stamps = Immutable.List(item.stamps);
            item.markSchemGroupStampIds = Immutable.List(item.markSchemGroupStampIds);
        });
        return data;
    };
    return StampDataService;
}(dataServiceBase));
var stampDataService = new StampDataService();
module.exports = stampDataService;
//# sourceMappingURL=stampdataservice.js.map