"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var URLs = require('../base/urls');
/**
 * Familiarisation data service class
 */
var FamiliarisationDataService = (function (_super) {
    __extends(FamiliarisationDataService, _super);
    function FamiliarisationDataService() {
        _super.apply(this, arguments);
    }
    /**
     * setUp Familiarisation Data
     * @param callback
     */
    FamiliarisationDataService.prototype.setUpFamilarisationData = function (callback) {
        var url = URLs.CREATE_FAMILARISATION_DATA;
        // Making AJAX call for setting up the Familiarisation data
        var authenticationPromise = this.makeAJAXCall('POST', url);
        authenticationPromise.then(function (json) {
            if (callback) {
                callback(true, true);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, false, json);
            }
        });
    };
    return FamiliarisationDataService;
}(dataServiceBase));
var familiarisationDataService = new FamiliarisationDataService();
module.exports = familiarisationDataService;
//# sourceMappingURL=familiarisationdataservice.js.map