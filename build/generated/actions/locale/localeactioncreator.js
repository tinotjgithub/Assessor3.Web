"use strict";
var dispatcher = require('../../app/dispatcher');
var localeAction = require('./localeaction');
var localeDataService = require('../../dataservices/locale/localedataservice');
/**
 * Locale action creator helper class
 */
var LocaleActionCreator = (function () {
    function LocaleActionCreator() {
    }
    /**
     * Call the locale data  service and then generate a locale action.
     * @param locale - selected locale name
     * @param awardingBody - name of the awarding body
     */
    LocaleActionCreator.prototype.localeChange = function (locale, awardingBody) {
        /**
         * Splitting the locale to take the langauge code only.The locale conatin both language and country code,
         * the corresponding locale json name contain only language code.
         */
        var localeCode = locale.split('-')[0];
        localeDataService.getLocaleJSON(localeCode, awardingBody, function (success, json, fallBackJson) {
            dispatcher.dispatch(new localeAction(success, locale, json, fallBackJson));
        });
    };
    return LocaleActionCreator;
}());
var localeActionCreator = new LocaleActionCreator();
module.exports = localeActionCreator;
//# sourceMappingURL=localeactioncreator.js.map