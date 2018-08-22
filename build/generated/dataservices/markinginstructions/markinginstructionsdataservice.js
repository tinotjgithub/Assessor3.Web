"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var Immutable = require('immutable');
var storageAdapterFactory = require('../storageadapters/storageadapterfactory');
/**
 * Class for Getting MarkingInstructions details
 */
var MarkingInstructionsDataService = (function (_super) {
    __extends(MarkingInstructionsDataService, _super);
    function MarkingInstructionsDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Converts markinginstructionreturn collection to an immutable list
     * @param data
     */
    MarkingInstructionsDataService.prototype.getImmutableMarkingInstructions = function (data) {
        return Immutable.List(data.markingInstructions);
    };
    /**
     * Call Api to get the MarkingInstructionsDetails
     * @param callback
     * @param markSchemeGroupId
     * @param markingInstructionCCValue
     */
    MarkingInstructionsDataService.prototype.getmarkinginstructions = function (callback, markSchemeGroupId, markingInstructionCCValue, useCache) {
        var that = this;
        if (useCache) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('markingInstruction', 'markingInstruction' + markSchemeGroupId, true, config.
                cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult) {
                that.getmarkinginstructionData(markSchemeGroupId, markingInstructionCCValue, callback);
            });
        }
        else {
            that.getmarkinginstructionData(markSchemeGroupId, markingInstructionCCValue, callback);
        }
    };
    /**
     * get marking instruction data
     *
     * @private
     * @param {number} markSchemeGroupId
     * @param {number} markingInstructionCCValue
     * @param {Function} callback
     * @memberof MarkingInstructionsDataService
     */
    MarkingInstructionsDataService.prototype.getmarkinginstructionData = function (markSchemeGroupId, markingInstructionCCValue, callback) {
        var that = this;
        var url = urls.MARKING_INSTRUCTIONS_DETAILS_GET_URL + '/' + markSchemeGroupId + '/' + markingInstructionCCValue;
        /** Makes AJAX call to get MarkingInstructionsDetails   */
        var getmarkingInstructionsPromise = that.makeAJAXCall('GET', url, '', false, false);
        getmarkingInstructionsPromise.then(function (data) {
            var markingInstructionsList = that.getImmutableMarkingInstructions(JSON.parse(data));
            if (callback) {
                storageAdapterFactory.getInstance().storeData('markingInstruction', 'markingInstruction' + markSchemeGroupId, markingInstructionsList, true)
                    .then(function () {
                    callback(true, markingInstructionsList);
                }).catch();
            }
        }).catch(function (data) {
            if (callback) {
                callback(false, data);
            }
        });
    };
    return MarkingInstructionsDataService;
}(dataServiceBase));
var markinginstructionDataservice = new MarkingInstructionsDataService();
module.exports = markinginstructionDataservice;
//# sourceMappingURL=markinginstructionsdataservice.js.map