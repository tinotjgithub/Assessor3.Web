"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var TagDataService = (function (_super) {
    __extends(TagDataService, _super);
    function TagDataService() {
        _super.apply(this, arguments);
    }
    /**
     * initiate the tags API call and returns the tags along with callback.
     * @param callback
     */
    TagDataService.prototype.getTags = function (callback) {
        var url = urls.GET_TAG_DATA;
        var getTagsPromise = this.makeAJAXCall('GET', url);
        getTagsPromise.then(function (json) {
            var result;
            result = JSON.parse(json);
            callback(true, result);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    /**
     * ajax calls to Tag Update and delete
     * @param updateResponseTagArguments
     * @param callback
     */
    TagDataService.prototype.updateTags = function (updateResponseTagArguments, callback) {
        var url = urls.UPDATE_TAG_DATA;
        var updateResponseTagJSON = JSON.stringify(updateResponseTagArguments);
        var updateTagsPromise = this.makeAJAXCall('POST', url, updateResponseTagJSON, true, true);
        updateTagsPromise.then(function (data) {
            if (callback) {
                callback(true, JSON.parse(data));
            }
        }).catch(function (data) {
            if (callback) {
                callback(false, data);
            }
        });
    };
    return TagDataService;
}(dataServiceBase));
var tagDataService = new TagDataService();
module.exports = tagDataService;
//# sourceMappingURL=tagdataservice.js.map