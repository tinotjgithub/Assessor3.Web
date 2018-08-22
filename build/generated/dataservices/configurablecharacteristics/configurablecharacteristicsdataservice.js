"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var URLs = require('../base/urls');
var storageAdapterFactory = require('../storageadapters/storageadapterfactory');
var Immutable = require('immutable');
var ConfigurableCharacteristicsDataService = (function (_super) {
    __extends(ConfigurableCharacteristicsDataService, _super);
    function ConfigurableCharacteristicsDataService() {
        _super.apply(this, arguments);
    }
    /**
     * get immutable
     * @param data
     */
    ConfigurableCharacteristicsDataService.prototype.getImmutable = function (data) {
        var immutableList = Immutable.List(data.configurableCharacteristics);
        data.configurableCharacteristics = immutableList;
        return data;
    };
    /**
     * Determines whether to retrieve data from cache or needs a service call and returns the data.
     * @param callback - call back with success boolean and JSON object corresponding to Exam Body CCs.
     */
    ConfigurableCharacteristicsDataService.prototype.getExamBodyCCs = function (callback, useCache) {
        if (useCache === void 0) { useCache = false; }
        var that = this;
        if (useCache) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('exambody', 'configcharacteristics', true, 0);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult) {
                that.getExamBodyCCsFromServer(callback);
            });
        }
        else {
            this.getExamBodyCCsFromServer(callback);
        }
    };
    /**
     * Call the Configurable Characteristics data service and returns JSON object Exam body CCs.
     * @param callback - call back with success boolean and JSON object corresponding to Exam Body CCs.
     */
    ConfigurableCharacteristicsDataService.prototype.getExamBodyCCsFromServer = function (callback) {
        var url = URLs.EXAM_BODY_CC_URL;
        /**  Making AJAX call to get the locale JSON */
        var localePromise = this.makeAJAXCall('GET', url);
        localePromise.then(function (json) {
            if (callback) {
                storageAdapterFactory.getInstance().storeData('exambody', 'configcharacteristics', JSON.parse(json), true).then().catch();
                callback(true, JSON.parse(json));
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Call the Configurable Characteristics data service and returns JSON object Exam body CCs.
     * @param callback - call back with success boolean and JSON object corresponding to Exam Body CCs.
     */
    ConfigurableCharacteristicsDataService.prototype.getMarkSchemeGroupCCs = function (markSchemeGroupId, questionPaperId, callback) {
        // Trying to retrieve from In memory storage - default cache time for QIG Level CCs is 30 minutes
        var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('configurablecharacteristic', 'markschemegroupccforqp_' + questionPaperId, true, config.
            cacheconfig.THIRTY_MINUTES_CACHE_TIME);
        var configurableCharacteristics;
        var that = this;
        // OnSuccess of promise
        inMemoryStorageAdapterPromise.then(function (jsonResult) {
            callback(true, jsonResult.value);
        }).catch(function (jsonResult) {
            // OnFailure of promise, invoking the AJAX request to get the QIG Level CCs
            var url = URLs.MARK_SCHEME_GROUP_CC_URL;
            var getMarkSchemeGroupCCPromise = that.makeAJAXCall('GET', url + '/' + markSchemeGroupId);
            // OnSuccess of promise, storing the CC data to in memory storage and then invoking the callback
            getMarkSchemeGroupCCPromise.then(function (result) {
                configurableCharacteristics = that.getImmutable(JSON.parse(result));
                if (callback) {
                    storageAdapterFactory.getInstance().storeData('configurablecharacteristic', 'markschemegroupccforqp_' + questionPaperId, configurableCharacteristics, true).then(function () {
                        callback(true, configurableCharacteristics);
                    }).catch();
                }
            }).catch(function (result) {
                if (callback) {
                    callback(false, result);
                }
            });
        });
    };
    return ConfigurableCharacteristicsDataService;
}(dataServiceBase));
var configurableCharacteristicsDataService = new ConfigurableCharacteristicsDataService();
module.exports = configurableCharacteristicsDataService;
//# sourceMappingURL=configurablecharacteristicsdataservice.js.map