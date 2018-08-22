declare let languageList: any;

/**
 * helper class with utilty methods for localisation of date, time and number
 */
class LocaleHelper {
    /**
     * returns the localised string based on the local time zone (machine's locale).
     * @param object - date/time/number to be localised.
     */
    public static toLocaleString(object: any) {
        if (object == null || object === undefined) {
            return '';
        }
        return object.toLocaleString();
    }

    /**
     * returns the localised date string based on the local time zone (machine's locale).
     * @param object - date to be localised.
     */
    public static toLocaleDateString(object: Date) {
        if (object == null || object === undefined) {
            return '';
        }
        return object.toLocaleDateString(navigator.language);
    }

    /**
     * returns the localised time string based on the local time zone (machine's locale).
     * @param object - time to be localised.
     */
    public static toLocaleTimeString(object: Date) {
        if (object == null || object === undefined) {
            return '';
        }

        // Remove seconds from time.
        return object.toLocaleTimeString(navigator.language);
    }

    /**
     * returns the localised date time string based on the local time zone (machine's locale).
     * @param object - Date and time to be localised.
     */
    public static toLocaleDateTimeString(object: Date) {
        if (object == null || object === undefined) {
            return '';
        }

        return object.toLocaleDateString(navigator.language) + ' ' +
               object.toLocaleTimeString(navigator.language);
    }

    /**
     * get the awarding body
     * @param locale
     */
    public static getAwardingBodyLocale(locale: string): string {

        //Checking wether browser language exist in languageJson
        let langExist: boolean;
        langExist = false;
        languageList.languages.language.map(function (lang: any) {
            if (lang.code === locale) {
                langExist = true;
            }
        });

        let awardingBody = languageList.languages['awarding-body'];
        if (!langExist) {
            // If the customer doesnt support the browser language select the default language
            locale = languageList.languages['default-culture'];
        }

        /**
         * Splitting the locale to take the langauge code only.The locale conatin both language and country code,
         * the corresponding locale json name contain only language code.
         */
        let localeCode = locale.split('-')[0];

        /**
         * The locale JSON file name should be in a format of awardingbody-locale.json.
         * Populating the url based on te awarding body and locale selected.
         */
        return awardingBody.toLowerCase() + '-' + localeCode;
    }
}

export = LocaleHelper;