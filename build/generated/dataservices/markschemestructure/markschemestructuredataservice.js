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
 * Class for Getting MarkSchemeStructure details
 */
var MarkSchemeStructureDataService = (function (_super) {
    __extends(MarkSchemeStructureDataService, _super);
    function MarkSchemeStructureDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Get the MarkSchemeStructure details.
     * @param {((success} callback
     * @param {function} json
     * @param questionPaperId
     * @param useCache
     */
    MarkSchemeStructureDataService.prototype.getMarkSchemeStructureDetails = function (callback, markSchemeGroupId, questionPaperId, useCache, examSessionId, isAwarding) {
        var that = this;
        if (useCache) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('markscheme', 'markschemestructure_' + questionPaperId, true, config.
                cacheconfig.THIRTY_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult) {
                that.getMarkSchemeStructureOnline(questionPaperId, markSchemeGroupId, callback, examSessionId, isAwarding);
            });
        }
        else {
            this.getMarkSchemeStructureOnline(questionPaperId, markSchemeGroupId, callback, examSessionId, isAwarding);
        }
    };
    /**
     * Call Api to get the data
     * @param {number} questionPaperId
     * @param callback?
     */
    MarkSchemeStructureDataService.prototype.getMarkSchemeStructureOnline = function (questionPaperId, markSchemeGroupId, callback, examSessionId, isAwarding) {
        if (examSessionId === void 0) { examSessionId = 0; }
        if (isAwarding === void 0) { isAwarding = false; }
        var url = urls.MARK_SCHEME_STRUCTURE_GET_URL + '/' + markSchemeGroupId + '/' + examSessionId + '/' + isAwarding;
        var getMarkSchemeStructurePromise = this.makeAJAXCall('GET', url);
        var that = this;
        getMarkSchemeStructurePromise.then(function (jsonData) {
            if (callback) {
                var resultData = that.parseJsonResult(jsonData);
                resultData = that.getImmutableMarkSchemeStructure(resultData);
                storageAdapterFactory.getInstance().storeData('markscheme', 'markschemestructure_' + questionPaperId, resultData, true).then().catch();
                callback(resultData.success, resultData, false);
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
    MarkSchemeStructureDataService.prototype.parseJsonResult = function (json) {
        var result;
        result = JSON.parse(json);
        return result;
    };
    /**
     * Get the mark scheme structure to the the immutable
     * @param markSchemeStructureData
     */
    MarkSchemeStructureDataService.prototype.getImmutableMarkSchemeStructure = function (markSchemeStructureData) {
        // Map each mark Scheme group details.
        for (var item in markSchemeStructureData.clusters) {
            // Added to resolve ts lint issue
            if (markSchemeStructureData.clusters.hasOwnProperty(item)) {
                markSchemeStructureData.clusters[item] = this.processCluster(markSchemeStructureData.clusters[item]);
            }
        }
        return markSchemeStructureData;
    };
    /**
     * Convert the cluster objects to the immutable
     * @param cluster
     */
    MarkSchemeStructureDataService.prototype.processCluster = function (_cluster) {
        var _this = this;
        if (_cluster.answerItems != null) {
            _cluster.answerItems = this.getImmutableList(_cluster.answerItems);
            _cluster.answerItems.forEach(function (answerItem) {
                var index = _cluster.answerItems.indexOf(answerItem);
                _cluster.answerItems[index] = _this.processAnswerItem(answerItem);
            });
        }
        if (_cluster.childClusters != null) {
            _cluster.childClusters = this.getImmutableList(_cluster.childClusters);
            _cluster.childClusters.forEach(function (childCluster) {
                var index = _cluster.childClusters.indexOf(childCluster);
                _cluster.childClusters[index] = _this.processCluster(childCluster);
            });
        }
        if (_cluster.parentCluster != null) {
            _cluster.parentCluster = this.processCluster(_cluster.parentCluster);
        }
        if (_cluster.markSchemes != null) {
            _cluster.markSchemes = this.getImmutableList(_cluster.markSchemes);
        }
        return _cluster;
    };
    /**
     * Convert the answer item objects to immutable
     * @param answerItem
     */
    MarkSchemeStructureDataService.prototype.processAnswerItem = function (_answerItem) {
        if (_answerItem.markSchemes !== undefined) {
            _answerItem.markSchemes = this.getImmutableList(_answerItem.markSchemes);
            return _answerItem;
        }
    };
    /**
     * Convert the item objects to immutable
     * @param item
     */
    MarkSchemeStructureDataService.prototype.processItem = function (_item) {
        if (_item.markSchemes !== undefined) {
            _item.markSchemes = this.getImmutableList(_item.markSchemes);
            return _item;
        }
    };
    /**
     * Get the object to immutable
     * @param list
     */
    MarkSchemeStructureDataService.prototype.getImmutableList = function (list) {
        return Immutable.List(list);
    };
    return MarkSchemeStructureDataService;
}(dataServiceBase));
var markSchemeStructureDataService = new MarkSchemeStructureDataService();
module.exports = markSchemeStructureDataService;
//# sourceMappingURL=markschemestructuredataservice.js.map