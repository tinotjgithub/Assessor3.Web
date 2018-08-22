"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var BackgroundPulseDataService = (function (_super) {
    __extends(BackgroundPulseDataService, _super);
    function BackgroundPulseDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Call the Background Pulse data service.
     * Updates the logged in pulse.
     * Returns number of notification.
     * @param args - data that has to be passed as a parameter to the background pulse argument.
     * @param callback - call back with success boolean and Background pulse info object.
     */
    BackgroundPulseDataService.prototype.handleBackgroundPulse = function (args, callback) {
        var url = urls.NOTIFICATION_URL;
        /**  Making AJAX call to update logged in pulse and get the the pending notifications */
        var backgroundPulsePromise = this.makeAJAXCall('POST', url, JSON.stringify(args));
        backgroundPulsePromise.then(function (data) {
            if (callback) {
                callback(true, JSON.parse(data));
            }
        }).catch(function (data) {
            if (callback) {
                callback(false, data);
            }
        });
    };
    return BackgroundPulseDataService;
}(dataServiceBase));
var backgroundPulseDataService = new BackgroundPulseDataService();
module.exports = backgroundPulseDataService;
//# sourceMappingURL=backgroundpulsedataservice.js.map