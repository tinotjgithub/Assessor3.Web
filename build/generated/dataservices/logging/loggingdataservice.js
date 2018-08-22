"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var LoggingDataService = (function (_super) {
    __extends(LoggingDataService, _super);
    function LoggingDataService() {
        _super.apply(this, arguments);
    }
    /**
     * save the error log
     * @param errorInfoArgument
     * @param callback
     * @param failureCallback
     */
    LoggingDataService.prototype.saveErrorLogg = function (errorInfoArgument, callback, failureCallback) {
        var url = urls.LOGGING_URL;
        /** Ajax call to get the frontend exception API . */
        var errorInfoJson = JSON.stringify(errorInfoArgument);
        var localePromise = this.makeAJAXCall('POST', url, errorInfoJson, false);
        localePromise.then(function (json) {
            if (callback) {
                callback(true);
            }
        }).catch(function (json) {
            if (failureCallback) {
                failureCallback(json);
            }
        });
    };
    return LoggingDataService;
}(dataServiceBase));
var loggingDataservice = new LoggingDataService();
module.exports = loggingDataservice;
//# sourceMappingURL=loggingdataservice.js.map