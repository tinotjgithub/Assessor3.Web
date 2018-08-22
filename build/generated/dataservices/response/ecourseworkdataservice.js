"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var ECourseworkDataService = (function (_super) {
    __extends(ECourseworkDataService, _super);
    function ECourseworkDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Method which makes the AJAX call to change the file read status of ecoursework file.
     * @param pageId
     * @param markSchemeGroupId
     * @param callback
     */
    ECourseworkDataService.prototype.changeFileReadStatus = function (fileReadStatusArgument, callback) {
        var url = urls.CHANGE_ECOURSE_WORK_FILE_READ_STATUS_URL;
        var that = this;
        var changeFileReadStatusPromise = this.makeAJAXCall('POST', url, JSON.stringify(fileReadStatusArgument));
        changeFileReadStatusPromise.then(function (json) {
            if (callback) {
                var resultData = JSON.parse(json);
                callback(true, resultData);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, undefined);
            }
        });
    };
    return ECourseworkDataService;
}(dataServiceBase));
var eCourseworkDataService = new ECourseworkDataService();
module.exports = eCourseworkDataService;
//# sourceMappingURL=ecourseworkdataservice.js.map