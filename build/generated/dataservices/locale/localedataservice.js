"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var Promise = require('es6-promise');
var constants = require('../../components/utility/constants');
var LocaleDataService = (function (_super) {
    __extends(LocaleDataService, _super);
    function LocaleDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Call the locale data service and returns JSON object corresponding to the given locale.
     * @param locale - slected locale
     * @param awardingBody - name of the awarding body
     * @param callback - call back with success boolean and JSON object corresponding to locale.
     */
    LocaleDataService.prototype.getLocaleJSON = function (locale, awardingBody, callback) {
        /** The locale JSON file name should be in a format of awardingbody-locale.json.
         * Populating the url based on te awarding body and locale selected.
         */
        var jsonUrl = './Content/resources/' + awardingBody + '-' + locale + '.json';
        var fallBackUrl = './Content/resources/' + constants.FALLBACK_LOCALE + '.json';
        /**  Making AJAX call to get the locale JSON */
        var localePromise = this.makeAJAXCallWithFullUrl('GET', jsonUrl);
        var fallBackLocalePromise = this.makeAJAXCallWithFullUrl('GET', fallBackUrl);
        Promise.Promise.all([localePromise, fallBackLocalePromise])
            .then(function (results) {
            if (callback) {
                callback(true, results[0], results[1]);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, undefined, undefined);
            }
        });
    };
    return LocaleDataService;
}(dataServiceBase));
var localeDataService = new LocaleDataService();
module.exports = localeDataService;
//# sourceMappingURL=localedataservice.js.map