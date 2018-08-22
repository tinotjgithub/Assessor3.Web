"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DataServiceBase = require('../base/dataservicebase');
var URLs = require('../base/urls');
var ApplicationDataService = (function (_super) {
    __extends(ApplicationDataService, _super);
    function ApplicationDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Ping server to check application has open network
     * @param {((success} callback
     * @param {function} json?
     */
    ApplicationDataService.prototype.ping = function (callback) {
        var pingPromise = this.makeAJAXCall('GET', URLs.PING_URL, '', false, false);
        pingPromise.then(function (json) {
            if (callback) {
                callback(true, json);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * To download modules
     * @param modules
     */
    ApplicationDataService.prototype.downloadModules = function (modules) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var jsonUrl = './build/generated/3.' + config.general.WEBPACK_HASH + '.bundle.js';
            for (var i = 0; i < modules.length; i++) {
                that.makeAJAXCallWithFullUrl('GET', jsonUrl);
            }
            resolve();
        });
    };
    return ApplicationDataService;
}(DataServiceBase));
var applicationDataService = new ApplicationDataService();
module.exports = applicationDataService;
//# sourceMappingURL=applicationdataservice.js.map