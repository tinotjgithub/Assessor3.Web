"use strict";
/**
 * helper class with utilty methods for localisation of date, time and number
 */
var LocaleHelper = (function () {
    function LocaleHelper() {
    }
    /**
     * returns the localised string based on the local time zone (machine's locale).
     * @param object - date/time/number to be localised.
     */
    LocaleHelper.toLocaleString = function (object) {
        if (object == null || object === undefined) {
            return '';
        }
        return object.toLocaleString();
    };
    /**
     * returns the localised date string based on the local time zone (machine's locale).
     * @param object - date to be localised.
     */
    LocaleHelper.toLocaleDateString = function (object) {
        if (object == null || object === undefined) {
            return '';
        }
        return object.toLocaleDateString(navigator.language);
    };
    /**
     * returns the localised time string based on the local time zone (machine's locale).
     * @param object - time to be localised.
     */
    LocaleHelper.toLocaleTimeString = function (object) {
        if (object == null || object === undefined) {
            return '';
        }
        // Remove seconds from time.
        return object.toLocaleTimeString(navigator.language);
    };
    /**
     * returns the localised date time string based on the local time zone (machine's locale).
     * @param object - Date and time to be localised.
     */
    LocaleHelper.toLocaleDateTimeString = function (object) {
        if (object == null || object === undefined) {
            return '';
        }
        return object.toLocaleDateString(navigator.language) + ' ' +
            object.toLocaleTimeString(navigator.language);
    };
    /**
     * get the awarding body
     * @param locale
     */
    LocaleHelper.getAwardingBodyLocale = function (locale) {
        //Checking wether browser language exist in languageJson
        var langExist;
        langExist = false;
        languageList.languages.language.map(function (lang) {
            if (lang.code === locale) {
                langExist = true;
            }
        });
        var awardingBody = languageList.languages['awarding-body'];
        if (!langExist) {
            // If the customer doesnt support the browser language select the default language
            locale = languageList.languages['default-culture'];
        }
        /**
         * Splitting the locale to take the langauge code only.The locale conatin both language and country code,
         * the corresponding locale json name contain only language code.
         */
        var localeCode = locale.split('-')[0];
        /**
         * The locale JSON file name should be in a format of awardingbody-locale.json.
         * Populating the url based on te awarding body and locale selected.
         */
        return awardingBody.toLowerCase() + '-' + localeCode;
    };
    return LocaleHelper;
}());
module.exports = LocaleHelper;
//# sourceMappingURL=localehelper.js.map